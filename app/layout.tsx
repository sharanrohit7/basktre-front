import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Providers } from "./providers";
import "./globals.css";
import { siteConfig } from "@/config/site";

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Basktre — Intelligent LLM Router & Unified AI API Gateway", template: "%s | Basktre" },
  description: "Access GPT, Claude, Gemini, Llama, DeepSeek and more through one API. Basktre automatically routes requests to cost-effective models with zero prompt or response logging.",
  keywords: ["LLM router", "unified LLM API", "AI API gateway", "LLM API pricing", "OpenRouter alternative"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", url: siteConfig.url, siteName: "Basktre",
    title: "Basktre — Intelligent LLM Router & Unified AI API Gateway",
    description: "One API for 60+ models, automatic cost routing, transparent pricing, and no prompt or response logging.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Basktre intelligent LLM router" }]
  },
  twitter: { card: "summary_large_image", title: "Basktre — Intelligent LLM Router", description: "One API for 60+ models, automatically routed for lower cost.", images: ["/opengraph-image"] },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} font-[var(--font-geist)]`}
      >
        <Providers>{children}</Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@graph": [
            { "@type": "Organization", "@id": `${siteConfig.url}/#organization`, name: "Basktre", legalName: "Microstack Labs", url: siteConfig.url, email: "tech@basktre.in" },
            { "@type": "WebSite", "@id": `${siteConfig.url}/#website`, url: siteConfig.url, name: "Basktre", publisher: { "@id": `${siteConfig.url}/#organization` } }
          ]
        }).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
