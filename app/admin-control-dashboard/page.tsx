"use client";
import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Link from "next/link";

export default function AdminDashboard() {
  const [sidebar, setSidebar] = useState(false);
  const [keys, setKeys] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [gen, setGen] = useState({ name: "", email: "", track: "Frontend Architecture", tier: "gold", lifecycle: "30 days" });
  const [audit, setAudit] = useState<string[]>([]);

  useEffect(() => {
    setKeys(JSON.parse(localStorage.getItem("zhonnex_keys") || "[]"));
    setAudit(JSON.parse(localStorage.getItem("zhonnex_audit") || "[]"));
  }, []);

  const saveKeys = (next: any[]) => {
    setKeys(next);
    localStorage.setItem("zhonnex_keys", JSON.stringify(next));
  };
  const log = (msg: string) => {
    const entry = `${new Date().toLocaleString()} — ${msg}`;
    const next = [entry, ...audit].slice(0, 100);
    setAudit(next);
    localStorage.setItem("zhonnex_audit", JSON.stringify(next));
  };

  const generate = () => {
    if (!gen.name || !gen.email) return alert("Name and email required");
    const prefix = gen.tier === "silver" ? "ETA-SLVR" : gen.tier === "gold" ? "ETA-GOLD" : gen.tier === "platinum" ? "ETA-PLTM" : "ETA-DMND";
    const key = `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}-Lagos`;
    const next = [...keys, { name: gen.name, email: gen.email, tier: gen.tier, track: gen.track, lifecycle: gen.lifecycle, key, active: true, fingerprint: "—", created: new Date().toISOString() }];
    saveKeys(next);
    log(`GENERATE — ${gen.name} (${gen.tier} / ${gen.track}) → ${key}`);
    alert(`Generated: ${key}`);
  };

  const filtered = keys.filter(k =>
    !query ? true : `${k.name} ${k.email} ${k.tier}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header onMenu={() => setSidebar(true)} />
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-black tracking-tight">MASTER CORPORATE CONTROL ROOM</h1>
          <span className="text-xs tracking-widest px-3 py-1 rounded-full bg-white text-black font-bold">SYSTEM A • ADMIN ONLY</span>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Students", value: keys.filter(k => k.active).length },
            { label: "Corporate Contracts", value: (JSON.parse(typeof window !== "undefined" ? localStorage.getItem("zhonnex_leads") || "[]" : "[]") as any[]).length },
            { label: "Pending Inbound", value: 3 },
            { label: "Active Staff", value: 6 },
          ].map(c => (
            <div key={c.label} className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-5">
              <div className="text-[11px] tracking-[0.16em] text-white/50 font-bold">{c.label.toUpperCase()}</div>
              <div className="mt-2 text-3xl font-black">{c.value}</div>
              <div className="mt-1 text-xs text-emerald-400">● Live telemetry</div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="rounded-2xl bg-white text-black p-6">
            <div className="text-xs tracking-[0.16em] font-bold text-black/50">MODULE 2 • PASSKEY INFRASTRUCTURE</div>
            <h3 className="mt-1 text-xl font-bold">Manual Provisioner (Offline / Cash)</h3>
            <div className="mt-5 grid gap-3">
              <input placeholder="Student Full Name" value={gen.name} onChange={e => setGen({ ...gen, name: e.target.value })} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none" />
              <input placeholder="Email" value={gen.email} onChange={e => setGen({ ...gen, email: e.target.value })} className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none" />
              <div className="grid grid-cols-3 gap-3">
                <select value={gen.track} onChange={e => setGen({ ...gen, track: e.target.value })} className="rounded-xl border border-black/10 px-3 py-3 text-sm">
                  {["Frontend Architecture","Backend Systems","Product Design","Web3 & Solidity","Data & AI","Mobile Engineering","DevOps & Cloud","Cybersecurity","Brand & Growth","Elite Founder Lab"].map(t=> <option key={t}>{t}</option>)}
                </select>
                <select value={gen.tier} onChange={e => setGen({ ...gen, tier: e.target.value })} className="rounded-xl border border-black/10 px-3 py-3 text-sm">
                  <option value="silver">Silver</option><option value="gold">Gold</option><option value="platinum">Platinum</option><option value="diamond">Diamond</option>
                </select>
                <select value={gen.lifecycle} onChange={e => setGen({ ...gen, lifecycle: e.target.value })} className="rounded-xl border border-black/10 px-3 py-3 text-sm">
                  <option>30 days</option><option>90 days</option><option>1 year</option><option>Lifetime</option>
                </select>
              </div>
              <button onClick={generate} className="w-full rounded-xl bg-black text-white py-3.5 text-sm font-bold tracking-widest">[ Generate Access Passkey ]</button>
            </div>
            <div className="mt-6 rounded-xl bg-black text-white p-4 font-mono text-xs">
              <div className="text-white/50">AUDIT LOG PREVIEW</div>
              <div className="mt-2 space-y-1 max-h-[120px] overflow-auto">
                {audit.length ? audit.slice(0, 5).map((a,i)=><div key={i} className="text-white/80">{a}</div>) : <div className="text-white/40">No actions yet.</div>}
              </div>
              <Link href="/admin-control-dashboard/security-center" className="mt-3 inline-block text-xs underline">Open full ledger →</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-6">
            <div className="text-xs tracking-[0.16em] font-bold text-white/50">KEY SEARCH SAFETY NET</div>
            <input placeholder="Search by Student Name / Email / Tier" value={query} onChange={e => setQuery(e.target.value)} className="mt-4 w-full rounded-xl bg-white text-black px-4 py-3 text-sm outline-none" />
            <div className="mt-4 space-y-3 max-h-[360px] overflow-auto pr-1">
              {filtered.length === 0 ? <div className="text-sm text-white/40 text-center py-10">No keys found.</div> :
                filtered.map((k, i) => (
                  <div key={i} className="rounded-xl bg-white/[0.06] border border-white/10 p-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold">{k.name}</div>
                        <div className="text-xs text-white/50">{k.email} • {k.track} • <span className="uppercase">{k.tier}</span></div>
                      </div>
                      <span className={`h-fit px-2.5 py-1 rounded-full text-[11px] font-bold ${k.active ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>{k.active ? "ACTIVE" : "REVOKED"}</span>
                    </div>
                    <div className="mt-3 font-mono text-xs tracking-widest bg-white text-black rounded-lg px-3 py-2">{k.key}</div>
                    <div className="mt-2 text-[11px] text-white/40">Fingerprint: {k.fingerprint || "—"} • Created {new Date(k.created).toLocaleString()}</div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={async()=>{ await navigator.clipboard.writeText(k.key); log(`COPY & RESEND — ${k.email}`); alert("Copied & resent (mock)"); }} className="flex-1 rounded-lg bg-white text-black py-2 text-xs font-bold">[ Copy & Resend ]</button>
                      <button onClick={()=>{ const next=[...keys]; next[i].active=false; saveKeys(next); log(`REVOKE — ${k.key} (${k.email})`); }} className="flex-1 rounded-lg bg-red-500 text-white py-2 text-xs font-bold">[ Revoke Key ]</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-4 gap-3">
          {[
            { name: "Marketplace Inbox", href: "/admin-control-dashboard/marketplace-inbox", desc: "CRM • WhatsApp • Delegate" },
            { name: "Staff Allocator", href: "/admin-control-dashboard/staff-allocator", desc: "Authorization grid • Purge" },
            { name: "Financial Architect", href: "/admin-control-dashboard/financial-architect", desc: "NGN / USD • Brackets" },
            { name: "Security Center", href: "/admin-control-dashboard/security-center", desc: "Audit ledger • Kill-switch" },
          ].map(c=>(
            <Link key={c.name} href={c.href} className="rounded-2xl bg-white text-black p-5 hover:bg-white/90 transition">
              <div className="text-sm font-bold">{c.name}</div>
              <div className="text-xs text-black/60 mt-1">{c.desc}</div>
              <div className="mt-3 text-xs font-bold tracking-widest">OPEN →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}