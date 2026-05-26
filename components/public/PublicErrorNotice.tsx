"use client";

type PublicErrorNoticeProps = {
  error: string | null;
  isDark: boolean;
};

export function PublicErrorNotice({ error, isDark }: PublicErrorNoticeProps) {
  if (!error) return null;

  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 lg:px-12 xl:px-24">
      <div
        role="status"
        aria-live="polite"
        className={`rounded-3xl border p-5 text-sm font-semibold leading-relaxed shadow-sm backdrop-blur-md ${
          isDark
            ? "border-amber-400/20 bg-amber-400/10 text-amber-100"
            : "border-amber-200 bg-amber-50 text-amber-900"
        }`}
      >
        Beberapa data belum berhasil dimuat. Halaman tetap ditampilkan dengan
        fallback sementara. Detail: {error}
      </div>
    </div>
  );
}
