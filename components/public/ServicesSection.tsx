"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatMediaUrl, isGoogleDriveMediaUrl } from "../../lib/media";
import { notifySifan, trackOncePerSession } from "../../lib/metrics-client";
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
            Daftar tautan produk dan layanan digital yang tersedia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {services.map((service, index) => {
            const isExternal = Boolean(
              service.target_url &&
                (service.target_url.startsWith("http://") ||
                  service.target_url.startsWith("https://") ||
                  service.target_url.startsWith("mailto:") ||
                  service.target_url.startsWith("tel:")),
            );
            const isProtocolLink = Boolean(
              service.target_url &&
                (service.target_url.startsWith("mailto:") ||
                  service.target_url.startsWith("tel:")),
            );

            return (
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
                  target={isExternal && !isProtocolLink ? "_blank" : undefined}
                  rel={isExternal && !isProtocolLink ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    trackOncePerSession(
                      `service_${service.id}`,
                      { type: "service_click", serviceId: service.id },
                      true,
                    );
                    notifySifan({
                      kind: "service",
                      label: service.title || undefined,
                    });
                  }}
                  aria-label={`Kunjungi ${service.title || "produk"}`}
                  className={`group relative h-full solid-frost rounded-[1.6rem] p-5 flex flex-col justify-between gap-5 items-start overflow-hidden transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-white/22 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85)] border border-white/12 bg-[#141619] active:scale-[0.98] will-change-transform ${focusRing}`}
                >
                {/* Subtle Aurora Glow Effect */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"
                >
                  <div
                    className="absolute -top-16 -right-16 w-48 h-48 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
                    }}
                  />
                  <div
                    className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
                    }}
                  />
                </div>

                {/* Icon */}
                <div className="relative z-10 rounded-xl h-11 w-11 flex items-center justify-center border border-white/10 bg-white/5 shadow-md transition-transform duration-500 group-hover:scale-105">
                  {service.image_url ? (() => {
                    const iconSrc = formatMediaUrl(service.image_url, 128);
                    return (
                      <div className="relative h-6 w-6">
                        <Image
                          src={iconSrc}
                          alt={service.title || "Service icon"}
                          fill
                          sizes="24px"
                          quality={72}
                          unoptimized={isGoogleDriveMediaUrl(iconSrc)}
                          className="object-contain"
                        />
                      </div>
                    );
                  })() : (
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
          );
        })}
        </div>
      </div>
    </section>
  );
}
