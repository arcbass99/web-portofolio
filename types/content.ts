import type { ReactNode } from "react";

export type ActiveTab =
  | "about"
  | "socials"
  | "track_record"
  | "portfolio"
  | "services";

export type PortfolioMediaType = "image" | "video";

export type EditableTable =
  | "social_links"
  | "portfolio"
  | "services"
  | "profile_highlights";

export type NoticeType = "success" | "error";

export type Notice = {
  type: NoticeType;
  message: string;
} | null;

export type AboutMe = {
  id: number;
  headline: string | null;
  description: string | null;
  banner_url: string | null;
};

export type SocialLink = {
  id: number;
  title: string | null;
  url: string | null;
};

export type PortfolioItem = {
  id: number;
  title: string | null;
  description: string | null;
  tags: string | null;
  media_url: string | null;
  media_type: string | null;
  sort_order: number | null;
};

export type ServiceItem = {
  id: number;
  title: string | null;
  description: string | null;
  image_url: string | null;
  target_url: string | null;
  sort_order: number | null;
};

export type ProfileHighlightCategory =
  | "education"
  | "achievement"
  | "leadership"
  | "skill";

export type ProfileHighlight = {
  id: number;
  category: ProfileHighlightCategory;
  period: string | null;
  title: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
};

export type ItemWithId = {
  id: number;
};

export type MenuItem = {
  id: ActiveTab;
  label: string;
  icon: ReactNode;
};
