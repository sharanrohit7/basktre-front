"use client";

export default function AutoRoutingVisual() {
  const scenarios = [
    {
      label: "Summarisation",
      task: "Summarise a 2-page PDF.",
      tokens: "~320 tokens",
      quality: "Standard",
      model: "gemini-2.0-flash",
      provider: "Google",
      saving: "↓ 82% vs GPT-4o",
      color: "#4285f4",
      bg: "rgba(66,133,244,0.10)",
    },
    {
      label: "Complex reasoning",
      task: "Multi-step legal analysis.",
      tokens: "~4 800 tokens",
      quality: "High",
      model: "claude-3-5-sonnet",
      provider: "Anthropic",
      saving: "↓ 41% vs GPT-4o",
      color: "#d97706",
      bg: "rgba(217,119,6,0.10)",
    },
    {
      label: "Code generation",
      task: "Write a React data table.",
      tokens: "~1 200 tokens",
      quality: "High",
      model: "gpt-4o",
      provider: "OpenAI",
      saving: "Best fit for task",
      color: "#10a37f",
      bg: "rgba(16,163,127,0.10)",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes flowIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes flowOut {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes routerPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(26,107,74,0.0); }
          50%       { box-shadow: 0 0 0 6px rgba(26,107,74,0.12); }
        }
        @keyframes savingPop {
          0%   { opacity: 0; transform: scale(0.85); }
          60%  { opacity: 1; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        .scenario-card:nth-child(1) .flow-in  { animation: flowIn 0.45s 0.1s ease both; }
        .scenario-card:nth-child(1) .flow-out { animation: flowOut 0.45s 0.35s ease both; }
        .scenario-card:nth-child(1) .saving-pop { animation: savingPop 0.4s 0.55s ease both; }
        .scenario-card:nth-child(2) .flow-in  { animation: flowIn 0.45s 0.25s ease both; }
        .scenario-card:nth-child(2) .flow-out { animation: flowOut 0.45s 0.5s ease both; }
        .scenario-card:nth-child(2) .saving-pop { animation: savingPop 0.4s 0.7s ease both; }
        .scenario-card:nth-child(3) .flow-in  { animation: flowIn 0.45s 0.4s ease both; }
        .scenario-card:nth-child(3) .flow-out { animation: flowOut 0.45s 0.65s ease both; }
        .scenario-card:nth-child(3) .saving-pop { animation: savingPop 0.4s 0.85s ease both; }
        .router-node { animation: routerPulse 2.4s ease-in-out infinite; }
      `}</style>

      <section className="section" id="how-it-works">
        {/* Header */}
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
          {"// auto routing"}
        </div>
        <h2 className="mb-4 font-[var(--font-serif)] text-[clamp(30px,4vw,48px)] leading-tight">
          You say{" "}
          <em className="text-[var(--accent)]">&quot;auto&quot;</em>.
          <br />
          We do the math.
        </h2>
        <p className="mb-14 max-w-[520px] text-base font-light leading-7 text-[var(--text-2)]">
          Every request is analysed — length, complexity, task type — and routed to the cheapest model
          that can actually do the job. No config, no prompt engineering. Just set{" "}
          <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[12px] text-[var(--text)]">
            model: &quot;auto&quot;
          </code>{" "}
          and go home early.
        </p>

        {/* Three scenarios */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {scenarios.map((s) => (
            <div
              key={s.label}
              className="scenario-card overflow-hidden rounded-[14px] border border-[var(--border)] bg-white"
              style={{ borderLeft: `4px solid ${s.color}` }}
            >
              {/* Request pill */}
              <div className="border-b border-[var(--border)] px-5 py-4">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[1px] text-[var(--text-3)]">
                  Your request
                </div>
                <div className="flow-in font-mono text-[12.5px] leading-7">
                  <span className="text-[var(--text-3)]">model: </span>
                  <span className="text-[var(--accent)]">&quot;auto&quot;</span>
                  <br />
                  <span className="text-[var(--text-3)]">task: </span>
                  <span className="text-[var(--text)]">{s.task}</span>
                  <br />
                  <span className="text-[var(--text-3)]">tokens: </span>
                  <span className="text-[var(--text)]">{s.tokens}</span>
                </div>
              </div>

              {/* Router node */}
              <div className="flex items-center justify-center border-b border-[var(--border)] py-3">
                <div
                  className="router-pulse flex items-center gap-2 rounded-full border border-[rgba(26,107,74,0.2)] bg-[var(--accent-light)] px-3 py-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  <span className="font-mono text-[10.5px] text-[var(--accent)]">basktre router</span>
                </div>
              </div>

              {/* Selected model */}
              <div className="px-5 py-4">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[1px] text-[var(--text-3)]">
                  Model selected
                </div>
                <div
                  className="flow-out mb-3 flex items-center gap-2 rounded-lg px-3 py-2.5"
                  style={{ background: s.bg }}
                >
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold"
                    style={{ background: s.color, color: "#fff" }}
                  >
                    {s.provider.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="font-mono text-[12px] font-semibold" style={{ color: s.color }}>
                    {s.model}
                  </span>
                </div>
                <div className="saving-pop flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[var(--text-3)]">{s.label}</span>
                  <span
                    className="rounded-full border px-2.5 py-1 font-mono text-[12px] font-bold"
                    style={{ background: s.bg, color: s.color, borderColor: `${s.color}44` }}
                  >
                    {s.saving}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Override callout */}
        <div className="mt-8 flex items-start gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
          <span className="mt-0.5 font-mono text-[13px] text-[var(--text-3)]">→</span>
          <p className="text-[13px] font-light leading-6 text-[var(--text-2)]">
            Want a specific model?{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[12px] text-[var(--text)]">
              model: &quot;gpt-4o&quot;
            </code>{" "}
            works exactly as you&apos;d expect. Auto is opt-in, not mandatory.
          </p>
        </div>
      </section>
    </>
  );
}
