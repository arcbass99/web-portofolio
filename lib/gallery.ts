import type { PortfolioItem } from "../types/content";

export const DEFAULT_HOME_GALLERY_FALLBACK_LIMIT = 4;
export const MAX_CLAPS_PER_ITEM = 10;

export type GalleryMediaFilter = "all" | "image" | "video";

export type GalleryFilterOptions = {
  mediaType: GalleryMediaFilter;
  tag: string | null;
  query?: string;
};

/**
 * Selects the representative items for the Home carousel.
 * Uses items marked `is_featured === true`; falls back to the top N items
 * if none are explicitly featured yet (or before DB migration).
 */
export function getHomeFeaturedPortfolios(
  items: PortfolioItem[],
  fallbackLimit = DEFAULT_HOME_GALLERY_FALLBACK_LIMIT,
): PortfolioItem[] {
  const featured = items.filter((item) => item.is_featured === true);

  if (featured.length > 0) {
    return featured;
  }

  return items.slice(0, Math.max(0, fallbackLimit));
}

/**
 * Splits a comma-separated tags string into clean, deduplicated tag labels.
 */
export function parseTags(tags?: string | null): string[] {
  if (!tags) return [];

  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of tags.split(",")) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

/**
 * Extracts unique tags sorted by usage frequency descending, then alphabetically.
 */
export function extractUniqueTags(
  items: PortfolioItem[],
): { tag: string; count: number }[] {
  const map = new Map<string, { tag: string; count: number }>();

  for (const item of items) {
    for (const tag of parseTags(item.tags)) {
      const key = tag.toLowerCase();
      const existing = map.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { tag, count: 1 });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.tag.localeCompare(b.tag, "id");
  });
}

/**
 * Filters gallery items on `/galeri` by media type, selected tag, and search query.
 */
export function filterGalleryItems(
  items: PortfolioItem[],
  options: GalleryFilterOptions,
): PortfolioItem[] {
  const normalizedTag = options.tag?.trim().toLowerCase() || null;
  const normalizedQuery = options.query?.trim().toLowerCase() || "";

  return items.filter((item) => {
    const itemType = item.media_type === "video" ? "video" : "image";

    if (options.mediaType !== "all" && itemType !== options.mediaType) {
      return false;
    }

    if (normalizedTag) {
      const itemTags = parseTags(item.tags).map((t) => t.toLowerCase());
      if (!itemTags.includes(normalizedTag)) {
        return false;
      }
    }

    if (normalizedQuery) {
      const haystack = `${item.title || ""} ${item.description || ""} ${item.tags || ""}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Clamps a clap batch increment cleanly to an allowed range.
 */
export function clampClapDelta(
  delta: number,
  max = MAX_CLAPS_PER_ITEM,
): number {
  if (!Number.isFinite(delta)) return 0;
  return Math.min(max, Math.max(0, Math.floor(delta)));
}

/**
 * Formats clap/view counters concisely (e.g. 1.2K when >= 1000).
 */
export function formatCompactCount(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(Math.floor(value));
}

/**
 * Normalizes both `@upstash/redis` hash objects (`{ k: v }`) and raw Upstash
 * REST `HGETALL` pair arrays (`[k1, v1, k2, v2, ...]`) into positive integer counts.
 */
export function parseRedisHashCounts(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") return {};

  const normalized: Record<string, number> = {};

  if (Array.isArray(raw)) {
    for (let i = 0; i + 1 < raw.length; i += 2) {
      const key = String(raw[i] ?? "");
      const parsed = Number(raw[i + 1]);
      if (key && Number.isFinite(parsed) && parsed > 0) {
        normalized[key] = Math.floor(parsed);
      }
    }
    return normalized;
  }

  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      normalized[key] = Math.floor(parsed);
    }
  }

  return normalized;
}
