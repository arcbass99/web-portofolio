import type { Metadata } from "next";
import { supabase } from "../../lib/supabase";
import { getErrorMessage } from "../../lib/errors";
import { getPublicClaps } from "../../lib/redis";
import type { AboutMe, PortfolioItem, SocialLink } from "../../types/content";
import { GalleryArchiveClient } from "../../components/public/GalleryArchiveClient";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Arsip lengkap karya, proyek, dan dokumentasi kegiatan I'm Nafis.",
};

type GaleriPageData = {
  items: PortfolioItem[];
  bannerUrl: string;
  socials: SocialLink[];
  highlightsCount: number;
  servicesCount: number;
  initialClaps: Record<string, number>;
  publicError: string | null;
};

async function getGaleriPageData(): Promise<GaleriPageData> {
  try {
    const [aboutRes, socialRes, portRes, servCountRes, hlCountRes, claps] =
      await Promise.all([
        supabase.from("about_me").select("banner_url").maybeSingle(),
        supabase.from("social_links").select("*"),
        supabase
          .from("portfolio")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase
          .from("profile_highlights")
          .select("id", { count: "exact", head: true }),
        getPublicClaps(),
      ]);

    if (portRes.error) throw portRes.error;

    const about = aboutRes.data as Pick<AboutMe, "banner_url"> | null;

    return {
      items: (portRes.data || []) as PortfolioItem[],
      bannerUrl: about?.banner_url || "",
      socials: (socialRes.data || []) as SocialLink[],
      highlightsCount: hlCountRes.count ?? 0,
      servicesCount: servCountRes.count ?? 0,
      initialClaps: claps,
      publicError: null,
    };
  } catch (error) {
    return {
      items: [],
      bannerUrl: "",
      socials: [],
      highlightsCount: 0,
      servicesCount: 0,
      initialClaps: {},
      publicError: getErrorMessage(
        error,
        "Data galeri belum berhasil dimuat sepenuhnya.",
      ),
    };
  }
}

export default async function GaleriPage() {
  const data = await getGaleriPageData();

  return <GalleryArchiveClient {...data} />;
}
