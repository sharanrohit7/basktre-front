import type { Provider, ProvidersResponse } from "@/types";

export function isProvider(value: unknown): value is Provider {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return typeof p.name === "string" && typeof p.tag === "string" && typeof p.input_cost_per_1m === "number" && Number.isFinite(p.input_cost_per_1m) && p.input_cost_per_1m >= 0 && typeof p.output_cost_per_1m === "number" && Number.isFinite(p.output_cost_per_1m) && p.output_cost_per_1m >= 0;
}

export function normalizeProviders(value: unknown): Provider[] {
  const payload = value as Partial<ProvidersResponse> | null;
  return Array.isArray(payload?.data) ? payload.data.filter(isProvider) : [];
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value < 0.01 ? 6 : 2 }).format(value);
}

export function providerBrand(tag: string): string {
  if (/^(gpt|o\d|chatgpt)/.test(tag)) return "OpenAI";
  if (tag.startsWith("claude")) return "Anthropic";
  if (/^(gemini|gemma)/.test(tag)) return "Google";
  if (tag.startsWith("llama")) return "Meta";
  if (tag.startsWith("deepseek")) return "DeepSeek";
  if (tag.startsWith("qwen")) return "Qwen";
  return "Other";
}

export function estimateCost(provider: Provider, inputTokens: number, outputTokens: number, requests: number) {
  const usageCost = ((inputTokens / 1_000_000) * provider.input_cost_per_1m + (outputTokens / 1_000_000) * provider.output_cost_per_1m) * requests;
  const total = usageCost / 0.96;
  const topUpFee = total - usageCost;
  return { usageCost, topUpFee, total };
}

const FEATURED_MODEL_FAMILIES = ["gpt-5", "gpt-4o", "claude-sonnet", "claude-haiku", "gemini", "deepseek", "llama", "qwen"];

export function selectFeaturedProviders(providers: Provider[], limit = 10): Provider[] {
  const selected: Provider[] = [];
  const used = new Set<string>();
  for (const family of FEATURED_MODEL_FAMILIES) {
    const provider = providers.find((item) => item.tag.toLowerCase().includes(family));
    if (provider && !used.has(provider.tag)) { selected.push(provider); used.add(provider.tag); }
  }
  for (const provider of providers) {
    if (selected.length >= limit) break;
    if (!used.has(provider.tag)) { selected.push(provider); used.add(provider.tag); }
  }
  return selected.slice(0, limit);
}
