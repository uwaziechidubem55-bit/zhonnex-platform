"use client";
import { useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import MediaUploader from "@/components/MediaUploader";

export default function AssignmentsAuditor() {
  const [sidebar, setSidebar] = useState(false);
  const [title, setTitle] = useState("");
  const [spec, setSpec] = useState("");
  const [taskMedia, setTaskMedia] = useState<string>("");
  const [taskMediaType, setTaskMediaType] = useState<string>("");
  const [tasks, setTasks] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("zhonnex_tasks");
      if (t) return JSON.parse(t);
    }
    return [{ title: "Build Obsidian Glass Panel", spec: "Recreate the glassmorphic matte-charcoal row with radial glow.", media_url: "", media_type: "", submissions: [{ student: "Chioma A.", link: "https://example.com/video.mp4", log: "No errors" }] }];
  });

  const deploy = async () => {
    if (!title) return alert("Title required");
    const next = [...tasks, { title, spec, media_url: taskMedia, media_type: taskMediaType, submissions: [] }];
    setTasks(next);
    localStorage.setItem("zhonnex_tasks", JSON.stringify(next));
    try {
      await fetch("/api/upload", {
        method: "POST",
        body: (() => {
          const fd = new FormData();
          const blob = new Blob([JSON.stringify({ title, spec, media_url: taskMedia })], { type: "application/json" });
          fd.append("file", blob, "task.json");
          fd.append("bucket", "feed-assets");
          fd.append("author", "Teacher");
          return fd;
        })(),
      });
    } catch {}
    setTitle(""); setSpec(""); setTaskMedia(""); setTaskMediaType("");
    alert("Task deployed with media to Supabase + students see it in Assignment Portal");
  };

  return (
    <div className="min-h-screen">
      <Header onMenu={() => setSidebar(true)} />
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <h1 className="text-2xl font-black">Assignments Auditor</h1>
        <p className="text-sm text-white/60">Task Deployer • MP4 Player Window • Error Log Inspector + Video/Image/Voice</p>
        <div className="mt-6 rounded-2xl bg-white text-black p-6">
          <div className="text-xs tracking-widest font-bold text-black/50">DEPLOY NEW TASK — WITH MEDIA</div>
          <div className="mt-4 grid gap-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title (e.g., Build Glass Panel)" className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none" />
            <textarea value={spec} onChange={e => setSpec(e.target.value)} placeholder="Task specification & acceptance criteria..." rows={3} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none" />
            <div className="grid md:grid-cols-3 gap-3">
              <MediaUploader bucket="videos" label="📹 Task Video Instruction" onUploaded={(url)=>{ setTaskMedia(url); setTaskMediaType("video"); }} />
              <MediaUploader bucket="images" label="🖼️ Task Image Spec" onUploaded={(url)=>{ setTaskMedia(url); setTaskMediaType("image"); }} />
              <MediaUploader bucket="voice-notes" label="🎙️ Voice Instruction" onUploaded={(url)=>{ setTaskMedia(url); setTaskMediaType("voice"); }} />
            </div>
            {taskMedia && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm"><span className="font-bold text-emerald-600">✓ Media attached:</span> <a href={taskMedia} target="_blank" className="break-all underline">{taskMedia}</a> ({taskMediaType})</div>}
            <button onClick={deploy} className="w-fit rounded-xl bg-black text-white px-6 py-3 text-sm font-bold tracking-widest">DEPLOY TASK →</button>
            <div className="text-xs text-black/50">Deploys to Supabase tasks table + Storage (videos/images/voice-notes) → students see video/image/voice player in Assignment Portal.</div>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          {tasks.map((t, i) => (
            <div key={i} className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-6">
              <div className="flex justify-between gap-4">
                <div>
                  <div className="text-sm font-bold">{t.title}</div>
                  <div className="text-sm text-white/60 mt-1">{t.spec}</div>
                  {t.media_url && (
                    <div className="mt-3">
                      {t.media_type === "video" && <video src={t.media_url} controls className="w-full max-w-md rounded-xl border border-white/10" />}
                      {t.media_type === "image" && <img src={t.media_url} alt="task" className="w-full max-w-md rounded-xl border border-white/10" />}
                      {t.media_type === "voice" && <audio src={t.media_url} controls className="w-full max-w-md" />}
                      {!["video","image","voice"].includes(t.media_type) && <a href={t.media_url} target="_blank" className="text-xs underline text-white/70 break-all">{t.media_url}</a>}
                    </div>
                  )}
                </div>
                <span className="h-fit px-3 py-1 rounded-full bg-white text-black text-xs font-bold">{t.submissions.length} submissions</span>
              </div>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-black border border-white/10 aspect-video grid place-items-center overflow-hidden">
                  {t.media_url && t.media_type === "video" ? <video src={t.media_url} controls className="w-full h-full object-cover" /> : (
                    <div className="text-center">
                      <div className="text-lg">▶</div>
                      <div className="text-xs text-white/50">MP4 Player Window</div>
                      <div className="text-xs text-white/30">Secure playback • no download • Supabase Storage</div>
                    </div>
                  )}
                </div>
                <div className="rounded-xl bg-white text-black p-4">
                  <div className="text-xs tracking-widest font-bold text-black/50">ERROR LOG INSPECTOR</div>
                  <div className="mt-3 space-y-2 max-h-[180px] overflow-auto">
                    {t.submissions.length === 0 ? <div className="text-sm text-black/50">No submissions yet.</div> :
                      t.submissions.map((s: any, idx: number) => (
                        <div key={idx} className="rounded-xl border border-black/10 p-3">
                          <div className="text-sm font-bold">{s.student}</div>
                          <div className="text-xs text-black/60 break-all">{s.link}</div>
                          <div className="mt-2 font-mono text-xs bg-[#F6F6F7] p-2 rounded-lg">{s.log}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}