"use client";

import { Loader2 } from "lucide-react";

export function PublicLoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#0b0d0e] px-6 text-center font-body text-white"
      role="status"
      aria-live="polite"
      aria-label="Memuat halaman I'm Nafis"
    >
      <Loader2 className="animate-spin text-blue-400 mb-3" size={28} aria-hidden="true" />
      <p className="text-[11px] font-medium uppercase tracking-wider text-blue-300">
        Memuat I&apos;m Nafis
      </p>
      <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-white/50">
        Menyiapkan profil, track record, karya, dan layanan digital.
      </p>
    </div>
  );
}
