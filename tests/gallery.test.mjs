import test from "node:test";
import assert from "node:assert/strict";
import {
  clampClapDelta,
  extractUniqueTags,
  filterGalleryItems,
  formatCompactCount,
  getHomeFeaturedPortfolios,
  parseRedisHashCounts,
  parseTags,
} from "../lib/gallery.ts";
import { metricsEventSchema } from "../lib/validations.ts";
import {
  buildTreatReaction,
  getCandyProgressPercent,
  getCandyTier,
  getGreeting,
} from "../components/public/sifanData.ts";

const sampleItems = [
  {
    id: 1,
    title: "Portofolio Web",
    description: "Aplikasi web Next.js",
    tags: "Web, UI/UX",
    media_url: "abc",
    media_type: "image",
    sort_order: 10,
    is_featured: false,
  },
  {
    id: 2,
    title: "Poster Kampus",
    description: "Desain acara UKM",
    tags: "Canva, Dokumentasi",
    media_url: "def",
    media_type: "image",
    sort_order: 20,
    is_featured: true,
  },
  {
    id: 3,
    title: "Aftermovie Raker",
    description: "Rekap kegiatan himpunan",
    tags: "Dokumentasi, Video",
    media_url: "ghi",
    media_type: "video",
    sort_order: 30,
    is_featured: false,
  },
  {
    id: 4,
    title: "Riset Biologi",
    description: "Visualisasi data lapangan",
    tags: "biologi, Web",
    media_url: "jkl",
    media_type: "image",
    sort_order: 40,
    is_featured: true,
  },
  {
    id: 5,
    title: "Makrab Angkatan",
    description: "Foto bersama panitia",
    tags: "Dokumentasi",
    media_url: "mno",
    media_type: "image",
    sort_order: 50,
    is_featured: false,
  },
];

test("getHomeFeaturedPortfolios returns featured items when marked", () => {
  const result = getHomeFeaturedPortfolios(sampleItems);
  assert.deepEqual(
    result.map((item) => item.id),
    [2, 4],
  );
});

test("getHomeFeaturedPortfolios falls back to top N when none are featured", () => {
  const unfeatured = sampleItems.map((item) => ({ ...item, is_featured: false }));
  const result = getHomeFeaturedPortfolios(unfeatured, 4);
  assert.equal(result.length, 4);
  assert.deepEqual(
    result.map((item) => item.id),
    [1, 2, 3, 4],
  );
});

test("parseTags and extractUniqueTags deduplicate case-insensitively and sort by usage", () => {
  assert.deepEqual(parseTags(" Web, ui/ux, web , ,  Canva "), [
    "Web",
    "ui/ux",
    "Canva",
  ]);
  const extracted = extractUniqueTags(sampleItems);
  assert.equal(extracted[0].tag, "Dokumentasi");
  assert.equal(extracted[0].count, 3);
  const webEntry = extracted.find((t) => t.tag.toLowerCase() === "web");
  assert.equal(webEntry?.count, 2);
});

test("filterGalleryItems filters by mediaType, tag, and search query", () => {
  const videos = filterGalleryItems(sampleItems, {
    mediaType: "video",
    tag: null,
  });
  assert.deepEqual(
    videos.map((v) => v.id),
    [3],
  );

  const docsImages = filterGalleryItems(sampleItems, {
    mediaType: "image",
    tag: "dokumentasi",
  });
  assert.deepEqual(
    docsImages.map((v) => v.id),
    [2, 5],
  );

  const searched = filterGalleryItems(sampleItems, {
    mediaType: "all",
    tag: null,
    query: "biologi",
  });
  assert.deepEqual(
    searched.map((v) => v.id),
    [4],
  );
});

test("clampClapDelta and formatCompactCount enforce safe bounds", () => {
  assert.equal(clampClapDelta(3.8), 3);
  assert.equal(clampClapDelta(999), 10);
  assert.equal(clampClapDelta(-5), 0);
  assert.equal(clampClapDelta(Number.NaN), 0);
  assert.equal(formatCompactCount(0), "0");
  assert.equal(formatCompactCount(950), "950");
  assert.equal(formatCompactCount(1250), "1.3K");
  assert.equal(formatCompactCount(2000), "2K");
});

