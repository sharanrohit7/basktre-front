"use client";

import { useState, useEffect, useRef } from "react";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";

// Animated counter hook
function useCountUp(target: number, duration: number = 1800, startOnVisible: boolean = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnVisible) { setStarted(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

const SAVINGS_FACTS = [
  { model: "GPT-4o Mini", calls: "2,000+", task: "text queries" },
  { model: "Gemini Flash", calls: "5,000+", task: "fast responses" },
  { model: "DeepSeek V3", calls: "7,000+", task: "code completions" },
  { model: "Llama 3.3 70B", calls: "1,400+", task: "reasoning tasks" },
];

export default function SignUpOffer() {
  const [activeFact, setActiveFact] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const { count: callCount, ref: sectionRef } = useCountUp(7142, 2000);

  // Rotate through facts
  useEffect(() => {
    const id = setInterval(() => setActiveFact(f => (f + 1) % SAVINGS_FACTS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const fact = SAVINGS_FACTS[activeFact];

  return (
    <section
      id="launch-offer"
      ref={sectionRef}
      aria-label="Limited time sign-up offer: $1 free AI credits"
      className="relative overflow-hidden border-y border-[var(--border)]"
      style={{ background: "linear-gradient(135deg, #0d1f17 0%, #0a1a12 50%, #071410 100%)" }}
    >
      {/* ── Animated mesh background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full opacity-20 blur-[100px]" style={{ background: "radial-gradient(circle, #1a6b4a, transparent 70%)" }} />
        <div className="absolute right-[15%] bottom-[10%] h-48 w-96 rounded-full opacity-15 blur-[80px]" style={{ background: "radial-gradient(circle, #4ade80, transparent 70%)" }} />
        <div className="absolute right-[40%] top-[10%] h-32 w-32 rounded-full opacity-10 blur-[60px]" style={{ background: "radial-gradient(circle, #86efac, transparent 70%)" }} />
        {/* Grid lines */}
        <svg className="absolute inset-0 h-full w-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1080px] px-8 py-20 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_420px]">

          {/* ── LEFT: SEO-rich copy ── */}
          <div>
            {/* Urgency badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 px-4 py-1.5">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ade80]" />
              </span>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#4ade80]">
                Launch Week Offer — Limited Time
              </span>
            </div>

            {/* SEO headline — h2 with keyword-rich text */}
            <h2 className="mb-4 font-[var(--font-serif)] text-[clamp(36px,5vw,58px)] leading-[1.05] tracking-[-1px] text-white">
              Your first{" "}
              <span
                className="relative inline-block"
                aria-label="1 dollar of free AI API credits"
              >
                <span className="text-[#4ade80]">$1.00</span>
                {/* Underline swoosh */}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 8" fill="none" aria-hidden="true">
                  <path d="M2 6 Q60 1 118 6" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
                </svg>
              </span>{" "}
              of AI calls
              <br />
              is on us.{" "}
              <em className="text-white/40 not-italic text-[0.75em]">seriously.</em>
            </h2>

            {/* SEO-friendly description paragraph */}
            <p className="mb-8 max-w-[480px] text-[16px] font-light leading-[1.85] text-white/60">
              Create a free Basktre account and receive{" "}
              <strong className="font-semibold text-white">$1 USD in instant wallet credits</strong> — 
              no credit card, no trial period, no strings. Use them across any of our 60+ AI models 
              including GPT-4o, Claude, Gemini, Llama, and DeepSeek at direct provider rates.
            </p>

            {/* Rotating fact pill — how far $1 goes */}
            <div className="mb-8 flex items-start gap-4">
              <div
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
                role="status"
                aria-live="polite"
                aria-label={`$1 can buy ${fact.calls} ${fact.task} with ${fact.model}`}
              >
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/30">
                  $1 buys you approximately
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-[var(--font-serif)] text-[28px] font-semibold text-[#4ade80]">
                    {fact.calls}
                  </span>
                  <span className="text-[13px] text-white/60">{fact.task}</span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-white/30">
                  via <span className="text-white/50">{fact.model}</span>
                </div>
              </div>

              {/* Stats: total API calls served */}
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/30">
                  API calls in first week
                </div>
                <div className="font-[var(--font-serif)] text-[28px] font-semibold text-white">
                  {callCount.toLocaleString()}+
                </div>
                <div className="mt-1 font-mono text-[11px] text-white/30">
                  by early builders
                </div>
              </div>
            </div>

            {/* Trust chips */}
            <ul className="flex flex-wrap gap-2" role="list" aria-label="Offer terms">
              {[
                "No credit card required",
                "Instant credit, no waiting",
                "Works on all 60+ models",
                "No expiry on credits",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/50"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M2 5L4 7L8 3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* ── RIGHT: Claim card ── */}
          <div className="relative">
            {/* Glow behind card */}
            <div aria-hidden="true" className="absolute -inset-6 rounded-[48px] opacity-40 blur-3xl" style={{ background: "radial-gradient(ellipse, #1a6b4a, transparent 70%)" }} />

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
              {/* Corner "FREE" stamp */}
              <div
                aria-hidden="true"
                className="absolute -right-6 -top-6 flex h-24 w-24 items-end justify-start rounded-full bg-[#4ade80] pb-3 pl-3"
                style={{ transform: "rotate(15deg)" }}
              >
                <span className="text-[10px] font-black uppercase leading-tight tracking-tight text-[#052e16]" style={{ transform: "rotate(-15deg)" }}>
                  FREE<br />$1
                </span>
              </div>

              {/* Card header */}
              <div className="mb-6">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-white/30">
                  Basktre Launch Wallet
                </div>
                <div className="flex items-end gap-3">
                  <span className="font-[var(--font-serif)] text-[52px] leading-none text-white">$1</span>
                  <span className="mb-2 text-[16px] text-white/40">.00 USD</span>
                </div>
                <div className="mt-2 font-mono text-[11px] text-[#4ade80]">
                  ↳ credited instantly on sign up
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="mb-6">
                <div className="mb-2 flex justify-between font-mono text-[10px] text-white/30">
                  <span>Credit unlocked</span>
                  <span>100%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1a6b4a] to-[#4ade80]"
                    style={{ width: "100%", animation: "fillBar 1.5s 0.5s ease both" }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* What you unlock */}
              <div className="mb-6 space-y-2.5">
                {[
                  { icon: "🤖", text: "Access to GPT-4o, Claude, Gemini, DeepSeek & 60+ more" },
                  { icon: "⚡", text: "Auto-routing — we pick the cheapest model that works" },
                  { icon: "🔑", text: "One API key. One endpoint. Zero complexity." },
                  { icon: "🛡️", text: "Zero data stored. No prompt logs. Ever." },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-base leading-tight" aria-hidden="true">{icon}</span>
                    <span className="text-[12.5px] leading-snug text-white/55">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div>
                <GoogleSignInButton />
                <p className="mt-3 text-center font-mono text-[10px] text-white/25">
                  Free account · No credit card · $1 lands in your wallet immediately
                </p>
              </div>

              {/* Bottom shimmer line */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #4ade80, transparent)" }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fillBar {
          from { width: 0%; opacity: 0; }
          to   { width: 100%; opacity: 1; }
        }
      `}</style>
    </section>
  );
}
