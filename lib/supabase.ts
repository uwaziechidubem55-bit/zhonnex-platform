// lib/supabase.ts — Server & Client Supabase helpers
// 🔒 PRIVATE MODE: Browser (anon key) = 0 ROWS. All reads/writes MUST go via /api/secure/query (service_role + God Mode)

import { createClient } from "@supabase/supabase-js";

export const supabaseBrowser = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export const supabaseServer = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

export async function secureFetch(table: string, action: "select" | "insert" | "update" | "delete" = "select", opts: { filters?: Record<string, any>; data?: any; id?: string; limit?: number } = {}) {
  const res = await fetch("/api/secure/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, action, ...opts }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Secure fetch failed");
  return json;
}

export function generatePasskey(tier: string) {
  const map: Record<string, string> = { silver: "ETA-SLVR", gold: "ETA-GOLD", platinum: "ETA-PLTM", diamond: "ETA-DMND" };
  const prefix = map[tier.toLowerCase()] || "ETA-GOLD";
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${rand()}-${rand()}-Lagos`;
}

export function getPublicUrl(bucket: string, path: string) {
  const supabase = supabaseBrowser();
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}