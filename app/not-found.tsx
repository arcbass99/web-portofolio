"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  Compass,
  Briefcase,
  FolderGit2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { StitchDotCanvas } from "../components/ui/StitchDotCanvas";
import { AmbientAuroraOrb } from "../components/ui/AmbientAuroraOrb";
import { PUBLIC_FOCUS_RING } from "../lib/constants";

const quickLinks = [
  {
    title: "Beranda Utama",
    desc: "Kembali ke profil & pengenalan utama",
    icon: Home,
    href: "/",
    color: "from-blue-500/15 to-cyan-500/5",
  },
  {
    title: "Track Record",
    desc: "Jelajahi perjalanan & prestasi",
    icon: Compass,
    href: "/#track-record",
    color: "from-violet-500/15 to-purple-500/5",
  },
  {
    title: "Karya",
    desc: "Lihat portofolio & proyek kreatif",
    icon: FolderGit2,
    href: "/#portfolio",
    color: "from-amber-500/15 to-orange-500/5",
  },
  {
    title: "Produk & Layanan",
    desc: "Jelajahi produk digital & solusi",
    icon: Briefcase,
    href: "/#services",
    color: "from-emerald-500/15 to-teal-500/5",
  },
];

export default function NotFound() {
  const focusRing = PUBLIC_FOCUS_RING;

  return (
    <div className="relative min-h-screen w-full bg-[#0b0d0e] text-white font-body overflow-x-hidden flex flex-col justify-between">
      {/* Interactive Google Stitch Dots Background */}
      <StitchDotCanvas spacing={28} dotSize={1.1} />

      {/* Ambient Aurora Orbs */}
      <AmbientAuroraOrb
        variant="blue"
        size="md"
        className="-top-16 -left-16 opacity-40"
        duration={22}
      />
      <AmbientAuroraOrb
        variant="violet"
        size="sm"
        className="bottom-16 -right-12 opacity-35"
        duration={26}
      />

      {/* Top Header / Branding (Matches PublicNavbar proportions) */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link
          href="/"
          className={`apple-liquid-glass flex items-center gap-2.5 rounded-full px-3.5 py-1.5 transition-transform hover:scale-105 ${focusRing}`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black font-heading font-semibold text-xs">
            N
          </span>
          <span className="font-heading font-semibold text-xs sm:text-sm text-white tracking-tight">
            I&apos;m Nafis
          </span>
        </Link>

        <div className="apple-liquid-glass rounded-full px-3.5 py-1.5 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-[11px] font-body font-medium text-white/80 uppercase tracking-wider">
            Error 404
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 flex flex-col items-center text-center my-auto">
        {/* Standardized Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="apple-liquid-glass mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-body font-medium tracking-wider text-blue-300 uppercase"
        >
          <Sparkles size={13} className="text-blue-400" />
          <span>Halaman Tidak Ditemukan</span>
        </motion.div>

        {/* Display 404 Number (Matches Display Hero Scale) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="relative select-none"
        >
          <div className="absolute inset-0 blur-[60px] bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-emerald-400/20 rounded-full pointer-events-none" />
          <h1 className="relative text-6xl sm:text-7xl lg:text-8xl font-heading font-semibold leading-none tracking-tight bg-gradient-to-b from-white via-white/90 to-white/30 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Standardized Section Heading (H2) & Body Description */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="max-w-lg mx-auto mt-3"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-semibold tracking-tight leading-tight text-white">
            Halaman Tidak Ditemukan
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm font-body text-white/70 leading-relaxed">
            Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau
            belum tersedia. Silakan pilih pintasan di bawah untuk kembali.
          </p>
        </motion.div>

        {/* Quick Portal Cards Grid (Solid Frost Cards, Uniform Padding & Fonts) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
        >
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                href={link.href}
                className={`group relative solid-frost flex flex-col justify-between p-5 rounded-[1.5rem] border border-white/12 bg-[#141619] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 text-left shadow-xl overflow-hidden ${focusRing}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <Icon size={17} className="text-white/90" />
                    </div>
                    <ArrowRight
                      size={15}
                      className="text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300"
                    />
                  </div>
                  {/* Standardized Card Heading (H3) */}
                  <h3 className="font-heading font-semibold text-base sm:text-lg text-white tracking-tight leading-snug group-hover:text-blue-200 transition-colors">
                    {link.title}
                  </h3>
                  {/* Standardized Caption / Description */}
                  <p className="mt-1.5 text-xs font-body text-white/60 leading-relaxed">
                    {link.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </motion.div>

        {/* Standardized Primary CTA with Rotating Rainbow Inner Shadow + Zoom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8"
        >
          <Link
            href="/"
            className={`btn-google-cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold font-body text-black bg-white hover:bg-white/95 shadow-xl ${focusRing}`}
          >
            <span>Kembali ke Beranda Utama</span>
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-5 text-center border-t border-white/10">
        <p className="text-xs font-body text-white/50 leading-relaxed">
          &copy; {new Date().getFullYear()} — I&apos;m Nafis. Dibuat dengan presisi.
        </p>
      </footer>
    </div>
  );
}
