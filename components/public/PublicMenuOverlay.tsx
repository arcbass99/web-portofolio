"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type PublicMenuOverlayProps = {
  isOpen: boolean;
  highlightsCount: number;
  servicesCount: number;
  focusRing: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
};

export function PublicMenuOverlay({
  isOpen,
  highlightsCount,
  servicesCount,
  focusRing,
  onClose,
  onNavigate,
}: PublicMenuOverlayProps) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    { id: "home", label: "Profil" },
    ...(highlightsCount > 0
      ? [{ id: "track-record", label: "Track Record" }]
      : []),
    { id: "portfolio", label: "Karya" },
    ...(servicesCount > 0
      ? [{ id: "services", label: "Layanan" }]
      : []),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#0b0d0e]/85 backdrop-blur-2xl px-6"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu navigasi"
            autoFocus
            className={`apple-liquid-glass absolute top-5 right-6 p-2.5 rounded-full transition-all ${focusRing} text-white/80 hover:text-white hover:scale-105 active:scale-95`}
          >
            <X size={20} />
          </button>

          <div className="apple-liquid-glass w-full max-w-xs rounded-[1.75rem] p-5 flex flex-col gap-2 text-center font-heading font-semibold tracking-tight">
            <span className="text-[11px] font-body font-medium uppercase tracking-wider text-white/50 mb-1">
              Navigasi Halaman
            </span>
            {menuItems.map((item, index) => (
              <motion.button
                type="button"
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                onClick={() => onNavigate(item.id)}
                aria-label={`Buka bagian ${item.label}`}
                className={`w-full py-2.5 px-4 text-base sm:text-lg text-white rounded-xl hover:bg-white/10 transition-all hover:text-blue-300 ${focusRing}`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
