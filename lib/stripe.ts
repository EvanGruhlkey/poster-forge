import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover" as any,
  typescript: true,
});

export const PLAN_PRICE_MAP: Record<string, string> = {
  basic: process.env.STRIPE_PRICE_BASIC || "",
  pro: process.env.STRIPE_PRICE_PRO || "",
  pro_plus: process.env.STRIPE_PRICE_PRO_PLUS || "",
};
