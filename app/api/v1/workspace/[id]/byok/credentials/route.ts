import { NextRequest, NextResponse } from "next/server";
import { buildUpstreamUrl } from "@/lib/server/upstream";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  try {
    const upstream = await fetch(buildUpstreamUrl(`/workspace/${id}/byok/credentials`), {
      headers: { Authorization: authorization },
      cache: "no-store"
    });
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" }
    });
  } catch (error) {
    console.error("[basktre:proxy] BYOK credential list failed:", error);
    return NextResponse.json({ message: "Could not reach BYOK credential API." }, { status: 502 });
  }
}
