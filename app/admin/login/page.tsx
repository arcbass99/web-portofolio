"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { DotPatternBackground } from "../../../components/ui/DotPatternBackground";
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
      <div className="flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-center font-sans text-white">
        <DotPatternBackground />
        <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a] px-[1.618rem] py-[1.618rem] shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-[1rem] flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
            <ShieldCheck size={22} />
          </div>
          <p className="text-[1rem] font-bold text-white">
            Memeriksa sesi admin...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black font-sans text-white">
      <DotPatternBackground />

      <section className="relative z-10 flex w-full max-w-sm flex-col px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full rounded-[1rem] border border-white/10 bg-[#0a0a0a] p-[1.618rem] shadow-2xl shadow-black/50"
        >
          <div className="mb-[1.618rem] text-center flex flex-col items-center">
            <div className="mx-auto mb-[1rem] flex h-10 w-10 items-center justify-center rounded-full bg-white text-black font-bold text-[0.618rem] tracking-widest shadow-xl">
              NF
            </div>
            <h1 className="text-[1.618rem] font-bold tracking-tight text-white">
              Sign in to Account
            </h1>
            <p className="mt-[0.618rem] text-[0.618rem] font-medium text-white/50">
              I&apos;m Nafis Admin
            </p>
          </div>

          <div aria-live="polite" aria-atomic="true">
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-medium text-red-400"
              >
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="rounded-lg border border-[#333] bg-black p-[1px] transition-colors focus-within:border-white/40">
                <input
                  id="adminEmail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-md border-0 bg-transparent p-[1rem] text-[1rem] font-medium text-white outline-none placeholder:text-white/30"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@work-email.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative rounded-lg border border-[#333] bg-black p-[1px] transition-colors focus-within:border-white/40">
                <input
                  id="adminPassword"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-md border-0 bg-transparent p-[1rem] pr-10 text-[1rem] font-medium text-white outline-none placeholder:text-white/30"
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
                  {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-[0.618rem] w-full rounded-lg bg-[#ededed] p-[1rem] text-[1rem] font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-[#333] disabled:text-[#888]"
            >
              {loading ? "Signing in..." : "Continue with Email"}
            </button>
          </form>

          <div className="mt-[1.618rem] text-center text-[0.618rem] text-white/40">
            <p>
              By proceeding, you agree to access a restricted console subject to local security policies.
            </p>
          </div>
        </motion.div>

        <div className="mt-[1.618rem] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-[0.618rem] text-[0.618rem] font-medium text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Public Page
          </Link>
        </div>
      </section>
    </main>
  );
}
