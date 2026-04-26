"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import type { ApiKey } from "@/types";

export default function ApiKeyTable({
  keys,
  onRevoke
}: {
  keys: ApiKey[];
  onRevoke: (keyId: number) => void;
}) {
  if (keys.length === 0) return null;

  return (
    <div
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        background: "var(--surface)"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr 100px 140px 120px",
          padding: "10px 20px",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "var(--text-3)",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface-hover)"
        }}
      >
        <div>Name</div>
        <div>Key Prefix</div>
        <div>Status</div>
        <div>Created</div>
        <div style={{ textAlign: "right" }}>Actions</div>
      </div>

      {/* Rows */}
      {keys.map((key) => (
        <ApiKeyRow key={key.id} entry={key} onRevoke={onRevoke} />
      ))}
    </div>
  );
}

function ApiKeyRow({
  entry,
  onRevoke
}: {
  entry: ApiKey;
  onRevoke: (keyId: number) => void;
}) {
  const { addToast } = useToast();
  const [revoking, setRevoking] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(entry.prefix + "••••••••");
    addToast("info", "Key prefix copied to clipboard.");
  }

  async function handleRevoke() {
    setRevoking(true);
    try {
      onRevoke(entry.id);
      addToast("info", `Key "${entry.key_name}" revoked.`);
    } catch {
      addToast("error", "Failed to revoke key.");
    } finally {
      setRevoking(false);
    }
  }

  const createdDate = new Date(entry.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const isActive = entry.status === "active";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.5fr 100px 140px 120px",
        padding: "14px 20px",
        fontSize: 13,
        borderBottom: "1px solid var(--border)",
        alignItems: "center",
        transition: "background 0.1s"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ fontWeight: 500 }}>{entry.key_name}</div>
      <div
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 12,
          color: "var(--text-3)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {entry.prefix}••••••••
      </div>
      <div>
        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: "var(--radius-sm)",
            background: isActive ? "var(--success-light)" : "var(--tag-bg)",
            color: isActive ? "var(--success)" : "var(--text-3)",
            border: `1px solid ${isActive ? "rgba(22, 163, 74, 0.2)" : "var(--border)"}`,
          }}
        >
          {entry.status}
        </span>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-3)" }}>{createdDate}</div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
        <button
          onClick={handleCopy}
          aria-label={`Copy key prefix ${entry.key_name}`}
          style={{
            padding: "5px 10px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
            background: "transparent",
            fontSize: 12,
            color: "var(--text-2)",
            cursor: "pointer",
            transition: "background 0.15s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Copy
        </button>
        {isActive && (
          <button
            onClick={handleRevoke}
            disabled={revoking}
            aria-label={`Revoke key ${entry.key_name}`}
            className="btn-danger"
            style={{ fontSize: 12, padding: "5px 10px" }}
          >
            {revoking ? "…" : "Revoke"}
          </button>
        )}
      </div>
    </div>
  );
}
