"use client";

type PublicErrorNoticeProps = {
  error: string | null;
};

export function PublicErrorNotice({ error }: PublicErrorNoticeProps) {
  if (!error) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 pt-24 lg:px-12">
      <div
        role="status"
        aria-live="polite"
        className="solid-frost rounded-xl border border-amber-500/25 bg-[#141619] p-3.5 text-xs sm:text-sm font-medium leading-relaxed text-amber-200/90 font-body shadow-lg"
      >
        Beberapa data belum berhasil dimuat. Halaman tetap ditampilkan dengan
        fallback sementara. Detail: {error}
      </div>
    </div>
  );
}
