"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Minimize2 } from "lucide-react";

type CloudMood =
  | "normal"
  | "curious"
  | "happy"
  | "wink"
  | "surprised"
  | "dizzy"
  | "sleepy"
  | "love";

const CLICK_DIALOGUES: { text: string; mood: CloudMood }[] = [
  {
    text: "Halo! Aku Awan Kecil, penghuni setia web Nafis ☁️✨",
    mood: "happy",
  },
  {
    text: "Hehe geli tau diklik-klik! Coba gerakin kursormu, mataku ngikutin lho 👀",
    mood: "wink",
  },
  {
    text: "Kamu bisa geser posisiku ke mana aja di layar kalau mau! 🎈",
    mood: "curious",
  },
  {
    text: "Jangan lupa intip bagian Karya & Track Record Nafis ya! 🚀",
    mood: "love",
  },
  {
    text: "Kalau kursormu diam lama, aku bakal ketiduran di sini... 💤",
    mood: "happy",
  },
];

const SECTION_COMMENTS: Record<string, { text: string; mood: CloudMood }> = {
  home: {
    text: "Selamat datang di ruang digital Nafis! ✨",
    mood: "happy",
  },
  "track-record": {
    text: "Wah, lagi lihat perjalanan & prestasi Nafis ya! 🎓🏆",
    mood: "curious",
  },
  portfolio: {
    text: "Bagian favoritku! Klik kartunya buat detail karya 🎨",
    mood: "love",
  },
  services: {
    text: "Butuh solusi digital? Cek produk & layanan di sini ⚡",
    mood: "wink",
  },
};

