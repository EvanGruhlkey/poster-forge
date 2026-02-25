import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createJobSchema } from "@/lib/validations";
import { computeConfigHash } from "@/lib/config-hash";

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
    const parsed = createJobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { config, is_preview } = parsed.data;
    const configHash = computeConfigHash(config);

    // Check for existing completed job with same config hash (dedup)
    if (!is_preview) {
      const admin = createAdminClient();
      const { data: existing } = await admin
        .from("poster_jobs")
        .select("id, output")
        .eq("config_hash", configHash)
        .eq("status", "done")
        .eq("is_preview", false)
        .limit(1)
        .single();

      if (existing?.output) {
        // Reuse existing outputs: create a poster record pointing to them
        await admin.from("posters").insert({
          user_id: user.id,
          job_id: existing.id,
          title: config.title || config.city,
          subtitle: config.subtitle || null,
          location_text: `${config.city}, ${config.country}`,
          config,
          config_hash: configHash,
          storage_paths: existing.output,
        });

        return NextResponse.json({
          jobId: existing.id,
          cached: true,
        });
      }
    }

    // Check usage/quota
    if (!is_preview) {
      const admin = createAdminClient();
      const { data: sub } = await admin
        .from("subscriptions")
        .select("plan_slug, status, current_period_end")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!sub) {
        return NextResponse.json(
          { error: "No active subscription. Please choose a plan." },
          { status: 403 }
        );
      }

      // Check day pass expiry
      if (sub.plan_slug === "day_pass" && sub.current_period_end) {
        if (new Date(sub.current_period_end) < new Date()) {
          return NextResponse.json(
            { error: "Day pass has expired." },
            { status: 403 }
          );
        }
      }

      // Check monthly quota
      if (sub.plan_slug !== "day_pass") {
        const { data: plan } = await admin
          .from("plans")
          .select("monthly_quota")
          .eq("slug", sub.plan_slug)
          .single();

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

          if ((count || 0) >= plan.monthly_quota) {
            return NextResponse.json(
              { error: "Monthly quota reached. Please upgrade your plan." },
              { status: 403 }
            );
          }
        }
      }
    }

    // Create job
    const { data: job, error } = await supabase
      .from("poster_jobs")
      .insert({
        user_id: user.id,
        status: "queued",
        input: config,
        config_hash: configHash,
        is_preview,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create job" },
        { status: 500 }
      );
    }

    return NextResponse.json({ jobId: job.id });
  } catch (err) {
    console.error("POST /api/jobs error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
