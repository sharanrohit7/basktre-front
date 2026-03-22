export default function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-[var(--ink)] p-5 font-mono text-xs leading-7 text-white/80">{code}</pre>
  );
}
