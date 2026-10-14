"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function DotPatternBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let lastDrawTime = 0;

    const spacing = 28;
    let cols = 0;
    let rows = 0;
    let dotVignettes: Float32Array = new Float32Array(0);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      cols = Math.ceil(canvas.width / spacing);
      rows = Math.ceil(canvas.height / spacing);
      const totalDots = cols * rows;
      dotVignettes = new Float32Array(totalDots);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDist = Math.max(centerX, centerY) * 1.4;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const dist = Math.hypot(x - centerX, y - centerY);
          dotVignettes[i * rows + j] = Math.max(0, 1 - dist / maxDist);
        }
      }
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = (currentTime: number) => {
      // Throttle rendering to ~30 FPS to conserve CPU and battery
      if (currentTime - lastDrawTime < 32) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastDrawTime = currentTime;
      time += 0.03;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < cols; i++) {
        const x = i * spacing;
        const noiseX = Math.sin(x * 0.04 + time) * 0.5 + 0.5;

        for (let j = 0; j < rows; j++) {
          const vignette = dotVignettes[i * rows + j];
          if (vignette <= 0.01) continue;

          const y = j * spacing;
          const noiseY = Math.cos(y * 0.04 + time) * 0.5 + 0.5;
          const pulsing = Math.sin(time * 0.5 + (i + j) * 0.1) * 0.5 + 0.5;
          const opacity = (noiseX * noiseY * 0.5 + pulsing * 0.5) * 0.6 * vignette;

          if (opacity > 0.02) {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity.toFixed(2)})`;
            ctx.fillRect(x, y, 1.5, 1.5);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 z-0 bg-black pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle top/bottom fade gradient to blend edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none opacity-80" />
    </motion.div>
  );
}
