"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminSession } from "../../../lib/admin-data";
import { ADMIN_FOCUS_RING } from "../../../lib/constants";
import { supabase } from "../../../lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const focusRing = ADMIN_FOCUS_RING.replace(
    "focus-visible:ring-offset-slate-900",
    "focus-visible:ring-offset-white",
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center font-sans text-slate-900">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">
            Memeriksa sesi admin
          </p>
          <p className="mt-3 text-sm font-medium text-slate-500">
            Menyiapkan halaman login.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl md:p-10">
        <h1 className="mb-3 text-center text-2xl font-black">
          Login Administrator
        </h1>
        <p className="mb-8 text-center text-sm font-medium leading-relaxed text-slate-500">
          Masuk untuk mengelola profil, media sosial, track record, karya, dan
          produk digital.
        </p>

        <div aria-live="polite" aria-atomic="true">
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm font-bold text-red-600"
            >
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="adminEmail"
              className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600"
            >
              Email
            </label>
            <input
              id="adminEmail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none transition-all focus:border-indigo-500 focus:bg-white ${focusRing}`}
              autoComplete="email"
              inputMode="email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="adminPassword"
              className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600"
            >
              Password
            </label>
            <input
              id="adminPassword"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none transition-all focus:border-indigo-500 focus:bg-white ${focusRing}`}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full rounded-xl bg-slate-900 p-4 font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg disabled:bg-slate-400 disabled:shadow-none ${focusRing}`}
          >
            {loading ? "Memeriksa..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 rounded-lg text-sm font-bold text-slate-500 transition-colors hover:text-indigo-600 ${focusRing}`}
          >
            <ArrowLeft size={16} />
            Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
