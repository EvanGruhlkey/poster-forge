"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Image,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import type { PosterJobOutput } from "@/lib/types";

interface JobStatusResponse {
  id: string;
  status: string;
  output: PosterJobOutput | null;
  error: string | null;
  downloadUrls: Record<string, string> | null;
}

export default function DownloadPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const triggerDownload = useCallback(
    (fileKey: string) => {
      const link = document.createElement("a");
      link.href = `/api/download/${jobId}/${fileKey}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [jobId]
  );

  useEffect(() => {
    if (!jobId) return;

    let interval: NodeJS.Timeout;

    async function fetchStatus() {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) return;
        const data: JobStatusResponse = await res.json();
        setJob(data);
        setLoading(false);

        if (data.status === "done" || data.status === "failed") {
          clearInterval(interval);
        }
      } catch {
        // retry
      }
    }

    fetchStatus();
    interval = setInterval(fetchStatus, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  const STATUS_UI = {
    queued: {
      icon: <Clock className="h-8 w-8 text-muted-foreground" />,
      title: "In Queue",
      desc: "Your poster is waiting to be generated...",
    },
    running: {
      icon: <Loader2 className="h-8 w-8 animate-spin text-primary" />,
      title: "Generating...",
      desc: "Your poster is being created. This may take a few minutes.",
    },
    done: {
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      title: "Download Your Poster",
      desc: "Your print-ready files are here!",
    },
    failed: {
      icon: <XCircle className="h-8 w-8 text-destructive" />,
      title: "Generation Failed",
      desc: "Something went wrong. Please try again.",
    },
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const status = (job?.status as keyof typeof STATUS_UI) || "queued";
  const ui = STATUS_UI[status];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <Link
          href="/app/library"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Library
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2">{ui.icon}</div>
            <CardTitle className="text-2xl">{ui.title}</CardTitle>
            <CardDescription>{ui.desc}</CardDescription>
          </CardHeader>
          <CardContent>
            {status === "done" && job?.output && (
              <div className="space-y-3">
                {Object.keys(job.output)
                  .filter((key) => key !== "preview")
                  .map((key) => {
                    const ext = key.includes("pdf") ? "pdf" : "png";
                    const label = key
                      .replace(/_/g, " ")
                      .replace("png ", "PNG ")
                      .replace("pdf", "PDF");
                    const Icon = ext === "pdf" ? FileText : Image;

                    return (
                      <button
                        key={key}
                        onClick={() => triggerDownload(key)}
                        className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                      >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">
                            {label}
                          </p>
                        </div>
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </button>
                    );
                  })}

                <Button
                  className="mt-4 w-full"
                  size="lg"
                  onClick={() => triggerDownload("pdf")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            )}

            {status === "failed" && (
              <div className="text-center">
                <p className="mb-4 text-sm text-destructive">{job?.error}</p>
                <Button asChild>
                  <Link href="/app">Try Again</Link>
                </Button>
              </div>
            )}

            {(status === "queued" || status === "running") && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 h-2 w-48 overflow-hidden rounded-full bg-muted">
                  <div className="h-full animate-pulse rounded-full bg-primary/60 w-1/2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {status === "queued"
                    ? "Waiting for available worker..."
                    : "Processing map data and rendering..."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
