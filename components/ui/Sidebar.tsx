"use client";
import Link from "next/link";
import { X, LayoutDashboard, KeyRound, Inbox, Users, Wallet, Shield, GraduationCap, Code2, ClipboardCheck, MessageSquare } from "lucide-react";

const PUBLIC_NAV = [
  { label: "Course Registration", sub: "Automated Tier Picker", href: "/?gate=register", icon: LayoutDashboard },
  { label: "Enter Passkey Portal", sub: "Token Verification Gate", href: "/?gate=passkey", icon: KeyRound },
];

const NAV = [
  { label: "Course Registration", sub: "Automated Tier Picker", href: "/?gate=register", icon: LayoutDashboard },
  { label: "Enter Passkey Portal", sub: "Token Verification Gate", href: "/?gate=passkey", icon: KeyRound },
  { label: "— CONTROL ROOM —", divider: true },
  { label: "Master Control Dashboard", href: "/admin-control-dashboard", icon: LayoutDashboard },
  { label: "Marketplace Inbox (CRM)", href: "/admin-control-dashboard/marketplace-inbox", icon: Inbox },
  { label: "Staff Allocator", href: "/admin-control-dashboard/staff-allocator", icon: Users },
  { label: "Financial Architect", href: "/admin-control-dashboard/financial-architect", icon: Wallet },
  { label: "Security Center", href: "/admin-control-dashboard/security-center", icon: Shield },
  { label: "— LECTURE SUITE —", divider: true },
  { label: "Teacher Lecture Suite", href: "/teacher-lecture-suite", icon: GraduationCap },
  { label: "Cloud Workspace IDE", href: "/teacher-lecture-suite/workspace-ide", icon: Code2 },
  { label: "Assignments Auditor", href: "/teacher-lecture-suite/assignments-auditor", icon: ClipboardCheck },
  { label: "— STUDENT —", divider: true },
  { label: "Student Dashboard #1", href: "/student-course-dashboard/1", icon: MessageSquare },
];

export default function Sidebar({ open, onClose, mode = "full" }: { open: boolean; onClose: () => void; mode?: "public" | "full" }) {
  const NAV_ITEMS = mode === "public" ? PUBLIC_NAV : NAV;
  return (
    <>
      <div className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <aside className={`fixed left-0 top-0 z-50 h-screen w-[280px] bg-[#0A0A0D] border-r border-white/10 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-[64px] flex items-center justify-between px-5 border-b border-white/10">
          <span className="text-xs tracking-[0.2em] font-semibold">ZHONNEX CORP</span>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-64px)]">
          {NAV_ITEMS.map((item: any, i) =>
            item.divider ? (
              <div key={i} className="pt-4 pb-1 px-3 text-[10px] tracking-[0.18em] text-white/30 font-semibold">{item.label}</div>
            ) : (
              <Link key={item.label} href={item.href} onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition group">
                <item.icon className="w-4 h-4 text-white/60 group-hover:text-white" />
                <div>
                  <div className="text-[13px] font-medium leading-none">{item.label}</div>
                  {item.sub && <div className="text-[11px] text-white/40">{item.sub}</div>}
                </div>
              </Link>
            )
          )}
          <div className="pt-6 px-3">
            <div className="rounded-xl bg-white text-black p-4">
              <div className="text-xs font-bold tracking-widest">NEED HELP?</div>
              <div className="text-xs text-black/60 mt-1">Executive Support • WhatsApp</div>
              <a href="https://wa.me/2348000000000" target="_blank" className="mt-3 inline-flex w-full justify-center rounded-lg bg-black text-white py-2 text-xs font-semibold">Chat on WhatsApp</a>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}