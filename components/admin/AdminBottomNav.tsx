"use client";

import type { ActiveTab, MenuItem } from "../../types/content";

type AdminBottomNavProps = {
  activeTab: ActiveTab;
  focusRing: string;
  menuItems: MenuItem[];
  onChangeTab: (tab: ActiveTab) => void;
};

export function AdminBottomNav({
  activeTab,
  focusRing,
  menuItems,
  onChangeTab,
}: AdminBottomNavProps) {
  return (
    <nav
      className="lg:hidden fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-xl border-t border-white/5 z-50 grid grid-flow-col auto-cols-fr gap-1 px-1.5 py-2.5"
      aria-label="Navigasi bawah admin"
    >
      {menuItems.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => onChangeTab(item.id)}
          aria-current={activeTab === item.id ? "page" : undefined}
          className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-all ${focusRing} ${
            activeTab === item.id ? "text-cyan-400" : "text-slate-500"
          }`}
        >
          {item.icon}
          <span className="max-w-full truncate text-[9px] font-black uppercase leading-none tracking-tight">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
