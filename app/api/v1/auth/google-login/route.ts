import { NextResponse } from "next/server";
import { buildUpstreamUrl } from "@/lib/server/upstream";

export const dynamic = "force-dynamic";

/**
 * Proxies POST /api/v1/auth/google-login to the Go API gateway.
 * Identity is carried only by the Google ID token in Authorization.
 */
export async function POST(request: Request) {
  const target = buildUpstreamUrl("/auth/google-login");
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ message: "Missing Google ID token." }, { status: 401 });
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[basktre:proxy] POST /api/v1/auth/google-login → forwarding to", target);
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: "POST",
      headers: { Authorization: authorization },
      cache: "no-store"
    });
  } catch (err) {
    console.error("[basktre:proxy] upstream fetch failed:", err);
    return NextResponse.json(
      { message: "Could not reach auth API. Is the backend running?" },
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
