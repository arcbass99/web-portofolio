"use client";

import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";
import { formatMediaUrl, isGoogleDriveMediaUrl } from "../../lib/media";
import type { PortfolioItem } from "../../types/content";
import { ClapButton } from "./ClapButton";

type GalleryCardProps = {
  item: PortfolioItem;
  clapCount: number;
  focusRing: string;
  onSelect: (item: PortfolioItem) => void;
  onClapCountChange: (itemId: number, newCount: number) => void;
  className?: string;
  showFeaturedBadge?: boolean;
  sizes?: string;
};

export function GalleryCard({
  item,
  clapCount,
  focusRing,
  onSelect,
  onClapCountChange,
  className = "",
  showFeaturedBadge = false,
  sizes = "(max-width: 640px) 75vw, 325px",
}: GalleryCardProps) {
  return (
    <article
      className={`relative solid-frost rounded-[1.6rem] flex flex-col p-4 sm:p-5 text-left group overflow-hidden border border-white/12 bg-[#141619] transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-white/22 hover:shadow-[0_20px_42px_rgba(0,0,0,0.82)] will-change-transform ${className}`}
    >
      {/* Full-card accessible click overlay (keeps ClapButton valid as a sibling) */}
      <button
        type="button"
        onClick={() => onSelect(item)}
        aria-label={`Lihat detail ${item.title || "item galeri"}`}
        className={`absolute inset-0 z-10 cursor-pointer rounded-[1.6rem] ${focusRing}`}
      />

      {/* Hover aurora glow (radial gradients avoid heavy runtime blur rasterization) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"
      >
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Media thumbnail */}
      <div className="relative z-0 w-full aspect-[16/10] rounded-[1.2rem] bg-slate-900 overflow-hidden mb-4">
        {item.media_url ? (() => {
          const thumbSrc = formatMediaUrl(item.media_url, 500);
          return (
            <Image
              src={thumbSrc}
              alt={item.title || "Galeri image"}
              fill
              sizes={sizes}
              quality={78}
              unoptimized={isGoogleDriveMediaUrl(thumbSrc)}
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] will-change-transform"
            />
          );
        })() : (
          <div className="flex h-full flex-col items-center justify-center bg-slate-800/50 px-4 text-center text-slate-400">
            <ArrowUpRight size={22} className="mb-2 opacity-60" />
            <p className="text-xs font-body font-medium">
              Media belum tersedia
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

        {showFeaturedBadge && item.is_featured && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-black/75 px-2.5 py-0.5 text-[10px] font-body font-medium text-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            <span>Pilihan</span>
          </div>
        )}

        <div className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black/75 text-white shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {item.media_type === "video" ? (
            <Play size={14} fill="currentColor" />
          ) : (
            <ArrowUpRight size={14} />
          )}
        </div>
      </div>

      {/* Text & footer */}
      <div className="relative z-0 flex flex-1 flex-col justify-between gap-3 px-1 pb-0.5">
        <div className="flex flex-col gap-2">
          <span className="inline-flex max-w-full rounded-full border px-2.5 py-0.5 text-[11px] font-body font-medium uppercase tracking-wider border-white/10 bg-white/5 text-blue-300 w-fit">
            <span className="truncate">{item.tags || "Galeri"}</span>
          </span>

          <h3 className="text-base sm:text-lg font-heading font-semibold leading-snug tracking-tight text-white line-clamp-1 transition-colors duration-300 group-hover:text-blue-200">
            {item.title || "Tanpa Judul"}
          </h3>

          <p className="text-xs sm:text-sm font-body leading-relaxed text-white/70 line-clamp-2 text-justify">
            {item.description || "Belum ada deskripsi."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-[11px] font-body text-white/40 group-hover:text-white/65 transition-colors">
            Ketuk untuk detail
          </span>
          <ClapButton
            itemId={item.id}
            itemTitle={item.title}
            count={clapCount}
            onCountChange={onClapCountChange}
            size="sm"
            focusRing={focusRing}
          />
        </div>
      </div>
    </article>
  );
}
