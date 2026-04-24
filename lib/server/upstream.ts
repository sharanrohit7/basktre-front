/**
 * Server-only: builds an upstream URL for the Go API gateway.
 * Uses split env vars (INTERNAL_API_ORIGIN + INTERNAL_API_PREFIX).
 */
export function buildUpstreamUrl(path: string): string {
  const origin = (process.env.INTERNAL_API_ORIGIN ?? "http://localhost:3001").replace(/\/+$/, "");
  let prefix = process.env.INTERNAL_API_PREFIX ?? "/api/v1";
  if (!prefix.startsWith("/")) {
    prefix = `/${prefix}`;
  }
  prefix = prefix.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${prefix}${cleanPath}`;
}
