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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-5xl font-heading italic font-black mb-2 text-white">
        Profil Utama
      </h1>
      <p className="text-white/60 text-sm md:text-base mb-6">
        Kelola identitas dan teks utama di landing page.
      </p>

      <div className="liquid-glass-strong border border-white/10 bg-[#0a0a0a]/80 shadow-2xl shadow-black/50 rounded-3xl p-5 md:p-7 space-y-6 backdrop-blur-xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label
                htmlFor="bannerUrl"
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
              >
                ID Google Drive Banner
              </label>
              <input
                id="bannerUrl"
                value={bannerUrl}
                onChange={(event) => setBannerUrl(event.target.value)}
                disabled={saving}
                className="w-full bg-black border border-[#333] text-white p-3.5 rounded-xl outline-none focus-visible:border-white/40 focus:border-white/40 transition-colors text-sm disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Paste ID Drive..."
              />
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                Isi dengan ID Google Drive atau URL gambar publik. Preview hanya
                muncul kalau media bisa diakses.
              </p>

              {bannerUrl.trim() && (
                <div className="mt-4 rounded-3xl border border-white/10 bg-black/40 p-3 liquid-glass">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    Preview Banner
                  </p>
                  <div className="mt-3 aspect-[4/3] overflow-hidden rounded-2xl bg-white/5">
                    <img
                      src={formatMediaUrl(bannerUrl, 600)}
                      alt="Preview banner profil"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-white/60">
                    Preview ini membantu memastikan ID Drive banner sudah benar
                    sebelum profil disimpan.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="headline"
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
              >
                Headline Utama
              </label>
              <input
                id="headline"
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
                disabled={saving}
                className="w-full bg-black border border-[#333] text-white p-3.5 rounded-xl outline-none focus-visible:border-white/40 focus:border-white/40 transition-colors text-sm disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
            >
              Deskripsi Bio
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={saving}
              className="w-full bg-black border border-[#333] text-white p-3.5 rounded-xl outline-none focus-visible:border-white/40 focus:border-white/40 transition-colors h-32 text-sm leading-relaxed disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className={`bg-white hover:bg-gray-200 text-black px-6 py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
        >
          {saving ? "Menyimpan..." : "Update Profil"}
        </button>
      </div>
    </div>
  );
}
