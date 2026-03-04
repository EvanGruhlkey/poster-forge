"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PlanCards } from "@/components/plan-cards";
import { toast } from "sonner";

function PricingContent() {
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") === "cancelled") {
      toast.info("Checkout was cancelled. You can try again anytime.");
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/subscription");
        if (res.ok) {
          setIsLoggedIn(true);
        }
      } catch {
        // not logged in
      }
    }
    checkAuth();
  }, [searchParams]);

  return <PlanCards isLoggedIn={isLoggedIn} currentPlanSlug={null} />;
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold">Pricing Plans</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Choose the plan that&apos;s right for you.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Loading plans...</div>}>
            <PricingContent />
          </Suspense>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Cancel anytime. No contracts. Map data &copy; OpenStreetMap contributors.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
