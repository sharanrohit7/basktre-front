"use client";

import { useEffect, useMemo, useState } from "react";
import { listProviders } from "@/lib/api";
import type { Provider } from "@/types";

// ─── Brand / Family metadata ──────────────────────────────────────────────────
interface BrandMeta {
  label: string;
  color: string;
  bg: string;      // subtle background tint
  initials: string;
  matchFn: (tag: string) => boolean;
}

const BRANDS: BrandMeta[] = [
  {
    label: "OpenAI",
    color: "#10a37f",
    bg: "rgba(16,163,127,0.12)",
    initials: "OA",
    matchFn: (t) => t.startsWith("gpt") || t.startsWith("o1") || t.startsWith("o3") || t.startsWith("o4") || t.startsWith("o5") || t.startsWith("gpt-5"),
  },
  {
    label: "Anthropic",
    color: "#d97706",
    bg: "rgba(217,119,6,0.12)",
    initials: "AN",
    matchFn: (t) => t.startsWith("claude"),
  },
  {
    label: "DeepSeek",
    color: "#4f7cff",
    bg: "rgba(79,124,255,0.12)",
    initials: "DS",
    matchFn: (t) => t.startsWith("deepseek"),
  },
  {
    label: "Meta Llama",
    color: "#0064e0",
    bg: "rgba(0,100,224,0.12)",
    initials: "ML",
    matchFn: (t) => t.startsWith("llama"),
  },
  {
    label: "Google",
    color: "#4285f4",
    bg: "rgba(66,133,244,0.12)",
    initials: "GG",
    matchFn: (t) => t.startsWith("gemma") || t.startsWith("gemini"),
  },
  {
    label: "Qwen",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.12)",
    initials: "QW",
    matchFn: (t) => t.startsWith("qwen"),
  },
];

function getBrand(tag: string): BrandMeta {
  const found = BRANDS.find((b) => b.matchFn(tag));
  if (found) return found;
  // Generic fallback with a deterministic color from the tag
  const colors = ["#f97316", "#06b6d4", "#84cc16", "#ec4899", "#8b5cf6", "#14b8a6"];
  const idx = Math.abs(tag.charCodeAt(0) + (tag.charCodeAt(1) ?? 0)) % colors.length;
  const c = colors[idx];
  return {
    label: tag.split("-")[0].charAt(0).toUpperCase() + tag.split("-")[0].slice(1),
    color: c,
    bg: `${c}1f`,
    initials: tag.slice(0, 2).toUpperCase(),
    matchFn: () => false,
  };
}

