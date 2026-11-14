import { NextResponse, type NextRequest } from "next/server";
import {
  hashClientIp,
  incrementMetricField,
  recordClapBatch,
} from "../../../lib/redis";
import { metricsEventSchema } from "../../../lib/validations";

const BOT_UA_PATTERN = /bot|crawl|spider|slurp|headless|lighthouse|bingpreview/i;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";
  if (BOT_UA_PATTERN.test(userAgent)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = metricsEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Payload tidak valid." },
      { status: 400 },
    );
  }

  const event = parsed.data;

  switch (event.type) {
    case "pageview": {
      await incrementMetricField(
        "site_stats",
        event.page === "home" ? "home_views" : "galeri_page_views",
      );
      return NextResponse.json({ ok: true });
    }

    case "item_view": {
      await incrementMetricField("views", String(event.itemId));
      return NextResponse.json({ ok: true });
    }

    case "service_click": {
      await incrementMetricField("service_clicks", String(event.serviceId));
      return NextResponse.json({ ok: true });
    }

    case "sifan_tour": {
      await incrementMetricField("site_stats", "sifan_tours");
      return NextResponse.json({ ok: true });
    }

    case "clap": {
      const ipHash = hashClientIp(getClientIp(request));
      const result = await recordClapBatch(event.itemId, event.delta, ipHash);
      return NextResponse.json({
        ok: true,
        count: result.count,
        limited: result.limited,
        fallback: result.fallback ?? false,
      });
    }
  }
}
