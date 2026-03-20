import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createJobSchema } from "@/lib/validations";
import { computeConfigHash } from "@/lib/config-hash";
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

    const limited = applyRateLimit(user.id, "jobs", {
      windowMs: 60_000,
      max: 15,
    });
    if (limited) return limited;

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
    const admin = createAdminClient();

    // Check for existing completed job with same config hash (dedup)
    if (!is_preview) {
      const { data: existing } = await admin
        .from("poster_jobs")
        .select("id, output")
        .eq("config_hash", configHash)
        .eq("status", "done")
        .eq("is_preview", false)
        .limit(1)
        .single();

      if (existing?.output) {
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

    // Check subscription (must be active AND not expired)
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

    // Reject expired subscriptions
    if (
      sub.current_period_end &&
      new Date(sub.current_period_end) < new Date()
    ) {
      await admin
        .from("subscriptions")
        .update({ status: "expired" })
        .eq("user_id", user.id)
        .eq("status", "active")
        .lte("current_period_end", new Date().toISOString());

      return NextResponse.json(
        { error: "Your subscription has expired. Please renew." },
        { status: 403 }
      );
    }

    // Determine quota (null = unlimited for pro_plus)
    let quota: number | null = null;

    if (sub.plan_slug !== "pro_plus") {
      const { data: plan } = await admin
        .from("plans")
        .select("monthly_quota, monthly_download_quota")
        .eq("slug", sub.plan_slug)
        .single();

      quota = is_preview
        ? (plan?.monthly_quota ?? null)
        : (plan?.monthly_download_quota ?? null);
    }

    // Try atomic RPC first; fall back to inline check if the function
    // hasn't been deployed yet (migration 003 not applied).
    const { data: jobId, error: rpcError } = await admin.rpc(
      "create_job_with_quota_check",
      {
        p_user_id: user.id,
        p_input: config,
        p_config_hash: configHash,
        p_is_preview: is_preview,
        p_quota: quota,
      }
    );

    if (rpcError) {
      if (rpcError.message?.includes("QUOTA_EXCEEDED")) {
        const msg =
          rpcError.message.split("QUOTA_EXCEEDED:")[1] ||
          "Quota exceeded. Upgrade for more.";
        return NextResponse.json({ error: msg }, { status: 403 });
      }

      // RPC doesn't exist yet -- fall back to inline quota check
      if (
        rpcError.message?.includes("could not find") ||
        rpcError.code === "PGRST202"
      ) {
        console.warn(
          "create_job_with_quota_check RPC not found, using inline fallback"
        );
        return await inlineCreateJob(
          admin,
          supabase,
          user.id,
          config,
          configHash,
          is_preview,
          quota
        );
      }

      console.error("create_job_with_quota_check error:", rpcError);
      return NextResponse.json(
        { error: "Failed to create job" },
        { status: 500 }
      );
    }

    return NextResponse.json({ jobId });
  } catch (err) {
    console.error("POST /api/jobs error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/** Fallback when migration 003 hasn't been applied yet. */
async function inlineCreateJob(
  admin: ReturnType<typeof createAdminClient>,
  supabase: ReturnType<typeof createClient>,
  userId: string,
  config: Record<string, unknown>,
  configHash: string,
  isPreview: boolean,
  quota: number | null
) {
  if (quota !== null) {
    const periodStart = new Date();
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    const { count } = await admin
      .from("poster_jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_preview", isPreview)
      .in("status", ["queued", "running", "done"])
      .gte("created_at", periodStart.toISOString());

    if ((count || 0) >= quota) {
      const msg = isPreview
        ? "Monthly design limit reached. Upgrade for more."
        : "Monthly download limit reached. Upgrade for more.";
      return NextResponse.json({ error: msg }, { status: 403 });
    }
  }

  const { data: job, error } = await supabase
    .from("poster_jobs")
    .insert({
      user_id: userId,
      status: "queued",
      input: config,
      config_hash: configHash,
      is_preview: isPreview,
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
}
