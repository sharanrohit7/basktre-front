import "server-only";
import type { Provider } from "@/types";
import { buildUpstreamUrl } from "@/lib/server/upstream";
import { normalizeProviders } from "@/lib/pricing";

export async function getProviders(): Promise<Provider[]> {
  try {
    const response = await fetch(buildUpstreamUrl("/providers"), { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    return normalizeProviders(await response.json());
  } catch {
    return [];
  }
}
