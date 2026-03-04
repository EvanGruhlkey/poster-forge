import Link from "next/link";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
          >
            <MapPin className="h-4 w-4" />
            Poster Armory
          </Link>
          <p className="text-xs text-muted-foreground">
            Map data &copy; OpenStreetMap contributors
          </p>
          <div className="flex gap-4">
            <Link
              href="/pricing"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
