import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
export async function POST(req: NextRequest) {
  try {
    const { email, name, whatsapp, tier, track, currency, amount } = await req.json();
    if (!email || !tier || !amount) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: "PAYSTACK_SECRET_KEY not set" }, { status: 500 });
    const paystackAmount = Math.round(Number(amount) * 100);
    const reference = `ZHONNEX-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const supabase = supabaseServer();
    await supabase.from("payments").insert({ reference, email, amount, currency, tier, track, status: "pending", gateway: "paystack" });
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount: paystackAmount, currency: currency || "NGN", reference, callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/verify?reference=${reference}`, metadata: { name, whatsapp, tier, track } }),
    });
    const data = await res.json();
    if (!data.status) return NextResponse.json({ error: data.message || "Paystack init failed", raw: data }, { status: 400 });
    return NextResponse.json({ authorization_url: data.data.authorization_url, reference });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}