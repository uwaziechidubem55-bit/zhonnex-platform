"use client";
import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { useParams } from "next/navigation";

export default function StudentDashboard() {
  const params = useParams();
  const dashboardId = (params?.dashboard_id as string) || "1";
  const [sidebar, setSidebar] = useState(false);
  const [tab, setTab] = useState<"stream" | "stage" | "chat" | "assignments">("stream");
  const [tier, setTier] = useState<"silver" | "gold" | "platinum" | "diamond">("gold");
  const [feed, setFeed] = useState<any[]>([]);
  const [chat, setChat] = useState<any[]>([
    { user: "Teacher", text: "Welcome to Track " + dashboardId + " — Today we architect the glass panel." },
    { user: "Chioma (Diamond)", text: "The radial glow is subtle but premium 🔥" },
  ]);
  const [msg, setMsg] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [proof, setProof] = useState("");

  useEffect(() => {
    const key = localStorage.getItem("zhonnex_active_passkey") || "";
    if (key.includes("SLVR")) setTier("silver");
    else if (key.includes("GOLD")) setTier("gold");
    else if (key.includes("PLTM")) setTier("platinum");
    else if (key.includes("DMND")) setTier("diamond");
    setFeed(JSON.parse(localStorage.getItem("zhonnex_feed") || "[]"));
    setTasks(JSON.parse(localStorage.getItem("zhonnex_tasks") || "[]"));
  }, []);

  const canChat = tier !== "silver";
  const canStage = tier === "platinum" || tier === "diamond";

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    alert("✓ Copied!");
  };

  return (
    <div className="min-h-screen">
      <Header onMenu={() => setSidebar(true)} />
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black tracking-tight">Course Track {dashboardId} • Isolated Student Dashboard</h1>
            <p className="text-xs tracking-widest text-white/50 mt-1">TIER-ISOLATED MULTI-TENANT FIREWALL • <span className="text-white font-bold uppercase">{tier} PASS</span> • Row-Level Security enforced</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-white text-black font-bold tracking-widest">{tier.toUpperCase()}</span>
            <span className="px-3 py-1.5 rounded-full border border-white/10">ID: {dashboardId}</span>
            <select value={tier} onChange={e => setTier(e.target.value as any)} className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs">
              <option value="silver">Preview as Silver</option><option value="gold">Gold</option><option value="platinum">Platinum</option><option value="diamond">Diamond</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {[
            ["stream", "📡 Learning Stream"],
            ["stage", "🎙️ Live Lecture Stage"],
            ["chat", "💬 Community Chat"],
            ["assignments", "📝 Assignments"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as any)} className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest ${tab === id ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}>{label}</button>
          ))}
        </div>
        {tab === "stream" && (
          <div className="mt-6 space-y-4 max-w-3xl">
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-xs text-white/60">Immutable chronological channel • Materials pushed manually by teacher • HD wireframes • Secure assets • Interactive Copy Widget</div>
            <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 overflow-hidden">
              <div className="p-5">
                <div className="text-xs tracking-widest font-bold text-white/50">WIRE FRAME • HD SYSTEM ARCHITECTURE</div>
                <div className="mt-3 rounded-xl bg-white p-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-black text-white p-3 text-center text-xs font-bold">LMS<br /><span className="font-normal text-white/60">Elite Academy</span></div>
                    <div className="rounded-xl border-2 border-black p-3 text-center text-xs font-bold">EDGE MIDDLEWARE<br /><span className="font-normal text-black/60">RLS Firewall</span></div>
                    <div className="rounded-xl bg-black text-white p-3 text-center text-xs font-bold">Marketplace<br /><span className="font-normal text-white/60">Agency CRM</span></div>
                  </div>
                  <div className="mt-3 text-center text-xs text-black/50">Click to zoom • Lightbox modal</div>
                </div>
                <a href="#" onClick={e => { e.preventDefault(); alert("Lightbox zoom — HD wireframe modal"); }} className="mt-3 inline-block text-xs underline text-white/60">Open image zoom lightbox →</a>
              </div>
            </div>
            {feed.length === 0 ? (
              <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-6 text-center">
                <div className="text-sm font-bold">No feed items yet</div>
                <div className="text-sm text-white/60">Teacher pushes will appear here. Go to Teacher → Workspace IDE → [Push to Student Feed]</div>
              </div>
            ) : (
              feed.slice().reverse().map((item, i) => (
                <div key={i} className="rounded-2xl bg-[#0A0A0D] border border-white/10 overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/10 flex justify-between items-center">
                    <span className="text-xs font-bold tracking-widest text-white/50">PUSHED BY {item.author} • {new Date(item.at).toLocaleString()}</span>
                    <button onClick={() => copyCode(item.code)} className="rounded-full bg-white text-black px-3 py-1.5 text-xs font-bold">Copy Code</button>
                  </div>
                  <pre className="p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-black overflow-auto">{item.code}</pre>
                </div>
              ))
            )}
            <div className="rounded-2xl bg-white text-black p-5">
              <div className="text-xs tracking-widest font-bold text-black/50">SECURE DOWNLOADABLE ASSETS</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Design System Figma.fig", "API Contract Postman.json", "Brand Guidelines.pdf"].map(f => (
                  <a key={f} href="#" onClick={e => { e.preventDefault(); alert("Secure download — signed URL (mock)"); }} className="rounded-full bg-black text-white px-4 py-2 text-xs font-bold">{f} ↓</a>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === "stage" && (
          <div className="mt-6">
            <div className="mt-4 grid lg:grid-cols-[1.4fr_0.8fr] gap-4">
              <div className="rounded-2xl bg-black border border-white/10 overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video bg-[#0A0A0D] grid place-items-center border-r border-white/10 relative">
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto rounded-full bg-white/10 grid place-items-center">🎥</div>
                      <div className="mt-2 text-sm font-bold">Instructor Stream</div>
                      <div className="text-xs text-white/50"> pane A • Teacher camera</div>
                    </div>
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-red-500 text-white text-[11px] font-bold">● LIVE</span>
                  </div>
                  <div className="aspect-video bg-[#111114] p-4">
                    <div className="text-xs tracking-widest font-bold text-white/50">CLOUD IDE MIRROR • Pane B</div>
                    <pre className="mt-3 text-xs font-mono bg-black rounded-xl p-3 border border-white/10 overflow-auto max-h-[180px]">{`// Real-time mirror
function copySensitiveRedirect(key){
  navigator.clipboard.writeText(key);
  setTimeout(()=> redirect("/passkey"), 800);
}`}</pre>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-5">
                <div className="text-xs tracking-widest font-bold text-white/50">STAGE CONTROLS</div>
                {canStage ? (
                  <div className="mt-4">
                    <button onClick={() => alert("Hand raised — teacher queue notified")} className="w-full rounded-xl bg-white text-black py-3 text-sm font-bold tracking-widest">[ Raise Hand ] — WebRTC bridge</button>
                    <div className="mt-3 text-xs text-white/60">You are eligible (Platinum+) to be admitted to stage for bidirectional audio/video.</div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-white/60">Upgrade to Platinum to request stage access. Gold enjoys Q&A chat only.</div>
                )}
              </div>
            </div>
          </div>
        )}
        {tab === "chat" && (
          <div className="mt-6 max-w-3xl rounded-2xl bg-[#0A0A0D] border border-white/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex justify-between">
              <div className="text-sm font-bold">Community Chat Room — Tier Isolated</div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white text-black font-bold">{tier.toUpperCase()} ROOM</span>
            </div>
            <div className="p-5 space-y-3 max-h-[380px] overflow-auto">
              {chat.map((c, i) => (
                <div key={i} className="rounded-xl bg-white text-black px-4 py-3 text-sm"><b>{c.user}:</b> {c.text}</div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10">
              {!canChat ? (
                <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center text-sm text-white/50">🔒 Silver Pass Limit: Chat is in Read-Only mode. Upgrade to Gold to chat.</div>
              ) : (
                <div className="flex gap-2">
                  <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Message your tier peers..." className="flex-1 rounded-xl bg-white text-black px-4 py-3 text-sm outline-none" />
                  <button onClick={() => { if (msg) { setChat([...chat, { user: `You (${tier})`, text: msg }]); setMsg(""); } }} className="rounded-xl bg-white text-black px-6 font-bold text-sm">Send</button>
                </div>
              )}
            </div>
          </div>
        )}
        {tab === "assignments" && (
          <div className="mt-6 max-w-3xl space-y-4">
            {tasks.length === 0 ? <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-6 text-center text-white/60">No tasks deployed yet.</div> :
              tasks.map((t, i) => (
                <div key={i} className="rounded-2xl bg-white text-black p-6">
                  <div className="text-xs tracking-widest font-bold text-black/50">TASK SPECIFICATION</div>
                  <div className="mt-1 text-lg font-bold">{t.title}</div>
                  <div className="mt-2 text-sm text-black/60">{t.spec}</div>
                  <input value={proof} onChange={e => setProof(e.target.value)} placeholder="Paste MP4 proof link (or Loom / Drive)" className="mt-4 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none" />
                  <button onClick={() => {
                    if (!proof) return alert("Add proof link");
                    const next = [...tasks];
                    if (!next[i].submissions) next[i].submissions = [];
                    next[i].submissions.push({ student: "You", link: proof, log: "Submitted" });
                    localStorage.setItem("zhonnex_tasks", JSON.stringify(next));
                    setTasks(next);
                    setProof("");
                    alert("Proof uploaded — awaiting teacher review");
                  }} className="mt-3 rounded-xl bg-black text-white px-6 py-3 text-sm font-bold tracking-widest">SUBMIT MP4 PROOF →</button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}