import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-31T00:00:00.000Z");
  const paths = ["", "/about", "/docs", "/privacy", "/terms", "/openrouter-alternative", "/llm-api-pricing", "/llm-api-cost-calculator", "/llm-router", "/unified-llm-api", "/privacy/no-logging"];
  return paths.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency: path.includes("pricing") ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/openrouter-alternative" ? 0.9 : path === "/privacy" || path === "/terms" ? 0.5 : 0.8,
  }));
}
