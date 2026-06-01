"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Award, GraduationCap, Sparkles, Users } from "lucide-react";
import { formatMediaUrl } from "../../lib/media";
import type {
  ProfileHighlight,
  ProfileHighlightCategory,
} from "../../types/content";

type TrackRecordSectionProps = {
  highlights: ProfileHighlight[];
  isDark: boolean;
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

export function TrackRecordSection({
  highlights,
  isDark,
}: TrackRecordSectionProps) {
  const grouped = categoryOrder.reduce(
    (result, category) => {
      result[category] = sortByOrder(
        highlights.filter((highlight) => highlight.category === category),
      );

      return result;
    },
    {} as Record<ProfileHighlightCategory, ProfileHighlight[]>,
  );

  const hasEducation = grouped.education.length > 0;
  const hasAchievements = grouped.achievement.length > 0;
  const hasLeadership = grouped.leadership.length > 0;
  const hasSkills = grouped.skill.length > 0;

  if (!hasEducation && !hasAchievements && !hasLeadership && !hasSkills) {
    return null;
  }

  return (
    <section
      id="track-record"
      className="py-12 md:py-20 px-6 lg:px-12 xl:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12 max-w-3xl">
          <span
            className={`inline-flex rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${
              isDark
                ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                : "border-teal-200 bg-teal-50 text-teal-700"
            }`}
          >
            Track Record
          </span>

          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Jejak akademik, prestasi, dan proses kreatif.
          </h2>

          <p
            className={`mt-4 text-base md:text-lg font-medium leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Ringkasan perjalanan yang membentuk cara saya berpikir, memimpin,
            dan membuat karya digital.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-[1.618fr_1fr]">
          <div className="space-y-6">
            {hasEducation && (
              <TimelineBlock
                title="Riwayat Pendidikan"
                icon={<GraduationCap size={22} />}
                items={grouped.education}
                isDark={isDark}
              />
            )}

            {hasLeadership && (
              <TimelineBlock
                title="Kepemimpinan & Organisasi"
                icon={<Users size={22} />}
                items={grouped.leadership}
                isDark={isDark}
              />
            )}
          </div>

          <div className="space-y-6">
            {hasAchievements && (
              <AchievementBlock
                items={grouped.achievement}
                isDark={isDark}
              />
            )}

            {hasSkills && (
              <SkillBlock
                items={grouped.skill}
                isDark={isDark}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type TimelineBlockProps = {
  title: string;
  icon: ReactNode;
  items: ProfileHighlight[];
  isDark: boolean;
};

function TimelineBlock({ title, icon, items, isDark }: TimelineBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`rounded-3xl border p-5 md:p-7 backdrop-blur-md shadow-xl ${
        isDark
          ? "border-white/10 bg-white/5"
          : "border-white/60 bg-white/50"
      }`}
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
            isDark
              ? "bg-cyan-400/10 text-cyan-300"
              : "bg-teal-100 text-teal-700"
          }`}
        >
          {icon}
        </span>
        <h3 className="text-2xl md:text-[1.7rem] font-black tracking-tight">
          {title}
        </h3>
      </div>

      <div className="relative space-y-5 md:space-y-6">
        <div
          className={`absolute left-[0.72rem] top-2 bottom-2 w-px ${
            isDark ? "bg-white/10" : "bg-slate-200"
          }`}
          aria-hidden="true"
        />

        {items.map((item, index) => (
          <div key={item.id} className="relative pl-10">
            <span
              className={`absolute left-0 top-1.5 z-10 h-6 w-6 rounded-full border-4 ${
                isDark
                  ? "border-[#0B0C10] bg-cyan-400"
                  : "border-white bg-teal-500"
              }`}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="min-w-0"
            >
              {item.period && (
                <p
                  className={`mb-1 text-xs font-black uppercase tracking-widest ${
                    isDark ? "text-cyan-300" : "text-teal-700"
                  }`}
                >
                  {item.period}
                </p>
              )}

              <div className="flex items-start gap-4">
                {item.image_url && (
                  <div className="relative mt-1 h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                    <Image
                      src={formatMediaUrl(item.image_url, 256)}
                      alt={item.title || "Track record image"}
                      fill
                      sizes="56px"
                      quality={72}
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="text-base md:text-[1.05rem] font-black leading-snug">
                    {item.title}
                  </h4>

                  {item.description && (
                    <p
                      className={`mt-1.5 text-sm leading-relaxed font-medium ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

type AchievementBlockProps = {
  items: ProfileHighlight[];
  isDark: boolean;
};

function AchievementBlock({ items, isDark }: AchievementBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`rounded-3xl border p-5 md:p-7 backdrop-blur-md shadow-xl ${
        isDark
          ? "border-white/10 bg-white/5"
          : "border-white/60 bg-white/50"
      }`}
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
            isDark
              ? "bg-amber-400/10 text-amber-300"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          <Award size={22} />
        </span>
        <h3 className="text-2xl md:text-[1.7rem] font-black tracking-tight">
          Pencapaian Utama
        </h3>
      </div>

      <div className="space-y-3.5">
        {items.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: index * 0.08 }}
            className={`rounded-2xl border p-3.5 md:p-4 ${
              isDark
                ? "border-white/10 bg-black/20"
                : "border-slate-200 bg-white/70"
            }`}
          >
            <div className="flex items-start gap-4">
              {item.image_url && (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                  <Image
                    src={formatMediaUrl(item.image_url, 256)}
                    alt={item.title || "Achievement image"}
                    fill
                    sizes="56px"
                    quality={72}
                    className="object-cover"
                  />
                </div>
              )}

              <div>
                {item.period && (
                  <p
                    className={`mb-1 text-[10px] font-black uppercase tracking-widest ${
                      isDark ? "text-amber-300" : "text-amber-700"
                    }`}
                  >
                    {item.period}
                  </p>
                )}

                <h4 className="font-black leading-snug">{item.title}</h4>

                {item.description && (
                  <p
                    className={`mt-1.5 text-sm leading-relaxed font-medium ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

type SkillBlockProps = {
  items: ProfileHighlight[];
  isDark: boolean;
};

function SkillBlock({ items, isDark }: SkillBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`rounded-3xl border p-5 md:p-7 backdrop-blur-md shadow-xl ${
        isDark
          ? "border-white/10 bg-white/5"
          : "border-white/60 bg-white/50"
      }`}
    >
      <div className="flex items-center gap-3 mb-5">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
            isDark
              ? "bg-violet-400/10 text-violet-300"
              : "bg-violet-100 text-violet-700"
          }`}
        >
          <Sparkles size={22} />
        </span>
        <h3 className="text-2xl md:text-[1.7rem] font-black tracking-tight">
          Keahlian Inti
        </h3>
      </div>

      <div className="flex flex-wrap gap-2.5 md:gap-3">
        {items.map((item) => (
          <span
            key={item.id}
            className={`rounded-full border px-4 py-2 text-xs md:text-sm font-black ${
              isDark
                ? "border-white/10 bg-white/5 text-slate-200"
                : "border-slate-200 bg-white/70 text-slate-700"
            }`}
          >
            {item.title}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
