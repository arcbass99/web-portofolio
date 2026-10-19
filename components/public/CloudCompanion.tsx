"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minimize2 } from "lucide-react";

type CloudMood =
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
  | "wheee";

type Reaction = { text: string | null; mood: CloudMood; duration?: number };

const CLICK_DIALOGUES: Reaction[] = [
  { text: "Halo! Aku Awan Kecil, penghuni setia web Nafis ☁️", mood: "happy" },
  { text: "Hehe geli tau diklik! Gerakin kursormu, mataku ngikutin lho 👀", mood: "wink" },
  { text: "Kamu bisa geser aku ke mana aja di layar 🎈", mood: "curious" },
  { text: "Jangan lupa intip Karya & Track Record Nafis ya! 🚀", mood: "love" },
  { text: "Coba klik dua kali deh, aku bisa salto! 🤸", mood: "excited" },
  { text: "Elus-elus aku pelan-pelan, aku suka 🥰", mood: "happy" },
  { text: "Fun fact: awan asli beratnya bisa ratusan ton. Aku sih ringan 😌", mood: "wink" },
  { text: "Nafis itu suka Biologi, web, AI, dan desain. Keren kan? 🧬", mood: "excited" },
  { text: "Kalau kursormu diam lama, aku ketiduran nih... 💤", mood: "sleepy" },
  { text: "Jangan diacak-acak ya, nanti aku pusing 😵‍💫", mood: "surprised" },
  { text: "Butuh website atau desain? Kontak Nafis di bawah! 📩", mood: "happy" },
  { text: "Aku lagi latihan jadi awan hujan. Belum bisa sih 🌧️", mood: "sad" },
];

const IDLE_ACTIONS: Reaction[] = [
  { text: "🎵 La la la~", mood: "happy", duration: 2600 },
  { text: "Hoaam~ 🥱", mood: "sleepy", duration: 2200 },
  { text: "Hmm, ada yang seru nggak ya? 🤔", mood: "curious", duration: 2800 },
  { text: null, mood: "wink", duration: 900 },
  { text: "Psst... scroll ke bawah, ada karya keren 👇", mood: "excited", duration: 3200 },
  { text: "Cuacanya cerah, cocok buat ngoding ☀️", mood: "happy", duration: 3000 },
];

const SECTION_COMMENTS: Record<string, Reaction> = {
  home: { text: "Selamat datang di ruang digital Nafis! 👋", mood: "happy" },
  "track-record": { text: "Wah, lagi lihat perjalanan & prestasi Nafis ya! 🎓", mood: "curious" },
  portfolio: { text: "Bagian favoritku! Klik kartunya buat detail 🎨", mood: "love" },
  services: { text: "Butuh solusi digital? Cek di sini ⚡", mood: "wink" },
};

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi! Aku Awan Kecil ☁️";
  if (h < 15) return "Selamat siang! Aku Awan Kecil ☁️";
  if (h < 19) return "Selamat sore! Aku Awan Kecil ☁️";
  return "Malam-malam masih mampir? Halo! 🌙";
};

const pick = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)] as T;

// Spiral path for dizzy eyes
const spiral = (cx: number, cy: number) =>
  `M ${cx - 0.5} ${cy} a 0.5 0.5 0 1 1 1 0 a 1.5 1.5 0 1 1 -3 0 a 2.5 2.5 0 1 1 5 0 a 3.5 3.5 0 1 1 -7 0`;

// Heart path for love eyes
const heart = (cx: number, cy: number) =>
  `M ${cx} ${cy + 3.8} C ${cx - 5.5} ${cy}, ${cx - 4.2} ${cy - 5}, ${cx} ${cy - 1.8} C ${cx + 4.2} ${cy - 5}, ${cx + 5.5} ${cy}, ${cx} ${cy + 3.8} Z`;

const EYE_L = { x: 46.5, y: 45.5 };
const EYE_R = { x: 75.5, y: 45.5 };
const INK = "#1E293B";

