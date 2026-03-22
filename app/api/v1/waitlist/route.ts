import { NextResponse } from "next/server";

/**
 * Proxies waitlist POSTs to the real backend so the browser only talks to Next (no CORS).
 * Set INTERNAL_API_BASE_URL in .env.local (e.g. http://localhost:3001/api/v1).
 */
function upstreamWaitlistUrl(): string {
  const base = process.env.INTERNAL_API_BASE_URL ?? "http://localhost:3001/api/v1";
  const trimmed = base.replace(/\/$/, "");
  return `${trimmed}/waitlist`;
}

export async function POST(request: Request) {
  const target = upstreamWaitlistUrl();
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
