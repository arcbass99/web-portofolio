"use client";

import { Loader2 } from "lucide-react";

export function AdminLoadingScreen() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-black text-center text-white"
      role="status"
      aria-live="polite"
      aria-label="Menyiapkan console admin"
    >
      <Loader2 className="mb-4 animate-spin text-cyan-400" size={40} aria-hidden="true" />
      <p className="text-xs font-bold uppercase tracking-widest text-white/80">
        Menyiapkan Console...
      </p>
    </div>
  );
}
