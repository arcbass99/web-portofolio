"use client";

import { useMemo } from "react";
import {
  BarChart3,
  Cloud,
  Compass,
  Eye,
  Heart,
  Layers,
  MousePointerClick,
  RefreshCw,
} from "lucide-react";
import type {
  AdminAnalyticsData,
  PortfolioItem,
  ServiceItem,
} from "../../types/content";

type AnalyticsPanelProps = {
  analytics: AdminAnalyticsData | null;
  loading: boolean;
  portfolios: PortfolioItem[];
  services: ServiceItem[];
  focusRing: string;
  onRefresh: () => void;
};

export function AnalyticsPanel({
  analytics,
  loading,
  portfolios,
  services,
  focusRing,
  onRefresh,
}: AnalyticsPanelProps) {
  const totalClaps = useMemo(() => {
    if (!analytics) return 0;
    return Object.values(analytics.claps).reduce((sum, n) => sum + n, 0);
  }, [analytics]);

  const rankedGallery = useMemo(() => {
    const claps = analytics?.claps ?? {};
    const views = analytics?.views ?? {};

    return [...portfolios]
      .map((item) => {
        const key = String(item.id);
        return {
          item,
          claps: claps[key] ?? 0,
          views: views[key] ?? 0,
        };
      })
      .sort((a, b) => {
        if (b.claps !== a.claps) return b.claps - a.claps;
        if (b.views !== a.views) return b.views - a.views;
        return a.item.id - b.item.id;
      });
  }, [analytics, portfolios]);

  const rankedServices = useMemo(() => {
    const clicks = analytics?.serviceClicks ?? {};

    return [...services]
      .map((service) => ({
        service,
        clicks: clicks[String(service.id)] ?? 0,
      }))
      .sort((a, b) => b.clicks - a.clicks);
  }, [analytics, services]);

  const summaryCards = [
    {
      label: "Kunjungan Beranda",
      value: analytics?.siteStats.home_views ?? 0,
      icon: Eye,
      accent: "text-blue-300 bg-blue-500/15 border-blue-400/25",
    },
    {
      label: "Kunjungan Galeri",
      value: analytics?.siteStats.galeri_page_views ?? 0,
      icon: Layers,
      accent: "text-violet-300 bg-violet-500/15 border-violet-400/25",
    },
    {
      label: "Total Apresiasi",
      value: totalClaps,
      icon: Heart,
      accent: "text-rose-300 bg-rose-500/15 border-rose-400/25",
    },
    {
      label: "Tur Sifan",
      value: analytics?.siteStats.sifan_tours ?? 0,
      icon: Cloud,
      accent: "text-emerald-300 bg-emerald-500/15 border-emerald-400/25",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-semibold text-white tracking-tight leading-tight">
            Statistik
          </h1>
          <p className="text-white/70 text-xs sm:text-sm font-body leading-relaxed">
            Ringkasan kunjungan halaman, apresiasi Galeri, dan interaksi Sifan
            via Upstash Redis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-body font-medium ${
              analytics?.redisConfigured
                ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                : "border-amber-400/30 bg-amber-500/15 text-amber-200"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                analytics?.redisConfigured ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span>
              {analytics === null
                ? "Siap Dimuat"
                : analytics.redisConfigured
                  ? "Redis Terhubung"
                  : "Redis Belum Aktif"}
            </span>
          </span>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-body font-medium text-white/85 hover:bg-white/15 disabled:opacity-50 transition-colors cursor-pointer ${focusRing}`}
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Memuat..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="solid-frost rounded-2xl border border-white/12 bg-[#141619] p-4 shadow-lg flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-body font-medium uppercase tracking-wider text-white/60">
                  {card.label}
                </span>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-xl border ${card.accent}`}
                >
                  <Icon size={14} />
                </span>
              </div>
              <p className="text-2xl md:text-3xl font-heading font-semibold text-white tracking-tight">
                {loading && !analytics ? "-" : card.value.toLocaleString("id-ID")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4 items-start">
        {/* Top Gallery */}
        <div className="solid-frost rounded-2xl border border-white/12 bg-[#141619] p-4 shadow-xl">
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BarChart3 size={15} className="text-blue-400" />
              <h2 className="font-heading font-semibold text-sm text-white">
                Apresiasi &amp; Tayangan Galeri
              </h2>
            </div>
            <span className="text-[11px] font-body text-white/45">
              {rankedGallery.length} item
            </span>
          </div>

          {rankedGallery.length === 0 ? (
            <p className="py-6 text-center text-xs font-body text-white/50">
              Belum ada item galeri.
            </p>
          ) : (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {rankedGallery.map(({ item, claps, views }, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b0d0e]/80 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-[11px] font-heading font-semibold text-white/60">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs sm:text-sm font-heading font-semibold text-white">
                          {item.title || "Tanpa Judul"}
                        </p>
                        {item.is_featured && (
                          <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-500/15 px-1.5 py-0.2 text-[9px] font-body font-medium text-amber-200">
                            Beranda
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] font-body text-white/45">
                        {item.tags || "Galeri"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs font-body">
                    <span
                      className="inline-flex items-center gap-1 text-white/60"
                      title="Detail dibuka"
                    >
                      <Eye size={12} />
                      <span>{views}</span>
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full border border-rose-400/25 bg-rose-500/10 px-2 py-0.5 text-rose-200 font-medium"
                      title="Apresiasi"
                    >
                      <Heart size={11} className="fill-rose-400 text-rose-400" />
                      <span>{claps}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Service Clicks */}
        <div className="solid-frost rounded-2xl border border-white/12 bg-[#141619] p-4 shadow-xl">
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Compass size={15} className="text-violet-400" />
              <h2 className="font-heading font-semibold text-sm text-white">
                Klik Produk &amp; Layanan
              </h2>
            </div>
            <span className="text-[11px] font-body text-white/45">
              {rankedServices.length} layanan
            </span>
          </div>

          {rankedServices.length === 0 ? (
            <p className="py-6 text-center text-xs font-body text-white/50">
              Belum ada produk atau layanan.
            </p>
          ) : (
            <div className="space-y-2">
              {rankedServices.map(({ service, clicks }) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b0d0e]/80 px-3 py-2.5"
                >
                  <p className="truncate text-xs sm:text-sm font-heading font-semibold text-white">
                    {service.title || "Produk"}
                  </p>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-blue-400/25 bg-blue-500/10 px-2.5 py-0.5 text-xs font-body font-medium text-blue-200">
                    <MousePointerClick size={11} />
                    <span>{clicks}</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="mt-4 pt-3 border-t border-white/10 text-[11px] font-body leading-relaxed text-white/45">
            Metrik dicatat per sesi dan dibatching otomatis agar tetap super
            hemat kuota paket gratis Vercel &amp; Upstash Redis.
          </p>
        </div>
      </div>
    </div>
  );
}
