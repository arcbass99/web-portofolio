import type { SocialLink } from "../types/content";

export type PrimaryContactInfo = {
  href: string;
  label: string;
  isExternal: boolean;
};

const getContactPriority = (social: SocialLink): number => {
  const title = social.title?.toLowerCase() || "";
  const url = social.url?.toLowerCase() || "";

  if (
    title.includes("whatsapp") ||
    title.includes("wa") ||
    url.includes("wa.me")
  ) {
    return 1;
  }

  if (
    title.includes("email") ||
    title.includes("mail") ||
    url.includes("mailto:")
  ) {
    return 2;
  }

  if (title.includes("instagram") || title.includes("ig")) {
    return 3;
  }

  return 10;
};

/**
 * Picks the highest-priority social link for primary CTA / footer contact buttons.
 */
export function resolvePrimaryContact(
  socials: SocialLink[],
  fallbackHref = "#track-record",
): PrimaryContactInfo {
  const primaryContact =
    [...socials]
      .filter((social) => Boolean(social.url))
      .sort(
        (first, second) =>
          getContactPriority(first) - getContactPriority(second),
      )[0] || null;

  const contactTitle = primaryContact?.title?.toLowerCase() || "";
  const contactUrl = primaryContact?.url?.toLowerCase() || "";
  const isWhatsappContact =
    contactTitle.includes("whatsapp") ||
    contactTitle.includes("wa") ||
    contactUrl.includes("wa.me");
  const isEmailContact =
    contactTitle.includes("email") ||
    contactTitle.includes("mail") ||
    contactUrl.includes("mailto:");
  const isInstagramContact =
    contactTitle.includes("instagram") || contactTitle.includes("ig");

  const href = primaryContact?.url || fallbackHref;
  const isExternal = Boolean(primaryContact?.url);
  const label = primaryContact
    ? isWhatsappContact
      ? "Hubungi via WhatsApp"
      : isEmailContact
        ? "Kirim Email"
        : isInstagramContact
          ? "Hubungi via Instagram"
          : "Hubungi Saya"
    : "Jelajahi Profil";

  return { href, label, isExternal };
}
