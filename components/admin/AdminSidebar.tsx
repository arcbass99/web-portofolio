"use client";

import { ChevronRight, LogOut, X } from "lucide-react";
import type { ActiveTab, MenuItem } from "../../types/content";

type AdminSidebarProps = {
  activeTab: ActiveTab;
  focusRing: string;
  isSidebarOpen: boolean;
  menuItems: MenuItem[];
  onChangeTab: (tab: ActiveTab) => void;
  onCloseSidebar: () => void;
  onSignOut: () => void;
};

export function AdminSidebar({
  activeTab,
  focusRing,
  isSidebarOpen,
  menuItems,
  onChangeTab,
  onCloseSidebar,
  onSignOut,
}: AdminSidebarProps) {
  return (
    <div
      id="admin-sidebar"
      className={`fixed inset-y-0 left-0 z-[60] w-72 bg-slate-950/95 border-r border-white/5 backdrop-blur-xl transform transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-black tracking-tight text-white">
              I’m Nafis<span className="text-cyan-400">.</span>
            </h2>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Admin Console
            </p>
          </div>

          <button
            type="button"
            onClick={onCloseSidebar}
            className={`lg:hidden p-2 rounded-xl text-slate-500 ${focusRing}`}
            aria-label="Tutup sidebar admin"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 flex-1" aria-label="Navigasi admin">
          {menuItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              aria-current={activeTab === item.id ? "page" : undefined}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all group ${focusRing} ${
                activeTab === item.id
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-bold text-sm">{item.label}</span>
              </div>

              <ChevronRight
                size={16}
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                  activeTab === item.id ? "opacity-100" : ""
                }`}
              />
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={onSignOut}
          className={`flex items-center gap-3 rounded-2xl text-slate-500 hover:text-red-400 px-3.5 py-3 mt-auto transition font-bold text-sm ${focusRing}`}
        >
          <LogOut size={20} /> Logout Semua Perangkat
        </button>
      </div>
    </div>
  );
}
