"use client";

import type { Dispatch, SetStateAction } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { SocialLink } from "../../types/content";

type SocialsPanelProps = {
  editingSocialId: number | null;
  focusRing: string;
  newSocialTitle: string;
  newSocialUrl: string;
  saving: boolean;
  socials: SocialLink[];
  setNewSocialTitle: Dispatch<SetStateAction<string>>;
  setNewSocialUrl: Dispatch<SetStateAction<string>>;
  onCancelEdit: () => void;
  onDeleteSocial: (social: SocialLink) => void;
  onEditSocial: (social: SocialLink) => void;
  onSaveSocial: () => void;
};

export function SocialsPanel({
  editingSocialId,
  focusRing,
  newSocialTitle,
  newSocialUrl,
  saving,
  socials,
  setNewSocialTitle,
  setNewSocialUrl,
  onCancelEdit,
  onDeleteSocial,
  onEditSocial,
  onSaveSocial,
}: SocialsPanelProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
      <h1 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-white tracking-tight">
        Media Sosial
      </h1>

      <div className="grid grid-cols-1 gap-4">
        <div className="solid-frost border border-white/12 bg-[#141619] shadow-xl rounded-2xl p-4 sm:p-5">
          {editingSocialId !== null && (
            <div className="mb-3.5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                Mode Edit Link Sosial
              </p>
              <p className="mt-0.5 text-xs text-white/60">
                Kamu sedang mengubah link media sosial yang sudah tersimpan.
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label
                htmlFor="socialTitle"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
              >
                Nama Media
              </label>
              <input
                id="socialTitle"
                value={newSocialTitle}
                onChange={(event) => setNewSocialTitle(event.target.value)}
                disabled={saving}
                placeholder="Ex: Instagram"
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
            </div>

            <div className="flex-[2]">
              <label
                htmlFor="socialUrl"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
              >
                Link URL
              </label>
              <input
                id="socialUrl"
                value={newSocialUrl}
                onChange={(event) => setNewSocialUrl(event.target.value)}
                disabled={saving}
                placeholder="https://..."
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
            </div>

            <button
              type="button"
              onClick={onSaveSocial}
              disabled={saving}
              className={`w-full md:w-auto md:self-end bg-white hover:bg-white/90 text-black px-5 py-2 rounded-full font-semibold text-xs sm:text-sm shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${focusRing}`}
            >
              {saving ? (
                "Menyimpan..."
              ) : editingSocialId !== null ? (
                "Simpan Perubahan"
              ) : (
                <>
                  <Plus size={15} /> Tambah Link
                </>
              )}
            </button>
          </div>

          {editingSocialId !== null && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={saving}
              className={`mt-3 w-full bg-white/10 text-white hover:bg-white/15 py-2 rounded-full font-medium text-xs border border-white/10 disabled:opacity-50 transition-colors ${focusRing}`}
            >
              Batal Edit
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {socials.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#141619]/50 p-6 text-center">
              <p className="text-xs sm:text-sm font-semibold text-white/80">
                Belum ada link sosial.
              </p>
              <p className="mt-1 text-xs text-white/50">
                Tambahkan link agar pengunjung bisa menemukan kanal utamamu.
              </p>
            </div>
          )}

          {socials.map((social) => (
            <div
              key={social.id}
              className="flex items-center justify-between gap-3 p-3 solid-frost border border-white/10 bg-[#141619] rounded-xl shadow-md"
            >
              <div className="min-w-0">
                <p className="font-semibold text-white text-xs sm:text-sm">
                  {social.title || "Untitled Link"}
                </p>
                <p className="text-xs text-white/50 truncate max-w-[200px] md:max-w-md">
                  {social.url || "-"}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onEditSocial(social)}
                  className={`rounded-lg text-white/50 hover:text-blue-300 hover:bg-white/5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-1.5 ${focusRing}`}
                  aria-label={`Edit ${social.title || "link sosial"}`}
                >
                  <Pencil size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteSocial(social)}
                  className={`rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 p-1.5 transition-colors ${focusRing}`}
                  aria-label={`Hapus ${social.title || "link sosial"}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
