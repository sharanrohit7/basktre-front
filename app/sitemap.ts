import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/docs", "/privacy", "/terms", "/openrouter-alternative", "/llm-api-pricing", "/llm-api-cost-calculator", "/llm-router", "/unified-llm-api", "/privacy/no-logging"];
  return paths.map((path) => ({ url: `${siteConfig.url}${path}`, lastModified: new Date(), changeFrequency: path.includes("pricing") ? "daily" : "monthly", priority: path === "" ? 1 : path === "/openrouter-alternative" ? 0.9 : 0.8 }));
}
