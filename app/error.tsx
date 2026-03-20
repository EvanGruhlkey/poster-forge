"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="mb-6 h-16 w-16 text-destructive/60" />
      <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred. You can try again or head back to the app.
      </p>
      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={reset}>
          Try Again
        </Button>
        <Button asChild>
          <Link href="/app">Back to App</Link>
        </Button>
      </div>
    </div>
  );
}
