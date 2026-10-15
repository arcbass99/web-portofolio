"use client";

import { Loader2 } from "lucide-react";

export function AdminLoadingScreen() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#0b0d0e] text-center text-white font-body"
      role="status"
      aria-live="polite"
      aria-label="Menyiapkan console admin"
    >
      <Loader2 className="mb-3 animate-spin text-blue-400" size={32} aria-hidden="true" />
      <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
        Menyiapkan Console...
      </p>
    </div>
  );
}
