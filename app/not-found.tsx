import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <MapPin className="mb-6 h-16 w-16 text-muted-foreground/30" />
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        This page doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
        <Button asChild>
          <Link href="/app">Create a Poster</Link>
        </Button>
      </div>
    </div>
  );
}
