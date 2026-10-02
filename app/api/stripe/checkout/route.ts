import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  try {
    const { email, name, whatsapp, tier, track, amount } = await req.json();
    if (!email || !tier || !amount) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const reference = `ZHONNEX-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const supabase = supabaseServer();
    await supabase.from("payments").insert({ reference, email, amount, currency: "USD", tier, track, status: "pending", gateway: "stripe" });
    const amountCents = Math.round(Number(amount) * 100);
    if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as any });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], customer_email: email,
      line_items: [{ price_data: { currency: "usd", product_data: { name: `ZHONNEX ${tier.toUpperCase()} Pass - ${track}`, description: `Elite Academy ${tier} tier access` }, unit_amount: amountCents }, quantity: 1 }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/verify?session_id={CHECKOUT_SESSION_ID}&reference=${reference}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?pay=cancelled`,
      metadata: { reference, tier, track, name, whatsapp, email },
    });
    return NextResponse.json({ url: session.url, reference });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}