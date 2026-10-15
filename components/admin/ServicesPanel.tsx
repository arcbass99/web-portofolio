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
  sSortOrder: string;
  setSDescription: Dispatch<SetStateAction<string>>;
  setSDriveId: Dispatch<SetStateAction<string>>;
  setSSortOrder: Dispatch<SetStateAction<string>>;
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
  sSortOrder,
  setSDescription,
  setSDriveId,
  setSSortOrder,
  setSTargetUrl,
  setSTitle,
  sTargetUrl,
  sTitle,
  onCancelEdit,
  onDeleteService,
  onEditService,
  onSaveService,
}: ServicesPanelProps) {
  const serviceIconInput = sDriveId.trim();
  const serviceIconPreviewUrl = serviceIconInput
    ? formatMediaUrl(serviceIconInput, 256)
    : "";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
      <h1 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-white tracking-tight">
        Produk Digital
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-5">
        <div>
          <div className="solid-frost border border-white/12 bg-[#141619] shadow-xl p-4 sm:p-5 rounded-2xl space-y-3.5 xl:sticky xl:top-20">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-blue-400 font-body">
              {editingServiceId !== null ? "Edit Produk" : "Tambah Produk"}
            </h3>

            {editingServiceId !== null && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                  Mode Edit Produk
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  Kamu sedang mengubah data produk/layanan yang sudah tersimpan.
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="serviceTitle"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
              >
                Nama Produk / Layanan
              </label>
              <input
                id="serviceTitle"
                value={sTitle}
                disabled={saving}
                onChange={(event) => setSTitle(event.target.value)}
                placeholder="Nama Produk / Layanan"
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="serviceDescription"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
              >
                Deskripsi Singkat
              </label>
              <textarea
                id="serviceDescription"
                value={sDescription}
                disabled={saving}
                rows={3}
                onChange={(event) => setSDescription(event.target.value)}
                placeholder="Deskripsi singkat produk"
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="serviceIcon"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
              >
                ID Drive Ikon
              </label>
              <input
                id="serviceIcon"
                value={sDriveId}
                disabled={saving}
                onChange={(event) => setSDriveId(event.target.value)}
                placeholder="ID Drive Ikon"
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />

              {serviceIconInput && (
                <div className="mt-3 rounded-xl border border-white/10 bg-[#0b0d0e] p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60 mb-2">
                    Preview Ikon
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5">
                      <img
                        src={serviceIconPreviewUrl}
                        alt="Preview ikon produk"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-white/50">
                      Pastikan ikon terlihat jelas sebelum produk disimpan.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="serviceSortOrder"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
              >
                Urutan Tampil
              </label>
              <input
                id="serviceSortOrder"
                type="number"
                inputMode="numeric"
                value={sSortOrder}
                disabled={saving}
                onChange={(event) => setSSortOrder(event.target.value)}
                placeholder="10"
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
              <p className="mt-1 text-xs text-white/50">
                Angka lebih kecil tampil lebih dulu (misal: 10, 20, 30).
              </p>
            </div>

            <div>
              <label
                htmlFor="serviceTargetUrl"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1.5 block font-body"
              >
                Link WhatsApp / Order
              </label>
              <input
                id="serviceTargetUrl"
                value={sTargetUrl}
                disabled={saving}
                onChange={(event) => setSTargetUrl(event.target.value)}
                placeholder="https://..."
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={onSaveService}
                disabled={saving}
                className={`w-full bg-white hover:bg-white/90 text-black py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 ${focusRing}`}
              >
                {saving
                  ? "Menyimpan..."
                  : editingServiceId !== null
                    ? "Simpan Perubahan"
                    : "Tambah Data"}
              </button>

              {editingServiceId !== null && (
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

        <div className="space-y-2.5">
          {services.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#141619]/50 p-6 text-center">
              <p className="text-xs sm:text-sm font-semibold text-white/80">
                Belum ada produk.
              </p>
              <p className="mt-1 text-xs text-white/50">
                Tambahkan produk/layanan agar section Produk Digital bisa tampil di homepage.
              </p>
            </div>
          )}

          {services.map((service) => (
            <div
              key={service.id}
              className="solid-frost border border-white/10 bg-[#141619] p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-md"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-black/40 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                  {service.image_url ? (
                    <img
                      src={formatMediaUrl(service.image_url, 128)}
                      alt={service.title || "Ikon produk"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Globe size={18} className="text-white/50" />
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm text-white truncate">
                    {service.title || "Untitled Service"}
                  </h4>
                  <p className="text-xs text-white/60 line-clamp-1 max-w-xl">
                    {service.description || "Belum ada deskripsi."}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-white/50">
                    Urutan {service.sort_order ?? 100}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onEditService(service)}
                  className={`rounded-lg text-white/50 hover:text-blue-300 hover:bg-white/5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-1.5 ${focusRing}`}
                  aria-label={`Edit ${service.title || "produk"}`}
                >
                  <Pencil size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteService(service)}
                  className={`rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:cursor-not-allowed disabled:opacity-40 p-1.5 ${focusRing}`}
                  aria-label={`Hapus ${service.title || "produk"}`}
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
