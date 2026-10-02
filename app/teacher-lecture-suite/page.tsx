"use client";
import { useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Link from "next/link";

export default function TeacherSuite() {
  const [sidebar, setSidebar] = useState(false);
  const [mode, setMode] = useState<"lecture" | "qa" | "stage">("lecture");
  const [layout, setLayout] = useState<"split" | "mobile">("split");
  const [queue, setQueue] = useState([{ name: "Chioma A.", tier: "Diamond" }, { name: "David O.", tier: "Platinum" }]);
  const [chat, setChat] = useState([{ user: "Gold • Amara", text: "Can you explain the edge firewall middleware again?" }, { user: "Platinum • Tunde", text: "Will the Cloud IDE support Python next cohort?" }]);
  const [msg, setMsg] = useState("");

  return (
    <div className="min-h-screen">
      <Header onMenu={() => setSidebar(true)} />
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="flex flex-wrap justify-between gap-4 items-start">
          <div>
            <h1 className="text-2xl font-black">Teacher&apos;s Lecture Suite</h1>
            <p className="text-sm text-white/60">System B • Firewall: financial / passkey / client tables hidden from instructor.</p>
          </div>
          <Link href="/teacher-lecture-suite/workspace-ide" className="rounded-full bg-white text-black px-5 py-2.5 text-xs font-bold tracking-widest">OPEN CLOUD WORKSPACE IDE →</Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Frontend Architecture • Diamond", "Frontend Architecture • Gold", "Backend Systems • Platinum", "Design • Diamond"].map(c => (
            <button key={c} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold hover:bg-white hover:text-black transition">{c}</button>
          ))}
          <span className="px-3 py-2 text-xs text-white/40">Row-Level Security isolated per tier.</span>
        </div>
        <div className="mt-6 grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
          <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 overflow-hidden">
            <div className="flex flex-wrap gap-2 p-4 border-b border-white/10">
              <button onClick={() => setMode("lecture")} className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest ${mode === "lecture" ? "bg-white text-black" : "bg-white/10 text-white"}`}>LECTURE MODE (MUTE ALL)</button>
              <button onClick={() => setMode("qa")} className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest ${mode === "qa" ? "bg-white text-black" : "bg-white/10 text-white"}`}>INTERACTIVE Q&A MODE</button>
              <button onClick={() => setMode("stage")} className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest ${mode === "stage" ? "bg-white text-black" : "bg-white/10 text-white"}`}>BRING TO STAGE MODE</button>
              <div className="ml-auto flex items-center gap-2 text-xs">
                <span className="text-white/50">Layout:</span>
                <button onClick={() => setLayout("split")} className={`px-3 py-1.5 rounded-full font-bold ${layout === "split" ? "bg-white text-black" : "bg-white/10"}`}>Laptop Split</button>
                <button onClick={() => setLayout("mobile")} className={`px-3 py-1.5 rounded-full font-bold ${layout === "mobile" ? "bg-white text-black" : "bg-white/10"}`}>Mobile Fallback</button>
              </div>
            </div>
            <div className={`grid ${layout === "split" ? "md:grid-cols-2" : "grid-cols-1"} gap-0`}>
              <div className="aspect-[16/10] bg-black grid place-items-center border-r border-white/10 relative overflow-hidden">
                <div className="absolute inset-0" style={{ background: "radial-gradient(400px 300px at 50% 30%, rgba(255,255,255,0.08), transparent 70%)" }} />
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-white/10 grid place-items-center text-xl">🎥</div>
                  <div className="mt-3 text-sm font-bold">Teacher Camera Feed</div>
                  <div className="text-xs text-white/50">WebRTC • 1080p • Low latency</div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[11px]">
                  <span className="px-2 py-1 rounded-full bg-red-500 text-white font-bold">● LIVE</span>
                  <span className="px-2 py-1 rounded-full bg-white/10">Pane A</span>
                </div>
              </div>
              <div className="aspect-[16/10] bg-[#0F0F12] p-4 relative">
                <div className="text-xs tracking-widest font-bold text-white/50">CLOUD IDE MIRROR • Pane B</div>
                <pre className="mt-3 text-xs leading-relaxed font-mono bg-black rounded-xl p-4 border border-white/10 overflow-auto">{`// ZHONNEX Cloud Workspace — live mirror
export function middleware(req) {
  const tier = req.cookies.get("tier");
  if (!tier) return Response.redirect("/gate");
  // RLS: verify passkey matches tier
  return NextResponse.next();
}`}</pre>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[11px]">
                  <span className="px-2 py-1 rounded-full bg-white text-black font-bold">SYNCED</span>
                  <span className="text-white/40">{layout === "mobile" ? "Hidden on mobile fallback" : "Split-screen active"}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-white/10 text-xs">
              {mode === "lecture" && <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center text-white/60">🔒 Broadcaster Mode Active — Chat is muted by Supervisor. <span className="text-white font-bold">Microphones crushed at server layer.</span></div>}
              {mode === "qa" && (
                <div>
                  <div className="font-bold">Q&A Chat (Gold+)</div>
                  <div className="mt-3 space-y-2 max-h-[140px] overflow-auto">
                    {chat.map((c, i) => <div key={i} className="rounded-xl bg-white text-black px-3 py-2 text-sm"><b>{c.user}:</b> {c.text}</div>)}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Answer verbally or type..." className="flex-1 rounded-xl bg-white text-black px-4 py-2.5 text-sm outline-none" />
                    <button onClick={() => { if (msg) { setChat([...chat, { user: "You (Host)", text: msg }]); setMsg(""); } }} className="rounded-xl bg-white text-black px-5 font-bold text-xs tracking-widest">SEND</button>
                  </div>
                </div>
              )}
              {mode === "stage" && (
                <div>
                  <div className="font-bold">Bring to Stage Queue (Platinum+ Diamond)</div>
                  <div className="mt-3 space-y-2">
                    {queue.map((q, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl bg-white text-black px-4 py-3">
                        <div className="text-sm font-semibold">{q.name} • <span className="text-black/60">{q.tier}</span> — requested stage</div>
                        <button onClick={() => alert(`Admitted ${q.name} — WebRTC bridge opened`)} className="rounded-full bg-black text-white px-4 py-1.5 text-xs font-bold">[ Admit to Stage ]</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setQueue([...queue, { name: "New Student", tier: "Platinum" }])} className="mt-3 text-xs underline">+ Simulate raise hand</button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white text-black p-6">
              <div className="text-xs tracking-widest font-bold text-black/50">QUICK ACTIONS</div>
              <Link href="/teacher-lecture-suite/workspace-ide" className="mt-3 block w-full text-center rounded-xl bg-black text-white py-3 text-sm font-bold">[ Push to Student Feed ] Demo</Link>
              <Link href="/teacher-lecture-suite/assignments-auditor" className="mt-2 block w-full text-center rounded-xl border border-black/10 py-3 text-sm font-bold">Open Assignments Auditor →</Link>
              <div className="mt-4 text-xs text-black/60 leading-relaxed">Lecture Mode mutes all. Q&A opens Gold+ chat. Bring to Stage exposes WebRTC admit.</div>
            </div>
            <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-6">
              <div className="text-xs tracking-widest font-bold text-white/50">STREAM HEALTH</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/60">Bitrate</span><span className="font-mono">4,200 kbps</span></div>
                <div className="flex justify-between"><span className="text-white/60">Latency</span><span className="font-mono">68 ms</span></div>
                <div className="flex justify-between"><span className="text-white/60">Viewers (tier-isolated)</span><span className="font-mono">127</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}