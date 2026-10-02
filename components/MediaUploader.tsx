"use client";
import { useState } from "react";
type Props = { bucket: "videos" | "images" | "voice-notes" | "feed-assets" | "submissions"; track?: string; tier?: string; author?: string; onUploaded?: (url: string) => void; label?: string; accept?: string; };
export default function MediaUploader({ bucket, track, tier, author = "Teacher", onUploaded, label = "Upload", accept }: Props) {
  const [file, setFile] = useState<File | null>(null); const [uploading, setUploading] = useState(false); const [url, setUrl] = useState<string>("");
  const acceptMap: Record<string, string> = { videos: "video/*", images: "image/*", "voice-notes": "audio/*", "feed-assets": "image/*,video/*,audio/*", submissions: "video/*,image/*,audio/*" };
  const handle = async () => {
    if (!file) return alert("Choose a file first"); setUploading(true);
    const fd = new FormData(); fd.append("file", file); fd.append("bucket", bucket);
    if (track) fd.append("track", track); if (tier) fd.append("tier", tier); fd.append("author", author);
    const res = await fetch("/api/upload", { method: "POST", body: fd }); const data = await res.json(); setUploading(false);
    if (!res.ok) return alert(data.error || "Upload failed"); setUrl(data.url); onUploaded?.(data.url); alert(`Uploaded: ${data.url}`);
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-xs tracking-[0.16em] font-bold text-white/50">{label} → {bucket}</div>
      <input type="file" accept={accept || acceptMap[bucket]} onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-3 block w-full text-sm text-white/80 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-bold file:text-black" />
      {file && <div className="mt-2 text-xs text-white/60">{file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB</div>}
      <button onClick={handle} disabled={uploading || !file} className="mt-3 w-full rounded-xl bg-white text-black py-2.5 text-xs font-bold tracking-widest disabled:opacity-50">{uploading ? "Uploading to Supabase..." : `[ Upload to ${bucket} ]`}</button>
      {url && <div className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3"><div className="text-xs font-bold text-emerald-400">✓ Saved</div><a href={url} target="_blank" className="text-xs break-all underline text-white/80">{url}</a>{url.match(/\.(mp4|mov|webm)$/) && <video src={url} controls className="mt-2 w-full rounded-xl" />}{url.match(/\.(jpg|jpeg|png|gif|webp)$/) && <img src={url} alt="uploaded" className="mt-2 w-full rounded-xl" />}{url.match(/\.(mp3|wav|m4a|ogg)$/) && <audio src={url} controls className="mt-2 w-full" />}</div>}
    </div>
  );
}