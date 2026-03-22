export default function MissionBand() {
  return (
    <section className="bg-[var(--ink)] px-12 py-[72px] text-white">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[#86efac]">{"// why we exist"}</div>
        <p className="mb-6 font-[var(--font-serif)] text-[clamp(28px,4vw,44px)] leading-tight">
          Most AI spend is <em className="text-[#86efac]">waste in disguise.</em>
        </p>
        <p className="text-base font-light leading-8 text-white/50">
          Developers often default to the most capable model, but many requests only need a fast, cheap, correct
          answer. Basktre finds that balance automatically.
        </p>
      </div>
    </section>
  );
}
