"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import type { Workspace } from "@/types";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    label: "API Keys",
    href: "/dashboard/api-keys",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M11.5 7.5a4 4 0 1 0-3 3.87V13h2v2h2v-2h1v-2h-3V11.37a4 4 0 0 0 1-3.87z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="7.5" r="1" fill="currentColor" />
      </svg>
    )
  },
  {
    label: "Wallet",
    href: "/dashboard/wallet",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 9h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 4v10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M9 2v1.5M9 14.5V16M16 9h-1.5M3.5 9H2M14.07 3.93l-1.06 1.06M4.99 13.01l-1.06 1.06M14.07 14.07l-1.06-1.06M4.99 4.99L3.93 3.93"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, workspaces, activeWorkspace, setActiveWorkspace, logout } = useAuth();
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: "var(--sidebar-width)",
        background: "var(--sidebar-bg)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        borderRight: "1px solid var(--sidebar-border)"
      }}
    >
      {/* ─── Top: Logo + workspace ─── */}
      <div
        style={{
          padding: "20px 16px 12px",
          borderBottom: "1px solid var(--sidebar-border)"
        }}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            marginBottom: 16
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "var(--sidebar-accent)",
              flexShrink: 0
            }}
          />
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--sidebar-text-active)"
            }}
          >
            basktre
          </span>
        </Link>

        {/* Workspace switcher */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
            aria-label="Switch workspace"
            aria-expanded={wsDropdownOpen}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "8px 10px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--sidebar-border)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--sidebar-text)",
              fontSize: 13,
              cursor: "pointer",
              transition: "background 0.15s"
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeWorkspace?.name ?? "No workspace"}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {wsDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: 4,
                background: "#2a2925",
                border: "1px solid var(--sidebar-border)",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
                zIndex: 10,
                boxShadow: "var(--shadow-lg)"
              }}
            >
              {workspaces.map((ws: Workspace) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setWsDropdownOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 12px",
                    border: "none",
                    background:
                      activeWorkspace?.id === ws.id ? "rgba(255,255,255,0.08)" : "transparent",
                    color:
                      activeWorkspace?.id === ws.id
                        ? "var(--sidebar-text-active)"
                        : "var(--sidebar-text)",
                    fontSize: 13,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={(e) => {
                    if (activeWorkspace?.id !== ws.id) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeWorkspace?.id !== ws.id) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {ws.name}
                </button>
              ))}
              {workspaces.length === 0 && (
                <div
                  style={{
                    padding: "12px",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    textAlign: "center"
                  }}
                >
                  No workspaces yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Nav links ─── */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: "var(--radius-sm)",
                color: isActive ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
                background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                fontSize: 13.5,
                fontWeight: isActive ? 500 : 400,
                textDecoration: "none",
                transition: "background 0.15s, color 0.15s"
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "var(--sidebar-text-active)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--sidebar-text)";
                }
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ─── Bottom: User info + sign out ─── */}
      <div
        style={{
          padding: "12px 16px 16px",
          borderTop: "1px solid var(--sidebar-border)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          {/* Avatar */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--sidebar-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              flexShrink: 0
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--sidebar-text-active)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {user?.name ?? "User"}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--sidebar-text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {user?.email ?? ""}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--sidebar-border)",
            background: "transparent",
            color: "var(--sidebar-text)",
            fontSize: 12,
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(220,38,38,0.1)";
            e.currentTarget.style.color = "#f87171";
            e.currentTarget.style.borderColor = "rgba(220,38,38,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--sidebar-text)";
            e.currentTarget.style.borderColor = "var(--sidebar-border)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M5 12H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2M9.5 10l3-3-3-3M12.5 7H5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}
