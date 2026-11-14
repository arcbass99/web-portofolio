"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { Award, GraduationCap, Users, Maximize2, X } from "lucide-react";
import { formatMediaUrl, isGoogleDriveMediaUrl } from "../../lib/media";
import type {
  ProfileHighlight,
  ProfileHighlightCategory,
} from "../../types/content";
import { AmbientAuroraOrb } from "../ui/AmbientAuroraOrb";

type TrackRecordSectionProps = {
  highlights: ProfileHighlight[];
};

const categoryOrder: ProfileHighlightCategory[] = [
  "education",
  "achievement",
  "leadership",
  "skill",
];

const sortByOrder = (items: ProfileHighlight[]) => {
  return [...items].sort((first, second) => {
    const firstOrder = first.sort_order ?? 100;
    const secondOrder = second.sort_order ?? 100;

    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }

    return first.id - second.id;
  });
};

type CatType = "education" | "achievement" | "leadership";

const categoryConfig: Record<
  CatType,
  { icon: ReactNode; bg: string; text: string; title: string }
> = {
  education: {
    icon: <GraduationCap size={18} />,
    bg: "bg-blue-400",
    text: "text-blue-400",
    title: "Education",
  },
  achievement: {
    icon: <Award size={18} />,
    bg: "bg-amber-400",
    text: "text-amber-400",
    title: "Achievements",
  },
  leadership: {
    icon: <Users size={18} />,
    bg: "bg-violet-400",
    text: "text-violet-400",
    title: "Leadership",
  },
};

const categoryGlowGradient: Record<CatType, { top: string; bottom: string }> = {
  education: {
    top: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
    bottom: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
  },
  achievement: {
    top: "radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)",
    bottom: "radial-gradient(circle, rgba(244,63,94,0.18) 0%, transparent 70%)",
  },
  leadership: {
    top: "radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)",
    bottom: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)",
  },
};

