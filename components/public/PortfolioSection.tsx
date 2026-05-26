"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import type { PortfolioItem } from "../../types/content";

type PortfolioSectionProps = {
  portfolios: PortfolioItem[];
  isDark: boolean;
};

export function PortfolioSection({ portfolios, isDark }: PortfolioSectionProps) {
  return (
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

        {portfolios.length > 0 ? (
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
                        src={formatMediaUrl(portfolio.media_url, 900)}
                        alt={portfolio.title || "Portfolio image"}
                        fill
                        sizes="(max-width: 768px) 92vw, (max-width: 1024px) 44vw, 40vw"
                        quality={78}
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
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200/50 px-6 text-center text-slate-400">
                      <ArrowUpRight size={28} className="mb-3 opacity-60" />
                      <p className="text-sm font-bold">
                        Media karya belum tersedia
                      </p>
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
        ) : (
          <div
            className={`rounded-3xl md:rounded-[2.5rem] border p-8 md:p-12 text-center backdrop-blur-md ${
              isDark
                ? "bg-white/5 border-white/10 text-slate-400"
                : "bg-white/50 border-white/60 text-slate-500"
            }`}
          >
            <p className="text-xl md:text-2xl font-black text-inherit">
              Karya pilihan sedang disiapkan.
            </p>
            <p className="mt-3 text-sm md:text-base font-medium leading-relaxed">
              Portfolio akan tampil di sini setelah data karya ditambahkan dari
              console admin.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
