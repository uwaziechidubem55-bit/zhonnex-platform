import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const bucket = (form.get("bucket") as string) || "feed-assets";
    const track = (form.get("track") as string) || null;
    const tier = (form.get("tier") as string) || null;
    const author = (form.get("author") as string) || "Teacher";
    const code = (form.get("code") as string) || null;
    const text_content = (form.get("text") as string) || null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    const allowed = ["videos", "images", "voice-notes", "feed-assets", "submissions", "teacher-private"];
    if (!allowed.includes(bucket)) return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
    const ext = file.name.split(".").pop() || "bin";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const supabase = supabaseServer();
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    const publicUrl = data.publicUrl;
    let media_type: string = "file";
    if (file.type.startsWith("image/")) media_type = "image";
    else if (file.type.startsWith("video/")) media_type = "video";
    else if (file.type.startsWith("audio/")) media_type = "voice";
    if (["feed-assets", "videos", "images", "voice-notes"].includes(bucket)) {
      await supabase.from("feed_items").insert({ author, track, tier, code, text_content, media_url: publicUrl, media_type, media_bucket: bucket });
      await supabase.from("audit_log").insert({ actor: author, action: `UPLOAD ${media_type.toUpperCase()} to ${bucket}`, meta: { bucket, path, publicUrl, track, tier } });
    }
    return NextResponse.json({ ok: true, url: publicUrl, path, media_type, bucket });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}