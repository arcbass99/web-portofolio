"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getAdminSession } from "../../../lib/admin-data";
import { ADMIN_FOCUS_RING } from "../../../lib/constants";
import { supabase } from "../../../lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const focusRing = ADMIN_FOCUS_RING.replace(
    "focus-visible:ring-offset-slate-900",
    "focus-visible:ring-offset-[#020617]",
  );

  useEffect(() => {
    let isCancelled = false;
    let shouldShowLoginForm = true;

    const sessionTimer = window.setTimeout(() => {
      void (async () => {
        try {
          const session = await getAdminSession();

          if (isCancelled) return;

          if (session) {
            shouldShowLoginForm = false;
            router.replace("/admin");
            return;
          }
        } finally {
          if (!isCancelled && shouldShowLoginForm) {
            setCheckingSession(false);
          }
        }
      })();
    }, 0);

    return () => {
      isCancelled = true;
      window.clearTimeout(sessionTimer);
    };
  }, [router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (loginError) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-6 text-center font-sans text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_78%_16%,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_50%_92%,rgba(20,184,166,0.14),transparent_36%)]" />
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] px-8 py-7 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
            <ShieldCheck size={22} />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200">
            Memeriksa sesi admin
          </p>
          <p className="mt-3 text-sm font-medium text-slate-300">
            Menyiapkan akses dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#020617] font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.2),transparent_32%),radial-gradient(circle_at_84%_12%,rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_52%_92%,rgba(20,184,166,0.16),transparent_36%)]" />
      <div className="absolute -left-28 top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />

      <section className="relative z-10 hidden min-h-screen w-[48%] flex-col justify-between border-r border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl lg:flex xl:p-14">
        <Link
          href="/"
          className={`inline-flex w-fit items-center gap-2 rounded-xl text-sm font-black uppercase tracking-widest text-slate-300 transition-colors hover:text-cyan-200 ${focusRing}`}
        >
          <ArrowLeft size={16} />
          Halaman Utama
        </Link>

        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-200"
          >
            <Sparkles size={15} />
            Admin Console
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl font-black tracking-tight text-white xl:text-6xl"
          >
            Kendalikan profil digitalmu dengan rapi.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-6 max-w-lg text-base font-medium leading-relaxed text-slate-300"
          >
            Masuk untuk memperbarui profil, track record, karya pilihan, media
            sosial, dan produk digital dari satu dashboard.
          </motion.p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {["Profil", "Karya", "Produk"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center shadow-xl backdrop-blur-md"
            >
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Kelola
              </p>
              <p className="mt-1 font-black text-white">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 flex min-h-screen flex-1 items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl md:p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-xl">
              <LockKeyhole size={24} />
            </div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
              I’m Nafis Admin
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Login Administrator
            </h1>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-300">
              Masuk untuk mengelola profil, media sosial, track record, karya,
              dan produk digital.
            </p>
          </div>

          <div aria-live="polite" aria-atomic="true">
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-center text-sm font-bold text-red-200"
              >
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="adminEmail"
                className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-300"
              >
                Email
              </label>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-[2px] transition-colors focus-within:border-cyan-300/50 focus-within:bg-cyan-300/10">
                <input
                  id="adminEmail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={`w-full rounded-[0.9rem] border-0 bg-slate-950/60 p-4 text-sm font-medium text-white outline-none placeholder:text-slate-500 ${focusRing}`}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="adminPassword"
                className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-300"
              >
                Password
              </label>
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-[2px] transition-colors focus-within:border-cyan-300/50 focus-within:bg-cyan-300/10">
                <input
                  id="adminPassword"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={`w-full rounded-[0.9rem] border-0 bg-slate-950/60 p-4 pr-12 text-sm font-medium text-white outline-none placeholder:text-slate-500 ${focusRing}`}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setIsPasswordVisible((currentValue) => !currentValue)
                  }
                  className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 transition-colors hover:text-cyan-200 ${focusRing}`}
                  aria-label={
                    isPasswordVisible
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full overflow-hidden rounded-2xl border border-cyan-300/30 bg-cyan-300 p-4 font-black uppercase tracking-widest text-slate-950 shadow-xl shadow-cyan-950/30 transition-all hover:-translate-y-0.5 hover:bg-white disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-slate-500 disabled:bg-slate-500 disabled:text-slate-900 ${focusRing}`}
            >
              <span className="relative z-10">
                {loading ? "Memeriksa..." : "Masuk ke Dashboard"}
              </span>
              <span className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center lg:hidden">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 rounded-lg text-sm font-bold text-slate-300 transition-colors hover:text-cyan-200 ${focusRing}`}
            >
              <ArrowLeft size={16} />
              Kembali ke Halaman Utama
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
