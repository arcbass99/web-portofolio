import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Mengimpor font premium dengan variasi ketebalan yang lengkap
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  display: 'swap',
});

// Mengubah identitas web di tab browser dan metadata pencarian Google
export const metadata: Metadata = {
  title: "Ya ini Nafis",
  description: "Web profesional dari Nafis.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${jakarta.className} antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}