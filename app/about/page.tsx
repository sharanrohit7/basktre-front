import AboutHero from "@/components/about/AboutHero";
import ContactCards from "@/components/about/ContactCards";
import FactsGrid from "@/components/about/FactsGrid";
import MissionBand from "@/components/about/MissionBand";
import Values from "@/components/about/Values";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionBand />
      <Values />
      <FactsGrid />
      <section className="mx-auto max-w-[760px] px-12 pt-8">
        <p className="text-sm text-[var(--text-2)]">Legal Entity: Microstack Labs</p>
      </section>
      <ContactCards />
    </>
  );
}
