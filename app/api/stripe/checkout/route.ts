import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PLAN_PRICE_MAP } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  planSlug: z.enum(["basic", "pro", "pro_plus"]),
});

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const { planSlug } = parsed.data;
    const priceId = PLAN_PRICE_MAP[planSlug];
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured for this plan" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Fetch the price from Stripe to determine if it's recurring or one-time
    const price = await stripe.prices.retrieve(priceId);
    const isRecurring = price.type === "recurring";

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email || undefined,
      metadata: {
        user_id: user.id,
        plan_slug: planSlug,
      },
      line_items: [{ price: priceId, quantity: 1 }],
      mode: isRecurring ? "subscription" : "payment",
      success_url: `${appUrl}/app/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/app/billing?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
