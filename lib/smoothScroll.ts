/**
 * Custom smooth-scroll using requestAnimationFrame.
 * Reliable even when CSS scroll-behavior or native smooth-scroll
 * fails due to sticky / parallax layouts.
 */

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function smoothScrollTo(targetY: number, duration = 800): void {
  const startY = window.scrollY;
  const diff = targetY - startY;

  if (Math.abs(diff) < 1) return;

  let startTime: number | null = null;

  function step(timestamp: number) {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startY + diff * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export function smoothScrollToId(id: string, duration = 800): void {
  const element = document.getElementById(id);
  if (!element) return;

  const targetY = element.getBoundingClientRect().top + window.scrollY;
  smoothScrollTo(targetY, duration);
}

export function smoothScrollToElement(
  element: Element | null,
  duration = 800,
): void {
  if (!element) return;

  const targetY = element.getBoundingClientRect().top + window.scrollY;
  smoothScrollTo(targetY, duration);
}
