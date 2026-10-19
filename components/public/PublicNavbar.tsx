"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, ArrowUpRight } from "lucide-react";
import { smoothScrollToId, smoothScrollTo, smoothScrollToElement } from "../../lib/smoothScroll";
import { formatMediaUrl } from "../../lib/media";
import { GoogleCtaButton } from "../ui/GoogleCtaButton";

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
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

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
    <>
      {/* Hidden SVG Filter for Apple-Style Optical Liquid Refraction */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed h-0 w-0 opacity-0"
      >
        <defs>
          <filter
            id="apple-liquid-refraction"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.014 0.018"
              numOctaves="2"
              seed="4"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2.5" result="smoothNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothNoise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <nav
        aria-label="Navigasi utama"
        className="fixed left-0 right-0 z-50 px-4 md:px-8 lg:px-12"
        style={{ top: "max(0.75rem, env(safe-area-inset-top, 0.75rem))" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {/* Logo — Apple liquid-glass circle → transitions to profile photo */}
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className={`apple-liquid-glass relative flex h-10 w-10 items-center justify-center rounded-full cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 ${focusRing}`}
            aria-label="I'm Nafis — kembali ke profil utama"
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

          {/* Center navigation — Apple Liquid Blur Pill */}
          <div className="hidden lg:flex items-center">
            <div
              onMouseLeave={() => setHoveredNav(null)}
              className="apple-liquid-glass flex items-center rounded-full p-1 gap-0.5"
            >
              {/* Subtle specular liquid sheen across top */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
              />

              {navLinks.map((link) => {
                const isHovered = hoveredNav === link.id;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onMouseEnter={() => setHoveredNav(link.id)}
                    onClick={() => scrollTo(link.id)}
                    className={`relative z-10 cursor-pointer px-3.5 py-1.5 text-xs font-medium font-body transition-colors duration-200 rounded-full ${
                      isHovered ? "text-white" : "text-white/85 hover:text-white"
                    } ${focusRing}`}
                  >
                    {isHovered && (
                      <motion.span
                        layoutId="navbar-liquid-droplet"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="absolute inset-0 -z-10 rounded-full bg-white/14 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_2px_8px_rgba(0,0,0,0.2)]"
                      />
                    )}
                    {link.label}
                  </button>
                );
              })}

              <GoogleCtaButton
                onClick={() => {
                  smoothScrollToElement(document.querySelector("footer"));
                }}
                variant="light"
                size="sm"
                className="ml-0.5"
                focusRing={focusRing}
              >
                <span>Hubungi</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </GoogleCtaButton>
            </div>
          </div>

          {/* Mobile menu button — Apple Liquid Blur */}
          <button
            type="button"
            onClick={onOpenMenu}
            className={`apple-liquid-glass flex h-10 w-10 items-center justify-center rounded-full lg:hidden cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 ${focusRing}`}
            aria-label="Buka menu navigasi"
          >
            <Menu size={16} className="text-white" />
          </button>

          {/* Desktop spacer for balance */}
          <div className="hidden lg:block h-10 w-10" aria-hidden="true" />
        </div>
      </nav>
    </>
  );
}
