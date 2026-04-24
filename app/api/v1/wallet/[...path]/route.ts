import { NextRequest, NextResponse } from "next/server";
import { buildUpstreamUrl } from "@/lib/server/upstream";

async function proxy(request: NextRequest, { params }: { params: { path: string[] } }) {
  const pathString = params.path.join("/");
  const url = new URL(request.url);
  const search = url.search;
  
  const target = buildUpstreamUrl(`/wallet/${pathString}${search}`);
  const authHeader = request.headers.get("authorization") ?? "";

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
    console.error(`[basktre:proxy] upstream fetch failed for ${target}:`, err);
    return NextResponse.json(
      { message: "Could not reach API gateway." },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
