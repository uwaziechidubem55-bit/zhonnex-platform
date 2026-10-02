"use client";
import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";

export default function FinancialArchitect() {
  const [sidebar, setSidebar] = useState(false);
  const [pricing, setPricing] = useState({ silverNGN: 45000, goldNGN: 85000, platinumNGN: 150000, diamondNGN: 300000, silverUSD: 45, goldUSD: 85, platinumUSD: 150, diamondUSD: 300 });
  const [nairaBrackets, setNairaBrackets] = useState(["₦300,000 - ₦800,000","₦800,000 - ₦1,500,000","₦1,500,000 - ₦5,000,000","₦5,000,000+"]);
  const [usdBrackets, setUsdBrackets] = useState(["$500 - $1,500","$1,500 - $3,000","$3,000 - $10,000","$10,000+"]);

  useEffect(()=>{
    const p = localStorage.getItem("zhonnex_pricing");
    if(p) setPricing(JSON.parse(p));
    const nb = localStorage.getItem("zhonnex_naira_brackets");
    if(nb) setNairaBrackets(JSON.parse(nb));
    const ub = localStorage.getItem("zhonnex_usd_brackets");
    if(ub) setUsdBrackets(JSON.parse(ub));
  },[]);

  const save = ()=>{
    localStorage.setItem("zhonnex_pricing", JSON.stringify(pricing));
    localStorage.setItem("zhonnex_naira_brackets", JSON.stringify(nairaBrackets));
    localStorage.setItem("zhonnex_usd_brackets", JSON.stringify(usdBrackets));
    const audit=JSON.parse(localStorage.getItem("zhonnex_audit")||"[]");
    audit.unshift(`${new Date().toLocaleString()} — FINANCIAL UPDATE — pricing & brackets updated`);
    localStorage.setItem("zhonnex_audit", JSON.stringify(audit));
    alert("Pricing & brackets updated globally — checkout interfaces reflect instantly.");
  };

  return (
    <div className="min-h-screen">
      <Header onMenu={()=>setSidebar(true)} />
      <Sidebar open={sidebar} onClose={()=>setSidebar(false)} />
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <h1 className="text-2xl font-black">Financial Architect</h1>
        <p className="text-sm text-white/60">Price & Dynamic Bracket Manager — updates storefront instantly without reload.</p>
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white text-black p-6">
            <div className="text-xs tracking-[0.16em] font-bold text-black/50">PRICING ENGINE — NGN (Naira)</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Silver Pass","silverNGN"],
                ["Gold Pass","goldNGN"],
                ["Platinum Pass","platinumNGN"],
                ["Diamond Pass","diamondNGN"],
              ].map(([label,key]:any)=>(
                <div key={key}>
                  <div className="text-xs font-bold tracking-widest text-black/60">{label}</div>
                  <input type="number" value={(pricing as any)[key]} onChange={e=> setPricing({...pricing, [key]: Number(e.target.value)})} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm" />
                </div>
              ))}
            </div>
            <div className="mt-6 text-xs tracking-[0.16em] font-bold text-black/50">PRICING ENGINE — USD (Dollar)</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Silver Pass","silverUSD"],
                ["Gold Pass","goldUSD"],
                ["Platinum Pass","platinumUSD"],
                ["Diamond Pass","diamondUSD"],
              ].map(([label,key]:any)=>(
                <div key={key}>
                  <div className="text-xs font-bold tracking-widest text-black/60">{label}</div>
                  <input type="number" value={(pricing as any)[key]} onChange={e=> setPricing({...pricing, [key]: Number(e.target.value)})} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-6">
            <div className="text-xs tracking-[0.16em] font-bold text-white/50">INTAKE FORM BUDGET MATRIX MANAGER</div>
            <div className="mt-4">
              <div className="text-xs font-bold tracking-widest text-white/60">Naira Brackets (NGN)</div>
              <div className="mt-2 space-y-2">
                {nairaBrackets.map((b,i)=>(
                  <div key={i} className="flex gap-2">
                    <input value={b} onChange={e=>{ const n=[...nairaBrackets]; n[i]=e.target.value; setNairaBrackets(n); }} className="flex-1 rounded-xl bg-white text-black px-4 py-2.5 text-sm" />
                    <button onClick={()=> setNairaBrackets(nairaBrackets.filter((_,idx)=>idx!==i))} className="rounded-xl bg-red-500 text-white px-3 text-xs font-bold">✕</button>
                  </div>
                ))}
                <button onClick={()=> setNairaBrackets([...nairaBrackets, "₦ — "])} className="text-xs underline text-white/60">+ Add Naira bracket</button>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-xs font-bold tracking-widest text-white/60">Dollar Brackets (USD)</div>
              <div className="mt-2 space-y-2">
                {usdBrackets.map((b,i)=>(
                  <div key={i} className="flex gap-2">
                    <input value={b} onChange={e=>{ const n=[...usdBrackets]; n[i]=e.target.value; setUsdBrackets(n); }} className="flex-1 rounded-xl bg-white text-black px-4 py-2.5 text-sm" />
                    <button onClick={()=> setUsdBrackets(usdBrackets.filter((_,idx)=>idx!==i))} className="rounded-xl bg-red-500 text-white px-3 text-xs font-bold">✕</button>
                  </div>
                ))}
                <button onClick={()=> setUsdBrackets([...usdBrackets, "$ — "])} className="text-xs underline text-white/60">+ Add Dollar bracket</button>
              </div>
            </div>
          </div>
        </div>
        <button onClick={save} className="mt-6 w-full md:w-auto rounded-xl bg-white text-black px-8 py-3.5 text-sm font-bold tracking-widest">SAVE & PUBLISH GLOBALLY</button>
      </div>
    </div>
  );
}