export function CloudCompanion() {
  const cloudRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mood, setMood] = useState<CloudMood>("normal");
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [faceOffset, setFaceOffset] = useState({ x: 0, y: 0 });
  const [isClose, setIsClose] = useState(false);
  const [spinCount, setSpinCount] = useState(0);

  // Refs used inside global listeners (avoid stale closures)
  const moodRef = useRef<CloudMood>("normal");
  const lockedRef = useRef(false);
  const hoveredRef = useRef(false);
  const minimizedRef = useRef(false);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMouse = useRef({ x: 0, y: 0, time: 0 });
  const shake = useRef({ dxSign: 0, dySign: 0, reversals: [] as number[] });
  const clickTimes = useRef<number[]>([]);
  const hoverStart = useRef(0);
  const pettedThisHover = useRef(false);
  const justDragged = useRef(false);
  const lastSection = useRef("home");
  const cursorLeftWindow = useRef(false);
  const throttle = useRef<Record<string, number>>({});
  const lastScroll = useRef({ y: 0, time: 0 });

  const applyMood = useCallback((m: CloudMood) => {
    moodRef.current = m;
    setMood(m);
  }, []);

  const canFire = (key: string, cooldown: number) => {
    const now = Date.now();
    if (now - (throttle.current[key] ?? 0) < cooldown) return false;
    throttle.current[key] = now;
    return true;
  };

  /** Play a locked reaction (mood + optional speech), then return to normal. */
  const react = useCallback(
    (r: Reaction, next?: Reaction) => {
      if (reactionTimer.current) clearTimeout(reactionTimer.current);
      lockedRef.current = true;
      applyMood(r.mood);
      setSpeech(r.text);

      reactionTimer.current = setTimeout(() => {
        lockedRef.current = false;
        setSpeech(null);
        applyMood(hoveredRef.current ? "happy" : "normal");
        if (next) react(next);
      }, r.duration ?? 3800);
    },
    [applyMood],
  );

  useEffect(() => {
    hoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    minimizedRef.current = isMinimized;
  }, [isMinimized]);

  // Mount + time-based greeting
  useEffect(() => {
    setMounted(true);
    const t = setTimeout(
      () => react({ text: getGreeting(), mood: "happy", duration: 4200 }),
      900,
    );
    return () => {
      clearTimeout(t);
      if (reactionTimer.current) clearTimeout(reactionTimer.current);
    };
  }, [react]);

  // Natural blinking
  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => {
      if (moodRef.current === "normal" || moodRef.current === "curious") {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 140);
      }
    }, 3400);
    return () => clearInterval(id);
  }, [mounted]);

  // Random idle behaviour
  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => {
      if (
        minimizedRef.current ||
        lockedRef.current ||
        hoveredRef.current ||
        moodRef.current === "sleepy" ||
        document.hidden
      )
        return;
      if (Math.random() < 0.55) react(pick(IDLE_ACTIONS));
    }, 15000);
    return () => clearInterval(id);
  }, [mounted, react]);

  // Global cursor tracking: eyes, proximity, whip, shake → dizzy, sleep
  useEffect(() => {
    if (!mounted) return;

    const resetIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (!lockedRef.current && !hoveredRef.current) {
          applyMood("sleepy");
          setSpeech(null);
          setEyeOffset({ x: 0, y: 1.5 });
          setFaceOffset({ x: 0, y: 2 });
        }
      }, 12000);
    };

    const onMove = (e: MouseEvent) => {
      if (minimizedRef.current) return;
      const now = performance.now();
      const dt = now - lastMouse.current.time;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      const speed = dt > 0 ? Math.hypot(dx, dy) / dt : 0;
      lastMouse.current = { x: e.clientX, y: e.clientY, time: now };

      // Wake up
      if (moodRef.current === "sleepy" && !lockedRef.current) {
        react({ text: "Eh! Aku nggak tidur kok 😳", mood: "surprised", duration: 2000 });
      }
      resetIdle();

      if (!cloudRef.current) return;
      const rect = cloudRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.bottom - 40;
      const ddx = e.clientX - cx;
      const ddy = e.clientY - cy;
      const dist = Math.hypot(ddx, ddy);
      setIsClose(dist < 180);

      if (moodRef.current !== "dizzy") {
        const angle = Math.atan2(ddy, ddx);
        const p = Math.min(dist / 22, 5.5);
        const f = Math.min(dist / 38, 4.2);
        setEyeOffset({ x: Math.cos(angle) * p, y: Math.sin(angle) * p });
        setFaceOffset({ x: Math.cos(angle) * f, y: Math.sin(angle) * f });
      }

      // Shake detection: rapid direction reversals over the cloud → dizzy
      if (dist < 120) {
        const s = shake.current;
        if (Math.abs(dx) > 3) {
          const sign = Math.sign(dx);
          if (s.dxSign !== 0 && sign !== s.dxSign) s.reversals.push(now);
          s.dxSign = sign;
        }
        if (Math.abs(dy) > 3) {
          const sign = Math.sign(dy);
          if (s.dySign !== 0 && sign !== s.dySign) s.reversals.push(now);
          s.dySign = sign;
        }
        s.reversals = s.reversals.filter((t) => now - t < 1400);

        if (s.reversals.length >= 6 && moodRef.current !== "dizzy") {
          s.reversals = [];
          react(
            {
              text: pick([
                "Pusiiing... dunia berputar~ 😵‍💫",
                "Waaa jangan diacak-acak! 🌀",
                "Kepalaku muter-muter kayak gasing 😵",
              ]),
              mood: "dizzy",
              duration: 3200,
            },
            { text: "Huft... jangan gitu lagi ya 😣", mood: "angry", duration: 2400 },
          );
          return;
        }
      }

      // Fast whip near the cloud
      if (speed > 4.2 && dist < 240 && !lockedRef.current && !hoveredRef.current) {
        if (canFire("whip", 5000)) {
          react({ text: "Wuih, ngebut banget kursornya! 💨", mood: "surprised", duration: 2400 });
          return;
        }
      }

      // Hovering a CTA somewhere on the page
      const target = e.target as HTMLElement | null;
      if (
        target?.closest?.(".btn-google-cta") &&
        !cloudRef.current.contains(target) &&
        !lockedRef.current &&
        canFire("cta", 14000)
      ) {
        react({ text: "Ayo klik, tombolnya keren lho! 😆", mood: "excited", duration: 2600 });
        return;
      }

      if (!lockedRef.current && !hoveredRef.current) {
        applyMood(dist < 170 ? "curious" : "normal");
      }
    };

    // Cursor leaves / returns to the window
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget && !minimizedRef.current) {
        cursorLeftWindow.current = true;
        if (canFire("leave", 8000)) {
          react({ text: "Eh, mau ke mana? 🥺", mood: "sad", duration: 3000 });
        }
      }
    };
    const onOver = () => {
      if (cursorLeftWindow.current && !minimizedRef.current) {
        cursorLeftWindow.current = false;
        if (canFire("return", 8000)) {
          react({ text: "Yay, kamu balik lagi! 🤗", mood: "happy", duration: 2600 });
        }
      }
    };

    // Coming back to the tab
    const onVisibility = () => {
      if (!document.hidden && !minimizedRef.current && canFire("tab", 20000)) {
        react({ text: "Selamat datang kembali! Aku nungguin lho 👋", mood: "love", duration: 3200 });
      }
    };

    // Text selection
    const onSelection = () => {
      const text = window.getSelection()?.toString().trim() ?? "";
      if (text.length > 3 && !minimizedRef.current && canFire("select", 12000)) {
        react({ text: "Lagi nyimak bagian itu ya? 👀", mood: "curious", duration: 2600 });
      }
    };

    resetIdle();
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("selectionchange", onSelection);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("selectionchange", onSelection);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [mounted, react, applyMood]);

  // Scroll: section commentary + fast-scroll reaction
  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => {
      if (minimizedRef.current) return;
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastScroll.current.y);
      const dt = now - lastScroll.current.time;
      lastScroll.current = { y: window.scrollY, time: now };

      if (dt > 0 && dt < 100 && dy / dt > 3.5 && canFire("fastScroll", 7000)) {
        react({ text: "Woaa, pelan-pelan scroll-nya! 🎢", mood: "wheee", duration: 2200 });
        return;
      }

      const mid = window.innerHeight * 0.45;
      for (const id of ["services", "portfolio", "track-record", "home"]) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          if (lastSection.current !== id) {
            lastSection.current = id;
            const c = SECTION_COMMENTS[id];
            if (c && !hoveredRef.current && moodRef.current !== "dizzy") {
              react({ ...c, duration: 3200 });
            }
          }
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted, react]);

  // Petting: long gentle hover → love
  useEffect(() => {
    if (!isHovered) return;
    hoverStart.current = Date.now();
    pettedThisHover.current = false;
    const id = setInterval(() => {
      if (
        !pettedThisHover.current &&
        Date.now() - hoverStart.current > 1800 &&
        moodRef.current !== "dizzy" &&
        moodRef.current !== "angry"
      ) {
        pettedThisHover.current = true;
        react({
          text: pick([
            "Hehe, enak dielus-elus 🥰",
            "Lagi dong elusnya~ 💕",
            "Aku jadi pengen bobo... nyaman 😊",
          ]),
          mood: "love",
          duration: 3000,
        });
      }
    }, 300);
    return () => clearInterval(id);
  }, [isHovered, react]);

  const handleClick = () => {
    if (justDragged.current) return;
    const now = Date.now();
    clickTimes.current = [...clickTimes.current.filter((t) => now - t < 1800), now];

    if (clickTimes.current.length >= 5) {
      clickTimes.current = [];
      react({
        text: pick(["Aduh! Jangan dipencet terus dong 😤", "Hmph! Aku ngambek nih 😠"]),
        mood: "angry",
        duration: 3000,
      });
      return;
    }
    react(pick(CLICK_DIALOGUES));
  };

  const handleDoubleClick = () => {
    if (justDragged.current) return;
    setSpinCount((c) => c + 1);
    react({ text: pick(["Wiii~ salto! 🤸", "Ta-da! Keren kan? 😎"]), mood: "wheee", duration: 2200 });
  };

  if (!mounted) return null;

  if (isMinimized) {
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={() => {
          setIsMinimized(false);
          react({ text: "Aku kembali! Kangen ya? ☁️", mood: "happy", duration: 3000 });
        }}
        className="fixed bottom-5 right-5 z-40 apple-liquid-glass flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium text-white shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        aria-label="Panggil Awan Kecil"
        title="Panggil Awan Kecil"
      >
        <span className="text-sm">☁️</span>
        <span className="font-body text-[11px] text-white/90">Awan Kecil</span>
      </motion.button>
    );
  }

  // Hover makes it happy unless a stronger locked reaction is playing
  const m: CloudMood =
    isHovered && (mood === "normal" || mood === "curious") ? "happy" : mood;
  const glowing = isClose || isHovered;
  const blush =
    m === "happy" || m === "love" || m === "excited" || m === "wheee" || m === "angry";

  const bodyAnimate =
    m === "dizzy"
      ? { y: 0, rotate: [0, -10, 10, -8, 8, 0], x: 0, scale: 1 }
      : m === "angry"
        ? { y: 0, rotate: 0, x: [0, -3, 3, -3, 3, 0], scale: 1 }
        : m === "excited" || m === "wheee"
          ? { y: [0, -10, 0], rotate: 0, x: 0, scale: 1.06 }
          : m === "sad"
            ? { y: 4, rotate: 0, x: 0, scale: 0.97 }
            : {
                y: [0, -5, 0],
                rotate: isHovered ? [0, -2, 2, 0] : 0,
                x: 0,
                scale: glowing ? 1.05 : 1,
              };

  const bodyTransition =
    m === "dizzy"
      ? { rotate: { duration: 0.9, repeat: Infinity, ease: "easeInOut" as const } }
      : m === "angry"
        ? { x: { duration: 0.4, repeat: Infinity } }
        : m === "excited" || m === "wheee"
          ? { y: { duration: 0.5, repeat: Infinity, ease: "easeOut" as const }, scale: { duration: 0.2 } }
          : {
              y: { duration: m === "sleepy" ? 4.5 : 3.2, repeat: Infinity, ease: "easeInOut" as const },
              rotate: { duration: 0.6, repeat: isHovered ? Infinity : 0 },
              scale: { duration: 0.25 },
            };

  const eyeT = `translate(${eyeOffset.x.toFixed(2)}, ${eyeOffset.y.toFixed(2)})`;

  const renderEyes = () => {
    if (m === "dizzy") {
      return [EYE_L, EYE_R].map((e, i) => (
        <path key={i} d={spiral(e.x, e.y)} stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`${i === 0 ? 0 : 360} ${e.x} ${e.y}`}
            to={`${i === 0 ? 360 : 0} ${e.x} ${e.y}`}
            dur="0.9s"
            repeatCount="indefinite"
          />
        </path>
      ));
    }
    if (isBlinking || m === "sleepy") {
      return (
        <>
          <path d="M42 46C44.5 48.5 48.5 48.5 51 46" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
          <path d="M71 46C73.5 48.5 77.5 48.5 80 46" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
        </>
      );
    }
    if (m === "love") {
      return (
        <>
          <path d={heart(EYE_L.x, EYE_L.y)} fill="#E11D48" />
          <path d={heart(EYE_R.x, EYE_R.y)} fill="#E11D48" />
        </>
      );
    }
    if (m === "happy" || m === "excited") {
      return (
        <>
          <path d="M41 47C43.5 42.5 48.5 42.5 51 47" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
          <path d="M71 47C73.5 42.5 78.5 42.5 81 47" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
        </>
      );
    }
    if (m === "wink") {
      return (
        <>
          <path d="M41 46.5C44 43 48.5 43 51 46.5" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
          <g transform={eyeT}>
            <circle cx={EYE_R.x} cy={EYE_R.y} r="4.8" fill="#0F172A" />
            <circle cx={EYE_R.x + 1.7} cy={EYE_R.y - 1.7} r="1.7" fill="white" />
          </g>
        </>
      );
    }
    if (m === "wheee") {
      return (
        <>
          <path d="M42 43L50 46.5L42 50" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M80 43L72 46.5L80 50" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      );
    }
    const r = m === "surprised" ? 5.6 : m === "curious" ? 5.1 : 4.5;
    return (
      <>
        {m === "angry" && (
          <>
            <path d="M40 37.5L51 40.5" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M82 37.5L71 40.5" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          </>
        )}
        {m === "sad" && (
          <>
            <path d="M41 40.5L51 37.5" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M81 40.5L71 37.5" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}
        <g transform={eyeT}>
          {[EYE_L, EYE_R].map((e, i) => (
            <g key={i}>
              <circle cx={e.x} cy={e.y} r={r} fill="#0F172A" />
              <circle cx={e.x + 1.6} cy={e.y - 1.8} r={m === "surprised" ? 2 : 1.7} fill="white" />
              {m === "surprised" && <circle cx={e.x - 1.5} cy={e.y + 2} r="1" fill="white" />}
            </g>
          ))}
        </g>
        {m === "sad" && (
          <path d="M52 50C52 50 50.2 53 50.2 54.2C50.2 55.2 51 56 52 56C53 56 53.8 55.2 53.8 54.2C53.8 53 52 50 52 50Z" fill="#60A5FA" />
        )}
      </>
    );
  };

  const renderMouth = () => {
    switch (m) {
      case "surprised":
        return <ellipse cx="61" cy="55.5" rx="3.2" ry="4" fill={INK} />;
      case "sleepy":
        return <circle cx="61" cy="55" r="2.2" fill="#64748B" />;
      case "dizzy":
        return (
          <path d="M54 55.5Q56.5 52.5 59 55.5T64 55.5T69 55.5" stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        );
      case "angry":
        return <path d="M56.5 57C58.5 54.5 63.5 54.5 65.5 57" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />;
      case "sad":
        return <path d="M56 57.5C58 54 64 54 66 57.5" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />;
      case "wheee":
      case "excited":
        return (
          <path d="M54 52C55.5 60 66.5 60 68 52Z" fill="#E11D48" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        );
      case "happy":
      case "love":
        return (
          <path d="M55 52.5C56.8 57.5 65.2 57.5 67 52.5Z" fill="#E11D48" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        );
      case "curious":
        return <path d="M56.5 53.5C58.5 56.5 63.5 56.5 65.5 53.5" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />;
      default:
        return <path d="M57 53.5C58.8 55.8 63.2 55.8 65 53.5" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />;
    }
  };

  return (
    <motion.div
      ref={cloudRef}
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.08, cursor: "grabbing" }}
      onDragStart={() => {
        justDragged.current = true;
        react({ text: "Wiii~ aku terbang! 🎈", mood: "wheee", duration: 60000 });
      }}
      onDragEnd={() => {
        react({
          text: pick(["Tempat baru, asik! 🏡", "Mendarat dengan selamat ✅", "Pemandangannya bagus di sini 😌"]),
          mood: "happy",
          duration: 2600,
        });
        setTimeout(() => {
          justDragged.current = false;
        }, 200);
      }}
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 select-none touch-none"
    >
      <div className="relative flex flex-col items-end">
        {/* Speech Bubble */}
        <AnimatePresence mode="wait">
          {speech && (
            <motion.div
              key={speech}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.92 }}
              transition={{ duration: 0.22 }}
              className="mb-2.5 max-w-[220px] rounded-2xl border border-white/15 bg-[#141619]/95 px-3.5 py-2 text-left shadow-[0_12px_30px_rgba(0,0,0,0.75)] backdrop-blur-xl relative"
            >
              <p className="text-[11px] font-body font-medium leading-snug text-white/90">{speech}</p>
              <div className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 border-b border-r border-white/15 bg-[#141619]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sleeping Zzz */}
        <AnimatePresence>
          {m === "sleepy" && !speech && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute -top-5 right-3"
            >
              <motion.span
                animate={{ y: [-2, -16], x: [0, 6], opacity: [0, 0.9, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                className="block text-[11px] font-heading font-bold text-blue-300"
              >
                Zzz
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="group relative flex items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            aria-label="Sembunyikan Awan Kecil ke pojok"
            title="Sembunyikan sementara"
            className="absolute -top-1.5 -right-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-[#141619] text-white/60 opacity-0 shadow-md transition-all hover:bg-white/20 hover:text-white group-hover:opacity-100 cursor-pointer"
          >
            <Minimize2 size={10} />
          </button>

          {/* Spin wrapper for double-click salto */}
          <motion.div
            animate={{ rotate: spinCount * 360 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <motion.button
              type="button"
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              aria-label="Berinteraksi dengan Awan Kecil"
              animate={bodyAnimate}
              transition={bodyTransition}
              whileTap={{ scale: 0.9 }}
              className="relative h-[68px] w-[88px] sm:h-[76px] sm:w-[98px] cursor-grab active:cursor-grabbing focus:outline-none"
            >
              {/* Ambient halo */}
              <div
                className={`absolute inset-2 rounded-full blur-xl transition-opacity duration-500 ${
                  m === "angry"
                    ? "bg-rose-500/40 opacity-90"
                    : m === "dizzy"
                      ? "bg-violet-400/45 opacity-90"
                      : glowing
                        ? "bg-gradient-to-r from-blue-400/45 via-violet-400/40 to-emerald-400/40 opacity-95"
                        : "bg-blue-400/20 opacity-60"
                }`}
              />

              <svg
                viewBox="0 0 120 92"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 h-full w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.55)]"
              >
                <defs>
                  <linearGradient id="cloudBodyGrad" x1="20" y1="12" x2="100" y2="82" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="65%" stopColor="#F1F6FF" />
                    <stop offset="100%" stopColor="#DCE8FF" />
                  </linearGradient>
                  <linearGradient id="cloudRimGrad" x1="0" y1="0" x2="120" y2="92" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                <path
                  d="M34 76H88C101.255 76 112 65.2548 112 52C112 40.312 103.649 30.5775 92.5647 28.4368C88.7866 15.4904 76.8267 6 62.6 6C46.5015 6 33.2571 18.1835 31.5473 33.8299C19.5037 35.1078 10 45.3007 10 57.7C10 67.8068 18.1932 76 28.3 76H34Z"
                  fill="url(#cloudBodyGrad)"
                  stroke="url(#cloudRimGrad)"
                  strokeWidth="2.2"
                />
                <path d="M42 24C47 15 56 11 66 12" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.85" />

                <g transform={m === "dizzy" ? undefined : `translate(${faceOffset.x.toFixed(2)}, ${faceOffset.y.toFixed(2)})`}>
                  {/* Cheeks */}
                  <ellipse cx="39" cy="54" rx={blush ? 6.2 : 4.8} ry="3.2" fill="#FB7185" opacity={m === "angry" ? 0.8 : blush ? 0.65 : m === "sad" ? 0.15 : 0.35} />
                  <ellipse cx="83" cy="54" rx={blush ? 6.2 : 4.8} ry="3.2" fill="#FB7185" opacity={m === "angry" ? 0.8 : blush ? 0.65 : m === "sad" ? 0.15 : 0.35} />
                  {renderEyes()}
                  {renderMouth()}
                </g>
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
