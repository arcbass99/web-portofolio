import crypto from "crypto";
import { Redis } from "@upstash/redis";
import type { AdminAnalyticsData, AnalyticsSiteStats } from "../types/content";
import { clampClapDelta, parseRedisHashCounts } from "./gallery";

const REDIS_KEYS = {
  CLAPS: "galeri:claps",
  VIEWS: "galeri:views",
  SERVICE_CLICKS: "services:clicks",
  SITE_STATS: "site:stats",
} as const;

const DAILY_IP_CLAP_LIMIT_PER_ITEM = 20;
const CLAP_CAP_TTL_SECONDS = 86400;

let cachedRedis: Redis | null | undefined;

/**
 * Lazily creates an Upstash Redis client if KV env vars are available.
 * Returns null cleanly when running without Redis credentials.
 */
export function getRedisClient(): Redis | null {
  if (cachedRedis !== undefined) {
    return cachedRedis;
  }

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    cachedRedis = null;
    return cachedRedis;
  }

  cachedRedis = new Redis({ url, token });
  return cachedRedis;
}

/**
 * Hashes a client IP so raw addresses are never stored in Redis keys.
 */
export function hashClientIp(ip: string): string {
  const salt = process.env.KV_REST_API_TOKEN?.slice(0, 12) || "im-nafis";
  return crypto
    .createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex")
    .slice(0, 16);
}

/**
 * Reads all gallery clap counts in a single Upstash REST request (`HGETALL`)
 * with Next.js ISR caching (`revalidate: 30`) so `/` and `/galeri` stay statically cached.
 * Returns `{}` on errors or unconfigured Redis so public pages never fail.
 */
export async function getPublicClaps(): Promise<Record<string, number>> {
  const url = process.env.KV_REST_API_URL?.replace(/\/+$/, "");
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return {};

  try {
    const response = await fetch(
      `${url}/hgetall/${encodeURIComponent(REDIS_KEYS.CLAPS)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 30 },
      },
    );

    if (!response.ok) {
      return {};
    }

    const payload = (await response.json()) as { result?: unknown };
    return parseRedisHashCounts(payload?.result);
  } catch (error) {
    console.error("Redis getPublicClaps error:", error);
    return {};
  }
}

/**
 * Increments a single hash metric counter (`INCR` equivalent in hash).
 */
export async function incrementMetricField(
  bucket: "views" | "service_clicks" | "site_stats",
  field: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const key =
    bucket === "views"
      ? REDIS_KEYS.VIEWS
      : bucket === "service_clicks"
        ? REDIS_KEYS.SERVICE_CLICKS
        : REDIS_KEYS.SITE_STATS;

  try {
    await redis.hincrby(key, field, 1);
  } catch (error) {
    console.error("Redis incrementMetricField error:", error);
  }
}

/**
 * Records a batched clap increment for an item, enforcing a daily per-IP ceiling
 * so automated requests cannot inflate counts or exhaust free-tier limits.
 */
export async function recordClapBatch(
  itemId: number,
  requestedDelta: number,
  ipHash: string,
): Promise<{ count: number; limited: boolean; fallback?: boolean }> {
  const redis = getRedisClient();
  const safeDelta = clampClapDelta(requestedDelta);

  if (!redis) {
    return { count: 0, limited: false, fallback: true };
  }

  if (safeDelta <= 0) {
    const current = Number(
      (await redis.hget<number | string>(REDIS_KEYS.CLAPS, String(itemId))) ?? 0,
    );
    return { count: Number.isFinite(current) ? current : 0, limited: false };
  }

  const capKey = `clap_cap:${ipHash}:${itemId}`;

  try {
    const usedToday = Number((await redis.get<number | string>(capKey)) ?? 0);
    const remaining = Math.max(
      0,
      DAILY_IP_CLAP_LIMIT_PER_ITEM - (Number.isFinite(usedToday) ? usedToday : 0),
    );

    if (remaining <= 0) {
      const current = Number(
        (await redis.hget<number | string>(REDIS_KEYS.CLAPS, String(itemId))) ??
          0,
      );
      return { count: Number.isFinite(current) ? current : 0, limited: true };
    }

    const appliedDelta = Math.min(safeDelta, remaining);

    const pipe = redis.pipeline();
    pipe.hincrby(REDIS_KEYS.CLAPS, String(itemId), appliedDelta);
    pipe.incrby(capKey, appliedDelta);
    pipe.expire(capKey, CLAP_CAP_TTL_SECONDS);

    const results = await pipe.exec<[number, number, number]>();
    const newCount = Number(results?.[0] ?? 0);

    return {
      count: Number.isFinite(newCount) ? newCount : 0,
      limited: appliedDelta < safeDelta,
    };
  } catch (error) {
    console.error("Redis recordClapBatch error:", error);
    return { count: 0, limited: false, fallback: true };
  }
}

/**
 * Fetches full analytics snapshot for `/admin` using a single Redis pipeline.
 */
export async function getAdminAnalytics(): Promise<AdminAnalyticsData> {
  const redis = getRedisClient();

  const emptyStats: AnalyticsSiteStats = {
    home_views: 0,
    galeri_page_views: 0,
    sifan_tours: 0,
  };

  if (!redis) {
    return {
      redisConfigured: false,
      siteStats: emptyStats,
      claps: {},
      views: {},
      serviceClicks: {},
    };
  }

  try {
    const pipe = redis.pipeline();
    pipe.hgetall(REDIS_KEYS.SITE_STATS);
    pipe.hgetall(REDIS_KEYS.CLAPS);
    pipe.hgetall(REDIS_KEYS.VIEWS);
    pipe.hgetall(REDIS_KEYS.SERVICE_CLICKS);

    const results = await pipe.exec<
      [
        Record<string, unknown> | null,
        Record<string, unknown> | null,
        Record<string, unknown> | null,
        Record<string, unknown> | null,
      ]
    >();

    const rawSite = parseRedisHashCounts(results?.[0]);

    return {
      redisConfigured: true,
      siteStats: {
        home_views: rawSite.home_views ?? 0,
        galeri_page_views: rawSite.galeri_page_views ?? 0,
        sifan_tours: rawSite.sifan_tours ?? 0,
      },
      claps: parseRedisHashCounts(results?.[1]),
      views: parseRedisHashCounts(results?.[2]),
      serviceClicks: parseRedisHashCounts(results?.[3]),
    };
  } catch (error) {
    console.error("Redis getAdminAnalytics error:", error);
    return {
      redisConfigured: false,
      siteStats: emptyStats,
      claps: {},
      views: {},
      serviceClicks: {},
    };
  }
}
