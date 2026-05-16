"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowUpRight, Loader2, ArrowRight, Menu, X, Moon, Sun } from "lucide-react";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState<any>(null);
  const [socials, setSocials] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  // UI States
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchPublicData();
  }, []);

  async function fetchPublicData() {
    try {
      const [aboutRes, socialRes, portRes, servRes] = await Promise.all([
        supabase.from("about_me").select("*").single(),
        supabase.from("social_links").select("*"),
        supabase.from("portfolio").select("*").order("created_at", { ascending: false }),
        supabase.from("services").select("*")
      ]);
      setAbout(aboutRes.data);
      setSocials(socialRes.data || []);
      setPortfolios(portRes.data || []);
      setServices(servRes.data || []);
    } finally {
      setLoading(false);
    }
  }

  const formatMediaUrl = (idOrUrl: string) => {
    if (!idOrUrl) return "";
    if (idOrUrl.startsWith("http://") || idOrUrl.startsWith("https://")) return idOrUrl;
    return `https://drive.google.com/thumbnail?sz=w1200&id=${idOrUrl}`;
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-teal-500" size={40} />
    </div>
  );

  return (
    <div className={`relative min-h-screen transition-colors duration-700 overflow-hidden font-sans ${isDark ? 'bg-[#0B0C10] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* --- MESH GRADIENT BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 transition-colors duration-1000 ${isDark ? 'bg-indigo-900/50' : 'bg-teal-200'}`}></div>
        <div className={`absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 transition-colors duration-1000 ${isDark ? 'bg-violet-900/40' : 'bg-purple-200'}`}></div>
        <div className={`absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 transition-colors duration-1000 ${isDark ? 'bg-cyan-900/30' : 'bg-pink-200'}`}></div>
      </div>

      {/* --- STICKY HEADER & NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 backdrop-blur-md border-b ${isDark ? 'bg-black/20 border-white/5' : 'bg-white/30 border-white/50'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-24 py-4 flex justify-between items-center">
          <span className="font-black text-xl tracking-tighter">NAFIS<span className={isDark ? "text-cyan-400" : "text-teal-600"}>.</span></span>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-full backdrop-blur-md border transition-all ${isDark ? 'bg-white/10 border-white/10 text-yellow-300' : 'bg-white/50 border-white/50 text-slate-600'}`}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMenuOpen(true)} className={`p-2 rounded-full backdrop-blur-md border transition-all ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/50 border-white/50'}`}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- FULLSCREEN OVERLAY MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed inset-0 z-50 flex flex-col justify-center items-center backdrop-blur-2xl ${isDark ? 'bg-[#0B0C10]/90' : 'bg-white/90'}`}>
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 lg:right-24 p-3 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
              <X size={24} />
            </button>
            <div className="flex flex-col gap-8 text-center text-3xl font-black tracking-tight">
              <button onClick={() => scrollToSection('home')} className="hover:text-teal-500 transition-colors">01. Profil</button>
              <button onClick={() => scrollToSection('portfolio')} className="hover:text-teal-500 transition-colors">02. Selected Works</button>
              {services.length > 0 && <button onClick={() => scrollToSection('services')} className="hover:text-teal-500 transition-colors">03. Services</button>}
              <a href="/admin" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-teal-500 mt-10">Admin Console</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KONTEN UTAMA DENGAN Z-INDEX AGAR BERADA DI ATAS BACKGROUND */}
      <div className="relative z-10">
        
        {/* --- HERO SECTION --- */}
        <section id="home" className="min-h-screen flex flex-col justify-center px-6 lg:px-24 max-w-7xl mx-auto py-20 pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border backdrop-blur-sm ${isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-teal-500/10 text-teal-600 border-teal-500/20'}`}>
                Available for Projects
              </span>
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-8">
                {about?.headline || "Creative Developer"}
              </h1>
              <p className={`text-xl leading-relaxed max-w-lg mb-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {about?.description || "Selamat datang di portofolio saya."}
              </p>
              <div className="flex gap-4 items-center">
                {socials.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className={`p-4 rounded-2xl backdrop-blur-md border shadow-lg hover:-translate-y-1 transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white/60 border-white/40 hover:bg-white text-slate-800'}`}>
                    <ExternalLink size={20} />
                  </a>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
              <div className={`aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border backdrop-blur-xl p-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/50'}`}>
                <div className="w-full h-full rounded-[2rem] overflow-hidden bg-slate-200/50">
                  {about?.banner_url ? (
                    <img src={formatMediaUrl(about.banner_url)} alt="Profile Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 italic">No Banner Image</div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- PORTFOLIO SECTION (GLASSMORPHISM) --- */}
        <section id="portfolio" className="py-32 px-6 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
              <div>
                <h2 className="text-4xl font-black tracking-tight mb-4">Selected Works</h2>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Kumpulan proyek dan desain terbaik saya.</p>
              </div>
              <span className={`text-5xl font-black ${isDark ? 'text-white/10' : 'text-slate-200'}`}>/ 0{portfolios.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {portfolios.map((p, index) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`group p-4 rounded-[2.5rem] border backdrop-blur-md shadow-xl transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/50 border-white/60 hover:bg-white/80'}`}>
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-6">
                    {p.media_type === "video" ? (
                      <iframe src={`https://drive.google.com/file/d/${p.media_url}/preview`} className="w-full h-full border-0" allow="autoplay" />
                    ) : (
                      <div className="w-full h-full relative">
                        <img src={formatMediaUrl(p.media_url)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                          <ArrowUpRight className="text-white opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500" size={32} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start px-4 pb-2">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{p.title}</h3>
                      <p className={`line-clamp-1 max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.description}</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-slate-200'}`}>
                      {p.tags}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SERVICES SECTION --- */}
        {services.length > 0 && (
          <section id="services" className="py-32 px-6 lg:px-24 max-w-7xl mx-auto">
            <div className="mb-20">
              <h2 className="text-4xl font-black tracking-tight mb-4">Services</h2>
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Layanan profesional untuk membantu proyek Anda.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((s, index) => (
                <motion.a key={s.id} href={s.target_url} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`p-8 rounded-[2.5rem] border backdrop-blur-md shadow-lg transition-all duration-300 flex flex-col justify-between group h-64 ${isDark ? 'bg-white/5 border-white/10 hover:border-cyan-500 hover:bg-white/10' : 'bg-white/50 border-white/60 hover:border-teal-500 hover:bg-white'}`}>
                  <div className={`w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center border transition-colors ${isDark ? 'bg-black/50 border-white/10 group-hover:bg-cyan-900/30' : 'bg-white border-slate-100 group-hover:bg-teal-50'}`}>
                    {s.image_url ? (
                      <img src={formatMediaUrl(s.image_url)} alt="Icon" className="w-full h-full object-cover" />
                    ) : (
                      <ArrowRight className={isDark ? 'text-slate-400 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-teal-600'} size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
                    <div className={`flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-cyan-400' : 'text-teal-600'}`}>
                      Let's Talk <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>
        )}

        {/* --- FOOTER --- */}
        <footer className={`py-32 px-6 text-center border-t backdrop-blur-sm ${isDark ? 'border-white/5 bg-black/20' : 'border-white/50 bg-white/10'}`}>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-10">Mari kita kolaborasi.</h2>
          <p className="mt-20 text-sm font-medium tracking-widest uppercase opacity-40">© {new Date().getFullYear()} — Dibuat oleh Nafis</p>
        </footer>

      </div>
    </div>
  );
}