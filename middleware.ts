import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  
  if (request.nextUrl.pathname.startsWith("/admin/login") || request.nextUrl.pathname.startsWith("/api/")) {
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return new NextResponse("Terlalu banyak permintaan. Silakan coba lagi nanti.", { status: 429 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/login", "/api/:path*"],
};