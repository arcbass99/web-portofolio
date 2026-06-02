"use client";

import { Menu, Moon, Sun } from "lucide-react";

type PublicNavbarProps = {
  isDark: boolean;
  focusRing: string;
  onToggleTheme: () => void;
  onOpenMenu: () => void;
  onLogoClick: () => void;
};

export function PublicNavbar({
  isDark,
  focusRing,
  onToggleTheme,
  onOpenMenu,
  onLogoClick,
}: PublicNavbarProps) {
  return (
    <nav
      aria-label="Navigasi utama"
      className={`fixed top-0 w-full z-40 transition-all duration-300 backdrop-blur-md border-b ${
        isDark ? "bg-black/20 border-white/5" : "bg-white/30 border-white/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-24 py-3.5 md:py-4 flex justify-between items-center">
        <button
          type="button"
          className={`font-black text-lg md:text-xl tracking-tighter cursor-pointer rounded-lg ${focusRing}`}
          onClick={onLogoClick}
          aria-label="I’m Nafis — kembali ke bagian profil utama"
        >
          I’m Nafis
          <span className={isDark ? "text-cyan-400" : "text-teal-600"}>.</span>
        </button>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            className={`p-2.5 md:p-3 rounded-full backdrop-blur-md border transition-all ${focusRing} ${
              isDark
                ? "bg-white/10 border-white/10 text-yellow-300"
                : "bg-white/50 border-white/50 text-slate-600 hover:bg-white"
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Buka menu navigasi"
            className={`p-2.5 md:p-3 rounded-full backdrop-blur-md border transition-all ${focusRing} ${
              isDark
                ? "bg-white/10 border-white/10 hover:bg-white/20"
                : "bg-white/50 border-white/50 hover:bg-white"
            }`}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
