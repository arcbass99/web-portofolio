"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getErrorMessage } from "../lib/errors";
import type {
  AboutMe,
  PortfolioItem,
  ServiceItem,
  SocialLink,
} from "../types/content";
import { PublicBackground } from "../components/public/PublicBackground";
import { PublicErrorNotice } from "../components/public/PublicErrorNotice";
import { PublicFooter } from "../components/public/PublicFooter";
import { PublicLoadingScreen } from "../components/public/PublicLoadingScreen";
import { PublicMenuOverlay } from "../components/public/PublicMenuOverlay";
import { PublicNavbar } from "../components/public/PublicNavbar";
import { HeroSection } from "../components/public/HeroSection";
import { PortfolioSection } from "../components/public/PortfolioSection";
import { ServicesSection } from "../components/public/ServicesSection";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState<AboutMe | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [publicError, setPublicError] = useState<string | null>(null);

  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

  const fetchPublicData = useCallback(async () => {
    try {
      setPublicError(null);

      const [aboutRes, socialRes, portRes, servRes] = await Promise.all([
        supabase.from("about_me").select("*").maybeSingle(),
        supabase.from("social_links").select("*"),
        supabase
          .from("portfolio")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("services").select("*"),
      ]);

      if (aboutRes.error) throw aboutRes.error;
      if (socialRes.error) throw socialRes.error;
      if (portRes.error) throw portRes.error;
      if (servRes.error) throw servRes.error;

      setAbout(aboutRes.data as AboutMe | null);
      setSocials((socialRes.data || []) as SocialLink[]);
      setPortfolios((portRes.data || []) as PortfolioItem[]);
      setServices((servRes.data || []) as ServiceItem[]);
    } catch (error) {
      setPublicError(
        getErrorMessage(error, "Data belum berhasil dimuat sepenuhnya."),
      );
    } finally {
      setLoading(false);
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

  const primaryContact =
    socials.find((social) => social.title?.toLowerCase().includes("instagram")) ||
    socials[0] ||
    null;

  const contactHref = primaryContact?.url || "#portfolio";
  const isExternalContact = Boolean(primaryContact?.url);
  const contactLabel = primaryContact ? "Hubungi Saya" : "Lihat Karya";

  if (loading) {
    return <PublicLoadingScreen />;
  }

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
        servicesCount={services.length}
        focusRing={focusRing}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={scrollToSection}
      />

      <div className="relative z-10">
        <PublicErrorNotice error={publicError} isDark={isDark} />

        <HeroSection
          about={about}
          socials={socials}
          isDark={isDark}
          focusRing={focusRing}
          onScrollToPortfolio={() => scrollToSection("portfolio")}
        />

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
      </div>
    </div>
  );
}
