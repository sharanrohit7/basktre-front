"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";
import { createWorkspace } from "@/lib/api";

export default function CreateWorkspaceModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { token, user, addWorkspace } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function generateCode(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 32) || `ws-${Date.now()}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (!token || !user) {
      addToast("error", "Not authenticated. Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      const code = generateCode(name);
      const res = await createWorkspace(token, code, name.trim());
      addWorkspace(res.data.workspace);
      addToast("success", `Workspace "${res.data.workspace.name}" created.`);
      setName("");
      onClose();
    } catch (err) {
      addToast("error", err instanceof Error ? err.message : "Failed to create workspace.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New Workspace">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="workspace-name"
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 6,
              color: "var(--text-2)"
            }}
          >
            Workspace name
          </label>
          <input
            id="workspace-name"
            type="text"
            placeholder="e.g. My Project"
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
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
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
                Creating...
              </>
            ) : (
              "Create workspace"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
