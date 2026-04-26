import { NextRequest, NextResponse } from "next/server";
import { buildUpstreamUrl } from "@/lib/server/upstream";

export const dynamic = "force-dynamic";

/**
 * Proxies GET /api/v1/models/list?tag=... to the Go API gateway.
 * Requires Authorization: Bearer <google-id-token> header.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const target = buildUpstreamUrl(`/models/list${tag ? `?tag=${tag}` : ""}`);
  const authHeader = request.headers.get("authorization") ?? "";

  if (process.env.NODE_ENV === "development") {
    console.log("[basktre:proxy] GET /api/v1/models/list → forwarding to", target);
  }

  try {
    const upstream = await fetch(target, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      cache: "no-store",
    });

    const text = await upstream.text();
    const contentType = upstream.headers.get("content-type") ?? "application/json";

    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error("[basktre:proxy] upstream fetch failed:", err);
    return NextResponse.json(
      { message: "Could not reach models API." },
      { status: 502 }
    );
  }
}
