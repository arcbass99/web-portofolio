import type { MetadataRoute } from "next";

const siteUrl = "https://im-nafis.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/galeri`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
