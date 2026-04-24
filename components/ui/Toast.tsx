"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Toast as ToastType, ToastType as TType } from "@/types";

interface ToastContextValue {
  toasts: ToastType[];
  addToast: (type: TType, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = useCallback((type: TType, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss after 4s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>");
  }
  return ctx;
}

// ─── Toast container ─────────────────────────────────

function ToastContainer({
  toasts,
  onDismiss
}: {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 400
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss
}: {
  toast: ToastType;
  onDismiss: (id: string) => void;
}) {
  const bgColors: Record<TType, string> = {
    success: "var(--success-light)",
    error: "var(--danger-light)",
    info: "var(--surface)"
  };
  const borderColors: Record<TType, string> = {
    success: "rgba(22,163,74,0.2)",
    error: "rgba(220,38,38,0.2)",
    info: "var(--border)"
  };
  const textColors: Record<TType, string> = {
    success: "var(--success)",
    error: "var(--danger)",
    info: "var(--text)"
  };
  const icons: Record<TType, string> = {
    success: "✓",
    error: "✕",
    info: "ℹ"
  };

  return (
    <div
      role="alert"
      className="toast-enter"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        borderRadius: "var(--radius-md)",
        background: bgColors[toast.type],
        border: `1px solid ${borderColors[toast.type]}`,
        boxShadow: "var(--shadow-lg)",
        fontSize: 13,
        color: textColors[toast.type],
        fontWeight: 500,
        cursor: "pointer"
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <span style={{ fontSize: 14, flexShrink: 0 }}>{icons[toast.type]}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  );
}
