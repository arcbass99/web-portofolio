"use client";

/* eslint-disable @next/next/no-img-element */

import type { Dispatch, SetStateAction } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import type {
  ProfileHighlight,
  ProfileHighlightCategory,
} from "../../types/content";

type TrackRecordPanelProps = {
  editingHighlightId: number | null;
  focusRing: string;
  hCategory: ProfileHighlightCategory;
  hDescription: string;
  hImageUrl: string;
  highlights: ProfileHighlight[];
  hPeriod: string;
  hSortOrder: string;
  hTitle: string;
  saving: boolean;
  setHCategory: Dispatch<SetStateAction<ProfileHighlightCategory>>;
  setHDescription: Dispatch<SetStateAction<string>>;
  setHImageUrl: Dispatch<SetStateAction<string>>;
  setHPeriod: Dispatch<SetStateAction<string>>;
  setHSortOrder: Dispatch<SetStateAction<string>>;
  setHTitle: Dispatch<SetStateAction<string>>;
  onCancelEdit: () => void;
  onDeleteHighlight: (highlight: ProfileHighlight) => void;
  onEditHighlight: (highlight: ProfileHighlight) => void;
  onSaveHighlight: () => void;
};

const categoryLabels: Record<ProfileHighlightCategory, string> = {
  education: "Riwayat Pendidikan",
  achievement: "Pencapaian Utama",
  leadership: "Kepemimpinan & Organisasi",
  skill: "Keahlian Inti",
};

const categoryOrder: ProfileHighlightCategory[] = [
  "education",
  "achievement",
  "leadership",
  "skill",
];

const sortHighlights = (items: ProfileHighlight[]) => {
  return [...items].sort((first, second) => {
    const firstOrder = first.sort_order ?? 100;
    const secondOrder = second.sort_order ?? 100;

    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }

    return first.id - second.id;
  });
};

