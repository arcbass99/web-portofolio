"use client";

/* eslint-disable @next/next/no-img-element */

import type { Dispatch, SetStateAction } from "react";
import { ImageIcon } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import { GoogleCtaButton } from "../ui/GoogleCtaButton";

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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-semibold text-white tracking-tight leading-tight">
            Profil Utama
          </h1>
          <p className="text-white/70 text-xs sm:text-sm font-body leading-relaxed">
            Kelola identitas, foto profil, dan teks pengenalan di halaman utama.
          </p>
        </div>
      </div>

      <div className="solid-frost border border-white/12 bg-[#141619] shadow-xl rounded-2xl p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5 items-start">
          {/* Left Column: Compact Banner Preview & Input */}
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-white/10 bg-[#0b0d0e] p-2.5">
              <p className="text-[11px] font-body font-medium uppercase tracking-wider text-white/60 mb-2">
                Preview Foto / Banner
              </p>
              <div className="aspect-[4/5] w-full max-w-[180px] mx-auto overflow-hidden rounded-xl bg-white/5 flex items-center justify-center">
                {bannerUrl.trim() ? (
                  <img
                    src={formatMediaUrl(bannerUrl, 600)}
                    alt="Preview banner profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-white/30 p-4 text-center">
                    <ImageIcon size={22} />
                    <span className="text-xs font-body">Belum ada foto</span>
                  </div>
                )}
              </div>
            </div>

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
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Paste ID Drive..."
              />
              <p className="mt-1 text-xs font-body leading-relaxed text-white/50">
                Isi ID Google Drive atau URL gambar publik.
              </p>
            </div>
          </div>

          {/* Right Column: Headline, Bio & Save Button */}
          <div className="flex flex-col justify-between gap-4 h-full">
            <div className="space-y-3.5">
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
                  placeholder="Hai, saya Nafis"
                  className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-60"
                />
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
                  rows={5}
                  placeholder="Tulis deskripsi singkat profil..."
                  className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-xs sm:text-sm leading-relaxed disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <GoogleCtaButton
                onClick={onSave}
                disabled={saving}
                variant="light"
                focusRing={focusRing}
              >
                <span>{saving ? "Menyimpan..." : "Update Profil"}</span>
              </GoogleCtaButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
