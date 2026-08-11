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
import { useEffect, useState, useRef } from "react";

/* ── Deterministic Pseudo-Random Generator (Hydration Safe) ── */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999 + 1) * 10000;
  return x - Math.floor(x);
}

/* ── Floating Particle Dust ── */
function AmbientParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 30 }).map((_, i) => {
        const size = (2 + seededRandom(i * 1.3) * 3).toFixed(1);
        const left = (seededRandom(i * 2.7) * 100).toFixed(1);
        const top = (seededRandom(i * 4.1) * 100).toFixed(1);
        const duration = (12 + seededRandom(i * 5.9) * 18).toFixed(1);
        const delay = (seededRandom(i * 3.3) * -20).toFixed(1);

        return (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/20 blur-[1px]"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animation: `particle-float ${duration}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Interactive Mouse Spotlight ── */
function MouseSpotlight() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.setProperty("--x", `${e.clientX}px`);
        glowRef.current.style.setProperty("--y", `${e.clientY}px`);
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed inset-0 pointer-events-none z-0 hidden md:block"
      style={{
        background:
          "radial-gradient(700px circle at var(--x, 50%) var(--y, 50%), rgba(34,211,238,0.06), rgba(139,92,246,0.03) 40%, transparent 70%)",
      }}
    />
  );
}

const quickLinks = [
  {
    title: "Beranda Utama",
    desc: "Kembali ke profil & pengenalan utama",
    icon: Home,
    href: "/",
    color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300",
  },
  {
    title: "Track Record",
    desc: "Jelajahi perjalanan & prestasi",
    icon: Compass,
    href: "/#track-record",
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-300",
  },
  {
    title: "Karya",
    desc: "Lihat portofolio & proyek kreatif",
    icon: FolderGit2,
    href: "/#portfolio",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300",
  },
  {
    title: "Produk & Layanan",
    desc: "Jelajahi produk digital & solusi",
    icon: Briefcase,
    href: "/#services",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300",
  },
];

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white font-body overflow-x-hidden flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Inline Keyframes */}
      <style>{`
        @keyframes particle-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-120px) translateX(25px); opacity: 0.8; }
        }
      `}</style>

      {/* Dynamic Ambient Background */}
      <MouseSpotlight />
      <AmbientParticles />

      {/* Aurora Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[160px]" />
      </div>

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Header / Branding */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="h-10 w-10 rounded-full border border-white/15 bg-white/5 backdrop-blur-md flex items-center justify-center font-heading italic font-bold text-white text-lg group-hover:border-cyan-400/40 transition-colors">
            N
          </div>
          <span className="font-heading italic font-bold text-xl text-white tracking-wide">
            I&apos;m Nafis
          </span>
        </Link>

        <div className="liquid-glass rounded-full px-4 py-1.5 border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-mono text-white/70 uppercase tracking-widest">
            Error 404
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center my-auto">
        {/* Kicker Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-xs font-body font-semibold tracking-widest text-cyan-300 uppercase backdrop-blur-md"
        >
          <Sparkles size={14} className="animate-spin" style={{ animationDuration: "8s" }} />
          <span>Halaman Tidak Ditemukan</span>
        </motion.div>

        {/* 404 Display Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative select-none"
        >
          {/* Ambient Glow behind 404 */}
          <div className="absolute inset-0 blur-[80px] bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 rounded-full pointer-events-none" />

          <h1 className="relative text-8xl sm:text-9xl lg:text-[13rem] font-heading italic font-black leading-none tracking-wider bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            404
          </h1>
        </motion.div>

        {/* Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="max-w-xl mx-auto mt-4"
        >
          <h2 className="text-2xl sm:text-4xl font-heading italic font-black tracking-wide text-white">
            Anda Tersesat di Ruang Hampa
          </h2>
          <p className="mt-4 text-base sm:text-lg font-body text-white/70 font-light leading-relaxed">
            Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau belum pernah diciptakan. Jangan khawatir, silakan pilih pintasan di bawah untuk kembali.
          </p>
        </motion.div>

        {/* Quick Portal Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
        >
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                href={link.href}
                className="group relative flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-zinc-900/90 hover:scale-[1.03] text-left shadow-xl overflow-hidden"
              >
                {/* Accent Background Gradient on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={20} className="text-white" />
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                    />
                  </div>
                  <h3 className="font-heading italic font-bold text-xl text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                    {link.title}
                  </h3>
                  <p className="mt-2 text-xs font-body text-white/60 leading-relaxed">
                    {link.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </motion.div>

        {/* Direct Action CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Link
            href="/"
            className="liquid-glass-strong inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold font-body text-white border border-white/15 bg-white/5 backdrop-blur-xl hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <span>Kembali ke Beranda Utama</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center border-t border-white/5">
        <p className="text-xs font-body text-white/40 tracking-wider">
          &copy; {new Date().getFullYear()} Muhammad Nafis Alfa Rizky • Hak Cipta Dilindungi
        </p>
      </footer>
    </div>
  );
}
