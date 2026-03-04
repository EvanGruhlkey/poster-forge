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

    // Fetch plan details
    const { data: plan } = await admin
      .from("plans")
      .select("name, monthly_quota, monthly_download_quota")
      .eq("slug", sub.plan_slug)
      .single();

    // Fetch current period usage
    let designUsage = 0;
    let downloadUsage = 0;
    const periodStart = new Date();
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    const [designCount, downloadCount] = await Promise.all([
      admin
        .from("poster_jobs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "done")
        .gte("created_at", periodStart.toISOString()),
      admin
        .from("poster_jobs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "done")
        .eq("is_preview", false)
        .gte("created_at", periodStart.toISOString()),
    ]);

    designUsage = designCount.count || 0;
    downloadUsage = downloadCount.count || 0;

    return NextResponse.json({
      active: true,
      subscription: sub,
      plan,
      designUsage,
      downloadUsage,
      designQuota: plan?.monthly_quota || null,
      downloadQuota: plan?.monthly_download_quota || null,
    });
  } catch (err) {
    console.error("GET /api/subscription error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
