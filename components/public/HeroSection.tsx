"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import type { AboutMe, SocialLink } from "../../types/content";

type HeroSectionProps = {
  about: AboutMe | null;
  socials: SocialLink[];
  isDark: boolean;
  focusRing: string;
  onScrollToPortfolio: () => void;
};

export function HeroSection({
  about,
  socials,
  isDark,
  focusRing,
  onScrollToPortfolio,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center px-6 lg:px-12 xl:px-24 max-w-7xl mx-auto py-20 pt-32"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1"
        >
          <span
            className={`inline-block px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 border backdrop-blur-sm ${
              isDark
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                : "bg-teal-500/10 text-teal-600 border-teal-500/20"
            }`}
          >
            Available for Projects
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-6 md:mb-8">
            {about?.headline || "Membangun Visi Digital Anda"}
          </h1>

          <p
            className={`text-lg md:text-xl leading-relaxed max-w-lg mb-8 md:mb-10 font-medium ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {about?.description ||
              "Saya merancang dan mengembangkan antarmuka website premium untuk membantu skala bisnis Anda."}
          </p>

          <div className="flex gap-3 md:gap-4 items-center flex-wrap">
            {socials.length > 0 ? (
              socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Buka ${social.title || "link social"} di tab baru`}
                  className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl backdrop-blur-md border shadow-sm hover:-translate-y-1 transition-all duration-300 ${focusRing} ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      : "bg-white/60 border-white/40 hover:bg-white text-slate-800"
                  }`}
                >
                  <span className="text-xs md:text-sm font-bold tracking-wide">
                    {social.title || "Link"}
                  </span>
                  <ExternalLink size={16} className="opacity-70" />
                </a>
              ))
            ) : (
              <button
                type="button"
                onClick={onScrollToPortfolio}
                className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl backdrop-blur-md border shadow-sm hover:-translate-y-1 transition-all duration-300 ${focusRing} ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    : "bg-white/60 border-white/40 hover:bg-white text-slate-800"
                }`}
              >
                <span className="text-xs md:text-sm font-bold tracking-wide">
                  Lihat Karya
                </span>
                <ArrowRight size={16} className="opacity-70" />
              </button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="order-1 lg:order-2"
        >
          <div
            className={`aspect-square md:aspect-[4/5] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border backdrop-blur-xl p-2 ${
              isDark ? "bg-white/5 border-white/10" : "bg-white/40 border-white/50"
            }`}
          >
            <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-slate-200/50">
              {about?.banner_url ? (
                <Image
                  src={formatMediaUrl(about.banner_url, 900)}
                  alt="Profile Banner"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 92vw, (max-width: 1024px) 80vw, 44vw"
                  quality={82}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-center text-white">
                  <p className="text-4xl md:text-6xl font-black tracking-tighter">
                    NAFIS<span className="text-teal-400">.</span>
                  </p>
                  <p className="mt-3 text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
                    Personal Portfolio
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
