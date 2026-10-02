"use client";
import { useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import MediaUploader from "@/components/MediaUploader";

export default function WorkspaceIDE() {
  const [sidebar, setSidebar] = useState(false);
  const [code, setCode] = useState(`// ZHONNEX Cloud Workspace — Dracula themed
// File: app/middleware.ts
export function checkTierAccess(passkey, requiredTier) {
  const order = ["silver","gold","platinum","diamond"];
  const userTier = passkey.split("-")[1]?.toLowerCase();
  return order.indexOf(userTier) >= order.indexOf(requiredTier);
}

// Example: share this block to student feed
export function GlassPanel({ children }) {
  return (
    <div className="glass rounded-2xl p-6">
      {children}
    </div>
  );
}
`);
  const [saved, setSaved] = useState(false);
  const [pushed, setPushed] = useState(false);
  const [lastMedia, setLastMedia] = useState<string>("");

  const save = () => {
    localStorage.setItem("zhonnex_teacher_code", code);
    fetch("/api/upload", {
      method: "POST",
      body: (() => {
        const fd = new FormData();
        fd.append("file", new Blob([code], { type: "text/plain" }), "middleware.tsx");
        fd.append("bucket", "teacher-private");
        fd.append("author", "Teacher");
        return fd;
      })(),
    }).catch(()=>{});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const push = async () => {
    const fd = new FormData();
    if (lastMedia) {
      fd.append("file", new Blob(["media already uploaded"], { type: "text/plain" }), "push.txt");
      fd.append("bucket", "feed-assets");
      fd.append("author", "Teacher • Frontend Architecture");
      fd.append("code", code);
      fd.append("text", `Code push + media: ${lastMedia}`);
      await fetch("/api/upload", { method: "POST", body: fd });
    } else {
      const feed = JSON.parse(localStorage.getItem("zhonnex_feed") || "[]");
      feed.push({ code, at: new Date().toISOString(), author: "Teacher • Frontend Architecture", media_url: "" });
      localStorage.setItem("zhonnex_feed", JSON.stringify(feed));
      const fd2 = new FormData();
      const blob = new Blob([code], { type: "text/plain" });
      fd2.append("file", blob, "snippet.txt");
      fd2.append("bucket", "feed-assets");
      fd2.append("author", "Teacher • Frontend Architecture");
      fd2.append("code", code);
      await fetch("/api/upload", { method: "POST", body: fd2 });
    }
    const audit = JSON.parse(localStorage.getItem("zhonnex_audit") || "[]");
    audit.unshift(`${new Date().toLocaleString()} — PUSH TO FEED — IDE snapshot injected into student stream + WhatsApp blast`);
    localStorage.setItem("zhonnex_audit", JSON.stringify(audit));
    setPushed(true);
    setTimeout(() => setPushed(false), 2500);
  };

  return (
    <div className="min-h-screen">
      <Header onMenu={() => setSidebar(true)} />
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <h1 className="text-2xl font-black">ZHONNEX Cloud Workspace (IDE)</h1>
        <p className="text-sm text-white/60">File tree • Autocomplete • Line counters • Dracula dark skin • Private staging vs Push to Feed + VIDEO/IMAGE/VOICE.</p>
        <div className="mt-6 grid lg:grid-cols-[260px_1fr_320px] gap-4">
          <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-4 h-fit">
            <div className="text-xs tracking-widest font-bold text-white/50">EXPLORER</div>
            <div className="mt-3 space-y-1 font-mono text-sm">
              <div className="text-white/60">📁 app/</div>
              <div className="pl-4 text-white">📄 middleware.tsx <span className="text-white/40">• active</span></div>
              <div className="pl-4 text-white/60">📄 layout.tsx</div>
              <div className="pl-4 text-white/60">📄 page.tsx</div>
              <div className="text-white/60 mt-2">📁 components/ui/</div>
              <div className="pl-4 text-white/60">📄 glass-panel.tsx</div>
              <div className="pl-4 text-white/60">📄 button-widget.tsx</div>
            </div>
            <div className="mt-6 rounded-xl bg-white text-black p-3 text-xs">
              <div className="font-bold">Private Staging</div>
              <div className="text-black/60">Save writes privately to Supabase teacher-private bucket, hidden from students until pushed.</div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="text-xs tracking-[0.16em] font-bold text-white/50">SEND MEDIA TO FEED</div>
              <MediaUploader bucket="videos" label="📹 Video" onUploaded={setLastMedia} />
              <MediaUploader bucket="images" label="🖼️ Image" onUploaded={setLastMedia} />
              <MediaUploader bucket="voice-notes" label="🎙️ Voice Note" onUploaded={setLastMedia} />
              {lastMedia && <div className="text-xs text-emerald-400 break-all">Last: {lastMedia}</div>}
            </div>
          </div>
          <div className="rounded-2xl bg-[#1E1E2E] border border-white/10 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-[#282A36] border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-3 h-3 rounded-full bg-red-500" /><span className="w-3 h-3 rounded-full bg-yellow-400" /><span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-white/70">middleware.tsx — Dracula</span>
              </div>
              <div className="text-[11px] text-white/50">Ln 12, Col 34 • UTF-8</div>
            </div>
            <textarea value={code} onChange={e => setCode(e.target.value)} className="flex-1 min-h-[420px] bg-[#282A36] text-[#F8F8F2] p-4 font-mono text-sm leading-relaxed outline-none resize-none" spellCheck={false} />
            <div className="flex gap-2 p-3 bg-[#21222C] border-t border-white/10">
              <button onClick={save} className="flex-1 rounded-xl bg-white/10 border border-white/10 text-white py-2.5 text-xs font-bold tracking-widest hover:bg-white/20">[ Save File to Cloud ] {saved && "✓ Saved to Supabase private"}</button>
              <button onClick={push} className="flex-1 rounded-xl bg-white text-black py-2.5 text-xs font-bold tracking-widest">[ Push to Student Feed ] {pushed && "✓ Pushed to Supabase + WhatsApp blast"}</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white text-black p-5">
              <div className="text-xs tracking-widest font-bold text-black/50">FEED PREVIEW</div>
              <div className="mt-3 rounded-xl bg-[#0A0A0D] text-white p-4 font-mono text-xs leading-relaxed border border-white/10 max-h-[220px] overflow-auto">
                <div className="text-white/50">Last pushed snapshot:</div>
                <pre className="mt-2 whitespace-pre-wrap">{code.slice(0, 420)}...</pre>
                {lastMedia && <div className="mt-2 text-emerald-400 break-all">+ Media: {lastMedia}</div>}
              </div>
              <div className="mt-3 text-xs text-black/60">Push now saves to Supabase <code>feed_items</code> + triggers WhatsApp group notification. Supports code + video + image + voice in one push.</div>
            </div>
            <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-5">
              <div className="text-xs tracking-widest font-bold text-white/50">AUTOCOMPLETE</div>
              <div className="mt-3 space-y-1 text-sm font-mono">
                <div className="text-white/80">▸ GlassPanel</div>
                <div className="text-white/80">▸ checkTierAccess</div>
                <div className="text-white/50">▸ middleware</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}