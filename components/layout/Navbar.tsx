"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const auth = useAuthSafe();

  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] flex h-14 items-center justify-between border-b border-[var(--border)] bg-[rgba(250,249,247,0.9)] px-12 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2.5 text-[var(--text)] no-underline">
        <div className="relative h-[26px] w-[26px] rounded-md bg-[var(--accent)]" />
        <span className="text-base font-semibold">basktre</span>
        <span className="rounded-full border border-[rgba(26,107,74,0.2)] bg-[var(--accent-light)] px-2 py-0.5 font-mono text-[10px] text-[var(--accent)]">
          beta
        </span>
      </Link>
      <div className="flex items-center gap-7 text-sm">
        <Link href="/#faq" className="text-[var(--text-2)]">
          FAQ
        </Link>
        <Link href="#" className="text-[var(--text-2)]">
          Docs
        </Link>
        {auth?.isAuthenticated ? (
          <Link
            href="/dashboard"
            className="rounded-[7px] bg-[var(--ink)] px-3.5 py-2 text-[13.5px] font-medium text-white"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href="/#start-building"
            className="rounded-[7px] border border-[var(--border-dark)] px-4 py-1.5 text-[13.5px] font-medium text-[var(--text-2)] transition-colors hover:border-[var(--text-3)] hover:text-[var(--text)]"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}

/**
 * Safe wrapper that returns null if AuthProvider is not mounted.
 * This allows Navbar to work on pages that don't have AuthProvider.
 */
function useAuthSafe() {
  try {
    return useAuth();
  } catch {
    return null;
  }
}
