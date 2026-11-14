"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { MAX_CLAPS_PER_ITEM, formatCompactCount } from "../../lib/gallery";
import {
  getLocalUserClaps,
  notifySifan,
  postClapBatch,
  saveLocalUserClaps,
  sendMetricEvent,
} from "../../lib/metrics-client";

const subscribeClapsStore = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("imnafis:claps-sync", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("imnafis:claps-sync", onStoreChange);
  };
};

type ClapButtonProps = {
  itemId: number;
  itemTitle?: string | null;
  count: number;
  onCountChange: (itemId: number, newCount: number) => void;
  size?: "sm" | "md";
  focusRing?: string;
};

type BurstParticle = {
  id: number;
  x: number;
  y: number;
};

export function ClapButton({
  itemId,
  itemTitle,
  count,
  onCountChange,
  size = "md",
  focusRing = "",
}: ClapButtonProps) {
  const userClaps = useSyncExternalStore(
    subscribeClapsStore,
    () => getLocalUserClaps(itemId),
    () => 0,
  );
  const [bursts, setBursts] = useState<BurstParticle[]>([]);
  const [limitReached, setLimitReached] = useState(false);

  const pendingDeltaRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstSeqRef = useRef(0);
  const latestCountRef = useRef(count);

  useEffect(() => {
    latestCountRef.current = count;
  }, [count]);

  const flushPendingClaps = useCallback(
    (fireAndForget = false) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      const delta = pendingDeltaRef.current;
      if (delta <= 0) return;

      pendingDeltaRef.current = 0;

      if (fireAndForget) {
        sendMetricEvent({ type: "clap", itemId, delta }, true);
        return;
      }

      void postClapBatch(itemId, delta).then((res) => {
        if (!res || res.fallback) return;
        if (res.limited) {
          setLimitReached(true);
        }
        if (res.count > 0) {
          onCountChange(itemId, res.count + pendingDeltaRef.current);
        }
      });
    },
    [itemId, onCountChange],
  );

  // Ensure rapid modal close right after tapping never drops pending claps
  useEffect(() => {
    return () => {
      flushPendingClaps(true);
    };
  }, [flushPendingClaps]);

  const handleClap = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (userClaps >= MAX_CLAPS_PER_ITEM) {
      setLimitReached(true);
      setTimeout(() => setLimitReached(false), 1400);
      return;
    }

    const nextUserClaps = userClaps + 1;
    saveLocalUserClaps(itemId, nextUserClaps);

    const nextDisplayCount = latestCountRef.current + 1;
    latestCountRef.current = nextDisplayCount;
    onCountChange(itemId, nextDisplayCount);

    pendingDeltaRef.current += 1;

    // Spawn micro burst particle
    const particleId = ++burstSeqRef.current;
    const angle = ((particleId % 5) - 2) * 12;
    setBursts((prev) => [...prev.slice(-4), { id: particleId, x: angle, y: -22 }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== particleId));
    }, 650);

    notifySifan({
      kind: "clap",
      label: itemTitle || "karya ini",
      clapsAdded: nextUserClaps,
    });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      flushPendingClaps(false);
    }, 480);
  };

  const hasClapped = userClaps > 0;
  const isSmall = size === "sm";

  return (
    <motion.button
      type="button"
      onClick={handleClap}
      whileTap={{ scale: 0.9 }}
      animate={limitReached ? { x: [0, -3, 3, -2, 0] } : undefined}
      transition={{ duration: 0.25 }}
      aria-label={`Apresiasi ${itemTitle || "item galeri"} (${count} apresiasi)`}
      title={
        userClaps >= MAX_CLAPS_PER_ITEM
          ? "Apresiasi maksimal (10x) tercapai"
          : `Beri apresiasi (${userClaps}/${MAX_CLAPS_PER_ITEM})`
      }
      className={`relative z-20 inline-flex items-center gap-1.5 rounded-full border font-body font-medium transition-all duration-200 cursor-pointer select-none ${
        isSmall ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs"
      } ${
        hasClapped
          ? "border-rose-400/40 bg-rose-500/15 text-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.2)] hover:bg-rose-500/25"
          : "border-white/12 bg-white/5 text-white/70 hover:border-white/25 hover:bg-white/10 hover:text-white"
      } ${focusRing}`}
    >
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.span
            key={b.id}
            initial={{ opacity: 0.95, y: 0, x: 0, scale: 0.75 }}
            animate={{ opacity: 0, y: b.y, x: b.x, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-rose-300"
          >
            +1
          </motion.span>
        ))}
      </AnimatePresence>

      <Heart
        size={isSmall ? 12 : 14}
        className={`transition-transform duration-200 ${
          hasClapped ? "fill-rose-400 text-rose-400 scale-110" : "text-current"
        }`}
      />
      <span>{formatCompactCount(count)}</span>
      {!isSmall && (
        <span className="text-[11px] opacity-75">
          {userClaps >= MAX_CLAPS_PER_ITEM ? "Maks" : "Apresiasi"}
        </span>
      )}
    </motion.button>
  );
}
