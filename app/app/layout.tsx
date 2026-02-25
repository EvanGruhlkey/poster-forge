export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { SubscriptionBanner } from "@/components/subscription-banner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense>
        <SubscriptionBanner />
      </Suspense>
      <main className="flex-1">{children}</main>
    </div>
  );
}
