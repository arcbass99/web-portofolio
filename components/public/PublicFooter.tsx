"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { StitchDotCanvas } from "../ui/StitchDotCanvas";
import { GoogleCtaButton } from "../ui/GoogleCtaButton";

type PublicFooterProps = {
  contactHref: string;
  contactLabel: string;
  isExternalContact: boolean;
  focusRing: string;
};

export function PublicFooter({
  contactHref,
  contactLabel,
  isExternalContact: _isExternalContact,
  focusRing,
}: PublicFooterProps) {
  return (
    <footer className="relative py-16 md:py-24 px-6 text-center border-t border-white/10 overflow-hidden bg-[#0b0d0e]">
      {/* ── Interactive Google Stitch Dot Canvas Background ── */}
      <StitchDotCanvas spacing={26} dotSize={1.2} />

      {/* ── Content on top of interactive dots ── */}
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center justify-center">
        {/* Standardized Eyebrow Badge */}
        <div className="apple-liquid-glass mb-4 rounded-full px-3.5 py-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-blue-300 font-body">
            Let&apos;s Connect
          </span>
        </div>

        {/* Standardized Section Heading (H2) */}
        <h2 className="font-heading font-semibold text-white text-2xl md:text-3xl tracking-tight leading-tight mb-3">
          Mari mulai kolaborasi.
        </h2>

        {/* Standardized Section Description */}
        <p className="text-xs sm:text-sm font-body text-white/70 max-w-md mx-auto mb-7 leading-relaxed">
          Punya ide proyek, diskusi kreatif, atau peluang kerja sama? Mari
          diskusikan bersama.
        </p>

        {/* Primary CTA with Dynamic Rotating Gradient Wave (Google Mode AI style) */}
        <GoogleCtaButton
          href={contactHref}
          ariaLabel={contactLabel}
          variant="light"
          focusRing={focusRing}
        >
          <span>{contactLabel}</span>
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </GoogleCtaButton>

        <div className="mt-12 md:mt-16 flex flex-col items-center justify-center gap-1.5">
          <p className="text-xs font-body text-white/50 leading-relaxed">
            © {new Date().getFullYear()} — I&apos;m Nafis. Dibuat dengan presisi.
          </p>
          <Link
            href="/admin/login"
            className="text-[11px] font-body text-white/30 hover:text-white/70 transition-colors uppercase tracking-wider font-medium"
          >
            Admin Console
          </Link>
        </div>
      </div>
    </footer>
  );
}
