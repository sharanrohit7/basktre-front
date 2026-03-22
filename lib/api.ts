import { env } from "@/config/env";
import type { WaitlistResponse } from "@/types";

/** Resolve at call time so NEXT_PUBLIC_* is inlined correctly in the client bundle. */
function apiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";
  }
  return env.apiBaseUrl;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = apiBaseUrl().replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    console.debug("[basktre:api] fetch", options.method ?? "GET", url);
  }

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      console.debug("[basktre:api] error", response.status, error);
    }
    throw new Error(error?.message ?? `Request failed: ${response.status}`);
  }

  return response.json();
}

export async function joinWaitlist(email: string): Promise<WaitlistResponse> {
  return request<WaitlistResponse>("/waitlist", {
    method: "POST",
    body: JSON.stringify({ email })
  });
}
