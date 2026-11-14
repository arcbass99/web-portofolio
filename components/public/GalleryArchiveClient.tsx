"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Film, Image as ImageIcon, Layers, Search, X } from "lucide-react";
import { PUBLIC_FOCUS_RING } from "../../lib/constants";
import { resolvePrimaryContact } from "../../lib/contact";
import {
  extractUniqueTags,
  filterGalleryItems,
  type GalleryMediaFilter,
} from "../../lib/gallery";
import { notifySifan, trackOncePerSession } from "../../lib/metrics-client";
import { smoothScrollTo } from "../../lib/smoothScroll";
import type { PortfolioItem, SocialLink } from "../../types/content";
import { AmbientAuroraOrb } from "../ui/AmbientAuroraOrb";
import { CloudCompanion } from "./CloudCompanion";
import { GalleryCard } from "./GalleryCard";
import { GalleryDetailModal } from "./GalleryDetailModal";
import { PublicErrorNotice } from "./PublicErrorNotice";
import { PublicFooter } from "./PublicFooter";
import { PublicMenuOverlay } from "./PublicMenuOverlay";
import { PublicNavbar } from "./PublicNavbar";
import { useRouter } from "next/navigation";

type GalleryArchiveClientProps = {
  items: PortfolioItem[];
  bannerUrl: string;
  socials: SocialLink[];
  highlightsCount: number;
  servicesCount: number;
  initialClaps: Record<string, number>;
  publicError: string | null;
};

const PAGE_BATCH_SIZE = 12;

