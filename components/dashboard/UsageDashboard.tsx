"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

import { useAuth } from "@/lib/auth";
import { getWorkspaceUsage, getDailyUsage } from "@/lib/api";
import type { WorkspaceUsage, DailyUsage } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

// ─── Utility ─────────────────────────────────────────────────────────────────
function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCost(n: number) {
  return "$" + Number(n).toFixed(6);
}

function formatCostShort(n: number) {
  return "$" + Number(n).toFixed(4);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, subColor }: { label: string; value: string | number; sub?: string; subColor?: string }) {
  return (
    <div style={styles.metric}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{value}</div>
      {sub && (
        <div style={{ ...styles.metricSub, color: subColor || "var(--text-3)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, sub, right, children }: { title: string; sub?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.cardTitle}>{title}</div>
          {sub && <div style={styles.cardSub}>{sub}</div>}
        </div>
        {right && <div>{right}</div>}
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isSuccess = status === "success" || status === "completed";
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 500,
        padding: "2px 8px",
        borderRadius: "var(--radius-sm)",
        background: isSuccess ? "var(--success-light)" : "var(--danger-light)",
        color: isSuccess ? "var(--success)" : "var(--danger)",
        border: `1px solid ${isSuccess ? "rgba(22, 163, 74, 0.2)" : "rgba(220, 38, 38, 0.2)"}`,
      }}
    >
      {status}
    </span>
  );
}

function ModelBadge({ model }: { model: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 500,
        padding: "2px 8px",
        borderRadius: "var(--radius-sm)",
        background: "var(--tag-bg)",
        color: "var(--text-2)",
        border: "1px solid var(--border)",
      }}
    >
      {model}
    </span>
  );
}

