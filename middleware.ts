import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.KV_REST_API_URL;
const redisToken = process.env.KV_REST_API_TOKEN;

const ratelimit =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: new Redis({
          url: redisUrl,
          token: redisToken,
        }),
        limiter: Ratelimit.slidingWindow(10, "10 s"),
      })
    : null;

export async function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  if (
    ratelimit &&
    (request.nextUrl.pathname.startsWith("/admin/login") ||
      request.nextUrl.pathname.startsWith("/api/"))
  ) {
    try {
      const { success } = await ratelimit.limit(ip);

      if (!success) {
        return new NextResponse(
          "Terlalu banyak permintaan. Silakan coba lagi nanti.",
          { status: 429 }
        );
      }
    } catch (error) {
      console.error("Ratelimit error:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/login", "/api/:path*"],
};