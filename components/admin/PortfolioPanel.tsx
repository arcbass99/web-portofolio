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
      <h1 className="text-3xl md:text-5xl font-heading italic font-black mb-6 text-white">
        Karya
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.618fr)] gap-5 md:gap-5">
        <div className="space-y-4">
          <div className="liquid-glass-strong border border-white/10 bg-[#0a0a0a]/80 shadow-2xl shadow-black/50 p-5 rounded-3xl xl:sticky xl:top-24">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-cyan-500 mb-6">
              {editingPortfolioId !== null ? "Edit Karya" : "Tambah Karya"}
            </h3>

            {editingPortfolioId !== null && (
              <div className="mb-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                  Mode Edit Karya
                </p>
                <p className="mt-1 text-xs text-white/60">
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
                  className="w-full bg-black border border-[#333] text-white p-3.5 rounded-xl text-sm outline-none focus-visible:border-white/40 focus:border-white/40 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
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
                  className="w-full bg-black border border-[#333] text-white p-3.5 rounded-xl text-sm outline-none focus-visible:border-white/40 focus:border-white/40 transition-colors"
                />

                {mediaInput && (
                  <div className="mt-4 rounded-3xl border border-white/10 bg-black/40 p-3 liquid-glass">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                      Preview Media
                    </p>
                    <div className="mt-3 aspect-video overflow-hidden rounded-2xl bg-white/5">
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
                    <p className="mt-3 text-xs leading-relaxed text-white/60">
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
                  className="w-full bg-black border border-[#333] text-white p-3.5 rounded-xl text-sm outline-none focus-visible:border-white/40 focus:border-white/40 transition-colors"
                />
                <p className="mt-2 text-xs leading-relaxed text-white/60">
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
                  className="w-full bg-black border border-[#333] text-white p-3.5 rounded-xl text-sm outline-none focus-visible:border-white/40 focus:border-white/40 transition-colors"
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
                  className="w-full bg-black border border-[#333] text-white p-3.5 rounded-xl text-sm outline-none focus-visible:border-white/40 focus:border-white/40 h-24 resize-none transition-colors"
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
                  className="w-full bg-black border border-[#333] text-white p-3.5 rounded-xl text-sm outline-none focus-visible:border-white/40 focus:border-white/40 transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={onSavePortfolio}
                disabled={saving}
                className={`w-full bg-white text-black p-3.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-colors hover:bg-gray-200 ${focusRing}`}
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
                  className={`w-full liquid-glass-strong bg-white/10 text-white hover:bg-white/20 p-3.5 rounded-xl font-bold text-sm uppercase border border-white/10 disabled:opacity-50 transition-colors ${focusRing}`}
                >
                  Batal Edit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolios.length === 0 && (
            <div className="md:col-span-2 rounded-3xl border border-dashed border-[#333] bg-[#0a0a0a]/50 p-8 text-center liquid-glass">
              <p className="text-sm font-bold text-white/80">
                Belum ada karya.
              </p>
              <p className="mt-1 text-xs text-white/60">
                Tambahkan karya pertama agar section portfolio tidak kosong.
              </p>
            </div>
          )}

          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="liquid-glass-strong border border-[#333] bg-black/60 rounded-3xl overflow-hidden group"
            >
              <div className="aspect-video bg-black relative overflow-hidden">
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
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/80">
                    Urutan {portfolio.sort_order ?? 100}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onEditPortfolio(portfolio)}
                    className={`rounded-xl text-white/60 hover:text-cyan-400 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-2 ${focusRing}`}
                    aria-label={`Edit ${portfolio.title || "portfolio"}`}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onDeletePortfolio(portfolio)}
                    className={`rounded-xl text-white/60 hover:text-red-400 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-2 ${focusRing}`}
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
