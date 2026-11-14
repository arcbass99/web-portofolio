"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { animate, motion, AnimatePresence, useMotionValue } from "framer-motion";
import { X, CornerDownRight, RotateCcw } from "lucide-react";

const emptySubscribe = () => () => {};
import { smoothScrollTo, smoothScrollToId } from "../../lib/smoothScroll";
import {
  getSessionTotalUserClaps,
  trackOncePerSession,
  type SifanReactDetail,
} from "../../lib/metrics-client";
import type { GalleryMediaFilter } from "../../lib/gallery";
import {
  EYE_L,
  EYE_R,
  INK,
  SIFAN_ANGRY_LINES,
  SIFAN_CLICK_DIALOGUES,
  SIFAN_DIZZY_LINES,
  SIFAN_IDLE_ACTIONS,
  SIFAN_LANDING_LINES,
  SIFAN_PETTING_LINES,
  SIFAN_WAKEUP_LINES,
  SECTION_COMMENTS,
  buildSurpriseReply,
  buildTourReply,
  buildTreatReaction,
  getCandyProgressPercent,
  getCandyTier,
  getGreeting,
  heart,
  pick,
  spiral,
  type CloudMood,
  type Reaction,
  type SifanContext,
  type SifanTourTopic,
} from "./sifanData";

const TREAT_STORAGE_KEY = "imnafis_sifan_treats_v1";

const subscribeTreats = (callback: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === TREAT_STORAGE_KEY || event.key === null) callback();
  };
  window.addEventListener("sifan:treats-sync", callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("sifan:treats-sync", callback);
    window.removeEventListener("storage", onStorage);
  };
};

const getStoredTreats = (): number => {
  if (typeof window === "undefined") return 0;
  try {
    const val = Number(window.localStorage.getItem(TREAT_STORAGE_KEY) ?? 0);
    return Number.isFinite(val) && val > 0 ? Math.floor(val) : 0;
  } catch {
    return 0;
  }
};

const incrementStoredTreats = (): number => {
  const next = getStoredTreats() + 1;
  try {
    window.localStorage.setItem(TREAT_STORAGE_KEY, String(next));
    window.dispatchEvent(new Event("sifan:treats-sync"));
  } catch {
    // Ignore storage restrictions
  }
  return next;
};

const resetStoredTreats = () => {
  try {
    window.localStorage.removeItem(TREAT_STORAGE_KEY);
    window.dispatchEvent(new Event("sifan:treats-sync"));
  } catch {
    // Ignore storage restrictions
  }
};

const SECTION_LABELS: Record<string, string> = {
  home: "Beranda",
  "track-record": "Perjalanan",
  galeri: "Galeri",
  services: "Layanan",
  contact: "Kontak",
};

type CloudCompanionProps = {
  context?: SifanContext;
};

type Particle = {
  id: number;
  kind: "heart" | "sparkle" | "star" | "candy";
  x: number;
  delay: number;
};

