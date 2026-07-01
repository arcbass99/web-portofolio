"use client";

import { Menu } from "lucide-react";

type PublicNavbarProps = {
  focusRing: string;
  onOpenMenu: () => void;
  onLogoClick: () => void;
};

const navLinks = [
  { label: "Profil", id: "home" },
  { label: "Track Record", id: "track-record" },
  { label: "Karya", id: "portfolio" },
  { label: "Layanan", id: "services" },
];

export function PublicNavbar({
  focusRing,
  onOpenMenu,
  onLogoClick,
}: PublicNavbarProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed top-4 left-0 right-0 z-50 px-6 md:px-8 lg:px-16"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo — liquid-glass circle */}
        <button
          type="button"
          onClick={onLogoClick}
          className={`liquid-glass flex h-12 w-12 items-center justify-center rounded-full cursor-pointer ${focusRing}`}
          aria-label="I'm Nafis — kembali ke profil utama"
        >
          <span className="font-heading italic text-lg text-white">n</span>
        </button>

        {/* Center navigation — desktop only */}
        <div className="hidden lg:flex items-center">
          <div className="liquid-glass flex items-center rounded-full px-1.5 py-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className="cursor-pointer px-3 py-2 text-sm font-medium text-white/90 font-body transition-colors hover:text-white rounded-full"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                document
                  .querySelector("footer")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="ml-1 flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-white/90"
            >
              Hubungi
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 17L17 7M7 7h10v10"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMenu}
          className={`liquid-glass flex h-12 w-12 items-center justify-center rounded-full lg:hidden cursor-pointer ${focusRing}`}
          aria-label="Buka menu navigasi"
        >
          <Menu size={18} className="text-white" />
        </button>

        {/* Desktop spacer for balance */}
        <div className="hidden lg:block h-12 w-12" aria-hidden="true" />
      </div>
    </nav>
  );
}
