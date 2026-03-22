export default function FactsGrid() {
  return (
    <section className="border-y border-[var(--border)] bg-white px-12 py-[72px]">
      <div className="mx-auto max-w-[760px]">
        <h2 className="mb-9 font-[var(--font-serif)] text-4xl">Basktre in numbers</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Fact num="60+" label="Models available in beta across all major providers" />
          <Fact num="~40%" label="Average cost reduction when using auto routing" />
          <Fact num="0" label="Bytes of prompt or response data stored on our servers" />
          <Fact num="1" label="API key needed to access every supported model" />
        </div>
      </div>
    </section>
  );
}

function Fact({ num, label }: { num: string; label: string }) {
  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg)] px-6 py-5">
      <div className="mb-1 font-[var(--font-serif)] text-[38px] leading-none tracking-[-1px]">{num}</div>
      <div className="text-[13.5px] font-light text-[var(--text-2)]">{label}</div>
    </div>
  );
}
