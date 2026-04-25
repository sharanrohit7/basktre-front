"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { getApiKeys, revokeApiKey } from "@/lib/api";
import type { ApiKey } from "@/types";
import ApiKeyTable from "@/components/dashboard/ApiKeyTable";
import CreateApiKeyModal from "@/components/dashboard/CreateApiKeyModal";
import EmptyState from "@/components/dashboard/EmptyState";

export default function ApiKeysPage() {
  const { activeWorkspace, token } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchKeys = useCallback(async () => {
    if (!activeWorkspace || !token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getApiKeys(token, activeWorkspace.id);
      // Filter out soft-deleted keys
      const activeKeys = (res.data?.api_keys ?? []).filter((k) => k.status !== "deleted");
      setKeys(activeKeys);
    } catch (e: any) {
      setError(e.message || "Failed to load API keys");
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace, token]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  async function handleRevoke(keyId: number) {
    if (!activeWorkspace || !token) return;
    try {
      await revokeApiKey(token, activeWorkspace.id, keyId);
      // Remove from local state
      setKeys((prev) => prev.filter((k) => k.id !== keyId));
    } catch (e: any) {
      setError(e.message || "Failed to revoke key");
    }
  }

  function handleKeyCreated() {
    // Refresh the list from the API to get the new key entry
    fetchKeys();
  }

  if (!activeWorkspace) {
    return (
      <>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>API Keys</h1>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>Manage your API keys</p>
        </div>
        <EmptyState
          headline="No workspace selected"
          subtext="Create or select a workspace from the sidebar to manage API keys."
          icon={
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                background: "var(--tag-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                color: "var(--text-3)"
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M20 14a6 6 0 1 0-4.5 5.81V22h3v3h3v-3h1.5v-3H20v-5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="14" cy="14" r="1.5" fill="currentColor" />
              </svg>
            </div>
          }
        />
      </>
    );
  }

  return (
    <>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>API Keys</h1>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>
            Manage API keys for <strong>{activeWorkspace.name}</strong>
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-accent" style={{ fontSize: 13 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Generate new key
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            background: "var(--danger-light)",
            color: "var(--danger)",
            padding: "12px 16px",
            borderRadius: "var(--radius-sm)",
            fontSize: 13,
            marginBottom: 24,
            border: "1px solid rgba(220, 38, 38, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span>{error}</span>
          <button
            onClick={fetchKeys}
            style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              background: "transparent",
              color: "var(--danger)",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div
          style={{
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            overflow: "hidden",
            background: "var(--surface)"
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 52, marginBottom: 1 }} />
          ))}
        </div>
      ) : keys.length > 0 ? (
        <ApiKeyTable keys={keys} onRevoke={handleRevoke} />
      ) : (
        <EmptyState
          headline="No API keys yet"
          subtext="Generate your first API key to start making requests through Basktre."
          icon={
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
                <path
                  d="M20 14a6 6 0 1 0-4.5 5.81V22h3v3h3v-3h1.5v-3H20v-5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="14" cy="14" r="1.5" fill="currentColor" />
              </svg>
            </div>
          }
          action={
            <button onClick={() => setShowCreate(true)} className="btn-accent">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Generate your first key
            </button>
          }
        />
      )}

      <CreateApiKeyModal open={showCreate} onClose={() => setShowCreate(false)} onKeyCreated={handleKeyCreated} />
    </>
  );
}
