"use client";

import React from "react";
import Link from "next/link";

type GoogleCtaButtonProps = {
  children: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  variant?: "dark" | "light" | "glass";
  size?: "sm" | "md";
  focusRing?: string;
  disabled?: boolean;
  ariaLabel?: string;
};

export function GoogleCtaButton({
  children,
  href,
  target,
  rel,
  type = "button",
  onClick,
  className = "",
  variant = "dark",
  size = "md",
  focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
  disabled = false,
  ariaLabel,
}: GoogleCtaButtonProps) {
  const isExternal = Boolean(
    target === "_blank" ||
      (href && (href.startsWith("http://") || href.startsWith("https://"))),
  );

  const finalRel = rel || (isExternal ? "noopener noreferrer" : undefined);
  const finalTarget = target || (isExternal ? "_blank" : undefined);

  // Strict pill clipping: overflow-hidden + clip-path guarantees the rotating gradient NEVER leaks outside the pill
  const outerClasses = `group btn-google-cta relative inline-flex items-center justify-center rounded-full overflow-hidden [clip-path:inset(0_round_9999px)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer ${
    variant === "light" ? "bg-white text-black" : "bg-[#141619] text-white"
  } ${focusRing} ${className}`;

  // Content layout: 'sm' matches navbar links (px-3.5 py-1.5 text-xs font-medium) pixel-for-pixel
  const contentClasses =
    size === "sm"
      ? "relative z-10 flex items-center justify-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium font-body"
      : "relative z-10 flex h-full w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold font-body";

  // Google Gemini AI Gradient Wave Colors (Yellow -> Green -> Cyan -> Blue -> Purple -> Coral)
  const geminiGradient =
    "conic-gradient(from 0deg, transparent 0deg, transparent 140deg, #fbbc05 180deg, #34a853 215deg, #24d69b 250deg, #4285f4 285deg, #9b72cf 320deg, #ea4335 345deg, transparent 360deg)";

  const featherMaskClasses =
    size === "sm"
      ? variant === "light"
        ? "inset-[2px] bg-white shadow-[0_0_5px_2.5px_#ffffff]"
        : "inset-[2px] bg-[#141619] shadow-[0_0_5px_2.5px_#141619]"
      : variant === "light"
        ? "inset-[2.5px] bg-white shadow-[0_0_7px_3.5px_#ffffff]"
        : "inset-[2.5px] bg-[#141619] shadow-[0_0_7px_3.5px_#141619]";

  const auraElements = (
    <>
      {/* 1. Rotating Gradient Wave (strictly clipped inside the pill) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
      >
        <span
          className="absolute left-1/2 top-1/2 w-[260%] aspect-square min-w-[220px] animate-[google-spin_2.6s_linear_infinite] group-active:[animation-duration:1.1s] will-change-transform"
          style={{
            background: geminiGradient,
            filter: "blur(3px)",
          }}
        />
      </span>

      {/* 2. Soft Feathered Inner Core: smoothly blends center fill into the outer gradient wave (no hard line/trench) */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute z-[2] rounded-full ${featherMaskClasses}`}
      />

      {/* 3. Subtle Resting Border: visible when idle, fades out on hover so the soft gradient wave shines */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-[3] rounded-full border transition-opacity duration-300 group-hover:opacity-0 group-active:opacity-0 ${
          variant === "light" ? "border-black/10" : "border-white/15"
        }`}
      />
    </>
  );

  // 1. Link to external URL
  if (href && (isExternal || href.startsWith("#"))) {
    return (
      <a
        href={href}
        target={finalTarget}
        rel={finalRel}
        aria-label={ariaLabel}
        className={outerClasses}
      >
        {auraElements}
        <span className={contentClasses}>{children}</span>
      </a>
    );
  }

  // 2. Link to internal Next.js route
  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={outerClasses}>
        {auraElements}
        <span className={contentClasses}>{children}</span>
      </Link>
    );
  }

  // 3. Button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={outerClasses}
    >
      {auraElements}
      <span className={contentClasses}>{children}</span>
    </button>
  );
}
