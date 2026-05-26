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
      className="lg:hidden fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-xl border-t border-white/5 z-50 px-2 py-2 flex justify-around items-center"
      aria-label="Navigasi bawah admin"
    >
      {menuItems.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => onChangeTab(item.id)}
          aria-current={activeTab === item.id ? "page" : undefined}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${focusRing} ${
            activeTab === item.id ? "text-cyan-400" : "text-slate-500"
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-black uppercase tracking-tighter">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
