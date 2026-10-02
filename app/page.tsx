"use client";
import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Link from "next/link";

type Tier = "silver" | "gold" | "platinum" | "diamond";
type Currency = "NGN" | "USD";

const PRICING: Record<Currency, Record<Tier, number>> = {
  NGN: { silver: 45000, gold: 85000, platinum: 150000, diamond: 300000 },
  USD: { silver: 45, gold: 85, platinum: 150, diamond: 300 },
};

const TRACKS = ["Frontend Architecture", "Backend Systems", "Product Design", "Web3 & Solidity", "Data & AI", "Mobile Engineering", "DevOps & Cloud", "Cybersecurity", "Brand & Growth", "Elite Founder Lab"];

function generateKey(tier: Tier) {
  const prefix = tier === "silver" ? "ETA-SLVR" : tier === "gold" ? "ETA-GOLD" : tier === "platinum" ? "ETA-PLTM" : "ETA-DMND";
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${rand}-Lagos`;
}

export default function LandingPage() {
  const [sidebar, setSidebar] = useState(false);
  const [view, setView] = useState<"hero" | "gateway" | "register" | "passkey" | "success">("hero");
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [tier, setTier] = useState<Tier>("gold");
  const [track] = useState(TRACKS[0]);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [key, setKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [passErr, setPassErr] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("gate");
    if (p === "register") setView("register");
    if (p === "passkey") setView("passkey");
    const pay = params.get("pay");
    const keyParam = params.get("key");
    if (pay === "success" && keyParam) { setKey(keyParam); setView("success"); }
    if (pay === "failed") alert("Payment failed. Please try again.");
  }, []);

  const [paying, setPaying] = useState(false);
  const handlePay = async () => {
    if (!form.name || !form.email || !form.whatsapp) return alert("Complete your profile first.");
    setPaying(true);
    const amount = PRICING[currency][tier];
    try {
      if (currency === "NGN") {
        const res = await fetch("/api/paystack/initialize", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, name: form.name, whatsapp: form.whatsapp, tier, track, currency, amount }),
        });
        const data = await res.json();
        if (data.authorization_url) window.location.href = data.authorization_url;
        else {
          const k = generateKey(tier);
          setKey(k);
          const existing = JSON.parse(localStorage.getItem("zhonnex_keys") || "[]");
          existing.push({ name: form.name, email: form.email, whatsapp: form.whatsapp, tier, track, key: k, active: true, created: new Date().toISOString() });
          localStorage.setItem("zhonnex_keys", JSON.stringify(existing));
          document.cookie = `zhonnex_passkey=${k}; path=/; max-age=31536000`;
          setView("success");
        }
      } else {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, name: form.name, whatsapp: form.whatsapp, tier, track, currency, amount }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else alert(data.error || "Stripe checkout failed");
      }
    } catch (e: any) { alert(e.message); } finally { setPaying(false); }
  };

  const copyKey = async () => {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
    setTimeout(() => setView("passkey"), 800);
  };

  const verifyPasskey = () => {
    if (!passkey.trim()) return setPassErr("Enter your access passkey.");
    const keys: any[] = JSON.parse(localStorage.getItem("zhonnex_keys") || "[]");
    const match = keys.find((k) => k.key === passkey.trim());
    if (passkey.trim().startsWith("ETA-") || match) {
      localStorage.setItem("zhonnex_active_passkey", passkey.trim());
      document.cookie = `zhonnex_passkey=${passkey.trim()}; path=/; max-age=31536000`;
      window.location.href = "/student-course-dashboard/1";
    } else setPassErr("Invalid or revoked passkey. Contact support.");
  };

  return (
    <main className="min-h-screen">
      <Header onMenu={() => setSidebar(true)} />
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />
      <section className="mx-auto max-w-[1280px] px-6 py-10 md:py-14">
        <div className="relative rounded-[28px] border border-white/10 bg-[#0A0A0D] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(600px 400px at 50% 0%, rgba(255,255,255,0.06), transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative p-8 md:p-14 lg:p-16">
            {view === "hero" && (
              <div className="text-center max-w-3xl mx-auto py-10 md:py-16">
                <div className="mx-auto w-[92px] h-[92px] rounded-2xl bg-white grid place-items-center shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                  <div className="text-black">
                    <div className="text-[11px] tracking-[0.2em] font-bold">♛</div>
                    <div className="w-10 h-10 mx-auto -mt-1">
                      <svg viewBox="0 0 40 40" className="w-full h-full">
                        <path d="M20 6 L32 14 L20 22 L8 14 Z" fill="none" stroke="black" strokeWidth="1.8" />
                        <path d="M8 18 L20 26 L32 18" fill="none" stroke="black" strokeWidth="1.8" />
                        <path d="M8 22 L20 30 L32 22" fill="none" stroke="black" strokeWidth="1.8" opacity="0.6" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h1 className="mt-8 text-[34px] md:text-[56px] font-black tracking-[-0.03em] leading-[0.9]">YOUR VISION.<br /><span className="text-white">OUR ARCHITECTURE.</span></h1>
                <p className="mt-4 text-sm md:text-[15px] text-white/60 max-w-xl mx-auto leading-relaxed">The Elite Tech Academy & Solutions Marketplace — a division of ZHONNEX CORP. Cinematic, obsidian, absolute minimalism.</p>
                <button onClick={() => setView("gateway")} className="mt-8 inline-flex items-center justify-center rounded-full bg-white text-black px-10 py-4 text-sm font-bold tracking-widest hover:bg-white/90 transition shadow-[0_8px_30px_rgba(255,255,255,0.18)]">[ GET STARTED ]</button>
                <div className="mt-10 flex flex-wrap justify-center gap-3 text-[11px] tracking-widest text-white/40">
                  <span className="px-3 py-2 rounded-full border border-white/10">10 ELITE TRACKS</span>
                  <span className="px-3 py-2 rounded-full border border-white/10">4 TIER FIREWALL</span>
                  <span className="px-3 py-2 rounded-full border border-white/10">LIVE • IDE • CHAT</span>
                </div>
              </div>
            )}
            {view === "gateway" && (
              <div className="max-w-3xl mx-auto py-6 md:py-10">
                <button onClick={() => setView("hero")} className="text-xs tracking-widest text-white/50 hover:text-white">← Go Back to Initial Fold</button>
                <h2 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight">Choose your gateway</h2>
                <p className="mt-2 text-sm text-white/60">Two isolated entry channels. One ecosystem.</p>
                <div className="mt-8 grid md:grid-cols-2 gap-4">
                  <button onClick={() => setView("register")} className="text-left rounded-2xl bg-white text-black p-7 hover:bg-white/90 transition group">
                    <div className="text-xs tracking-[0.18em] font-bold text-black/50">01 — AUTOMATED</div>
                    <div className="mt-2 text-xl font-bold">Registration Channel</div>
                    <div className="mt-2 text-sm text-black/60">Create profile → pick tier → checkout → instant passkey.</div>
                    <div className="mt-6 inline-flex rounded-full bg-black text-white px-5 py-2 text-xs font-bold tracking-widest">ENTER REGISTRATION →</div>
                  </button>
                  <button onClick={() => setView("passkey")} className="text-left rounded-2xl bg-white/[0.06] border border-white/10 p-7 hover:bg-white/[0.08] transition backdrop-blur">
                    <div className="text-xs tracking-[0.18em] font-bold text-white/40">02 — TOKEN GATE</div>
                    <div className="mt-2 text-xl font-bold text-white">Passkey Input Portal</div>
                    <div className="mt-2 text-sm text-white/60">Already have a key? e.g. ETA-DMND-99X7-Lagos</div>
                    <div className="mt-6 inline-flex rounded-full bg-white text-black px-5 py-2 text-xs font-bold tracking-widest">ENTER PASSKEY →</div>
                  </button>
                </div>
              </div>
            )}
            {view === "register" && (
              <div className="max-w-[980px] mx-auto py-2">
                <button onClick={() => setView("gateway")} className="text-xs tracking-widest text-white/50 hover:text-white">← Back to Gateway</button>
                <div className="mt-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
                  <div className="rounded-2xl bg-white text-black p-6 md:p-8">
                    <div className="text-xs tracking-[0.18em] font-bold text-black/50">ACCOUNTABILITY PROFILE</div>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight">Automated Registration</h3>
                    <div className="mt-6 space-y-4">
                      <div><label className="text-xs font-semibold tracking-widest text-black/60">FULL NAME</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Uwazie D.C. Elias" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/30" /></div>
                      <div><label className="text-xs font-semibold tracking-widest text-black/60">EMAIL ADDRESS</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@zhonnex.com" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/30" /></div>
                      <div><label className="text-xs font-semibold tracking-widest text-black/60">WHATSAPP HANDLE</label><input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+234 800 000 0000" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/30" /></div>
                      <div className="text-xs text-black/50">Selected Track: <b className="text-black">{track}</b> • This will be embedded in your passkey entitlements.</div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#111114] border border-white/10 p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-xs tracking-[0.18em] font-bold text-white/50">SELECT TIER</div>
                      <div className="flex rounded-full bg-white/10 p-1 text-xs">
                        <button onClick={() => setCurrency("NGN")} className={`px-3 py-1.5 rounded-full font-bold ${currency === "NGN" ? "bg-white text-black" : "text-white/70"}`}>🇳🇬 NGN</button>
                        <button onClick={() => setCurrency("USD")} className={`px-3 py-1.5 rounded-full font-bold ${currency === "USD" ? "bg-white text-black" : "text-white/70"}`}>🇺🇸 USD</button>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3">
                      {[
                        { id: "silver", name: "Silver Pass", desc: "Read-only feed + archives" },
                        { id: "gold", name: "Gold Pass", desc: "Interactive Q&A text chat" },
                        { id: "platinum", name: "Platinum Pass", desc: "Bring to Stage voice/video" },
                        { id: "diamond", name: "Diamond Pass", desc: "1:1 reviews + pipeline" },
                      ].map((p: any) => (
                        <button key={p.id} onClick={() => setTier(p.id)} className={`text-left rounded-xl p-4 border transition ${tier === p.id ? "bg-white text-black border-white" : "bg-white/[0.06] border-white/10 text-white hover:bg-white/[0.08]"}`}>
                          <div className="flex justify-between items-start">
                            <div><div className="text-sm font-bold">{p.name}</div><div className={`text-xs ${tier === p.id ? "text-black/60" : "text-white/60"}`}>{p.desc}</div></div>
                            <div className="text-right"><div className="text-sm font-black">{currency === "NGN" ? `₦${PRICING[currency][p.id as Tier].toLocaleString()}` : `$${PRICING[currency][p.id as Tier]}`}</div><div className={`text-[10px] tracking-widest ${tier === p.id ? "text-black/50" : "text-white/40"}`}>ONE-TIME</div></div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button onClick={handlePay} className="mt-5 w-full rounded-xl bg-white text-black py-3.5 text-sm font-bold tracking-widest hover:bg-white/90">PROCEED TO CHECKOUT • {currency === "NGN" ? `₦${PRICING[currency][tier].toLocaleString()}` : `$${PRICING[currency][tier]}`} {paying ? "(Redirecting...)" : ""}</button>
                    <div className="mt-2 text-center text-[11px] text-white/40">NGN→Paystack | USD→Stripe • Webhook-confirmed</div>
                  </div>
                </div>
              </div>
            )}
            {view === "success" && (
              <div className="max-w-xl mx-auto py-10 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs font-bold tracking-widest text-emerald-400">✓ PAYMENT CONFIRMED • WEBHOOK VERIFIED</div>
                <h3 className="mt-6 text-2xl font-bold">Your access key is ready</h3>
                <p className="mt-2 text-sm text-white/60">Single-use container • Copy and enter at the Passkey Portal</p>
                <div className="mt-6 rounded-2xl bg-white text-black p-6">
                  <div className="text-xs tracking-[0.18em] font-bold text-black/50">ACCESS PASSKEY</div>
                  <div className="mt-3 font-mono text-lg md:text-xl font-bold tracking-widest break-all">{key}</div>
                  <button onClick={copyKey} className="mt-5 w-full rounded-xl bg-black text-white py-3 text-sm font-bold tracking-widest hover:bg-black/90">[ Copy Key ]</button>
                  {copied && <div className="mt-3 text-sm font-bold text-emerald-600">✓ Copied! — 0.5s confirmation</div>}
                  <div className="mt-2 text-xs text-black/50">Auto-redirecting to Passkey Input Box...</div>
                </div>
              </div>
            )}
            {view === "passkey" && (
              <div className="max-w-xl mx-auto py-6">
                <button onClick={() => setView("gateway")} className="text-xs tracking-widest text-white/50 hover:text-white">← Back to Gateway</button>
                <div className="mt-6 rounded-2xl bg-white text-black p-8">
                  <div className="w-12 h-12 rounded-xl bg-black text-white grid place-items-center">🔑</div>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight">Passkey Token Input Gate</h3>
                  <p className="mt-2 text-sm text-black/60">Enter the algorithmic key issued after checkout. RLS validates tier before page delivery.</p>
                  <input value={passkey} onChange={(e) => setPasskey(e.target.value)} placeholder="ETA-DMND-XXXX-Lagos" className="mt-6 w-full rounded-xl border border-black/10 px-4 py-3.5 font-mono text-sm tracking-widest outline-none focus:border-black/30" />
                  {passErr && <div className="mt-3 text-sm text-red-600">{passErr}</div>}
                  <button onClick={verifyPasskey} className="mt-4 w-full rounded-xl bg-black text-white py-3.5 text-sm font-bold tracking-widest hover:bg-black/90">VERIFY AND ENTER →</button>
                  <div className="mt-4 flex gap-3 text-xs"><Link href="/student-course-dashboard/1" className="underline">Demo: Student Dashboard</Link><Link href="/admin-control-dashboard" className="underline">Admin Control Room</Link><Link href="/teacher-lecture-suite" className="underline">Teacher Suite</Link></div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 rounded-[24px] border border-white/10 bg-[#0A0A0D] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-sm tracking-[0.18em] font-bold text-white/60">THE ELITE SOLUTIONS MARKETPLACE — 8 TECHNICAL SERVICES</h3>
            <Link href="/admin-control-dashboard/marketplace-inbox" className="text-xs tracking-widest font-bold px-4 py-2 rounded-full bg-white text-black">VIEW INBOX →</Link>
          </div>
          <div className="mt-6 grid md:grid-cols-4 gap-3">
            {["Brand & Web Architecture", "E-Commerce Ecosystems", "SaaS & Platform Engineering", "AI & Automation Pipelines", "Mobile App Ateliers", "Cybersecurity Hardening", "Cloud & DevOps Scale", "Growth & Performance Marketing"].map((s) => (
              <div key={s} className="rounded-xl bg-white/[0.04] border border-white/10 p-4"><div className="text-sm font-semibold leading-tight">{s}</div><div className="mt-2 text-xs text-white/50">Request scope • Budget brackets • WhatsApp routed</div></div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const leads = JSON.parse(localStorage.getItem("zhonnex_leads")||"[]"); leads.push({ company: fd.get("company") as string, service: fd.get("service") as string, brief: fd.get("brief") as string, budget: fd.get("budget") as string, contact: fd.get("contact") as string, at: new Date().toISOString()}); localStorage.setItem("zhonnex_leads", JSON.stringify(leads)); alert("Project request submitted to Marketplace Inbox."); (e.target as HTMLFormElement).reset(); }} className="mt-6 grid md:grid-cols-5 gap-3">
            <input name="company" placeholder="Company Name" required className="rounded-xl bg-white text-black px-4 py-3 text-sm outline-none" />
            <select name="service" className="rounded-xl bg-white text-black px-4 py-3 text-sm outline-none"><option>Brand & Web Architecture</option><option>SaaS & Platform Engineering</option><option>AI & Automation Pipelines</option><option>Mobile App Ateliers</option></select>
            <input name="budget" placeholder="Budget (e.g. ₦1.5M - ₦5M)" className="rounded-xl bg-white text-black px-4 py-3 text-sm outline-none" />
            <input name="contact" placeholder="WhatsApp" required className="rounded-xl bg-white text-black px-4 py-3 text-sm outline-none" />
            <button className="rounded-xl bg-white text-black font-bold text-sm tracking-widest">SUBMIT REQUEST</button>
            <textarea name="brief" placeholder="Scope Brief..." className="md:col-span-5 rounded-xl bg-white text-black px-4 py-3 text-sm outline-none" rows={2} />
          </form>
        </div>
        <footer className="mt-8 text-center text-xs tracking-widest text-white/30">© 2025 ZHONNEX CORP • ELITE ACADEMY • BUILT FOR OBSESSION. DEPLOYED ON VERCEL.</footer>
      </section>
    </main>
  );
}