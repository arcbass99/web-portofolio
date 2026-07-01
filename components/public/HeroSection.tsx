"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import type { AboutMe, SocialLink } from "../../types/content";
import { formatMediaUrl } from "../../lib/media";
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
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center w-full h-full"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full will-change-transform"
      >
        <motion.div
          style={{ transform: "translateZ(60px)" }}
          className="w-full h-full"
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
  portfolioCount,
  contactHref,
  contactLabel,
  isExternalContact,
  focusRing,
}: HeroSectionProps) {
  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black"
    >
      {/* ── Liquid Shader Background ── */}
      <LiquidShaderBackground />

      {/* ── Main Content (Side-by-Side) ── */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] flex-1 grid-cols-1 items-center gap-12 lg:gap-16 px-6 md:px-12 lg:grid-cols-[55%_40%] pt-28 pb-[80vh] lg:pb-8 min-h-screen">
        
        {/* ── Left Column: Text ── */}
        <div className="flex flex-col items-start text-left">
          {/* Badge */}
          <motion.div {...blurFadeIn(0.4)} className="mb-[1.618rem]">
            <div className="liquid-glass flex items-center gap-[0.618rem] rounded-full px-[1.618rem] py-[0.618rem] pr-[1.618rem] border border-white/5">
              <span className="rounded-full bg-white px-[1rem] py-[0.382rem] text-[0.618rem] font-semibold text-black font-body uppercase tracking-widest">
                Status
              </span>
              <span className="text-[1rem] text-white/90 font-body">
                Open for Collaboration
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <h1 className="text-[2.618rem] md:text-[4.236rem] lg:text-[6.854rem] font-heading italic text-white leading-[0.85] tracking-[-3px] max-w-2xl">
            <BlurText text={about?.headline || "Hai, saya Nafis"} />
          </h1>

          {/* Subheading */}
          <motion.p
            {...blurFadeIn(0.8)}
            className="mt-[1.618rem] max-w-lg text-[1rem] text-white/70 font-body font-light leading-relaxed text-justify"
          >
            {about?.description ||
              "Memadukan pola pikir analitis dari Biologi dengan eksplorasi web, AI, dan desain untuk menerjemahkan masalah rumit menjadi solusi digital yang presisi."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...blurFadeIn(1.1)}
            className="mt-[1.618rem] flex flex-wrap items-center gap-[1.618rem]"
          >
            <a
              href={contactHref}
              target={isExternalContact ? "_blank" : undefined}
              rel={isExternalContact ? "noopener noreferrer" : undefined}
              className={`liquid-glass-strong flex items-center gap-[0.618rem] rounded-full px-[1.618rem] py-[1rem] text-[1rem] font-medium text-white font-body transition-transform hover:scale-105 border border-white/5 ${focusRing}`}
            >
              {contactLabel}
              <ArrowUpRight className="h-[1.618rem] w-[1.618rem]" />
            </a>
            <button
              type="button"
              onClick={scrollToPortfolio}
              className="flex cursor-pointer items-center gap-[0.618rem] text-[1rem] font-medium text-white/80 font-body transition-colors hover:text-white"
            >
              Lihat Karya
              <Play className="h-[1rem] w-[1rem]" fill="currentColor" />
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
                <div className="relative w-full h-full rounded-[2.1rem] bg-gradient-to-tr from-cyan-400/40 via-violet-500/40 to-cyan-300/40 p-[2px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5),0_0_60px_10px_rgba(88,28,135,0.2),0_0_120px_30px_rgba(30,64,175,0.1)] group transition-all duration-700 hover:p-[3px] hover:from-cyan-400 hover:via-violet-500 hover:to-cyan-300">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-violet-500 to-cyan-300 blur-xl opacity-20 transition-opacity duration-700 group-hover:opacity-60 rounded-[2.1rem]" />
                  
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
              <div className="liquid-glass rounded-full px-[1.618rem] py-[0.618rem] border border-white/5 w-fit">
                <span className="text-[0.618rem] font-medium text-white/80 font-body uppercase tracking-widest">
                  Temukan saya di
                </span>
              </div>
              <div className="relative w-[110%] lg:w-[120%] overflow-hidden mt-[1rem] py-[1.618rem] -my-[1.618rem] [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] pointer-events-none">
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
                  {Array.from({ length: 12 }).flatMap(() => socials).map((link, idx) => (
                    <a
                      key={`${link.id}-${idx}`}
                      href={link.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-heading italic text-[1.618rem] md:text-[2.618rem] text-white/70 tracking-tight transition-all duration-300 group-hover/marquee:opacity-30 hover:!opacity-100 hover:!text-cyan-300 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

    </section>
  );
}