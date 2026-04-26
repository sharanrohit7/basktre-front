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
      <ContactCards />
    </>
  );
}
