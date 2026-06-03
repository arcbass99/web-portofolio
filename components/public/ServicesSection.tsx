"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import { SpotlightCard } from "../ui/SpotlightCard";
import type { ServiceItem } from "../../types/content";

type ServicesSectionProps = {
  services: ServiceItem[];
  isDark: boolean;
  focusRing: string;
};

export function ServicesSection({
  services,
  isDark,
  focusRing,
}: ServicesSectionProps) {
  return (
    <section
      id="services"
      className="pt-10 pb-12 md:pt-16 md:pb-16 px-6 lg:px-12 xl:px-24 max-w-7xl mx-auto"
    >
      <div className="mb-7 md:mb-10">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2 md:mb-4">
          Produk Digital
        </h2>
        <p
          className={`text-base md:text-lg font-medium ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Produk, layanan, dan penawaran digital yang sedang saya kembangkan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <SpotlightCard
              as="a"
              href={service.target_url || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label={`Kunjungi ${service.title || "produk"}`}
              isDark={isDark}
              tone="cyan"
              intensity="strong"
              className={`h-full p-5 md:p-6 rounded-3xl border backdrop-blur-md shadow-lg transition-all duration-300 flex flex-col justify-between group md:min-h-[15.75rem] ${focusRing} ${
                isDark
                  ? "bg-white/5 border-white/10 hover:border-cyan-500 hover:bg-white/10"
                  : "bg-white/50 border-white/60 hover:border-teal-500 hover:bg-white"
              }`}
            >
              <div>
              <div
                className={`relative w-14 h-14 md:w-[4.5rem] md:h-[4.5rem] mb-5 rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center border transition-colors ${
                  isDark
                    ? "bg-black/50 border-white/10 group-hover:bg-cyan-900/30"
                    : "bg-white border-slate-100 group-hover:bg-teal-50"
                }`}
              >
                {service.image_url ? (
                  <Image
                    src={formatMediaUrl(service.image_url, 256)}
                    alt={service.title || "Service icon"}
                    fill
                    sizes="(max-width: 768px) 56px, 72px"
                    quality={72}
                    className="object-contain"
                  />
                ) : (
                  <ArrowRight
                    className={
                      isDark
                        ? "text-slate-300 group-hover:text-cyan-300"
                        : "text-slate-600 group-hover:text-teal-700"
                    }
                    size={20}
                  />
                )}
              </div>

              <h3 className="text-xl md:text-[1.35rem] font-bold mb-3 leading-tight">
                {service.title || "Produk"}
              </h3>

              <p
                className={`text-sm md:text-base leading-relaxed line-clamp-3 font-medium ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {service.description ||
                  "Klik untuk melihat detail penawaran ini."}
              </p>
            </div>

            <div
              className={`mt-5 flex items-center gap-2 text-xs md:text-sm font-bold opacity-100 transition-opacity ${
                isDark ? "text-cyan-300" : "text-teal-700"
              }`}
            >
              Kunjungi <ArrowRight size={14} />
            </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
