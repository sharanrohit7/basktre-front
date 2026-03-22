"use client";

import { useState } from "react";

const faqs = [
  {
    question: `How is "auto" mode different from just picking a model myself?`,
    answer:
      "Auto mode analyses each request and selects the cheapest model that can handle it well. You only pay for what the task needs."
  },
  {
    question: "Can I still specify a model if I want to?",
    answer: "Yes. Auto mode is optional - you can pin any supported model directly."
  },
  {
    question: "Do I need to bring my own API keys for OpenAI, Anthropic, etc.?",
    answer: "No. Basktre gives you one key and handles provider relationships on the backend."
  },
  {
    question: "What SDKs or clients are supported?",
    answer: "Any language that can send HTTP requests works during beta."
  },
  {
    question: "How does pricing work?",
    answer: "Pay-as-you-go, billed per token for the actual model selected."
  },
  {
    question: "Is my data private?",
    answer: "Yes. Prompts and responses are never stored."
  }
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="section pt-0">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
        {"// questions"}
      </div>
      <h2 className="mb-8 font-[var(--font-serif)] text-5xl font-normal">Frequently asked.</h2>
      <div className="border-t border-[var(--border)]">
        {faqs.map((faq, idx) => (
          <button
            key={faq.question}
            className="w-full border-b border-[var(--border)] py-5 text-left"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <div className="flex items-center justify-between gap-4 text-[15px] font-medium">
              <span>{faq.question}</span>
              <span className="h-5 w-5 rounded-full border border-[var(--border)] bg-[var(--tag-bg)] text-center">+</span>
            </div>
            {open === idx && <p className="pt-3 text-sm font-light leading-7 text-[var(--text-2)]">{faq.answer}</p>}
          </button>
        ))}
      </div>
    </section>
  );
}
