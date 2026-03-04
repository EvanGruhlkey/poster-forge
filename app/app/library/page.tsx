export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { PosterCard } from "@/components/poster-card";
import { MapPin, Plus, Crown } from "lucide-react";
import type { Poster, PosterJob } from "@/lib/types";

export default async function LibraryPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan_slug")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const planSlug = sub?.plan_slug;

  if (!planSlug || planSlug === "basic") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Crown className="mx-auto mb-4 h-12 w-12 text-amber-500" />
        <h1 className="text-2xl font-bold mb-2">Poster Library</h1>
        <p className="text-muted-foreground mb-6">
          Save and revisit your poster designs anytime. The poster library is available on Pro and Pro+ plans.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/app">Create a Poster</Link>
          </Button>
          <Button asChild>
            <Link href="/app/billing">Upgrade to Pro</Link>
          </Button>
        </div>
      </div>
    );
  }

  const [postersResult, jobsResult] = await Promise.all([
    supabase
      .from("posters")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("poster_jobs")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["queued", "running"])
      .order("created_at", { ascending: false }),
  ]);

  const posters = (postersResult.data as Poster[]) || [];
  const activeJobs = (jobsResult.data as PosterJob[]) || [];

  // Generate signed preview URLs for each poster
  const postersWithPreviews = await Promise.all(
    posters.map(async (poster) => {
      const previewPath = poster.storage_paths?.preview;
      if (!previewPath) return poster;

      const { data } = await admin.storage
        .from("posters")
        .createSignedUrl(previewPath, 3600);

      return {
        ...poster,
        preview_url: data?.signedUrl || null,
      };
    })
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Library</h1>
          <p className="mt-1 text-muted-foreground">
            {posters.length} poster{posters.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Button asChild>
          <Link href="/app">
            <Plus className="mr-2 h-4 w-4" />
            New Poster
          </Link>
        </Button>
      </div>

      {activeJobs.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">In Progress</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {activeJobs.map((job) => (
              <PosterCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {postersWithPreviews.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {postersWithPreviews.map((poster) => (
            <PosterCard key={poster.id} poster={poster} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-20">
          <MapPin className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="mb-2 text-lg font-semibold">No posters yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create your first map poster to get started.
          </p>
          <Button asChild>
            <Link href="/app">Create Your First Poster</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
