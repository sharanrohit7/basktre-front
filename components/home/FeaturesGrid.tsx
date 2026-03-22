const features = [
  {
    title: "One API key",
    desc: "No need to manage accounts across OpenAI, Anthropic, Google, and more."
  },
  {
    title: "Auto routing",
    desc: "Set model to auto and we pick the cheapest capable model for each request."
  },
  {
    title: "Pin a model anytime",
    desc: "Specify a single model directly when precision matters."
  },
  {
    title: "Zero data retention",
    desc: "Prompts and responses are proxied through and immediately discarded."
  },
  {
    title: "Pay as you go",
    desc: "Charged per token. No monthly minimums, no seat fees."
  },
  {
    title: "60+ models, one endpoint",
    desc: "Access major frontier and open models through one API."
  }
];

export default function FeaturesGrid() {
  return (
    <section className="section pt-0">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">{"// what you get"}</div>
      <h2 className="mb-12 font-[var(--font-serif)] text-[clamp(30px,4vw,48px)] leading-tight">
        Everything you need.
        <br />
        Nothing you don&apos;t.
      </h2>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--border)] lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white p-8">
            <h3 className="mb-2 text-[15px] font-semibold tracking-[-0.2px]">{feature.title}</h3>
            <p className="text-[13.5px] font-light leading-7 text-[var(--text-2)]">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
