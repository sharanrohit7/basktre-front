"use client";

import Link from "next/link";
import { useActiveSection } from "@/hooks/useActiveSection";

interface DocSection {
  id: string;
  title: string;
  body: string | string[];
}

export default function LegalDoc({ title, intro, sections }: { title: string; intro: string; sections: DocSection[] }) {
  const ids = sections.map((s) => s.id);
  const active = useActiveSection(ids);

  return (
    <div className="mx-auto grid max-w-[1080px] grid-cols-[220px_1fr] gap-16 px-12 py-12">
      <aside className="sticky top-20 h-fit">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--text-3)]">On this page</div>
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <Link
                href={`#${section.id}`}
                className={`block rounded-md border-l-2 px-2.5 py-1.5 text-[13px] ${
                  active === section.id
                    ? "border-l-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                    : "border-l-transparent text-[var(--text-3)]"
                }`}
              >
                {section.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main>
        <header className="mb-10 border-b border-[var(--border)] pb-8">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
            {"// legal"}
          </div>
          <h1 className="mb-3 font-[var(--font-serif)] text-5xl">{title}</h1>
          <p className="max-w-[700px] text-base font-light leading-7 text-[var(--text-2)]">{intro}</p>
        </header>
        {sections.map((section) => (
          <section id={section.id} key={section.id} className="mb-11 scroll-mt-20">
            <h2 className="mb-3 font-[var(--font-serif)] text-[26px]">{section.title}</h2>
            {(Array.isArray(section.body) ? section.body : [section.body]).map((paragraph) => (
              <p key={paragraph} className="mb-3 text-[14.5px] font-light leading-8 text-[var(--text-2)] last:mb-0">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
