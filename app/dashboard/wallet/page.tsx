"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { getWallet, getWalletTransactions } from "@/lib/api";
import type { WorkspaceWallet, WalletTransaction } from "@/types";
import EmptyState from "@/components/dashboard/EmptyState";

export default function WalletPage() {
  const { activeWorkspace, token } = useAuth();
  const [wallet, setWallet] = useState<WorkspaceWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!activeWorkspace || !token) return;

    setLoading(true);
    setError(null);
    try {
      const [walletRes, txRes] = await Promise.all([
        getWallet(token, activeWorkspace.id),
        getWalletTransactions(token, activeWorkspace.id),
      ]);
      setWallet(walletRes.data?.wallet || null);
      setTransactions(txRes.data?.transactions || []);
    } catch (e: any) {
      setError(e.message || "Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace, token]);

  useEffect(() => {
    load();
  }, [load]);

  if (!activeWorkspace) {
    return (
      <EmptyState
        headline="No workspace selected"
        subtext="Please select or create a workspace to view its wallet."
      />
    );
  }

  return (
    <div style={{ maxWidth: 900, width: "100%" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Workspace Wallet</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)" }}>
          Manage your balance and view transaction history for {activeWorkspace.name}
        </p>
      </div>

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
          }}
        >
          {error}
        </div>
      )}

      {/* Wallet Balance Card */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
          marginBottom: 32,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 8 }}>Available Balance</div>
            <div style={{ fontSize: 36, fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-serif)" }}>
              {loading ? (
                <div className="skeleton" style={{ width: 120, height: 40 }} />
              ) : wallet ? (
                `$${wallet.balance.toFixed(4)}`
              ) : (
                "$0.0000"
              )}
            </div>
            {!loading && wallet && (wallet.credit_limit || 0) > 0 && (
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 8 }}>
                Includes ${(wallet.credit_limit || 0).toFixed(2)} promotional credit
              </div>
            )}
          </div>
          <div>
            <button className="btn-accent" disabled={loading}>
              Add Funds
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 500, fontFamily: "var(--font-serif)", marginBottom: 16 }}>
          Recent Transactions
        </h2>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
             {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 48, marginBottom: 1 }} />
             ))}
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-3)", fontSize: 14 }}>
            No transactions found for this workspace.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
              <thead>
                <tr>
                  <th style={{ fontWeight: 500, color: "var(--text-3)", fontSize: 12, padding: "0 12px 12px 0", borderBottom: "1px solid var(--border-dark)" }}>Date</th>
                  <th style={{ fontWeight: 500, color: "var(--text-3)", fontSize: 12, padding: "0 12px 12px 0", borderBottom: "1px solid var(--border-dark)" }}>Description</th>
                  <th style={{ fontWeight: 500, color: "var(--text-3)", fontSize: 12, padding: "0 12px 12px 0", borderBottom: "1px solid var(--border-dark)" }}>Type</th>
                  <th style={{ fontWeight: 500, color: "var(--text-3)", fontSize: 12, padding: "0 12px 12px 0", borderBottom: "1px solid var(--border-dark)", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 12px 14px 0", color: "var(--text-3)", whiteSpace: "nowrap" }}>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "14px 12px 14px 0", color: "var(--text-2)" }}>
                      {tx.description || tx.reference_id}
                    </td>
                    <td style={{ padding: "14px 12px 14px 0", color: "var(--text-2)" }}>
                      <span style={{
                        display: "inline-block",
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--tag-bg)",
                        color: "var(--text-2)"
                      }}>
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td style={{ 
                      padding: "14px 12px 14px 0", 
                      fontFamily: "var(--font-mono)",
                      textAlign: "right",
                      color: tx.amount < 0 ? "var(--text)" : "var(--success)",
                      fontWeight: 500
                    }}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
