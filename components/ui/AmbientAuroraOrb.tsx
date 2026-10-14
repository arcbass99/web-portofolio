"use client";

import { motion } from "framer-motion";

type AmbientAuroraOrbProps = {
  className?: string;
  variant?: "blue" | "violet" | "emerald" | "cyan";
  size?: "sm" | "md" | "lg";
  duration?: number;
};

const variants = {
  blue: "from-blue-600/18 via-indigo-500/12 to-transparent",
  violet: "from-violet-600/18 via-purple-500/12 to-transparent",
  emerald: "from-emerald-600/15 via-teal-500/10 to-transparent",
  cyan: "from-cyan-500/15 via-blue-500/10 to-transparent",
};

const sizes = {
  sm: "w-36 h-36 md:w-48 md:h-48",
  md: "w-48 h-48 md:w-64 md:h-64",
  lg: "w-64 h-64 md:w-80 md:h-80",
};

export function AmbientAuroraOrb({
  className = "",
  variant = "blue",
  size = "md",
  duration = 18,
}: AmbientAuroraOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none overflow-visible z-0 ${className}`}
    >
      <motion.div
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -25, 15, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`rounded-full bg-gradient-to-tr ${variants[variant]} ${sizes[size]} blur-[75px] md:blur-[95px] will-change-transform`}
      />
    </div>
  );
}
