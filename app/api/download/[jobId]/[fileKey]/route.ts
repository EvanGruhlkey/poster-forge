export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PosterJobOutput } from "@/lib/types";

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

    const { data: job, error } = await supabase
      .from("poster_jobs")
      .select("*")
      .eq("id", params.jobId)
      .eq("user_id", user.id)
      .single();

    if (error || !job || job.status !== "done" || !job.output) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const output = job.output as PosterJobOutput;
    const storagePath = output[params.fileKey];

    if (!storagePath || typeof storagePath !== "string") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const admin = createAdminClient();
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
