import { supabase } from "../lib/supabase";
import { getErrorMessage } from "../lib/errors";
import { getHomeFeaturedPortfolios } from "../lib/gallery";
import { getPublicClaps } from "../lib/redis";
import type {
  AboutMe,
  PortfolioItem,
  ProfileHighlight,
  ServiceItem,
  SocialLink,
} from "../types/content";
import { LandingPageClient } from "../components/public/LandingPageClient";

export const revalidate = 30;

type PublicData = {
  about: AboutMe | null;
  socials: SocialLink[];
  portfolios: PortfolioItem[];
  totalGalleryCount: number;
  initialClaps: Record<string, number>;
  services: ServiceItem[];
  highlights: ProfileHighlight[];
  publicError: string | null;
};

async function getPublicData(): Promise<PublicData> {
  try {
    const [aboutRes, socialRes, portRes, servRes, highlightRes, allClaps] =
      await Promise.all([
        supabase.from("about_me").select("*").maybeSingle(),
        supabase.from("social_links").select("*"),
        supabase
          .from("portfolio")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("services")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true }),
        supabase
          .from("profile_highlights")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true }),
        getPublicClaps(),
      ]);

    if (aboutRes.error) throw aboutRes.error;
    if (socialRes.error) throw socialRes.error;
    if (portRes.error) throw portRes.error;
    if (servRes.error) throw servRes.error;
    if (highlightRes.error) throw highlightRes.error;

    const allPortfolios = (portRes.data || []) as PortfolioItem[];
    const featuredPortfolios = getHomeFeaturedPortfolios(allPortfolios);
    const homeClaps: Record<string, number> = {};

    for (const item of featuredPortfolios) {
      const key = String(item.id);
      if (allClaps[key]) {
        homeClaps[key] = allClaps[key];
      }
    }

    return {
      about: aboutRes.data as AboutMe | null,
      socials: (socialRes.data || []) as SocialLink[],
      portfolios: featuredPortfolios,
      totalGalleryCount: allPortfolios.length,
      initialClaps: homeClaps,
      services: (servRes.data || []) as ServiceItem[],
      highlights: (highlightRes.data || []) as ProfileHighlight[],
      publicError: null,
    };
  } catch (error) {
    return {
      about: null,
      socials: [],
      portfolios: [],
      totalGalleryCount: 0,
      initialClaps: {},
      services: [],
      highlights: [],
      publicError: getErrorMessage(
        error,
        "Data belum berhasil dimuat sepenuhnya.",
      ),
    };
  }
}

export default async function LandingPage() {
  const publicData = await getPublicData();

  return <LandingPageClient {...publicData} />;
}
