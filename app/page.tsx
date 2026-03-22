import AutoRoutingVisual from "@/components/home/AutoRoutingVisual";
import FAQ from "@/components/home/FAQ";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import Hero from "@/components/home/Hero";
import PrivacyBand from "@/components/home/PrivacyBand";
import StatsBar from "@/components/home/StatsBar";
import WaitlistForm from "@/components/home/WaitlistForm";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <AutoRoutingVisual />
      <FeaturesGrid />
      <PrivacyBand />
      <FAQ />

      <section id="waitlist" className="border-y border-[var(--border)] bg-white px-12 py-24 text-center">
        <div className="mx-auto max-w-[520px]">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-[var(--accent)]">
            {"// early access"}
          </div>
          <h2 className="mb-4 font-[var(--font-serif)] text-[clamp(34px,4vw,52px)]">Be first in.</h2>
          <p className="mb-8 text-base font-light text-[var(--text-2)]">
            Basktre is in limited beta. Join the waitlist and we&apos;ll reach out with access details as spots open up.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </>
  );
}
