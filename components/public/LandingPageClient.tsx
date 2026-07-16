"use client";

import { useState, useEffect } from "react";
import { PUBLIC_FOCUS_RING } from "../../lib/constants";
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

type LandingPageClientProps = {
  about: AboutMe | null;
  socials: SocialLink[];
  portfolios: PortfolioItem[];
  services: ServiceItem[];
  highlights: ProfileHighlight[];
  publicError: string | null;
};

export function LandingPageClient({
  about,
  socials,
  portfolios,
  services,
  highlights,
  publicError,
}: LandingPageClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const getContactPriority = (social: SocialLink) => {
    const title = social.title?.toLowerCase() || "";
    const url = social.url?.toLowerCase() || "";

    if (
      title.includes("whatsapp") ||
      title.includes("wa") ||
      url.includes("wa.me")
    ) {
      return 1;
    }

    if (
      title.includes("email") ||
      title.includes("mail") ||
      url.includes("mailto:")
    ) {
      return 2;
    }

    if (title.includes("instagram") || title.includes("ig")) {
      return 3;
    }

    return 10;
  };

  const primaryContact =
    [...socials]
      .filter((social) => Boolean(social.url))
      .sort(
        (first, second) =>
          getContactPriority(first) - getContactPriority(second),
      )[0] || null;

  const contactTitle = primaryContact?.title?.toLowerCase() || "";
  const contactUrl = primaryContact?.url?.toLowerCase() || "";
  const isWhatsappContact =
    contactTitle.includes("whatsapp") ||
    contactTitle.includes("wa") ||
    contactUrl.includes("wa.me");
  const isEmailContact =
    contactTitle.includes("email") ||
    contactTitle.includes("mail") ||
    contactUrl.includes("mailto:");
  const isInstagramContact =
    contactTitle.includes("instagram") || contactTitle.includes("ig");

  const contactHref = primaryContact?.url || "#track-record";
  const isExternalContact = Boolean(primaryContact?.url);
  const contactLabel = primaryContact
    ? isWhatsappContact
      ? "Hubungi via WhatsApp"
      : isEmailContact
        ? "Kirim Email"
        : isInstagramContact
          ? "Hubungi via Instagram"
          : "Hubungi Saya"
    : "Jelajahi Profil";

  return (
    <div className="relative min-h-screen bg-black text-white font-body overflow-x-clip">
      <PublicNavbar
        focusRing={focusRing}
        bannerUrl={about?.banner_url || ""}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      <PublicMenuOverlay
        isOpen={isMenuOpen}
        highlightsCount={highlights.length}
        servicesCount={services.length}
        focusRing={focusRing}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={scrollToSection}
      />

      <main id="main-content" className="relative z-10">
        {publicError && (
          <div className="absolute top-24 left-0 right-0 z-50">
            <PublicErrorNotice error={publicError} />
          </div>
        )}

        {/* Hero Section (Delayed Parallax) */}
        <div className="sticky top-[-60vh] lg:top-[-40vh] z-0">
          <HeroSection
            about={about}
            socials={socials}
            portfolioCount={portfolios.length}
            contactHref={contactHref}
            contactLabel={contactLabel}
            isExternalContact={isExternalContact}
            focusRing={focusRing}
          />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 bg-black shadow-[0_-20px_50px_rgba(0,0,0,0.8)] rounded-t-[2.5rem]">
          {highlights.length > 0 && (
            <TrackRecordSection highlights={highlights} />
          )}

          <PortfolioSection portfolios={portfolios} />

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
