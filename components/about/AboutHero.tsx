export default function AboutHero() {
  return (
    <section className="mx-auto max-w-[760px] px-12 py-20">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
        {"// about"}
      </div>
      <h1 className="mb-5 font-[var(--font-serif)] text-[clamp(38px,5vw,58px)] leading-[1.1]">
        AI should cost less.
        <br />
        We&apos;re making
        <br />
        <em className="text-[var(--accent)]">that happen.</em>
      </h1>
      <div className="space-y-4 text-[17px] font-light leading-8 text-[var(--text-2)]">
        <p>
          Basktre is an API gateway that gives developers and teams access to 60+ AI models through a single key - and
          automatically routes each request to the most cost-efficient model that can handle it well.
        </p>
        <p>
          We&apos;re in beta, building in the open, and focused on one thing: making AI API access cheaper without
          making it worse.
        </p>
      </div>
    </section>
  );
}
