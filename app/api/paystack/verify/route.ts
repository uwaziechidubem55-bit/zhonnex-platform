import { NextRequest, NextResponse } from "next/server";
import { supabaseServer, generatePasskey } from "@/lib/supabase";
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  if (!reference) return NextResponse.json({ error: "No reference" }, { status: 400 });
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, { headers: { Authorization: `Bearer ${secret}` } });
  const verifyData = await verifyRes.json();
  const supabase = supabaseServer();
  if (!verifyData.status || verifyData.data.status !== "success") {
    await supabase.from("payments").update({ status: "failed", gateway_response: verifyData }).eq("reference", reference);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?pay=failed&ref=${reference}`);
  }
  const { data: payment } = await supabase.from("payments").select("*").eq("reference", reference).single();
  const tier = payment?.tier || verifyData.data.metadata?.tier || "gold";
  const passkey = generatePasskey(tier);
  const email = payment?.email || verifyData.data.customer.email;
  const track = payment?.track || verifyData.data.metadata?.track || "Frontend Architecture";
  const name = verifyData.data.metadata?.name || "Student";
  const whatsapp = verifyData.data.metadata?.whatsapp || "";
  const { data: inserted } = await supabase.from("passkeys").insert({ full_name: name, email, whatsapp, tier: tier.toLowerCase(), track, key: passkey, active: true, payment_ref: reference, amount: payment?.amount || verifyData.data.amount / 100, currency: payment?.currency || verifyData.data.currency }).select().single();
  await supabase.from("payments").update({ status: "success", gateway_response: verifyData, passkey_id: inserted?.id }).eq("reference", reference);
  await supabase.from("audit_log").insert({ actor: email, action: `PAYMENT SUCCESS — ${tier} — ${passkey}`, meta: { reference, amount: payment?.amount } });
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?pay=success&key=${passkey}&tier=${tier}`);
}
export async function POST(req: NextRequest) {
  const { reference } = await req.json();
  const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/verify`);
  url.searchParams.set("reference", reference);
  await fetch(url.toString());
  return NextResponse.json({ ok: true });
}