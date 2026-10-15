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
        className={`fixed inset-y-0 left-0 z-[60] w-64 transform border-r border-white/10 bg-[#141619] backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 overflow-hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative z-10 flex h-full flex-col p-5">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-heading font-semibold tracking-tight text-white">
                I’m Nafis<span className="text-blue-400">.</span>
              </h2>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-white/50 font-body">
                Admin Console
              </p>
            </div>

            <button
              type="button"
              onClick={onCloseSidebar}
              className={`rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white lg:hidden ${focusRing}`}
              aria-label="Tutup sidebar admin"
              title="Tutup sidebar admin"
            >
              <X size={18} />
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
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${focusRing} ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-md"
                      : "text-white/70 hover:bg-white/5 hover:text-white font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span className="text-xs sm:text-sm">{item.label}</span>
                  </div>

                  <ChevronRight
                    size={14}
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
            className={`mt-auto flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-red-500/10 hover:text-red-300 ${focusRing}`}
          >
            <LogOut size={16} aria-hidden="true" /> Logout Semua Perangkat
          </button>
        </div>
      </aside>
    </>
  );
}
