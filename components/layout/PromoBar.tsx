"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function PromoBar() {
  const auth = useAuthSafe();

  if (auth?.isAuthenticated) return null;

  return (
    <div
      className="relative z-[110] overflow-hidden bg-[var(--ink)] py-2.5 text-center"
      role="banner"
      aria-label="Limited time offer: $1 free AI credits"
    >
      {/* Ticker shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

      <Link
        href="/#launch-offer"
        className="group relative inline-flex items-center gap-3 text-white"
        aria-label="Claim your $1 free AI credit — no credit card required"
      >
        {/* Flame emoji pulse */}
        <span className="text-base" aria-hidden="true" style={{ animation: "flicker 1.8s ease-in-out infinite alternate" }}>🔥</span>

        <span className="text-[12.5px] font-light tracking-wide text-white/70">
          <strong className="font-semibold text-white">Launch offer:</strong>{" "}
          Sign up now &amp; claim{" "}
          <mark className="bg-transparent text-[#4ade80] font-bold not-italic">
            $1.00 FREE AI credits
          </mark>
          {" "}— no card, no catch, instant.
        </span>

        <span
          className="rounded-full bg-[#4ade80] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-widest text-[#052e16] transition-transform group-hover:scale-105"
        >
          Claim now →
        </span>
      </Link>

      <style>{`
        @keyframes flicker {
          from { transform: scale(1) rotate(-3deg); }
          to   { transform: scale(1.15) rotate(3deg); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function useAuthSafe() {
  try {
    return useAuth();
  } catch {
    return null;
  }
}
