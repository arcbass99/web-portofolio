export type CloudMood =
  | "normal"
  | "curious"
  | "happy"
  | "wink"
  | "surprised"
  | "dizzy"
  | "sleepy"
  | "love"
  | "angry"
  | "sad"
  | "excited"
  | "wheee"
  | "cool";

export type Reaction = {
  text: string | null;
  mood: CloudMood;
  duration?: number;
};

export type SifanContext = {
  page: "home" | "galeri";
  aboutHeadline?: string;
  highlightsCount?: number;
  featuredTitles?: string[];
  totalGalleryCount?: number;
  servicesTitles?: string[];
};

export type SifanTourTopic = "featured" | "about" | "services";

export const EYE_L = { x: 46.5, y: 45.5 };
export const EYE_R = { x: 75.5, y: 45.5 };
export const INK = "#1E293B";

export const spiral = (cx: number, cy: number) =>
  `M ${cx - 0.5} ${cy} a 0.5 0.5 0 1 1 1 0 a 1.5 1.5 0 1 1 -3 0 a 2.5 2.5 0 1 1 5 0 a 3.5 3.5 0 1 1 -7 0`;

export const heart = (cx: number, cy: number) =>
  `M ${cx} ${cy + 3.8} C ${cx - 5.5} ${cy}, ${cx - 4.2} ${cy - 5}, ${cx} ${cy - 1.8} C ${cx + 4.2} ${cy - 5}, ${cx + 5.5} ${cy}, ${cx} ${cy + 3.8} Z`;

export const pick = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)] as T;

export const SIFAN_CLICK_DIALOGUES: Reaction[] = [
  {
    text: "Halo! Namaku Sifan, pemandu awan di web Nafis ☁️",
    mood: "happy",
  },
  {
    text: "Tahu gak kenapa namaku Sifan? Coba baca nama Nafis terbalik 🤭",
    mood: "wink",
  },
  {
    text: "Sekarang aku nempel rapi di tepi kanan biar gak nutupin layar HP kamu ✨",
    mood: "happy",
  },
  {
    text: "Kamu juga tetap bisa seret aku ke mana aja di layar lho 🎈",
    mood: "excited",
  },
  {
    text: "Coba klik 2x cepat, aku bisa salto 360° sambil keluar kilau! 🤸",
    mood: "wheee",
  },
  {
    text: "Elus-elus aku pelan pakai kursor, aku paling suka 🥰",
    mood: "love",
  },
  {
    text: "Klik tombol hati di kartu Galeri kalau kamu suka karyanya ya! 💖",
    mood: "love",
  },
  {
    text: "Nafis itu memadukan Biologi, Web, AI, dan Desain 🧬",
    mood: "happy",
  },
  {
    text: "Fun fact: awan asli beratnya ratusan ton, aku cuma beberapa kilobyte 😌",
    mood: "wink",
  },
  {
    text: "Kalau kursor diam lama, aku bakal ketiduran di tepi kanan... 💤",
    mood: "sleepy",
  },
  {
    text: "Jangan goyang kursor terlalu kencang di atasku, nanti pusing! 😵‍💫",
    mood: "surprised",
  },
  {
    text: "Mau tur cepat? Pilih salah satu tombol panduan di bawah ini ya 🧭",
    mood: "curious",
  },
];

export const SIFAN_IDLE_ACTIONS: Reaction[] = [
  {
    text: "🎵 La la la~ melayang santai di pinggir layar",
    mood: "happy",
    duration: 2800,
  },
  {
    text: "Hoaam~ ngintip dari tepi kanan sambil siaga 🥱",
    mood: "sleepy",
    duration: 2400,
  },
  {
    text: "Hmm, pengunjung lagi fokus lihat bagian mana ya? 🤔",
    mood: "curious",
    duration: 2800,
  },
  { text: null, mood: "wink", duration: 900 },
  {
    text: "✨ Cling! Jangan lupa kasih apresiasi untuk karya favoritmu di Galeri!",
    mood: "love",
    duration: 3000,
  },
];

export const SIFAN_DIZZY_LINES = [
  "Pusiiing... dunia berputar 360 derajat! 😵‍💫",
  "Waaa jangan diacak-acak, awanku jadi gulali! 🌀",
  "Kepalaku muter-muter kayak kipas angin 😵",
  "Ampun kak! Berhenti muter-muter dong 🏳️",
];

export const SIFAN_ANGRY_LINES = [
  "Aduh aduh! Jangan dipencet bertubi-tubi dong 😤",
  "Hmph! Sakit tau, aku ngambek 3 detik! 😠",
  "Stop dulu! Jarimu lagi latihan drum ya? 🥁",
];

