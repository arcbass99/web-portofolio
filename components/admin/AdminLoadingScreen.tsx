"use client";

import { Loader2 } from "lucide-react";

export function AdminLoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <Loader2 className="animate-spin text-cyan-400 mb-4" size={40} />
      <p className="font-bold tracking-widest text-xs uppercase opacity-50">
        Menyiapkan Console...
      </p>
    </div>
  );
}
