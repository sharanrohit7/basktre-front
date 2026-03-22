export default function PrivacyBand() {
  return (
    <section className="bg-[var(--ink)] px-12 py-[72px] text-white">
      <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[#86efac]">{"// privacy"}</div>
          <h2 className="mb-4 font-[var(--font-serif)] text-[clamp(30px,4vw,48px)] leading-tight">
            We see the call.
            <br />
            Never the content.
          </h2>
          <p className="text-base font-light leading-7 text-white/50">
            Basktre is infrastructure. We route your requests - we don&apos;t read them, log them, or use them for
            anything.
          </p>
        </div>
        <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-8">
          <div className="mb-4 font-mono text-[11px] uppercase tracking-[1px] text-white/30">Data we store</div>
          <div className="space-y-2 text-sm text-white/65">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Prompt text</span>
              <span className="font-mono text-[#fca5a5]">never</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Model response</span>
              <span className="font-mono text-[#fca5a5]">never</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Token count (billing)</span>
              <span className="font-mono text-[#86efac]">yes</span>
            </div>
            <div className="flex justify-between">
              <span>Latency & model used</span>
              <span className="font-mono text-[#86efac]">yes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