export const SIFAN_PETTING_LINES = [
  "Hehe, enak dielus-elus... makasih ya 🥰",
  "Lagi dong elusnya~ bulu awanku jadi halus 💕",
  "Aww, kamu ramah banget sama Sifan! ✨",
];

export const SIFAN_LANDING_LINES = [
  "Mendarat dengan selamat, kapten! 🛬",
  "Sip, aku stay di sini dulu ya 😌",
  "Wii, seru juga terbang dipindahin kamu 🎈",
];

export const SIFAN_WAKEUP_LINES = [
  "Eh! Aku gak tidur kok, cuma merem sedetik 😳",
  "Hoaamm~ eh ada orang! Sifan siap memandu 🥱",
  "Kaget! Kirain tadi ditinggalin pergi 🥺",
];

export const SIFAN_TREAT_LINES = [
  "Nyam nyam~ permen awannya manis banget! 🍬✨",
  "Enak! Energi awanku langsung penuh lagi 💖",
  "Hehe makasih cemilannya, jadi makin semangat nemenin kamu ☁️",
];

export type CandyTier = {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  minTreats: number;
  nextMilestone: number | null;
  badgeClass: string;
  barClass: string;
  hasStarClip: boolean;
  hasCottonCandyTint: boolean;
  hasCrown: boolean;
};

export const CANDY_TIERS: CandyTier[] = [
  {
    level: 5,
    label: "Sultan Awan",
    minTreats: 15,
    nextMilestone: null,
    badgeClass: "border-amber-300/35 bg-amber-400/15 text-amber-200",
    barClass: "bg-gradient-to-r from-amber-300 via-rose-300 to-violet-300",
    hasStarClip: false,
    hasCottonCandyTint: true,
    hasCrown: true,
  },
  {
    level: 4,
    label: "Gulali",
    minTreats: 10,
    nextMilestone: 15,
    badgeClass: "border-fuchsia-400/35 bg-fuchsia-500/15 text-fuchsia-200",
    barClass: "bg-gradient-to-r from-pink-400 to-violet-400",
    hasStarClip: true,
    hasCottonCandyTint: true,
    hasCrown: false,
  },
  {
    level: 3,
    label: "Bestie",
    minTreats: 6,
    nextMilestone: 10,
    badgeClass: "border-emerald-400/35 bg-emerald-500/15 text-emerald-200",
    barClass: "bg-gradient-to-r from-emerald-400 to-cyan-400",
    hasStarClip: true,
    hasCottonCandyTint: false,
    hasCrown: false,
  },
  {
    level: 2,
    label: "Akrab",
    minTreats: 3,
    nextMilestone: 6,
    badgeClass: "border-blue-400/35 bg-blue-500/15 text-blue-200",
    barClass: "bg-gradient-to-r from-blue-400 to-indigo-400",
    hasStarClip: false,
    hasCottonCandyTint: false,
    hasCrown: false,
  },
  {
    level: 1,
    label: "Kenalan",
    minTreats: 0,
    nextMilestone: 3,
    badgeClass: "border-rose-400/30 bg-rose-500/15 text-rose-200",
    barClass: "bg-rose-400",
    hasStarClip: false,
    hasCottonCandyTint: false,
    hasCrown: false,
  },
];

export const getCandyTier = (treats: number): CandyTier => {
  const safeCount = Number.isFinite(treats) && treats > 0 ? Math.floor(treats) : 0;
  return (
    CANDY_TIERS.find((tier) => safeCount >= tier.minTreats) ??
    CANDY_TIERS[CANDY_TIERS.length - 1]
  );
};

export const getCandyProgressPercent = (
  treats: number,
  tier = getCandyTier(treats),
): number => {
  if (tier.nextMilestone === null) return 100;
  const span = Math.max(1, tier.nextMilestone - tier.minTreats);
  const offset = Math.max(0, Math.floor(treats) - tier.minTreats);
  return Math.min(100, Math.round((offset / span) * 100));
};

