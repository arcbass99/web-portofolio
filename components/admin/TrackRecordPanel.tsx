"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, type Dispatch, type SetStateAction } from "react";
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
  education: "Pendidikan",
  achievement: "Pencapaian",
  leadership: "Kepemimpinan",
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
  const [filterCategory, setFilterCategory] = useState<
    ProfileHighlightCategory | "all"
  >("all");

  const isSkill = hCategory === "skill";
  const imagePreviewUrl = hImageUrl.trim()
    ? formatMediaUrl(hImageUrl.trim(), 256)
    : "";

  const groupedHighlights = categoryOrder
    .filter((cat) => filterCategory === "all" || filterCategory === cat)
    .map((category) => ({
      category,
      label: categoryLabels[category],
      items: sortHighlights(
        highlights.filter((highlight) => highlight.category === category),
      ),
    }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-semibold text-white tracking-tight leading-tight">
            Track Record
          </h1>
          <p className="text-white/70 text-xs sm:text-sm font-body leading-relaxed">
            Kelola riwayat pendidikan, pencapaian, kepemimpinan, dan keahlian
            inti.
          </p>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setFilterCategory("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
              filterCategory === "all"
                ? "bg-white text-black font-semibold"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            Semua ({highlights.length})
          </button>
          {categoryOrder.map((cat) => {
            const count = highlights.filter((h) => h.category === cat).length;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? "bg-white text-black font-semibold"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {categoryLabels[cat]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-4 items-start">
        {/* Left: Compact Sticky Form */}
        <div className="solid-frost border border-white/12 bg-[#141619] shadow-xl p-4 rounded-2xl space-y-3 xl:sticky xl:top-16">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[11px] uppercase tracking-wider text-blue-400 font-body">
              {editingHighlightId !== null
                ? "Edit Track Record"
                : "Tambah Track Record"}
            </h3>
            {editingHighlightId !== null && (
              <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-medium text-blue-300">
                Mode Edit
              </span>
            )}
          </div>

          {/* Row 1: Kategori + Urutan Tampil */}
          <div className="grid grid-cols-[1fr_95px] gap-2.5">
            <div>
              <label
                htmlFor="highlightCategory"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
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

            <div>
              <label
                htmlFor="highlightSortOrder"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
              >
                Urutan
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
            </div>
          </div>

          {/* Row 2: Judul / Nama Keahlian */}
          <div>
            <label
              htmlFor="highlightTitle"
              className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
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

          {/* Row 3 (Non-skill): Periode + Foto Opsional side-by-side */}
          {!isSkill && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label
                  htmlFor="highlightPeriod"
                  className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
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

              <div>
                <label
                  htmlFor="highlightImage"
                  className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
                >
                  ID Drive Foto
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="highlightImage"
                    value={hImageUrl}
                    disabled={saving}
                    onChange={(event) => setHImageUrl(event.target.value)}
                    placeholder="Opsional"
                    className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
                  />
                  {imagePreviewUrl && (
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#0b0d0e]"
                      title="Preview Foto"
                    >
                      <img
                        src={imagePreviewUrl}
                        alt="Preview track record"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Row 4 (Non-skill): Deskripsi */}
          {!isSkill && (
            <div>
              <label
                htmlFor="highlightDescription"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
              >
                Deskripsi
              </label>
              <textarea
                id="highlightDescription"
                value={hDescription}
                disabled={saving}
                rows={2}
                onChange={(event) => setHDescription(event.target.value)}
                placeholder="Deskripsi singkat..."
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-none transition-all leading-relaxed"
              />
            </div>
          )}

          {/* Submit & Cancel Buttons */}
          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={onSaveHighlight}
              disabled={saving}
              className={`btn-google-cta flex-1 bg-white hover:bg-white/95 text-black py-2.5 px-5 rounded-full font-semibold text-xs sm:text-sm shadow-md disabled:opacity-50 cursor-pointer ${focusRing}`}
            >
              <span>
                {saving
                  ? "Menyimpan..."
                  : editingHighlightId !== null
                    ? "Simpan Perubahan"
                    : "Tambah Data"}
              </span>
            </button>

            {editingHighlightId !== null && (
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={saving}
                className={`bg-white/10 text-white hover:bg-white/15 px-4 py-2.5 rounded-full font-medium text-xs border border-white/10 disabled:opacity-50 transition-colors ${focusRing}`}
              >
                Batal
              </button>
            )}
          </div>
        </div>

        {/* Right: Categorized Items (Compact Cards & Skill Chips) */}
        <div className="space-y-4">
          {highlights.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#141619]/50 p-6 text-center">
              <p className="text-xs sm:text-sm font-heading font-semibold text-white/80">
                Belum ada track record.
              </p>
              <p className="mt-1 text-xs font-body text-white/50">
                Tambahkan data pendidikan, prestasi, kepemimpinan, atau skill.
              </p>
            </div>
          )}

          {groupedHighlights.map(({ category, label, items }) => (
            <section key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-white/60 font-body">
                  {label} ({items.length})
                </h2>
              </div>

              {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/12 bg-[#141619]/40 px-3.5 py-2.5">
                  <p className="text-xs font-body text-white/40">
                    Belum ada data untuk kategori ini.
                  </p>
                </div>
              ) : category === "skill" ? (
                /* Compact Chip Grid for Skills */
                <div className="flex flex-wrap gap-2">
                  {items.map((highlight) => (
                    <div
                      key={highlight.id}
                      className="solid-frost inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#141619] pl-3.5 pr-2 py-1.5 shadow-sm hover:border-white/25 transition-colors"
                    >
                      <span className="text-[10px] font-medium text-blue-300">
                        #{highlight.sort_order ?? 100}
                      </span>
                      <span className="text-xs sm:text-sm font-heading font-semibold text-white">
                        {highlight.title || "Untitled"}
                      </span>
                      <div className="flex items-center gap-0.5 ml-1 border-l border-white/10 pl-1.5">
                        <button
                          type="button"
                          onClick={() => onEditHighlight(highlight)}
                          className={`rounded-full text-white/50 hover:text-blue-300 p-1 transition-colors ${focusRing}`}
                          aria-label={`Edit ${highlight.title || "keahlian"}`}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteHighlight(highlight)}
                          className={`rounded-full text-white/50 hover:text-red-400 p-1 transition-colors ${focusRing}`}
                          aria-label={`Hapus ${highlight.title || "keahlian"}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Compact Cards Grid for Education / Achievement / Leadership */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {items.map((highlight) => (
                    <article
                      key={highlight.id}
                      className="solid-frost border border-white/10 bg-[#141619] p-3 rounded-xl flex items-center justify-between gap-2.5 shadow-md hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {highlight.image_url ? (
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-black/40 border border-white/10">
                            <img
                              src={formatMediaUrl(highlight.image_url, 128)}
                              alt={highlight.title || "Track record image"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-9 w-9 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-semibold uppercase text-white/50">
                            #{highlight.sort_order ?? 100}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            {highlight.period && (
                              <span className="rounded-full bg-blue-500/15 px-2 py-0.2 text-[10px] font-semibold uppercase tracking-wider text-blue-300 truncate">
                                {highlight.period}
                              </span>
                            )}
                            {highlight.image_url && (
                              <span className="text-[10px] font-medium text-white/40 shrink-0">
                                #{highlight.sort_order ?? 100}
                              </span>
                            )}
                          </div>

                          <h4 className="mt-0.5 font-heading font-semibold text-xs sm:text-sm text-white leading-snug truncate">
                            {highlight.title || "Untitled"}
                          </h4>

                          {highlight.description && (
                            <p className="text-xs font-body text-white/55 line-clamp-1">
                              {highlight.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
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
                          <Trash2 size={14} />
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