test("metricsEventSchema validates legitimate events and rejects spam/invalid payloads", () => {
  assert.equal(
    metricsEventSchema.safeParse({ type: "pageview", page: "galeri" }).success,
    true,
  );
  assert.equal(
    metricsEventSchema.safeParse({ type: "clap", itemId: 4, delta: 5 }).success,
    true,
  );
  assert.equal(
    metricsEventSchema.safeParse({ type: "sifan_tour" }).success,
    true,
  );

  // Reject out-of-bounds clap deltas and unknown pages
  assert.equal(
    metricsEventSchema.safeParse({ type: "clap", itemId: 4, delta: 0 }).success,
    false,
  );
  assert.equal(
    metricsEventSchema.safeParse({ type: "clap", itemId: 4, delta: 25 }).success,
    false,
  );
  assert.equal(
    metricsEventSchema.safeParse({ type: "pageview", page: "admin" }).success,
    false,
  );
});

test("parseRedisHashCounts normalizes both Upstash REST arrays and hash objects", () => {
  assert.deepEqual(
    parseRedisHashCounts(["4", "12", "7", "3.9", "9", "0", "bad", "nan", "odd"]),
    { 4: 12, 7: 3 },
  );
  assert.deepEqual(
    parseRedisHashCounts({ home_views: "42", galeri_page_views: 15, empty: -2 }),
    { home_views: 42, galeri_page_views: 15 },
  );
  assert.deepEqual(parseRedisHashCounts(null), {});
  assert.deepEqual(parseRedisHashCounts([]), {});
});

test("getCandyTier and getCandyProgressPercent advance across all 5 evolution levels and clamp bounds", () => {
  assert.equal(getCandyTier(0).level, 1);
  assert.equal(getCandyTier(-4).level, 1);
  assert.equal(getCandyTier(Number.NaN).level, 1);
  assert.equal(getCandyProgressPercent(0), 0);
  assert.equal(getCandyProgressPercent(1), 33);

  const lv2 = getCandyTier(3);
  assert.equal(lv2.level, 2);
  assert.equal(lv2.label, "Akrab");
  assert.equal(lv2.hasStarClip, false);
  assert.equal(getCandyProgressPercent(3, lv2), 0);

  const lv3 = getCandyTier(6);
  assert.equal(lv3.level, 3);
  assert.equal(lv3.hasStarClip, true);
  assert.equal(lv3.hasCottonCandyTint, false);
  assert.equal(getCandyProgressPercent(8, lv3), 50);

  const lv4 = getCandyTier(10);
  assert.equal(lv4.level, 4);
  assert.equal(lv4.hasStarClip, true);
  assert.equal(lv4.hasCottonCandyTint, true);
  assert.equal(lv4.hasCrown, false);

  const lv5 = getCandyTier(15);
  assert.equal(lv5.level, 5);
  assert.equal(lv5.label, "Sultan Awan");
  assert.equal(lv5.hasCottonCandyTint, true);
  assert.equal(lv5.hasCrown, true);
  assert.equal(getCandyProgressPercent(99, lv5), 100);
});

test("buildTreatReaction triggers milestone spins, bursts, sugar rush, and tier greetings", () => {
  const m3 = buildTreatReaction(3);
  assert.equal(m3.reaction.mood, "cool");
  assert.equal(m3.spinDelta, 0);
  assert.equal(m3.burstCount, 4);

  const m6 = buildTreatReaction(6);
  assert.equal(m6.spinDelta, 1);
  assert.equal(m6.burstCount, 5);

  const m10 = buildTreatReaction(10);
  assert.equal(m10.reaction.mood, "wheee");
  assert.equal(m10.spinDelta, 1);
  assert.equal(m10.burstCount, 6);

  const m15 = buildTreatReaction(15);
  assert.equal(m15.spinDelta, 2);
  assert.equal(m15.burstCount, 7);

  const m20 = buildTreatReaction(20);
  assert.equal(m20.spinDelta, 1);
  assert.equal(m20.burstCount, 6);

  const invalid = buildTreatReaction(-2);
  assert.equal(invalid.spinDelta, 0);
  assert.match(invalid.reaction.text ?? "", /\(1\/3 menuju Lv\.2\)/);

  assert.match(getGreeting("home", 10), /Bestie Gulali \(10/);
  assert.match(getGreeting("galeri", 15), /Awan Sultan \(15/);
});
