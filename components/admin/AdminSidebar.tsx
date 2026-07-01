"use client";

import { ChevronRight, LogOut, X } from "lucide-react";
import type { ActiveTab, MenuItem } from "../../types/content";
import { LiquidShaderBackground } from "../ui/LiquidShaderBackground";

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
    <>
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseSidebar}
          aria-label="Tutup sidebar admin"
        />
      )}

      <aside
        id="admin-sidebar"
        aria-label="Sidebar admin"
        className={`fixed inset-y-0 left-0 z-[60] w-72 transform border-r border-white/5 bg-black/80 backdrop-blur-3xl transition-transform duration-300 lg:translate-x-0 overflow-hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-0 z-0 opacity-40">
          <LiquidShaderBackground />
        </div>
        <div className="relative z-10 flex h-full flex-col p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">
                I’m Nafis<span className="text-cyan-400">.</span>
              </h2>
              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-white/60">
                Admin Console
              </p>
            </div>

            <button
              type="button"
              onClick={onCloseSidebar}
              className={`rounded-xl p-2 text-white/80 transition hover:bg-white/5 hover:text-white lg:hidden ${focusRing}`}
              aria-label="Tutup sidebar admin"
              title="Tutup sidebar admin"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1" aria-label="Navigasi admin">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onChangeTab(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left transition-all ${focusRing} ${
                    isActive
                      ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-bold">{item.label}</span>
                  </div>

                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className={`transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={onSignOut}
            className={`mt-auto flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold text-white/80 transition hover:bg-red-500/10 hover:text-red-300 ${focusRing}`}
          >
            <LogOut size={20} aria-hidden="true" /> Logout Semua Perangkat
          </button>
        </div>
      </aside>
    </>
  );
}
