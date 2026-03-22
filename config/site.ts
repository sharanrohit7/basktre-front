export const siteConfig = {
  name: "basktre",
  tagline: "AI API calls, smarter and cheaper.",
  description:
    "One API key. 60+ models. Auto-routing that cuts your AI costs by up to 40% with no loss in quality.",
  url: "https://basktre.dev",
  email: {
    hello: "hello@basktre.dev",
    support: "support@basktre.dev",
    legal: "legal@basktre.dev",
    privacy: "privacy@basktre.dev",
    security: "security@basktre.dev",
    billing: "billing@basktre.dev"
  },
  nav: [
    { label: "FAQ", href: "/#faq" },
    { label: "Docs", href: "#" }
  ],
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" }
  ]
} as const;
