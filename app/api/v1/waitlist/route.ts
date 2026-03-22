import { NextResponse } from "next/server";
import { buildWaitlistUpstreamUrl } from "@/lib/server/upstream-waitlist";

/**
 * Proxies waitlist POSTs to the real backend so the browser only talks to Next (no CORS).
 * Set INTERNAL_API_ORIGIN (host only) + INTERNAL_API_PREFIX (e.g. /api/v1) in .env / Vercel.
 */
export async function POST(request: Request) {
  const target = buildWaitlistUpstreamUrl();
  const body = await request.text();

  if (process.env.NODE_ENV === "development") {
    console.log("[basktre:proxy] POST /api/v1/waitlist → forwarding to", target);
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: "no-store"
    });
  } catch (err) {
    console.error("[basktre:proxy] upstream fetch failed:", err);
    return NextResponse.json(
      { message: "Could not reach waitlist API. Is the backend running?" },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  const contentType = upstream.headers.get("content-type") ?? "application/json";

  if (process.env.NODE_ENV === "development") {
    console.log("[basktre:proxy] upstream status:", upstream.status, "body length:", text.length);
  }

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": contentType }
  });
}
