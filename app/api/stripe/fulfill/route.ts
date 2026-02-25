export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Verify this session belongs to this user
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

    // Check if this exact session was already fulfilled (idempotent)
    const { data: existingFromSession } = await admin
      .from("subscriptions")
      .select("id, plan_slug")
      .eq("user_id", user.id)
      .eq("plan_slug", planSlug)
      .eq("status", "active")
      .limit(1)
      .single();

    if (existingFromSession) {
      return NextResponse.json({ status: "already_active" });
    }

    // Deactivate any previous active subscriptions (handles plan switching)
    await admin
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)
      .eq("status", "active");

    // Provision the new subscription
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
        stripe_customer_id:
          typeof sub.customer === "string" ? sub.customer : sub.customer.id,
        stripe_sub_id: sub.id,
      });
    } else if (session.mode === "payment") {
      // Day pass: 24h expiry
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await admin.from("subscriptions").insert({
        user_id: user.id,
        plan_slug: planSlug,
        status: "active",
        current_period_end: expiresAt.toISOString(),
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
