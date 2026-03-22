/**
 * Server-only: builds the Go API waitlist URL from split env (host + version prefix).
 * @see deploy/VERCEL_SETUP.md
 */
export function buildWaitlistUpstreamUrl(): string {
  const origin = (process.env.INTERNAL_API_ORIGIN ?? "http://localhost:3001").replace(/\/+$/, "");
  let prefix = process.env.INTERNAL_API_PREFIX ?? "/api/v1";
  if (!prefix.startsWith("/")) {
    prefix = `/${prefix}`;
  }
  prefix = prefix.replace(/\/+$/, "");
  return `${origin}${prefix}/waitlist`;
}
