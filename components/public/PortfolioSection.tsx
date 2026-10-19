"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { formatMediaUrl, formatVideoEmbedUrl } from "../../lib/media";
import type { PortfolioItem } from "../../types/content";
import { AmbientAuroraOrb } from "../ui/AmbientAuroraOrb";
import { GoogleCtaButton } from "../ui/GoogleCtaButton";

type PortfolioSectionProps = {
  portfolios: PortfolioItem[];
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

const formatPortfolioNumber = (value: number) => {
  return String(value).padStart(2, "0");
};

export function PortfolioSection({ portfolios }: PortfolioSectionProps) {
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<PortfolioItem | null>(null);

  const totalPortfolios = portfolios.length;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const firstCard = scrollContainerRef.current.children[0] as HTMLElement;
      if (firstCard) {
        const itemWidth = firstCard.offsetWidth;
        const gap = window.innerWidth > 768 ? 20 : 14;
        const scrollAmount = itemWidth + gap;

        scrollContainerRef.current.style.scrollSnapType = "none";

        scrollContainerRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });

        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.style.scrollSnapType = "";
          }
        }, 500);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPortfolio(null);
      }
    };

    if (selectedPortfolio) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      const navbar = document.querySelector("nav");
      if (navbar) {
        const computedStyle = window.getComputedStyle(navbar);
        const originalPaddingRight = computedStyle.paddingRight;
        navbar.setAttribute("data-original-pr", originalPaddingRight);
        navbar.style.paddingRight = `calc(${originalPaddingRight} + ${scrollbarWidth}px)`;
      }

      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      const navbar = document.querySelector("nav");
      if (navbar && navbar.hasAttribute("data-original-pr")) {
        navbar.style.paddingRight =
          navbar.getAttribute("data-original-pr") || "";
        navbar.removeAttribute("data-original-pr");
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      const navbar = document.querySelector("nav");
      if (navbar) {
        navbar.style.paddingRight = "";
      }
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
    <section
      id="portfolio"
      className="relative py-10 md:py-16 px-6 lg:px-12 max-w-6xl mx-auto overflow-hidden scroll-mt-24"
    >
      {/* Moving gradient light in empty space */}
      <AmbientAuroraOrb
        variant="blue"
        size="md"
        className="-top-12 -left-16 opacity-35"
        duration={25}
      />

      <div className="relative z-10">
        <div className="mb-4">
          <span className="apple-liquid-glass rounded-full inline-flex px-3.5 py-1 text-[11px] font-body font-medium uppercase tracking-wider text-blue-300">
            Selected Works
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold tracking-tight leading-tight text-white">
              Karya
            </h2>
            <p className="mt-2.5 max-w-[55ch] text-xs sm:text-sm font-body leading-relaxed text-white/70 text-justify md:text-left">
              Kumpulan karya visual, desain, dan eksperimen digital yang sedang
              saya kembangkan.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                type="button"
                onClick={() => scrollCarousel("left")}
                className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Geser kiri"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("right")}
                className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Geser kanan"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCarousel("left")}
                  className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Geser kiri"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel("right")}
                  className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Geser kanan"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <span className="text-2xl md:text-3xl font-semibold font-heading text-white/30">
                {totalPortfolios > 0
                  ? formatPortfolioNumber(totalPortfolios)
                  : "00"}
              </span>
            </div>
          </div>
        </div>

        {totalPortfolios > 0 ? (
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-5 snap-x snap-mandatory scroll-smooth py-6 -my-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-6 px-6 lg:-mx-12 lg:px-12"
          >
            {portfolios.map((portfolio) => (
              <motion.button
                layoutId={`portfolio-card-${portfolio.id}`}
                key={portfolio.id}
                onClick={() => openPortfolioDetail(portfolio)}
                whileHover={{ y: -5 }}
                className={`w-[75vw] sm:w-[300px] md:w-[325px] flex-shrink-0 snap-center relative solid-frost rounded-[1.6rem] flex flex-col p-4 sm:p-5 text-left group overflow-hidden border border-white/12 bg-[#141619] transition-all duration-300 ${focusRing}`}
                aria-label={`Lihat detail ${portfolio.title || "portfolio"}`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/15 blur-[45px] rounded-full" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-500/15 blur-[45px] rounded-full" />
                </div>

                <div className="relative z-10 w-full aspect-[16/10] rounded-[1.2rem] bg-slate-900 overflow-hidden mb-4">
                  {portfolio.media_url ? (
                    <Image
                      src={formatMediaUrl(portfolio.media_url, 500)}
                      alt={portfolio.title || "Portfolio image"}
                      fill
                      sizes="(max-width: 640px) 75vw, 325px"
                      quality={78}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-slate-800/50 px-4 text-center text-slate-400">
                      <ArrowUpRight size={22} className="mb-2 opacity-60" />
                      <p className="text-xs font-body font-medium">
                        Media belum tersedia
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

                  <div className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black/70 text-white shadow-lg backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
                    {portfolio.media_type === "video" ? (
                      <Play size={14} fill="currentColor" />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}
                  </div>
                </div>

                <div className="relative z-10 flex flex-col gap-2 px-1 pb-1">
                  <span className="inline-flex max-w-full rounded-full border px-2.5 py-0.5 text-[11px] font-body font-medium uppercase tracking-wider border-white/10 bg-white/5 text-blue-300 w-fit">
                    <span className="truncate">
                      {portfolio.tags || "Project"}
                    </span>
                  </span>

                  <h3 className="text-base sm:text-lg font-heading font-semibold leading-snug tracking-tight text-white line-clamp-1 transition-colors duration-300 group-hover:text-blue-200">
                    {portfolio.title || "Untitled Project"}
                  </h3>

                  <p className="text-xs sm:text-sm font-body leading-relaxed text-white/70 line-clamp-2 text-justify">
                    {portfolio.description || "Belum ada deskripsi."}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="solid-frost rounded-[1.6rem] border p-8 md:p-12 text-center bg-[#141619] border-white/10 text-white/80">
            <h3 className="text-base sm:text-lg font-heading font-semibold text-white">
              Karya sedang disiapkan.
            </h3>
            <p className="mt-2 text-xs sm:text-sm font-body leading-relaxed text-white/70">
              Portfolio akan tampil di sini setelah data karya ditambahkan dari
              console admin.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPortfolio && (
          <motion.div
            className="fixed inset-0 z-[80] flex justify-center p-4 md:p-6 overflow-y-auto"
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
              className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-xl"
              onClick={closePortfolioDetail}
            />

            <motion.div
              layoutId={`portfolio-card-${selectedPortfolio.id}`}
              className="solid-frost relative z-10 my-auto w-full max-w-4xl rounded-[1.6rem] border p-4 shadow-2xl md:p-6 border-white/12 bg-[#141619] text-white flex flex-col max-h-[88vh] overflow-hidden"
            >
              <button
                type="button"
                onClick={closePortfolioDetail}
                autoFocus
                aria-label="Tutup detail portfolio"
                className={`absolute right-4 top-4 z-30 rounded-full border p-2 transition ${focusRing} border-white/10 bg-black/70 backdrop-blur-md text-white hover:bg-white/20`}
              >
                <X size={18} />
              </button>

              <div className="overflow-y-auto pr-2 h-full w-full">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7">
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900 md:rounded-2xl">
                    {selectedPortfolio.media_type === "video" &&
                    selectedPortfolio.media_url ? (
                      <>
                        <iframe
                          src={formatVideoEmbedUrl(
                            selectedPortfolio.media_url,
                          )}
                          title={
                            selectedPortfolio.title || "Portfolio video detail"
                          }
                          className="h-full w-full border-0"
                          allow="autoplay; fullscreen"
                          loading="lazy"
                          allowFullScreen
                        />

                        <GoogleCtaButton
                          href={formatVideoEmbedUrl(
                            selectedPortfolio.media_url,
                          )}
                          target="_blank"
                          variant="light"
                          className="absolute bottom-3 left-3 z-10 shadow-xl"
                          focusRing={focusRing}
                        >
                          <span>Buka di Drive</span>
                          <ArrowUpRight size={13} />
                        </GoogleCtaButton>
                      </>
                    ) : selectedPortfolio.media_url ? (
                      <Image
                        src={formatMediaUrl(selectedPortfolio.media_url, 1000)}
                        alt={
                          selectedPortfolio.title || "Portfolio detail image"
                        }
                        fill
                        sizes="(max-width: 1024px) 92vw, 50vw"
                        quality={82}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center px-4 text-center text-slate-400">
                        <ArrowUpRight size={28} className="mb-2 opacity-60" />
                        <p className="text-xs font-body font-medium">
                          Media karya belum tersedia
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-5 p-1">
                    <div>
                      <span className="inline-flex max-w-full rounded-full border px-3 py-1 text-[11px] font-body font-medium uppercase tracking-wider border-white/10 bg-white/5 text-blue-300">
                        <span className="truncate">
                          {selectedPortfolio.tags || "Project"}
                        </span>
                      </span>

                      <h3 className="mt-3.5 text-xl md:text-2xl font-heading font-semibold tracking-tight text-white">
                        {selectedPortfolio.title || "Untitled Project"}
                      </h3>

                      <p className="mt-3 whitespace-pre-line text-xs sm:text-sm font-body leading-relaxed text-white/70 text-justify">
                        {selectedPortfolio.description ||
                          "Belum ada deskripsi detail untuk karya ini."}
                      </p>
                    </div>
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
