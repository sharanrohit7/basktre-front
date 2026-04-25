const features = [
  {
    icon: "🗝️",
    title: "Stop juggling 6 dashboards",
    desc: "One Basktre key unlocks every major model. Swap providers without touching your code.",
  },
  {
    icon: "⚡",
    title: "Let the router earn its keep",
    desc: 'Send model: "auto" and we pick the cheapest model that can do the job. ~40% savings, zero effort.',
  },
  {
    icon: "🎯",
    title: "Full control when you want it",
    desc: 'Need GPT-4o for a specific task? model: "gpt-4o" — no lock-in, override anything.',
  },
  {
    icon: "🔒",
    title: "Your prompts are none of our business",
    desc: "Nothing stored, nothing logged. Requests proxy through and are immediately discarded.",
  },
  {
    icon: "💸",
    title: "Top up. Use. Done.",
    desc: "Add funds to your wallet. 100% goes toward model costs. We take 4%. That's the whole deal.",
  },
  {
    icon: "🌐",
    title: "Every frontier model, one place",
    desc: "GPT-4o, Claude, Gemini, Llama, DeepSeek, Qwen — all here, always current.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="section pt-0">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
        {"// what you get"}
      </div>
      <h2 className="mb-12 font-[var(--font-serif)] text-[clamp(30px,4vw,48px)] leading-tight">
        Everything you need.
        <br />
        Nothing you don&apos;t.
      </h2>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--border)] lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card bg-white p-6">
            <div className="mb-3 flex h-8 w-8 items-center justify-center text-xl">
              {feature.icon}
            </div>
            <h3 className="mb-2 text-[14.5px] font-semibold leading-snug tracking-[-0.2px] text-[var(--text)]">
              {feature.title}
            </h3>
            <p className="text-[13px] font-light leading-[1.75] text-[var(--text-2)]">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
