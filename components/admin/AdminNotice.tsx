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
      className={`mb-4 flex items-center justify-between gap-3 rounded-xl border p-3 ${
        isError
          ? "border-red-500/20 bg-red-500/10 text-red-200"
          : "border-blue-500/20 bg-blue-500/10 text-blue-100"
      }`}
    >
      <p className="text-xs sm:text-sm font-medium leading-relaxed">{notice.message}</p>

      <button
        type="button"
        onClick={onClose}
        className={`shrink-0 rounded-lg p-1 opacity-70 transition hover:opacity-100 text-white/80 hover:text-white ${focusRing}`}
        aria-label="Tutup notifikasi"
        title="Tutup notifikasi"
      >
        <X size={15} />
      </button>
    </div>
  );
}
