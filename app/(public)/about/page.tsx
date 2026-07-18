import AboutHero from "@/components/about/AboutHero";
import ContactCards from "@/components/about/ContactCards";
import FactsGrid from "@/components/about/FactsGrid";
import MissionBand from "@/components/about/MissionBand";
import Values from "@/components/about/Values";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Basktre", description: "Basktre is building a transparent, privacy-first AI API gateway with automatic cost-aware LLM routing.", alternates: { canonical: "/about" } };

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
