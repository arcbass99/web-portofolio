"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getErrorMessage } from "../lib/errors";
import { PUBLIC_FOCUS_RING } from "../lib/constants";
import type {
  AboutMe,
  PortfolioItem,
  ProfileHighlight,
  ServiceItem,
  SocialLink,
} from "../types/content";
import { PublicBackground } from "../components/public/PublicBackground";
import { PublicErrorNotice } from "../components/public/PublicErrorNotice";
import { PublicFooter } from "../components/public/PublicFooter";
import { PublicMenuOverlay } from "../components/public/PublicMenuOverlay";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { HeroSection } from "../components/public/HeroSection";
import { PortfolioSection } from "../components/public/PortfolioSection";
import { ServicesSection } from "../components/public/ServicesSection";
import { TrackRecordSection } from "../components/public/TrackRecordSection";

export default function LandingPage() {
  const [about, setAbout] = useState<AboutMe | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [highlights, setHighlights] = useState<ProfileHighlight[]>([]);
  const [publicError, setPublicError] = useState<string | null>(null);

  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const focusRing = PUBLIC_FOCUS_RING;

  const fetchPublicData = useCallback(async () => {
    try {
      const [aboutRes, socialRes, portRes, servRes, highlightRes] =
        await Promise.all([
          supabase.from("about_me").select("*").maybeSingle(),
          supabase.from("social_links").select("*"),
          supabase
            .from("portfolio")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false }),
          supabase
            .from("services")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("id", { ascending: true }),
          supabase
            .from("profile_highlights")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("id", { ascending: true }),
        ]);

      if (aboutRes.error) throw aboutRes.error;
      if (socialRes.error) throw socialRes.error;
      if (portRes.error) throw portRes.error;
      if (servRes.error) throw servRes.error;
      if (highlightRes.error) throw highlightRes.error;

      setPublicError(null);
      setAbout(aboutRes.data as AboutMe | null);
      setSocials((socialRes.data || []) as SocialLink[]);
      setPortfolios((portRes.data || []) as PortfolioItem[]);
      setServices((servRes.data || []) as ServiceItem[]);
      setHighlights((highlightRes.data || []) as ProfileHighlight[]);
    } catch (error) {
      setPublicError(
        getErrorMessage(error, "Data belum berhasil dimuat sepenuhnya."),
      );
    }
  }, []);

  useEffect(() => {
    const fetchTimer = window.setTimeout(() => {
      void fetchPublicData();
    }, 0);

    return () => window.clearTimeout(fetchTimer);
  }, [fetchPublicData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getContactPriority = (social: SocialLink) => {
    const title = social.title?.toLowerCase() || "";
    const url = social.url?.toLowerCase() || "";

    if (title.includes("whatsapp") || title.includes("wa") || url.includes("wa.me")) {
      return 1;
    }

    if (title.includes("email") || title.includes("mail") || url.includes("mailto:")) {
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
      .sort((first, second) => getContactPriority(first) - getContactPriority(second))[0] ||
    null;

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
      className={`relative min-h-screen transition-colors duration-700 overflow-hidden font-sans ${
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
          <TrackRecordSection
            highlights={highlights}
            isDark={isDark}
          />
        )}

        <PortfolioSection
          portfolios={portfolios}
          isDark={isDark}
        />

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
