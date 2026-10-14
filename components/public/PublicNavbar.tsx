"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { smoothScrollToId, smoothScrollTo, smoothScrollToElement } from "../../lib/smoothScroll";
import { formatMediaUrl } from "../../lib/media";

type PublicNavbarProps = {
  focusRing: string;
  bannerUrl?: string;
  highlightsCount?: number;
  servicesCount?: number;
  onOpenMenu: () => void;
};

export function PublicNavbar({
  focusRing,
  bannerUrl,
  highlightsCount = 0,
  servicesCount = 0,
  onOpenMenu,
}: PublicNavbarProps) {
  const [showPhoto, setShowPhoto] = useState(false);

  const navLinks = [
    { label: "Profil", id: "home" },
    ...(highlightsCount > 0
      ? [{ label: "Track Record", id: "track-record" }]
      : []),
    { label: "Karya", id: "portfolio" },
    ...(servicesCount > 0
      ? [{ label: "Layanan", id: "services" }]
      : []),
  ];

  // Track scroll position to show/hide profile photo
  useEffect(() => {
    if (!bannerUrl) return;

    const handleScroll = () => {
      const trackRecordEl = document.getElementById("track-record");
      if (!trackRecordEl) {
        const portfolioEl = document.getElementById("portfolio");
        if (portfolioEl) {
          setShowPhoto(portfolioEl.getBoundingClientRect().top <= 80);
        }
        return;
      }
      const rect = trackRecordEl.getBoundingClientRect();
      setShowPhoto(rect.top <= 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [bannerUrl]);

  const scrollTo = (id: string) => {
    if (id === "home") {
      smoothScrollTo(0);
    } else {
      smoothScrollToId(id);
    }
  };

  const profileImageUrl = bannerUrl ? formatMediaUrl(bannerUrl, 80) : "";

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed left-0 right-0 z-50 px-4 md:px-8 lg:px-12"
      style={{ top: "max(0.75rem, env(safe-area-inset-top, 0.75rem))" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo — liquid-glass circle → transitions to profile photo */}
        <button
          type="button"
          onClick={() => scrollTo("home")}
          className={`relative flex h-10 w-10 items-center justify-center rounded-full cursor-pointer transition-all duration-500 ${focusRing}`}
          aria-label="I'm Nafis — kembali ke profil utama"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          {/* "n" text — fades out when photo appears */}
          <span
            className={`font-heading font-semibold text-base text-white absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              showPhoto ? "opacity-0 scale-75" : "opacity-100 scale-100"
            }`}
          >
            n
          </span>

          {/* Profile photo — fades in when entering track-record zone */}
          {profileImageUrl && (
            <span
              className={`absolute inset-0 rounded-full overflow-hidden transition-all duration-500 ${
                showPhoto ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              <Image
                src={profileImageUrl}
                alt="Foto profil"
                fill
                sizes="40px"
                className="object-cover rounded-full"
              />
            </span>
          )}
        </button>

        {/* Center navigation — desktop only (Compact Pill) */}
        <div className="hidden lg:flex items-center">
          <div
            className="flex items-center rounded-full px-1 py-1"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className="cursor-pointer px-3 py-1.5 text-xs font-medium text-white/90 font-body transition-colors hover:text-white rounded-full"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                smoothScrollToElement(document.querySelector("footer"));
              }}
              className="ml-1 flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-all hover:bg-white/90"
            >
              Hubungi
              <svg
                className="h-3.5 w-3.5"
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
          className={`flex h-10 w-10 items-center justify-center rounded-full lg:hidden cursor-pointer ${focusRing}`}
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
          aria-label="Buka menu navigasi"
        >
          <Menu size={16} className="text-white" />
        </button>

        {/* Desktop spacer for balance */}
        <div className="hidden lg:block h-10 w-10" aria-hidden="true" />
      </div>
    </nav>
  );
}
