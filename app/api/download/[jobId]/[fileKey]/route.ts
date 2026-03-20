export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PosterJobOutput } from "@/lib/types";
import { getPlanTier, isFormatAllowed } from "@/lib/plan-config";
import { applyRateLimit } from "@/lib/rate-limit";

export async function GET(
  _request: Request,
  { params }: { params: { jobId: string; fileKey: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limited = applyRateLimit(user.id, "download", { windowMs: 60_000, max: 30 });
    if (limited) return limited;

    const admin = createAdminClient();

    const { data: sub } = await admin
      .from("subscriptions")
      .select("plan_slug, current_period_end")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const isExpired =
      sub?.current_period_end &&
      new Date(sub.current_period_end) < new Date();
    const planTier = getPlanTier(isExpired ? null : sub?.plan_slug);

    if (!isFormatAllowed(planTier, params.fileKey)) {
      return NextResponse.json(
        { error: "Your plan does not include this file format. Please upgrade." },
        { status: 403 }
      );
    }

    // Resolve job: user may own the job or have a poster record (cached dedup)
    const { data: job, error: jobError } = await admin
      .from("poster_jobs")
      .select("id, user_id, status, output")
      .eq("id", params.jobId)
      .single();

    if (jobError || !job || job.status !== "done" || !job.output) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isOwner = job.user_id === user.id;
    const { data: posterLink } = await admin
      .from("posters")
      .select("id")
      .eq("user_id", user.id)
      .eq("job_id", params.jobId)
      .limit(1)
      .single();

    if (!isOwner && !posterLink) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const output = job.output as PosterJobOutput;
    const storagePath = output[params.fileKey as keyof PosterJobOutput];

    if (!storagePath || typeof storagePath !== "string") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const { data } = await admin.storage
      .from("posters")
      .createSignedUrl(storagePath, 60);

    if (!data?.signedUrl) {
      return NextResponse.json(
        { error: "Failed to generate download URL" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(data.signedUrl);
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
