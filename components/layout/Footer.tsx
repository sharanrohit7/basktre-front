import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] px-12 py-8">
      <div className="flex flex-col gap-1">
        <span className="text-[13px] text-[var(--text-3)]">© 2026 Basktre · Beta</span>
        <span className="text-[13px] text-[var(--text-3)]">Legal Entity: Microstack Labs</span>
        <a href="mailto:tech@basktre.in" className="text-[13px] text-[var(--text-3)]">
          Contact: tech@basktre.in
        </a>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link href="/openrouter-alternative" className="text-[13px] text-[var(--text-3)]">OpenRouter alternative</Link>
        <Link href="/llm-api-pricing" className="text-[13px] text-[var(--text-3)]">LLM pricing</Link>
        <Link href="/llm-api-cost-calculator" className="text-[13px] text-[var(--text-3)]">Cost calculator</Link>
        <Link href="/llm-router" className="text-[13px] text-[var(--text-3)]">LLM router</Link>
        <Link href="/unified-llm-api" className="text-[13px] text-[var(--text-3)]">Unified API</Link>
        <Link href="/about" className="text-[13px] text-[var(--text-3)]">
          About
        </Link>
        <Link href="/privacy" className="text-[13px] text-[var(--text-3)]">
          Privacy
        </Link>
        <Link href="/terms" className="text-[13px] text-[var(--text-3)]">
          Terms
        </Link>
      </div>
    </footer>
  );
}
