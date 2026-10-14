"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { StitchDotCanvas } from "../ui/StitchDotCanvas";

type PublicFooterProps = {
  contactHref: string;
  contactLabel: string;
  isExternalContact: boolean;
  focusRing: string;
};

export function PublicFooter({
  contactHref,
  contactLabel,
  isExternalContact,
  focusRing,
}: PublicFooterProps) {
  return (
    <footer
      className="relative py-20 md:py-28 px-6 text-center border-t border-white/10 overflow-hidden bg-[#0b0d0e]"
    >
      {/* ── Interactive Google Stitch Dot Canvas Background ── */}
      <StitchDotCanvas spacing={26} dotSize={1.2} />

      {/* ── Content on top of interactive dots ── */}
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center justify-center">
        {/* Subtle pill badge */}
        <div className="liquid-glass mb-4 rounded-full px-3.5 py-1 border border-white/10">
          <span className="text-[10px] font-medium uppercase tracking-wider text-blue-300 font-body">
            Let&apos;s Connect
          </span>
        </div>

        <h2 className="font-heading font-semibold text-white text-2xl md:text-3xl lg:text-4xl tracking-tight mb-3">
          Mari mulai kolaborasi.
        </h2>

        <p className="text-xs sm:text-sm font-body text-white/60 max-w-md mx-auto mb-7 leading-relaxed">
          Punya ide proyek, diskusi kreatif, atau peluang kerja sama? Mari diskusikan bersama.
        </p>

        <a
          href={contactHref}
          target={isExternalContact ? "_blank" : undefined}
          rel={isExternalContact ? "noreferrer" : undefined}
          aria-label={contactLabel}
          className={`group inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_12px_28px_rgba(0,0,0,0.5),0_0_24px_rgba(66,133,244,0.3)] border border-white/20 bg-white text-black hover:bg-white/95 ${focusRing}`}
        >
          {contactLabel}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>

        <div className="mt-12 md:mt-16 flex flex-col items-center justify-center gap-1.5">
          <p className="text-[11px] font-body text-white/40 font-medium tracking-wider uppercase">
            © {new Date().getFullYear()} — I&apos;m Nafis. Dibuat dengan presisi.
          </p>
          <Link
            href="/admin/login"
            className="text-[10px] text-white/20 hover:text-white/60 transition-colors uppercase tracking-widest font-semibold"
          >
            Admin Console
          </Link>
        </div>
      </div>
    </footer>
  );
}