export const buildTreatReaction = (
  treats: number,
): { reaction: Reaction; spinDelta: number; burstCount: number } => {
  const count =
    Number.isFinite(treats) && treats > 0 ? Math.floor(treats) : 1;

  const milestones: Record<
    number,
    { reaction: Reaction; spinDelta: number; burstCount: number }
  > = {
    3: {
      reaction: {
        text: "Level up Lv.2 Akrab (3 permen): mode kacamata santai aktif 😎✨",
        mood: "cool",
        duration: 4400,
      },
      spinDelta: 0,
      burstCount: 4,
    },
    6: {
      reaction: {
        text: "Evolusi Lv.3 Bestie! Pin bintang terpasang, Sifan salto perayaan! 🤸🌟",
        mood: "excited",
        duration: 4600,
      },
      spinDelta: 1,
      burstCount: 5,
    },
    10: {
      reaction: {
        text: "Evolusi Lv.4 Mode Gulali! Warna awanku berubah jadi pastel manis 🍭☁️",
        mood: "wheee",
        duration: 4800,
      },
      spinDelta: 1,
      burstCount: 6,
    },
    15: {
      reaction: {
        text: "MAX EVOLUSI Lv.5 Sultan Awan! Mahkota emas & double salto buatmu 👑🎉",
        mood: "wheee",
        duration: 5200,
      },
      spinDelta: 2,
      burstCount: 7,
    },
  };

  if (milestones[count]) {
    return milestones[count];
  }

  if (count >= 20 && count % 5 === 0) {
    return {
      reaction: {
        text: pick([
          `Sugar rush x${count}! Sifan muter turbo gara-gara kebanyakan gula kapas 🍭⚡`,
          `Rekor ${count} permen! Dokter gigi awan sampai bingung lihat awan semanis ini 😂👑`,
        ]),
        mood: "wheee",
        duration: 4200,
      },
      spinDelta: 1,
      burstCount: 6,
    };
  }

  if (count >= 15) {
    return {
      reaction: {
        text: pick([
          `Permen ke-${count}! Sultan Awan makin bertenaga dengan aura emas 👑✨`,
          `Nyam~ koleksi ke-${count}! Mahkota Sifan ikut berkilau buat kamu 🍬`,
        ]),
        mood: "love",
        duration: 3200,
      },
      spinDelta: 0,
      burstCount: 4,
    };
  }

  if (count >= 10) {
    return {
      reaction: {
        text: pick([
          `Permen ke-${count}! Nuansa gulali pastel ini bikin awan tambah empuk 🍭☁️`,
          `Sweet x${count}! Tinggal ${15 - count} permen lagi buat buka Mahkota Sultan 👑`,
        ]),
        mood: "excited",
        duration: 3200,
      },
      spinDelta: 0,
      burstCount: 4,
    };
  }

  if (count >= 6) {
    return {
      reaction: {
        text: pick([
          `Permen ke-${count}! Pin bintang di kepalaku makin bersinar nih 🌟`,
          `Asik x${count}! Tambah ${10 - count} lagi biar awan berubah jadi Gulali 🍭`,
        ]),
        mood: "love",
        duration: 3200,
      },
      spinDelta: 0,
      burstCount: 3,
    };
  }

  if (count >= 3) {
    return {
      reaction: {
        text: pick([
          `Permen ke-${count}! Tambah ${6 - count} lagi buat buka pin bintang & salto 🤸`,
          `Enak banget x${count}! Kita makin akrab nih 💖`,
        ]),
        mood: "love",
        duration: 3000,
      },
      spinDelta: 0,
      burstCount: 3,
    };
  }

  return {
    reaction: {
      text: `${pick(SIFAN_TREAT_LINES)} (${count}/3 menuju Lv.2)`,
      mood: "love",
      duration: 3000,
    },
    spinDelta: 0,
    burstCount: 3,
  };
};

export const buildSurpriseReply = (context: SifanContext): Reaction => {
  const pool: Reaction[] = [
    {
      text: "Fun fact: Sifan dibuat murni dengan SVG ringan tanpa file gambar eksternal ☁️",
      mood: "cool",
      duration: 4200,
    },
    {
      text: "Tips: coba seret aku bebas ke bagian layar mana aja, nanti bisa klik Rata kanan 🎈",
      mood: "wink",
      duration: 4200,
    },
    {
      text: "Nafis senang menggabungkan riset Biologi, web modern, dan eksplorasi desain 🧬",
      mood: "happy",
      duration: 4400,
    },
  ];

  if (context.featuredTitles && context.featuredTitles.length > 0) {
    const pickedTitle = pick(context.featuredTitles);
    pool.push({
      text: `Sudah cek "${pickedTitle}"? Buka kartunya buat lihat detail lengkapnya! 🖼️`,
      mood: "curious",
      duration: 4500,
    });
  }

  if ((context.totalGalleryCount ?? 0) > 0) {
    pool.push({
      text: `Saat ini total ada ${context.totalGalleryCount} arsip karya & dokumentasi di Galeri 📂`,
      mood: "excited",
      duration: 4300,
    });
  }

  if (context.servicesTitles && context.servicesTitles.length > 0) {
    const pickedService = pick(context.servicesTitles);
    pool.push({
      text: `Butuh kolaborasi? Cek produk "${pickedService}" di bagian Produk dan Layanan 🚀`,
      mood: "love",
      duration: 4500,
    });
  }

  return pick(pool);
};

