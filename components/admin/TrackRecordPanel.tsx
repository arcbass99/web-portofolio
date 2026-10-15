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
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
      <h1 className="text-2xl md:text-3xl font-heading font-semibold mb-1 text-white tracking-tight">
        Track Record
      </h1>
      <p className="text-white/60 text-xs sm:text-sm mb-4 font-body">
        Kelola riwayat pendidikan, pencapaian, kepemimpinan, dan keahlian inti.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-5">
        <div>
          <div className="solid-frost border border-white/12 bg-[#141619] shadow-xl p-4 sm:p-5 rounded-2xl space-y-3.5 xl:sticky xl:top-20">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-blue-400 font-body">
              {editingHighlightId !== null
                ? "Edit Track Record"
                : "Tambah Track Record"}
            </h3>

            {editingHighlightId !== null && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                  Mode Edit
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  Kamu sedang mengubah data track record yang sudah tersimpan.
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="highlightCategory"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
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
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
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
                  className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
                >
                  Periode / Tahun
                </label>
                <input
                  id="highlightPeriod"
                  value={hPeriod}
                  disabled={saving}
                  onChange={(event) => setHPeriod(event.target.value)}
                  placeholder="2024–2026"
                  className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
                />
              </div>
            )}

            {!isSkill && (
              <div>
                <label
                  htmlFor="highlightImage"
                  className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
                >
                  ID Drive Foto Opsional
                </label>
                <input
                  id="highlightImage"
                  value={hImageUrl}
                  disabled={saving}
                  onChange={(event) => setHImageUrl(event.target.value)}
                  placeholder="ID Drive / Link Gambar"
                  className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
                />

                {imagePreviewUrl && (
                  <div className="mt-3 rounded-xl border border-white/10 bg-[#0b0d0e] p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60 mb-2">
                      Preview Foto
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5">
                        <img
                          src={imagePreviewUrl}
                          alt="Preview track record"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-white/50">
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
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
              >
                {isSkill ? "Nama Keahlian" : "Judul"}
              </label>
              <input
                id="highlightTitle"
                value={hTitle}
                disabled={saving}
                onChange={(event) => setHTitle(event.target.value)}
                placeholder={isSkill ? "Analytical Thinking" : "Judul item"}
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
            </div>

            {!isSkill && (
              <div>
                <label
                  htmlFor="highlightDescription"
                  className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
                >
                  Deskripsi
                </label>
                <textarea
                  id="highlightDescription"
                  value={hDescription}
                  disabled={saving}
                  rows={3}
                  onChange={(event) => setHDescription(event.target.value)}
                  placeholder="Deskripsi singkat"
                  className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-none transition-all"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="highlightSortOrder"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
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
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
              <p className="mt-1 text-xs text-white/50">
                Angka lebih kecil tampil lebih dulu (misal: 10, 20, 30).
              </p>
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={onSaveHighlight}
                disabled={saving}
                className={`w-full bg-white hover:bg-white/90 text-black py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 ${focusRing}`}
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
                  className={`w-full bg-white/10 text-white hover:bg-white/15 py-2 rounded-full font-medium text-xs border border-white/10 disabled:opacity-50 transition-colors ${focusRing}`}
                >
                  Batal Edit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {highlights.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#141619]/50 p-6 text-center">
              <p className="text-xs sm:text-sm font-semibold text-white/80">
                Belum ada track record.
              </p>
              <p className="mt-1 text-xs text-white/50">
                Tambahkan data pendidikan, prestasi, kepemimpinan, atau skill.
              </p>
            </div>
          )}

          {groupedHighlights.map(({ category, label, items }) => (
            <section key={category} className="space-y-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50 font-body">
                {label}
              </h2>

              {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 bg-[#141619]/40 p-4">
                  <p className="text-xs text-white/40">
                    Belum ada data untuk kategori ini.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map((highlight) => (
                    <article
                      key={highlight.id}
                      className="solid-frost border border-white/10 bg-[#141619] p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {highlight.image_url ? (
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-black/40 border border-white/10">
                            <img
                              src={formatMediaUrl(highlight.image_url, 128)}
                              alt={highlight.title || "Track record image"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-semibold uppercase text-white/60">
                            {category === "skill" ? "SK" : "TR"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {highlight.period && (
                              <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-blue-300">
                                {highlight.period}
                              </span>
                            )}
                            <span className="text-[10px] font-medium text-white/50">
                              Urutan {highlight.sort_order ?? 100}
                            </span>
                          </div>

                          <h3 className="mt-0.5 font-semibold text-xs sm:text-sm text-white truncate">
                            {highlight.title || "Untitled"}
                          </h3>

                          {highlight.description && (
                            <p className="text-xs text-white/60 line-clamp-1 max-w-xl">
                              {highlight.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onEditHighlight(highlight)}
                          className={`rounded-lg text-white/50 hover:text-blue-300 hover:bg-white/5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-1.5 ${focusRing}`}
                          aria-label={`Edit ${highlight.title || "track record"}`}
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteHighlight(highlight)}
                          className={`rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-1.5 ${focusRing}`}
                          aria-label={`Hapus ${highlight.title || "track record"}`}
                        >
                          <Trash2 size={15} />
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
