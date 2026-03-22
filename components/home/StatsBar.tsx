const stats = [
  "60+ models in beta",
  "~40% avg. cost reduction",
  "1 API key to manage",
  "0 data stored",
  "pay-as-you-go pricing"
];

export default function StatsBar() {
  return (
    <section className="border-y border-[var(--border)] bg-white">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-6 px-12 py-7">
        {stats.map((item) => (
          <div key={item} className="text-[12.5px] font-mono text-[var(--text-3)]">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
