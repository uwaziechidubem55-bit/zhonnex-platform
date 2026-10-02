"use client";
import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";

export default function SecurityCenter() {
  const [sidebar, setSidebar] = useState(false);
  const [terms, setTerms] = useState(`# ZHONNEX CORP — Terms & Anti-Piracy Policy

**Last updated: October 2025**

1. Access keys are single-user, hardware-fingerprinted and non-transferable.
2. Screen recording, re-streaming or redistribution triggers automatic revocation.
3. All administrative actions are logged in the Immutable Audit Ledger.
4. Diamond tier delegation does not expose client contact to students.

> This editor publishes globally across all storefront portals instantly.
`);
  const [audit, setAudit] = useState<string[]>([]);
  const [kill, setKill] = useState(false);

  useEffect(()=>{
    setAudit(JSON.parse(localStorage.getItem("zhonnex_audit")||"[]"));
    setTerms(localStorage.getItem("zhonnex_terms")||terms);
  },[]);

  const saveTerms=()=>{
    localStorage.setItem("zhonnex_terms", terms);
    const a=JSON.parse(localStorage.getItem("zhonnex_audit")||"[]");
    a.unshift(`${new Date().toLocaleString()} — TERMS UPDATE — legal copy published globally`);
    localStorage.setItem("zhonnex_audit", JSON.stringify(a));
    setAudit(a);
    alert("Terms published globally.");
  };

  const toggleKill=()=>{
    const next=!kill;
    setKill(next);
    const a=JSON.parse(localStorage.getItem("zhonnex_audit")||"[]");
    a.unshift(`${new Date().toLocaleString()} — KILL-SWITCH — ${next ? "ACTIVATED — all streams frozen":"DEACTIVATED — streams resumed"}`);
    localStorage.setItem("zhonnex_audit", JSON.stringify(a));
    setAudit(a);
  };

  return (
    <div className="min-h-screen">
      <Header onMenu={()=>setSidebar(true)} />
      <Sidebar open={sidebar} onClose={()=>setSidebar(false)} />
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <h1 className="text-2xl font-black">Platform Core Registry & Security Center</h1>
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white text-black p-6">
            <div className="text-xs tracking-[0.16em] font-bold text-black/50">TERMS & CONDITIONS MARKDOWN EDITOR</div>
            <textarea value={terms} onChange={e=>setTerms(e.target.value)} rows={14} className="mt-4 w-full rounded-xl border border-black/10 p-4 font-mono text-sm outline-none focus:border-black/30" />
            <button onClick={saveTerms} className="mt-4 w-full rounded-xl bg-black text-white py-3 text-sm font-bold tracking-widest">PUBLISH TERMS GLOBALLY</button>
            <div className="mt-4 rounded-xl bg-[#F6F6F7] p-4 border border-black/10">
              <div className="text-xs font-bold tracking-widest text-black/50">LIVE PREVIEW</div>
              <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{terms}</pre>
            </div>
          </div>
          <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div className="text-xs tracking-[0.16em] font-bold text-white/50">IMMUTABLE AUDIT LOG LEDGER</div>
              <button onClick={toggleKill} className={`px-4 py-2 rounded-full text-xs font-bold ${kill?"bg-red-500 text-white":"bg-white text-black"}`}>{kill?"● KILL-SWITCH ACTIVE":"○ Kill-Switch"}</button>
            </div>
            <div className="mt-4 rounded-xl bg-black border border-white/10 p-4 font-mono text-xs max-h-[520px] overflow-auto">
              {audit.length===0? <div className="text-white/40">No actions logged yet.</div> : audit.map((a,i)=><div key={i} className="py-2 border-b border-white/5 last:border-0 text-white/80">{a}</div>)}
            </div>
            <button onClick={()=>{ localStorage.removeItem("zhonnex_audit"); setAudit([]); }} className="mt-4 text-xs underline text-white/50">Clear local ledger (demo only)</button>
          </div>
        </div>
      </div>
    </div>
  );
}