export function CloudCompanion({
  context = { page: "home" },
}: CloudCompanionProps) {
  const router = useRouter();
  const cloudRef = useRef<HTMLDivElement>(null);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const treatCount = useSyncExternalStore(
    subscribeTreats,
    getStoredTreats,
    () => 0,
  );
  const [mood, setMood] = useState<CloudMood>("normal");
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isDraggedAway, setIsDraggedAway] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [faceOffset, setFaceOffset] = useState({ x: 0, y: 0 });
  const [isClose, setIsClose] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activeSectionLabel, setActiveSectionLabel] = useState(
    context.page === "galeri" ? "Arsip Galeri" : "Beranda",
  );

  const moodRef = useRef<CloudMood>("normal");
  const lockedRef = useRef(false);
  const hoveredRef = useRef(false);
  const tourOpenRef = useRef(false);
  const speechRef = useRef<string | null>(null);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particleSeq = useRef(0);
  const interactionCountRef = useRef(0);

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

  const updateSpeech = useCallback((next: string | null) => {
    speechRef.current = next;
    setSpeech(next);
  }, []);

  const spawnParticles = useCallback(
    (kind: Particle["kind"] | Particle["kind"][], count = 3) => {
      const kinds = Array.isArray(kind) ? kind : [kind];
      const batch: Particle[] = Array.from({ length: count }, (_, idx) => ({
        id: ++particleSeq.current,
        kind: kinds[idx % kinds.length],
        x: (idx - (count - 1) / 2) * 16 + (Math.random() * 6 - 3),
        delay: idx * 0.06,
      }));
      setParticles((prev) => [...prev.slice(-10), ...batch]);
      setTimeout(() => {
        const ids = new Set(batch.map((p) => p.id));
        setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
      }, 1300);
    },
    [],
  );

  const canFire = (key: string, cooldown: number) => {
    const now = Date.now();
    if (now - (throttle.current[key] ?? 0) < cooldown) return false;
    throttle.current[key] = now;
    return true;
  };

  /** Plays a locked reaction (mood + optional speech), then returns cleanly. */
  const react = useCallback(
    (r: Reaction, next?: Reaction) => {
      const play = (current: Reaction, queued?: Reaction) => {
        if (reactionTimer.current) clearTimeout(reactionTimer.current);
        lockedRef.current = true;
        applyMood(current.mood);
        updateSpeech(current.text);

        if (current.mood === "love") spawnParticles("heart", 3);
        else if (
          current.mood === "wheee" ||
          current.mood === "excited" ||
          current.mood === "cool"
        )
          spawnParticles("sparkle", 3);
        else if (current.mood === "dizzy") spawnParticles("star", 2);

        reactionTimer.current = setTimeout(() => {
          lockedRef.current = false;
          if (!tourOpenRef.current) {
            updateSpeech(null);
          }
          applyMood(hoveredRef.current ? "happy" : "normal");
          if (queued) play(queued);
        }, current.duration ?? 3800);
      };

      play(r, next);
    },
    [applyMood, spawnParticles, updateSpeech],
  );

  useEffect(() => {
    hoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    tourOpenRef.current = isTourOpen;
  }, [isTourOpen]);

  // Mount contextual time-based greeting
  useEffect(() => {
    const t = setTimeout(
      () =>
        react({
          text: getGreeting(context.page, getStoredTreats()),
          mood: "happy",
          duration: 3800,
        }),
      900,
    );
    return () => {
      clearTimeout(t);
      if (reactionTimer.current) clearTimeout(reactionTimer.current);
    };
  }, [react, context.page]);

  // Close tour panel on Escape or outside pointer tap
  useEffect(() => {
    if (!isTourOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsTourOpen(false);
        updateSpeech(null);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        cloudRef.current &&
        !cloudRef.current.contains(event.target as Node)
      ) {
        setIsTourOpen(false);
        if (!lockedRef.current) {
          updateSpeech(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isTourOpen, updateSpeech]);

  // Listen to cross-component events (Claps, Service clicks, Gallery detail open)
  useEffect(() => {
    if (!mounted) return;

    const handleSifanEvent = (event: Event) => {
      const detail = (event as CustomEvent<SifanReactDetail>).detail;
      if (!detail) return;

      if (detail.kind === "clap") {
        if (!canFire("event_clap", 2600)) {
          spawnParticles("heart", 2);
          return;
        }
        const totalUserClaps = getSessionTotalUserClaps();
        const text =
          totalUserClaps >= 10 && canFire("milestone_clap", 30000)
            ? `Wah, kamu udah kasih ${totalUserClaps} apresiasi! Baik banget 🥰`
            : `Makasih udah apresiasi "${detail.label || "karya ini"}"! 💖`;

        react({ text, mood: "love", duration: 3000 });
        return;
      }

      if (detail.kind === "service" && canFire("event_service", 4000)) {
        react({
          text: `Mantap! Mengintip layanan "${detail.label || "Nafis"}" 🚀`,
          mood: "excited",
          duration: 3000,
        });
        return;
      }

      if (detail.kind === "modal_open" && canFire("event_modal", 12000)) {
        react({
          text: `Lagi lihat detail "${detail.label || "item galeri"}" ya? 👀`,
          mood: "curious",
          duration: 2600,
        });
        return;
      }

      if (detail.kind === "filter" && canFire("event_filter", 2800)) {
        react({
          text: `Menyaring galeri: ${detail.label || "pilihanmu"} 🔍`,
          mood: "curious",
          duration: 2200,
        });
      }
    };

    window.addEventListener("sifan:react", handleSifanEvent);
    return () => window.removeEventListener("sifan:react", handleSifanEvent);
  }, [mounted, react, spawnParticles]);

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

  // Random idle behaviour when user isn't hovering or in tour menu
  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => {
      if (
        lockedRef.current ||
        hoveredRef.current ||
        tourOpenRef.current ||
        moodRef.current === "sleepy" ||
        document.hidden
      ) {
        return;
      }
      if (Math.random() < 0.45) react(pick(SIFAN_IDLE_ACTIONS));
    }, 16000);
    return () => clearInterval(id);
  }, [mounted, react]);

  // Global cursor & touch tracking
  useEffect(() => {
    if (!mounted) return;

    let offsetRafId: number | null = null;
    let pendingPointer: {
      eyeX: number;
      eyeY: number;
      faceX: number;
      faceY: number;
      close: boolean;
    } | null = null;

    const flushOffsets = () => {
      offsetRafId = null;
      if (!pendingPointer) return;
      const next = pendingPointer;
      pendingPointer = null;
      setIsClose((prev) => (prev === next.close ? prev : next.close));
      setEyeOffset((prev) =>
        Math.abs(prev.x - next.eyeX) < 0.2 && Math.abs(prev.y - next.eyeY) < 0.2
          ? prev
          : { x: next.eyeX, y: next.eyeY },
      );
      setFaceOffset((prev) =>
        Math.abs(prev.x - next.faceX) < 0.2 &&
        Math.abs(prev.y - next.faceY) < 0.2
          ? prev
          : { x: next.faceX, y: next.faceY },
      );
    };

    const resetIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (!lockedRef.current && !hoveredRef.current && !tourOpenRef.current) {
          applyMood("sleepy");
          updateSpeech(null);
          setEyeOffset({ x: 0, y: 1.5 });
          setFaceOffset({ x: 0, y: 2 });
        }
      }, 13000);
    };

    const handlePointerLocation = (
      clientX: number,
      clientY: number,
      targetEl?: HTMLElement | null,
    ) => {
      const now = performance.now();
      const dt = now - lastMouse.current.time;
      const dx = clientX - lastMouse.current.x;
      const dy = clientY - lastMouse.current.y;
      const speed = dt > 0 ? Math.hypot(dx, dy) / dt : 0;
      lastMouse.current = { x: clientX, y: clientY, time: now };

      if (moodRef.current === "sleepy" && !lockedRef.current) {
        react({
          text: pick(SIFAN_WAKEUP_LINES),
          mood: "surprised",
          duration: 2400,
        });
      }
      resetIdle();

      if (!cloudRef.current) return;
      const rect = cloudRef.current.getBoundingClientRect();
      const cx = rect.right - 44;
      const cy = rect.bottom - 38;
      const ddx = clientX - cx;
      const ddy = clientY - cy;
      const dist = Math.hypot(ddx, ddy);

      if (moodRef.current !== "dizzy") {
        const angle = Math.atan2(ddy, ddx);
        const p = Math.min(dist / 22, 5.5);
        const f = Math.min(dist / 38, 4.2);
        pendingPointer = {
          eyeX: Math.cos(angle) * p,
          eyeY: Math.sin(angle) * p,
          faceX: Math.cos(angle) * f,
          faceY: Math.sin(angle) * f,
          close: dist < 115,
        };
        if (offsetRafId === null) {
          offsetRafId = window.requestAnimationFrame(flushOffsets);
        }
      } else {
        setIsClose((prev) => (prev === (dist < 115) ? prev : dist < 115));
      }

      // Shake detection over Sifan → dizzy
      if (dist < 110) {
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
              text: pick(SIFAN_DIZZY_LINES),
              mood: "dizzy",
              duration: 3200,
            },
            {
              text: "Huft... jangan gitu lagi ya, pusing tau 😣",
              mood: "angry",
              duration: 2200,
            },
          );
          return;
        }
      }

      // Fast whip near Sifan
      if (
        speed > 4.2 &&
        dist < 220 &&
        !lockedRef.current &&
        !hoveredRef.current
      ) {
        if (canFire("whip", 6000)) {
          react({
            text: pick([
              "Wuih, ngebut banget kursornya! 💨",
              "Awas rem blong! Kenceng banget 🚀",
            ]),
            mood: "surprised",
            duration: 2300,
          });
          return;
        }
      }

      // Hovering a Google CTA button
      if (
        targetEl?.closest?.(".btn-google-cta") &&
        !cloudRef.current.contains(targetEl) &&
        !lockedRef.current &&
        !tourOpenRef.current &&
        canFire("cta", 15000)
      ) {
        react({
          text: pick([
            "Ayo klik, tombolnya ada aura pelangi bergerak lho! 🌈",
            "Coba tekan tombolnya, gelombangnya muter lebih cepat! ✨",
          ]),
          mood: "excited",
          duration: 2600,
        });
        return;
      }

      if (!lockedRef.current && !hoveredRef.current) {
        applyMood(dist < 130 ? "curious" : "normal");
      }
    };

    const onMove = (e: MouseEvent) => {
      handlePointerLocation(e.clientX, e.clientY, e.target as HTMLElement | null);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerLocation(touch.clientX, touch.clientY);
      }
    };

    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget && !tourOpenRef.current) {
        cursorLeftWindow.current = true;
        if (canFire("leave", 10000)) {
          react({
            text: pick([
              "Eh, mau ke mana? Jangan pergi dulu 🥺",
              "Yah, kursornya keluar layar... ☁️",
            ]),
            mood: "sad",
            duration: 2600,
          });
        }
      }
    };

    const onOver = () => {
      if (cursorLeftWindow.current) {
        cursorLeftWindow.current = false;
        if (canFire("return", 10000) && !tourOpenRef.current) {
          react({
            text: pick([
              "Yay, kamu balik lagi! Sifan seneng 🤗",
              "Welcome back! Siap lanjut jelajah? ✨",
            ]),
            mood: "happy",
            duration: 2400,
          });
        }
      }
    };

    const onVisibility = () => {
      if (!document.hidden && canFire("tab", 25000)) {
        react({
          text: "Selamat datang kembali! Sifan nungguin lho 👋",
          mood: "love",
          duration: 3000,
        });
      }
    };

    const onCopy = () => {
      if (canFire("copy", 10000)) {
        react({
          text: pick([
            "Teks disalin! Mau disimpan ke mana tuh? 📋",
            "Copied! Jangan lupa dipelajari ya ilmunya ✨",
          ]),
          mood: "curious",
          duration: 2600,
        });
      }
    };

    resetIdle();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("copy", onCopy);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("copy", onCopy);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (offsetRafId !== null) window.cancelAnimationFrame(offsetRafId);
    };
  }, [mounted, react, applyMood, updateSpeech]);

  // Scroll commentary & fast-scroll reaction
  useEffect(() => {
    if (!mounted) return;

    const onScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const dy = Math.abs(currentScrollY - lastScroll.current.y);
      const dt = now - lastScroll.current.time;
      lastScroll.current = { y: currentScrollY, time: now };

      let fastScrolled = false;
      if (
        !tourOpenRef.current &&
        dt > 0 &&
        dt < 100 &&
        dy / dt > 3.5 &&
        canFire("fastScroll", 8000)
      ) {
        react({
          text: pick([
            "Woaa, pelan-pelan scroll-nya! 🎢",
            "Wusshhh! Meluncur kenceng banget 🚀",
          ]),
          mood: "wheee",
          duration: 2200,
        });
        fastScrolled = true;
      }

      if (context.page !== "home") return;

      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const mid = winHeight * 0.45;
      let matchedId: string | null = null;
      for (const id of [
        "contact",
        "services",
        "galeri",
        "track-record",
        "home",
      ]) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          matchedId = id;
          break;
        }
      }
      if (!matchedId && currentScrollY + winHeight >= docHeight - 120) {
        matchedId = "contact";
      }

      if (matchedId && lastSection.current !== matchedId) {
        lastSection.current = matchedId;
        setActiveSectionLabel(SECTION_LABELS[matchedId] || "Beranda");

        if (tourOpenRef.current || fastScrolled) return;

        if (
          matchedId === "contact" &&
          currentScrollY + winHeight >= docHeight - 80 &&
          canFire("reachBottom", 28000)
        ) {
          react({
            text: "Udah sampai paling bawah! Yuk kolaborasi bareng Nafis 👇",
            mood: "love",
            duration: 3200,
          });
          return;
        }

        const comments = SECTION_COMMENTS[matchedId];
        if (
          comments &&
          comments.length > 0 &&
          !hoveredRef.current &&
          moodRef.current !== "dizzy"
        ) {
          const pool =
            comments.length > 1
              ? comments.filter((c) => c.text !== speechRef.current)
              : comments;
          react({ ...pick(pool.length > 0 ? pool : comments), duration: 3000 });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted, react, context.page]);

  // Gentle hover petting → love
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
          text: pick(SIFAN_PETTING_LINES),
          mood: "love",
          duration: 3000,
        });
      }
    }, 300);
    return () => clearInterval(id);
  }, [isHovered, react]);

  const snapBackToRightEdge = () => {
    void animate(dragX, 0, { type: "spring", stiffness: 280, damping: 24 });
    void animate(dragY, 0, { type: "spring", stiffness: 280, damping: 24 });
    setIsDraggedAway(false);
    react({
      text: "Hap! Kembali bersandar rapi di tepi kanan ✨",
      mood: "happy",
      duration: 2400,
    });
  };

  const handleTourAction = (topic: SifanTourTopic) => {
    trackOncePerSession("sifan_tour", { type: "sifan_tour" });

    if (topic === "featured") {
      smoothScrollToId("galeri");
    } else if (topic === "about") {
      const targetEl = document.getElementById("track-record");
      if (targetEl) smoothScrollToId("track-record");
      else smoothScrollTo(0);
    } else if (topic === "services") {
      smoothScrollToId("services");
    }

    react(buildTourReply(topic, context));
  };

  const handleGalleryFilterChip = (filter: GalleryMediaFilter) => {
    trackOncePerSession("sifan_tour", { type: "sifan_tour" });
    window.dispatchEvent(
      new CustomEvent<GalleryMediaFilter>("sifan:galeri-filter", {
        detail: filter,
      }),
    );
    const label =
      filter === "image"
        ? "menampilkan Foto & Desain 🖼️"
        : filter === "video"
          ? "menampilkan Video 🎬"
          : "menampilkan Semua Galeri ✨";
    react({ text: `Sip, ${label}!`, mood: "happy", duration: 2400 });
  };

  const triggerSalto = () => {
    trackOncePerSession("sifan_tour", { type: "sifan_tour" });
    const isRoyal = getStoredTreats() >= 15;
    setSpinCount((c) => c + (isRoyal ? 2 : 1));
    react({
      text: isRoyal
        ? "Double salto Sultan Awan! 👑🤸✨"
        : pick([
            "Wiii~ salto 360 derajat! 🤸",
            "Ta-da! Akrobatik awan andalan Nafis 😎",
          ]),
      mood: "wheee",
      duration: 2400,
    });
    if (isRoyal) {
      spawnParticles(["candy", "star", "sparkle"], 6);
    }
  };

  const handleTreat = () => {
    trackOncePerSession("sifan_tour", { type: "sifan_tour" });
    const count = incrementStoredTreats();
    const { reaction, spinDelta, burstCount } = buildTreatReaction(count);
    if (spinDelta > 0) {
      setSpinCount((c) => c + spinDelta);
    }
    react(reaction);
    spawnParticles(
      count >= 15
        ? ["candy", "star", "heart"]
        : count >= 6
          ? ["candy", "heart"]
          : "candy",
      burstCount,
    );
  };

  const triggerCandyParty = () => {
    trackOncePerSession("sifan_tour", { type: "sifan_tour" });
    setSpinCount((c) => c + 2);
    react({
      text: pick([
        "Pesta Awan Sultan dimulai! Hujan gulali & bintang buat kamu 👑🍭✨",
        "Waktunya perayaan Raja Awan! Makasih udah mampir lama-lama 🎉🍬",
      ]),
      mood: "wheee",
      duration: 4600,
    });
    spawnParticles(["candy", "heart", "star", "sparkle"], 8);
  };

  const handleResetTreats = () => {
    resetStoredTreats();
    react({
      text: "Awanku kembali ke mode putih klasik! Siap kumpulin permen dari awal ☁️✨",
      mood: "happy",
      duration: 3200,
    });
  };

  const handleSurprise = () => {
    trackOncePerSession("sifan_tour", { type: "sifan_tour" });
    react(buildSurpriseReply(context));
  };

  const triggerCoolMode = () => {
    trackOncePerSession("sifan_tour", { type: "sifan_tour" });
    react({
      text: pick([
        "Sip, mode kacamata santai aktif! 😎☁️",
        "Santai dulu di tepi kanan sambil mantau web Nafis 😎✨",
      ]),
      mood: "cool",
      duration: 4500,
    });
  };

  const handleClick = () => {
    if (justDragged.current) return;

    if (clickDebounceTimer.current) clearTimeout(clickDebounceTimer.current);

    clickDebounceTimer.current = setTimeout(() => {
      const now = Date.now();
      clickTimes.current = [
        ...clickTimes.current.filter((t) => now - t < 1800),
        now,
      ];

      if (clickTimes.current.length >= 5) {
        clickTimes.current = [];
        setIsTourOpen(false);
        react({
          text: pick(SIFAN_ANGRY_LINES),
          mood: "angry",
          duration: 3000,
        });
        return;
      }

      interactionCountRef.current += 1;

      if (!isTourOpen) {
        setIsTourOpen(true);
        const prompt =
          interactionCountRef.current % 4 === 0
            ? pick(SIFAN_CLICK_DIALOGUES)
            : {
                text:
                  context.page === "galeri"
                    ? "Mau filter Galeri atau kembali ke Beranda? Pilih di bawah ya! 🧭"
                    : "Mau langsung ke mana nih? Pilih panduan cepat di bawah 👇",
                mood: "happy" as CloudMood,
                duration: 6500,
              };
        react(prompt);
        return;
      }

      react({ ...pick(SIFAN_CLICK_DIALOGUES), duration: 4200 });
    }, 220);
  };

  const handleDoubleClick = () => {
    if (justDragged.current) return;
    if (clickDebounceTimer.current) clearTimeout(clickDebounceTimer.current);
    triggerSalto();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    react({
      text: pick([
        "Ehh! Klik kiri aja ya, gak ada rahasia di balik awanku 🤫",
        "Mau intip resep awan empuk? Rahasia negara! ☁️",
      ]),
      mood: "surprised",
      duration: 2800,
    });
  };

  if (!mounted) return null;

  const m: CloudMood =
    isHovered && (mood === "normal" || mood === "curious") ? "happy" : mood;
  const glowing = isClose || isHovered || isTourOpen;
  const blush =
    m === "happy" ||
    m === "love" ||
    m === "excited" ||
    m === "wheee" ||
    m === "angry" ||
    m === "cool";
  const candyTier = getCandyTier(treatCount);
  const candyProgress = getCandyProgressPercent(treatCount, candyTier);
  const bodyGradId = candyTier.hasCottonCandyTint
    ? "cloudBodyGradCandy"
    : "cloudBodyGrad";
  const rimGradId = candyTier.hasCottonCandyTint
    ? "cloudRimGradCandy"
    : "cloudRimGrad";

  // Edge-docked right-edge peeking math: keeps both eyes & smile fully visible when idle,
  // while sliding cleanly left when active/speaking/hovered/tour open.
  const isActivated =
    isDraggedAway ||
    isHovered ||
    isTourOpen ||
    isClose ||
    Boolean(speech) ||
    m !== "normal";

  const dockSlideX = isDraggedAway ? 0 : isActivated ? -10 : 24;

  const bodyAnimate =
    m === "dizzy"
      ? { y: 0, rotate: [0, -10, 10, -8, 8, 0], x: 0, scale: 1 }
      : m === "angry"
        ? { y: 0, rotate: 0, x: [0, -3, 3, -3, 3, 0], scale: 1 }
        : m === "excited" || m === "wheee"
          ? { y: [0, -9, 0], rotate: 0, x: 0, scale: 1.06 }
          : m === "sad"
            ? { y: 4, rotate: 0, x: 0, scale: 0.97 }
            : {
                y: [0, -5, 0],
                rotate: isHovered ? [0, -2, 2, 0] : 0,
                x: 0,
                scale: glowing ? 1.04 : 1,
              };

  const bodyTransition =
    m === "dizzy"
      ? {
          rotate: {
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        }
      : m === "angry"
        ? { x: { duration: 0.4, repeat: Infinity } }
        : m === "excited" || m === "wheee"
          ? {
              y: { duration: 0.5, repeat: Infinity, ease: "easeOut" as const },
              scale: { duration: 0.2 },
            }
          : {
              y: {
                duration: m === "sleepy" ? 4.5 : 3.2,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
              rotate: { duration: 0.6, repeat: isHovered ? Infinity : 0 },
              scale: { duration: 0.25 },
            };

  const eyeT = `translate(${eyeOffset.x.toFixed(2)}, ${eyeOffset.y.toFixed(2)})`;

  const renderEyes = () => {
    if (m === "dizzy") {
      return [EYE_L, EYE_R].map((e, i) => (
        <path
          key={i}
          d={spiral(e.x, e.y)}
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        >
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
          <path
            d="M42 46C44.5 48.5 48.5 48.5 51 46"
            stroke={INK}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M71 46C73.5 48.5 77.5 48.5 80 46"
            stroke={INK}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
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
          <path
            d="M41 47C43.5 42.5 48.5 42.5 51 47"
            stroke={INK}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M71 47C73.5 42.5 78.5 42.5 81 47"
            stroke={INK}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </>
      );
    }
    if (m === "wink") {
      return (
        <>
          <path
            d="M41 46.5C44 43 48.5 43 51 46.5"
            stroke={INK}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <g transform={eyeT}>
            <circle cx={EYE_R.x} cy={EYE_R.y} r="4.8" fill="#0F172A" />
            <circle
              cx={EYE_R.x + 1.7}
              cy={EYE_R.y - 1.7}
              r="1.7"
              fill="white"
            />
          </g>
        </>
      );
    }
    if (m === "cool") {
      return (
        <g>
          {/* Bridge & frames */}
          <path
            d="M36 44.5H86"
            stroke="#0F172A"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <rect
            x="38"
            y="40.5"
            width="17"
            height="10.5"
            rx="4.2"
            fill="#0F172A"
          />
          <rect
            x="67"
            y="40.5"
            width="17"
            height="10.5"
            rx="4.2"
            fill="#0F172A"
          />
          {/* Crisp glare streaks on lenses */}
          <path
            d="M41.5 47.5L46 42.5"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M70.5 47.5L75 42.5"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      );
    }
    if (m === "wheee") {
      return (
        <>
          <path
            d="M42 43L50 46.5L42 50"
            stroke={INK}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M80 43L72 46.5L80 50"
            stroke={INK}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      );
    }
    const r = m === "surprised" ? 5.6 : m === "curious" ? 5.1 : 4.5;
    return (
      <>
        {m === "angry" && (
          <>
            <path
              d="M40 37.5L51 40.5"
              stroke={INK}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M82 37.5L71 40.5"
              stroke={INK}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </>
        )}
        {m === "sad" && (
          <>
            <path
              d="M41 40.5L51 37.5"
              stroke={INK}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M81 40.5L71 37.5"
              stroke={INK}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </>
        )}
        <g transform={eyeT}>
          {[EYE_L, EYE_R].map((e, i) => (
            <g key={i}>
              <circle cx={e.x} cy={e.y} r={r} fill="#0F172A" />
              <circle
                cx={e.x + 1.6}
                cy={e.y - 1.8}
                r={m === "surprised" ? 2 : 1.7}
                fill="white"
              />
              {m === "surprised" && (
                <circle cx={e.x - 1.5} cy={e.y + 2} r="1" fill="white" />
              )}
            </g>
          ))}
        </g>
        {m === "sad" && (
          <path
            d="M52 50C52 50 50.2 53 50.2 54.2C50.2 55.2 51 56 52 56C53 56 53.8 55.2 53.8 54.2C53.8 53 52 50 52 50Z"
            fill="#60A5FA"
          />
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
          <path
            d="M54 55.5Q56.5 52.5 59 55.5T64 55.5T69 55.5"
            stroke={INK}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        );
      case "angry":
        return (
          <path
            d="M56.5 57C58.5 54.5 63.5 54.5 65.5 57"
            stroke={INK}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        );
      case "sad":
        return (
          <path
            d="M56 57.5C58 54 64 54 66 57.5"
            stroke={INK}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        );
      case "wheee":
      case "excited":
        return (
          <path
            d="M54 52C55.5 60 66.5 60 68 52Z"
            fill="#E11D48"
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        );
      case "happy":
      case "love":
        return (
          <path
            d="M55 52.5C56.8 57.5 65.2 57.5 67 52.5Z"
            fill="#E11D48"
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        );
      case "cool":
        return (
          <path
            d="M56.5 54.5C59 56.8 64.2 56.2 66.5 53.2"
            stroke={INK}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        );
      case "curious":
        return (
          <path
            d="M56.5 53.5C58.5 56.5 63.5 56.5 65.5 53.5"
            stroke={INK}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      default:
        return (
          <path
            d="M57 53.5C58.8 55.8 63.2 55.8 65 53.5"
            stroke={INK}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        );
    }
  };

  return (
    <motion.div
      ref={cloudRef}
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.07, cursor: "grabbing" }}
      onDragStart={() => {
        justDragged.current = true;
        react({
          text: "Wiii~ Sifan terbang! 🎈",
          mood: "wheee",
          duration: 60000,
        });
      }}
      onDragEnd={() => {
        const movedDist = Math.hypot(dragX.get(), dragY.get());
        setIsDraggedAway(movedDist > 28);
        react({
          text: pick(SIFAN_LANDING_LINES),
          mood: "happy",
          duration: 2800,
        });
        setTimeout(() => {
          justDragged.current = false;
        }, 220);
      }}
      initial={{ opacity: 0, scale: 0.7, x: 40 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        position: "fixed",
        bottom: "max(1rem, env(safe-area-inset-bottom, 1rem))",
        right: 0,
        x: dragX,
        y: dragY,
      }}
      className="z-40 select-none touch-none"
    >
      <div className="relative flex flex-col items-end">
        {/* Speech & Quick Tour Bubble (opens cleanly leftward so never clips off-screen) */}
        <AnimatePresence>
          {(speech || isTourOpen) && (
            <motion.div
              key="sifan-bubble"
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.92 }}
              transition={{ duration: 0.18 }}
              className="mr-3 mb-2.5 w-max max-w-[min(272px,calc(100vw-24px))] rounded-2xl border border-white/15 bg-[#141619]/95 px-3.5 py-2.5 text-left shadow-[0_14px_34px_rgba(0,0,0,0.8)] backdrop-blur-xl relative break-words"
            >
              {isTourOpen && (
                <div className="mb-1.5 border-b border-white/10 pb-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-blue-300 truncate">
                        ☁️ Sifan · {activeSectionLabel}
                      </span>
                      {treatCount > 0 && (
                        <span
                          title={`${treatCount} permen (Lv.${candyTier.level} ${candyTier.label})`}
                          className={`rounded-full border px-1.5 py-0.2 text-[9px] font-body font-medium shrink-0 ${candyTier.badgeClass}`}
                        >
                          🍬 {treatCount} · Lv.{candyTier.level}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {treatCount >= 10 && (
                        <button
                          type="button"
                          onClick={handleResetTreats}
                          title="Kembalikan Sifan ke awan putih klasik"
                          aria-label="Reset evolusi permen Sifan"
                          className="rounded-full p-0.5 text-white/45 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <RotateCcw size={11} />
                        </button>
                      )}
                      {isDraggedAway && (
                        <button
                          type="button"
                          onClick={snapBackToRightEdge}
                          title="Kembalikan Sifan ke tepi kanan"
                          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-body text-white/80 hover:bg-white/15 transition-colors cursor-pointer"
                        >
                          <CornerDownRight size={10} />
                          <span>Rata kanan</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setIsTourOpen(false);
                          updateSpeech(null);
                        }}
                        aria-label="Tutup panel panduan Sifan"
                        className="rounded-full p-0.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                  {treatCount > 0 && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-body text-white/60">
                        <span>
                          {candyTier.nextMilestone !== null
                            ? `Evolusi Lv.${candyTier.level} ${candyTier.label} (${treatCount}/${candyTier.nextMilestone})`
                            : `Max Evolusi: Lv.5 ${candyTier.label}`}
                        </span>
                        <span>{candyProgress}%</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${candyTier.barClass}`}
                          style={{ width: `${candyProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {speech && (
                <p className="text-[11px] font-body font-medium leading-snug text-white/90">
                  {speech}
                </p>
              )}

              {isTourOpen && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {context.page === "home" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleTourAction("featured")}
                        className="rounded-full border border-blue-400/25 bg-blue-500/15 px-2.5 py-1 text-[10px] font-body font-medium text-blue-200 hover:bg-blue-500/25 transition-colors cursor-pointer"
                      >
                        ✨ Galeri Pilihan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTourAction("about")}
                        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-body font-medium text-white/85 hover:bg-white/15 transition-colors cursor-pointer"
                      >
                        🧬 Tentang Nafis
                      </button>
                      {(context.servicesTitles?.length ?? 0) > 0 && (
                        <button
                          type="button"
                          onClick={() => handleTourAction("services")}
                          className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-body font-medium text-white/85 hover:bg-white/15 transition-colors cursor-pointer"
                        >
                          💼 Layanan
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          trackOncePerSession("sifan_tour", {
                            type: "sifan_tour",
                          });
                          router.push("/galeri");
                        }}
                        className="rounded-full border border-violet-400/25 bg-violet-500/15 px-2.5 py-1 text-[10px] font-body font-medium text-violet-200 hover:bg-violet-500/25 transition-colors cursor-pointer"
                      >
                        📂 Semua Galeri
                      </button>
                      <button
                        type="button"
                        onClick={handleSurprise}
                        className="rounded-full border border-amber-400/25 bg-amber-500/15 px-2.5 py-1 text-[10px] font-body font-medium text-amber-200 hover:bg-amber-500/25 transition-colors cursor-pointer"
                      >
                        🎲 Kejutan
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleGalleryFilterChip("image")}
                        className="rounded-full border border-blue-400/25 bg-blue-500/15 px-2.5 py-1 text-[10px] font-body font-medium text-blue-200 hover:bg-blue-500/25 transition-colors cursor-pointer"
                      >
                        🖼️ Foto &amp; Desain
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGalleryFilterChip("video")}
                        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-body font-medium text-white/85 hover:bg-white/15 transition-colors cursor-pointer"
                      >
                        🎬 Video
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGalleryFilterChip("all")}
                        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-body font-medium text-white/85 hover:bg-white/15 transition-colors cursor-pointer"
                      >
                        Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="rounded-full border border-violet-400/25 bg-violet-500/15 px-2.5 py-1 text-[10px] font-body font-medium text-violet-200 hover:bg-violet-500/25 transition-colors cursor-pointer"
                      >
                        🏠 Beranda
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handleTreat}
                    title={
                      candyTier.nextMilestone !== null
                        ? `Berikan permen (${treatCount}/${candyTier.nextMilestone})`
                        : `Permen Sultan (${treatCount})`
                    }
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-body font-medium transition-colors cursor-pointer ${candyTier.badgeClass} hover:brightness-110`}
                  >
                    {candyTier.hasCottonCandyTint ? "🍭 Gulali" : "🍬 Permen"}
                  </button>
                  {candyTier.hasCrown && (
                    <button
                      type="button"
                      onClick={triggerCandyParty}
                      className="rounded-full border border-amber-300/35 bg-amber-400/20 px-2.5 py-1 text-[10px] font-body font-medium text-amber-100 hover:bg-amber-400/30 transition-colors cursor-pointer"
                    >
                      👑 Pesta Awan
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={triggerSalto}
                    className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-body font-medium text-white/85 hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    🤸 Salto!
                  </button>
                  <button
                    type="button"
                    onClick={triggerCoolMode}
                    className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-body font-medium text-white/85 hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    😎 Keren
                  </button>
                </div>
              )}

              <div className="pointer-events-none absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 border-b border-r border-white/15 bg-[#141619]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edge-peeking slide wrapper */}
        <motion.div
          animate={{ x: dockSlideX }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="relative"
        >
          {/* Floating SVG Particle Bursts */}
          <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 z-30">
            <AnimatePresence>
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 0.95, y: 0, x: p.x, scale: 0.6 }}
                  animate={{ opacity: 0, y: -32, x: p.x * 1.4, scale: 1.15 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.05,
                    delay: p.delay,
                    ease: "easeOut",
                  }}
                  className="absolute text-xs font-bold drop-shadow"
                >
                  {p.kind === "candy" ? (
                    <span>{p.id % 2 === 0 ? "🍬" : "🍭"}</span>
                  ) : p.kind === "heart" ? (
                    <span className="text-rose-400">♥</span>
                  ) : p.kind === "star" ? (
                    <span className="text-violet-300">✦</span>
                  ) : (
                    <span className="text-amber-300">✨</span>
                  )}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          {/* Sleeping Zzz */}
          <AnimatePresence>
            {m === "sleepy" && !speech && !isTourOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute -top-4 left-4"
              >
                <motion.span
                  animate={{ y: [-2, -14], x: [0, -5], opacity: [0, 0.9, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
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
            <motion.div
              animate={{ rotate: spinCount * 360 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <motion.button
                type="button"
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onContextMenu={handleContextMenu}
                aria-label="Berinteraksi dan buka pemandu tur Sifan"
                animate={bodyAnimate}
                transition={bodyTransition}
                whileTap={{ scale: 0.9 }}
                className="relative h-[68px] w-[88px] sm:h-[76px] sm:w-[98px] cursor-grab active:cursor-grabbing focus:outline-none"
              >
                {/* Mood-reactive ambient halo */}
                <div
                  className={`absolute inset-2 rounded-full blur-xl transition-opacity duration-500 ${
                    m === "angry"
                      ? "bg-rose-500/45 opacity-95"
                      : m === "dizzy"
                        ? "bg-violet-400/45 opacity-95"
                        : m === "love"
                          ? "bg-pink-400/45 opacity-95"
                          : candyTier.hasCrown
                            ? "bg-gradient-to-r from-amber-400/50 via-pink-400/40 to-violet-400/40 opacity-95"
                            : candyTier.hasCottonCandyTint
                              ? "bg-gradient-to-r from-pink-400/40 via-fuchsia-400/35 to-blue-400/35 opacity-85"
                              : glowing
                                ? "bg-gradient-to-r from-blue-400/45 via-violet-400/40 to-emerald-400/40 opacity-95"
                                : "bg-blue-400/20 opacity-55"
                  }`}
                />

                <svg
                  viewBox="0 -8 120 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10 h-full w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.55)]"
                >
                  <defs>
                    <linearGradient
                      id={bodyGradId}
                      x1="20"
                      y1="12"
                      x2="100"
                      y2="82"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop
                        offset="0%"
                        stopColor={
                          candyTier.hasCottonCandyTint ? "#FFF7FC" : "#FFFFFF"
                        }
                      />
                      <stop
                        offset="65%"
                        stopColor={
                          candyTier.hasCottonCandyTint ? "#FCE7F3" : "#F1F6FF"
                        }
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          candyTier.hasCottonCandyTint ? "#E9D5FF" : "#DCE8FF"
                        }
                      />
                    </linearGradient>
                    <linearGradient
                      id={rimGradId}
                      x1="0"
                      y1="0"
                      x2="120"
                      y2="92"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                      <stop
                        offset="50%"
                        stopColor={
                          candyTier.hasCottonCandyTint ? "#F472B6" : "#93C5FD"
                        }
                        stopOpacity={candyTier.hasCottonCandyTint ? "0.65" : "0.55"}
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          candyTier.hasCottonCandyTint ? "#A78BFA" : "#C4B5FD"
                        }
                        stopOpacity={candyTier.hasCottonCandyTint ? "0.75" : "0.65"}
                      />
                    </linearGradient>
                  </defs>

                  <path
                    d="M34 76H88C101.255 76 112 65.2548 112 52C112 40.312 103.649 30.5775 92.5647 28.4368C88.7866 15.4904 76.8267 6 62.6 6C46.5015 6 33.2571 18.1835 31.5473 33.8299C19.5037 35.1078 10 45.3007 10 57.7C10 67.8068 18.1932 76 28.3 76H34Z"
                    fill={`url(#${bodyGradId})`}
                    stroke={`url(#${rimGradId})`}
                    strokeWidth="2.2"
                  />
                  <path
                    d="M42 24C47 15 56 11 66 12"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.85"
                  />

                  {/* Progressive candy evolution accessories */}
                  {candyTier.hasStarClip && !candyTier.hasCrown && (
                    <g transform="translate(82, 19) rotate(14)">
                      <path
                        d="M0 -6.5L1.8 -2.1L6.5 -1.8L2.8 1.3L4 5.9L0 3.3L-4 5.9L-2.8 1.3L-6.5 -1.8L-1.8 -2.1Z"
                        fill="#FDE047"
                        stroke="#F59E0B"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                      <circle cx="0" cy="0.3" r="1.4" fill="#FB7185" />
                    </g>
                  )}
                  {candyTier.hasCrown && (
                    <g>
                      <path
                        d="M52.5 8L50.5 -2L57.5 3L62.5 -4.5L67.5 3L74.5 -2L72.5 8Z"
                        fill="#FDE047"
                        stroke="#D97706"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="52"
                        y="6.8"
                        width="21"
                        height="2.5"
                        rx="1.25"
                        fill="#F59E0B"
                        stroke="#B45309"
                        strokeWidth="0.9"
                      />
                      <circle cx="62.5" cy="4" r="1.4" fill="#FB7185" />
                      <circle cx="50.5" cy="-2" r="1.2" fill="#FEF9C3" />
                      <circle cx="62.5" cy="-4.5" r="1.35" fill="#FEF9C3" />
                      <circle cx="74.5" cy="-2" r="1.2" fill="#FEF9C3" />
                    </g>
                  )}

                  <g
                    transform={
                      m === "dizzy"
                        ? undefined
                        : `translate(${faceOffset.x.toFixed(2)}, ${faceOffset.y.toFixed(2)})`
                    }
                  >
                    <ellipse
                      cx="39"
                      cy="54"
                      rx={blush ? 6.2 : 4.8}
                      ry="3.2"
                      fill="#FB7185"
                      opacity={
                        m === "angry"
                          ? 0.8
                          : blush
                            ? 0.65
                            : m === "sad"
                              ? 0.15
                              : 0.35
                      }
                    />
                    <ellipse
                      cx="83"
                      cy="54"
                      rx={blush ? 6.2 : 4.8}
                      ry="3.2"
                      fill="#FB7185"
                      opacity={
                        m === "angry"
                          ? 0.8
                          : blush
                            ? 0.65
                            : m === "sad"
                              ? 0.15
                              : 0.35
                      }
                    />
                    {renderEyes()}
                    {renderMouth()}
                  </g>

                  {/* Weather micro-effects for expressive moods */}
                  {m === "angry" && (
                    <path
                      d="M59 74L54 83H60L57 90L66 79H60.5L63.5 74Z"
                      fill="#FACC15"
                      stroke="#CA8A04"
                      strokeWidth="1"
                      strokeLinejoin="round"
                    />
                  )}
                  {m === "sad" && (
                    <path
                      d="M61 77C61 77 58 81.5 58 83.5C58 85.2 59.3 86.5 61 86.5C62.7 86.5 64 85.2 64 83.5C64 81.5 61 77 61 77Z"
                      fill="#60A5FA"
                    />
                  )}
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
