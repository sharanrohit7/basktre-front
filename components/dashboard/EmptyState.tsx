"use client";

export default function EmptyState({
  icon,
  headline,
  subtext,
  action
}: {
  icon?: React.ReactNode;
  headline: string;
  subtext: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 160px)",
        textAlign: "center",
        padding: "48px 24px"
      }}
    >
      {/* Icon */}
      {icon ?? (
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "var(--accent-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            color: "var(--accent)"
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="8" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
            <path d="M10 16h12M16 12v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <h2
        style={{
          fontSize: 22,
          fontWeight: 600,
          marginBottom: 8,
          fontFamily: "var(--font-serif)"
        }}
      >
        {headline}
      </h2>

      <p
        style={{
          fontSize: 14,
          color: "var(--text-2)",
          maxWidth: 360,
          lineHeight: 1.7,
          marginBottom: 24,
          fontWeight: 300
        }}
      >
        {subtext}
      </p>

      {action}
    </div>
  );
}
