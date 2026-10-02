"use client";
import { useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";

const TRACKS = ["Frontend", "Backend", "Design", "Web3", "Data", "Mobile", "DevOps", "Security", "Growth", "Founder Lab"];

export default function StaffAllocator() {
  const [sidebar, setSidebar] = useState(false);
  const [staff, setStaff] = useState([
    { id: 1, name: "Prophet Lovy • Tech Lead", email: "lovy@zhonnex.com", tracks: ["Frontend", "Design"], tierAccess: ["gold","platinum","diamond"], status: "on" },
    { id: 2, name: "Sarah K. • Backend", email: "sarah@zhonnex.com", tracks: ["Backend", "DevOps"], tierAccess: ["silver","gold"], status: "on" },
    { id: 3, name: "Daniel O. • AI Research", email: "daniel@zhonnex.com", tracks: ["Data"], tierAccess: ["platinum","diamond"], status: "on" },
  ]);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const purge = (id:number)=>{
    const s = staff.find(x=>x.id===id);
    setStaff(staff.filter(x=>x.id!==id));
    const audit=JSON.parse(localStorage.getItem("zhonnex_audit")||"[]");
    audit.unshift(`${new Date().toLocaleString()} — PURGE STAFF — ${s?.name} (${s?.email}) — tokens destroyed, streams crashed, classes offline`);
    localStorage.setItem("zhonnex_audit", JSON.stringify(audit));
    setConfirmId(null);
  };

  return (
    <div className="min-h-screen">
      <Header onMenu={()=>setSidebar(true)} />
      <Sidebar open={sidebar} onClose={()=>setSidebar(false)} />
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <h1 className="text-2xl font-black">Academic Staff Allocator</h1>
        <p className="text-sm text-white/60">Checkbox Authorization Grid • Hard Delete Purge Switch (irreversible cascade)</p>
        <div className="mt-6 grid gap-4">
          {staff.map(s=>(
            <div key={s.id} className="rounded-2xl bg-[#0A0A0D] border border-white/10 p-6">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <div className="text-sm font-bold">{s.name}</div>
                  <div className="text-xs text-white/50">{s.email} • <span className={s.status==="on"?"text-emerald-400":"text-red-400"}>{s.status==="on"?"● LIVE":"● OFFLINE"}</span></div>
                </div>
                <button onClick={()=>setConfirmId(s.id)} className="rounded-full bg-red-500 text-white px-5 py-2 text-xs font-bold">[ 🗑️ Permanent Delete Account ]</button>
              </div>
              <div className="mt-5 grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs tracking-widest font-bold text-white/50">COURSE TRACK ALLOCATION</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {TRACKS.map(t=>(
                      <label key={t} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked={s.tracks.includes(t)} className="accent-white" /> {t}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs tracking-widest font-bold text-white/50">TIER SUB-CLASSROOM ACCESS</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["silver","gold","platinum","diamond"].map(tier=>(
                      <label key={tier} className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs">
                        <input type="checkbox" defaultChecked={s.tierAccess.includes(tier)} className="accent-white" /> {tier.toUpperCase()}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {confirmId && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur">
            <div className="w-full max-w-md rounded-2xl bg-white text-black p-7">
              <div className="text-lg font-black">Confirm Permanent Purge?</div>
              <p className="mt-2 text-sm text-black/60">This will irreversibly delete the staff account, destroy active login tokens, crash any active stream, and flip assigned classes to offline.</p>
              <div className="mt-6 flex gap-3">
                <button onClick={()=>setConfirmId(null)} className="flex-1 rounded-xl border border-black/10 py-3 text-sm font-bold">Cancel</button>
                <button onClick={()=>purge(confirmId)} className="flex-1 rounded-xl bg-red-600 text-white py-3 text-sm font-bold">Confirm Purge</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}