"use client";

/* eslint-disable @next/next/no-img-element */

import type { Dispatch, SetStateAction } from "react";
import { Film, Pencil, Trash2 } from "lucide-react";
import { formatMediaUrl, formatVideoEmbedUrl } from "../../lib/media";
import type { PortfolioItem, PortfolioMediaType } from "../../types/content";

type PortfolioPanelProps = {
  editingPortfolioId: number | null;
  focusRing: string;
  pDesc: string;
  pDriveId: string;
  pMediaType: PortfolioMediaType;
  portfolios: PortfolioItem[];
  pSortOrder: string;
  pTags: string;
  pTitle: string;
  saving: boolean;
  setPDesc: Dispatch<SetStateAction<string>>;
  setPDriveId: Dispatch<SetStateAction<string>>;
  setPMediaType: Dispatch<SetStateAction<PortfolioMediaType>>;
  setPSortOrder: Dispatch<SetStateAction<string>>;
  setPTags: Dispatch<SetStateAction<string>>;
  setPTitle: Dispatch<SetStateAction<string>>;
  onCancelEdit: () => void;
  onDeletePortfolio: (portfolio: PortfolioItem) => void;
  onEditPortfolio: (portfolio: PortfolioItem) => void;
  onSavePortfolio: () => void;
};

export function PortfolioPanel({
  editingPortfolioId,
  focusRing,
  pDesc,
  pDriveId,
  pMediaType,
  portfolios,
  pSortOrder,
  pTags,
  pTitle,
  saving,
  setPDesc,
  setPDriveId,
  setPMediaType,
  setPSortOrder,
  setPTags,
  setPTitle,
  onCancelEdit,
  onDeletePortfolio,
  onEditPortfolio,
  onSavePortfolio,
}: PortfolioPanelProps) {
  const mediaInput = pDriveId.trim();
  const portfolioImagePreviewUrl = mediaInput
    ? formatMediaUrl(mediaInput, 500)
    : "";
  const portfolioVideoPreviewUrl = formatVideoEmbedUrl(mediaInput);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
      <h1 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-white tracking-tight">
        Karya
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-5">
        <div className="space-y-4">
          <div className="solid-frost border border-white/12 bg-[#141619] shadow-xl p-4 sm:p-5 rounded-2xl xl:sticky xl:top-20">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-blue-400 mb-4 font-body">
              {editingPortfolioId !== null ? "Edit Karya" : "Tambah Karya"}
            </h3>

            {editingPortfolioId !== null && (
              <div className="mb-3.5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                  Mode Edit Karya
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  Kamu sedang mengubah data karya yang sudah tersimpan.
                </p>
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label
                  htmlFor="portfolioMediaType"
                  className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
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
                  aria-label="Pilih tipe media portfolio"
                  title="Pilih tipe media portfolio"
                  className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
                >
                  <option value="image">Gambar</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="portfolioMedia"
                  className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
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
                  <div className="mt-3 rounded-xl border border-white/10 bg-[#0b0d0e] p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60 mb-2">
                      Preview Media
                    </p>
                    <div className="aspect-video max-w-xs overflow-hidden rounded-lg bg-white/5">
                      {pMediaType === "video" ? (
                        <iframe
                          src={portfolioVideoPreviewUrl}
                          title="Preview video portfolio"
                          className="h-full w-full border-0"
                          allow="autoplay"
                          loading="lazy"
                        />
                      ) : (
                        <img
                          src={portfolioImagePreviewUrl}
                          alt="Preview media portfolio"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-white/50">
                      Preview ini belum menyimpan data. Gunakan untuk memastikan media yang dipilih sudah sesuai.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="portfolioSortOrder"
                  className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
                >
                  Urutan Tampil
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
                <p className="mt-1 text-xs text-white/50">
                  Angka lebih kecil tampil lebih dulu (misal: 10, 20, 30).
                </p>
              </div>

              <div>
                <label
                  htmlFor="portfolioTitle"
                  className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
                >
                  Judul Karya
                </label>
                <input
                  id="portfolioTitle"
                  value={pTitle}
                  disabled={saving}
                  onChange={(event) => setPTitle(event.target.value)}
                  placeholder="Judul Karya"
                  className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="portfolioDescription"
                  className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
                >
                  Deskripsi Singkat
                </label>
                <textarea
                  id="portfolioDescription"
                  value={pDesc}
                  disabled={saving}
                  rows={3}
                  onChange={(event) => setPDesc(event.target.value)}
                  placeholder="Deskripsi Singkat"
                  className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-none transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="portfolioTags"
                  className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
                >
                  Tags
                </label>
                <input
                  id="portfolioTags"
                  value={pTags}
                  disabled={saving}
                  onChange={(event) => setPTags(event.target.value)}
                  placeholder="Ex: Web, UI/UX"
                  className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
              </div>

              <div className="pt-1 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onSavePortfolio}
                  disabled={saving}
                  className={`w-full bg-white text-black py-2.5 rounded-full font-semibold text-xs sm:text-sm disabled:opacity-50 transition-all hover:bg-white/90 shadow-md active:scale-[0.98] ${focusRing}`}
                >
                  {saving
                    ? "Menyimpan..."
                    : editingPortfolioId !== null
                      ? "Simpan Perubahan"
                      : "Simpan Karya"}
                </button>

                {editingPortfolioId !== null && (
                  <button
                    type="button"
                    onClick={onCancelEdit}
                    disabled={saving}
                    className={`w-full bg-white/10 text-white hover:bg-white/15 py-2 rounded-full font-medium text-xs border border-white/10 disabled:opacity-50 transition-colors ${focusRing}`}
                  >
                    Batal Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {portfolios.length === 0 && (
            <div className="md:col-span-2 rounded-2xl border border-dashed border-white/15 bg-[#141619]/50 p-6 text-center">
              <p className="text-xs sm:text-sm font-semibold text-white/80">
                Belum ada karya.
              </p>
              <p className="mt-1 text-xs text-white/50">
                Tambahkan karya pertama agar section portfolio tidak kosong.
              </p>
            </div>
          )}

          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="solid-frost border border-white/10 bg-[#141619] rounded-2xl overflow-hidden group shadow-lg"
            >
              <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden">
                {portfolio.media_type === "video" ? (
                  <Film
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20"
                    size={28}
                  />
                ) : (
                  <img
                    src={formatMediaUrl(portfolio.media_url, 400)}
                    alt={portfolio.title || "Preview portfolio"}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  />
                )}
              </div>

              <div className="p-3.5 flex justify-between items-center gap-3">
                <div className="min-w-0">
                  <h4 className="font-semibold text-white text-xs sm:text-sm truncate">
                    {portfolio.title || "Untitled Project"}
                  </h4>
                  <p className="text-[10px] uppercase font-medium text-blue-400 tracking-wider truncate">
                    {portfolio.tags || "Project"}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-white/50">
                    Urutan {portfolio.sort_order ?? 100}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onEditPortfolio(portfolio)}
                    className={`rounded-lg text-white/50 hover:text-blue-300 hover:bg-white/5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-1.5 ${focusRing}`}
                    aria-label={`Edit ${portfolio.title || "portfolio"}`}
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onDeletePortfolio(portfolio)}
                    className={`rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-1.5 ${focusRing}`}
                    aria-label={`Hapus ${portfolio.title || "portfolio"}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
