"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  updateWorkspace,
  deleteWorkspace,
  getBYOKCredentials,
  upsertBYOKCredential,
  deleteBYOKCredential
} from "@/lib/api";
import type { BYOKCredential } from "@/types";
import EmptyState from "@/components/dashboard/EmptyState";

export default function SettingsPage() {
  const { activeWorkspace, token, setActiveWorkspace } = useAuth();
  const activeWorkspaceId = activeWorkspace?.id;
  const activeWorkspaceName = activeWorkspace?.name;
  const activeWorkspaceMode = activeWorkspace?.inference_mode;
  
  const [name, setName] = useState(activeWorkspace?.name || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<BYOKCredential[]>([]);
  const [provider, setProvider] = useState("openai");
  const [credentialName, setCredentialName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [credentialLoading, setCredentialLoading] = useState(false);

  // Sync state if activeWorkspace changes
  useEffect(() => {
    setName(activeWorkspaceName || "");
    setCredentials([]);
    if (!activeWorkspaceId || activeWorkspaceMode !== "byok" || !token) return;

    let cancelled = false;
    getBYOKCredentials(token, activeWorkspaceId)
      .then((response) => {
        if (!cancelled) setCredentials(response.data.credentials ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load BYOK credentials.");
      });
    return () => { cancelled = true; };
  }, [activeWorkspaceId, activeWorkspaceMode, activeWorkspaceName, token]);

  if (!activeWorkspace || !token) {
    return (
      <EmptyState
        headline="No workspace selected"
        subtext="Please select or create a workspace to view its settings."
      />
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name === activeWorkspace?.name) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateWorkspace(token!, activeWorkspace!.id, { name });
      setActiveWorkspace({ ...activeWorkspace!, name });
      setSuccess("Workspace updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to update workspace.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to delete ${activeWorkspace?.name}? This action cannot be undone.`)) {
      return;
    }
    
    setDeleting(true);
    setError(null);
    try {
      await deleteWorkspace(token!, activeWorkspace!.id);
      // Let auth provider handle logout or workspace switch on next load
      // For now, redirect to dashboard root
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Failed to delete workspace.");
      setDeleting(false);
    }
  }

  async function handleCredentialSave(event: React.FormEvent) {
    event.preventDefault();
    if (!apiKey.trim()) return;
    setCredentialLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await upsertBYOKCredential(
        token!,
        activeWorkspace!.id,
        provider,
        apiKey.trim(),
        credentialName.trim() || undefined
      );
      const saved = response.data.credential;
      setCredentials((current) => [...current.filter((item) => item.provider !== saved.provider), saved]);
      setApiKey("");
      setCredentialName("");
      setSuccess(`${saved.provider} credential saved.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save BYOK credential.");
    } finally {
      setCredentialLoading(false);
    }
  }

  async function handleCredentialDelete(providerToDelete: string) {
    if (!window.confirm(`Delete the ${providerToDelete} credential?`)) return;
    setCredentialLoading(true);
    setError(null);
    try {
      await deleteBYOKCredential(token!, activeWorkspace!.id, providerToDelete);
      setCredentials((current) => current.filter((item) => item.provider !== providerToDelete));
      setSuccess(`${providerToDelete} credential deleted.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete BYOK credential.");
    } finally {
      setCredentialLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, width: "100%" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Workspace Settings</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)" }}>
          Manage configuration and limits for {activeWorkspace.name}
        </p>
      </div>

      {error && (
        <div style={{ background: "var(--danger-light)", color: "var(--danger)", padding: "12px 16px", borderRadius: "var(--radius-sm)", fontSize: 13, marginBottom: 24, border: "1px solid rgba(220, 38, 38, 0.2)" }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ background: "var(--success-light)", color: "var(--success)", padding: "12px 16px", borderRadius: "var(--radius-sm)", fontSize: 13, marginBottom: 24, border: "1px solid rgba(22, 163, 74, 0.2)" }}>
          {success}
        </div>
      )}

      {/* General Settings */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 32, boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ fontSize: 16, fontWeight: 500, fontFamily: "var(--font-serif)", marginBottom: 16 }}>
          General
        </h2>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--text-2)", marginBottom: 8 }}>
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border-dark)",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
                outline: "none",
                background: "var(--surface)",
                color: "var(--text)",
              }}
            />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--text-2)", marginBottom: 8 }}>
              Workspace Code (Identifier)
            </label>
            <input
              type="text"
              value={activeWorkspace.workspace_code}
              disabled
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
                background: "var(--surface-hover)",
                color: "var(--text-3)",
                cursor: "not-allowed"
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={saving || name === activeWorkspace.name}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {activeWorkspace.inference_mode === "byok" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 32, boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, fontFamily: "var(--font-serif)", marginBottom: 8 }}>
            Provider Credentials
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 20 }}>
            Keys are write-only. After saving, only the final four characters are shown.
          </p>

          {credentials.length > 0 && (
            <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
              {credentials.map((credential) => (
                <div key={credential.provider} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{credential.name || credential.provider}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>{credential.provider} · ••••{credential.key_suffix}</div>
                  </div>
                  <button type="button" className="btn-danger" disabled={credentialLoading} onClick={() => handleCredentialDelete(credential.provider)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCredentialSave} style={{ display: "grid", gap: 12 }}>
            <label htmlFor="byok-provider" style={{ fontSize: 13, color: "var(--text-2)" }}>Provider</label>
            <select id="byok-provider" value={provider} onChange={(event) => setProvider(event.target.value)} disabled={credentialLoading} style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)" }}>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="deepseek">DeepSeek</option>
            </select>
            <label htmlFor="byok-name" style={{ fontSize: 13, color: "var(--text-2)" }}>Credential name (optional)</label>
            <input id="byok-name" type="text" value={credentialName} onChange={(event) => setCredentialName(event.target.value)} placeholder="Production key" disabled={credentialLoading} style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }} />
            <label htmlFor="byok-api-key" style={{ fontSize: 13, color: "var(--text-2)" }}>Provider API key</label>
            <input id="byok-api-key" type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="Enter API key" autoComplete="off" required disabled={credentialLoading} style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }} />
            <button type="submit" className="btn-primary" disabled={credentialLoading || !apiKey.trim()}>
              {credentialLoading ? "Saving..." : "Save Credential"}
            </button>
          </form>
        </div>
      )}

      {/* Danger Zone */}
      <div style={{ border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "var(--radius-lg)", padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 500, fontFamily: "var(--font-serif)", color: "var(--danger)", marginBottom: 8 }}>
          Danger Zone
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 16 }}>
          Deleting a workspace will immediately revoke all associated API keys and permanently remove its analytics data.
        </p>
        
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="btn-danger"
        >
          {deleting ? "Deleting..." : "Delete Workspace"}
        </button>
      </div>
    </div>
  );
}
