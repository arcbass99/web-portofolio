import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://im-nafis.vercel.app";
const siteName = "Nafis Portfolio";
const siteTitle = "Nafis — Personal Portfolio";
const siteDescription =
  "Portfolio pribadi Nafis yang menampilkan profil, karya pilihan, layanan, dan produk digital yang sedang dikembangkan.";
const ogImage = "/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Nafis" }],
  creator: "Nafis",
  publisher: "Nafis",
  keywords: [
    "Nafis",
    "portfolio Nafis",
    "personal portfolio",
    "web portfolio",
    "portfolio developer",
    "portfolio digital",
    "produk digital",
    "layanan digital",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Nafis Personal Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${jakarta.className} antialiased bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}