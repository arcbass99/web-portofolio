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

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`mb-6 flex items-start justify-between gap-4 rounded-2xl border p-4 ${
        notice.type === "error"
          ? "border-red-500/20 bg-red-500/10 text-red-200"
          : "border-cyan-500/20 bg-cyan-500/10 text-cyan-100"
      }`}
    >
      <p className="text-sm font-semibold leading-relaxed">{notice.message}</p>

      <button
        type="button"
        onClick={onClose}
        className={`shrink-0 rounded-xl p-1 opacity-70 hover:opacity-100 transition ${focusRing}`}
        aria-label="Tutup notifikasi"
      >
        <X size={18} />
      </button>
    </div>
  );
}
