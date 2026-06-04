"use client";

/* eslint-disable @next/next/no-img-element */

import type { Dispatch, SetStateAction } from "react";
import { Film, Pencil, Trash2 } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
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
    ? formatMediaUrl(mediaInput, 600)
    : "";
  const portfolioVideoPreviewUrl =
    mediaInput.startsWith("http://") || mediaInput.startsWith("https://")
      ? mediaInput
      : `https://drive.google.com/file/d/${mediaInput}/preview`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl md:text-4xl font-black mb-6 text-white">
        Karya
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.618fr)] gap-5 md:gap-5">
        <div className="space-y-4">
          <div className="bg-slate-900 border border-white/5 p-5 rounded-3xl sticky top-24">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-cyan-500 mb-6">
              {editingPortfolioId !== null ? "Edit Karya" : "Tambah Karya"}
            </h3>

            {editingPortfolioId !== null && (
              <div className="mb-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                  Mode Edit Karya
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Kamu sedang mengubah data karya yang sudah tersimpan.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="portfolioMediaType"
                  className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
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
                  className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="image">Gambar</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="portfolioMedia"
                  className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
                >
                  ID Drive / Link Media
                </label>
                <input
                  id="portfolioMedia"
                  value={pDriveId}
                  disabled={saving}
                  onChange={(event) => setPDriveId(event.target.value)}
                  placeholder="ID Drive / Link Gambar"
                  className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                />

                {mediaInput && (
                  <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/40 p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Preview Media
                    </p>
                    <div className="mt-3 aspect-video overflow-hidden rounded-2xl bg-slate-800">
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
                    <p className="mt-3 text-xs leading-relaxed text-slate-500">
                      Preview ini belum menyimpan data. Gunakan untuk memastikan
                      media yang dipilih sudah sesuai.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="portfolioSortOrder"
                  className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
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
                  className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                />
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Angka lebih kecil tampil lebih dulu. Gunakan kelipatan 10
                  seperti 10, 20, 30 agar mudah menyisipkan karya baru.
                </p>
              </div>

              <div>
                <label
                  htmlFor="portfolioTitle"
                  className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
                >
                  Judul Karya
                </label>
                <input
                  id="portfolioTitle"
                  value={pTitle}
                  disabled={saving}
                  onChange={(event) => setPTitle(event.target.value)}
                  placeholder="Judul Karya"
                  className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                />
              </div>

              <div>
                <label
                  htmlFor="portfolioDescription"
                  className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
                >
                  Deskripsi Singkat
                </label>
                <textarea
                  id="portfolioDescription"
                  value={pDesc}
                  disabled={saving}
                  onChange={(event) => setPDesc(event.target.value)}
                  placeholder="Deskripsi Singkat"
                  className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 h-24 resize-none"
                />
              </div>

              <div>
                <label
                  htmlFor="portfolioTags"
                  className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
                >
                  Tags
                </label>
                <input
                  id="portfolioTags"
                  value={pTags}
                  disabled={saving}
                  onChange={(event) => setPTags(event.target.value)}
                  placeholder="Ex: Web, UI/UX"
                  className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                />
              </div>

              <button
                type="button"
                onClick={onSavePortfolio}
                disabled={saving}
                className={`w-full bg-cyan-500 text-slate-900 p-3.5 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50 ${focusRing}`}
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
                  className={`w-full bg-white/5 hover:bg-white/10 text-slate-300 p-3.5 rounded-2xl font-black text-xs uppercase border border-white/10 disabled:opacity-50 ${focusRing}`}
                >
                  Batal Edit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolios.length === 0 && (
            <div className="md:col-span-2 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <p className="text-sm font-bold text-slate-300">
                Belum ada karya.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tambahkan karya pertama agar section portfolio tidak kosong.
              </p>
            </div>
          )}

          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden group"
            >
              <div className="aspect-video bg-slate-800 relative overflow-hidden">
                {portfolio.media_type === "video" ? (
                  <Film
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20"
                    size={32}
                  />
                ) : (
                  <img
                    src={formatMediaUrl(portfolio.media_url, 600)}
                    alt={portfolio.title || "Preview portfolio"}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </div>

              <div className="p-5 flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">
                    {portfolio.title || "Untitled Project"}
                  </h4>
                  <p className="text-[10px] uppercase font-black text-cyan-500 tracking-tighter truncate">
                    {portfolio.tags || "Project"}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    Urutan {portfolio.sort_order ?? 100}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onEditPortfolio(portfolio)}
                    className={`rounded-xl text-slate-500 hover:text-cyan-400 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-2 ${focusRing}`}
                    aria-label={`Edit ${portfolio.title || "portfolio"}`}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onDeletePortfolio(portfolio)}
                    className={`rounded-xl text-slate-600 hover:text-red-400 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-2 ${focusRing}`}
                    aria-label={`Hapus ${portfolio.title || "portfolio"}`}
                  >
                    <Trash2 size={16} />
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
