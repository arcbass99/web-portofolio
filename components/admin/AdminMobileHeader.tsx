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
    <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/5 bg-slate-950/90 px-5 py-3.5 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className={`-ml-2 rounded-xl p-2 text-slate-300 transition hover:bg-white/5 hover:text-white ${focusRing}`}
          aria-label="Buka sidebar admin"
          aria-controls="admin-sidebar"
          aria-expanded={isSidebarOpen}
          title="Buka sidebar admin"
        >
          <Menu size={24} aria-hidden="true" />
        </button>

        <h2 className="text-base font-black tracking-tight">
          I’m Nafis<span className="text-cyan-400">.</span>
          <span className="ml-1 text-[10px] uppercase tracking-widest text-slate-400">
            Admin
          </span>
        </h2>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        className={`-mr-2 rounded-xl p-2 text-red-300 transition hover:bg-red-500/10 hover:text-red-200 ${focusRing}`}
        aria-label="Logout dari semua perangkat"
        title="Logout dari semua perangkat"
      >
        <LogOut size={20} aria-hidden="true" />
      </button>
    </header>
  );
}
