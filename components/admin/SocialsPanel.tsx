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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl md:text-4xl font-black mb-6 text-white">
        Media Sosial
      </h1>

      <div className="grid grid-cols-1 gap-5">
        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-5">
          {editingSocialId !== null && (
            <div className="mb-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                Mode Edit Link Sosial
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Kamu sedang mengubah link media sosial yang sudah tersimpan.
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="socialTitle"
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
              >
                Nama Media
              </label>
              <input
                id="socialTitle"
                value={newSocialTitle}
                onChange={(event) => setNewSocialTitle(event.target.value)}
                disabled={saving}
                placeholder="Ex: Instagram"
                className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="flex-[2]">
              <label
                htmlFor="socialUrl"
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
              >
                Link URL
              </label>
              <input
                id="socialUrl"
                value={newSocialUrl}
                onChange={(event) => setNewSocialUrl(event.target.value)}
                disabled={saving}
                placeholder="https://..."
                className="w-full bg-slate-800/50 border border-white/10 p-3.5 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="button"
              onClick={onSaveSocial}
              disabled={saving}
              className={`w-full md:w-auto md:self-end bg-white text-slate-900 px-5 py-3.5 rounded-2xl font-black text-xs uppercase disabled:opacity-50 flex items-center justify-center gap-2 ${focusRing}`}
            >
              {saving ? (
                "Menyimpan..."
              ) : editingSocialId !== null ? (
                "Simpan Perubahan"
              ) : (
                <>
                  <Plus size={16} /> Tambah Link
                </>
              )}
            </button>
          </div>

          {editingSocialId !== null && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={saving}
              className={`mt-4 w-full bg-white/5 hover:bg-white/10 text-slate-300 p-3.5 rounded-2xl font-black text-xs uppercase border border-white/10 disabled:opacity-50 ${focusRing}`}
            >
              Batal Edit
            </button>
          )}
        </div>

        <div className="space-y-3">
          {socials.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
              <p className="text-sm font-bold text-slate-300">
                Belum ada link sosial.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tambahkan link agar pengunjung bisa menemukan kanal utamamu.
              </p>
            </div>
          )}

          {socials.map((social) => (
            <div
              key={social.id}
              className="flex items-center justify-between gap-4 p-4 bg-slate-900/30 border border-white/5 rounded-2xl backdrop-blur-sm"
            >
              <div className="min-w-0">
                <p className="font-bold text-white text-sm">
                  {social.title || "Untitled Link"}
                </p>
                <p className="text-xs text-slate-500 truncate max-w-[200px] md:max-w-md">
                  {social.url || "-"}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onEditSocial(social)}
                  className={`rounded-xl text-slate-500 hover:text-cyan-400 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-2 ${focusRing}`}
                  aria-label={`Edit ${social.title || "link sosial"}`}
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteSocial(social)}
                  className={`rounded-xl text-slate-600 hover:text-red-400 p-2 transition-colors ${focusRing}`}
                  aria-label={`Hapus ${social.title || "link sosial"}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
