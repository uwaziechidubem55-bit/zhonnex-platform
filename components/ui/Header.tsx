"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/[0.07]">
      <div className="mx-auto max-w-[1280px] px-6 h-[64px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenu}
            aria-label="Toggle menu"
            className="w-9 h-9 grid place-items-center rounded-lg border border-white/10 hover:bg-white/10 transition"
          >
            <Menu className="w-4 h-4" />
          </button>
          <Link href="/" className="tracking-[0.18em] text-[11px] md:text-xs font-semibold text-white/90">
            ELITE ACADEMY <span className="text-white/40 font-normal">| a division of ZHONNEX CORP</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px] tracking-widest text-white/60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse" />
          SYSTEM ONLINE • LAGOS • 2025
        </div>
      </div>
    </header>
  );
}
