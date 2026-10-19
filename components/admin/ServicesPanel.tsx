"use client";

/* eslint-disable @next/next/no-img-element */

import type { Dispatch, SetStateAction } from "react";
import { Globe, Pencil, Trash2 } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import type { ServiceItem } from "../../types/content";
import { GoogleCtaButton } from "../ui/GoogleCtaButton";

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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-3">
        <h1 className="text-2xl md:text-3xl font-heading font-semibold text-white tracking-tight leading-tight">
          Produk Digital
        </h1>
        <p className="text-white/70 text-xs sm:text-sm font-body leading-relaxed">
          Kelola produk, layanan digital, dan tautan pemesanan langsung.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-4 items-start">
        {/* Left: Compact Sticky Form */}
        <div className="solid-frost border border-white/12 bg-[#141619] shadow-xl p-4 rounded-2xl space-y-3 xl:sticky xl:top-16">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[11px] uppercase tracking-wider text-blue-400 font-body">
              {editingServiceId !== null ? "Edit Produk" : "Tambah Produk"}
            </h3>
            {editingServiceId !== null && (
              <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-medium text-blue-300">
                Mode Edit
              </span>
            )}
          </div>

          {/* Row 1: Nama Produk + Urutan */}
          <div className="grid grid-cols-[1fr_95px] gap-2.5">
            <div>
              <label
                htmlFor="serviceTitle"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
              >
                Nama Produk / Layanan
              </label>
              <input
                id="serviceTitle"
                value={sTitle}
                disabled={saving}
                onChange={(event) => setSTitle(event.target.value)}
                placeholder="Nama Produk"
                className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="serviceSortOrder"
                className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
              >
                Urutan
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
            </div>
          </div>

          {/* Row 2: Link WhatsApp / Order */}
          <div>
            <label
              htmlFor="serviceTargetUrl"
              className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
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

          {/* Row 3: ID Drive Ikon + Inline Thumbnail Preview */}
          <div>
            <label
              htmlFor="serviceIcon"
              className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
            >
              ID Drive Ikon
            </label>
            <div className="flex items-center gap-2.5">
              <input
                id="serviceIcon"
                value={sDriveId}
                disabled={saving}
                onChange={(event) => setSDriveId(event.target.value)}
                placeholder="ID Drive Ikon (Opsional)"
                className="flex-1 bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
              {serviceIconInput && (
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#0b0d0e]"
                  title="Preview Ikon"
                >
                  <img
                    src={serviceIconPreviewUrl}
                    alt="Preview ikon produk"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Deskripsi Singkat */}
          <div>
            <label
              htmlFor="serviceDescription"
              className="text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1 block font-body"
            >
              Deskripsi Singkat
            </label>
            <textarea
              id="serviceDescription"
              value={sDescription}
              disabled={saving}
              rows={2}
              onChange={(event) => setSDescription(event.target.value)}
              placeholder="Deskripsi singkat produk..."
              className="w-full bg-[#0b0d0e] border border-white/15 text-white px-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-none transition-all leading-relaxed"
            />
          </div>

          <div className="pt-1 flex items-center gap-2">
            <GoogleCtaButton
              onClick={onSaveService}
              disabled={saving}
              variant="light"
              focusRing={focusRing}
              className="flex-1"
            >
              <span>
                {saving
                  ? "Menyimpan..."
                  : editingServiceId !== null
                    ? "Simpan Perubahan"
                    : "Tambah Data"}
              </span>
            </GoogleCtaButton>

            {editingServiceId !== null && (
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

        {/* Right: Compact 2-Column Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {services.length === 0 && (
            <div className="md:col-span-2 rounded-2xl border border-dashed border-white/15 bg-[#141619]/50 p-6 text-center">
              <p className="text-xs sm:text-sm font-heading font-semibold text-white/80">
                Belum ada produk.
              </p>
              <p className="mt-1 text-xs font-body text-white/50">
                Tambahkan produk/layanan agar section Produk Digital bisa tampil
                di homepage.
              </p>
            </div>
          )}

          {services.map((service) => (
            <div
              key={service.id}
              className="solid-frost border border-white/10 bg-[#141619] p-3 rounded-xl flex items-center justify-between gap-3 shadow-md hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                  {service.image_url ? (
                    <img
                      src={formatMediaUrl(service.image_url, 128)}
                      alt={service.title || "Ikon produk"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Globe size={17} className="text-white/50" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading font-semibold text-xs sm:text-sm text-white leading-snug truncate">
                      {service.title || "Untitled Service"}
                    </h4>
                    <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/50 shrink-0">
                      #{service.sort_order ?? 100}
                    </span>
                  </div>
                  <p className="text-xs font-body text-white/60 line-clamp-1 mt-0.5">
                    {service.description || "Belum ada deskripsi."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
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
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
