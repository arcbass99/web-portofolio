"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, LogOut } from "lucide-react";
import type { ActiveTab, MenuItem } from "../../types/content";

type AdminSidebarProps = {
  activeTab: ActiveTab;
  focusRing: string;
  menuItems: MenuItem[];
  onChangeTab: (tab: ActiveTab) => void;
  onSignOut: () => void;
};

export function AdminSidebar({
  activeTab,
  focusRing,
  menuItems,
  onChangeTab,
  onSignOut,
}: AdminSidebarProps) {
  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-3 pb-2">
      <div className="mx-auto max-w-6xl">
        <div className="apple-liquid-glass flex flex-col gap-2.5 rounded-2xl px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-4 sm:py-2">
          {/* Left: Brand identity */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-black font-heading font-semibold text-xs shadow-sm">
                N
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-xs sm:text-sm font-heading font-semibold tracking-tight text-white">
                  I&apos;m Nafis<span className="text-blue-400">.</span>
                </h2>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-body font-medium uppercase tracking-wider text-blue-300">
                  Console
                </span>
              </div>
            </div>

            {/* Mobile right actions */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80 transition hover:bg-white/15 hover:text-white ${focusRing}`}
                title="Lihat Halaman Publik"
              >
                <span>Web</span>
                <ExternalLink size={11} />
              </Link>
              <button
                type="button"
                onClick={onSignOut}
                className={`inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-1.5 text-white/70 transition hover:bg-red-500/15 hover:text-red-300 ${focusRing}`}
                aria-label="Logout dari semua perangkat"
                title="Logout dari semua perangkat"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>

          {/* Center: Compact Segmented Navigation Tabs */}
          <nav
            aria-label="Navigasi admin"
            className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onChangeTab(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${focusRing} ${
                    isActive
                      ? "text-black font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="admin-active-tab-pill"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-full bg-white shadow-[0_2px_12px_rgba(255,255,255,0.3)]"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.icon}
                    <span>{item.label}</span>
                    {typeof item.count === "number" && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold leading-tight ${
                          isActive
                            ? "bg-black/10 text-black"
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right: Desktop Quick Actions */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/15 hover:text-white ${focusRing}`}
              title="Buka halaman publik di tab baru"
            >
              <span>Lihat Web</span>
              <ExternalLink size={12} />
            </Link>

            <button
              type="button"
              onClick={onSignOut}
              className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition hover:border-red-500/30 hover:bg-red-500/15 hover:text-red-300 cursor-pointer ${focusRing}`}
              title="Logout dari semua perangkat"
            >
              <LogOut size={13} aria-hidden="true" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
