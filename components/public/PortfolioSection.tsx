"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatMediaUrl } from "../../lib/media";
import { SpotlightCard } from "../ui/SpotlightCard";
import type { PortfolioItem } from "../../types/content";

type PortfolioSectionProps = {
  portfolios: PortfolioItem[];
  isDark: boolean;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

const getPortfolioVideoPreviewUrl = (mediaUrl?: string | null) => {
  if (!mediaUrl) return "";

  if (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://")) {
    return mediaUrl;
  }

  return `https://drive.google.com/file/d/${mediaUrl}/preview`;
};

export function PortfolioSection({ portfolios, isDark }: PortfolioSectionProps) {
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<PortfolioItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPortfolio(null);
      }
    };

    if (selectedPortfolio) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPortfolio]);

  const openPortfolioDetail = (portfolio: PortfolioItem) => {
    setSelectedPortfolio(portfolio);
  };

  const closePortfolioDetail = () => {
    setSelectedPortfolio(null);
  };

  return (
    <section id="portfolio" className="pt-8 pb-10 md:pt-16 md:pb-16 px-6 lg:px-12 xl:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 md:mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2 md:mb-4">
              Karya Pilihan
            </h2>
            <p
              className={`max-w-2xl text-base md:text-lg font-medium leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Kumpulan karya visual, desain, dan eksperimen digital yang sedang saya kembangkan.
            </p>
          </div>

          <span
            className={`text-4xl md:text-5xl font-black ${
              isDark ? "text-white/30" : "text-slate-400"
            }`}
          >
            / 0{portfolios.length}
          </span>
        </div>

        {portfolios.length > 0 ? (
          <div className={`grid grid-cols-1 gap-6 md:gap-8 ${portfolios.length > 1 ? "md:mx-auto md:max-w-[48rem] md:grid-cols-2 lg:mx-0 lg:max-w-none" : "md:max-w-[34rem] lg:max-w-[43rem]"}`}>
            {portfolios.map((portfolio, index) => (
              <motion.article
                key={portfolio.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                role="button"
                tabIndex={0}
                onClick={() => openPortfolioDetail(portfolio)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openPortfolioDetail(portfolio);
                  }
                }}
                aria-label={`Lihat detail ${portfolio.title || "portfolio"}`}
                className={`group cursor-pointer rounded-3xl ${focusRing}`}
              >
                <SpotlightCard
                  isDark={isDark}
                  tone="teal"
                  intensity="medium"
                  className={`p-3 md:p-4 rounded-3xl border backdrop-blur-md shadow-xl transition-all duration-500 ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10"
                      : "bg-white/50 border-white/60 hover:bg-white/80"
                  }`}
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 md:mb-5">
                  {portfolio.media_type === "video" && portfolio.media_url ? (
                    <iframe
                      src={getPortfolioVideoPreviewUrl(portfolio.media_url)}
                      title={portfolio.title || "Portfolio video preview"}
                      className="w-full h-full border-0 pointer-events-none"
                      allow="autoplay"
                      loading="lazy"
                      tabIndex={-1}
                    />
                  ) : portfolio.media_url ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={formatMediaUrl(portfolio.media_url, 900)}
                        alt={portfolio.title || "Portfolio image"}
                        fill
                        sizes="(max-width: 768px) 92vw, (max-width: 1024px) 44vw, 40vw"
                        quality={78}
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
                        <ArrowUpRight
                          className="text-white opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500 shadow-xl"
                          size={40}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200/50 px-6 text-center text-slate-600">
                      <ArrowUpRight size={28} className="mb-3 opacity-60" />
                      <p className="text-sm font-bold">
                        Media karya belum tersedia
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 px-2 md:px-4 pb-2 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold leading-tight md:text-[1.35rem] lg:text-2xl mb-1 md:mb-2">
                      {portfolio.title || "Untitled Project"}
                    </h3>
                    <p
                      className={`line-clamp-2 max-w-none text-sm md:text-sm lg:text-base font-medium ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {portfolio.description || "Belum ada deskripsi."}
                    </p>
                  </div>

                  <span
                    className={`self-start max-w-full truncate px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border whitespace-nowrap ${
                      isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-white/50 border-slate-200"
                    }`}
                  >
                    {portfolio.tags || "Project"}
                  </span>
                </div>
                </SpotlightCard>
              </motion.article>
            ))}
          </div>
        ) : (
          <SpotlightCard
            isDark={isDark}
            tone="teal"
            intensity="subtle"
            className={`rounded-3xl md:rounded-[2.5rem] border p-8 md:p-12 text-center backdrop-blur-md ${
              isDark
                ? "bg-white/5 border-white/10 text-slate-300"
                : "bg-white/50 border-white/60 text-slate-700"
            }`}
          >
            <p className="text-xl md:text-2xl font-black text-inherit">
              Karya pilihan sedang disiapkan.
            </p>
            <p className="mt-3 text-sm md:text-base font-medium leading-relaxed">
              Portfolio akan tampil di sini setelah data karya ditambahkan dari
              console admin.
            </p>
          </SpotlightCard>
        )}
      </div>

      <AnimatePresence>
        {selectedPortfolio && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Detail ${selectedPortfolio.title || "portfolio"}`}
          >
            <button
              type="button"
              aria-label="Tutup detail portfolio"
              className="absolute inset-0 cursor-default bg-slate-950/75 backdrop-blur-xl"
              onClick={closePortfolioDetail}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className={`relative z-10 max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-3xl border p-4 shadow-2xl md:p-5 ${
                isDark
                  ? "border-white/10 bg-[#0B0C10] text-white"
                  : "border-white/70 bg-white text-slate-900"
              }`}
            >
              <button
                type="button"
                onClick={closePortfolioDetail}
                autoFocus
                aria-label="Tutup detail portfolio"
                className={`absolute right-4 top-4 z-20 rounded-full border p-3 transition ${focusRing} ${
                  isDark
                    ? "border-white/10 bg-black/50 text-white hover:bg-white/10"
                    : "border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.618fr_1fr] lg:gap-8">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900 md:rounded-[1.5rem]">
                  {selectedPortfolio.media_type === "video" &&
                  selectedPortfolio.media_url ? (
                    <iframe
                      src={getPortfolioVideoPreviewUrl(
                        selectedPortfolio.media_url,
                      )}
                      title={selectedPortfolio.title || "Portfolio video detail"}
                      className="h-full w-full border-0"
                      allow="autoplay"
                      loading="lazy"
                    />
                  ) : selectedPortfolio.media_url ? (
                    <Image
                      src={formatMediaUrl(selectedPortfolio.media_url, 1200)}
                      alt={selectedPortfolio.title || "Portfolio detail image"}
                      fill
                      sizes="(max-width: 1024px) 92vw, 60vw"
                      quality={82}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center text-slate-400">
                      <ArrowUpRight size={32} className="mb-3 opacity-60" />
                      <p className="text-sm font-bold">
                        Media karya belum tersedia
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-8 p-1 md:p-2">
                  <div>
                    <span
                      className={`inline-flex rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                        isDark
                          ? "border-white/10 bg-white/5 text-cyan-300"
                          : "border-teal-200 bg-teal-50 text-teal-700"
                      }`}
                    >
                      {selectedPortfolio.tags || "Project"}
                    </span>

                    <h3 className="mt-5 text-3xl font-black tracking-tight md:text-4xl">
                      {selectedPortfolio.title || "Untitled Project"}
                    </h3>

                    <p
                      className={`mt-5 whitespace-pre-line text-sm font-medium leading-relaxed md:text-base ${
                        isDark ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      {selectedPortfolio.description ||
                        "Belum ada deskripsi detail untuk karya ini."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
