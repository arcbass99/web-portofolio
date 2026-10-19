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

  // Common outer wrapper styling: pill shape with 1.5px rim spacing (no outer overflow-hidden so aura diffuses naturally)
  const outerClasses = `group btn-google-cta relative inline-flex items-center justify-center rounded-full p-[1.5px] transition-all duration-300 hover:scale-[1.03] active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer ${focusRing} ${className}`;

  // Inner surface styling: covers the center, exposing only the dynamic gradient rim on hover/press
  const innerSurfaceClasses = `relative z-10 flex h-full w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold font-body transition-colors duration-300 ${
    variant === "light"
      ? "bg-white text-black group-hover:bg-white/95"
      : variant === "glass"
        ? "bg-[#141619]/80 backdrop-blur-xl text-white group-hover:bg-[#141619]/90"
        : "bg-[#141619] text-white group-hover:bg-[#181a1e]"
  }`;

  // Google Gemini AI Gradient Wave Colors (Yellow -> Green -> Cyan -> Blue -> Purple -> Coral)
  // Localized ~180deg arc that sweeps continuously around the pill like a dynamic wave
  const geminiGradient =
    "conic-gradient(from 0deg, transparent 0deg, transparent 155deg, rgba(251, 188, 5, 0.15) 170deg, #fbbc05 190deg, #34a853 220deg, #24d69b 250deg, #4285f4 280deg, #9b72cf 315deg, #ea4335 345deg, transparent 360deg)";

  const auraElements = (
    <>
      {/* 1. Dynamic Rotating Gradient: Soft Atmospheric Outer Glow (diffuses onto surrounding dark space) */}
      <div className="pointer-events-none absolute -inset-1.5 rounded-full overflow-visible opacity-0 transition-opacity duration-300 group-hover:opacity-90 group-active:opacity-100">
        <div
          className="absolute left-1/2 top-1/2 w-[280%] aspect-square min-w-[260px] animate-[google-spin_3s_linear_infinite] group-active:[animation-duration:1.2s] will-change-transform"
          style={{
            background: geminiGradient,
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* 2. Dynamic Rotating Gradient: Core Luminous Rim (Crisp 1.5px-2px beam along pill border) */}
      <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden p-[1.5px]">
        <div
          className="absolute left-1/2 top-1/2 w-[280%] aspect-square min-w-[260px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100 animate-[google-spin_3s_linear_infinite] group-active:[animation-duration:1.2s] will-change-transform"
          style={{
            background: geminiGradient,
            filter: "blur(2px)",
          }}
        />

        {/* Static Inactive Border: Clean resting rim, fades out when wave activates */}
        <div
          className={`absolute inset-0 rounded-full border transition-opacity duration-300 group-hover:opacity-0 ${
            variant === "light" ? "border-black/10" : "border-white/15"
          }`}
        />
      </div>
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
        <div className={innerSurfaceClasses}>{children}</div>
      </a>
    );
  }

  // 2. Link to internal Next.js route
  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={outerClasses}>
        {auraElements}
        <div className={innerSurfaceClasses}>{children}</div>
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
      <div className={innerSurfaceClasses}>{children}</div>
    </button>
  );
}
