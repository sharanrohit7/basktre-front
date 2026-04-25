import AutoRoutingVisual from "@/components/home/AutoRoutingVisual";
import FAQ from "@/components/home/FAQ";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import Hero from "@/components/home/Hero";
import PrivacyBand from "@/components/home/PrivacyBand";
import ProviderShowcase from "@/components/home/ProviderShowcase";
import StatsBar from "@/components/home/StatsBar";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <AutoRoutingVisual />
      <FeaturesGrid />
      <ProviderShowcase />
      <PrivacyBand />
      <FAQ />

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section id="start-building" className="border-y border-[var(--border)] bg-white px-12 py-24 text-center">
        <div className="mx-auto max-w-[560px]">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
            {"// start building"}
          </div>
          <h2 className="mb-4 font-[var(--font-serif)] text-[clamp(34px,4vw,54px)] leading-tight tracking-[-1px]">
            Ready to simplify
            <br />
            your AI stack?
          </h2>
          <p className="mb-8 text-base font-light leading-7 text-[var(--text-2)]">
            Sign up free. Top up when you&apos;re ready.{" "}
            <strong className="font-semibold text-[var(--text)]">4% fee.</strong> No subscriptions, no seat costs, no surprises.
          </p>
          <div className="flex flex-col items-center gap-4">
            <GoogleSignInButton />
            <div className="flex items-center gap-5">
              <Link
                href="https://docs.basktre.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13.5px] text-[var(--text-3)] underline-offset-4 hover:text-[var(--text-2)] hover:underline"
              >
                Read the docs →
              </Link>
              <Link
                href="/#providers"
                className="text-[13.5px] text-[var(--text-3)] underline-offset-4 hover:text-[var(--text-2)] hover:underline"
              >
                Browse model pricing →
              </Link>
            </div>
            <p className="mt-2 text-[11px] text-[var(--text-3)]">
              No prompts stored. No response logs. 4% platform fee. That&apos;s it.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
