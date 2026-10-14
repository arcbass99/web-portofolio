"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import type { AboutMe, SocialLink } from "../../types/content";
import { formatMediaUrl } from "../../lib/media";
import { smoothScrollToId } from "../../lib/smoothScroll";
import { BlurText } from "./BlurText";
import { LiquidShaderBackground } from "../ui/LiquidShaderBackground";

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
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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
        <motion.div
          className="w-full h-full [transform:translateZ(60px)]"
        >
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

  // Mark prop as intentionally unused to satisfy linting
  void _portfolioCount;

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#0b0d0e]"
    >
      {/* ── Liquid Shader Background ── */}
      <LiquidShaderBackground />

      {/* ── Main Content (Side-by-Side) ── */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] flex-1 grid-cols-1 items-center gap-12 lg:gap-16 px-6 md:px-12 lg:grid-cols-[55%_40%] pt-28 pb-12 lg:pb-8 min-h-screen">
        
        {/* ── Left Column: Text ── */}
        <div className="flex flex-col items-start text-left">
          {/* Status Badge */}
          <motion.div {...blurFadeIn(0.4)} className="mb-8">
            <div className="liquid-glass flex items-center gap-2.5 rounded-full px-4 py-1.5 border border-white/10">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-wider text-white/90 font-body">
                Open for Collaboration
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-[4.75rem] font-heading font-semibold text-white leading-[1.05] tracking-tight max-w-2xl">
            <BlurText text={about?.headline || "Hai, saya Nafis"} />
          </h1>

          {/* Subheading */}
          <motion.p
            {...blurFadeIn(0.8)}
            className="mt-6 max-w-[65ch] text-base md:text-lg text-white/70 font-body leading-relaxed text-justify md:text-left"
          >
            {about?.description ||
              "Memadukan pola pikir analitis dari Biologi dengan eksplorasi web, AI, dan desain untuk menerjemahkan masalah rumit menjadi solusi digital yang presisi."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...blurFadeIn(1.1)}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <a
              href={contactHref}
              target={isExternalContact ? "_blank" : undefined}
              rel={isExternalContact ? "noopener noreferrer" : undefined}
              className={`liquid-glass-strong flex items-center gap-3 rounded-full px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-medium text-white font-body transition-transform hover:scale-105 border border-white/10 ${focusRing}`}
            >
              {contactLabel}
              <ArrowUpRight className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={scrollToPortfolio}
              className="flex cursor-pointer items-center gap-3 text-base font-medium text-white/80 font-body transition-colors hover:text-white"
            >
              Lihat Karya
              <Play className="h-5 w-5" fill="currentColor" />
            </button>
          </motion.div>
        </div>

        {/* ── Right Column: Photo & Socials ── */}
        <div className="flex flex-col items-center justify-center lg:items-end w-full">
          {/* 3D Profile Picture */}
          <motion.div
            {...blurFadeIn(0.5)}
            className="w-[260px] md:w-[300px] lg:w-[320px] aspect-[4/5]"
          >
            {about?.banner_url && (
              <TiltCard>
                <div className="relative w-full h-full rounded-[2.1rem] bg-gradient-to-tr from-blue-500/30 via-violet-500/30 to-emerald-400/30 p-[2px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6),0_0_60px_10px_rgba(66,133,244,0.15)] group transition-all duration-700 hover:from-blue-400 hover:via-violet-400 hover:to-emerald-300">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-violet-500 to-emerald-400 blur-xl opacity-20 transition-opacity duration-700 group-hover:opacity-40 rounded-[2.1rem]" />
                  
                  <div className="liquid-glass relative z-10 w-full h-full rounded-[2rem] border border-white/10 overflow-hidden bg-black/80 backdrop-blur-xl">
                    <Image
                      src={formatMediaUrl(about.banner_url, 800)}
                      alt="Foto profil Nafis"
                      fill
                      priority
                      className="object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </TiltCard>
            )}
          </motion.div>

          {/* Social Links */}
          {socials.length > 0 && (
            <motion.div
              {...blurFadeIn(1.3)}
              className="mt-10 flex flex-col items-center lg:items-end gap-3 w-full max-w-[320px]"
            >
              <div className="liquid-glass rounded-full px-5 py-1.5 border border-white/10 w-fit">
                <span className="text-xs font-medium text-white/70 font-body uppercase tracking-wider">
                  Temukan saya di
                </span>
              </div>
              <div className="relative w-[110%] lg:w-[120%] overflow-hidden mt-4 py-8 -my-8 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] pointer-events-none">
                <style>{`
                  @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .animate-marquee {
                    animation: marquee-scroll 45s linear infinite;
                  }
                `}</style>
                <div className="flex w-max items-center gap-24 pr-24 animate-marquee hover:[animation-play-state:paused] group/marquee pointer-events-auto">
                  {Array.from({ length: 12 }).flatMap(() => socials).map((link, idx) => {
                    const isExternal = Boolean(link.url && (link.url.startsWith("http://") || link.url.startsWith("https://")));
                    return (
                      <a
                        key={`${link.id}-${idx}`}
                        href={link.url || "#"}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="font-heading font-medium text-3xl md:text-5xl text-white/70 tracking-tight transition-all duration-300 group-hover/marquee:opacity-30 hover:!opacity-100 hover:!text-blue-400 hover:drop-shadow-[0_0_16px_rgba(66,133,244,0.6)]"
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

      {/* Spacer to push the sticky section's bottom edge down */}
      <div className="h-[30vh] lg:h-[40vh] w-full shrink-0" />
    </section>
  );
}