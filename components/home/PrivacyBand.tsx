const pillars = [
  {
    icon: "🔒",
    title: "Zero logs",
    desc: "Your prompts never touch our database. Requests are proxied through and immediately discarded — we have no access to your conversation content.",
  },
  {
    icon: "🚫",
    title: "Zero training",
    desc: "We don't use your data to improve models, fine-tune anything, or sell insights. Not now, not ever. It's not our data.",
  },
  {
    icon: "💸",
    title: "Zero markup",
    desc: "4% on wallet top-ups. 100% of the rest goes directly to model costs at exact provider rates. No hidden fees, no per-request margin, no surprises.",
  },
];

export default function PrivacyBand() {
  return (
    <section className="bg-[var(--ink)] px-12 py-20 text-white">
      <div className="mx-auto max-w-[1080px]">
        {/* Header */}
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[#86efac]">
          {"// our commitment"}
        </div>
        <h2 className="mb-4 font-[var(--font-serif)] text-[clamp(30px,4vw,48px)] leading-tight text-white">
          We see the call.
          <br />
          Never the content.
        </h2>
        <p className="mb-14 max-w-[520px] text-base font-light leading-7 text-white/70">
          Basktre is infrastructure. We route your requests — we don&apos;t read them, log them, or use them for
          anything. These aren&apos;t policies. They&apos;re architectural constraints.
        </p>

        {/* Three pillars */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-[14px] border border-white/10 bg-white/[0.04] p-7 transition-colors hover:bg-white/[0.07]"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center text-xl">{p.icon}</div>
              <h3 className="mb-2.5 text-[16px] font-semibold tracking-[-0.2px] text-white">{p.title}</h3>
              <p className="text-[13.5px] font-light leading-7 text-white/70">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Data table */}
        <div className="mt-10 rounded-[14px] border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[1.5px] text-[#86efac]">
            {"// what we log"}
          </div>
          <div className="mb-4 text-[13px] text-white/40">Only two things. Everything else is discarded.</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { item: "Prompt text", stored: false },
              { item: "Model response", stored: false },
              { item: "Token count (billing)", stored: true },
              { item: "Latency & model used", stored: true },
            ].map(({ item, stored }) => (
              <div key={item} className="flex items-center justify-between rounded-lg border border-white/[0.07] px-3 py-2.5">
                <span className="text-[12.5px] text-white/75">{item}</span>
                <span
                  className="font-mono text-[11px] font-semibold"
                  style={{ color: stored ? "#86efac" : "#fca5a5" }}
                >
                  {stored ? "yes" : "never"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
