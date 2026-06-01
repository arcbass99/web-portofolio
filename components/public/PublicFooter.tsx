"use client";

import { ArrowRight } from "lucide-react";

type PublicFooterProps = {
  isDark: boolean;
  contactHref: string;
  contactLabel: string;
  isExternalContact: boolean;
  focusRing: string;
};

export function PublicFooter({
  isDark,
  contactHref,
  contactLabel,
  isExternalContact,
  focusRing,
}: PublicFooterProps) {
  return (
    <footer
      className={`py-16 md:py-24 px-6 text-center border-t backdrop-blur-sm ${
        isDark ? "border-white/5 bg-black/20" : "border-white/50 bg-white/10"
      }`}
    >
      <h2 className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tight mb-8 md:mb-10">
        Mari mulai kolaborasi.
      </h2>

      <a
        href={contactHref}
        target={isExternalContact ? "_blank" : undefined}
        rel={isExternalContact ? "noreferrer" : undefined}
        aria-label={contactLabel}
        className={`inline-flex items-center gap-2 px-8 py-3 md:px-10 md:py-4 rounded-full font-bold text-sm transition-all shadow-xl border ${focusRing} ${
          isDark
            ? "bg-white text-black hover:bg-cyan-400 border-white"
            : "bg-slate-900 text-white hover:bg-teal-600 border-slate-900"
        }`}
      >
        {contactLabel}
        <ArrowRight size={16} />
      </a>

      <p className="mt-14 md:mt-16 text-xs md:text-sm font-bold tracking-widest uppercase opacity-40">
        © {new Date().getFullYear()} — Dibuat dengan presisi oleh Nafis
      </p>
    </footer>
  );
}
