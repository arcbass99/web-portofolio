import type { MetricsEventPayload } from "./validations";
import { MAX_CLAPS_PER_ITEM } from "./gallery";

const CLAP_STORAGE_KEY = "imnafis_galeri_claps_v1";

export type SifanReactDetail = {
  kind: "clap" | "service" | "modal_open" | "filter";
  label?: string;
  clapsAdded?: number;
};

export const isLikelyBot = (): boolean => {
  if (typeof navigator === "undefined") return true;
  return Boolean(navigator.webdriver);
};

/**
 * Sends a metric payload using `sendBeacon` (preferred when leaving/opening external tabs)
 * or `fetch` with `keepalive`.
 */
export function sendMetricEvent(
  payload: MetricsEventPayload,
  useBeacon = false,
): void {
  if (typeof window === "undefined" || isLikelyBot()) return;

  const body = JSON.stringify(payload);

  if (useBeacon && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/metrics", blob)) {
        return;
      }
    } catch {
      // Fall through to fetch
    }
  }

  void fetch("/api/metrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Ignore transient network errors for non-blocking telemetry
  });
}

/**
 * Ensures an analytics event only fires once per browser session.
 */
export function trackOncePerSession(
  sessionKey: string,
  payload: MetricsEventPayload,
  useBeacon = false,
): void {
  if (typeof window === "undefined" || isLikelyBot()) return;

  const storageKey = `imnafis_tracked_${sessionKey}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // Proceed even if sessionStorage is restricted in private browsing
  }

  sendMetricEvent(payload, useBeacon);
}

/**
 * Tracks a debounced batch of Claps and returns the authoritative total count if available.
 */
export async function postClapBatch(
  itemId: number,
  delta: number,
): Promise<{ count: number; limited: boolean; fallback?: boolean } | null> {
  if (typeof window === "undefined" || isLikelyBot()) return null;

  try {
    const res = await fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "clap", itemId, delta }),
      keepalive: true,
    });

    if (!res.ok) return null;
    const data = (await res.json()) as {
      ok?: boolean;
      count?: number;
      limited?: boolean;
      fallback?: boolean;
    };

    if (typeof data.count === "number") {
      return {
        count: data.count,
        limited: Boolean(data.limited),
        fallback: data.fallback,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function getLocalUserClaps(itemId: number): number {
  if (typeof window === "undefined") return 0;

  try {
    const raw = window.localStorage.getItem(CLAP_STORAGE_KEY);
    if (!raw) return 0;
    const map = JSON.parse(raw) as Record<string, number>;
    const val = Number(map[String(itemId)] ?? 0);
    return Number.isFinite(val)
      ? Math.min(MAX_CLAPS_PER_ITEM, Math.max(0, Math.floor(val)))
      : 0;
  } catch {
    return 0;
  }
}

export function saveLocalUserClaps(itemId: number, claps: number): void {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(CLAP_STORAGE_KEY);
    const map: Record<string, number> = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[String(itemId)] = Math.min(
      MAX_CLAPS_PER_ITEM,
      Math.max(0, Math.floor(claps)),
    );
    window.localStorage.setItem(CLAP_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("imnafis:claps-sync"));
  } catch {
    // Ignore quota/storage errors
  }
}

export function getSessionTotalUserClaps(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(CLAP_STORAGE_KEY);
    if (!raw) return 0;
    const map = JSON.parse(raw) as Record<string, number>;
    return Object.values(map).reduce(
      (sum, v) => sum + (Number.isFinite(Number(v)) ? Number(v) : 0),
      0,
    );
  } catch {
    return 0;
  }
}

export function notifySifan(detail: SifanReactDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<SifanReactDetail>("sifan:react", { detail }));
}
