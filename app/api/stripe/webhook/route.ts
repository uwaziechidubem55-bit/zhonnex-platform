import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer, generatePasskey } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not set" }, { status: 500 });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as any });
  const sig = req.headers.get("stripe-signature") || ""; const raw = await req.text();
  let event; try { event = stripe.webhooks.constructEvent(raw, sig, secret); } catch (err: any) { return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object; const reference = session.metadata?.reference;
    if (reference) {
      const supabase = supabaseServer();
      const { data: payment } = await supabase.from("payments").select("*").eq("reference", reference).single();
      if (payment && payment.status !== "success") {
        const tier = payment.tier || session.metadata.tier || "gold"; const passkey = generatePasskey(tier);
        await supabase.from("passkeys").insert({ full_name: session.metadata.name || session.customer_email, email: session.customer_email, whatsapp: session.metadata.whatsapp || "", tier: tier.toLowerCase(), track: payment.track || session.metadata.track || "Frontend Architecture", key: passkey, active: true, payment_ref: reference, amount: session.amount_total ? session.amount_total / 100 : payment.amount, currency: "USD" });
        await supabase.from("payments").update({ status: "success", gateway_response: session }).eq("reference", reference);
      }
    }
  }
  return NextResponse.json({ received: true });
}