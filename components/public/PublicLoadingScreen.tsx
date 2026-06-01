"use client";

import { Loader2 } from "lucide-react";

export function PublicLoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-6 text-center">
      <Loader2 className="animate-spin text-teal-500 mb-5" size={40} />
      <p className="text-sm font-black uppercase tracking-[0.3em] text-teal-600">
        Memuat Im Nafis
      </p>
      <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-slate-500">
        Menyiapkan profil, track record, karya, dan produk digital Nafis.
      </p>
    </div>
  );
}
