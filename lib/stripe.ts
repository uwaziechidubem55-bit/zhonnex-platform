import Stripe from "stripe";
export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null as any;
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as any });
};
export const stripe = {
  get checkout() { return getStripe().checkout; },
  get webhooks() { return getStripe().webhooks; },
} as unknown as Stripe;