function SkeletonBlock({ height = 20, width = "100%", style = {} }: { height?: number; width?: string | number; style?: React.CSSProperties }) {
  return (
    <div
      className="skeleton"
      style={{
        height,
        width,
        ...style,
      }}
    />
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      style={{
        background: "var(--danger-light)",
        border: "1px solid rgba(220, 38, 38, 0.2)",
        borderRadius: "var(--radius-md)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 13,
        color: "var(--danger)",
        marginBottom: 16,
      }}
    >
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-danger"
          style={{ padding: "4px 10px" }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ─── Chart configs ────────────────────────────────────────────────────────────
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

function buildBarData(usage: WorkspaceUsage[]) {
  const sorted = [...usage].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  return {
    labels: sorted.map((r) => `#${r.id} ${formatTime(r.created_at)}`),
    datasets: [
      {
        label: "Input tokens",
        data: sorted.map((r) => r.input_tokens),
        backgroundColor: "#2d9467", // accent-mid
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Output tokens",
        data: sorted.map((r) => r.output_tokens),
        backgroundColor: "#8a877e", // text-3
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };
}

function buildLineData(daily: DailyUsage[]) {
  const sorted = [...daily].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return {
    labels: sorted.map((d) => formatDate(d.date)),
    datasets: [
      {
        label: "Prompt tokens",
        data: sorted.map((d) => d.prompt_tokens),
        borderColor: "#1a6b4a", // accent
        backgroundColor: "rgba(26, 107, 74, 0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#1a6b4a",
        borderWidth: 2,
        borderDash: [],
      },
      {
        label: "Completion tokens",
        data: sorted.map((d) => d.completion_tokens),
        borderColor: "#4a4740", // text-2
        backgroundColor: "rgba(74, 71, 64, 0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#4a4740",
        borderWidth: 2,
        borderDash: [5, 3],
      },
    ],
  };
}

function buildModelData(usage: WorkspaceUsage[]) {
  const counts: Record<string, number> = {};
  usage.forEach((r) => {
    counts[r.model_tag] = (counts[r.model_tag] || 0) + r.total_tokens;
  });
  const labels = Object.keys(counts);
  const palette = ["#1a6b4a", "#2d9467", "#4a4740", "#8a877e", "#d4d0c8"];
  return {
    labels,
    datasets: [
      {
        data: labels.map((l) => counts[l]),
        backgroundColor: labels.map((_, i) => palette[i % palette.length]),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };
}

const barOptions = {
  ...chartDefaults,
  plugins: {
    ...chartDefaults.plugins,
    tooltip: { mode: "index" as const, intersect: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 10, family: "var(--font-mono)" }, color: "var(--text-3)", maxRotation: 30, autoSkip: false },
    },
    y: {
      grid: { color: "var(--border)" },
      ticks: { font: { size: 11, family: "var(--font-mono)" }, color: "var(--text-3)" },
      beginAtZero: true,
    },
  },
};

const lineOptions = {
  ...chartDefaults,
  plugins: {
    ...chartDefaults.plugins,
    tooltip: { mode: "index" as const, intersect: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11, family: "var(--font-mono)" }, color: "var(--text-3)" },
    },
    y: {
      grid: { color: "var(--border)" },
      ticks: {
        font: { size: 11, family: "var(--font-mono)" },
        color: "var(--text-3)",
        callback: (v: any) => (v >= 1000 ? (v / 1000).toFixed(1) + "K" : v),
      },
    },
  },
};

const donutOptions = {
  ...chartDefaults,
  cutout: "68%",
  plugins: {
    ...chartDefaults.plugins,
    tooltip: {
      callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed.toLocaleString()} tok` },
    },
  },
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function UsageDashboard() {
  const { activeWorkspace, token } = useAuth();
  const [usage, setUsage] = useState<WorkspaceUsage[]>([]);
  const [daily, setDaily] = useState<DailyUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const load = useCallback(async () => {
    if (!activeWorkspace || !token) return;
    
    setLoading(true);
    setError(null);
    try {
      const [u, d] = await Promise.all([
        getWorkspaceUsage(token, activeWorkspace.id),
        getDailyUsage(token, activeWorkspace.id),
      ]);
      setUsage(u.data?.usage || []);
      setDaily(d.data?.daily_usage || []);
      setLastRefresh(new Date());
    } catch (e: any) {
      setError(e.message || "Failed to load usage data");
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace, token]);

  useEffect(() => {
    load();
  }, [load]);

  if (!activeWorkspace) {
    return <EmptyState message="Please select a workspace to view analytics." />;
  }

  // ── Derived metrics ──────────────────────────────────────────────────────
  const totalTokens = usage.reduce((s, r) => s + r.total_tokens, 0);
  const totalCost = usage.reduce((s, r) => s + r.cost, 0);
  const totalInput = usage.reduce((s, r) => s + r.input_tokens, 0);
  const totalOutput = usage.reduce((s, r) => s + r.output_tokens, 0);
  const avgTokens = usage.length ? Math.round(totalTokens / usage.length) : 0;
  const successCount = usage.filter((r) => r.status === "success" || r.status === "completed").length;
  const successRate = usage.length ? Math.round((successCount / usage.length) * 100) : 0;

  const todayDaily = daily.length ? daily[daily.length - 1] : null;

  const modelTokens: Record<string, number> = {};
  usage.forEach((r) => {
    modelTokens[r.model_tag] = (modelTokens[r.model_tag] || 0) + r.total_tokens;
  });
  const topModel = Object.entries(modelTokens).sort((a, b) => b[1] - a[1])[0];

  const maxOutput = Math.max(...usage.map((r) => r.output_tokens), 1);

  // ── Render helpers ───────────────────────────────────────────────────────
  const LegendItem = ({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 12, color: "var(--text-2)" }}>
      {items.map((item) => (
        <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: item.color,
              display: "inline-block",
              flexShrink: 0,
              ...(item.dashed
                ? { background: "none", borderTop: `2px dashed ${item.color}`, height: 0, width: 16, borderRadius: 0 }
                : {}),
            }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );

  return (
    <div style={styles.root}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div>
          <div style={styles.sectionLabel}>Workspace Analytics</div>
          <h1 style={{ fontSize: 24, fontWeight: 500, fontFamily: "var(--font-serif)", marginTop: 4 }}>
            {activeWorkspace.name}
          </h1>
          {lastRefresh && (
            <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>
              Last updated {lastRefresh.toLocaleTimeString()}
            </div>
          )}
        </div>
        <button onClick={load} disabled={loading} className="btn-secondary">
          {loading ? "Loading…" : "Refresh Data"}
        </button>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* ── Metric cards ── */}
      <div style={styles.metricGrid}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ ...styles.metric }}>
              <SkeletonBlock height={12} width="60%" style={{ marginBottom: 12 }} />
              <SkeletonBlock height={28} width="80%" />
            </div>
          ))
        ) : (
          <>
            <MetricCard
              label="Total requests"
              value={usage.length}
              sub={`${successRate}% success rate`}
            />
            <MetricCard
              label="Total tokens"
              value={totalTokens.toLocaleString()}
              sub={`${totalInput} in · ${totalOutput} out`}
            />
            <MetricCard
              label="Total cost"
              value={formatCostShort(totalCost)}
              sub="USD this period"
            />
            <MetricCard
              label="Avg / request"
              value={avgTokens}
              sub="tokens per call"
            />
            <MetricCard
              label="Top model"
              value={topModel ? topModel[0] : "—"}
              sub={topModel ? `${topModel[1].toLocaleString()} tokens` : ""}
            />
          </>
        )}
      </div>

      {/* ── Bar chart: input vs output per request ── */}
      <SectionCard
        title="Tokens per request"
        sub="Input vs output — chronological order"
        right={
          <LegendItem
            items={[
              { label: "Input", color: "#2d9467" },
              { label: "Output", color: "#8a877e" },
            ]}
          />
        }
      >
        {loading ? (
          <SkeletonBlock height={220} />
        ) : usage.length === 0 ? (
          <EmptyState message="No requests yet" />
        ) : (
          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <Bar
              data={buildBarData(usage)}
              options={barOptions}
              aria-label="Grouped bar chart of input and output tokens per request"
            />
          </div>
        )}
      </SectionCard>

      {/* ── Two-col: Daily trend + Model donut ── */}
      <div style={styles.twoCol}>
        <SectionCard
          title="Daily token trend"
          sub="Prompt vs completion over time"
          right={
            <LegendItem
              items={[
                { label: "Prompt", color: "#1a6b4a" },
                { label: "Completion", color: "#4a4740", dashed: true },
              ]}
            />
          }
        >
          {loading ? (
            <SkeletonBlock height={180} />
          ) : daily.length === 0 ? (
             <EmptyState message="No daily data" />
          ) : (
            <div style={{ position: "relative", width: "100%", height: 180 }}>
              <Line
                data={buildLineData(daily)}
                options={lineOptions}
                aria-label="Line chart of prompt and completion tokens over days"
              />
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="By model"
          sub="Token share across models"
        >
          {loading ? (
            <SkeletonBlock height={180} />
          ) : usage.length === 0 ? (
            <EmptyState message="No data" />
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                {Object.entries(modelTokens).map(([model, tokens], i) => {
                  const palette = ["#1a6b4a", "#2d9467", "#4a4740", "#8a877e", "#d4d0c8"];
                  const pct = Math.round((tokens / totalTokens) * 100);
                  return (
                    <span key={model} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-2)" }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: palette[i % palette.length], display: "inline-block" }} />
                      {model} <span style={{ color: "var(--text-3)", marginLeft: 2 }}>{pct}%</span>
                    </span>
                  );
                })}
              </div>
              <div style={{ position: "relative", width: "100%", height: 140 }}>
                <Doughnut
                  data={buildModelData(usage)}
                  options={donutOptions}
                  aria-label="Donut chart of token distribution by model"
                />
              </div>
            </>
          )}
        </SectionCard>
      </div>

      {/* ── Today's daily summary (from /usage/daily) ── */}
      {!loading && todayDaily && (
        <SectionCard
          title="Today's summary"
          sub={`From /usage/daily — ${formatDate(todayDaily.date)}`}
        >
          <div style={styles.dailyGrid}>
            {[
              { label: "Prompt tokens", value: todayDaily.prompt_tokens.toLocaleString() },
              { label: "Completion tokens", value: todayDaily.completion_tokens.toLocaleString() },
              {
                label: "Total tokens",
                value: (todayDaily.prompt_tokens + todayDaily.completion_tokens).toLocaleString(),
              },
              { label: "Daily cost", value: formatCostShort(todayDaily.total_cost) },
            ].map((item) => (
              <div key={item.label} style={styles.dailyItem}>
                <div style={styles.dailyItemLabel}>{item.label}</div>
                <div style={styles.dailyItemValue}>{item.value}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── Request log table ── */}
      <SectionCard
        title="Request log"
        sub={`${usage.length} requests from /usage`}
        right={usage.length > 0 && <ModelBadge model={usage[0].model_tag} />}
      >
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} height={42} style={{ marginBottom: 1 }} />)}
          </div>
        ) : usage.length === 0 ? (
          <EmptyState message="No requests found" />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["#", "Time", "Model", "Input", "Output", "Total", "Cost", "Status"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usage.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ ...styles.td, fontFamily: "var(--font-mono)", fontWeight: 500, color: "var(--text)" }}>
                      #{r.id}
                    </td>
                    <td style={{ ...styles.td, color: "var(--text-3)" }}>
                      {formatTime(r.created_at)}
                    </td>
                    <td style={styles.td}>
                      <ModelBadge model={r.model_tag} />
                    </td>
                    <td style={styles.td}>{r.input_tokens}</td>
                    <td style={styles.td}>{r.output_tokens}</td>
                    <td style={{ ...styles.td, fontWeight: 500, color: "var(--text)" }}>
                      {r.total_tokens}
                    </td>
                    <td style={{ ...styles.td, fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>
                      {formatCost(r.cost)}
                    </td>
                    <td style={styles.td}>
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-3)", fontSize: 14 }}>
      {message}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  root: {
    maxWidth: 1100,
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "var(--accent)",
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  metric: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "20px",
    boxShadow: "var(--shadow-sm)",
  },
  metricLabel: { fontSize: 13, color: "var(--text-2)", marginBottom: 8 },
  metricValue: { fontSize: 28, fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-serif)" },
  metricSub: { fontSize: 12, marginTop: 4 },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "24px",
    marginBottom: 24,
    boxShadow: "var(--shadow-sm)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-serif)" },
  cardSub: { fontSize: 13, color: "var(--text-3)", marginTop: 4 },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 24,
    marginBottom: 24,
  },
  dailyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
  },
  dailyItem: {
    background: "var(--surface-hover)",
    borderRadius: "var(--radius-md)",
    padding: "16px",
    border: "1px solid var(--border)",
  },
  dailyItemLabel: { fontSize: 12, color: "var(--text-3)", marginBottom: 4 },
  dailyItemValue: { fontSize: 20, fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-serif)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" },
  th: {
    fontWeight: 500,
    color: "var(--text-3)",
    fontSize: 12,
    padding: "0 12px 12px 0",
    borderBottom: "1px solid var(--border-dark)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "14px 12px 14px 0",
    color: "var(--text-2)",
    whiteSpace: "nowrap",
  },
};
