"use client";

import { X } from "lucide-react";
import type { Notice } from "../../types/content";

type AdminNoticeProps = {
  focusRing: string;
  notice: Notice;
  onClose: () => void;
};

export function AdminNotice({ focusRing, notice, onClose }: AdminNoticeProps) {
  if (!notice) return null;

  const isError = notice.type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-atomic="true"
      className={`mb-6 flex items-start justify-between gap-4 rounded-2xl border p-4 liquid-glass ${
        isError
          ? "border-red-500/20 bg-red-500/10 text-red-100"
          : "border-cyan-500/20 bg-cyan-500/10 text-cyan-50"
      }`}
    >
      <p className="text-sm font-semibold leading-relaxed">{notice.message}</p>

      <button
        type="button"
        onClick={onClose}
        className={`shrink-0 rounded-xl p-1 opacity-80 transition hover:opacity-100 text-white/80 hover:text-white ${focusRing}`}
        aria-label="Tutup notifikasi"
        title="Tutup notifikasi"
      >
        <X size={18} />
      </button>
    </div>
  );
}
