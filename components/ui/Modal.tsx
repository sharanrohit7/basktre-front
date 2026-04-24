"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export default function Modal({ open, onClose, title, children, maxWidth = 440 }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={title}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        width: "100%",
        height: "100%",
        maxWidth: "none",
        maxHeight: "none",
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(2px)",
          animation: "modal-backdrop-enter 0.2s ease-out"
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "90%",
          maxWidth,
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-xl)",
          animation: "modal-content-enter 0.25s ease-out",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--border)"
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "transparent",
              color: "var(--text-3)",
              cursor: "pointer",
              fontSize: 16,
              transition: "background 0.15s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 24px" }}>{children}</div>
      </div>
    </dialog>
  );
}
