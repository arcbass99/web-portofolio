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
      className="fixed bottom-0 z-50 grid w-full grid-flow-col auto-cols-fr gap-1 border-t border-white/5 bg-slate-950/95 px-1.5 py-2.5 backdrop-blur-xl lg:hidden"
      aria-label="Navigasi bawah admin"
    >
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            aria-current={isActive ? "page" : undefined}
            aria-label={`Buka tab ${item.label}`}
            title={`Buka tab ${item.label}`}
            className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-all ${focusRing} ${
              isActive ? "text-cyan-300" : "text-slate-400"
            }`}
          >
            {item.icon}
            <span className="max-w-full truncate text-[9px] font-black uppercase leading-none tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
