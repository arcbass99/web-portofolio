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
      className="pt-10 pb-8 md:pt-14 md:pb-14 px-6 lg:px-12 xl:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-7 md:mb-10 max-w-3xl">
          <span
            className="liquid-glass rounded-full inline-flex border border-cyan-400/30 bg-cyan-400/15 px-[1.618rem] py-[0.618rem] text-[0.618rem] font-body font-black uppercase tracking-widest text-cyan-200"
          >
            Track Record
          </span>

          <h2 className="mt-[1.618rem] text-[2.618rem] md:text-[4.236rem] font-heading italic font-black tracking-tight leading-tight text-white">
            Jejak akademik, prestasi, dan proses kreatif.
          </h2>

          <p className="mt-[1rem] text-[1rem] font-body font-medium leading-relaxed text-white/80 text-justify md:text-left">
            Ringkasan perjalanan yang membentuk cara saya berpikir, memimpin,
            dan membuat karya digital.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.618rem] items-start">
          {/* Kiri: Pendidikan & Keahlian */}
          <div className="flex flex-col gap-[1.618rem]">
            {hasEducation && (
              <TimelineBlock
                title="Riwayat Pendidikan"
                icon={<GraduationCap size={22} />}
                items={grouped.education}
              />
            )}
            {hasSkills && (
              <SkillBlock
                items={grouped.skill}
              />
            )}
          </div>

          {/* Kanan: Pencapaian & Kepemimpinan */}
          <div className="flex flex-col gap-[1.618rem]">
            {hasAchievements && (
              <AchievementBlock
                items={grouped.achievement}
              />
            )}
            {hasLeadership && (
              <TimelineBlock
                title="Kepemimpinan & Organisasi"
                icon={<Users size={22} />}
                items={grouped.leadership}
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
};

function TimelineBlock({ title, icon, items }: TimelineBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="h-full"
    >
      <div
        className="liquid-glass rounded-[2rem] border border-white/5 bg-white/5 p-[1.618rem] backdrop-blur-md shadow-xl h-full flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group relative overflow-hidden"
      >
        {/* Cinematic Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/20 blur-[50px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/20 blur-[50px] rounded-full" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-[1rem] mb-[1.618rem]">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300"
            >
              {icon}
            </span>
            <h3 className="text-[1.618rem] font-heading italic font-black tracking-tight text-white">
              {title}
            </h3>
          </div>

          <div className="relative space-y-[1.618rem]">
            <div
              className="absolute left-[0.72rem] top-2 bottom-2 w-px bg-white/10"
              aria-hidden="true"
            />

            {items.map((item, index) => (
              <div key={item.id} className="relative pl-10">
                <span
                  className="absolute left-0 top-1.5 z-10 h-6 w-6 rounded-full border-4 border-black bg-cyan-400"
                  aria-hidden="true"
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.08 }}
                  className="min-w-0"
                >
                  {item.period && (
                    <p className="mb-[0.618rem] text-[0.618rem] font-body font-black uppercase tracking-widest text-cyan-200">
                      {item.period}
                    </p>
                  )}

                  <div className="flex items-start gap-[1rem]">
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
                      <h4 className="text-[1rem] font-heading italic font-black leading-snug text-white">
                        {item.title}
                      </h4>

                      {item.description && (
                        <p className="mt-[0.618rem] text-[1rem] leading-relaxed font-body font-medium text-white/80 text-justify">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type AchievementBlockProps = {
  items: ProfileHighlight[];
};

function AchievementBlock({ items }: AchievementBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="h-full"
    >
      <div
        className="liquid-glass rounded-[2rem] border border-white/5 bg-white/5 p-[1.618rem] backdrop-blur-md shadow-xl h-full flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group relative overflow-hidden"
      >
        {/* Cinematic Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/20 blur-[50px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/20 blur-[50px] rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-[1rem] mb-[1.618rem]">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300"
            >
              <Award size={22} />
            </span>
            <h3 className="text-[1.618rem] font-heading italic font-black tracking-tight text-white">
              Pencapaian Utama
            </h3>
          </div>

          <div className="space-y-[1.618rem]">
            {items.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl"
              >
                <div
                  className="liquid-glass rounded-2xl border border-white/5 bg-black/20 p-[1rem]"
                >
                  <div className="flex items-start gap-[1rem]">
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
                        <p className="mb-[0.618rem] text-[0.618rem] font-body font-black uppercase tracking-widest text-amber-200">
                          {item.period}
                        </p>
                      )}

                      <h4 className="text-[1rem] font-heading italic font-black leading-snug text-white">{item.title}</h4>

                      {item.description && (
                        <p className="mt-[0.618rem] text-[1rem] leading-relaxed font-body font-medium text-white/80 text-justify">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type SkillBlockProps = {
  items: ProfileHighlight[];
};

function SkillBlock({ items }: SkillBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="h-full"
    >
      <div
        className="liquid-glass rounded-[2rem] border border-white/5 bg-white/5 p-[1.618rem] backdrop-blur-md shadow-xl h-full flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group relative overflow-hidden"
      >
        {/* Cinematic Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-400/20 blur-[50px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-500/20 blur-[50px] rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-[1rem] mb-[1.618rem]">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300"
            >
              <Sparkles size={22} />
            </span>
            <h3 className="text-[1.618rem] font-heading italic font-black tracking-tight text-white">
              Keahlian Inti
            </h3>
          </div>

          <div className="flex flex-wrap gap-[1rem]">
            {items.map((item) => (
              <span
                key={item.id}
                className="liquid-glass rounded-full border border-white/5 bg-white/5 px-[1.618rem] py-[0.618rem] text-[1rem] font-body font-black text-slate-200"
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
