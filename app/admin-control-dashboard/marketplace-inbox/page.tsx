"use client";
import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";

export default function MarketplaceInbox() {
  const [sidebar, setSidebar] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [delegated, setDelegated] = useState<Record<number, string>>({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("zhonnex_leads") || "[]");
    if (stored.length === 0) {
      const seed = [
        { company: "Revelation LA • Media", service: "Brand & Web Architecture", brief: "Cinematic church platform with livestream + giving", budget: "$5,000 - $10,000", contact: "+1 310 555 0142", at: new Date().toISOString() },
        { company: "Paystack Cohort", service: "SaaS & Platform Engineering", brief: "Merchant dashboard with webhook ledger", budget: "₦1,500,000 - ₦5,000,000", contact: "+234 801 234 5678", at: new Date().toISOString() },
        { company: "Atlas Capital", service: "AI & Automation Pipelines", brief: "Lead enrichment + WhatsApp bot", budget: "$3,000 - $7,500", contact: "+44 7700 900123", at: new Date().toISOString() },
      ];
      localStorage.setItem("zhonnex_leads", JSON.stringify(seed));
      setLeads(seed);
    } else setLeads(stored);
  }, []);

  const students = ["Chioma A. (Diamond • Frontend)", "David O. (Diamond • Backend)", "Amara K. (Platinum • Design)", "Tunde F. (Diamond • AI)"];

  return (
    <div className="min-h-screen">
      <Header onMenu={() => setSidebar(true)} />
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <h1 className="text-2xl font-black">Freelance Marketplace Inbox (Agency CRM)</h1>
        <p className="text-sm text-white/60 mt-1">Immutable row ledger • WhatsApp routed • Student Matching Pipeline keeps client contact hidden from student.</p>
        <div className="mt-6 space-y-3">
          {leads.map((l, idx) => (
            <div key={idx} className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-5 md:p-6">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="text-sm font-bold">{l.company}</div>
                  <div className="text-xs text-white/50">{l.service} • {new Date(l.at).toLocaleString()}</div>
                </div>
                <span className="h-fit px-3 py-1 rounded-full bg-white text-black text-xs font-bold">{l.budget}</span>
              </div>
              <div className="mt-3 text-sm text-white/70 leading-relaxed">{l.brief}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`https://wa.me/${l.contact.replace(/\D/g,"")}?text=${encodeURIComponent(`Hello ${l.company}, this is the Executive Director of ZHONNEX CORP. We received your request for ${l.service}. Let’s align on scope & timeline.`)}`} target="_blank" className="rounded-full bg-[#25D366] text-black px-5 py-2.5 text-xs font-bold">[ Chat on WhatsApp ]</a>
                <div className="flex items-center gap-2">
                  <select value={delegated[idx] || ""} onChange={e=> setDelegated({...delegated, [idx]: e.target.value})} className="rounded-full bg-white text-black px-4 py-2.5 text-xs font-bold outline-none">
                    <option value="">Delegate to Student Team...</option>
                    {students.map(s=> <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={()=>{
                    if(!delegated[idx]) return alert("Select a Diamond student");
                    const audit = JSON.parse(localStorage.getItem("zhonnex_audit")||"[]");
                    audit.unshift(`${new Date().toLocaleString()} — DELEGATE — ${l.company} → ${delegated[idx]} (client contact hidden)`);
                    localStorage.setItem("zhonnex_audit", JSON.stringify(audit));
                    alert(`Delegated to ${delegated[idx]} — internship task created. Client contact remains hidden.`);
                  }} className="rounded-full bg-white text-black px-5 py-2.5 text-xs font-bold">[ Delegate to Student Team ]</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}