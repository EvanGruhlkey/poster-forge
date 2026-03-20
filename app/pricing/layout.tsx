import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Poster Armory. Choose the plan that fits your needs and start creating custom map art posters.",
  openGraph: {
    title: "Pricing | Poster Armory",
    description:
      "Simple, transparent pricing for custom map art posters. Start free, upgrade anytime.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
