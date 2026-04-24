"use client";

import { useEffect, useState } from "react";
import { listProviders } from "@/lib/api";
import type { Provider } from "@/types";

// ─── Provider metadata for display ──────────────────
// Since the API returns tags, we map them to display names and categories
const providerMeta: Record<string, { name: string; category: string; color: string }> = {
  "openai": { name: "OpenAI", category: "LLM", color: "#10a37f" },
  "deepseek": { name: "DeepSeek", category: "LLM", color: "#4f7cff" },
  "anthropic": { name: "Anthropic", category: "LLM", color: "#d97706" },
  "google": { name: "Google AI", category: "LLM", color: "#4285f4" },
  "gemini": { name: "Gemini", category: "LLM", color: "#8b5cf6" },
  "mistral": { name: "Mistral", category: "LLM", color: "#f97316" },
  "cohere": { name: "Cohere", category: "LLM", color: "#39d98a" },
  "meta": { name: "Meta Llama", category: "Open Source", color: "#0064e0" },
  "groq": { name: "Groq", category: "Inference", color: "#f55036" },
  "perplexity": { name: "Perplexity", category: "Search", color: "#20808d" },
  "together": { name: "Together AI", category: "Inference", color: "#6366f1" },
  "fireworks": { name: "Fireworks", category: "Inference", color: "#ef4444" },
  "replicate": { name: "Replicate", category: "Inference", color: "#000000" }
};

function getProviderInfo(tag: string) {
  const known = providerMeta[tag.toLowerCase()];
  if (known) return known;
  return {
    name: tag.charAt(0).toUpperCase() + tag.slice(1),
    category: "LLM",
    color: "var(--accent)"
  };
}

function getInitials(name: string): string {
  return name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProviderShowcase() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    listProviders()
      .then((res) => {
        setProviders(res.data ?? []);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = providers.filter((p) => {
    const info = getProviderInfo(p.tag);
    const q = search.toLowerCase();
    return info.name.toLowerCase().includes(q) || info.category.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
  });

  // Group by category
  const grouped = filtered.reduce<Record<string, (Provider & { info: ReturnType<typeof getProviderInfo> })[]>>(
    (acc, p) => {
      const info = getProviderInfo(p.tag);
      if (!acc[info.category]) acc[info.category] = [];
      acc[info.category].push({ ...p, info });
      return acc;
    },
    {}
  );

  const categoryOrder = ["LLM", "Inference", "Search", "Open Source"];
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const ai = categoryOrder.indexOf(a);
    const bi = categoryOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <section className="section" id="providers" style={{ paddingTop: 60 }}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
        {"// supported providers"}
      </div>
      <h2 className="mb-4 font-[var(--font-serif)] text-[clamp(30px,4vw,48px)] leading-tight">
        Every model you need.
        <br />
        <em className="text-[var(--accent)]">One endpoint.</em>
      </h2>
      <p className="mb-10 max-w-[520px] text-base font-light leading-7 text-[var(--text-2)]">
        Access all major AI providers through a single API. We handle authentication, rate limits, and failover
        automatically.
      </p>

      {/* Search bar */}
      <div style={{ marginBottom: 32, maxWidth: 360 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            transition: "border-color 0.15s"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: "var(--text-3)" }}>
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search providers"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 14,
              color: "var(--text)"
            }}
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 100, borderRadius: "var(--radius-lg)" }}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div
          style={{
            padding: "32px 24px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            textAlign: "center",
            color: "var(--text-3)",
            fontSize: 14
          }}
        >
          Could not load providers. Make sure the backend is running.
        </div>
      )}

      {/* Provider grid */}
      {!loading && !error && sortedCategories.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {sortedCategories.map((category) => (
            <div key={category}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  color: "var(--text-3)",
                  marginBottom: 12
                }}
              >
                {category}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 12
                }}
              >
                {grouped[category].map((provider) => (
                  <ProviderCard key={provider.tag} provider={provider} info={provider.info} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty search */}
      {!loading && !error && filtered.length === 0 && search && (
        <div
          style={{
            padding: "32px 24px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            textAlign: "center",
            color: "var(--text-3)",
            fontSize: 14
          }}
        >
          No providers match &ldquo;{search}&rdquo;
        </div>
      )}
    </section>
  );
}

function ProviderCard({
  provider,
  info
}: {
  provider: Provider;
  info: { name: string; category: string; color: string };
}) {
  const capabilities: string[] = [
    provider.supports_streaming ? "Streaming" : "",
    provider.supports_function_calling ? "Functions" : "",
    provider.supports_vision ? "Vision" : ""
  ].filter((s): s is string => s.length > 0);

  return (
    <div
      style={{
        padding: 20,
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        cursor: "default",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-dark)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Icon + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: info.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
            fontFamily: "var(--font-geist-mono)"
          }}
        >
          {getInitials(info.name)}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{info.name}</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{provider.tag}</div>
        </div>
      </div>

      {/* Capabilities */}
      {capabilities.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {capabilities.map((cap) => (
            <span
              key={cap}
              style={{
                padding: "2px 8px",
                borderRadius: 20,
                background: "var(--tag-bg)",
                fontSize: 10,
                fontWeight: 500,
                color: "var(--text-2)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              {cap}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
