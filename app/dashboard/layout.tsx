"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show nothing while checking auth (prevents flash)
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: "var(--text-3)",
          fontSize: 14
        }}
      >
        <span className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecting...
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: "var(--sidebar-width)",
          padding: "32px 40px",
          minHeight: "100vh",
          background: "var(--bg)"
        }}
      >
        {children}
      </main>
    </div>
  );
}
