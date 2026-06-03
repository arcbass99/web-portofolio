"use client";

import { useState } from "react";
import { PUBLIC_FOCUS_RING } from "../../lib/constants";
import type {
  AboutMe,
  PortfolioItem,
  ProfileHighlight,
  ServiceItem,
  SocialLink,
} from "../../types/content";
import { PublicBackground } from "./PublicBackground";
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
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const focusRing = PUBLIC_FOCUS_RING;

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
    <div
      className={`relative min-h-screen overflow-hidden font-sans transition-colors duration-700 ${
        isDark ? "bg-[#0B0C10] text-white" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      <PublicBackground isDark={isDark} />

      <PublicNavbar
        isDark={isDark}
        focusRing={focusRing}
        onToggleTheme={() => setIsDark((current) => !current)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onLogoClick={() => scrollToSection("home")}
      />

      <PublicMenuOverlay
        isDark={isDark}
        isOpen={isMenuOpen}
        highlightsCount={highlights.length}
        servicesCount={services.length}
        focusRing={focusRing}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={scrollToSection}
      />

      <main id="main-content" className="relative z-10">
        <PublicErrorNotice error={publicError} isDark={isDark} />

        <HeroSection
          about={about}
          socials={socials}
          contactHref={contactHref}
          contactLabel={contactLabel}
          isDark={isDark}
          isExternalContact={isExternalContact}
          focusRing={focusRing}
        />

        {highlights.length > 0 && (
          <TrackRecordSection highlights={highlights} isDark={isDark} />
        )}

        <PortfolioSection portfolios={portfolios} isDark={isDark} />

        {services.length > 0 && (
          <ServicesSection
            services={services}
            isDark={isDark}
            focusRing={focusRing}
          />
        )}

        <PublicFooter
          isDark={isDark}
          contactHref={contactHref}
          contactLabel={contactLabel}
          isExternalContact={isExternalContact}
          focusRing={focusRing}
        />
      </main>
    </div>
  );
}
