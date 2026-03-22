export default function AutoRoutingVisual() {
  return (
    <section className="section" id="how-it-works">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">{"// auto routing"}</div>
      <h2 className="mb-4 font-[var(--font-serif)] text-[clamp(30px,4vw,48px)] leading-tight">
        Set model to <em className="text-[var(--accent)]">&quot;auto&quot;</em>. We handle the rest.
      </h2>
      <p className="max-w-[520px] text-base font-light leading-7 text-[var(--text-2)]">
        Basktre analyses your request - length, complexity, task type - and picks the cheapest model that can do it
        well. You specify the quality bar, we minimise the cost.
      </p>

      <div className="mt-16 grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-xl border border-[var(--border)] bg-white p-7">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-3)]">Your request</div>
          <div className="font-mono text-[13px] leading-7">
            model: <span className="text-[var(--accent)]">&quot;auto&quot;</span>
            <br />
            task: summarise
            <br />
            tokens: ~320
            <br />
            quality: standard
          </div>
        </div>
        <div className="px-2 py-2 font-mono text-[10px] uppercase tracking-[0.5px] text-[var(--accent)]">basktre router</div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-7">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[1px] text-[var(--text-3)]">Model selected</div>
          <div className="rounded-lg border border-[rgba(26,107,74,0.2)] bg-[var(--accent-light)] px-3 py-2 text-[13px]">
            gemini-2.0-flash - Best cost-to-quality for summarisation
          </div>
          <div className="mt-3 text-right font-mono text-[13px] text-[var(--accent)]">↓ 82% on this call</div>
        </div>
      </div>
    </section>
  );
}
