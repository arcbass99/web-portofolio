"use client";

import { Loader2 } from "lucide-react";

export function AdminLoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#0b0d0e] px-6 text-center font-body text-white"
      role="status"
      aria-live="polite"
      aria-label="Menyiapkan console admin"
    >
      <Loader2 className="animate-spin text-blue-400 mb-3" size={28} aria-hidden="true" />
      <p className="text-[11px] font-medium uppercase tracking-wider text-blue-300">
        Menyiapkan Console
      </p>
      <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-white/50">
        Memuat sesi dan data dashboard admin Nafis.
      </p>
    </div>
  );
}
