"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { smoothScrollToId, smoothScrollTo, smoothScrollToElement } from "../../lib/smoothScroll";
import { formatMediaUrl } from "../../lib/media";

type PublicNavbarProps = {
  focusRing: string;
  bannerUrl?: string;
  onOpenMenu: () => void;
};

const navLinks = [
  { label: "Profil", id: "home" },
  { label: "Track Record", id: "track-record" },
  { label: "Karya", id: "portfolio" },
  { label: "Layanan", id: "services" },
];

export function PublicNavbar({
  focusRing,
  bannerUrl,
  onOpenMenu,
}: PublicNavbarProps) {
  const [showPhoto, setShowPhoto] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const trackRecordEl = document.getElementById("track-record");
    if (!trackRecordEl || !bannerUrl) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setShowPhoto(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-60px 0px 0px 0px" },
    );

    observerRef.current.observe(trackRecordEl);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [bannerUrl]);

  // Fallback: also track scroll position beyond hero
  useEffect(() => {
    if (!bannerUrl) return;

    const handleScroll = () => {
      const trackRecordEl = document.getElementById("track-record");
      if (!trackRecordEl) return;
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

  const profileImageUrl = bannerUrl ? formatMediaUrl(bannerUrl, 96) : "";

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed top-4 left-0 right-0 z-50 px-6 md:px-8 lg:px-16"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo — liquid-glass circle → transitions to profile photo */}
        <button
          type="button"
          onClick={() => scrollTo("home")}
          className={`relative flex h-12 w-12 items-center justify-center rounded-full cursor-pointer transition-all duration-500 ${focusRing}`}
          aria-label="I'm Nafis — kembali ke profil utama"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          {/* "n" text — fades out when photo appears */}
          <span
            className={`font-heading italic text-lg text-white absolute inset-0 flex items-center justify-center transition-all duration-500 ${
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
                sizes="48px"
                className="object-cover rounded-full"
              />
            </span>
          )}
        </button>

        {/* Center navigation — desktop only */}
        <div className="hidden lg:flex items-center">
          <div
            className="flex items-center rounded-full px-1.5 py-1.5"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
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
                smoothScrollToElement(document.querySelector("footer"));
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
          className={`flex h-12 w-12 items-center justify-center rounded-full lg:hidden cursor-pointer ${focusRing}`}
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
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
