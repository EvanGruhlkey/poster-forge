export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: sub } = await admin
      .from("subscriptions")
      .select("id, plan_slug, status, current_period_end, created_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!sub) {
      return NextResponse.json({ active: false, subscription: null });
    }

    // Check day pass expiry
    if (sub.plan_slug === "day_pass" && sub.current_period_end) {
      if (new Date(sub.current_period_end) < new Date()) {
        return NextResponse.json({
          active: false,
          subscription: { ...sub, status: "expired" },
          expired: true,
        });
      }
    }

    // Fetch plan details
    const { data: plan } = await admin
      .from("plans")
      .select("name, monthly_quota, day_pass_hours")
      .eq("slug", sub.plan_slug)
      .single();

    // Fetch current period usage
    let usage = 0;
    if (plan?.monthly_quota) {
      const periodStart = new Date();
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);

      const { count } = await admin
        .from("poster_jobs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "done")
        .eq("is_preview", false)
        .gte("created_at", periodStart.toISOString());

      usage = count || 0;
    }

    return NextResponse.json({
      active: true,
      subscription: sub,
      plan,
      usage,
      quota: plan?.monthly_quota || null,
    });
  } catch (err) {
    console.error("GET /api/subscription error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
