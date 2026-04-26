"use client";

import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/components/ui/Toast";

/**
 * Client-side providers wrapping the entire app.
 * AuthProvider + ToastProvider must be client components.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
