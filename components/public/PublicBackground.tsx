"use client";

type PublicBackgroundProps = {
  isDark: boolean;
};

export function PublicBackground({ isDark }: PublicBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 transition-colors duration-1000 ${
          isDark ? "bg-indigo-900/50" : "bg-teal-200"
        }`}
      />
      <div
        className={`absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 transition-colors duration-1000 ${
          isDark ? "bg-violet-900/40" : "bg-purple-200"
        }`}
      />
      <div
        className={`absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 transition-colors duration-1000 ${
          isDark ? "bg-cyan-900/30" : "bg-pink-200"
        }`}
      />
    </div>
  );
}
