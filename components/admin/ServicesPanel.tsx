"use client";

/* eslint-disable @next/next/no-img-element */

import type { Dispatch, SetStateAction } from "react";
import { Globe, Pencil, Trash2 } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import type { ServiceItem } from "../../types/content";

type ServicesPanelProps = {
  editingServiceId: number | null;
  focusRing: string;
  saving: boolean;
  services: ServiceItem[];
  sDescription: string;
  sDriveId: string;
  setSDescription: Dispatch<SetStateAction<string>>;
  setSDriveId: Dispatch<SetStateAction<string>>;
  setSTargetUrl: Dispatch<SetStateAction<string>>;
  setSTitle: Dispatch<SetStateAction<string>>;
  sTargetUrl: string;
  sTitle: string;
  onCancelEdit: () => void;
  onDeleteService: (service: ServiceItem) => void;
  onEditService: (service: ServiceItem) => void;
  onSaveService: () => void;
};

export function ServicesPanel({
  editingServiceId,
  focusRing,
  saving,
  services,
  sDescription,
  sDriveId,
  setSDescription,
  setSDriveId,
  setSTargetUrl,
  setSTitle,
  sTargetUrl,
  sTitle,
  onCancelEdit,
  onDeleteService,
  onEditService,
  onSaveService,
}: ServicesPanelProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-4xl font-black mb-8 text-white">
        Layanan
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4">
          <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl space-y-4">
            {editingServiceId !== null && (
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                  Mode Edit Layanan
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Kamu sedang mengubah data layanan yang sudah tersimpan.
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="serviceTitle"
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
              >
                Nama Jasa
              </label>
              <input
                id="serviceTitle"
                value={sTitle}
                onChange={(event) => setSTitle(event.target.value)}
                placeholder="Nama Jasa"
                className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
              />
            </div>

            <div>
              <label
                htmlFor="serviceDescription"
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
              >
                Deskripsi Singkat
              </label>
              <textarea
                id="serviceDescription"
                value={sDescription}
                onChange={(event) => setSDescription(event.target.value)}
                placeholder="Deskripsi singkat layanan"
                className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 h-28 resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="serviceIcon"
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
              >
                ID Drive Ikon
              </label>
              <input
                id="serviceIcon"
                value={sDriveId}
                onChange={(event) => setSDriveId(event.target.value)}
                placeholder="ID Drive Ikon"
                className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
              />
            </div>

            <div>
              <label
                htmlFor="serviceTargetUrl"
                className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2 block"
              >
                Link WhatsApp / Order
              </label>
              <input
                id="serviceTargetUrl"
                value={sTargetUrl}
                onChange={(event) => setSTargetUrl(event.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-800/50 border border-white/10 p-4 rounded-2xl text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onSaveService}
                disabled={saving}
                className={`w-full bg-cyan-500 text-slate-900 p-4 rounded-2xl font-black text-xs uppercase disabled:opacity-50 ${focusRing}`}
              >
                {saving
                  ? "Menyimpan..."
                  : editingServiceId !== null
                    ? "Simpan Perubahan"
                    : "Tambah Jasa"}
              </button>

              {editingServiceId !== null && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  disabled={saving}
                  className={`w-full bg-white/5 hover:bg-white/10 text-slate-300 p-4 rounded-2xl font-black text-xs uppercase border border-white/10 disabled:opacity-50 ${focusRing}`}
                >
                  Batal Edit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-3">
          {services.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <p className="text-sm font-bold text-slate-300">
                Belum ada layanan.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tambahkan layanan agar section produk bisa tampil di homepage.
              </p>
            </div>
          )}

          {services.map((service) => (
            <div
              key={service.id}
              className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  {service.image_url ? (
                    <img
                      src={formatMediaUrl(service.image_url, 256)}
                      alt={service.title || "Ikon layanan"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Globe size={20} />
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-white">
                    {service.title || "Untitled Service"}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 max-w-xl">
                    {service.description || "Belum ada deskripsi."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onEditService(service)}
                  className={`rounded-xl text-slate-500 hover:text-cyan-400 transition-colors p-2 ${focusRing}`}
                  aria-label={`Edit ${service.title || "layanan"}`}
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteService(service)}
                  className={`rounded-xl text-slate-600 hover:text-red-400 transition-colors p-2 ${focusRing}`}
                  aria-label={`Hapus ${service.title || "layanan"}`}
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
