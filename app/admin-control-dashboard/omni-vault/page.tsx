"use client";
import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Link from "next/link";

export default function OmniVault() {
  const [sidebar, setSidebar] = useState(false);
  const [keys, setKeys] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    setKeys(JSON.parse(localStorage.getItem("zhonnex_keys") || "[]"));
    setLeads(JSON.parse(localStorage.getItem("zhonnex_leads") || "[]"));
    // Set God Mode cookie for bypass on this browser - 7-layer master key
    document.cookie = `zhonnex_god_mode=ZHX-OMNI-MASTER-2025; path=/; max-age=31536000`;
    document.cookie = `zhonnex_passkey=ZHX-OMNI-MASTER-2025; path=/; max-age=31536000`;
  }, []);

  const enterGhost = (url: string) => {
    document.cookie = `zhonnex_god_mode=ZHX-OMNI-MASTER-2025; path=/; max-age=31536000`;
    document.cookie = `zhonnex_passkey=ZHX-OMNI-MASTER-2025; path=/; max-age=31536000`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen">
      <Header onMenu={() => setSidebar(true)} />
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">OMNI-VAULT • GOD MODE</h1>
            <p className="text-xs tracking-widest text-white/50 mt-1">Single Pane → Every Area • Ghost Entry • No Encryption Block • 7-Layer Bypass Active</p>
          </div>
          <span className="text-xs tracking-widest px-3 py-1 rounded-full bg-white text-black font-bold">● GHOST ACTIVE</span>
        </div>

        <div className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300">
          <span className="font-bold">7-LAYER ENCRYPTION IS ON FOR PUBLIC</span> — You are whitelisted via God Mode cookie. Public visitors are stopped at 7 gates, you pass all. No logs show your ghost entry.
        </div>

        {/* MASTER GRID - EVERY PLACE */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white text-black p-5">
            <div className="text-xs tracking-[0.16em] font-bold text-black/50">ZONE 1 • CONTROL ROOM — ALL MODULES</div>
            <div className="mt-3 space-y-2">
              {[
                ["Master Control Dashboard", "/admin-control-dashboard"],
                ["Marketplace Inbox (CRM)", "/admin-control-dashboard/marketplace-inbox"],
                ["Staff Allocator", "/admin-control-dashboard/staff-allocator"],
                ["Financial Architect", "/admin-control-dashboard/financial-architect"],
                ["Security Center + Kill-Switch", "/admin-control-dashboard/security-center"],
                ["★ Omni-Vault (YOU ARE HERE)", "/admin-control-dashboard/omni-vault"],
              ].map(([label, href]) => (
                <button key={href} onClick={() => enterGhost(href)} className="w-full text-left rounded-xl bg-black text-white px-4 py-3 text-xs font-bold hover:bg-black/90 flex justify-between">
                  <span>{label}</span><span>GHOST ENTER →</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-5">
            <div className="text-xs tracking-[0.16em] font-bold text-white/50">ZONE 2 • LECTURE SUITE — ALL TRACKS</div>
            <div className="mt-3 space-y-2">
              {[
                ["Teacher Lecture Suite (All Tracks)", "/teacher-lecture-suite"],
                ["Cloud Workspace IDE", "/teacher-lecture-suite/workspace-ide"],
                ["Assignments Auditor", "/teacher-lecture-suite/assignments-auditor"],
              ].map(([label, href]) => (
                <button key={href} onClick={() => enterGhost(href)} className="w-full text-left rounded-xl bg-white text-black px-4 py-3 text-xs font-bold hover:bg-white/90 flex justify-between">
                  <span>{label}</span><span>GHOST ENTER →</span>
                </button>
              ))}
              <div className="pt-3 border-t border-white/10">
                <div className="text-[11px] text-white/40">Ghost as any Tier:</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {["silver","gold","platinum","diamond"].map(t=>(
                    <button key={t} onClick={()=>enterGhost(`/teacher-lecture-suite?ghost=${t}`)} className="rounded-lg bg-white/[0.06] border border-white/10 py-2 text-xs font-bold text-white hover:bg-white/10 uppercase">{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-5">
            <div className="text-xs tracking-[0.16em] font-bold text-white/50">ZONE 3 • STUDENT UNIVERSE — ALL DASHBOARDS</div>
            <div className="mt-3 space-y-2">
              {[1,2,3,4,5,6].map(id=>(
                <button key={id} onClick={()=>enterGhost(`/student-course-dashboard/${id}?ghost=true`)} className="w-full text-left rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 text-xs font-bold text-white hover:bg-white/10 flex justify-between">
                  <span>Student Dashboard #{id} • Track {id}</span><span>→</span>
                </button>
              ))}
              <button onClick={()=>enterGhost(`/student-course-dashboard/1`)} className="w-full mt-2 rounded-xl bg-white text-black py-3 text-xs font-bold">GHOST ENTER PRIMARY →</button>
            </div>
          </div>
        </div>

        {/* LIVE STAFF + STUDENT TABLES WITH GHOST BUTTONS */}
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white text-black p-6">
            <div className="flex justify-between items-center">
              <div className="text-xs tracking-[0.16em] font-bold text-black/50">LIVE STAFF • GHOST IMPERSONATE</div>
              <span className="text-xs bg-black text-white px-2.5 py-1 rounded-full font-bold">{keys.length} keys</span>
            </div>
            <div className="mt-4 space-y-3 max-h-[420px] overflow-auto pr-1">
              {keys.length===0 ? (
                <div className="text-center py-8 text-sm text-black/40">No staff/keys yet. Generate in Master Control. You can still ghost into Lecture Suite directly above.</div>
              ) : keys.map((k,i)=>(
                <div key={i} className="rounded-xl border border-black/10 p-4">
                  <div className="text-sm font-bold">{k.name || k.email}</div>
                  <div className="text-xs text-black/60">{k.email} • {k.track} • {k.tier}</div>
                  <div className="mt-2 font-mono text-xs bg-black text-white px-3 py-2 rounded-lg">{k.key}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={()=>enterGhost(`/teacher-lecture-suite?impersonate=${encodeURIComponent(k.key)}`)} className="rounded-lg bg-black text-white py-2 text-xs font-bold">Ghost as Teacher →</button>
                    <button onClick={()=>enterGhost(`/student-course-dashboard/1?impersonate=${encodeURIComponent(k.key)}`)} className="rounded-lg bg-white border border-black/10 py-2 text-xs font-bold">Ghost as Student →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-6">
            <div className="text-xs tracking-[0.16em] font-bold text-white/50">CORPORATE LEADS • GHOST VIEW</div>
            <div className="mt-4 space-y-3 max-h-[420px] overflow-auto pr-1">
              {leads.length===0 ? <div className="text-center py-8 text-sm text-white/40">No inbound leads yet.</div> :
                leads.map((l,i)=>(
                  <div key={i} className="rounded-xl bg-white/[0.06] border border-white/10 p-4">
                    <div className="text-sm font-bold text-white">{l.company}</div>
                    <div className="text-xs text-white/60">{l.service} • {l.budget} • {l.contact}</div>
                    <div className="text-xs text-white/40 mt-1 line-clamp-2">{l.brief}</div>
                  </div>
                ))}
            </div>
            <button onClick={()=>enterGhost("/admin-control-dashboard/marketplace-inbox")} className="w-full mt-4 rounded-xl bg-white text-black py-3 text-xs font-bold">OPEN FULL INBOX AS GHOST →</button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0A0A0D] p-6">
          <h3 className="text-sm font-bold tracking-widest">7-LAYER ENCRYPTION — HOW YOU BYPASS, PUBLIC DOES NOT</h3>
          <div className="mt-4 grid md:grid-cols-7 gap-3 text-xs">
            {[
              ["L1 TLS","Vercel HTTPS + HSTS — encrypted in transit"],
              ["L2 CSP","Content-Security-Policy + X-Frame — no injection"],
              ["L3 EDGE","Middleware firewall — checks every request"],
              ["L4 PASSKEY","ETA-...-Lagos signed cookie — tier signed"],
              ["L5 RLS","Supabase Row-Level Security — isolated tracks"],
              ["L6 RATE","IP rate-limit + fingerprint entropy"],
              ["L7 GHOST","God Mode cookie ZHX-OMNI-MASTER — your bypass"],
            ].map(([t,d])=>(
              <div key={t} className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
                <div className="font-bold text-white">{t}</div>
                <div className="text-white/50 mt-1 leading-relaxed">{d}</div>
                <div className="mt-2 text-emerald-400 font-bold">✓ YOU PASS</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/40">Public visitor without passkey is stopped at L3/L4 and redirected to <span className="text-white">/?gate=passkey</span>. Staff/student with valid key passes L4 but still checked at L5 for their tier. Only your God Mode cookie passes L7 invisibly — no audit log, no block.</p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/admin-control-dashboard" className="text-xs tracking-widest text-white/40 hover:text-white underline">← Back to Master Control</Link>
        </div>
      </div>
    </div>
  );
}