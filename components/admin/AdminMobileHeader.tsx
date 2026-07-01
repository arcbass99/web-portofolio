"use client";

import { LogOut, Menu } from "lucide-react";

type AdminMobileHeaderProps = {
  focusRing: string;
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  onSignOut: () => void;
};

export function AdminMobileHeader({
  focusRing,
  isSidebarOpen,
  onOpenSidebar,
  onSignOut,
}: AdminMobileHeaderProps) {
  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-[#333] bg-[#0a0a0a]/90 px-5 py-3.5 backdrop-blur-3xl lg:hidden liquid-glass-strong">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className={`-ml-2 rounded-xl p-2 text-white/80 transition hover:bg-white/5 hover:text-white ${focusRing}`}
          aria-label="Buka sidebar admin"
          aria-controls="admin-sidebar"
          aria-expanded={isSidebarOpen}
          title="Buka sidebar admin"
        >
          <Menu size={24} aria-hidden="true" />
        </button>

        <h2 className="text-base font-heading italic font-black tracking-tight text-white">
          I’m Nafis<span className="text-white/40">.</span>
          <span className="ml-2 font-sans text-[10px] uppercase tracking-widest text-white/60">
            Admin
          </span>
        </h2>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        className={`-mr-2 rounded-xl p-2 text-white/60 transition hover:bg-white/10 hover:text-white ${focusRing}`}
        aria-label="Logout dari semua perangkat"
        title="Logout dari semua perangkat"
      >
        <LogOut size={20} aria-hidden="true" />
      </button>
    </header>
  );
}
