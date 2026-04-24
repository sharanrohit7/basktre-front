"use client";

import { useState } from "react";
import EmptyState from "@/components/dashboard/EmptyState";
import CreateWorkspaceModal from "@/components/dashboard/CreateWorkspaceModal";
import UsageDashboard from "@/components/dashboard/UsageDashboard";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { activeWorkspace, workspaces } = useAuth();
  const [showCreateWs, setShowCreateWs] = useState(false);

  return (
    <>
      {activeWorkspace ? (
        <UsageDashboard />
      ) : (
        <>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: "var(--text-3)" }}>
              {workspaces.length === 0
                ? "Get started by creating your first workspace"
                : "Select a workspace from the sidebar to view analytics"}
            </p>
          </div>

          <EmptyState
            headline={workspaces.length === 0 ? "Your workspace is ready" : "Select a workspace"}
            subtext={
              workspaces.length === 0
                ? "Start building with Basktre. Create a workspace to manage your API keys and track usage across your projects."
                : "You have workspaces available. Select one from the sidebar dropdown, or create a new one."
            }
            action={
              <button
                onClick={() => setShowCreateWs(true)}
                className="btn-accent"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Create a workspace
              </button>
            }
          />
        </>
      )}

      <CreateWorkspaceModal open={showCreateWs} onClose={() => setShowCreateWs(false)} />
    </>
  );
}
