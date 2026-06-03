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
      className={`py-10 md:py-14 px-6 text-center border-t backdrop-blur-sm ${
        isDark ? "border-white/10 bg-black/25" : "border-white/60 bg-white/30"
      }`}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-6 md:mb-8">
        Mari mulai kolaborasi.
      </h2>

      <a
        href={contactHref}
        target={isExternalContact ? "_blank" : undefined}
        rel={isExternalContact ? "noreferrer" : undefined}
        aria-label={contactLabel}
        className={`inline-flex items-center gap-2 px-7 py-3 md:px-9 md:py-4 rounded-full font-bold text-sm transition-all shadow-xl border ${focusRing} ${
          isDark
            ? "bg-white text-black hover:bg-cyan-400 border-white"
            : "bg-slate-900 text-white hover:bg-teal-600 border-slate-900"
        }`}
      >
        {contactLabel}
        <ArrowRight size={16} />
      </a>

      <p
        className={`mt-8 md:mt-10 text-xs md:text-sm font-bold tracking-widest uppercase ${
          isDark ? "text-slate-300" : "text-slate-700"
        }`}
      >
        © {new Date().getFullYear()} — I’m Nafis. Dibuat dengan presisi.
      </p>
    </footer>
  );
}
