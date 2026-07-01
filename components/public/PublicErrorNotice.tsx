"use client";

type PublicErrorNoticeProps = {
  error: string | null;
};

export function PublicErrorNotice({ error }: PublicErrorNoticeProps) {
  if (!error) return null;

  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 lg:px-12 xl:px-24">
      <div
        role="status"
        aria-live="polite"
        className="liquid-glass rounded-2xl p-5 text-sm font-medium leading-relaxed text-amber-200/90 font-body"
      >
        Beberapa data belum berhasil dimuat. Halaman tetap ditampilkan dengan
        fallback sementara. Detail: {error}
      </div>
    </div>
  );
}
