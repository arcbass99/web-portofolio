"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import type { ServiceItem } from "../../types/content";

type ServicesSectionProps = {
  services: ServiceItem[];
  focusRing: string;
};

export function ServicesSection({
  services,
  focusRing,
}: ServicesSectionProps) {
  return (
    <section
      id="services"
      className="pt-10 pb-12 md:pt-16 md:pb-16 px-6 lg:px-12 xl:px-24 max-w-7xl mx-auto"
    >
      <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="liquid-glass rounded-full inline-flex border border-cyan-400/30 bg-cyan-400/15 px-[1.618rem] py-[0.618rem] text-[0.618rem] font-body font-black uppercase tracking-widest text-cyan-200 mb-[1rem]">
            Layanan Unggulan
          </span>
          <h2 className="font-heading italic text-white text-[2.618rem] md:text-[4.236rem] leading-[0.9] tracking-[-3px]">
            Produk Digital
          </h2>
        </div>
        <p className="max-w-xs text-[1rem] font-body text-white/60 text-justify md:text-right">
          Akses langsung ke berbagai produk, kelas, dan layanan digital yang saya sediakan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <a
              href={service.target_url || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label={`Kunjungi ${service.title || "produk"}`}
              className={`group relative liquid-glass rounded-[2rem] p-[1.618rem] flex flex-col gap-[1.618rem] items-start overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/5 ${focusRing}`}
            >
              {/* Cinematic Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/20 blur-[50px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/20 blur-[50px] rounded-full" />
              </div>

              {/* Icon */}
              <div className="relative z-10 liquid-glass rounded-2xl h-14 w-14 flex items-center justify-center border border-white/10 bg-white/5 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                {service.image_url ? (
                  <div className="relative h-7 w-7">
                    <Image
                      src={formatMediaUrl(service.image_url, 256)}
                      alt={service.title || "Service icon"}
                      fill
                      sizes="28px"
                      quality={72}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <ArrowRight
                    className="text-white/80"
                    size={22}
                  />
                )}
              </div>

              {/* Bottom */}
              <div className="relative z-10 w-full">
                <h3 className="font-heading italic text-white text-[1.618rem] tracking-[-1px] leading-none transition-colors duration-300 group-hover:text-cyan-100">
                  {service.title || "Produk"}
                </h3>
                <p className="mt-[0.618rem] text-[1rem] text-white/70 font-body font-light leading-relaxed max-w-[32ch]">
                  {service.description ||
                    "Klik untuk melihat detail penawaran ini."}
                </p>
                
                <div className="mt-[1rem] flex items-center gap-[0.618rem] text-[0.618rem] font-black uppercase tracking-widest text-cyan-400 opacity-0 -translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Kunjungi <ArrowRight size={14} />
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
