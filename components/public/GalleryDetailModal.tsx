"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import {
  formatMediaUrl,
  formatVideoEmbedUrl,
  isGoogleDriveMediaUrl,
} from "../../lib/media";
import type { PortfolioItem } from "../../types/content";
import { ClapButton } from "./ClapButton";
import { GoogleCtaButton } from "../ui/GoogleCtaButton";

type GalleryDetailModalProps = {
  item: PortfolioItem | null;
  clapCount: number;
  focusRing: string;
  onClose: () => void;
  onClapCountChange: (itemId: number, newCount: number) => void;
};

export function GalleryDetailModal({
  item,
  clapCount,
  focusRing,
  onClose,
  onClapCountChange,
}: GalleryDetailModalProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (item) {
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
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[80] flex justify-center p-4 md:p-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Detail ${item.title || "galeri"}`}
        >
          <button
            type="button"
            aria-label="Tutup detail galeri"
            className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="solid-frost relative z-10 my-auto w-full max-w-4xl rounded-[1.6rem] border p-4 shadow-2xl md:p-6 border-white/12 bg-[#141619] text-white flex flex-col max-h-[88vh] overflow-hidden will-change-transform"
          >
            <button
              type="button"
              onClick={onClose}
              autoFocus
              aria-label="Tutup detail galeri"
              className={`absolute right-4 top-4 z-30 rounded-full border p-2 transition ${focusRing} border-white/10 bg-black/70 backdrop-blur-md text-white hover:bg-white/20`}
            >
              <X size={18} />
            </button>

            <div className="overflow-y-auto pr-2 h-full w-full">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900 md:rounded-2xl">
                  {item.media_type === "video" && item.media_url ? (
                    <>
                      <iframe
                        src={formatVideoEmbedUrl(item.media_url)}
                        title={item.title || "Galeri video detail"}
                        className="h-full w-full border-0"
                        allow="autoplay; fullscreen"
                        loading="lazy"
                        allowFullScreen
                      />

                      <GoogleCtaButton
                        href={formatVideoEmbedUrl(item.media_url)}
                        target="_blank"
                        variant="light"
                        className="absolute bottom-3 left-3 z-10 shadow-xl"
                        focusRing={focusRing}
                      >
                        <span>Buka di Drive</span>
                        <ArrowUpRight size={13} />
                      </GoogleCtaButton>
                    </>
                  ) : item.media_url ? (() => {
                    const detailSrc = formatMediaUrl(item.media_url, 1000);
                    if (failedSrc === detailSrc) {
                      return (
                        <div className="flex h-full flex-col items-center justify-center px-4 text-center text-slate-400">
                          <ArrowUpRight size={28} className="mb-2 opacity-60" />
                          <p className="text-xs font-body font-medium">
                            Gagal memuat pratinjau gambar
                          </p>
                        </div>
                      );
                    }
                    return (
                      <Image
                        src={detailSrc}
                        alt={item.title || "Galeri detail image"}
                        fill
                        sizes="(max-width: 1024px) 92vw, 50vw"
                        quality={82}
                        unoptimized={isGoogleDriveMediaUrl(detailSrc)}
                        onError={() => setFailedSrc(detailSrc)}
                        className="object-cover"
                      />
                    );
                  })() : (
                    <div className="flex h-full flex-col items-center justify-center px-4 text-center text-slate-400">
                      <ArrowUpRight size={28} className="mb-2 opacity-60" />
                      <p className="text-xs font-body font-medium">
                        Media galeri belum tersedia
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-5 p-1">
                  <div>
                    <span className="inline-flex max-w-full rounded-full border px-3 py-1 text-[11px] font-body font-medium uppercase tracking-wider border-white/10 bg-white/5 text-blue-300">
                      <span className="truncate">{item.tags || "Galeri"}</span>
                    </span>

                    <h3 className="mt-3.5 text-xl md:text-2xl font-heading font-semibold tracking-tight text-white">
                      {item.title || "Tanpa Judul"}
                    </h3>

                    <p className="mt-3 whitespace-pre-line text-xs sm:text-sm font-body leading-relaxed text-white/70 text-justify">
                      {item.description ||
                        "Belum ada deskripsi detail untuk item galeri ini."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                    <span className="text-xs font-body text-white/50">
                      Suka dengan karya atau momen ini?
                    </span>
                    <ClapButton
                      itemId={item.id}
                      itemTitle={item.title}
                      count={clapCount}
                      onCountChange={onClapCountChange}
                      size="md"
                      focusRing={focusRing}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
