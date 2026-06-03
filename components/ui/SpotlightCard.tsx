import type { ReactNode } from "react";
import styles from "./SpotlightCard.module.css";

type SpotlightTone = "cyan" | "teal" | "violet" | "amber" | "rose" | "white";
type SpotlightIntensity = "subtle" | "medium" | "strong";
type SpotlightElement = "div" | "article" | "a" | "span";

type SpotlightCardProps = {
  as?: SpotlightElement;
  children: ReactNode;
  className?: string;
  isDark?: boolean;
  tone?: SpotlightTone;
  intensity?: SpotlightIntensity;
  href?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

const toneClassMap: Record<SpotlightTone, string> = {
  cyan: styles.toneCyan,
  teal: styles.toneTeal,
  violet: styles.toneViolet,
  amber: styles.toneAmber,
  rose: styles.toneRose,
  white: styles.toneWhite,
};

const intensityClassMap: Record<SpotlightIntensity, string> = {
  subtle: styles.intensitySubtle,
  medium: styles.intensityMedium,
  strong: styles.intensityStrong,
};

const buildClassName = (
  className: string,
  isDark: boolean,
  tone: SpotlightTone,
  intensity: SpotlightIntensity,
) =>
  [
    styles.spotlight,
    isDark ? styles.dark : styles.light,
    toneClassMap[tone],
    intensityClassMap[intensity],
    className,
  ]
    .filter(Boolean)
    .join(" ");

export function SpotlightCard({
  as = "div",
  children,
  className = "",
  isDark = false,
  tone = "cyan",
  intensity = "medium",
  href,
  target,
  rel,
  "aria-label": ariaLabel,
}: SpotlightCardProps) {
  const composedClassName = buildClassName(
    className,
    isDark,
    tone,
    intensity,
  );

  if (as === "a") {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={composedClassName}
      >
        {children}
      </a>
    );
  }

  if (as === "article") {
    return <article className={composedClassName}>{children}</article>;
  }

  if (as === "span") {
    return <span className={composedClassName}>{children}</span>;
  }

  return <div className={composedClassName}>{children}</div>;
}
