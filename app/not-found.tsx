import Link from "next/link";
import { ArrowLeft, Ban } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-center text-white p-6">
      <div className="liquid-glass absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black" />
      
      <div className="liquid-glass flex flex-col items-center p-10 rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl max-w-md">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 mb-6 border border-cyan-400/30">
          <Ban size={40} />
        </div>
        
        <h1 className="mb-4 text-6xl font-heading font-black italic tracking-tighter text-white">
          404
        </h1>
        
        <h2 className="mb-4 text-2xl font-bold font-heading text-white">
          Halaman Tidak Ditemukan
        </h2>
        
        <p className="mb-8 text-base text-white/60 font-body">
          Maaf, halaman yang Anda cari mungkin telah dipindahkan atau sudah tidak tersedia lagi.
        </p>
        
        <Link
          href="/"
          className="liquid-glass-strong flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold font-body text-white transition-all hover:bg-white/10 hover:scale-105"
        >
          <ArrowLeft size={18} />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
