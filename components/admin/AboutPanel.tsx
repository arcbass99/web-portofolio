"use client";

import type { Dispatch, SetStateAction } from "react";

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
      <h1 className="text-3xl md:text-4xl font-black mb-2 text-white">
        Profil Utama
      </h1>
      <p className="text-slate-500 text-sm md:text-base mb-8">
        Kelola identitas dan teks utama di landing page.
      </p>

      <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 md:p-10 space-y-8 backdrop-blur-xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
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
                className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus:border-cyan-500 transition-all text-sm"
                placeholder="Paste ID Drive..."
              />
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
                className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus:border-cyan-500 transition-all text-sm"
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
              className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus:border-cyan-500 transition-all h-40 text-sm leading-relaxed"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className={`bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 ${focusRing}`}
        >
          {saving ? "Menyimpan..." : "Update Profil"}
        </button>
      </div>
    </div>
  );
}
