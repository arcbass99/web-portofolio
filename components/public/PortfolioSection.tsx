"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatMediaUrl } from "../../lib/media";
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
    <section id="portfolio" className="py-14 md:py-20 lg:py-24 px-6 lg:px-12 xl:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2 md:mb-4">
              Karya Pilihan
            </h2>
            <p
              className={`text-base md:text-lg font-medium ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Kumpulan karya visual, desain, dan eksperimen digital yang sedang saya kembangkan.
            </p>
          </div>

          <span
            className={`text-4xl md:text-5xl font-black ${
              isDark ? "text-white/10" : "text-slate-200"
            }`}
          >
            / 0{portfolios.length}
          </span>
        </div>

        {portfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {portfolios.map((portfolio, index) => (
              <motion.article
                key={portfolio.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
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
                className={`group cursor-pointer p-3 md:p-4 rounded-[1.75rem] md:rounded-[2rem] border backdrop-blur-md shadow-xl transition-all duration-500 ${focusRing} ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white/50 border-white/60 hover:bg-white/80"
                }`}
              >
                <div className="relative aspect-video rounded-[1.35rem] md:rounded-[1.5rem] overflow-hidden mb-4 md:mb-6">
                  {portfolio.media_type === "video" && portfolio.media_url ? (
                    <iframe
                      src={getPortfolioVideoPreviewUrl(portfolio.media_url)}
                      title={portfolio.title || "Portfolio video preview"}
                      className="w-full h-full border-0 pointer-events-none"
                      allow="autoplay"
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
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200/50 px-6 text-center text-slate-400">
                      <ArrowUpRight size={28} className="mb-3 opacity-60" />
                      <p className="text-sm font-bold">
                        Media karya belum tersedia
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 px-2 md:px-4 pb-2">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">
                      {portfolio.title || "Untitled Project"}
                    </h3>
                    <p
                      className={`line-clamp-2 max-w-sm text-sm md:text-base font-medium ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {portfolio.description || "Belum ada deskripsi."}
                    </p>
                  </div>

                  <span
                    className={`self-start px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border whitespace-nowrap ${
                      isDark
                        ? "bg-white/5 border-white/10"
                        : "bg-white/50 border-slate-200"
                    }`}
                  >
                    {portfolio.tags || "Project"}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div
            className={`rounded-[1.75rem] md:rounded-[2rem] border p-6 md:p-10 text-center backdrop-blur-md ${
              isDark
                ? "bg-white/5 border-white/10 text-slate-400"
                : "bg-white/50 border-white/60 text-slate-500"
            }`}
          >
            <p className="text-xl md:text-2xl font-black text-inherit">
              Karya pilihan sedang disiapkan.
            </p>
            <p className="mt-3 text-sm md:text-base font-medium leading-relaxed">
              Portfolio akan tampil di sini setelah data karya ditambahkan dari
              console admin.
            </p>
          </div>
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
              className={`relative z-10 max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-3xl border p-4 shadow-2xl md:rounded-[2rem] md:p-5 ${
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

                    <h3 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
                      {selectedPortfolio.title || "Untitled Project"}
                    </h3>

                    <p
                      className={`mt-5 whitespace-pre-line text-sm font-medium leading-relaxed md:text-base ${
                        isDark ? "text-slate-300" : "text-slate-600"
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
