import { createClient } from "@supabase/supabase-js";
export const supabaseBrowser = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export const supabaseServer = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
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