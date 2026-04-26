// 4 stats that fit in one row without wrapping
const stats = [
  { value: "60+", label: "models available", accent: false },
  { value: "~40%", label: "avg cost reduction", accent: false },
  { value: "4%", label: "platform fee — nothing else", accent: true },
  { value: "0", label: "data stored, ever", accent: false },
];

export default function StatsBar() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-12 py-5">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            {/* Divider between items */}
            {i > 0 && (
              <div className="mx-8 h-7 w-px bg-[var(--border)]" />
            )}
            <div className="flex flex-col items-center text-center">
              <span
                className="font-[var(--font-serif)] text-[clamp(20px,2.5vw,28px)] leading-none tracking-tight"
                style={{ color: stat.accent ? "var(--accent)" : "var(--text)" }}
              >
                {stat.value}
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.7px] text-[var(--text-3)]">
                {stat.label}
              </span>
              {stat.accent && (
                <span className="mt-1 rounded-full bg-[var(--accent-light)] px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.5px] text-[var(--accent)]">
                  our only fee
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
