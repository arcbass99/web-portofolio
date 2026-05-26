"use client";

import { LogOut, Menu } from "lucide-react";

type AdminMobileHeaderProps = {
  focusRing: string;
  onOpenSidebar: () => void;
  onSignOut: () => void;
};

export function AdminMobileHeader({
  focusRing,
  onOpenSidebar,
  onSignOut,
}: AdminMobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/5 z-50 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-xl"
          aria-label="Buka sidebar admin"
          aria-controls="admin-sidebar"
        >
          <Menu size={24} />
        </button>

        <h2 className="font-black tracking-tighter text-lg">
          NAFIS<span className="text-cyan-400">.</span>ADMIN
        </h2>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        className={`p-2 -mr-2 rounded-xl text-red-400 ${focusRing}`}
        aria-label="Logout dari semua perangkat"
        title="Logout dari semua perangkat"
      >
        <LogOut size={20} />
      </button>
    </header>
  );
}
