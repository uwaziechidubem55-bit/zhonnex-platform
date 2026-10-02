import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer, generatePasskey } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const reference = req.nextUrl.searchParams.get("reference");
  if (!sessionId || !reference) return NextResponse.json({ error: "Missing session_id or reference" }, { status: 400 });
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" as any });
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const supabase = supabaseServer();
    if (session.payment_status !== "paid") {
      await supabase.from("payments").update({ status: "failed", gateway_response: session }).eq("reference", reference);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?pay=failed`);
    }
    const { data: payment } = await supabase.from("payments").select("*").eq("reference", reference).single();
    if (payment?.status === "success") {
      const existing = await supabase.from("passkeys").select("key").eq("payment_ref", reference).single();
      if (existing.data) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?pay=success&key=${existing.data.key}&tier=${payment.tier}`);
    }
    const tier = payment?.tier || (session.metadata?.tier as string) || "gold";
    const track = payment?.track || (session.metadata?.track as string) || "Frontend Architecture";
    const email = payment?.email || session.customer_email || "";
    const name = session.metadata?.name || "Student";
    const whatsapp = session.metadata?.whatsapp || "";
    const passkey = generatePasskey(tier);
    const { data: inserted } = await supabase.from("passkeys").insert({ full_name: name, email, whatsapp, tier: tier.toLowerCase(), track, key: passkey, active: true, payment_ref: reference, amount: payment?.amount || (session.amount_total ? session.amount_total / 100 : 0), currency: "USD" }).select().single();
    await supabase.from("payments").update({ status: "success", gateway_response: session, passkey_id: inserted?.id }).eq("reference", reference);
    await supabase.from("audit_log").insert({ actor: email, action: `STRIPE PAYMENT SUCCESS — ${tier} — ${passkey}`, meta: { reference } });
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?pay=success&key=${passkey}&tier=${tier}`);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}