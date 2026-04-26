import { NextRequest, NextResponse } from "next/server";
import { buildUpstreamUrl } from "@/lib/server/upstream";

export const dynamic = "force-dynamic";

/**
 * Proxies requests to /api/v1/workspace/:id/api-key
 * Supports POST (create) and GET (list) operations.
 */
async function proxy(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const target = buildUpstreamUrl(`/workspace/${params.id}/api-key`);
  const authHeader = request.headers.get("authorization") ?? "";

  if (process.env.NODE_ENV === "development") {
    console.log(`[basktre:proxy] ${request.method} /api/v1/workspace/${params.id}/api-key → forwarding to`, target);
  }

  const init: RequestInit = {
    method: request.method,
    headers: {
      "Content-Type": request.headers.get("content-type") || "application/json",
      Authorization: authHeader,
    },
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  try {
    const upstream = await fetch(target, init);
    const text = await upstream.text();
    const contentType = upstream.headers.get("content-type") ?? "application/json";

    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error("[basktre:proxy] upstream fetch failed:", err);
    return NextResponse.json(
      { message: "Could not reach API key endpoint." },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