export function GalleryArchiveClient({
  items,
  bannerUrl,
  socials,
  highlightsCount,
  servicesCount,
  initialClaps,
  publicError,
}: GalleryArchiveClientProps) {
  const router = useRouter();
  const focusRing = PUBLIC_FOCUS_RING;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<GalleryMediaFilter>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(PAGE_BATCH_SIZE);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [clapsMap, setClapsMap] = useState<Record<string, number>>(initialClaps);

  useEffect(() => {
    trackOncePerSession("pv_galeri", { type: "pageview", page: "galeri" });
  }, []);

  // Protect media against right-click/drag copy (consistent with Home page)
  useEffect(() => {
    const mediaTags = new Set(["IMG", "VIDEO", "CANVAS", "IFRAME"]);
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (mediaTags.has(target.tagName)) e.preventDefault();
    };
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (mediaTags.has(target.tagName)) e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  // Listen to Sifan Tour filter shortcuts on /galeri
  useEffect(() => {
    const handleSifanFilter = (event: Event) => {
      const filter = (event as CustomEvent<GalleryMediaFilter>).detail;
      if (filter === "all" || filter === "image" || filter === "video") {
        setMediaFilter(filter);
        setVisibleLimit(PAGE_BATCH_SIZE);
      }
    };
    window.addEventListener("sifan:galeri-filter", handleSifanFilter);
    return () =>
      window.removeEventListener("sifan:galeri-filter", handleSifanFilter);
  }, []);

  const uniqueTags = useMemo(() => extractUniqueTags(items), [items]);
  const videoCount = useMemo(
    () => items.filter((item) => item.media_type === "video").length,
    [items],
  );
  const imageCount = items.length - videoCount;

  const filteredItems = useMemo(
    () =>
      filterGalleryItems(items, {
        mediaType: mediaFilter,
        tag: selectedTag,
        query: searchQuery,
      }),
    [items, mediaFilter, selectedTag, searchQuery],
  );

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleLimit),
    [filteredItems, visibleLimit],
  );

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

  const handleMenuNavigate = (id: string) => {
    setIsMenuOpen(false);
    if (id === "galeri") {
      smoothScrollTo(0);
    } else if (id === "home") {
      router.push("/");
    } else {
      router.push(`/#${id}`);
    }
  };

  const {
    href: contactHref,
    label: contactLabel,
    isExternal: isExternalContact,
  } = resolvePrimaryContact(socials, "/");

  const featuredTitles = useMemo(
    () =>
      items
        .slice(0, 3)
        .map((p) => p.title)
        .filter((t): t is string => Boolean(t)),
    [items],
  );

  const hasActiveFilter =
    mediaFilter !== "all" || Boolean(selectedTag) || Boolean(searchQuery.trim());

  const resetFilters = () => {
    setMediaFilter("all");
    setSelectedTag(null);
    setSearchQuery("");
    setVisibleLimit(PAGE_BATCH_SIZE);
  };

  return (
    <div className="relative min-h-screen bg-[#0b0d0e] text-white font-body overflow-x-clip flex flex-col">
      <PublicNavbar
        focusRing={focusRing}
        bannerUrl={bannerUrl}
        highlightsCount={highlightsCount}
        servicesCount={servicesCount}
        currentPage="galeri"
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      <PublicMenuOverlay
        isOpen={isMenuOpen}
        highlightsCount={highlightsCount}
        servicesCount={servicesCount}
        currentPage="galeri"
        focusRing={focusRing}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleMenuNavigate}
      />

      <CloudCompanion
        context={{
          page: "galeri",
          totalGalleryCount: items.length,
          featuredTitles,
        }}
      />

      <main id="main-content" className="relative z-10 flex-1">
        {publicError && (
          <div className="pt-20">
            <PublicErrorNotice error={publicError} />
          </div>
        )}

        <section className="relative pt-24 pb-12 md:pt-28 md:pb-16 px-6 lg:px-12 max-w-6xl mx-auto">
          <AmbientAuroraOrb
            variant="blue"
            size="md"
            className="-top-10 -left-16 opacity-35"
            duration={24}
          />
          <AmbientAuroraOrb
            variant="violet"
            size="sm"
            className="top-12 -right-12 opacity-30"
            duration={28}
          />

          <div className="relative z-10">
            {/* Back Link + Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <Link
                href="/"
                className={`apple-liquid-glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-body font-medium text-white/85 hover:text-white transition-transform hover:-translate-x-0.5 ${focusRing}`}
              >
                <ArrowLeft size={14} />
                <span>Kembali ke Beranda</span>
              </Link>

              <span className="apple-liquid-glass rounded-full inline-flex items-center px-3.5 py-1 text-[11px] font-body font-medium uppercase tracking-wider text-blue-300">
                <span>Works &amp; Moments</span>
              </span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-tight text-white">
                  Galeri Lengkap
                </h1>
                <p className="mt-2.5 max-w-[60ch] text-xs sm:text-sm font-body leading-relaxed text-white/70">
                  Arsip karya, proyek, dan dokumentasi kegiatan. Gunakan filter
                  atau pencarian untuk menemukan item lebih cepat.
                </p>
              </div>

              <div className="flex items-baseline gap-2 shrink-0">
                <span className="text-2xl md:text-3xl font-heading font-semibold text-white/30">
                  {String(filteredItems.length).padStart(2, "0")}
                </span>
                <span className="text-xs font-body text-white/50">
                  {hasActiveFilter ? `dari ${items.length} item` : "total item"}
                </span>
              </div>
            </div>

            {/* Smart Filter Bar */}
            {items.length > 0 && (
              <div className="solid-frost rounded-2xl border border-white/12 bg-[#141619]/90 p-3.5 sm:p-4 mb-8 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Media Type Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaFilter("all");
                        setVisibleLimit(PAGE_BATCH_SIZE);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-body font-medium transition-colors cursor-pointer ${focusRing} ${
                        mediaFilter === "all"
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Layers size={13} />
                      <span>Semua ({items.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMediaFilter("image");
                        setVisibleLimit(PAGE_BATCH_SIZE);
                        notifySifan({ kind: "filter", label: "Gambar" });
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-body font-medium transition-colors cursor-pointer ${focusRing} ${
                        mediaFilter === "image"
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <ImageIcon size={13} />
                      <span>Gambar ({imageCount})</span>
                    </button>

                    {videoCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setMediaFilter("video");
                          setVisibleLimit(PAGE_BATCH_SIZE);
                          notifySifan({ kind: "filter", label: "Video" });
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-body font-medium transition-colors cursor-pointer ${focusRing} ${
                          mediaFilter === "video"
                            ? "bg-white text-black font-semibold shadow-sm"
                            : "border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Film size={13} />
                        <span>Video ({videoCount})</span>
                      </button>
                    )}
                  </div>

                  {/* Quick Search */}
                  <div className="relative w-full sm:w-64">
                    <Search
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setVisibleLimit(PAGE_BATCH_SIZE);
                      }}
                      placeholder="Cari judul, deskripsi, tag..."
                      aria-label="Cari item galeri"
                      className="w-full rounded-full border border-white/15 bg-[#0b0d0e] pl-8 pr-3 py-1.5 text-xs font-body text-white placeholder:text-white/40 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    />
                  </div>
                </div>

                {/* Auto-Extracted Tag Pills */}
                {uniqueTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTag(null);
                        setVisibleLimit(PAGE_BATCH_SIZE);
                      }}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-body font-medium transition-colors cursor-pointer ${focusRing} ${
                        selectedTag === null
                          ? "bg-blue-500/25 border border-blue-400/40 text-blue-200"
                          : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      Semua Tag
                    </button>

                    {uniqueTags.map(({ tag, count }) => {
                      const active =
                        selectedTag?.toLowerCase() === tag.toLowerCase();
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => {
                            const nextTag = active ? null : tag;
                            setSelectedTag(nextTag);
                            setVisibleLimit(PAGE_BATCH_SIZE);
                            if (nextTag) {
                              notifySifan({ kind: "filter", label: `tag ${nextTag}` });
                            }
                          }}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-body font-medium transition-colors cursor-pointer ${focusRing} ${
                            active
                              ? "bg-blue-500/25 border border-blue-400/40 text-blue-200"
                              : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
                          }`}
                        >
                          {tag} <span className="opacity-60">({count})</span>
                        </button>
                      );
                    })}

                    {hasActiveFilter && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-body text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <X size={11} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Gallery Grid */}
            {visibleItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {visibleItems.map((item) => (
                    <GalleryCard
                      key={item.id}
                      item={item}
                      clapCount={clapsMap[String(item.id)] ?? 0}
                      focusRing={focusRing}
                      onSelect={openDetail}
                      onClapCountChange={handleClapCountChange}
                      showFeaturedBadge
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 350px"
                    />
                  ))}
                </div>

                {filteredItems.length > visibleLimit && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleLimit((prev) => prev + PAGE_BATCH_SIZE)
                      }
                      className={`apple-liquid-glass rounded-full px-6 py-2.5 text-xs sm:text-sm font-body font-medium text-white hover:bg-white/15 transition-all cursor-pointer ${focusRing}`}
                    >
                      Muat Lebih Banyak ({filteredItems.length - visibleLimit}{" "}
                      tersisa)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="solid-frost rounded-[1.6rem] border border-white/10 bg-[#141619] p-8 md:p-12 text-center">
                <h2 className="text-base sm:text-lg font-heading font-semibold text-white">
                  {items.length === 0
                    ? "Galeri sedang disiapkan."
                    : "Tidak ada item yang cocok dengan filter."}
                </h2>
                <p className="mt-2 text-xs sm:text-sm font-body text-white/65">
                  {items.length === 0
                    ? "Konten karya dan dokumentasi kegiatan akan muncul setelah ditambahkan di console admin."
                    : "Coba ubah kata kunci pencarian atau pilih tag lain."}
                </p>
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className={`mt-4 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-body font-medium text-white hover:bg-white/20 transition-colors cursor-pointer ${focusRing}`}
                  >
                    Tampilkan Semua Item
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter
        contactHref={contactHref}
        contactLabel={contactLabel}
        isExternalContact={isExternalContact}
        focusRing={focusRing}
      />

      <GalleryDetailModal
        item={selectedItem}
        clapCount={selectedItem ? clapsMap[String(selectedItem.id)] ?? 0 : 0}
        focusRing={focusRing}
        onClose={() => setSelectedItem(null)}
        onClapCountChange={handleClapCountChange}
      />
    </div>
  );
}
