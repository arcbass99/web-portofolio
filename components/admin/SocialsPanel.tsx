"use client";

import type { Dispatch, SetStateAction } from "react";
import { Pencil, Plus, Trash2, ExternalLink } from "lucide-react";
import type { SocialLink } from "../../types/content";
import { GoogleCtaButton } from "../ui/GoogleCtaButton";

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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-3">
        <h1 className="text-2xl md:text-3xl font-heading font-semibold text-white tracking-tight leading-tight">
          Media Sosial
        </h1>
        <p className="text-white/70 text-xs sm:text-sm font-body leading-relaxed">
          Kelola tautan kontak utama (WhatsApp, Email, Instagram, LinkedIn, dll).
        </p>
      </div>

      <div className="space-y-4">
        {/* Compact Inline Form Bar */}
        <div className="solid-frost border border-white/12 bg-[#141619] shadow-xl rounded-2xl p-4">
          {editingSocialId !== null && (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-blue-300">
                Mode Edit Link Sosial
              </p>
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={saving}
                className="text-xs font-medium text-white/70 hover:text-white underline"
              >
                Batal Edit
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr_auto] gap-3 items-end">
            <div>
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
                placeholder="Ex: WhatsApp / Instagram"
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-xs sm:text-sm disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
            </div>

            <div>
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

            <div className="flex items-center gap-2">
              <GoogleCtaButton
                onClick={onSaveSocial}
                disabled={saving}
                variant="light"
                focusRing={focusRing}
              >
                <span>
                  {saving ? (
                    "Menyimpan..."
                  ) : editingSocialId !== null ? (
                    "Simpan Perubahan"
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Plus size={15} /> Tambah Link
                    </span>
                  )}
                </span>
              </GoogleCtaButton>

              {editingSocialId !== null && (
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
        </div>

        {/* Multi-column Compact Grid for Social Links */}
        {socials.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#141619]/50 p-6 text-center">
            <p className="text-xs sm:text-sm font-heading font-semibold text-white/80">
              Belum ada link sosial.
            </p>
            <p className="mt-1 text-xs font-body text-white/50">
              Tambahkan link agar pengunjung bisa menemukan kanal utamamu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {socials.map((social) => (
              <div
                key={social.id}
                className="flex items-center justify-between gap-2.5 p-3 solid-frost border border-white/10 bg-[#141619] rounded-xl shadow-md hover:border-white/20 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading font-semibold text-white text-xs sm:text-sm leading-snug truncate">
                      {social.title || "Untitled Link"}
                    </h4>
                    {social.url && (
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-blue-300 transition-colors shrink-0"
                        title="Buka link"
                      >
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  <p className="text-xs font-body text-white/50 truncate mt-0.5">
                    {social.url || "-"}
                  </p>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
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
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
