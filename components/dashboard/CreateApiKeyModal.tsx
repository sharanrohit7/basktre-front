"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";
import { createApiKey } from "@/lib/api";

export default function CreateApiKeyModal({
  open,
  onClose,
  onKeyCreated
}: {
  open: boolean;
  onClose: () => void;
  onKeyCreated: () => void;
}) {
  const { token, activeWorkspace } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (!token || !activeWorkspace) {
      addToast("error", "No workspace selected. Please select or create a workspace first.");
      return;
    }

    setLoading(true);
    try {
      const res = await createApiKey(token, activeWorkspace.id, name.trim());
      const key = res.data.token;
      setCreatedKey(key);

      // Notify parent to refresh key list from API
      onKeyCreated();

      addToast("success", "API key created. Copy it now — you won't see it again.");
    } catch (err) {
      addToast("error", err instanceof Error ? err.message : "Failed to create API key.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setName("");
    setCreatedKey(null);
    setCopied(false);
    onClose();
  }

  function handleCopy() {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={createdKey ? "API Key Created" : "Generate New API Key"}>
      {createdKey ? (
        <div>
          <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 16, lineHeight: 1.7 }}>
            Your API key has been created. <strong>Copy it now</strong> — this is the only time it will be shown.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              background: "var(--ink)",
              marginBottom: 20
            }}
          >
            <code
              style={{
                flex: 1,
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-geist-mono)",
                wordBreak: "break-all",
                lineHeight: 1.6
              }}
            >
              {createdKey}
            </code>
            <button
              onClick={handleCopy}
              aria-label="Copy API key"
              style={{
                flexShrink: 0,
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
                cursor: "pointer",
                transition: "background 0.15s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleClose} className="btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="api-key-name"
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 6,
                color: "var(--text-2)"
              }}
            >
              Key name
            </label>
            <input
              id="api-key-name"
              type="text"
              placeholder="e.g. Production, Staging"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoFocus
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.15s"
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
            <p style={{ marginTop: 6, fontSize: 12, color: "var(--text-3)" }}>
              Give your key a descriptive name so you can identify it later.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn-secondary"
              style={{ fontSize: 13, padding: "8px 16px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="btn-accent"
              style={{ fontSize: 13, padding: "8px 16px" }}
            >
              {loading ? (
                <>
                  <Spinner size="sm" white />
                  Generating...
                </>
              ) : (
                "Generate key"
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
