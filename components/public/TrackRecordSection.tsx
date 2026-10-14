"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { Award, GraduationCap, Users, Maximize2, X } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import type {
  ProfileHighlight,
  ProfileHighlightCategory,
} from "../../types/content";

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
    icon: <GraduationCap size={22} />,
    bg: "bg-cyan-400",
    text: "text-cyan-400",
    title: "Education",
  },
  achievement: {
    icon: <Award size={22} />,
    bg: "bg-amber-400",
    text: "text-amber-400",
    title: "Achievements",
  },
  leadership: {
    icon: <Users size={22} />,
    bg: "bg-violet-400",
    text: "text-violet-400",
    title: "Leadership",
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
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      const navbar = document.querySelector('nav');
      if (navbar) {
        const computedStyle = window.getComputedStyle(navbar);
        const originalPaddingRight = computedStyle.paddingRight;
        navbar.setAttribute('data-original-pr', originalPaddingRight);
        navbar.style.paddingRight = `calc(${originalPaddingRight} + ${scrollbarWidth}px)`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      
      const navbar = document.querySelector('nav');
      if (navbar && navbar.hasAttribute('data-original-pr')) {
        navbar.style.paddingRight = navbar.getAttribute('data-original-pr') || "";
        navbar.removeAttribute('data-original-pr');
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.paddingRight = "";
      }
    };
  }, [expandedCategory]);

  if (activeCategories.length === 0 && !hasSkills) {
    return null;
  }

  // Wavy marquee string preparation
  const skillsString = grouped.skill.map((s) => s.title).join("             ✦             ");
  const repeatedSkills = Array(20).fill(skillsString).join("             ✦             ");

  return (
    <section id="track-record" className="py-10 md:py-16 overflow-hidden">
      <style>{`
        @keyframes wavy-marquee {
          0% { startOffset: 0%; }
          100% { startOffset: -50%; }
        }
        .animate-wavy-marquee {
          animation: wavy-marquee 40s linear infinite;
        }
        /* Fallback for browsers that don't support startOffset animation in CSS */
        @supports not (startOffset: 0%) {
          .animate-wavy-marquee {
            animation: none;
          }
        }
      `}</style>

      {/* Header section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-24">
        <div className="mb-12">
          <span className="liquid-glass rounded-full inline-flex border border-cyan-400/30 bg-cyan-400/15 px-6 py-2.5 text-xs font-body font-black uppercase tracking-widest text-cyan-200">
            Bagian 2
          </span>
        </div>

        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-heading italic font-black tracking-wide leading-tight text-white">
            Track Record
          </h2>

          <p className="mt-4 max-w-[65ch] text-base font-body font-medium leading-relaxed text-white/80 text-justify md:text-left">
            Ringkasan perjalanan yang membentuk cara saya berpikir, memimpin,
            dan membuat karya digital.
          </p>
        </div>
      </div>

      {/* 3D Cover Flow Carousel */}
      {activeCategories.length > 0 && (
        <>
        <div
          className="relative flex h-[400px] w-full items-center justify-center overflow-hidden perspective-[1000px] mt-8"
          style={{ perspective: "1000px" }}
          onTouchStart={(e) => {
            if (e.touches[0]) {
              touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
          }}
          onTouchCancel={() => {
            touchStartRef.current = null;
          }}
          onTouchEnd={(e) => {
            if (!touchStartRef.current || !e.changedTouches[0]) return;
            const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
            const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
            // Only count horizontal swipes (more horizontal than vertical)
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

            let scale = 1;
            let filter = "brightness(1) grayscale(0)";
            let zIndex = 10;
            let rotateY = 0;

            if (distance !== 0) {
              scale = 0.85;
              filter = "brightness(0.3) grayscale(0.5)";
              zIndex = 5 - Math.abs(distance);
              rotateY = distance < 0 ? 15 : -15;
            }

            return (
              <div
                key={cat}
                className="absolute left-1/2 top-1/2 w-[280px] sm:w-[320px] h-[320px] transition-all duration-500 ease-in-out"
                style={{ 
                  transformOrigin: "center center",
                  backfaceVisibility: "hidden",
                  WebkitFontSmoothing: "antialiased",
                  transform: distance === 0 
                    ? `translate(-50%, -50%)`
                    : `translate(calc(-50% + ${distance * 55}%), -50%) scale(${scale}) rotateY(${rotateY}deg)`,
                  zIndex: zIndex,
                  filter: filter
                }}
              >
                <motion.div
                  layoutId={`category-card-${cat}`}
                  onClick={() => !isActive && setActiveIndex(idx)}
                  whileHover={{ y: -8 }}
                  whileTap={isActive ? { scale: 0.96 } : {}}
                  className={`w-full h-full rounded-[2rem] border border-white/10 bg-zinc-950 flex flex-col p-6 shadow-xl overflow-hidden group ${
                    !isActive ? "cursor-pointer hover:border-white/20" : ""
                  }`}
                >
                  {/* Cinematic Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
                    <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[50px] rounded-full ${cat === 'education' ? 'bg-cyan-400/20' : cat === 'achievement' ? 'bg-amber-400/20' : 'bg-violet-400/20'}`} />
                    <div className={`absolute -bottom-24 -left-24 w-48 h-48 blur-[50px] rounded-full ${cat === 'education' ? 'bg-violet-500/20' : cat === 'achievement' ? 'bg-rose-500/20' : 'bg-fuchsia-500/20'}`} />
                  </div>

                  <div className="flex items-center gap-3 relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-black shadow-lg flex-shrink-0 ${categoryConfig[cat].bg}`}
                    >
                      {categoryConfig[cat].icon}
                    </div>
                    <h3 className="text-xl font-heading font-black italic text-white uppercase tracking-wider truncate">
                      {categoryConfig[cat].title}
                    </h3>
                  </div>

                  <div className="mt-4 flex-1 flex flex-col gap-3 relative z-10 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {grouped[cat].map((item) => (
                      <div key={item.id} className="flex flex-col">
                        {item.period && (
                          <span
                            className={`text-[10px] font-body font-black uppercase tracking-widest mb-1 ${categoryConfig[cat].text}`}
                          >
                            {item.period}
                          </span>
                        )}
                        <h4 className="text-sm sm:text-base font-heading italic font-black text-white leading-tight line-clamp-1">
                          {item.title}
                        </h4>
                      </div>
                    ))}
                  </div>

                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategory(cat);
                      }}
                      aria-label={`Buka detail kategori ${categoryConfig[cat].title}`}
                      className="absolute bottom-6 right-6 p-2.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white backdrop-blur-md z-20"
                    >
                      <Maximize2 size={18} />
                    </button>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Dot Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {activeCategories.map((cat, idx) => (
            <button
              key={`dot-${cat}`}
              onClick={() => setActiveIndex(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? `w-8 h-2 ${categoryConfig[cat].bg}`
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Lihat ${categoryConfig[cat].title}`}
            />
          ))}
        </div>
        </>
      )}

      {/* Modal Morphing */}
      <AnimatePresence>
        {expandedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setExpandedCategory(null)}
            />
            <motion.div
              layoutId={`category-card-${expandedCategory}`}
              className="bg-[#050505] border border-white/10 w-full max-w-4xl max-h-[85vh] rounded-[2rem] p-6 md:p-10 relative z-10 shadow-2xl flex flex-col"
            >
              <button
                onClick={() => setExpandedCategory(null)}
                aria-label="Tutup detail kategori"
                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white z-20"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-10">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-black ${categoryConfig[expandedCategory].bg}`}
                >
                  {categoryConfig[expandedCategory].icon}
                </div>
                <h2 className="text-3xl font-heading font-black italic text-white uppercase tracking-wider">
                  {categoryConfig[expandedCategory].title}
                </h2>
              </div>

              <div className="space-y-8 overflow-y-auto flex-1 pr-2">
                {grouped[expandedCategory].map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row gap-6 border-b border-white/10 pb-8 last:border-0 last:pb-0"
                  >
                    {item.image_url && (
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-200/10">
                        <Image
                          src={formatMediaUrl(item.image_url, 256)}
                          alt={item.title || "Timeline image"}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      {item.period && (
                        <p
                          className={`text-sm font-body font-black uppercase tracking-widest mb-2 ${categoryConfig[expandedCategory].text}`}
                        >
                          {item.period}
                        </p>
                      )}
                      <h4 className="text-2xl font-heading italic font-black text-white leading-tight mb-3">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-base leading-relaxed font-body font-medium text-white/70">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wavy SVG Marquee (Skills) */}
      {hasSkills && (
        <div className="mt-4 md:mt-6 w-full overflow-hidden relative">
          <div
            className="w-full relative h-[100px]"
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
              viewBox="0 0 3000 100"
              preserveAspectRatio="xMidYMid slice"
              className="absolute top-0 left-0 w-full h-full min-w-[3000px]"
            >
              <path
                id="curve"
                d="M 0 50 Q 250 10 500 50 T 1000 50 T 1500 50 T 2000 50 T 2500 50 T 3000 50"
                fill="transparent"
                stroke="transparent"
              />
              <text
                fill="rgba(255,255,255,0.35)"
                fontSize="16"
                fontWeight="bold"
                fontFamily="sans-serif"
                className="uppercase tracking-widest"
              >
                <textPath
                  href="#curve"
                  startOffset="0"
                  className="animate-wavy-marquee"
                >
                  {/* We use an SVG animate tag as fallback/primary for better cross-browser compatibility */}
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
