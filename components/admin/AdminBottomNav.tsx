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
      className="fixed bottom-0 z-50 grid w-full grid-flow-col auto-cols-fr gap-0.5 border-t border-white/10 bg-[#141619]/95 px-1 py-1.5 backdrop-blur-2xl lg:hidden"
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
            className={`flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-1.5 transition-all ${focusRing} ${
              isActive ? "text-white font-semibold" : "text-white/40 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="max-w-full truncate text-[9px] uppercase leading-none tracking-tight font-body">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
