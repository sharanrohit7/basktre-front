import { NextRequest, NextResponse } from "next/server";
import { buildUpstreamUrl } from "@/lib/server/upstream";

export const dynamic = "force-dynamic";

async function proxy(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; provider: string }> }
) {
  const { id, provider } = await params;
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const init: RequestInit = {
    method: request.method,
    headers: { Authorization: authorization },
    cache: "no-store"
  };
  if (request.method === "PUT") {
    init.headers = { ...init.headers, "Content-Type": "application/json" };
    init.body = await request.text();
  }

  try {
    const upstream = await fetch(
      buildUpstreamUrl(`/workspace/${id}/byok/credentials/${encodeURIComponent(provider)}`),
      init
    );
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" }
    });
  } catch (error) {
    console.error("[basktre:proxy] BYOK credential operation failed:", error);
    return NextResponse.json({ message: "Could not reach BYOK credential API." }, { status: 502 });
  }
}

export const PUT = proxy;
export const DELETE = proxy;
