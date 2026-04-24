import { NextRequest, NextResponse } from "next/server";
import { buildUpstreamUrl } from "@/lib/server/upstream";

export const dynamic = "force-dynamic";

/**
 * Proxies POST /api/v1/workspace to the Go API gateway.
 * Requires Authorization: Bearer <google-id-token> header.
 * The gateway's GoogleAuthMiddleware validates the token and enriches the body.
 */
export async function POST(request: NextRequest) {
  const target = buildUpstreamUrl("/workspace");
  const body = await request.text();
  const authHeader = request.headers.get("authorization") ?? "";

  if (process.env.NODE_ENV === "development") {
    console.log("[basktre:proxy] POST /api/v1/workspace → forwarding to", target);
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader
      },
      body,
      cache: "no-store"
    });
  } catch (err) {
    console.error("[basktre:proxy] upstream fetch failed:", err);
    return NextResponse.json(
      { message: "Could not reach workspace API." },
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
