import LegalDoc from "@/components/home/LegalDoc";

const sections = [
  {
    id: "overview",
    title: "1. Overview",
    body: [
      'Basktre ("we", "us", "our") operates an AI API gateway at basktre.dev. This Privacy Policy applies to all users of our website, API, and waitlist ("you").',
      "By using Basktre, you agree to the practices described in this policy."
    ]
  },
  {
    id: "what-we-collect",
    title: "2. What we collect",
    body: [
      "We collect the minimum data needed to operate the service and process billing.",
      "This includes account email, token counts, model used, request timestamps, and API key identifiers."
    ]
  },
  {
    id: "what-we-dont",
    title: "3. What we don't collect",
    body: [
      "Prompt text and model responses are never stored, logged, or retained by Basktre.",
      "We also do not store IP address history, end-user identity, or browser fingerprints."
    ]
  },
  {
    id: "how-we-use",
    title: "4. How we use data",
    body: [
      "Collected data is used for billing, request authentication, service communications, and abuse prevention.",
      "We do not use your data for advertising, profiling, or model training."
    ]
  },
  {
    id: "third-parties",
    title: "5. Third parties",
    body: [
      "Requests are forwarded to model providers per routing logic, and their policies apply to processed content.",
      "Payment processing is handled by a third-party processor; Basktre stores only minimal transaction metadata."
    ]
  },
  {
    id: "retention",
    title: "6. Data retention",
    body: [
      "Billing metadata is retained for 24 months to support disputes and compliance, then permanently deleted.",
      "Account data is retained until account deletion, and then removed within 30 days."
    ]
  },
  {
    id: "security",
    title: "7. Security",
    body: [
      "We use TLS in transit, encryption at rest for stored account data, and strict access controls.",
      "If you discover a vulnerability, report it to security@basktre.dev."
    ]
  },
  {
    id: "your-rights",
    title: "8. Your rights",
    body: [
      "You may request access, correction, portability, objection, or deletion depending on your region.",
      "To submit a request, contact privacy@basktre.dev."
    ]
  },
  {
    id: "cookies",
    title: "9. Cookies",
    body: "We use only minimal functional cookies (session and preference) and no ad-tracking cookies."
  },
  {
    id: "changes",
    title: "10. Changes",
    body: "Material policy updates are communicated to registered users before they take effect."
  },
  {
    id: "contact",
    title: "11. Contact",
    body: "For privacy requests and legal matters, contact privacy@basktre.dev and legal@basktre.dev."
  }
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      intro="This policy explains what data Basktre collects, why we collect it, and what we never touch."
      sections={sections}
    />
  );
}
