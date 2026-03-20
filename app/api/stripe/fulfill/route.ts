export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { applyRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limited = applyRateLimit(user.id, "fulfill", { windowMs: 60_000, max: 10 });
    if (limited) return limited;

    const { sessionId } = await request.json();
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    if (session.metadata?.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const admin = createAdminClient();
    const planSlug = session.metadata?.plan_slug;

    if (!planSlug) {
      return NextResponse.json(
        { error: "Missing plan metadata" },
        { status: 400 }
      );
    }

    // Idempotency: skip if this checkout session was already fulfilled
    // (handles race between webhook and this endpoint)
    const { data: existingFromSession } = await admin
      .from("subscriptions")
      .select("id")
      .eq("stripe_checkout_session_id", sessionId)
      .limit(1)
      .single();

    if (existingFromSession) {
      return NextResponse.json({ status: "already_active" });
    }

    // Cancel old Stripe subscriptions and deactivate DB records
    const { data: oldSubs } = await admin
      .from("subscriptions")
      .select("stripe_sub_id")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (oldSubs) {
      for (const old of oldSubs) {
        if (old.stripe_sub_id) {
          try {
            await stripe.subscriptions.cancel(old.stripe_sub_id);
          } catch (e) {
            console.warn("Failed to cancel old Stripe subscription:", old.stripe_sub_id, e);
          }
        }
      }
    }

    await admin
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)
      .eq("status", "active");

    if (session.mode === "subscription" && session.subscription) {
      const subId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;

      const sub = await stripe.subscriptions.retrieve(subId);

      await admin.from("subscriptions").insert({
        user_id: user.id,
        plan_slug: planSlug,
        status: sub.status === "active" ? "active" : "inactive",
        current_period_end: new Date(
          sub.current_period_end * 1000
        ).toISOString(),
        stripe_checkout_session_id: sessionId,
        stripe_customer_id:
          typeof sub.customer === "string" ? sub.customer : sub.customer.id,
        stripe_sub_id: sub.id,
      });
    } else if (session.mode === "payment") {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await admin.from("subscriptions").insert({
        user_id: user.id,
        plan_slug: planSlug,
        status: "active",
        current_period_end: expiresAt.toISOString(),
        stripe_checkout_session_id: sessionId,
        stripe_customer_id:
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id || null,
      });
    }

    return NextResponse.json({ status: "activated" });
  } catch (err) {
    console.error("Stripe fulfill error:", err);
    return NextResponse.json(
      { error: "Failed to fulfill checkout" },
      { status: 500 }
    );
  }
}
