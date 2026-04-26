import LegalDoc from "@/components/home/LegalDoc";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of terms",
    body: [
      "By accessing or using Basktre, you agree to these Terms of Service.",
      "If you use the service on behalf of an organisation, you represent authority to bind that organisation."
    ]
  },
  {
    id: "service",
    title: "2. The service",
    body: [
      "Basktre is an API gateway that provides a unified endpoint for multiple model providers.",
      "The service is in beta and may be modified, suspended, or discontinued."
    ]
  },
  {
    id: "accounts",
    title: "3. Accounts and access",
    body: [
      "You are responsible for maintaining API key confidentiality and all usage under your keys.",
      "If a key is compromised, rotate immediately and notify security@basktre.dev."
    ]
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable use",
    body: [
      "You must use Basktre lawfully and in accordance with model provider policies.",
      "Prohibited uses include illegal content generation, spam, phishing, and abuse of system availability."
    ]
  },
  {
    id: "billing",
    title: "5. Billing and credits",
    body: [
      "Billing is pay-as-you-go by token usage for the model used per request.",
      "Credits are non-refundable once consumed; unused balances may be reviewed on account closure."
    ]
  },
  {
    id: "beta",
    title: "6. Beta terms",
    body: "During beta, no SLA or uptime guarantees apply and feature behavior may change."
  },
  {
    id: "ip",
    title: "7. Intellectual property",
    body: [
      "Basktre software, documentation, and branding remain Basktre property.",
      "You retain ownership of your prompts and outputs."
    ]
  },
  {
    id: "data",
    title: "8. Your data",
    body: "Data handling is described in the Privacy Policy, which forms part of these Terms."
  },
  {
    id: "liability",
    title: "9. Limitation of liability",
    body: [
      "The service is provided as-is to the fullest extent permitted by law.",
      "Basktre is not liable for indirect or consequential damages from service use."
    ]
  },
  {
    id: "termination",
    title: "10. Termination",
    body: "Accounts may be closed by you at any time or suspended by Basktre for violations."
  },
  {
    id: "governing-law",
    title: "11. Governing law",
    body: "These Terms are governed by applicable law and related jurisdiction requirements."
  },
  {
    id: "contact",
    title: "12. Contact",
    body: "For legal questions, contact legal@basktre.dev. For support, contact support@basktre.dev."
  }
];

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      intro="These terms govern your use of Basktre's API gateway, website, and waitlist."
      sections={sections}
    />
  );
}
