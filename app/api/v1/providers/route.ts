import { NextResponse } from "next/server";
import { buildUpstreamUrl } from "@/lib/server/upstream";

export const dynamic = "force-dynamic";

/**
 * Proxies GET /api/v1/providers to the Go API gateway.
 * Public — no auth required.
 */
export async function GET() {
  const target = buildUpstreamUrl("/providers");

  if (process.env.NODE_ENV === "development") {
    console.log("[basktre:proxy] GET /api/v1/providers → forwarding to", target);
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    });
  } catch (err) {
    console.error("[basktre:proxy] upstream fetch failed:", err);
    return NextResponse.json(
      { message: "Could not reach providers API." },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  const contentType = upstream.headers.get("content-type") ?? "application/json";

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": contentType }
  });
}
