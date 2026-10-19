"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import type { AboutMe, SocialLink } from "../../types/content";
import { formatMediaUrl } from "../../lib/media";
import { smoothScrollToId } from "../../lib/smoothScroll";
import { BlurText } from "./BlurText";
import { LiquidShaderBackground } from "../ui/LiquidShaderBackground";
import { AmbientAuroraOrb } from "../ui/AmbientAuroraOrb";
import { GoogleCtaButton } from "../ui/GoogleCtaButton";

type HeroSectionProps = {
  about: AboutMe | null;
  socials: SocialLink[];
  portfolioCount: number;
  contactHref: string;
  contactLabel: string;
  isExternalContact: boolean;
  focusRing: string;
};

const blurFadeIn = (delay: number) => ({
  initial: { filter: "blur(10px)", opacity: 0, y: 15 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
      onTouchCancel={handleMouseLeave}
      className="relative flex items-center justify-center w-full h-full [perspective:1200px]"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative w-full h-full will-change-transform [transform-style:preserve-3d]"
      >
        <motion.div className="w-full h-full [transform:translateZ(45px)]">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function HeroSection({
  about,
  socials,
  portfolioCount: _portfolioCount,
  contactHref,
  contactLabel,
  isExternalContact,
  focusRing,
}: HeroSectionProps) {
  const scrollToPortfolio = () => {
    smoothScrollToId("portfolio");
  };

  void _portfolioCount;

  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] w-full flex-col overflow-hidden bg-[#0b0d0e]"
    >
      {/* ── Liquid Shader Background ── */}
      <LiquidShaderBackground />

      {/* Subtle Ambient Cosmic Orbs in negative space */}
      <AmbientAuroraOrb
        variant="violet"
        size="md"
        className="-top-12 -left-12 opacity-70"
        duration={22}
      />
      <AmbientAuroraOrb
        variant="blue"
        size="sm"
        className="bottom-20 right-10 opacity-50"
        duration={26}
      />

      {/* ── Main Content (Side-by-Side, Standardized Proportions) ── */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-10 lg:gap-14 px-6 lg:px-12 lg:grid-cols-[58%_38%] pt-24 pb-8 lg:pb-6 min-h-[90vh]">
        {/* ── Left Column: Text ── */}
        <div className="flex flex-col items-start text-left">
          {/* Status Eyebrow Badge */}
          <motion.div {...blurFadeIn(0.35)} className="mb-5">
            <div className="apple-liquid-glass inline-flex items-center gap-2 rounded-full px-3.5 py-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-white/90 font-body">
                Open for Collaboration
              </span>
            </div>
          </motion.div>

          {/* Display Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.75rem] font-heading font-semibold text-white leading-[1.08] tracking-tight max-w-2xl">
            <BlurText text={about?.headline || "Hai, saya Nafis"} />
          </h1>

          {/* Standardized Body Description */}
          <motion.p
            {...blurFadeIn(0.7)}
            className="mt-4 max-w-[58ch] text-xs sm:text-sm text-white/70 font-body leading-relaxed text-justify md:text-left"
          >
            {about?.description ||
              "Memadukan pola pikir analitis dari Biologi dengan eksplorasi web, AI, dan desain untuk menerjemahkan masalah rumit menjadi solusi digital yang presisi."}
          </motion.p>

          {/* Standardized CTAs with Rotating Rainbow Inner Shadow & Zoom */}
          <motion.div
            {...blurFadeIn(0.95)}
            className="mt-7 flex flex-wrap items-center gap-3.5"
          >
            <GoogleCtaButton
              href={contactHref}
              focusRing={focusRing}
              variant="dark"
            >
              <span>{contactLabel}</span>
              <ArrowUpRight className="h-4 w-4" />
            </GoogleCtaButton>
            <GoogleCtaButton
              onClick={scrollToPortfolio}
              focusRing={focusRing}
              variant="glass"
            >
              <span>Lihat Karya</span>
              <Play className="h-3.5 w-3.5" fill="currentColor" />
            </GoogleCtaButton>
          </motion.div>
        </div>

        {/* ── Right Column: Photo & Socials ── */}
        <div className="flex flex-col items-center justify-center lg:items-end w-full">
          {/* 3D Profile Picture */}
          <motion.div
            {...blurFadeIn(0.45)}
            className="w-[210px] sm:w-[240px] lg:w-[260px] aspect-[4/5]"
          >
            {about?.banner_url && (
              <TiltCard>
                <div className="relative w-full h-full rounded-[1.75rem] bg-gradient-to-tr from-blue-500/30 via-violet-500/30 to-emerald-400/30 p-[2px] shadow-[0_16px_50px_-10px_rgba(0,0,0,0.7),0_0_40px_8px_rgba(66,133,244,0.12)] group transition-all duration-700 hover:from-blue-400 hover:via-violet-400 hover:to-emerald-300">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-violet-500 to-emerald-400 blur-xl opacity-20 transition-opacity duration-700 group-hover:opacity-40 rounded-[1.75rem]" />

                  <div className="liquid-glass relative z-10 w-full h-full rounded-[1.65rem] border border-white/10 overflow-hidden bg-black/80 backdrop-blur-xl">
                    <Image
                      src={formatMediaUrl(about.banner_url, 600)}
                      alt="Foto profil Nafis"
                      fill
                      priority
                      className="object-cover rounded-[1.65rem] transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </TiltCard>
            )}
          </motion.div>

          {/* Social Links */}
          {socials.length > 0 && (
            <motion.div
              {...blurFadeIn(1.1)}
              className="mt-6 flex flex-col items-center lg:items-end gap-2 w-full max-w-[280px]"
            >
              <div className="apple-liquid-glass rounded-full px-3.5 py-1 w-fit">
                <span className="text-[11px] font-medium text-white/80 font-body uppercase tracking-wider">
                  Temukan saya di
                </span>
              </div>
              <div className="relative w-[110%] lg:w-[120%] overflow-hidden mt-1.5 py-3 -my-3 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] pointer-events-none">
                <style>{`
                  @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .animate-marquee {
                    animation: marquee-scroll 45s linear infinite;
                  }
                `}</style>
                <div className="flex w-max items-center gap-12 pr-12 animate-marquee hover:[animation-play-state:paused] group/marquee pointer-events-auto">
                  {Array.from({ length: 12 })
                    .flatMap(() => socials)
                    .map((link, idx) => {
                      const isExternal = Boolean(
                        link.url &&
                          (link.url.startsWith("http://") ||
                            link.url.startsWith("https://")),
                      );
                      return (
                        <a
                          key={`${link.id}-${idx}`}
                          href={link.url || "#"}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="font-heading font-semibold text-base sm:text-lg text-white/70 tracking-tight transition-all duration-300 group-hover/marquee:opacity-30 hover:!opacity-100 hover:!text-blue-400 hover:drop-shadow-[0_0_14px_rgba(66,133,244,0.5)]"
                        >
                          {link.title}
                        </a>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Compact Spacer to balance parallax transition */}
      <div className="h-[16vh] lg:h-[22vh] w-full shrink-0" />
    </section>
  );
}