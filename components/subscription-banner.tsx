"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCard, X } from "lucide-react";

export function SubscriptionBanner() {
  const pathname = usePathname();
  const [hasSub, setHasSub] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setHasSub(null);
    async function check() {
      try {
        const res = await fetch("/api/subscription");
        if (res.ok) {
          const data = await res.json();
          setHasSub(data.active);
        }
      } catch {
        // ignore
      }
    }
    check();
  }, [pathname]);

  if (
    pathname === "/app/billing" ||
    hasSub === null ||
    hasSub === true ||
    dismissed
  ) {
    return null;
  }

  return (
    <div className="border-b bg-amber-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-900">
            <strong>No active plan.</strong> Choose a plan to start generating
            map posters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/app/billing">Choose a Plan</Link>
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="rounded p-1 text-amber-600 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
