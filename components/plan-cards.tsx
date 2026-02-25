"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

const PLANS = [
  {
    slug: "day_pass",
    name: "Day Pass",
    price: "$19",
    period: "",
    description: "24 Hours Unlimited",
    features: [
      "Unlimited maps for 24 hours",
      "All 17 themes included",
      "High-res PDF & PNG downloads",
      "Multiple print sizes (8×10 to 24×36)",
    ],
    highlight: false,
  },
  {
    slug: "pro",
    name: "Pro Plan",
    price: "$29",
    period: "/month",
    description: "50 Maps Per Month",
    features: [
      "50 maps per month",
      "All 17 themes included",
      "High-res PDF & PNG downloads",
      "Multiple print sizes (8×10 to 24×36)",
      "Priority generation",
    ],
    highlight: true,
  },
  {
    slug: "business",
    name: "Business",
    price: "$49",
    period: "/month",
    description: "200 Maps Per Month",
    features: [
      "200 maps per month",
      "All 17 themes included",
      "High-res PDF & PNG downloads",
      "Multiple print sizes (8×10 to 24×36)",
      "Priority generation",
      "Commercial usage license",
    ],
    highlight: false,
  },
];

interface PlanCardsProps {
  isLoggedIn: boolean;
  currentPlanSlug?: string | null;
}

export function PlanCards({ isLoggedIn, currentPlanSlug }: PlanCardsProps) {
  const router = useRouter();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  async function handleCheckout(planSlug: string) {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/app/billing&plan=${planSlug}`);
      return;
    }

    setLoadingSlug(planSlug);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      toast.error(msg);
      setLoadingSlug(null);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {PLANS.map((plan) => {
        const isCurrent = currentPlanSlug === plan.slug;
        const isLoading = loadingSlug === plan.slug;

        return (
          <Card
            key={plan.slug}
            className={`flex flex-col ${
              plan.highlight
                ? "border-primary shadow-lg ring-1 ring-primary"
                : ""
            } ${isCurrent ? "ring-2 ring-green-500 border-green-500" : ""}`}
          >
            <CardHeader className="text-center">
              {isCurrent && (
                <div className="mx-auto mb-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  <CheckCircle className="h-3 w-3" />
                  Current Plan
                </div>
              )}
              {plan.highlight && !isCurrent && (
                <div className="mx-auto mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Zap className="h-3 w-3" />
                  Most Popular
                </div>
              )}
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isCurrent ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => handleCheckout(plan.slug)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isCurrent
                    ? "Current Plan"
                    : currentPlanSlug
                      ? "Switch Plan"
                      : "Get Started"}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
