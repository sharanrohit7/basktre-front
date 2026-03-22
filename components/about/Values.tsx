const values = [
  {
    key: "transparency",
    body: "Every response tells you which model was used and what it cost."
  },
  {
    key: "privacy",
    body: "We never store prompts or model responses. Billing metadata only."
  },
  {
    key: "simplicity",
    body: "One key, one endpoint, one bill."
  },
  {
    key: "fairness",
    body: "Provider rates are passed through at cost during beta."
  }
];

export default function Values() {
  return (
    <section className="mx-auto max-w-[760px] px-12 py-20">
      <h2 className="mb-10 font-[var(--font-serif)] text-4xl">What we believe in</h2>
      <div className="border-t border-[var(--border)]">
        {values.map((value) => (
          <div key={value.key} className="grid grid-cols-[180px_1fr] gap-8 border-b border-[var(--border)] py-7">
            <div className="pt-1 font-mono text-xs uppercase tracking-[0.8px] text-[var(--accent)]">{value.key}</div>
            <p className="text-[15px] font-light leading-7 text-[var(--text-2)]">{value.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
