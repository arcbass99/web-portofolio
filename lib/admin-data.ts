import type {
  AboutMe,
  EditableTable,
  PortfolioItem,
  PortfolioMediaType,
  ProfileHighlight,
  ProfileHighlightCategory,
  ServiceItem,
  SocialLink,
} from "../types/content";
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

export const fetchAdminData = async (): Promise<AdminData> => {
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

export const createPortfolio = async (payload: PortfolioPayload) => {
  const { data, error } = await supabase
    .from("portfolio")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Data karya baru tidak berhasil dikembalikan.");

  return data as PortfolioItem;
};

export const updatePortfolio = async (
  id: number,
  payload: PortfolioPayload,
) => {
  const { data, error } = await supabase
    .from("portfolio")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("Data karya yang diperbarui tidak ditemukan.");

  return data as PortfolioItem;
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
