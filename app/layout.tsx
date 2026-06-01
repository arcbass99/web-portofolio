import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://im-nafis.vercel.app";
const siteName = "Im Nafis";
const siteTitle = "Nafis — Profil, Track Record & Karya Digital";
const siteDescription =
  "Profil digital Nafis yang menampilkan perjalanan akademik, track record, karya pilihan, produk digital, dan ruang kolaborasi kreatif.";
const ogImage = "/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Muhammad Nafis Alfa Rizky" }],
  creator: "Muhammad Nafis Alfa Rizky",
  publisher: "Muhammad Nafis Alfa Rizky",
  keywords: [
    "Nafis",
    "Muhammad Nafis Alfa Rizky",
    "portfolio",
    "track record",
    "desain visual",
    "produk digital",
    "S1 Biologi UNESA",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Nafis — Profil, Track Record, dan Karya Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}
