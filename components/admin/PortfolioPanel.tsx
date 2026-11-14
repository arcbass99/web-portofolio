"use client";

/* eslint-disable @next/next/no-img-element */

import type { Dispatch, SetStateAction } from "react";
import { Film, Home, Pencil, Star, Trash2 } from "lucide-react";
import { formatMediaUrl, formatVideoEmbedUrl } from "../../lib/media";
import type { PortfolioItem, PortfolioMediaType } from "../../types/content";
import { GoogleCtaButton } from "../ui/GoogleCtaButton";

type PortfolioPanelProps = {
  editingPortfolioId: number | null;
  focusRing: string;
  pDesc: string;
  pDriveId: string;
  pIsFeatured: boolean;
  pMediaType: PortfolioMediaType;
  portfolios: PortfolioItem[];
  pSortOrder: string;
  pTags: string;
  pTitle: string;
  saving: boolean;
  setPDesc: Dispatch<SetStateAction<string>>;
  setPDriveId: Dispatch<SetStateAction<string>>;
  setPIsFeatured: Dispatch<SetStateAction<boolean>>;
  setPMediaType: Dispatch<SetStateAction<PortfolioMediaType>>;
  setPSortOrder: Dispatch<SetStateAction<string>>;
  setPTags: Dispatch<SetStateAction<string>>;
  setPTitle: Dispatch<SetStateAction<string>>;
  onCancelEdit: () => void;
  onDeletePortfolio: (portfolio: PortfolioItem) => void;
  onEditPortfolio: (portfolio: PortfolioItem) => void;
  onSavePortfolio: () => void;
  onToggleFeatured: (portfolio: PortfolioItem) => void;
};