export function TrackRecordSection({ highlights }: TrackRecordSectionProps) {
  const grouped = categoryOrder.reduce(
    (result, category) => {
      result[category] = sortByOrder(
        highlights.filter((highlight) => highlight.category === category),
      );
      return result;
    },
    {} as Record<ProfileHighlightCategory, ProfileHighlight[]>,
  );

  const activeCategories = (
    ["education", "achievement", "leadership"] as CatType[]
  ).filter((cat) => grouped[cat].length > 0);

  const hasSkills = grouped.skill.length > 0;

  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<CatType | null>(
    null,
  );
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (expandedCategory) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      const navbar = document.querySelector("nav");
      if (navbar) {
        const computedStyle = window.getComputedStyle(navbar);
        const originalPaddingRight = computedStyle.paddingRight;
        navbar.setAttribute("data-original-pr", originalPaddingRight);
        navbar.style.paddingRight = `calc(${originalPaddingRight} + ${scrollbarWidth}px)`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      const navbar = document.querySelector("nav");
      if (navbar && navbar.hasAttribute("data-original-pr")) {
        navbar.style.paddingRight =
          navbar.getAttribute("data-original-pr") || "";
        navbar.removeAttribute("data-original-pr");
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      const navbar = document.querySelector("nav");
      if (navbar) {
        navbar.style.paddingRight = "";
      }
    };
  }, [expandedCategory]);

  if (activeCategories.length === 0 && !hasSkills) {
    return null;
  }

  const skillsString = grouped.skill
    .map((s) => s.title)
    .join("             ✦             ");
  const repeatedSkills = Array(20)
    .fill(skillsString)
    .join("             ✦             ");

  return (
    <section
      id="track-record"
      className="relative py-10 md:py-16 overflow-hidden scroll-mt-20"
    >
      {/* Moving gradient light in empty header space */}
      <AmbientAuroraOrb
        variant="cyan"
        size="sm"
        className="top-6 right-8 md:right-24 opacity-40"
        duration={20}
      />

      <style>{`
        @keyframes wavy-marquee {
          0% { startOffset: 0%; }
          100% { startOffset: -50%; }
        }
        .animate-wavy-marquee {
          animation: wavy-marquee 40s linear infinite;
        }
        @supports not (startOffset: 0%) {
          .animate-wavy-marquee {
            animation: none;
          }
        }
      `}</style>

      {/* Standardized Section Header */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="mb-4">
          <span className="apple-liquid-glass rounded-full inline-flex px-3.5 py-1 text-[11px] font-body font-medium uppercase tracking-wider text-blue-300">
            Track Record
          </span>
        </div>

        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold tracking-tight leading-tight text-white">
            Perjalanan &amp; Pengalaman
          </h2>

          <p className="mt-2.5 max-w-[60ch] text-xs sm:text-sm font-body leading-relaxed text-white/70 text-justify md:text-left">
            Ringkasan riwayat pendidikan, pencapaian, serta pengalaman
            organisasi.
          </p>
        </div>
      </div>

      {/* 3D Cover Flow Carousel (Solid Frost Cards) */}
      {activeCategories.length > 0 && (
        <>
          <div
            className="relative flex h-[340px] w-full items-center justify-center overflow-hidden mt-4"
            onTouchStart={(e) => {
              if (e.touches[0]) {
                touchStartRef.current = {
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY,
                };
              }
            }}
            onTouchCancel={() => {
              touchStartRef.current = null;
            }}
            onTouchEnd={(e) => {
              if (!touchStartRef.current || !e.changedTouches[0]) return;
              const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
              const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
                if (dx < 0 && activeIndex < activeCategories.length - 1) {
                  setActiveIndex(activeIndex + 1);
                } else if (dx > 0 && activeIndex > 0) {
                  setActiveIndex(activeIndex - 1);
                }
              }
              touchStartRef.current = null;
            }}
          >
            {activeCategories.map((cat, idx) => {
              const isActive = idx === activeIndex;
              const distance = idx - activeIndex;

              const topItem = grouped[cat][0];
              if (!topItem) return null;

              const scale = isActive ? 1 : 0.88;
              const zIndex = isActive ? 10 : 5 - Math.abs(distance);
              const rotateY = distance === 0 ? 0 : distance < 0 ? 12 : -12;

              return (
                <div
                  key={cat}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[280px] h-[280px]"
                  style={{ zIndex }}
                >
                  {/* Solid Frost Card: GPU-composited spring motion (no CSS filter or transition-all conflict) */}
                  <motion.div
                    initial={false}
                    animate={{
                      x: distance * 125,
                      y: isActive ? 0 : 4,
                      scale,
                      rotateY,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 28,
                      mass: 0.9,
                    }}
                    style={{
                      transformPerspective: 1000,
                      transformOrigin: "center center",
                      willChange: "transform",
                    }}
                    onClick={() => {
                      if (isActive) {
                        setExpandedCategory(cat);
                      } else {
                        setActiveIndex(idx);
                      }
                    }}
                    className="solid-frost relative w-full h-full rounded-[1.6rem] p-5 flex flex-col justify-between overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/12 bg-[#141619] group"
                  >
                    {/* Opacity dimming scrim replaces expensive animated CSS filter */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-20 bg-[#090b0d] transition-opacity duration-300 ease-out"
                      style={{ opacity: isActive ? 0 : 0.62 }}
                    />

                    {/* Soft radial hover glow */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"
                    >
                      <div
                        className="absolute -top-16 -right-16 w-48 h-48 rounded-full"
                        style={{ background: categoryGlowGradient[cat].top }}
                      />
                      <div
                        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
                        style={{ background: categoryGlowGradient[cat].bottom }}
                      />
                    </div>

                    <div className="flex items-center gap-2.5 relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-black shadow-md flex-shrink-0 ${categoryConfig[cat].bg}`}
                      >
                        {categoryConfig[cat].icon}
                      </div>
                      {/* Standardized Card Heading (H3) */}
                      <h3 className="text-base sm:text-lg font-heading font-semibold text-white tracking-tight leading-snug truncate">
                        {categoryConfig[cat].title}
                      </h3>
                    </div>

                    <div
                      className={`mt-3 flex-1 flex flex-col gap-2.5 relative z-10 pr-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent ${
                        isActive
                          ? "overflow-y-auto overscroll-contain"
                          : "overflow-hidden pointer-events-none"
                      }`}
                    >
                      {grouped[cat].map((item) => (
                        <div key={item.id} className="flex flex-col">
                          {item.period && (
                            <span
                              className={`text-[11px] font-body font-medium uppercase tracking-wider mb-0.5 ${categoryConfig[cat].text}`}
                            >
                              {item.period}
                            </span>
                          )}
                          {/* Standardized Item Title (H4) */}
                          <h4 className="text-xs sm:text-sm font-heading font-semibold text-white leading-snug line-clamp-1">
                            {item.title}
                          </h4>
                        </div>
                      ))}
                    </div>

                    {isActive && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCategory(cat);
                        }}
                        aria-label={`Buka detail kategori ${categoryConfig[cat].title}`}
                        className="absolute bottom-5 right-5 p-2 bg-white/12 rounded-full hover:bg-white/22 transition-colors text-white z-30 cursor-pointer"
                      >
                        <Maximize2 size={15} />
                      </button>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Dot Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {activeCategories.map((cat, idx) => (
              <button
                type="button"
                key={`dot-${cat}`}
                onClick={() => setActiveIndex(idx)}
                className={`rounded-full transition-[width,background-color] duration-300 ease-out cursor-pointer ${
                  idx === activeIndex
                    ? `w-6 h-1.5 ${categoryConfig[cat].bg}`
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Lihat ${categoryConfig[cat].title}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal (GPU entrance/exit without 3D layoutId distortion) */}
      <AnimatePresence>
        {expandedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setExpandedCategory(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="solid-frost bg-[#141619] border border-white/12 w-full max-w-3xl max-h-[82vh] rounded-[1.6rem] p-5 md:p-7 relative z-10 shadow-2xl flex flex-col will-change-transform"
            >
              <button
                type="button"
                onClick={() => setExpandedCategory(null)}
                aria-label="Tutup detail kategori"
                className="absolute top-5 right-5 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white z-20"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-black ${categoryConfig[expandedCategory].bg}`}
                >
                  {categoryConfig[expandedCategory].icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white tracking-tight leading-tight">
                  {categoryConfig[expandedCategory].title}
                </h2>
              </div>

              <div className="space-y-5 overflow-y-auto flex-1 pr-2">
                {grouped[expandedCategory].map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0"
                  >
                    {item.image_url && (() => {
                      const hlSrc = formatMediaUrl(item.image_url, 200);
                      return (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5">
                          <Image
                            src={hlSrc}
                            alt={item.title || "Timeline image"}
                            fill
                            sizes="64px"
                            unoptimized={isGoogleDriveMediaUrl(hlSrc)}
                            className="object-cover"
                          />
                        </div>
                      );
                    })()}
                    <div className="flex-1">
                      {item.period && (
                        <p
                          className={`text-[11px] font-body font-medium uppercase tracking-wider mb-1 ${categoryConfig[expandedCategory].text}`}
                        >
                          {item.period}
                        </p>
                      )}
                      <h3 className="text-base sm:text-lg font-heading font-semibold text-white leading-snug mb-1.5">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs sm:text-sm leading-relaxed font-body text-white/70">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wavy SVG Marquee (Skills) */}
      {hasSkills && (
        <div className="mt-3 md:mt-5 w-full overflow-hidden relative">
          <div
            className="w-full relative h-[80px]"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 3000 80"
              preserveAspectRatio="xMidYMid slice"
              className="absolute top-0 left-0 w-full h-full min-w-[3000px]"
            >
              <path
                id="curve"
                d="M 0 40 Q 250 8 500 40 T 1000 40 T 1500 40 T 2000 40 T 2500 40 T 3000 40"
                fill="transparent"
                stroke="transparent"
              />
              <text
                fill="rgba(255,255,255,0.4)"
                fontSize="13"
                fontWeight="500"
                fontFamily="Google Sans Text, system-ui, sans-serif"
                className="uppercase tracking-widest"
              >
                <textPath
                  href="#curve"
                  startOffset="0"
                  className="animate-wavy-marquee"
                >
                  <animate
                    attributeName="startOffset"
                    from="0%"
                    to="-50%"
                    begin="0s"
                    dur="40s"
                    repeatCount="indefinite"
                  />
                  {repeatedSkills}
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      )}
    </section>
  );
}
