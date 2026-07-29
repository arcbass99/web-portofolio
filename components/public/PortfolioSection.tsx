"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { formatMediaUrl } from "../../lib/media";
import type { PortfolioItem } from "../../types/content";

type PortfolioSectionProps = {
  portfolios: PortfolioItem[];
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
        const gap = window.innerWidth > 768 ? 24 : 16;
        const scrollAmount = itemWidth + gap;
        
        // Mematikan snap sementara bisa mengurangi konflik animasi di beberapa browser
        scrollContainerRef.current.style.scrollSnapType = 'none';
        
        scrollContainerRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });

        // Nyalakan snap kembali setelah animasi selesai (estimasi 500ms)
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.style.scrollSnapType = '';
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
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      const navbar = document.querySelector('nav');
      if (navbar) {
        const computedStyle = window.getComputedStyle(navbar);
        const originalPaddingRight = computedStyle.paddingRight;
        navbar.setAttribute('data-original-pr', originalPaddingRight);
        navbar.style.paddingRight = `calc(${originalPaddingRight} + ${scrollbarWidth}px)`;
      }

      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      
      const navbar = document.querySelector('nav');
      if (navbar && navbar.hasAttribute('data-original-pr')) {
        navbar.style.paddingRight = navbar.getAttribute('data-original-pr') || "";
        navbar.removeAttribute('data-original-pr');
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      const navbar = document.querySelector('nav');
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
      className="py-8 md:py-12 px-6 lg:px-12 xl:px-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4 relative z-30">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading italic font-black tracking-tight mb-2 md:mb-4 text-white">
              Karya Pilihan
            </h2>
            <p className="mt-4 max-w-[65ch] text-base font-body font-medium leading-relaxed text-white/80 text-justify md:text-left">
              Kumpulan karya visual, desain, dan eksperimen digital yang sedang saya kembangkan.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 md:flex-col md:items-end relative z-20">
            <div className="flex items-center gap-2 md:hidden">
              <button onClick={() => scrollCarousel("left")} className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors" aria-label="Geser kiri"><ChevronLeft size={24} /></button>
              <button onClick={() => scrollCarousel("right")} className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors" aria-label="Geser kanan"><ChevronRight size={24} /></button>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2">
                <button onClick={() => scrollCarousel("left")} className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors" aria-label="Geser kiri"><ChevronLeft size={24} /></button>
                <button onClick={() => scrollCarousel("right")} className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors" aria-label="Geser kanan"><ChevronRight size={24} /></button>
              </div>
              <span className="text-4xl md:text-7xl font-black text-white/60">
                {totalPortfolios > 0
                  ? formatPortfolioNumber(totalPortfolios)
                  : "00"}
              </span>
            </div>
          </div>
        </div>

        {totalPortfolios > 0 ? (
          <div ref={scrollContainerRef} className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory scroll-smooth py-10 -my-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-6 px-6 lg:-mx-12 lg:px-12 xl:-mx-24 xl:px-24">
            {portfolios.map((portfolio) => (
              <motion.button
                layoutId={`portfolio-card-${portfolio.id}`}
                key={portfolio.id}
                onClick={() => openPortfolioDetail(portfolio)}
                whileHover={{ y: -8 }}
                className={`w-[85vw] md:w-[400px] flex-shrink-0 snap-center relative liquid-glass rounded-[2rem] flex flex-col p-6 text-left group overflow-hidden border border-white/5 bg-white/5 transition-colors duration-500 ${focusRing}`}
                aria-label={`Lihat detail ${portfolio.title || "portfolio"}`}
              >
                {/* Cinematic Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/20 blur-[50px] rounded-full" />
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/20 blur-[50px] rounded-full" />
                </div>
                
                <div className="relative z-10 w-full aspect-[4/3] rounded-[1.5rem] bg-slate-900 overflow-hidden mb-5">
                  {portfolio.media_url ? (
                    <Image
                      src={formatMediaUrl(portfolio.media_url, 600)}
                      alt={portfolio.title || "Portfolio image"}
                      fill
                      sizes="(max-width: 768px) 85vw, 400px"
                      quality={78}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-slate-200/50 px-6 text-center text-slate-600">
                      <ArrowUpRight size={28} className="mb-3 opacity-60" />
                      <p className="text-sm font-body font-bold">
                        Media belum tersedia
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

                  <div className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/70 text-white shadow-xl backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
                    {portfolio.media_type === "video" ? (
                      <Play size={18} fill="currentColor" />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>
                </div>

                <div className="relative z-10 flex flex-col gap-3 px-2 pb-2">
                  <span className="inline-flex max-w-full rounded-full border px-3 py-1 text-xs font-body font-black uppercase tracking-widest border-white/5 bg-white/5 text-cyan-300">
                    <span className="truncate">
                      {portfolio.tags || "Project"}
                    </span>
                  </span>

                  <h3 className="text-xl font-heading italic font-black leading-tight tracking-tight text-white line-clamp-1 transition-colors duration-300 group-hover:text-cyan-100">
                    {portfolio.title || "Untitled Project"}
                  </h3>

                  <p className="text-sm font-body font-medium leading-relaxed text-white/70 line-clamp-2 text-justify">
                    {portfolio.description || "Belum ada deskripsi."}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="liquid-glass rounded-3xl md:rounded-[2.5rem] border p-12 md:p-20 text-center backdrop-blur-md bg-white/5 border-white/5 text-white/80">
            <p className="text-2xl font-heading italic font-black text-white">
              Karya pilihan sedang disiapkan.
            </p>
            <p className="mt-4 text-base font-body font-medium leading-relaxed">
              Portfolio akan tampil di sini setelah data karya ditambahkan dari
              console admin.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPortfolio && (
          <motion.div
            className="fixed inset-0 z-[80] flex justify-center p-4 md:p-8 overflow-y-auto"
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
              className="relative z-10 my-auto w-full max-w-5xl rounded-[2rem] border p-4 shadow-2xl md:p-6 border-white/10 bg-[#050505] text-white flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="overflow-y-auto pr-2 h-full w-full">
              <button
                type="button"
                onClick={closePortfolioDetail}
                autoFocus
                aria-label="Tutup detail portfolio"
                className={`absolute right-4 top-4 z-20 rounded-full border p-3 transition ${focusRing} border-white/5 bg-black/50 text-white hover:bg-white/10`}
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
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
                      <p className="text-sm font-body font-bold">
                        Media karya belum tersedia
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-8 p-1 md:p-2">
                  <div>
                    <span className="inline-flex max-w-full rounded-full border px-4 py-2 text-sm font-body font-black uppercase tracking-widest border-white/5 bg-white/5 text-cyan-300">
                      <span className="truncate">
                        {selectedPortfolio.tags || "Project"}
                      </span>
                    </span>

                    <h3 className="mt-8 text-3xl md:text-4xl font-heading italic font-black tracking-tight text-white">
                      {selectedPortfolio.title || "Untitled Project"}
                    </h3>

                    <p className="mt-6 whitespace-pre-line text-base font-body font-medium leading-relaxed text-white/80 text-justify">
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
