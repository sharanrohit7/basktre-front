"use client";

import { useState } from "react";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import Link from "next/link";

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `# Basktre picks the cheapest capable model automatically
# Get your key at basktre.in/dashboard

curl https://api.basktre.in/v1/chat \\
  -H "api-key: your_basktre_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "auto",
    "messages": [{ "role": "user", "content": "Summarize this." }]
  }'`;

  return (
    <>
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hero-fade { animation: heroFadeUp 0.55s ease both; }
        .hero-fade-1 { animation-delay: 0.05s; }
        .hero-fade-2 { animation-delay: 0.15s; }
        .hero-fade-3 { animation-delay: 0.25s; }
        .hero-fade-4 { animation-delay: 0.35s; }
        .hero-copy-btn:hover { background: rgba(255,255,255,0.12) !important; }
      `}</style>

      <section className="mx-auto grid min-h-[calc(100vh-56px)] max-w-[1080px] grid-cols-1 items-center gap-16 px-12 pb-24 pt-16 lg:grid-cols-2">
        {/* ── Left copy ── */}
        <div>
          {/* Live badge */}
          <div
            className="hero-fade hero-fade-1 mb-6 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[rgba(26,107,74,0.22)] bg-[var(--accent-light)] px-3 py-1 font-mono text-[11px] text-[var(--accent)]"
          >
            <span
              className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]"
              style={{ animation: "badgePulse 2s ease-in-out infinite" }}
            />
            Live · 60+ models · zero waitlist
          </div>

          {/* Headline */}
          <h1
            className="hero-fade hero-fade-2 mb-5 font-[var(--font-serif)] text-[clamp(40px,5vw,64px)] leading-[1.06] tracking-[-1.5px]"
          >
            One key.
            <br />
            Every model.
            <br />
            <em className="text-[var(--accent)]">Zero markup.</em>
          </h1>

          {/* Sub-headline */}
          <p className="hero-fade hero-fade-3 mb-8 max-w-[430px] text-base font-light leading-[1.85] text-[var(--text-2)]">
            One Basktre API key unlocks 60+ models — GPT, Claude, Gemini, Llama,
            DeepSeek, and more. Set&nbsp;
            <code className="rounded bg-[var(--surface)] px-1 py-0.5 font-mono text-[12px] text-[var(--text)]">
              model:&nbsp;&quot;auto&quot;
            </code>{" "}
            and we route each request to the cheapest model that can do the job.
            Avg&nbsp;~40% savings, automatically.{" "}
            <strong className="font-semibold text-[var(--text)]">
              We charge 4% on wallet top-ups. Every other cent goes straight to model costs.
            </strong>
          </p>

          {/* CTAs */}
          <div className="hero-fade hero-fade-4">
            <div className="mb-4">
              <GoogleSignInButton />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/#how-it-works"
                className="rounded-[7px] border border-[var(--border-dark)] bg-white px-5 py-2.5 text-[14px] font-medium text-[var(--text-2)] transition-all hover:border-[var(--text-3)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
              >
                See how it works
              </Link>
              <Link
                href="/#providers"
                className="px-3 py-2 text-[13px] text-[var(--text-3)] transition-colors hover:text-[var(--text-2)]"
              >
                Browse models &amp; pricing →
              </Link>
            </div>

            {/* Trust line */}
            <p className="mt-5 text-[11.5px] leading-6 text-[var(--text-3)]">
              No prompts stored.&ensp;·&ensp;No response logs.&ensp;·&ensp;4% platform fee.&ensp;·&ensp;That&apos;s it.
            </p>
          </div>
        </div>

        {/* ── Right: terminal card ── */}
        <div
          className="hero-fade hero-fade-3 overflow-hidden rounded-[14px] shadow-[0_24px_72px_rgba(0,0,0,0.14)]"
          style={{ background: "var(--ink)" }}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-[11px] text-white/30">curl · quick start</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(codeSnippet);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="rounded border border-white/20 px-2 py-0.5 font-mono text-[11px] text-white/30 transition-all hover:border-white/40 hover:text-white/60"
              style={{ background: "transparent" }}
            >
              {copied ? "copied ✓" : "copy"}
            </button>
          </div>

          {/* Code */}
          <pre className="overflow-x-auto px-5 py-6 font-mono text-[12.5px] leading-[1.9] text-white/80">
            <span className="text-white/30">{`# Basktre picks the cheapest capable model automatically\n# Get your key at basktre.in/dashboard\n\n`}</span>
            <span className="text-[#86efac]">curl</span>
            {` https://api.basktre.in/v1/chat \\\n`}
            {"  "}
            <span className="text-[#93c5fd]">-H</span>
            {` "api-key: `}
            <span className="text-[#fde68a]">your_basktre_key</span>
            {`" \\\n`}
            {"  "}
            <span className="text-[#93c5fd]">-H</span>
            {` "Content-Type: application/json" \\\n`}
            {"  "}
            <span className="text-[#93c5fd]">-d</span>
            {` '{\n    `}
            <span className="text-[#f9a8d4]">&quot;model&quot;</span>
            {`: `}
            <span className="text-[#86efac]">&quot;auto&quot;</span>
            {`,\n    `}
            <span className="text-[#f9a8d4]">&quot;messages&quot;</span>
            {`: [{`}
            <span className="text-[#f9a8d4]">&quot;role&quot;</span>
            {`: `}
            <span className="text-[#86efac]">&quot;user&quot;</span>
            {`, `}
            <span className="text-[#f9a8d4]">&quot;content&quot;</span>
            {`: `}
            <span className="text-[#fde68a]">&quot;Summarize this.&quot;</span>
            {`}]\n  }'`}
          </pre>

          {/* Bottom response preview */}
          <div className="border-t border-white/10 px-5 py-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[1px] text-white/25">
              auto-routed response
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[rgba(134,239,172,0.15)] px-2 py-0.5 font-mono text-[11px] text-[#86efac]">
                  gemini-2.0-flash
                </span>
                <span className="font-mono text-[11px] text-white/35">selected by router</span>
              </div>
              <span className="font-mono text-[11px] text-[#86efac]">↓ 78% cost</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
