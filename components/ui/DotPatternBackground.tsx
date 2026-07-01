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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const spacing = 20;
      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;

          // Calculate distance from center for a subtle vignette effect
          const distFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );
          const maxDist = Math.max(centerX, centerY);
          const vignette = Math.max(0, 1 - distFromCenter / (maxDist * 1.5));

          // Calculate dynamic opacity using sine waves
          const noiseX = Math.sin(x * 0.05 + time) * 0.5 + 0.5;
          const noiseY = Math.cos(y * 0.05 + time) * 0.5 + 0.5;
          const pulsing = (Math.sin(time * 0.5 + i * 0.1 + j * 0.1) * 0.5 + 0.5);
          
          // Base dot brightness
          const opacity = (noiseX * noiseY * 0.5 + pulsing * 0.5) * 0.6 * vignette;

          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

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
