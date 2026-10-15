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
    <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-[#141619]/95 px-4 py-2.5 backdrop-blur-2xl lg:hidden">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenSidebar}
          className={`-ml-1 rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white ${focusRing}`}
          aria-label="Buka sidebar admin"
          aria-controls="admin-sidebar"
          aria-expanded={isSidebarOpen}
          title="Buka sidebar admin"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <h2 className="text-sm font-heading font-semibold tracking-tight text-white">
          I’m Nafis<span className="text-blue-400">.</span>
          <span className="ml-2 font-body text-[10px] font-medium uppercase tracking-wider text-white/50">
            Admin
          </span>
        </h2>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        className={`-mr-1 rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white ${focusRing}`}
        aria-label="Logout dari semua perangkat"
        title="Logout dari semua perangkat"
      >
        <LogOut size={18} aria-hidden="true" />
      </button>
    </header>
  );
}
