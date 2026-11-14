"use client";

import { useState, useEffect, useMemo } from "react";
import { PUBLIC_FOCUS_RING } from "../../lib/constants";
import { resolvePrimaryContact } from "../../lib/contact";
import { trackOncePerSession } from "../../lib/metrics-client";
import { smoothScrollToId, smoothScrollTo } from "../../lib/smoothScroll";
import type {
  AboutMe,
  PortfolioItem,
  ProfileHighlight,
  ServiceItem,
  SocialLink,
} from "../../types/content";
import { PublicErrorNotice } from "./PublicErrorNotice";
import { PublicFooter } from "./PublicFooter";
import { PublicMenuOverlay } from "./PublicMenuOverlay";
import { PublicNavbar } from "./PublicNavbar";
import { HeroSection } from "./HeroSection";
import { PortfolioSection } from "./PortfolioSection";
import { ServicesSection } from "./ServicesSection";
import { TrackRecordSection } from "./TrackRecordSection";
import { CloudCompanion } from "./CloudCompanion";
import { AmbientAuroraOrb } from "../ui/AmbientAuroraOrb";

type LandingPageClientProps = {
  about: AboutMe | null;
  socials: SocialLink[];
  portfolios: PortfolioItem[];
  totalGalleryCount: number;
  initialClaps: Record<string, number>;
  services: ServiceItem[];
  highlights: ProfileHighlight[];
  publicError: string | null;
};

export function LandingPageClient({
  about,
  socials,
  portfolios,
  totalGalleryCount,
  initialClaps,
  services,
  highlights,
  publicError,
}: LandingPageClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    trackOncePerSession("pv_home", { type: "pageview", page: "home" });
  }, []);

  useEffect(() => {
    const mediaTags = new Set(["IMG", "VIDEO", "CANVAS", "IFRAME"]);
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (mediaTags.has(target.tagName)) {
        e.preventDefault();
      }
    };
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (mediaTags.has(target.tagName)) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  // Handle URL hash navigation on mount (including legacy #portfolio alias)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const rawHash = window.location.hash.replace("#", "");
      const hashId = rawHash === "portfolio" ? "galeri" : rawHash;
      if (hashId) {
        const timer = setTimeout(() => {
          smoothScrollToId(hashId);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const focusRing = PUBLIC_FOCUS_RING;

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);

    setTimeout(() => {
      if (id === "home") {
        smoothScrollTo(0);
      } else {
        smoothScrollToId(id);
      }
    }, 100);
  };

  const {
    href: contactHref,
    label: contactLabel,
    isExternal: isExternalContact,
  } = resolvePrimaryContact(socials, "#track-record");

  const sifanContext = useMemo(
    () => ({
      page: "home" as const,
      aboutHeadline: about?.headline || undefined,
      highlightsCount: highlights.length,
      featuredTitles: portfolios
        .slice(0, 3)
        .map((p) => p.title)
        .filter((t): t is string => Boolean(t)),
      totalGalleryCount,
      servicesTitles: services
        .slice(0, 3)
        .map((s) => s.title)
        .filter((t): t is string => Boolean(t)),
    }),
    [about?.headline, highlights.length, portfolios, totalGalleryCount, services],
  );

  return (
    <div className="relative min-h-screen bg-[#0b0d0e] text-white font-body overflow-x-clip">
      <PublicNavbar
        focusRing={focusRing}
        bannerUrl={about?.banner_url || ""}
        highlightsCount={highlights.length}
        servicesCount={services.length}
        currentPage="home"
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      <PublicMenuOverlay
        isOpen={isMenuOpen}
        highlightsCount={highlights.length}
        servicesCount={services.length}
        currentPage="home"
        focusRing={focusRing}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={scrollToSection}
      />

      {/* Interactive Expressive Cloud Companion (Sifan 2.0) */}
      <CloudCompanion context={sifanContext} />

      <main id="main-content" className="relative z-10">
        {publicError && (
          <div className="absolute top-20 left-0 right-0 z-50">
            <PublicErrorNotice error={publicError} />
          </div>
        )}

        {/* Hero Section (Delayed Parallax) */}
        <div className="sticky top-[-90vh] lg:top-[-40vh] z-0">
          <HeroSection
            about={about}
            socials={socials}
            portfolioCount={totalGalleryCount}
            contactHref={contactHref}
            contactLabel={contactLabel}
            isExternalContact={isExternalContact}
            focusRing={focusRing}
          />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 bg-[#0b0d0e] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] rounded-t-[2rem]">
          {/* Subtle Ambient Cosmic Orb between sections */}
          <AmbientAuroraOrb
            variant="emerald"
            size="sm"
            className="top-1/3 -right-16 opacity-30"
            duration={28}
          />

          {highlights.length > 0 && (
            <TrackRecordSection highlights={highlights} />
          )}

          <PortfolioSection
            portfolios={portfolios}
            totalCount={totalGalleryCount}
            initialClaps={initialClaps}
          />

          {services.length > 0 && (
            <ServicesSection services={services} focusRing={focusRing} />
          )}

          <PublicFooter
            contactHref={contactHref}
            contactLabel={contactLabel}
            isExternalContact={isExternalContact}
            focusRing={focusRing}
          />
        </div>
      </main>
    </div>
  );
}