export function PortfolioPanel({
  editingPortfolioId,
  focusRing,
  pDesc,
  pDriveId,
  pIsFeatured,
  pMediaType,
  portfolios,
  pSortOrder,
  pTags,
  pTitle,
  saving,
  setPDesc,
  setPDriveId,
  setPIsFeatured,
  setPMediaType,
  setPSortOrder,
  setPTags,
  setPTitle,
  onCancelEdit,
  onDeletePortfolio,
  onEditPortfolio,
  onSavePortfolio,
  onToggleFeatured,
}: PortfolioPanelProps) {
  const mediaInput = pDriveId.trim();
  const portfolioImagePreviewUrl = mediaInput
    ? formatMediaUrl(mediaInput, 500)
    : "";
  const portfolioVideoPreviewUrl = formatVideoEmbedUrl(mediaInput);

  const featuredCount = portfolios.filter((item) => item.is_featured).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-semibold text-white tracking-tight leading-tight">
            Galeri
          </h1>
          <p className="text-white/70 text-xs sm:text-sm font-body leading-relaxed">
            Kelola karya visual, desain, video, dan dokumentasi kegiatan. Item
            yang ditandai <span className="text-amber-300">Beranda</span> akan
            tampil sebagai perwakilan di halaman utama.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-body text-white/75">
          <Home size={12} className="text-amber-300" />
          <span>
            {featuredCount > 0
              ? `${featuredCount} perwakilan di Beranda`
              : "Fallback 4 teratas di Beranda"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-4 items-start">
        {/* Left: Compact Sticky Form */}
        <div className="solid-frost border border-white/12 bg-[#141619] shadow-xl p-4 rounded-2xl xl:sticky xl:top-16 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[11px] uppercase tracking-wider text-blue-400 font-body">
              {editingPortfolioId !== null ? "Edit Item Galeri" : "Tambah Item Galeri"}
            </h3>
            {editingPortfolioId !== null && (
              <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-medium text-blue-300">
                Mode Edit
              </span>
            )}
          </div>

          {/* Row 1: Tipe Media + Urutan Tampil */}
          <div className="grid grid-cols-[1fr_105px] gap-2.5">
            <div>
              <label
                htmlFor="portfolioMediaType"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
              >
                Tipe Media
              </label>
              <select
                id="portfolioMediaType"
                value={pMediaType}
                disabled={saving}
                onChange={(event) =>
                  setPMediaType(event.target.value as PortfolioMediaType)
                }
                aria-label="Pilih tipe media galeri"
                title="Pilih tipe media galeri"
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              >
                <option value="image">Gambar</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="portfolioSortOrder"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
              >
                Urutan
              </label>
              <input
                id="portfolioSortOrder"
                type="number"
                inputMode="numeric"
                value={pSortOrder}
                disabled={saving}
                onChange={(event) => setPSortOrder(event.target.value)}
                placeholder="10"
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Judul + Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label
                htmlFor="portfolioTitle"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
              >
                Judul
              </label>
              <input
                id="portfolioTitle"
                value={pTitle}
                disabled={saving}
                onChange={(event) => setPTitle(event.target.value)}
                placeholder="Judul karya / kegiatan"
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="portfolioTags"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
              >
                Tags (Pisahkan Koma)
              </label>
              <input
                id="portfolioTags"
                value={pTags}
                disabled={saving}
                onChange={(event) => setPTags(event.target.value)}
                placeholder="Web, Dokumentasi"
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
              />
            </div>
          </div>

          {/* Row 3: ID Drive / Link Media + Compact Inline Preview */}
          <div>
            <label
              htmlFor="portfolioMedia"
              className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
            >
              ID Drive / Link Media
            </label>
            <input
              id="portfolioMedia"
              value={pDriveId}
              disabled={saving}
              onChange={(event) => setPDriveId(event.target.value)}
              placeholder="ID Drive / Link Gambar"
              className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
            />

            {mediaInput && (
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0d0e] p-2">
                <div className="aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-white/5">
                  {pMediaType === "video" ? (
                    <iframe
                      src={portfolioVideoPreviewUrl}
                      title="Preview video galeri"
                      className="h-full w-full border-0"
                      allow="autoplay"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={portfolioImagePreviewUrl}
                      alt="Preview media galeri"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <p className="text-xs font-body text-white/50 leading-relaxed">
                  Preview media aktif. Pastikan tampil jelas sebelum disimpan.
                </p>
              </div>
            )}
          </div>

          {/* Row 4: Deskripsi Singkat */}
          <div>
            <label
              htmlFor="portfolioDescription"
              className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
            >
              Deskripsi Singkat
            </label>
            <textarea
              id="portfolioDescription"
              value={pDesc}
              disabled={saving}
              rows={2}
              onChange={(event) => setPDesc(event.target.value)}
              placeholder="Deskripsi singkat karya atau momen kegiatan..."
              className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-none transition-all leading-relaxed"
            />
          </div>

          {/* Row 5: Tampilkan di Beranda Switch */}
          <label
            htmlFor="portfolioIsFeatured"
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b0d0e]/90 px-3 py-2.5 cursor-pointer hover:border-amber-400/30 transition-colors"
          >
            <div className="min-w-0">
              <span className="block text-xs font-heading font-semibold text-white">
                Tampilkan di Beranda
              </span>
              <span className="block text-[11px] font-body text-white/50 leading-snug">
                Jadikan perwakilan di carousel halaman utama
              </span>
            </div>
            <input
              id="portfolioIsFeatured"
              type="checkbox"
              checked={pIsFeatured}
              disabled={saving}
              onChange={(e) => setPIsFeatured(e.target.checked)}
              className="h-4 w-4 accent-amber-400 rounded cursor-pointer shrink-0"
            />
          </label>

          {/* Actions */}
          <div className="pt-1 flex items-center gap-2">
            <GoogleCtaButton
              onClick={onSavePortfolio}
              disabled={saving}
              variant="light"
              className="flex-1"
              focusRing={focusRing}
            >
              <span>
                {saving
                  ? "Menyimpan..."
                  : editingPortfolioId !== null
                    ? "Simpan Perubahan"
                    : "Simpan Item"}
              </span>
            </GoogleCtaButton>

            {editingPortfolioId !== null && (
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={saving}
                className={`bg-white/10 text-white hover:bg-white/15 px-4 py-2.5 rounded-full font-medium text-xs border border-white/10 disabled:opacity-50 transition-colors cursor-pointer ${focusRing}`}
              >
                Batal
              </button>
            )}
          </div>
        </div>

        {/* Right: Compact 2-Column Horizontal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {portfolios.length === 0 && (
            <div className="md:col-span-2 rounded-2xl border border-dashed border-white/15 bg-[#141619]/50 p-6 text-center">
              <p className="text-xs sm:text-sm font-heading font-semibold text-white/80">
                Belum ada item di Galeri.
              </p>
              <p className="mt-1 text-xs font-body text-white/50">
                Tambahkan karya atau dokumentasi pertama agar Galeri terisi.
              </p>
            </div>
          )}

          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className={`solid-frost rounded-xl p-2.5 flex items-center justify-between gap-3 group shadow-md transition-colors border ${
                portfolio.is_featured
                  ? "border-amber-400/35 bg-[#17191d]"
                  : "border-white/10 bg-[#141619] hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-20 aspect-[16/10] rounded-lg bg-slate-900 relative overflow-hidden shrink-0 border border-white/10">
                  {portfolio.media_type === "video" ? (
                    <Film
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/40"
                      size={18}
                    />
                  ) : (
                    <img
                      src={formatMediaUrl(portfolio.media_url, 300)}
                      alt={portfolio.title || "Preview galeri"}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-medium text-blue-300 tracking-wider truncate">
                      {portfolio.tags || "Galeri"}
                    </span>
                    <span className="text-[10px] text-white/40">•</span>
                    <span className="text-[10px] font-medium text-white/50 shrink-0">
                      #{portfolio.sort_order ?? 100}
                    </span>
                    {portfolio.is_featured && (
                      <span className="rounded-full bg-amber-500/15 border border-amber-400/30 px-1.5 py-0.2 text-[9px] font-medium text-amber-200">
                        Beranda
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-semibold text-white text-xs sm:text-sm leading-snug truncate mt-0.5">
                    {portfolio.title || "Tanpa Judul"}
                  </h4>
                  {portfolio.description && (
                    <p className="text-xs font-body text-white/50 line-clamp-1">
                      {portfolio.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => onToggleFeatured(portfolio)}
                  className={`rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-1.5 cursor-pointer ${focusRing} ${
                    portfolio.is_featured
                      ? "text-amber-300 hover:bg-amber-500/15"
                      : "text-white/40 hover:text-amber-200 hover:bg-white/5"
                  }`}
                  title={
                    portfolio.is_featured
                      ? "Keluarkan dari perwakilan Beranda"
                      : "Tampilkan sebagai perwakilan Beranda"
                  }
                  aria-label={`Tandai ${portfolio.title || "item"} untuk beranda`}
                >
                  <Star
                    size={14}
                    className={portfolio.is_featured ? "fill-amber-300" : ""}
                  />
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => onEditPortfolio(portfolio)}
                  className={`rounded-lg text-white/50 hover:text-blue-300 hover:bg-white/5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-1.5 cursor-pointer ${focusRing}`}
                  aria-label={`Edit ${portfolio.title || "galeri"}`}
                >
                  <Pencil size={14} />
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => onDeletePortfolio(portfolio)}
                  className={`rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-1.5 cursor-pointer ${focusRing}`}
                  aria-label={`Hapus ${portfolio.title || "galeri"}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
