export default function ContactCards() {
  return (
    <section className="mx-auto max-w-[760px] px-12 py-20">
      <h2 className="mb-3 font-[var(--font-serif)] text-4xl">Get in touch</h2>
      <p className="mb-8 text-[15px] font-light leading-7 text-[var(--text-2)]">
        We&apos;re a small team and we read every message. Reach out for questions, bug reports, or anything else.
      </p>
      <div className="space-y-2.5">
        <Card label="Contact us" email="tech@basktre.in" />
      </div>
    </section>
  );
}

function Card({ label, email }: { label: string; email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="flex items-center rounded-[10px] border border-[var(--border)] bg-white px-5 py-4 transition hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="font-mono text-[12.5px] text-[var(--text-3)]">{email}</p>
      </div>
      <span className="ml-auto text-lg text-[var(--text-3)]">→</span>
    </a>
  );
}
