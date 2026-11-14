import type {
  AboutMe,
  AdminAnalyticsData,
  EditableTable,
  PortfolioItem,
  PortfolioMediaType,
  ProfileHighlight,
  ProfileHighlightCategory,
  ServiceItem,
  SocialLink,
} from "../types/content";
import { getErrorMessage } from "./errors";
import { supabase } from "./supabase";

export type AdminData = {
  about: AboutMe | null;
  socials: SocialLink[];
  portfolios: PortfolioItem[];
  services: ServiceItem[];
  highlights: ProfileHighlight[];
};

type AboutPayload = {
  headline: string;
  description: string;
  banner_url: string;
};

type SocialPayload = {
  title: string;
  url: string;
};

type PortfolioPayload = {
  title: string;
  description: string;
  tags: string;
  media_url: string;
  media_type: PortfolioMediaType;
  sort_order: number;
  is_featured?: boolean;
};

export type PortfolioSaveResult = {
  item: PortfolioItem;
  missingFeaturedColumn: boolean;
};

const isMissingFeaturedColumnError = (error: unknown): boolean => {
  const msg = getErrorMessage(error, "").toLowerCase();
  return msg.includes("is_featured");
};

type ServicePayload = {
  title: string;
  description: string;
  image_url: string;
  target_url: string;
  sort_order: number;
};

type ProfileHighlightPayload = {
  category: ProfileHighlightCategory;
  period: string;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
};

export const getAdminSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  return session;
};

export const signOutGlobally = async () => {
  const { error } = await supabase.auth.signOut({ scope: "global" });

  if (error) throw error;
};

const isJwtFutureError = (error: unknown): boolean =>
  getErrorMessage(error, "").toLowerCase().includes("issued at future");

const waitMs = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const queryAdminTables = async (): Promise<AdminData> => {
  const [aboutRes, socialRes, portRes, servRes, highlightRes] =
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
    ]);

  if (aboutRes.error) throw aboutRes.error;
  if (socialRes.error) throw socialRes.error;
  if (portRes.error) throw portRes.error;
  if (servRes.error) throw servRes.error;
  if (highlightRes.error) throw highlightRes.error;

  return {
    about: aboutRes.data as AboutMe | null,
    socials: (socialRes.data || []) as SocialLink[],
    portfolios: (portRes.data || []) as PortfolioItem[],
    services: (servRes.data || []) as ServiceItem[],
    highlights: (highlightRes.data || []) as ProfileHighlight[],
  };
};

export const fetchAdminData = async (): Promise<AdminData> => {
  const retryDelaysMs = [1800, 2600];

  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    try {
      return await queryAdminTables();
    } catch (error) {
      if (isJwtFutureError(error) && attempt < retryDelaysMs.length) {
        await waitMs(retryDelaysMs[attempt]);
        continue;
      }
      throw error;
    }
  }

  return queryAdminTables();
};

export const saveAbout = async (payload: AboutPayload) => {
  const { data: existing, error: selectError } = await supabase
    .from("about_me")
    .select("id")
    .maybeSingle();

  if (selectError) throw selectError;

  if (existing) {
    const { error } = await supabase
      .from("about_me")
      .update(payload)
      .eq("id", existing.id);

    if (error) throw error;

    return;
  }

  const { error } = await supabase.from("about_me").insert([payload]);

  if (error) throw error;
};

export const createSocial = async (payload: SocialPayload) => {
  const { data, error } = await supabase
    .from("social_links")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Data social baru tidak berhasil dikembalikan.");

  return data as SocialLink;
};

export const updateSocial = async (id: number, payload: SocialPayload) => {
  const { data, error } = await supabase
    .from("social_links")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Data social yang diperbarui tidak ditemukan.");

  return data as SocialLink;
};

const toCorePortfolioPayload = (payload: PortfolioPayload) => ({
  title: payload.title,
  description: payload.description,
  tags: payload.tags,
  media_url: payload.media_url,
  media_type: payload.media_type,
  sort_order: payload.sort_order,
});

const savePortfolioWithFeaturedFallback = async (
  runQuery: (
    data: PortfolioPayload | ReturnType<typeof toCorePortfolioPayload>,
  ) => PromiseLike<{ data: unknown; error: unknown }>,
  payload: PortfolioPayload,
  missingErrorMessage: string,
): Promise<PortfolioSaveResult> => {
  const withFeatured: PortfolioPayload = {
    ...payload,
    is_featured: Boolean(payload.is_featured),
  };

  const { data, error } = await runQuery(withFeatured);
  if (!error && data) {
    return { item: data as PortfolioItem, missingFeaturedColumn: false };
  }

  if (error && isMissingFeaturedColumnError(error)) {
    const { data: fallbackData, error: fallbackError } = await runQuery(
      toCorePortfolioPayload(payload),
    );
    if (fallbackError) throw fallbackError;
    if (!fallbackData) throw new Error(missingErrorMessage);

    return {
      item: fallbackData as PortfolioItem,
      missingFeaturedColumn: true,
    };
  }

  if (error) throw error;
  throw new Error(missingErrorMessage);
};

export const createPortfolio = async (
  payload: PortfolioPayload,
): Promise<PortfolioSaveResult> =>
  savePortfolioWithFeaturedFallback(
    (data) => supabase.from("portfolio").insert([data]).select().single(),
    payload,
    "Data galeri baru tidak berhasil dikembalikan.",
  );

export const updatePortfolio = async (
  id: number,
  payload: PortfolioPayload,
): Promise<PortfolioSaveResult> =>
  savePortfolioWithFeaturedFallback(
    (data) =>
      supabase.from("portfolio").update(data).eq("id", id).select().single(),
    payload,
    "Data galeri yang diperbarui tidak ditemukan.",
  );

export const setPortfolioFeatured = async (
  id: number,
  isFeatured: boolean,
): Promise<PortfolioItem> => {
  const { data, error } = await supabase
    .from("portfolio")
    .update({ is_featured: isFeatured })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (isMissingFeaturedColumnError(error)) {
      throw new Error(
        "Kolom 'is_featured' belum ada di tabel portfolio Supabase. Jalankan SQL migrasi terlebih dahulu.",
      );
    }
    throw error;
  }

  if (!data) {
    throw new Error("Item galeri tidak ditemukan.");
  }

  return data as PortfolioItem;
};

export const fetchAdminAnalytics = async (
  accessToken: string,
): Promise<AdminAnalyticsData> => {
  const response = await fetch("/api/admin/metrics", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal memuat statistik dari server.");
  }

  return (await response.json()) as AdminAnalyticsData;
};

export const createService = async (payload: ServicePayload) => {
  const { data, error } = await supabase
    .from("services")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Data layanan baru tidak berhasil dikembalikan.");

  return data as ServiceItem;
};

export const updateService = async (id: number, payload: ServicePayload) => {
  const { data, error } = await supabase
    .from("services")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Data layanan yang diperbarui tidak ditemukan.");

  return data as ServiceItem;
};


export const createProfileHighlight = async (
  payload: ProfileHighlightPayload,
) => {
  const { data, error } = await supabase
    .from("profile_highlights")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  if (!data) {
    throw new Error("Data track record baru tidak berhasil dikembalikan.");
  }

  return data as ProfileHighlight;
};

export const updateProfileHighlight = async (
  id: number,
  payload: ProfileHighlightPayload,
) => {
  const { data, error } = await supabase
    .from("profile_highlights")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  if (!data) {
    throw new Error("Data track record yang diperbarui tidak ditemukan.");
  }

  return data as ProfileHighlight;
};

export const deleteAdminItem = async (table: EditableTable, id: number) => {
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) throw error;
};