// ─── Pricing helpers ──────────────────────────────────────────────────────────
function formatCost(n: number): string {
  if (n === 0) return "Free";
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(0)}`;
}

function priceTier(total: number): { label: string; color: string } {
  if (total === 0) return { label: "Free", color: "#10b981" };
  if (total < 1) return { label: "Nano", color: "#06b6d4" };
  if (total < 5) return { label: "Budget", color: "#84cc16" };
  if (total < 20) return { label: "Mid", color: "#f59e0b" };
  if (total < 60) return { label: "Pro", color: "#f97316" };
  return { label: "Premium", color: "#ef4444" };
}

// Models to highlight as best value
const BEST_VALUE_TAGS = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "llama-3.3-70b-instruct", "deepseek-chat", "deepseek-r1", "qwen-2.5-72b-instruct"];

type SortKey = "name" | "input" | "output" | "total";

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProviderShowcase() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    listProviders()
      .then((res) => setProviders(res.data ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Derived brand counts
  const brandCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of providers) {
      const b = getBrand(p.tag).label;
      map[b] = (map[b] ?? 0) + 1;
    }
    return map;
  }, [providers]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return providers
      .filter((p) => {
        const b = getBrand(p.tag);
        const matchBrand = activeBrand ? b.label === activeBrand : true;
        const matchSearch = q
          ? p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q) || b.label.toLowerCase().includes(q)
          : true;
        return matchBrand && matchSearch;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === "name") cmp = a.name.localeCompare(b.name);
        else if (sortKey === "input") cmp = a.input_cost_per_1m - b.input_cost_per_1m;
        else if (sortKey === "output") cmp = a.output_cost_per_1m - b.output_cost_per_1m;
        else cmp = (a.input_cost_per_1m + a.output_cost_per_1m) - (b.input_cost_per_1m + b.output_cost_per_1m);
        return sortAsc ? cmp : -cmp;
      });
  }, [providers, search, activeBrand, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  }

  const cheapest = useMemo(
    () => providers.reduce((min, p) => p.input_cost_per_1m < min ? p.input_cost_per_1m : min, Infinity),
    [providers]
  );

  return (
    <section className="section" id="providers" style={{ paddingTop: 60 }}>
      {/* ── Header ───────────────────────────────── */}
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
        {"// 60+ models, live"}
      </div>
      <h2 className="mb-4 font-[var(--font-serif)] text-[clamp(30px,4vw,48px)] leading-tight">
        Every model.
        <br />
        <em className="text-[var(--accent)]">Transparent pricing.</em>
      </h2>
      <p className="mb-8 max-w-[560px] text-base font-light leading-7 text-[var(--text-2)]">
        Pricing shown is the <strong className="font-semibold text-[var(--text)]">direct model cost</strong> — no Basktre markup on tokens.
        The only fee is 4% when you top up your wallet. Browse, compare, and pick the right model for every task.
      </p>

      {/* ── Stats bar ────────────────────────────── */}
      {!loading && !error && providers.length > 0 && (
        <div style={styles.statsBar}>
          <StatChip icon="⚡" label="Models" value={providers.length.toString()} />
          <div style={styles.statsDivider} />
          <StatChip icon="🏢" label="Providers" value={Object.keys(brandCounts).length.toString()} />
          <div style={styles.statsDivider} />
          <StatChip
            icon="💰"
            label="From"
            value={cheapest === Infinity ? "—" : `${formatCost(cheapest)}/1M`}
          />
          <div style={styles.statsDivider} />
          <StatChip icon="🔁" label="Unified API" value="1 endpoint" />
        </div>
      )}

      {/* ── Body: sidebar + table ─────────────────── */}
      <div style={styles.body}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Filter by brand</div>
          <button
            onClick={() => setActiveBrand(null)}
            style={{
              ...styles.sidebarBtn,
              ...(activeBrand === null ? styles.sidebarBtnActive : {}),
            }}
          >
            <span style={styles.sidebarBtnDot} />
            <span style={{ flex: 1 }}>All models</span>
            <span style={styles.sidebarCount}>{providers.length}</span>
          </button>
          {BRANDS.filter((b) => (brandCounts[b.label] ?? 0) > 0).map((b) => (
            <button
              key={b.label}
              onClick={() => setActiveBrand(activeBrand === b.label ? null : b.label)}
              style={{
                ...styles.sidebarBtn,
                ...(activeBrand === b.label ? { ...styles.sidebarBtnActive, borderLeftColor: b.color } : {}),
              }}
            >
              <span style={{ ...styles.sidebarAvatar, background: b.bg, color: b.color }}>{b.initials}</span>
              <span style={{ flex: 1 }}>{b.label}</span>
              <span style={styles.sidebarCount}>{brandCounts[b.label] ?? 0}</span>
            </button>
          ))}
          {/* Unknown brands */}
          {Object.entries(brandCounts)
            .filter(([label]) => !BRANDS.some((b) => b.label === label))
            .map(([label, count]) => {
              const b = { label, color: "#6b7280", bg: "rgba(107,114,128,0.12)", initials: label.slice(0, 2).toUpperCase() };
              return (
                <button
                  key={label}
                  onClick={() => setActiveBrand(activeBrand === label ? null : label)}
                  style={{
                    ...styles.sidebarBtn,
                    ...(activeBrand === label ? styles.sidebarBtnActive : {}),
                  }}
                >
                  <span style={{ ...styles.sidebarAvatar, background: b.bg, color: b.color }}>{b.initials}</span>
                  <span style={{ flex: 1 }}>{label}</span>
                  <span style={styles.sidebarCount}>{count}</span>
                </button>
              );
            })}
        </aside>

        {/* Main panel */}
        <div style={styles.main}>
          {/* Search + sort bar */}
          <div style={styles.toolbar}>
            <div style={styles.searchBox}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search models…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search models"
                style={styles.searchInput}
              />
              {search && (
                <button onClick={() => setSearch("")} style={styles.clearBtn} aria-label="Clear search">
                  ✕
                </button>
              )}
            </div>
            <div style={styles.resultCount}>
              {filtered.length} model{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <SkeletonTable />
          ) : error ? (
            <ErrorState />
          ) : filtered.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <Th label="Model" sortKey="name" active={sortKey} asc={sortAsc} onSort={toggleSort} />
                      <Th label="Input / 1M" sortKey="input" active={sortKey} asc={sortAsc} onSort={toggleSort} align="right" />
                      <Th label="Output / 1M" sortKey="output" active={sortKey} asc={sortAsc} onSort={toggleSort} align="right" />
                      <Th label="Total / 1M" sortKey="total" active={sortKey} asc={sortAsc} onSort={toggleSort} align="right" />
                      <th style={{ ...styles.th, textAlign: "center", width: 80 }}>Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => (
                      <ModelRow key={p.tag} provider={p} index={i} isBestValue={BEST_VALUE_TAGS.includes(p.tag)} />
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Passthrough callout */}
              <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, background: "var(--surface)" }}>
                <span style={{ fontSize: 13, color: "var(--text-3)" }}>💡</span>
                <span style={{ fontSize: 12, color: "var(--text-3)", fontStyle: "italic" }}>
                  All prices are pass-through. You pay exactly what the model provider charges — no Basktre markup on tokens.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={styles.statChip}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{value}</div>
      </div>
    </div>
  );
}

function Th({
  label, sortKey, active, asc, onSort, align = "left"
}: {
  label: string; sortKey: SortKey; active: SortKey; asc: boolean; onSort: (k: SortKey) => void; align?: "left" | "right";
}) {
  const isActive = active === sortKey;
  return (
    <th style={{ ...styles.th, textAlign: align, cursor: "pointer", userSelect: "none" }} onClick={() => onSort(sortKey)}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {label}
        <span style={{ opacity: isActive ? 1 : 0.3, fontSize: 10 }}>{isActive ? (asc ? "▲" : "▼") : "▲"}</span>
      </span>
    </th>
  );
}

function ModelRow({ provider: p, index, isBestValue }: { provider: Provider; index: number; isBestValue: boolean }) {
  const brand = getBrand(p.tag);
  const total = p.input_cost_per_1m + p.output_cost_per_1m;
  const tier = priceTier(total);

  return (
    <tr
      style={{
        ...styles.tr,
        animationDelay: `${Math.min(index * 18, 400)}ms`,
        background: isBestValue ? "rgba(16,185,129,0.04)" : "transparent",
      }}
      className="model-row"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isBestValue ? "rgba(16,185,129,0.08)" : "var(--surface-hover, rgba(255,255,255,0.04))"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isBestValue ? "rgba(16,185,129,0.04)" : "transparent"; }}
    >
      {/* Model name + brand */}
      <td style={styles.td}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ ...styles.avatar, background: brand.bg, color: brand.color }}>
            {brand.initials}
          </div>
          <div>
            <div style={{ ...styles.modelName, display: "flex", alignItems: "center", gap: 6 }}>
              {p.name}
              {isBestValue && (
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.4px",
                  textTransform: "uppercase",
                  padding: "1px 6px",
                  borderRadius: 20,
                  background: "rgba(16,185,129,0.15)",
                  color: "#10b981",
                  border: "1px solid rgba(16,185,129,0.3)",
                  flexShrink: 0,
                }}>Best value</span>
              )}
            </div>
            <div style={styles.modelTag}>
              {(() => {
                // Only show tag if it differs meaningfully from the display name slug
                const nameSlug = p.name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
                return nameSlug === p.tag ? null : p.tag;
              })()}
            </div>
          </div>
        </div>
      </td>
      {/* Input cost */}
      <td style={{ ...styles.td, textAlign: "right" }}>
        <span style={styles.cost}>{formatCost(p.input_cost_per_1m)}</span>
      </td>
      {/* Output cost */}
      <td style={{ ...styles.td, textAlign: "right" }}>
        <span style={styles.cost}>{formatCost(p.output_cost_per_1m)}</span>
      </td>
      {/* Total */}
      <td style={{ ...styles.td, textAlign: "right" }}>
        <span style={{ ...styles.cost, fontWeight: 600 }}>{formatCost(total)}</span>
      </td>
      {/* Tier badge */}
      <td style={{ ...styles.td, textAlign: "center" }}>
        <span style={{ ...styles.tierBadge, background: `${tier.color}22`, color: tier.color, borderColor: `${tier.color}44` }}>
          {tier.label}
        </span>
      </td>
    </tr>
  );
}

function SkeletonTable() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 0" }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8 }} />
      ))}
    </div>
  );
}

function ErrorState() {
  return (
    <div style={styles.stateBox}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Could not load models</div>
      <div style={{ color: "var(--text-3)", fontSize: 13 }}>Make sure the backend is running.</div>
    </div>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div style={styles.stateBox}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
      {search ? (
        <>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>No models match &ldquo;{search}&rdquo;</div>
          <div style={{ color: "var(--text-3)", fontSize: 13 }}>Try a different search term.</div>
        </>
      ) : (
        <div style={{ fontWeight: 600 }}>No models in this category.</div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  statsBar: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    marginBottom: 32,
    padding: "12px 20px",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    flexWrap: "wrap",
    rowGap: 12,
  },
  statChip: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 20px",
  },
  statsDivider: {
    width: 1,
    height: 28,
    background: "var(--border)",
  },
  statLabel: {
    fontSize: 10,
    color: "var(--text-3)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 700,
    color: "var(--text)",
    fontVariantNumeric: "tabular-nums",
  },
  body: {
    display: "grid",
    gridTemplateColumns: "200px 1fr",
    gap: 20,
    alignItems: "start",
  },
  sidebar: {
    position: "sticky" as const,
    top: 80,
    display: "flex",
    flexDirection: "column" as const,
    gap: 2,
    padding: "12px",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border)",
    background: "var(--surface)",
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    color: "var(--text-3)",
    padding: "4px 8px 8px",
  },
  sidebarBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 8px",
    borderRadius: 7,
    border: "1px solid transparent",
    borderLeft: "2px solid transparent",
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
    color: "var(--text-2)",
    textAlign: "left" as const,
    width: "100%",
    transition: "background 0.15s, color 0.15s",
  },
  sidebarBtnActive: {
    background: "var(--tag-bg, rgba(255,255,255,0.06))",
    color: "var(--text)",
    borderLeftColor: "var(--accent)",
  },
  sidebarDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--text-3)",
    flexShrink: 0,
  },
  sidebarAvatar: {
    width: 22,
    height: 22,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 700,
    flexShrink: 0,
    letterSpacing: "-0.3px",
  },
  sidebarCount: {
    fontSize: 11,
    color: "var(--text-3)",
    fontVariantNumeric: "tabular-nums",
  },
  main: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 0,
    minWidth: 0,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap" as const,
    rowGap: 8,
  },
  searchBox: {
    flex: 1,
    minWidth: 200,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 12px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 13,
    color: "var(--text)",
  },
  clearBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "var(--text-3)",
    fontSize: 11,
    padding: "0 2px",
    lineHeight: 1,
  },
  resultCount: {
    fontSize: 12,
    color: "var(--text-3)",
    whiteSpace: "nowrap" as const,
    fontVariantNumeric: "tabular-nums",
  },
  tableWrapper: {
    overflowX: "auto" as const,
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border)",
    background: "var(--surface)",
  },
  table: {
    width: "100%",
    minWidth: 640,
    borderCollapse: "collapse" as const,
    fontSize: 13,
  },
  th: {
    padding: "10px 14px",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.7px",
    color: "var(--text-3)",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap" as const,
    background: "var(--surface)",
  },
  tr: {
    borderBottom: "1px solid var(--border)",
    transition: "background 0.12s",
    animation: "fadeInRow 0.25s ease both",
  },
  td: {
    padding: "10px 14px",
    verticalAlign: "middle" as const,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
    letterSpacing: "-0.3px",
    fontFamily: "var(--font-geist-mono, monospace)",
  },
  modelName: {
    fontWeight: 500,
    lineHeight: 1.3,
    color: "var(--text)",
  },
  modelTag: {
    fontSize: 10,
    color: "var(--text-3)",
    fontFamily: "var(--font-geist-mono, monospace)",
    marginTop: 1,
  },
  cost: {
    fontFamily: "var(--font-geist-mono, monospace)",
    fontSize: 12,
    color: "var(--text-2)",
    fontVariantNumeric: "tabular-nums",
  },
  tierBadge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 600,
    border: "1px solid",
    letterSpacing: "0.4px",
    textTransform: "uppercase" as const,
  },
  stateBox: {
    padding: "48px 24px",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    textAlign: "center" as const,
    color: "var(--text-2)",
    fontSize: 14,
  },
  sidebarBtnDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--text-3)",
    flexShrink: 0,
  },
};
