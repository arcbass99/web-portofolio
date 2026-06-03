"use client";

type PublicBackgroundProps = {
  isDark: boolean;
};

export function PublicBackground({ isDark }: PublicBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${
        isDark ? "bg-[#0B0C10]" : "bg-[#F8FAFC]"
      }`}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark
            ? "opacity-100 bg-[radial-gradient(circle_at_20%_12%,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_82%_22%,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_45%_88%,rgba(20,184,166,0.16),transparent_36%)]"
            : "opacity-100 bg-[radial-gradient(circle_at_18%_12%,rgba(20,184,166,0.22),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(99,102,241,0.16),transparent_30%),radial-gradient(circle_at_48%_90%,rgba(236,72,153,0.13),transparent_34%)]"
        }`}
      />

      <div className="liquid-layer liquid-layer-a">
        <div
          className={`liquid-blob liquid-blob-a ${
            isDark ? "bg-cyan-500/20" : "bg-teal-400/30"
          }`}
        />
      </div>

      <div className="liquid-layer liquid-layer-b">
        <div
          className={`liquid-blob liquid-blob-b ${
            isDark ? "bg-violet-500/16" : "bg-indigo-400/22"
          }`}
        />
      </div>

      <div className="liquid-layer liquid-layer-c">
        <div
          className={`liquid-blob liquid-blob-c ${
            isDark ? "bg-teal-500/14" : "bg-pink-400/20"
          }`}
        />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark
            ? "bg-[linear-gradient(120deg,rgba(255,255,255,0.04)_0%,transparent_28%,rgba(34,211,238,0.05)_52%,transparent_74%)] opacity-70"
            : "bg-[linear-gradient(120deg,rgba(15,23,42,0.05)_0%,transparent_26%,rgba(20,184,166,0.07)_52%,transparent_76%)] opacity-80"
        }`}
      />

      <style jsx>{`
        .liquid-layer {
          position: absolute;
          inset: auto;
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }

        .liquid-blob {
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          filter: blur(64px);
          transform: translate3d(0, 0, 0);
        }

        .liquid-blob-a {
          opacity: 0.86;
        }

        .liquid-blob-b {
          opacity: 0.78;
        }

        .liquid-blob-c {
          opacity: 0.72;
        }

        .liquid-layer-a {
          top: -12%;
          left: -12%;
          width: min(38rem, 76vw);
          height: min(38rem, 76vw);
          animation: liquid-drift-a 18s ease-in-out infinite alternate;
        }

        .liquid-layer-b {
          top: 12%;
          right: -14%;
          width: min(34rem, 68vw);
          height: min(42rem, 82vw);
          animation: liquid-drift-b 22s ease-in-out infinite alternate;
        }

        .liquid-layer-c {
          left: 18%;
          bottom: -18%;
          width: min(44rem, 86vw);
          height: min(34rem, 70vw);
          animation: liquid-drift-c 26s ease-in-out infinite alternate;
        }

        @keyframes liquid-drift-a {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(7vw, 5vh, 0) scale(1.08);
          }
        }

        @keyframes liquid-drift-b {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(-5vw, 8vh, 0) scale(1.06);
          }
        }

        @keyframes liquid-drift-c {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(4vw, -5vh, 0) scale(1.05);
          }
        }

        @media (max-width: 768px) {
          .liquid-blob {
            filter: blur(48px);
          }

          .liquid-layer-a {
            width: 82vw;
            height: 82vw;
          }

          .liquid-layer-b {
            width: 74vw;
            height: 92vw;
          }

          .liquid-layer-c {
            width: 92vw;
            height: 72vw;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .liquid-layer {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
