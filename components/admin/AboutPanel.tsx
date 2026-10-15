"use client";

/* eslint-disable @next/next/no-img-element */

import type { Dispatch, SetStateAction } from "react";
import { formatMediaUrl } from "../../lib/media";

type AboutPanelProps = {
  bannerUrl: string;
  description: string;
  focusRing: string;
  headline: string;
  saving: boolean;
  setBannerUrl: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setHeadline: Dispatch<SetStateAction<string>>;
  onSave: () => void;
};

export function AboutPanel({
  bannerUrl,
  description,
  focusRing,
  headline,
  saving,
  setBannerUrl,
  setDescription,
  setHeadline,
  onSave,
}: AboutPanelProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
      <h1 className="text-2xl md:text-3xl font-heading font-semibold mb-1 text-white tracking-tight">
        Profil Utama
      </h1>
      <p className="text-white/60 text-xs sm:text-sm mb-5 font-body">
        Kelola identitas dan teks utama di landing page.
      </p>

      <div className="solid-frost border border-white/12 bg-[#141619] shadow-xl rounded-2xl p-4 sm:p-6 space-y-5">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="bannerUrl"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
              >
                ID Google Drive Banner
              </label>
              <input
                id="bannerUrl"
                value={bannerUrl}
                onChange={(event) => setBannerUrl(event.target.value)}
                disabled={saving}
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Paste ID Drive..."
              />
              <p className="mt-1.5 text-xs text-white/50">
                Isi dengan ID Google Drive atau URL gambar publik. Preview hanya muncul kalau media bisa diakses.
              </p>

              {bannerUrl.trim() && (
                <div className="mt-3.5 rounded-2xl border border-white/10 bg-[#0b0d0e] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60 mb-2">
                    Preview Banner
                  </p>
                  <div className="aspect-[4/3] max-w-sm overflow-hidden rounded-xl bg-white/5">
                    <img
                      src={formatMediaUrl(bannerUrl, 600)}
                      alt="Preview banner profil"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-xs text-white/50">
                    Preview ini membantu memastikan ID Drive banner sudah benar sebelum profil disimpan.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="headline"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
              >
                Headline Utama
              </label>
              <input
                id="headline"
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
                disabled={saving}
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
            >
              Deskripsi Bio
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={saving}
              rows={4}
              className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-xs sm:text-sm leading-relaxed disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className={`bg-white hover:bg-white/90 text-black px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
        >
          {saving ? "Menyimpan..." : "Update Profil"}
        </button>
      </div>
    </div>
  );
}
