"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Play,
  X,
} from "lucide-react";
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

const formatPortfolioNumber = (value: number) => {
  return String(value).padStart(2, "0");
};

export function PortfolioSection({ portfolios, isDark }: PortfolioSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<PortfolioItem | null>(null);

  const totalPortfolios = portfolios.length;
  const safeActiveIndex =
    totalPortfolios === 0 ? 0 : Math.min(activeIndex, totalPortfolios - 1);
  const activePortfolio = portfolios[safeActiveIndex];
  const canNavigate = totalPortfolios > 1;

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

  const showPreviousPortfolio = () => {
    if (!canNavigate) return;

    setActiveIndex(
      safeActiveIndex === 0 ? totalPortfolios - 1 : safeActiveIndex - 1,
    );
  };

  const showNextPortfolio = () => {
    if (!canNavigate) return;

    setActiveIndex(
      safeActiveIndex === totalPortfolios - 1 ? 0 : safeActiveIndex + 1,
    );
  };

  const handleCarouselKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPreviousPortfolio();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNextPortfolio();
    }
  };

  return (
    <section
      id="portfolio"
      className="pt-8 pb-10 md:pt-16 md:pb-16 px-6 lg:px-12 xl:px-24"
    >
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

          <div className="flex items-end justify-between gap-4 md:flex-col md:items-end">
            <span
              className={`text-4xl md:text-5xl font-black ${
                isDark ? "text-white/30" : "text-slate-400"
              }`}
            >
              {totalPortfolios > 0
                ? `${formatPortfolioNumber(safeActiveIndex + 1)} / ${formatPortfolioNumber(totalPortfolios)}`
                : "00 / 00"}
            </span>

            {canNavigate && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={showPreviousPortfolio}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all hover:-translate-y-0.5 ${focusRing} ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      : "border-white/60 bg-white/60 text-slate-800 hover:bg-white"
                  }`}
                  aria-label="Tampilkan karya sebelumnya"
                >
                  <ArrowLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={showNextPortfolio}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all hover:-translate-y-0.5 ${focusRing} ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      : "border-white/60 bg-white/60 text-slate-800 hover:bg-white"
                  }`}
                  aria-label="Tampilkan karya berikutnya"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {activePortfolio ? (
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Carousel karya pilihan"
            tabIndex={0}
            onKeyDown={handleCarouselKeyDown}
            className={`relative rounded-[2rem] ${focusRing}`}
          >
            <AnimatePresence mode="wait">
              <motion.article
                key={activePortfolio.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${formatPortfolioNumber(safeActiveIndex + 1)} dari ${formatPortfolioNumber(totalPortfolios)}: ${activePortfolio.title || "portfolio"}`}
              >
                <SpotlightCard
                  isDark={isDark}
                  tone="teal"
                  intensity="medium"
                  className={`w-full max-w-6xl mx-auto rounded-[2rem] md:rounded-[2.25rem] border p-3 md:p-4 lg:p-5 backdrop-blur-md shadow-xl transition-all duration-500 ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-white/55 border-white/70"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => openPortfolioDetail(activePortfolio)}
                    className={`group block w-full rounded-[1.45rem] text-left ${focusRing}`}
                    aria-label={`Lihat detail ${activePortfolio.title || "portfolio"}`}
                  >
                    <div className="flex min-w-0 flex-col gap-5">
                      <div className="relative aspect-video w-full min-w-0 overflow-hidden rounded-[1.25rem] bg-slate-900">
                        {activePortfolio.media_url ? (
                          <Image
                            src={formatMediaUrl(activePortfolio.media_url, 1200)}
                            alt={activePortfolio.title || "Portfolio image"}
                            fill
                            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 88vw, 1080px"
                            quality={80}
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                            priority={safeActiveIndex === 0}
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center bg-slate-200/50 px-6 text-center text-slate-600">
                            <ArrowUpRight size={28} className="mb-3 opacity-60" />
                            <p className="text-sm font-bold">
                              Media karya belum tersedia
                            </p>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

                        <div className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black/70 text-white shadow-xl backdrop-blur-md">
                          {activePortfolio.media_type === "video" ? (
                            <Play size={19} fill="currentColor" />
                          ) : (
                            <ArrowUpRight size={20} />
                          )}
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-col gap-5 px-2 pb-2 md:px-3 lg:px-4 lg:pb-3">
                        <div>
                          <span
                            className={`inline-flex max-w-full rounded-full border px-4 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-widest ${
                              isDark
                                ? "border-white/10 bg-white/5 text-cyan-300"
                                : "border-teal-200 bg-teal-50/80 text-teal-700"
                            }`}
                          >
                            <span className="truncate">
                              {activePortfolio.tags || "Project"}
                            </span>
                          </span>

                          <h3 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight md:text-4xl lg:text-5xl">
                            {activePortfolio.title || "Untitled Project"}
                          </h3>

                          <p
                            className={`mt-5 max-w-5xl text-base font-medium leading-relaxed md:text-lg ${
                              isDark ? "text-slate-300" : "text-slate-700"
                            }`}
                          >
                            {activePortfolio.description ||
                              "Belum ada deskripsi."}
                          </p>
                        </div>

                        <div
                          className={`inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                            isDark
                              ? "border-white/10 bg-white/5 text-white"
                              : "border-slate-200 bg-white/70 text-slate-900"
                          }`}
                        >
                          Lihat Detail <ArrowUpRight size={15} />
                        </div>
                      </div>
                    </div>
                  </button>
                </SpotlightCard>
              </motion.article>
            </AnimatePresence>

            {canNavigate && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {portfolios.map((portfolio, index) => (
                  <button
                    key={portfolio.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Tampilkan karya ke-${index + 1}`}
                    aria-current={index === safeActiveIndex ? "true" : undefined}
                    className={`h-2.5 rounded-full transition-all ${focusRing} ${
                      index === safeActiveIndex
                        ? isDark
                          ? "w-8 bg-cyan-300"
                          : "w-8 bg-teal-600"
                        : isDark
                          ? "w-2.5 bg-white/20 hover:bg-white/40"
                          : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            )}
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
                    <>
                      <iframe
                        src={getPortfolioVideoPreviewUrl(
                          selectedPortfolio.media_url,
                        )}
                        title={selectedPortfolio.title || "Portfolio video detail"}
                        className="h-full w-full border-0"
                        allow="autoplay; fullscreen"
                        loading="lazy"
                        allowFullScreen
                      />

                      <a
                        href={getPortfolioVideoPreviewUrl(
                          selectedPortfolio.media_url,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className={`absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-xl backdrop-blur-md transition hover:bg-cyan-300 ${focusRing}`}
                      >
                        Buka di Drive <ArrowUpRight size={14} />
                      </a>
                    </>
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
