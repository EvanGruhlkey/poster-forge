import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

export type SubscriptionPeriodRow = {
  id: string;
  stripe_sub_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
};

/** ISO timestamp for `created_at >= period` quota queries and RPC. */
export async function resolveQuotaPeriodStartIso(
  admin: SupabaseClient,
  stripe: Stripe,
  sub: SubscriptionPeriodRow,
  cachedStripeSub?: Stripe.Subscription
): Promise<string> {
  if (sub.current_period_start) {
    return new Date(sub.current_period_start).toISOString();
  }
  if (!sub.stripe_sub_id) {
    return new Date(sub.created_at).toISOString();
  }

  try {
    const stripeSub =
      cachedStripeSub ??
      (await stripe.subscriptions.retrieve(sub.stripe_sub_id));
    const startIso = new Date(
      stripeSub.current_period_start * 1000
    ).toISOString();
    const endIso = new Date(stripeSub.current_period_end * 1000).toISOString();

    await admin
      .from("subscriptions")
      .update({
        current_period_start: startIso,
        current_period_end: endIso,
      })
      .eq("id", sub.id);

    return startIso;
  } catch {
    // Stripe mismatch / network / bad key — do not break subscription UI
    return new Date(sub.created_at).toISOString();
  }
}
