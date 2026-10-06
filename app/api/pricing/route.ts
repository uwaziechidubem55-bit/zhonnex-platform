import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = supabaseServer();
      const { data } = await supabase.from("pricing_config").select("*").eq("id", 1).single();
      if (data) {
        return NextResponse.json({
          pricing: {
            NGN: { silver: data.silver_ngn, gold: data.gold_ngn, platinum: data.platinum_ngn, diamond: data.diamond_ngn },
            USD: { silver: data.silver_usd, gold: data.gold_usd, platinum: data.platinum_usd, diamond: data.diamond_usd },
          },
          nairaBrackets: data.naira_brackets,
          usdBrackets: data.usd_brackets,
          source: "supabase",
        });
      }
    }
    return NextResponse.json({ pricing: null, source: "fallback" });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  try {
    const { pricing, nairaBrackets, usdBrackets } = await req.json();
    if (!pricing) return NextResponse.json({ error: "Missing pricing" }, { status: 400 });
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = supabaseServer();
      const { error } = await supabase.from("pricing_config").upsert({
        id: 1, silver_ngn: pricing.silverNGN, gold_ngn: pricing.goldNGN, platinum_ngn: pricing.platinumNGN, diamond_ngn: pricing.diamondNGN,
        silver_usd: pricing.silverUSD, gold_usd: pricing.goldUSD, platinum_usd: pricing.platinumUSD, diamond_usd: pricing.diamondUSD,
        naira_brackets: nairaBrackets, usd_brackets: usdBrackets, updated_at: new Date().toISOString(),
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      await supabase.from("audit_log").insert({ actor: "Admin", action: "PRICING UPDATE via Financial Architect", meta: { pricing } });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}