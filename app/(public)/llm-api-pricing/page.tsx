import type { Metadata } from "next";
import Link from "next/link";
import PricingExplorer from "@/components/pricing/PricingExplorer";
import { SeoPage } from "@/components/seo/SeoPage";
import { getProviders } from "@/lib/server/pricing";

export const metadata: Metadata = {
  title: "LLM API Pricing Comparison: GPT, Claude, Gemini & More",
  description: "Compare current LLM API pricing across GPT, Claude, Gemini, Llama, DeepSeek and more. Search input and output token rates with no per-token Basktre markup.",
  alternates: { canonical: "/llm-api-pricing" },
};

export default async function Page() {
  const providers = await getProviders();
  return (
    <SeoPage
      path="/llm-api-pricing"
      eyebrow="// live model pricing"
      title="LLM API pricing, compared clearly"
      intro="Compare current input and output token rates across Basktre's growing model catalog. Live availability may vary during beta. Basktre shows displayed per-token model rates with no additional token markup and charges 4% only when you add funds to your wallet."
    >
      <h2>Compare model API prices</h2>
      <p>Prices are shown in US dollars per one million tokens and come from Basktre&apos;s public providers endpoint.</p>
      <PricingExplorer providers={providers} />
      <p>Know your token volume? Use the <Link className="underline" href="/llm-api-cost-calculator">LLM API cost calculator</Link> to estimate a workload.</p>
    </SeoPage>
  );
}
