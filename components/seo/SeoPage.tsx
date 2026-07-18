import Link from "next/link";
import JsonLd from "./JsonLd";

export type Faq = { question: string; answer: string };
export function SeoPage({ path, eyebrow, title, intro, children, faqs = [] }: { path: string; eyebrow: string; title: string; intro: string; children: React.ReactNode; faqs?: Faq[] }) {
  const url = `https://basktre.in${path}`;
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://basktre.in" }, { "@type": "ListItem", position: 2, name: title, item: url }] }} />
    {faqs.length > 0 && <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }} />}
    <article className="mx-auto max-w-[1080px] px-6 py-16 lg:px-12 lg:py-24">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">{eyebrow}</div>
      <h1 className="max-w-[850px] font-[var(--font-serif)] text-[clamp(42px,6vw,70px)] leading-[1.04] tracking-[-1.5px]">{title}</h1>
      <p className="mt-6 max-w-[760px] text-lg font-light leading-8 text-[var(--text-2)]">{intro}</p>
      <div className="seo-content mt-14">{children}</div>
      {faqs.length > 0 && <section className="mt-20" aria-labelledby="faq-heading"><h2 id="faq-heading" className="font-[var(--font-serif)] text-4xl">Frequently asked questions</h2><div className="mt-7 divide-y divide-[var(--border)] border-y border-[var(--border)]">{faqs.map((faq) => <details key={faq.question} className="py-5"><summary className="cursor-pointer font-semibold">{faq.question}</summary><p className="mt-3 max-w-[760px] leading-7 text-[var(--text-2)]">{faq.answer}</p></details>)}</div></section>}
      <section className="mt-20 rounded-2xl bg-[var(--ink)] p-8 text-white lg:p-12"><h2 className="font-[var(--font-serif)] text-4xl">Start with $1 in free API credit</h2><p className="mt-3 text-white/60">No card required. Use one key across a growing model catalog with no additional Basktre token markup.</p><Link href="/#start-building" className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-[var(--ink)]">Start building</Link></section>
    </article>
  </>;
}
