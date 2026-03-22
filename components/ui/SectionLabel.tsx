export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">{children}</div>;
}