export const SECTION_COMMENTS: Record<string, Reaction[]> = {
  home: [
    { text: "Selamat datang di beranda utama Nafis! 👋", mood: "happy" },
    {
      text: "Klik aku kapan saja kalau butuh pemandu tur cepat 🧭",
      mood: "curious",
    },
  ],
  "track-record": [
    {
      text: "Wah, lagi lihat rekam jejak & prestasi Nafis ya! 🎓",
      mood: "curious",
    },
    {
      text: "Banyak pengalaman organisasi & riset menarik di sini 🏆",
      mood: "excited",
    },
  ],
  galeri: [
    {
      text: "Bagian favoritku! Geser terus ke kanan buat masuk ke Galeri lengkap 🎨",
      mood: "love",
    },
    {
      text: "Klik tombol hati kalau suka, atau ketuk kartunya untuk detail 💻",
      mood: "happy",
    },
  ],
  services: [
    {
      text: "Butuh solusi digital atau kolaborasi? Cek layanannya di sini ⚡",
      mood: "wink",
    },
    { text: "Layanan & produk digital siap membantu proyekmu 🚀", mood: "excited" },
  ],
};

export const getGreeting = (page: "home" | "galeri", treats = 0): string => {
  if (treats >= 15) {
    return page === "galeri"
      ? `Awan Sultan (${treats} 🍬) siap menemani kamu menjelajahi Galeri 👑`
      : `Halo lagi! Awan Sultan (${treats} 🍬) siap memandu web Nafis 👑`;
  }

  if (treats >= 10) {
    return page === "galeri"
      ? `Bestie Gulali (${treats} 🍬) hadir menemani kamu di arsip Galeri 🍭`
      : `Halo Bestie Gulali (${treats} 🍬)! Yuk lanjut eksplor web Nafis 🍭☁️`;
  }

  if (page === "galeri") {
    return "Selamat datang di Galeri lengkap Nafis! Pilih filter atau kasih apresiasi ya 🎨";
  }

  const h = new Date().getHours();
  if (h >= 4 && h < 11) {
    return "Selamat pagi! Aku Sifan, asisten awan di tepi kananmu ☁️";
  }
  if (h >= 11 && h < 15) {
    return "Selamat siang! Aku Sifan, siap nemenin eksplor portofolio ☀️";
  }
  if (h >= 15 && h < 18) {
    return "Selamat sore! Ketuk aku kalau mau tur cepat web Nafis ⛅";
  }
  if (h >= 18 && h < 23) {
    return "Selamat malam! Yuk intip karya & dokumentasi terbaru Nafis 🌙";
  }
  return "Hai! Masih melek tengah malam? Sifan temenin eksplor ya 🦉";
};

export const buildTourReply = (
  topic: SifanTourTopic,
  context: SifanContext,
): Reaction => {
  if (topic === "featured") {
    const sampleTitles = context.featuredTitles?.slice(0, 2) ?? [];
    const total = context.totalGalleryCount ?? sampleTitles.length;
    if (sampleTitles.length > 0) {
      return {
        text: `Di Galeri Pilihan ada "${sampleTitles.join('", "')}", dengan total ${total} arsip lengkap di /galeri! 🎨`,
        mood: "love",
        duration: 5000,
      };
    }
    return {
      text: "Yuk lihat perwakilan karya & dokumentasi kegiatan Nafis di Galeri! ✨",
      mood: "excited",
      duration: 4200,
    };
  }

  if (topic === "about") {
    const hlCount = context.highlightsCount ?? 0;
    const detail =
      hlCount > 0
        ? ` Ada ${hlCount} catatan Track Record pendidikan, prestasi & organisasi di sini!`
        : "";
    return {
      text: `Nafis menggabungkan insting riset Biologi dengan desain, web & AI.${detail} 🧬`,
      mood: "curious",
      duration: 5000,
    };
  }

  const firstService = context.servicesTitles?.[0];
  return {
    text: firstService
      ? `Salah satunya ada "${firstService}", klik kartunya kalau mau langsung kunjungi! 🚀`
      : "Kamu bisa lihat daftar produk dan layanan kolaborasi Nafis di sini! 💼",
    mood: "excited",
    duration: 4600,
  };
};