export function CloudCompanion() {
  const cloudRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mood, setMood] = useState<CloudMood>("normal");
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [speech, setSpeech] = useState<string | null>(
    "Hai! Aku Awan Kecil ☁️",
  );
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [faceOffset, setFaceOffset] = useState({ x: 0, y: 0 });
  const [cursorDistance, setCursorDistance] = useState(999);

  const lastMousePos = useRef({ x: 0, y: 0, time: 0 });
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moodLockRef = useRef(false);
  const lastSectionRef = useRef<string>("home");

  const showTemporarySpeech = useCallback(
    (text: string, duration = 4200, targetMood?: CloudMood) => {
      setSpeech(text);
      if (targetMood) {
        moodLockRef.current = true;
        setMood(targetMood);
      }

      if (speechTimerRef.current) {
        clearTimeout(speechTimerRef.current);
      }

      speechTimerRef.current = setTimeout(() => {
        setSpeech(null);
        moodLockRef.current = false;
        setMood("normal");
      }, duration);
    },
    [],
  );

  // Mount & initial greeting fade out
  useEffect(() => {
    setMounted(true);
    const initTimer = setTimeout(() => {
      setSpeech(null);
    }, 4500);
    return () => clearTimeout(initTimer);
  }, []);

  // Natural blinking loop
  useEffect(() => {
    if (!mounted) return;
    const blinkInterval = setInterval(() => {
      if (mood === "normal" || mood === "curious") {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3600);

    return () => clearInterval(blinkInterval);
  }, [mounted, mood]);

  // Cursor tracking & velocity/proximity detection
  useEffect(() => {
    if (!mounted || isMinimized) return;

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!moodLockRef.current && !isHovered) {
          setMood("sleepy");
          setEyeOffset({ x: 0, y: 1.5 });
          setFaceOffset({ x: 0, y: 2 });
        }
      }, 11000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - lastMousePos.current.time;
      const dxSpeed = e.clientX - lastMousePos.current.x;
      const dySpeed = e.clientY - lastMousePos.current.y;
      const speed = dt > 0 ? Math.hypot(dxSpeed, dySpeed) / dt : 0;

      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

      if (mood === "sleepy" && !moodLockRef.current) {
        setMood("normal");
      }
      resetIdleTimer();

      if (!cloudRef.current) return;
      const rect = cloudRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.hypot(deltaX, deltaY);
      setCursorDistance(dist);

      const angle = Math.atan2(deltaY, deltaX);
      const maxPupilDist = Math.min(dist / 22, 5.5);
      const maxFaceDist = Math.min(dist / 38, 4.2);

      setEyeOffset({
        x: Math.cos(angle) * maxPupilDist,
        y: Math.sin(angle) * maxPupilDist,
      });
      setFaceOffset({
        x: Math.cos(angle) * maxFaceDist,
        y: Math.sin(angle) * maxFaceDist,
      });

      // Fast cursor whip near the cloud
      if (speed > 4.2 && dist < 240 && !moodLockRef.current && !isHovered) {
        showTemporarySpeech(
          "Wuih, ngebut banget kursornya! 🌀",
          2600,
          "surprised",
        );
        return;
      }

      if (!moodLockRef.current && !isHovered) {
        if (dist < 170) {
          setMood("curious");
        } else {
          setMood("normal");
        }
      }
    };

    resetIdleTimer();
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [mounted, isMinimized, isHovered, mood, showTemporarySpeech]);

  // Scroll section awareness
  useEffect(() => {
    if (!mounted || isMinimized) return;

    const handleScroll = () => {
      const sections = ["services", "portfolio", "track-record", "home"];
      const viewportMid = window.innerHeight * 0.45;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
            if (lastSectionRef.current !== id) {
              lastSectionRef.current = id;
              const comment = SECTION_COMMENTS[id];
              if (comment && !isHovered) {
                showTemporarySpeech(comment.text, 3400, comment.mood);
              }
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted, isMinimized, isHovered, showTemporarySpeech]);

  const handleCloudClick = () => {
    const nextItem = CLICK_DIALOGUES[clickCount % CLICK_DIALOGUES.length];
    setClickCount((prev) => prev + 1);
    if (nextItem) {
      showTemporarySpeech(nextItem.text, 4200, nextItem.mood);
    }
  };

  if (!mounted) return null;

  // Minimized dock pill in bottom-right corner
  if (isMinimized) {
    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={() => {
          setIsMinimized(false);
          showTemporarySpeech("Aku kembali! ☁️✨", 3000, "happy");
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

  const effectiveMood: CloudMood = isHovered ? "happy" : mood;
  const isClose = cursorDistance < 180 || isHovered;

  return (
    <motion.div
      ref={cloudRef}
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.08, cursor: "grabbing" }}
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
              className="mb-2.5 max-w-[215px] rounded-2xl border border-white/15 bg-[#141619]/95 px-3.5 py-2 text-left shadow-[0_12px_30px_rgba(0,0,0,0.75)] backdrop-blur-xl relative"
            >
              <p className="text-[11px] font-body font-medium leading-snug text-white/90">
                {speech}
              </p>
              {/* Bubble pointer */}
              <div className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 border-b border-r border-white/15 bg-[#141619]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sleeping Zzz particles */}
        <AnimatePresence>
          {effectiveMood === "sleepy" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute -top-5 right-3 flex flex-col items-center"
            >
              <motion.span
                animate={{ y: [-2, -16], x: [0, 6], opacity: [0, 0.9, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                className="text-[11px] font-heading font-bold text-blue-300"
              >
                Zzz
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Happy / Love floating sparkles on hover */}
        <AnimatePresence>
          {(effectiveMood === "happy" || effectiveMood === "love") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="pointer-events-none absolute -top-3 left-2 text-amber-300"
            >
              <Sparkles size={14} className="animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimize button (shows on hover) */}
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

          {/* Floating Cloud Character Body */}
          <motion.button
            type="button"
            onClick={handleCloudClick}
            aria-label="Berinteraksi dengan Awan Kecil"
            animate={{
              y: [0, -5, 0],
              rotate: isHovered ? [0, -2, 2, 0] : 0,
              scale: isClose ? 1.05 : 1,
            }}
            transition={{
              y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 0.6, repeat: isHovered ? Infinity : 0 },
              scale: { duration: 0.25 },
            }}
            whileTap={{ scale: 0.9, rotate: -4 }}
            className="relative h-[68px] w-[88px] sm:h-[76px] sm:w-[98px] cursor-grab active:cursor-grabbing focus:outline-none"
          >
            {/* Ambient Google Halo under the cloud */}
            <div
              className={`absolute inset-2 rounded-full blur-xl transition-opacity duration-500 ${
                isClose
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
                <linearGradient
                  id="cloudBodyGrad"
                  x1="20"
                  y1="12"
                  x2="100"
                  y2="82"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="65%" stopColor="#F1F6FF" />
                  <stop offset="100%" stopColor="#DCE8FF" />
                </linearGradient>
                <linearGradient
                  id="cloudRimGrad"
                  x1="0"
                  y1="0"
                  x2="120"
                  y2="92"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Fluffy Cloud Silhouette */}
              <path
                d="M34 76H88C101.255 76 112 65.2548 112 52C112 40.312 103.649 30.5775 92.5647 28.4368C88.7866 15.4904 76.8267 6 62.6 6C46.5015 6 33.2571 18.1835 31.5473 33.8299C19.5037 35.1078 10 45.3007 10 57.7C10 67.8068 18.1932 76 28.3 76H34Z"
                fill="url(#cloudBodyGrad)"
                stroke="url(#cloudRimGrad)"
                strokeWidth="2.2"
              />

              {/* Subtle Top Specular Shine */}
              <path
                d="M42 24C47 15 56 11 66 12"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Expressive Face Group (Parallax shifted toward cursor) */}
              <g
                transform={`translate(${faceOffset.x.toFixed(2)}, ${faceOffset.y.toFixed(2)})`}
              >
                {/* Rosy Cheeks */}
                <ellipse
                  cx="39"
                  cy="54"
                  rx={effectiveMood === "happy" || effectiveMood === "love" ? "6.2" : "4.8"}
                  ry="3.2"
                  fill="#FB7185"
                  opacity={
                    effectiveMood === "happy" || effectiveMood === "love"
                      ? "0.65"
                      : "0.35"
                  }
                />
                <ellipse
                  cx="83"
                  cy="54"
                  rx={effectiveMood === "happy" || effectiveMood === "love" ? "6.2" : "4.8"}
                  ry="3.2"
                  fill="#FB7185"
                  opacity={
                    effectiveMood === "happy" || effectiveMood === "love"
                      ? "0.65"
                      : "0.35"
                  }
                />

                {/* ── EYES ── */}
                {isBlinking || effectiveMood === "sleepy" ? (
                  <>
                    {/* Closed peaceful eyes */}
                    <path
                      d="M42 46C44.5 48.5 48.5 48.5 51 46"
                      stroke="#1E293B"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M71 46C73.5 48.5 77.5 48.5 80 46"
                      stroke="#1E293B"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </>
                ) : effectiveMood === "happy" || effectiveMood === "love" ? (
                  <>
                    {/* Happy Arc Eyes (^ ^) */}
                    <path
                      d="M41 47C43.5 42.5 48.5 42.5 51 47"
                      stroke="#1E293B"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M71 47C73.5 42.5 78.5 42.5 81 47"
                      stroke="#1E293B"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </>
                ) : effectiveMood === "wink" ? (
                  <>
                    {/* Left Eye Wink, Right Eye Open */}
                    <path
                      d="M41 46.5C44 43 48.5 43 51 46.5"
                      stroke="#1E293B"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <g
                      transform={`translate(${eyeOffset.x.toFixed(2)}, ${eyeOffset.y.toFixed(2)})`}
                    >
                      <circle cx="75.5" cy="45.5" r="4.8" fill="#0F172A" />
                      <circle cx="77.2" cy="43.8" r="1.7" fill="white" />
                    </g>
                  </>
                ) : effectiveMood === "surprised" ? (
                  <>
                    {/* Wide surprised eyes */}
                    <g
                      transform={`translate(${eyeOffset.x.toFixed(2)}, ${eyeOffset.y.toFixed(2)})`}
                    >
                      <circle
                        cx="46.5"
                        cy="45.5"
                        r="5.6"
                        fill="#0F172A"
                      />
                      <circle cx="48.2" cy="43.5" r="2" fill="white" />
                      <circle cx="45" cy="47.5" r="1" fill="white" />

                      <circle
                        cx="75.5"
                        cy="45.5"
                        r="5.6"
                        fill="#0F172A"
                      />
                      <circle cx="77.2" cy="43.5" r="2" fill="white" />
                      <circle cx="74" cy="47.5" r="1" fill="white" />
                    </g>
                  </>
                ) : (
                  <>
                    {/* Normal / Curious Cursor-Tracking Eyes */}
                    <g
                      transform={`translate(${eyeOffset.x.toFixed(2)}, ${eyeOffset.y.toFixed(2)})`}
                    >
                      <circle
                        cx="46.5"
                        cy="45.5"
                        r={effectiveMood === "curious" ? "5.1" : "4.5"}
                        fill="#0F172A"
                      />
                      <circle cx="48.1" cy="43.8" r="1.7" fill="white" />

                      <circle
                        cx="75.5"
                        cy="45.5"
                        r={effectiveMood === "curious" ? "5.1" : "4.5"}
                        fill="#0F172A"
                      />
                      <circle cx="77.1" cy="43.8" r="1.7" fill="white" />
                    </g>
                  </>
                )}

                {/* ── MOUTH ── */}
                {effectiveMood === "surprised" ? (
                  <ellipse cx="61" cy="55.5" rx="3.2" ry="4" fill="#1E293B" />
                ) : effectiveMood === "sleepy" ? (
                  <circle cx="61" cy="55" r="2.2" fill="#64748B" />
                ) : effectiveMood === "happy" || effectiveMood === "love" ? (
                  <path
                    d="M55 52.5C56.8 57.5 65.2 57.5 67 52.5Z"
                    fill="#E11D48"
                    stroke="#1E293B"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                ) : effectiveMood === "curious" ? (
                  <path
                    d="M56.5 53.5C58.5 56.5 63.5 56.5 65.5 53.5"
                    stroke="#1E293B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M57 53.5C58.8 55.8 63.2 55.8 65 53.5"
                    stroke="#1E293B"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                )}
              </g>
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
