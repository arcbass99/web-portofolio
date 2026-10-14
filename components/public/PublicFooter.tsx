"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
      className="py-10 md:py-14 px-6 text-center border-t backdrop-blur-sm border-white/10 bg-[#0b0d0e]/80"
    >
      <h2 className="font-heading font-semibold text-white text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 md:mb-8">
        Mari mulai kolaborasi.
      </h2>

      <a
        href={contactHref}
        target={isExternalContact ? "_blank" : undefined}
        rel={isExternalContact ? "noreferrer" : undefined}
        aria-label={contactLabel}
        className={`liquid-glass-strong inline-flex items-center gap-2 px-6 py-3.5 md:px-9 md:py-4 rounded-full font-medium text-sm transition-transform hover:scale-105 active:scale-95 shadow-xl border border-white/10 text-white ${focusRing}`}
      >
        {contactLabel}
        <ArrowRight size={16} />
      </a>

      <div className="mt-8 md:mt-10 flex flex-col items-center justify-center gap-2">
        <p className="text-xs md:text-sm font-body text-white/50 font-medium tracking-wider uppercase">
          © {new Date().getFullYear()} — I&apos;m Nafis. Dibuat dengan presisi.
        </p>
        <Link href="/admin/login" className="text-[10px] text-white/20 hover:text-white/60 transition-colors uppercase tracking-widest font-semibold">
          Admin Console
        </Link>
      </div>
    </footer>
  );
}
