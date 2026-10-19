"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import type { ServiceItem } from "../../types/content";
import { AmbientAuroraOrb } from "../ui/AmbientAuroraOrb";

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
      className="relative py-10 md:py-16 px-6 lg:px-12 max-w-6xl mx-auto scroll-mt-24 overflow-hidden"
    >
      {/* Moving gradient light in empty space */}
      <AmbientAuroraOrb
        variant="violet"
        size="sm"
        className="top-8 right-12 opacity-35"
        duration={21}
      />

      <div className="relative z-10">
        <div className="mb-4">
          <span className="apple-liquid-glass rounded-full inline-flex px-3.5 py-1 text-[11px] font-body font-medium uppercase tracking-wider text-blue-300">
            Digital Offerings
          </span>
        </div>

        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-heading font-semibold text-white text-2xl md:text-3xl leading-tight tracking-tight">
              Produk dan Layanan
            </h2>
          </div>
          <p className="max-w-[42ch] text-xs sm:text-sm font-body leading-relaxed text-white/70 text-justify md:text-right">
            Akses langsung ke berbagai produk dan layanan digital yang saya
            sediakan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
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
                className={`group relative h-full solid-frost rounded-[1.6rem] p-5 flex flex-col justify-between gap-5 items-start overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85)] border border-white/12 bg-[#141619] active:scale-[0.98] ${focusRing}`}
              >
                {/* Subtle Aurora Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/15 blur-[45px] rounded-full" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-500/15 blur-[45px] rounded-full" />
                </div>

                {/* Icon */}
                <div className="relative z-10 rounded-xl h-11 w-11 flex items-center justify-center border border-white/10 bg-white/5 shadow-md transition-transform duration-500 group-hover:scale-105">
                  {service.image_url ? (
                    <div className="relative h-6 w-6">
                      <Image
                        src={formatMediaUrl(service.image_url, 128)}
                        alt={service.title || "Service icon"}
                        fill
                        sizes="24px"
                        quality={72}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <ArrowRight className="text-white/80" size={18} />
                  )}
                </div>

                {/* Bottom */}
                <div className="relative z-10 w-full">
                  <h3 className="font-heading font-semibold text-white text-base sm:text-lg tracking-tight leading-snug transition-colors duration-300 group-hover:text-blue-200">
                    {service.title || "Produk"}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/70 font-body leading-relaxed">
                    {service.description ||
                      "Klik untuk melihat detail penawaran ini."}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue-400 transition-all duration-300 group-hover:translate-x-0.5">
                    Kunjungi <ArrowRight size={13} />
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
