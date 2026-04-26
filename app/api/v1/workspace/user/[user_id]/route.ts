import { NextRequest, NextResponse } from "next/server";
import { buildUpstreamUrl } from "@/lib/server/upstream";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { user_id: string } }) {
  const target = buildUpstreamUrl(`/workspace/user/${params.user_id}`);
  const authHeader = request.headers.get("authorization") ?? "";

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
    console.error(`[basktre:proxy] upstream fetch failed for ${target}:`, err);
    return NextResponse.json(
      { message: "Could not reach API gateway." },
      { status: 502 }
    );
  }
}
