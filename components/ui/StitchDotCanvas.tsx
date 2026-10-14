"use client";

import { useEffect, useRef } from "react";

type StitchDotCanvasProps = {
  className?: string;
  spacing?: number;
  dotSize?: number;
};

export function StitchDotCanvas({
  className = "",
  spacing = 26,
  dotSize = 1.2,
}: StitchDotCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let isMouseInside = false;

    // Smooth cursor interpolation
    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let cursorAlpha = 0;
    let targetCursorAlpha = 0;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseInside = true;
      targetCursorAlpha = 1;
    };

    const handleMouseLeave = () => {
      isMouseInside = false;
      targetCursorAlpha = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const rect = container.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
        isMouseInside = true;
        targetCursorAlpha = 1;
      }
    };

    const handleTouchEnd = () => {
      isMouseInside = false;
      targetCursorAlpha = 0;
    };

    window.addEventListener("resize", resize);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    resize();

    // Intersection Observer to stop animation when out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (!wasVisible && isVisible) {
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    const radius = 175; // Interaction radius in pixels
    const radiusSq = radius * radius;

    const render = () => {
      if (!isVisible) return;

      // Smooth cursor movement
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorAlpha += (targetCursorAlpha - cursorAlpha) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing cosmic background aura under cursor
      if (cursorAlpha > 0.01) {
        const gradient = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          radius * 1.25,
        );
        gradient.addColorStop(0, `rgba(66, 133, 244, ${0.18 * cursorAlpha})`);
        gradient.addColorStop(0.45, `rgba(155, 114, 207, ${0.12 * cursorAlpha})`);
        gradient.addColorStop(0.75, `rgba(52, 168, 83, ${0.05 * cursorAlpha})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw dot matrix
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const startX = (width % spacing) / 2;
      const startY = (height % spacing) / 2;

      for (let i = 0; i < cols; i++) {
        const x = startX + i * spacing;

        for (let j = 0; j < rows; j++) {
          const y = startY + j * spacing;

          let currentDotSize = dotSize;
          let r = 255;
          let g = 255;
          let b = 255;
          let opacity = 0.14;

          if (cursorAlpha > 0.01) {
            const dx = x - currentX;
            const dy = y - currentY;
            const distSq = dx * dx + dy * dy;

            if (distSq < radiusSq) {
              const dist = Math.sqrt(distSq);
              const factor = 1 - dist / radius; // 0 to 1
              const eased = factor * factor * (3 - 2 * factor); // smoothstep

              // Size swells slightly when cursor approaches
              currentDotSize = dotSize + eased * 1.5;

              // Color shifts to Google Gemini cyan / violet / blue
              r = Math.round(180 + 75 * (1 - eased));
              g = Math.round(200 + 40 * (1 - eased));
              b = 255;

              opacity = 0.14 + eased * 0.76 * cursorAlpha;
            }
          }

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, currentDotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [spacing, dotSize]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-auto ${className}`}
    >
      {/* Stitch-style Cosmic Aurora Ribbons on left & right borders */}
      <div
        className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-80 rounded-full bg-gradient-to-tr from-blue-600/25 via-teal-500/15 to-transparent blur-3xl pointer-events-none"
        style={{ animation: "aurora-1 12s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-80 rounded-full bg-gradient-to-bl from-violet-600/25 via-blue-500/15 to-transparent blur-3xl pointer-events-none"
        style={{ animation: "aurora-2 14s ease-in-out infinite" }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
