import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Barlow } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-barlow",
});

const siteUrl = "https://im-nafis.vercel.app";
const siteName = "I'm Nafis";
const siteTitle = "I'm Nafis — Profil, Track Record & Karya Digital";
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
        alt: "I'm Nafis — Profil, Track Record, dan Karya Digital",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${instrumentSerif.variable} ${barlow.variable}`}
    >
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  );
}