export function TrackRecordPanel({
  editingHighlightId,
  focusRing,
  hCategory,
  hDescription,
  hImageUrl,
  highlights,
  hPeriod,
  hSortOrder,
  hTitle,
  saving,
  setHCategory,
  setHDescription,
  setHImageUrl,
  setHPeriod,
  setHSortOrder,
  setHTitle,
  onCancelEdit,
  onDeleteHighlight,
  onEditHighlight,
  onSaveHighlight,
}: TrackRecordPanelProps) {
  const isSkill = hCategory === "skill";
  const imagePreviewUrl = hImageUrl.trim()
    ? formatMediaUrl(hImageUrl.trim(), 256)
    : "";

  const groupedHighlights = categoryOrder.map((category) => ({
    category,
    label: categoryLabels[category],
    items: sortHighlights(
      highlights.filter((highlight) => highlight.category === category),
    ),
  }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl md:text-4xl font-black mb-2 text-white">
        Track Record
      </h1>
      <p className="text-slate-500 text-sm md:text-base mb-6">
        Kelola riwayat pendidikan, pencapaian, kepemimpinan, dan keahlian inti.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.618fr)] gap-5 md:gap-5">
        <div className="">
          <div className="bg-slate-900 border border-white/5 p-5 rounded-3xl space-y-4 sticky top-24">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-cyan-500">
              {editingHighlightId !== null
                ? "Edit Track Record"
                : "Tambah Track Record"}
            </h3>

            {editingHighlightId !== null && (
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                  Mode Edit
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Kamu sedang mengubah data track record yang sudah tersimpan.
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="highlightCategory"
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
              >
                Kategori
              </label>
              <select
                id="highlightCategory"
                value={hCategory}
                disabled={saving}
                onChange={(event) =>
                  setHCategory(event.target.value as ProfileHighlightCategory)
                }
                aria-label="Pilih kategori track record"
                title="Pilih kategori track record"
                className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {categoryOrder.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
            </div>

            {!isSkill && (
              <div>
                <label
                  htmlFor="highlightPeriod"
                  className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
                >
                  Periode / Tahun
                </label>
                <input
                  id="highlightPeriod"
                  value={hPeriod}
                  disabled={saving}
                  onChange={(event) => setHPeriod(event.target.value)}
                  placeholder="2024–2026"
                  className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            )}

            {!isSkill && (
              <div>
                <label
                  htmlFor="highlightImage"
                  className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
                >
                  ID Drive Foto Opsional
                </label>
                <input
                  id="highlightImage"
                  value={hImageUrl}
                  disabled={saving}
                  onChange={(event) => setHImageUrl(event.target.value)}
                  placeholder="ID Drive / Link Gambar"
                  className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                />

                {imagePreviewUrl && (
                  <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Preview Foto
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-800">
                        <img
                          src={imagePreviewUrl}
                          alt="Preview track record"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-xs leading-relaxed text-slate-500">
                        Foto ini opsional. Kalau kosong, item tetap tampil rapi.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="highlightTitle"
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
              >
                {isSkill ? "Nama Keahlian" : "Judul"}
              </label>
              <input
                id="highlightTitle"
                value={hTitle}
                  disabled={saving}
                onChange={(event) => setHTitle(event.target.value)}
                placeholder={isSkill ? "Analytical Thinking" : "Judul item"}
                className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {!isSkill && (
              <div>
                <label
                  htmlFor="highlightDescription"
                  className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
                >
                  Deskripsi
                </label>
                <textarea
                  id="highlightDescription"
                  value={hDescription}
                  disabled={saving}
                  onChange={(event) => setHDescription(event.target.value)}
                  placeholder="Deskripsi singkat"
                  className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 h-24 resize-none"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="highlightSortOrder"
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
              >
                Urutan Tampil
              </label>
              <input
                id="highlightSortOrder"
                type="number"
                inputMode="numeric"
                value={hSortOrder}
                  disabled={saving}
                onChange={(event) => setHSortOrder(event.target.value)}
                placeholder="10"
                className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Angka lebih kecil tampil lebih dulu. Gunakan 10, 20, 30 agar
                mudah menyisipkan data baru.
              </p>
            </div>

            <button
              type="button"
              onClick={onSaveHighlight}
              disabled={saving}
              className={`w-full bg-cyan-500 text-slate-900 p-3.5 rounded-2xl font-black text-xs uppercase disabled:opacity-50 ${focusRing}`}
            >
              {saving
                ? "Menyimpan..."
                : editingHighlightId !== null
                  ? "Simpan Perubahan"
                  : "Tambah Data"}
            </button>

            {editingHighlightId !== null && (
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

        <div className="space-y-6">
          {highlights.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <p className="text-sm font-bold text-slate-300">
                Belum ada track record.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tambahkan data pendidikan, prestasi, kepemimpinan, atau skill.
              </p>
            </div>
          )}

          {groupedHighlights.map(({ category, label, items }) => (
            <section key={category} className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                {label}
              </h2>

              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5">
                  <p className="text-xs font-semibold text-slate-500">
                    Belum ada data untuk kategori ini.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((highlight) => (
                    <article
                      key={highlight.id}
                      className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {highlight.image_url ? (
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-slate-800">
                            <img
                              src={formatMediaUrl(highlight.image_url, 256)}
                              alt={highlight.title || "Track record image"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase text-slate-500">
                            {category === "skill" ? "SK" : "TR"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {highlight.period && (
                              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-cyan-300">
                                {highlight.period}
                              </span>
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                              Urutan {highlight.sort_order ?? 100}
                            </span>
                          </div>

                          <h3 className="mt-1 font-bold text-sm text-white">
                            {highlight.title || "Untitled"}
                          </h3>

                          {highlight.description && (
                            <p className="mt-1 text-xs text-slate-500 line-clamp-2 max-w-xl">
                              {highlight.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onEditHighlight(highlight)}
                          className={`rounded-xl text-slate-500 hover:text-cyan-400 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-2 ${focusRing}`}
                          aria-label={`Edit ${highlight.title || "track record"}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteHighlight(highlight)}
                          className={`rounded-xl text-slate-600 hover:text-red-400 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-2 ${focusRing}`}
                          aria-label={`Hapus ${highlight.title || "track record"}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
