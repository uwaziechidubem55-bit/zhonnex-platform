import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
export const dynamic = "force-dynamic";

const GOD_MODE_KEY = process.env.ADMIN_SECRET || "ZHX-OMNI-MASTER-2025";
const ALLOWED_TABLES = ["passkeys","payments","feed_items","teacher_assets","leads","tasks","submissions","audit_log","pricing_config"] as const;
type AllowedTable = typeof ALLOWED_TABLES[number];

function isGod(req: NextRequest): boolean {
  const cookieGod = req.cookies.get("zhonnex_god_mode")?.value;
  const cookiePass = req.cookies.get("zhonnex_passkey")?.value;
  const headerSecret = req.headers.get("x-admin-secret");
  const authBearer = req.headers.get("authorization")?.replace("Bearer ","");
  return cookieGod === GOD_MODE_KEY || cookiePass === GOD_MODE_KEY || headerSecret === GOD_MODE_KEY || authBearer === GOD_MODE_KEY;
}

export async function POST(req: NextRequest) {
  if (!isGod(req)) {
    return NextResponse.json({ error: "Unauthorized — God Mode only. Hacker blocked." }, { status: 401 });
  }
  try {
    const { table, action = "select", filters, data, id, limit = 100 } = await req.json();
    if (!table || !ALLOWED_TABLES.includes(table as AllowedTable)) {
      return NextResponse.json({ error: `Invalid table. Allowed: ${ALLOWED_TABLES.join(", ")}` }, { status: 400 });
    }
    const supabase = supabaseServer();
    if (action === "select") {
      let q = supabase.from(table).select("*").limit(limit);
      if (filters && typeof filters === "object") {
        for (const [k, v] of Object.entries(filters)) q = q.eq(k, v as any);
      }
      if (id) q = q.eq("id", id);
      const { data: rows, error } = await q.order("created_at", { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, rows, secure: true });
    }
    if (action === "insert") {
      if (!data) return NextResponse.json({ error: "Missing data" }, { status: 400 });
      const { data: rows, error } = await supabase.from(table).insert(data).select();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      await supabase.from("audit_log").insert({ actor: "GodMode-API", action: `INSERT ${table}`, meta: { table, data } });
      return NextResponse.json({ ok: true, rows });
    }
    if (action === "update") {
      if (!id || !data) return NextResponse.json({ error: "Need id + data" }, { status: 400 });
      const { data: rows, error } = await supabase.from(table).update(data).eq("id", id).select();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      await supabase.from("audit_log").insert({ actor: "GodMode-API", action: `UPDATE ${table} ${id}`, meta: { table, id, data } });
      return NextResponse.json({ ok: true, rows });
    }
    if (action === "delete") {
      if (!id) return NextResponse.json({ error: "Need id" }, { status: 400 });
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      await supabase.from("audit_log").insert({ actor: "GodMode-API", action: `DELETE ${table} ${id}`, meta: { table, id } });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!isGod(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, message: "Secure API online — God Mode verified", tables: ALLOWED_TABLES });
}