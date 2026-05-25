"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ArrowUpRight,
  Loader2,
  ArrowRight,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

type AboutMe = {
  id: number;
  headline: string | null;
  description: string | null;
  banner_url: string | null;
};

type SocialLink = {
  id: number;
  title: string | null;
  url: string | null;
};

type PortfolioItem = {
  id: number;
  title: string | null;
  description: string | null;
  media_url: string | null;
  media_type: string | null;
  tags: string | null;
};

type ServiceItem = {
  id: number;
  title: string | null;
  description: string | null;
  image_url: string | null;
  target_url: string | null;
};

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState<AboutMe | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchPublicData = useCallback(async () => {
    try {
      const [aboutRes, socialRes, portRes, servRes] = await Promise.all([
        supabase.from("about_me").select("*").single(),
        supabase.from("social_links").select("*"),
        supabase
          .from("portfolio")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("services").select("*"),
      ]);

      setAbout(aboutRes.data as AboutMe | null);
      setSocials((socialRes.data || []) as SocialLink[]);
      setPortfolios((portRes.data || []) as PortfolioItem[]);
      setServices((servRes.data || []) as ServiceItem[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const formatMediaUrl = (idOrUrl?: string | null) => {
    if (!idOrUrl) return "";

    if (idOrUrl.startsWith("http://") || idOrUrl.startsWith("https://")) {
      return idOrUrl;
    }

    return `https://drive.google.com/thumbnail?sz=w1200&id=${idOrUrl}`;
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const primaryContact =
    socials.find((social) => social.title?.toLowerCase().includes("instagram")) ||
    socials[0] ||
    null;

  const contactHref = primaryContact?.url || "#home";
  const isExternalContact = Boolean(primaryContact?.url);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-teal-500" size={40} />
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen transition-colors duration-700 overflow-hidden font-sans ${
        isDark ? "bg-[#0B0C10] text-white" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 transition-colors duration-1000 ${
            isDark ? "bg-indigo-900/50" : "bg-teal-200"
          }`}
        />
        <div
          className={`absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 transition-colors duration-1000 ${
            isDark ? "bg-violet-900/40" : "bg-purple-200"
          }`}
        />
        <div
          className={`absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 transition-colors duration-1000 ${
            isDark ? "bg-cyan-900/30" : "bg-pink-200"
          }`}
        />
      </div>

      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 backdrop-blur-md border-b ${
          isDark
            ? "bg-black/20 border-white/5"
            : "bg-white/30 border-white/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-24 py-4 flex justify-between items-center">
          <button
            type="button"
            className="font-black text-2xl tracking-tighter cursor-pointer"
            onClick={() => scrollToSection("home")}
            aria-label="Kembali ke bagian profil utama"
          >
            NAFIS
            <span className={isDark ? "text-cyan-400" : "text-teal-600"}>
              .
            </span>
          </button>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => setIsDark((current) => !current)}
              aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
              className={`p-2.5 md:p-3 rounded-full backdrop-blur-md border transition-all ${
                isDark
                  ? "bg-white/10 border-white/10 text-yellow-300"
                  : "bg-white/50 border-white/50 text-slate-600 hover:bg-white"
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Buka menu navigasi"
              className={`p-2.5 md:p-3 rounded-full backdrop-blur-md border transition-all ${
                isDark
                  ? "bg-white/10 border-white/10 hover:bg-white/20"
                  : "bg-white/50 border-white/50 hover:bg-white"
              }`}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className={`fixed inset-0 z-50 flex flex-col justify-center items-center ${
              isDark ? "bg-[#0B0C10]/80" : "bg-white/80"
            }`}
          >
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Tutup menu navigasi"
              className={`absolute top-6 right-6 lg:right-12 xl:right-24 p-4 rounded-full border transition-all ${
                isDark
                  ? "border-white/10 hover:bg-white/10 text-slate-400 hover:text-white"
                  : "border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              }`}
            >
              <X size={24} />
            </button>

            <div className="flex flex-col gap-6 md:gap-8 text-center font-black tracking-tight w-full px-6">
              {[
                { id: "home", label: "Profil Utama" },
                { id: "portfolio", label: "Selected Works" },
                ...(services.length > 0
                  ? [{ id: "services", label: "Produk" }]
                  : []),
              ].map((item, index) => (
                <motion.button
                  type="button"
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-4xl md:text-6xl hover:-translate-y-1 transition-all ${
                    isDark ? "hover:text-cyan-400" : "hover:text-teal-600"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}

              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                href="/admin"
                className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-teal-500 mt-12"
              >
                — Masuk Console Admin —
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <section
          id="home"
          className="min-h-screen flex flex-col justify-center px-6 lg:px-12 xl:px-24 max-w-7xl mx-auto py-20 pt-32"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <span
                className={`inline-block px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 border backdrop-blur-sm ${
                  isDark
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "bg-teal-500/10 text-teal-600 border-teal-500/20"
                }`}
              >
                Available for Projects
              </span>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-6 md:mb-8">
                {about?.headline || "Membangun Visi Digital Anda"}
              </h1>

              <p
                className={`text-lg md:text-xl leading-relaxed max-w-lg mb-8 md:mb-10 font-medium ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {about?.description ||
                  "Saya merancang dan mengembangkan antarmuka website premium untuk membantu skala bisnis Anda."}
              </p>

              <div className="flex gap-3 md:gap-4 items-center flex-wrap">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl backdrop-blur-md border shadow-sm hover:-translate-y-1 transition-all duration-300 ${
                      isDark
                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                        : "bg-white/60 border-white/40 hover:bg-white text-slate-800"
                    }`}
                  >
                    <span className="text-xs md:text-sm font-bold tracking-wide">
                      {social.title || "Link"}
                    </span>
                    <ExternalLink size={16} className="opacity-70" />
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div
                className={`aspect-square md:aspect-[4/5] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border backdrop-blur-xl p-2 ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white/40 border-white/50"
                }`}
              >
                <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-slate-200/50">
                  {about?.banner_url ? (
                    <Image
                      src={formatMediaUrl(about.banner_url)}
                      alt="Profile Banner"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm md:text-base font-medium">
                      No Banner Image
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="portfolio" className="py-24 md:py-32 px-6 lg:px-12 xl:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-4">
              <div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2 md:mb-4">
                  Selected Works
                </h2>
                <p
                  className={`text-base md:text-lg font-medium ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Kumpulan proyek dan desain saya.
                </p>
              </div>

              <span
                className={`text-4xl md:text-5xl font-black ${
                  isDark ? "text-white/10" : "text-slate-200"
                }`}
              >
                / 0{portfolios.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {portfolios.map((portfolio, index) => (
                <motion.div
                  key={portfolio.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  className={`group p-3 md:p-4 rounded-3xl md:rounded-[2.5rem] border backdrop-blur-md shadow-xl transition-all duration-500 ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10"
                      : "bg-white/50 border-white/60 hover:bg-white/80"
                  }`}
                >
                  <div className="relative aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden mb-4 md:mb-6">
                    {portfolio.media_type === "video" && portfolio.media_url ? (
                      <iframe
                        src={`https://drive.google.com/file/d/${portfolio.media_url}/preview`}
                        title={portfolio.title || "Portfolio video preview"}
                        className="w-full h-full border-0"
                        allow="autoplay"
                      />
                    ) : portfolio.media_url ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={formatMediaUrl(portfolio.media_url)}
                          alt={portfolio.title || "Portfolio image"}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
                          <ArrowUpRight
                            className="text-white opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500 shadow-xl"
                            size={40}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200/50 text-slate-400 text-sm font-bold">
                        No Portfolio Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 px-2 md:px-4 pb-2">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">
                        {portfolio.title || "Untitled Project"}
                      </h3>
                      <p
                        className={`line-clamp-2 max-w-sm text-sm md:text-base font-medium ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {portfolio.description || "Belum ada deskripsi."}
                      </p>
                    </div>

                    <span
                      className={`self-start px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border whitespace-nowrap ${
                        isDark
                          ? "bg-white/5 border-white/10"
                          : "bg-white/50 border-slate-200"
                      }`}
                    >
                      {portfolio.tags || "Project"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {services.length > 0 && (
          <section
            id="services"
            className="py-24 md:py-32 px-6 lg:px-12 xl:px-24 max-w-7xl mx-auto"
          >
            <div className="mb-12 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2 md:mb-4">
                Produk
              </h2>
              <p
                className={`text-base md:text-lg font-medium ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Produk, layanan, dan penawaran digital yang bisa kamu akses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {services.map((service, index) => (
                <motion.a
                  key={service.id}
                  href={service.target_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Kunjungi ${service.title || "produk"}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border backdrop-blur-md shadow-lg transition-all duration-300 flex flex-col justify-between group md:min-h-[18rem] ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:border-cyan-500 hover:bg-white/10"
                      : "bg-white/50 border-white/60 hover:border-teal-500 hover:bg-white"
                  }`}
                >
                  <div>
                    <div
                      className={`relative w-16 h-16 md:w-24 md:h-24 mb-6 rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center border transition-colors ${
                        isDark
                          ? "bg-black/50 border-white/10 group-hover:bg-cyan-900/30"
                          : "bg-white border-slate-100 group-hover:bg-teal-50"
                      }`}
                    >
                      {service.image_url ? (
                        <Image
                          src={formatMediaUrl(service.image_url)}
                          alt={service.title || "Service icon"}
                          fill
                          sizes="(max-width: 768px) 64px, 96px"
                          className="object-contain"
                        />
                      ) : (
                        <ArrowRight
                          className={
                            isDark
                              ? "text-slate-400 group-hover:text-cyan-400"
                              : "text-slate-400 group-hover:text-teal-600"
                          }
                          size={20}
                        />
                      )}
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold mb-3">
                      {service.title || "Produk"}
                    </h3>

                    <p
                      className={`text-sm md:text-base leading-relaxed line-clamp-3 font-medium ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {service.description ||
                        "Klik untuk melihat detail penawaran ini."}
                    </p>
                  </div>

                  <div
                    className={`mt-6 flex items-center gap-2 text-xs md:text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity ${
                      isDark ? "text-cyan-400" : "text-teal-600"
                    }`}
                  >
                    Kunjungi <ArrowRight size={14} />
                  </div>
                </motion.a>
              ))}
            </div>
          </section>
        )}

        <footer
          className={`py-24 md:py-32 px-6 text-center border-t backdrop-blur-sm ${
            isDark ? "border-white/5 bg-black/20" : "border-white/50 bg-white/10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tight mb-8 md:mb-10">
            Mari mulai proyek baru.
          </h2>

          <a
            href={contactHref}
            target={isExternalContact ? "_blank" : undefined}
            rel={isExternalContact ? "noreferrer" : undefined}
            className={`inline-flex items-center gap-2 px-8 py-3 md:px-10 md:py-4 rounded-full font-bold text-sm transition-all shadow-xl border ${
              isDark
                ? "bg-white text-black hover:bg-cyan-400 border-white"
                : "bg-slate-900 text-white hover:bg-teal-600 border-slate-900"
            }`}
          >
            Hubungi Saya
            <ArrowRight size={16} />
          </a>

          <p className="mt-20 text-xs md:text-sm font-bold tracking-widest uppercase opacity-40">
            © {new Date().getFullYear()} — Dibuat dengan presisi oleh Nafis
          </p>
        </footer>
      </div>
    </div>
  );
}