import { NextRequest, NextResponse } from "next/server";
import { supabaseServer, generatePasskey } from "@/lib/supabase";
import crypto from "crypto";
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const hash = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  if (hash !== signature) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  const event = JSON.parse(raw);
  if (event.event === "charge.success") {
    const data = event.data; const reference = data.reference; const supabase = supabaseServer();
    const { data: payment } = await supabase.from("payments").select("*").eq("reference", reference).single();
    if (payment && payment.status !== "success") {
      const tier = payment.tier || "gold"; const passkey = generatePasskey(tier);
      await supabase.from("passkeys").insert({ full_name: data.metadata?.name || data.customer.email, email: data.customer.email, whatsapp: data.metadata?.whatsapp || "", tier: tier.toLowerCase(), track: payment.track || "Frontend Architecture", key: passkey, active: true, payment_ref: reference, amount: data.amount / 100, currency: data.currency });
      await supabase.from("payments").update({ status: "success", gateway_response: data }).eq("reference", reference);
    }
  }
  return NextResponse.json({ received: true });
}