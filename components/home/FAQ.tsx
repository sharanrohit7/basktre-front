"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How does pricing work?",
    answer:
      "You top up your Basktre wallet. 4% of the top-up amount is our fee — that's it, that's our entire revenue model. The remaining 96% is yours to spend on model calls at exact provider rates. No markup on tokens, no per-request fee, no subscription.",
  },
  {
    question: "How does auto-routing work?",
    answer:
      'We analyse your request — length, task type, complexity — and pick the cheapest model that meets a quality threshold. For a simple summarisation task, that might be Gemini Flash. For multi-step reasoning, it might be Claude Sonnet. You can always override with a specific model name (e.g. model: "gpt-4o").',
  },
  {
    question: "Is my data safe?",
    answer:
      "We do not store prompts or responses. Requests are proxied through and immediately discarded. We have no access to your conversation content. The only data we retain is token counts (for billing) and latency metadata.",
  },
  {
    question: "Which models are available?",
    answer:
      "60+ models including GPT-4o, o3, Claude 3.5 Sonnet/Haiku, Gemini 2.0 Flash/Pro, Llama 3.3, DeepSeek R1/V3, Qwen 2.5, and more. The list is updated as new models launch — check the Models section of the dashboard for the live list.",
  },
  {
    question: "Can I use a specific model instead of auto?",
    answer:
      'Yes. Just set model: "gpt-4o" (or any model tag) instead of "auto". Auto mode is opt-in. You can mix and match — auto for most calls, pinned models where precision matters.',
  },
  {
    question: "Do I need to bring my own API keys?",
    answer:
      "No. Basktre gives you one key and handles provider relationships on the backend. You never need to sign up for OpenAI, Anthropic, Google, or any other provider separately.",
  },
  {
    question: 'How is "auto" different from just picking a model myself?',
    answer:
      "Auto mode makes an inference decision per-request based on what the task actually needs. If you pick a model yourself, you pay that model's rate even when a cheaper one would have worked fine. Auto mode arbitrages that gap for you automatically.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <style>{`
        .faq-answer {
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.25s ease;
        }
        .faq-icon {
          transition: transform 0.25s ease;
        }
        .faq-icon-open {
          transform: rotate(45deg);
        }
      `}</style>

      <section id="faq" className="section pt-0">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
          {"// questions"}
        </div>
        <h2 className="mb-10 font-[var(--font-serif)] text-[clamp(30px,4vw,48px)] font-normal leading-tight">
          Frequently asked.
        </h2>

        <div className="border-t border-[var(--border)]">
          {faqs.map((faq, idx) => (
            <div key={faq.question} className="border-b border-[var(--border)]">
              <button
                className="w-full py-5 text-left"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[15px] font-medium leading-snug text-[var(--text)]">
                    {faq.question}
                  </span>
                  <span
                    className={`faq-icon flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] ${open === idx ? "faq-icon-open" : ""}`}
                  >
                    +
                  </span>
                </div>
                {open === idx && (
                  <p className="pt-3 text-sm font-light leading-7 text-[var(--text-2)]">
                    {faq.answer}
                  </p>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
