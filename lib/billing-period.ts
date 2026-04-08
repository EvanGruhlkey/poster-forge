/**
 * Quotas and usage rollups follow the Stripe subscription billing window
 * (current_period_start … current_period_end), not calendar months.
 *
 * For one-time / non-Stripe rows, the paid window starts at subscription `created_at`.
 */

export type BillingPeriodRow = {
  current_period_start: string | null;
  current_period_end: string | null;
  stripe_sub_id: string | null;
  created_at: string;
};

/** Bounds for analytics (`usage` table). */
export function usageStatsPeriodBounds(
  sub: BillingPeriodRow
): { start: Date; end: Date } {
  const end = sub.current_period_end
    ? new Date(sub.current_period_end)
    : new Date(sub.created_at);
  let start: Date;
  if (sub.current_period_start) {
    start = new Date(sub.current_period_start);
  } else if (!sub.stripe_sub_id) {
    start = new Date(sub.created_at);
  } else {
    // Should be rare (API backfills `current_period_start`). Approximate monthly window.
    start = new Date(end);
    start.setUTCMonth(start.getUTCMonth() - 1);
  }
  return { start, end };
}
