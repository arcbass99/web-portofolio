"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type PublicMenuOverlayProps = {
  isDark: boolean;
  isOpen: boolean;
  servicesCount: number;
  focusRing: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
};

export function PublicMenuOverlay({
  isDark,
  isOpen,
  servicesCount,
  focusRing,
  onClose,
  onNavigate,
}: PublicMenuOverlayProps) {
  const menuItems = [
    { id: "home", label: "Profil Utama" },
    { id: "portfolio", label: "Selected Works" },
    ...(servicesCount > 0 ? [{ id: "services", label: "Produk" }] : []),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className={`fixed inset-0 z-50 flex flex-col justify-center items-center ${
            isDark ? "bg-[#0B0C10]/80" : "bg-white/80"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu navigasi"
            autoFocus
            className={`absolute top-6 right-6 lg:right-12 xl:right-24 p-4 rounded-full border transition-all ${focusRing} ${
              isDark
                ? "border-white/10 hover:bg-white/10 text-slate-400 hover:text-white"
                : "border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900"
            }`}
          >
            <X size={24} />
          </button>

          <div className="flex flex-col gap-6 md:gap-8 text-center font-black tracking-tight w-full px-6">
            {menuItems.map((item, index) => (
              <motion.button
                type="button"
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onNavigate(item.id)}
                aria-label={`Buka bagian ${item.label}`}
                className={`text-4xl md:text-6xl rounded-2xl hover:-translate-y-1 transition-all ${focusRing} ${
                  isDark ? "hover:text-cyan-400" : "hover:text-teal-600"
                }`}
              >
                {item.label}
              </motion.button>
            ))}

            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              href="/admin"
              aria-label="Masuk ke console admin"
              className={`text-xs md:text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-teal-500 mt-12 rounded-lg ${focusRing}`}
            >
              — Masuk Console Admin —
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
