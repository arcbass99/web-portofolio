"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import type { AboutMe, SocialLink } from "../../types/content";

type HeroSectionProps = {
  about: AboutMe | null;
  socials: SocialLink[];
  contactHref: string;
  contactLabel: string;
  isDark: boolean;
  isExternalContact: boolean;
  focusRing: string;
};

export function HeroSection({
  about,
  socials,
  contactHref,
  contactLabel,
  isDark,
  isExternalContact,
  focusRing,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="flex min-h-[auto] flex-col justify-center px-6 pb-12 pt-24 md:min-h-[76vh] md:pb-16 md:pt-28 lg:px-12 xl:px-24 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-[1.618fr_1fr] lg:gap-14">
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
            Terbuka untuk Kolaborasi
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.08] mb-5 md:mb-7">
            {about?.headline || "Belajar, berkarya, dan membangun solusi digital."}
          </h1>

          <p
            className={`text-base md:text-lg leading-relaxed max-w-xl mb-7 md:mb-8 font-medium ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {about?.description ||
              "Saya memadukan minat pada biologi, riset, desain visual, dan teknologi untuk membuat karya digital yang rapi, berguna, dan terus berkembang."}
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={contactHref}
                target={isExternalContact ? "_blank" : undefined}
                rel={isExternalContact ? "noreferrer" : undefined}
                aria-label={contactLabel}
                className={`inline-flex items-center gap-2 px-5 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border shadow-lg font-black text-xs md:text-sm uppercase tracking-widest hover:-translate-y-1 transition-all duration-300 ${focusRing} ${
                  isDark
                    ? "bg-cyan-400 text-slate-950 border-cyan-400 hover:bg-white hover:border-white"
                    : "bg-slate-900 text-white border-slate-900 hover:bg-teal-600 hover:border-teal-600"
                }`}
              >
                {contactLabel}
                <ArrowRight size={16} />
              </a>
            </div>

            {socials.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {socials.map((social) => (
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
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="order-1 mx-auto w-full max-w-sm md:max-w-md lg:order-2 lg:max-w-none"
        >
          <div
            className={`aspect-[5/6] rounded-3xl md:rounded-[2rem] overflow-hidden shadow-2xl border backdrop-blur-xl p-2 ${
              isDark ? "bg-white/5 border-white/10" : "bg-white/40 border-white/50"
            }`}
          >
            <div className="relative w-full h-full rounded-2xl md:rounded-[1.5rem] overflow-hidden bg-slate-200/50">
              {about?.banner_url ? (
                <Image
                  src={formatMediaUrl(about.banner_url, 900)}
                  alt="Foto profil Nafis"
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
                    I’m Nafis<span className="text-teal-400">.</span>
                  </p>
                  <p className="mt-3 text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
                    Track Record & Karya
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
