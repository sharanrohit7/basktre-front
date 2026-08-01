export const siteConfig = {
  name: "Basktre",
  tagline: "AI API calls, smarter and cheaper.",
  description:
    "One API key for a growing model catalog, with automatic cost-aware routing and transparent pricing.",
  url: "https://basktre.in",
  logo: "https://basktre.in/basktre-logo.svg",
  socialProfiles: [] as string[],
  email: {
    hello: "hello@basktre.in",
    support: "support@basktre.in",
    legal: "legal@basktre.in",
    privacy: "privacy@basktre.in",
    security: "security@basktre.in",
    billing: "billing@basktre.in"
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
