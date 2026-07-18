// 4 stats that fit in one row without wrapping
const stats = [
  { value: "60+", label: "models available", accent: false },
  { value: "Auto", label: "cost-aware routing", accent: false },
  { value: "4%", label: "platform fee — nothing else", accent: true },
  { value: "0", label: "prompt or response bodies stored", accent: false },
];

export default function StatsBar() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-[1080px] grid-cols-2 gap-6 px-6 py-5 lg:flex lg:items-center lg:justify-between lg:px-12">
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
