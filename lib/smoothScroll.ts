/**
 * Custom smooth-scroll using requestAnimationFrame.
 * Temporarily bypasses CSS scroll-behavior: smooth so native smooth-scrolling
 * never fights frame-by-frame interpolation and causes pre-scroll jitter.
 */

let activeRafId: number | null = null;
let activeCleanup: (() => void) | null = null;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function clampScrollTarget(targetY: number, maxScrollY: number): number {
  const safeMax = Number.isFinite(maxScrollY) && maxScrollY > 0 ? maxScrollY : 0;
  const safeTarget = Number.isFinite(targetY) ? targetY : 0;
  return Math.max(0, Math.min(safeTarget, safeMax));
}

export function cancelSmoothScroll(): void {
  if (activeRafId !== null) {
    cancelAnimationFrame(activeRafId);
    activeRafId = null;
  }
  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }
}

export function isProgrammaticScrolling(): boolean {
  return activeRafId !== null;
}

export function smoothScrollTo(targetY: number, duration = 800): void {
  if (typeof window === "undefined") return;

  cancelSmoothScroll();

  const root = document.documentElement;
  const startY = window.scrollY;
  const maxScrollY = Math.max(0, root.scrollHeight - window.innerHeight);
  const clampedTarget = clampScrollTarget(targetY, maxScrollY);
  const diff = clampedTarget - startY;

  if (Math.abs(diff) < 1) return;

  if (
    duration <= 0 ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    window.scrollTo({
      top: clampedTarget,
      left: window.scrollX,
      behavior: "instant" as ScrollBehavior,
    });
    return;
  }

  const prevInlineBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  const stopOnUserInput = () => cancelSmoothScroll();
  const stopOnKeyDown = (event: KeyboardEvent) => {
    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "PageUp" ||
      event.key === "PageDown" ||
      event.key === "Home" ||
      event.key === "End" ||
      event.key === " "
    ) {
      cancelSmoothScroll();
    }
  };

  window.addEventListener("wheel", stopOnUserInput, { passive: true });
  window.addEventListener("touchstart", stopOnUserInput, { passive: true });
  window.addEventListener("keydown", stopOnKeyDown);

  activeCleanup = () => {
    root.style.scrollBehavior = prevInlineBehavior;
    window.removeEventListener("wheel", stopOnUserInput);
    window.removeEventListener("touchstart", stopOnUserInput);
    window.removeEventListener("keydown", stopOnKeyDown);
  };

  let startTime: number | null = null;

  function step(timestamp: number) {
    if (startTime === null) {
      startTime = timestamp;
      activeRafId = requestAnimationFrame(step);
      return;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    const nextY = progress >= 1 ? clampedTarget : startY + diff * ease;

    window.scrollTo({
      top: nextY,
      left: window.scrollX,
      behavior: "instant" as ScrollBehavior,
    });

    if (progress < 1) {
      activeRafId = requestAnimationFrame(step);
    } else {
      cancelSmoothScroll();
    }
  }

  activeRafId = requestAnimationFrame(step);
}

export function smoothScrollToId(id: string, duration = 800): void {
  if (typeof window === "undefined") return;
  if (id === "home") {
    smoothScrollTo(0, duration);
    return;
  }
  const element = document.getElementById(id);
  if (!element) return;

  const targetY = element.getBoundingClientRect().top + window.scrollY;
  smoothScrollTo(targetY, duration);
}

export function smoothScrollToElement(
  element: Element | null,
  duration = 800,
): void {
  if (!element || typeof window === "undefined") return;

  const targetY = element.getBoundingClientRect().top + window.scrollY;
  smoothScrollTo(targetY, duration);
}
