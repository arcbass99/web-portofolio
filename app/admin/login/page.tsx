"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { StitchDotCanvas } from "../../../components/ui/StitchDotCanvas";
import { AmbientAuroraOrb } from "../../../components/ui/AmbientAuroraOrb";
import { getAdminSession } from "../../../lib/admin-data";
import { supabase } from "../../../lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");

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
      <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0d0e] px-6 text-center font-body text-white">
        <StitchDotCanvas spacing={28} dotSize={1.1} />
        <div className="relative z-10 rounded-2xl border border-white/12 bg-[#141619] px-6 py-6 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black shadow-lg">
            <ShieldCheck size={20} />
          </div>
          <p className="text-sm font-semibold text-white font-heading">
            Memeriksa sesi admin...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0d0e] font-body text-white">
      {/* Interactive Google Stitch dots background */}
      <StitchDotCanvas spacing={28} dotSize={1.1} />

      {/* Subtle ambient light orbs in corners */}
      <AmbientAuroraOrb
        variant="blue"
        size="md"
        className="-top-12 -left-12 opacity-30"
        duration={24}
      />
      <AmbientAuroraOrb
        variant="violet"
        size="sm"
        className="-bottom-10 -right-10 opacity-30"
        duration={20}
      />

      <section className="relative z-10 flex w-full max-w-[340px] flex-col px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full solid-frost rounded-2xl border border-white/12 bg-[#141619] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
        >
          <div className="mb-5 text-center flex flex-col items-center">
            <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black font-semibold text-xs tracking-wider shadow-md">
              NF
            </div>
            <h1 className="text-xl font-heading font-semibold tracking-tight text-white">
              Sign in to Account
            </h1>
            <p className="mt-1 text-xs text-white/50 font-body">
              I&apos;m Nafis Admin Console
            </p>
          </div>

          <div aria-live="polite" aria-atomic="true">
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-center text-xs font-medium text-red-400"
              >
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label
                htmlFor="adminEmail"
                className="block text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1"
              >
                Email
              </label>
              <input
                id="adminEmail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#0b0d0e] px-3.5 py-2.5 text-xs sm:text-sm font-medium text-white outline-none placeholder:text-white/30 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                autoComplete="email"
                inputMode="email"
                placeholder="name@work-email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="adminPassword"
                className="block text-[11px] font-medium uppercase tracking-wider text-blue-400 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="adminPassword"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#0b0d0e] px-3.5 py-2.5 pr-10 text-xs sm:text-sm font-medium text-white outline-none placeholder:text-white/30 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  autoComplete="current-password"
                  placeholder="Password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setIsPasswordVisible((currentValue) => !currentValue)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/40 transition-colors hover:text-white"
                  aria-label={
                    isPasswordVisible
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {isPasswordVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-white py-2.5 px-4 text-xs sm:text-sm font-semibold text-black transition-all hover:bg-white/90 shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
            >
              {loading ? "Signing in..." : "Continue with Email"}
            </button>
          </form>

          <div className="mt-5 text-center text-[10px] text-white/40 leading-relaxed font-body">
            <p>
              By proceeding, you agree to access a restricted console subject to local security policies.
            </p>
          </div>
        </motion.div>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft size={13} />
            Back to Public Page
          </Link>
        </div>
      </section>
    </main>
  );
}
