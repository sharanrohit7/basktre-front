import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-56px)] max-w-[1080px] grid-cols-1 items-center gap-20 px-12 pb-24 pt-20 lg:grid-cols-2">
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(26,107,74,0.18)] bg-[var(--accent-light)] px-3 py-1 font-mono text-[11px] text-[var(--accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          Now in beta · 60+ models available
        </div>
        <h1 className="mb-5 font-[var(--font-serif)] text-[clamp(40px,5vw,62px)] leading-[1.08] tracking-[-1.5px]">
          AI API calls,
          <br />
          <em className="text-[var(--accent)]">smarter</em> and
          <br />
          cheaper.
        </h1>
        <p className="mb-8 max-w-[420px] text-base font-light leading-7 text-[var(--text-2)]">
          One API key. 60+ models. Let Basktre automatically pick the best model for each request - cutting your AI
          costs by up to 40% with no loss in quality.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/#waitlist" className="rounded-[7px] bg-[var(--ink)] px-5 py-2.5 text-[15px] font-medium text-white">
            Join the Waitlist
          </Link>
          <Link
            href="/#how-it-works"
            className="rounded-[7px] border border-[var(--border-dark)] px-5 py-2.5 text-[15px] text-[var(--text-2)]"
          >
            See how it works
          </Link>
        </div>
        <p className="mt-4 text-xs text-[var(--text-3)]">No prompts stored. No response logs. Ever.</p>
      </div>

      <div className="overflow-hidden rounded-[14px] bg-[var(--ink)] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="font-mono text-[11px] text-white/30">curl · quick start</span>
          <span className="rounded border border-white/20 px-2 py-0.5 font-mono text-[11px] text-white/30">copy</span>
        </div>
        <pre className="overflow-x-auto px-5 py-6 font-mono text-[12.5px] leading-8 text-white/85">
          {`# Get your API key at basktre.dev/dashboard

curl https://api.basktre.dev/v1/chat \\
  -H "Authorization: Bearer bsk_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "auto",
    "messages": [{ "role": "user", "content": "Summarize this document." }]
  }'`}
        </pre>
      </div>
    </section>
  );
}
