"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { PUBLIC_FOCUS_RING } from "../../lib/constants";
import { notifySifan, trackOncePerSession } from "../../lib/metrics-client";
import type { PortfolioItem } from "../../types/content";
import { AmbientAuroraOrb } from "../ui/AmbientAuroraOrb";
import { GalleryCard } from "./GalleryCard";
import { GalleryDetailModal } from "./GalleryDetailModal";

type PortfolioSectionProps = {
  portfolios: PortfolioItem[];
  totalCount: number;
  initialClaps: Record<string, number>;
};

const formatPortfolioNumber = (value: number) => {
  return String(value).padStart(2, "0");
};

export function PortfolioSection({
  portfolios,
  totalCount,
  initialClaps,
}: PortfolioSectionProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [clapsMap, setClapsMap] = useState<Record<string, number>>(initialClaps);

  const displayTotal = Math.max(totalCount, portfolios.length);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const focusRing = PUBLIC_FOCUS_RING;

  const handleClapCountChange = useCallback(
    (itemId: number, newCount: number) => {
      setClapsMap((prev) => ({
        ...prev,
        [String(itemId)]: newCount,
      }));
    },
    [],
  );

  const openDetail = (item: PortfolioItem) => {
    setSelectedItem(item);
    trackOncePerSession(`item_view_${item.id}`, {
      type: "item_view",
      itemId: item.id,
    });
    notifySifan({
      kind: "modal_open",
      label: item.title || undefined,
    });
  };

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

  return (
    <section
      id="galeri"
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
            Works &amp; Moments
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold tracking-tight leading-tight text-white">
              Galeri
            </h2>
            <p className="mt-2.5 max-w-[55ch] text-xs sm:text-sm font-body leading-relaxed text-white/70 text-justify md:text-left">
              Beberapa pilihan karya, proyek, dan dokumentasi kegiatan.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                type="button"
                onClick={() => scrollCarousel("left")}
                className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Geser kiri"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("right")}
                className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
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
                  className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  aria-label="Geser kiri"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel("right")}
                  className="p-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  aria-label="Geser kanan"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <span
                className="text-2xl md:text-3xl font-semibold font-heading text-white/30"
                title={`Total ${displayTotal} item di galeri`}
              >
                {displayTotal > 0 ? formatPortfolioNumber(displayTotal) : "00"}
              </span>
            </div>
          </div>
        </div>

        {portfolios.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-5 snap-x snap-mandatory scroll-smooth py-6 -my-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-6 px-6 lg:-mx-12 lg:px-12"
          >
            {portfolios.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                clapCount={clapsMap[String(item.id)] ?? 0}
                focusRing={focusRing}
                onSelect={openDetail}
                onClapCountChange={handleClapCountChange}
                className="w-[75vw] sm:w-[300px] md:w-[325px] flex-shrink-0 snap-center"
              />
            ))}

            {/* Right-end CTA card leading to full /galeri archive */}
            <Link
              href="/galeri"
              aria-label={`Lihat semua ${displayTotal} item galeri`}
              className={`group w-[68vw] sm:w-[260px] md:w-[280px] flex-shrink-0 snap-center relative solid-frost rounded-[1.6rem] flex flex-col items-center justify-center p-6 text-center overflow-hidden border border-dashed border-white/20 bg-gradient-to-br from-blue-500/10 via-[#141619] to-violet-500/10 transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-blue-400/50 hover:shadow-[0_18px_40px_rgba(0,0,0,0.75)] will-change-transform ${focusRing}`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
              >
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)",
                  }}
                />
                <div
                  className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)",
                  }}
                />
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg transition-[transform,background-color,color] duration-300 ease-out group-hover:scale-110 group-hover:bg-white group-hover:text-black">
                  <ArrowRight
                    size={20}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </div>

                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-body font-medium uppercase tracking-wider text-blue-300 mb-2">
                  <span>{displayTotal} Arsip</span>
                </span>

                <h3 className="font-heading font-semibold text-base sm:text-lg text-white tracking-tight">
                  Lihat Semua Galeri
                </h3>

                <p className="mt-1.5 max-w-[24ch] text-xs font-body leading-relaxed text-white/60">
                  Lihat semua arsip karya dan dokumentasi berdasarkan kategori.
                </p>
              </div>
            </Link>
          </div>
        ) : (
          <div className="solid-frost rounded-[1.6rem] border p-8 md:p-12 text-center bg-[#141619] border-white/10 text-white/80">
            <h3 className="text-base sm:text-lg font-heading font-semibold text-white">
              Galeri sedang disiapkan.
            </h3>
            <p className="mt-2 text-xs sm:text-sm font-body leading-relaxed text-white/70">
              Item galeri akan tampil di sini setelah ditambahkan dari console
              admin.
            </p>
          </div>
        )}
      </div>

      <GalleryDetailModal
        item={selectedItem}
        clapCount={selectedItem ? clapsMap[String(selectedItem.id)] ?? 0 : 0}
        focusRing={focusRing}
        onClose={() => setSelectedItem(null)}
        onClapCountChange={handleClapCountChange}
      />
    </section>
  );
}
