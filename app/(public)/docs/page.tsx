import DocsContent from "@/components/docs/DocsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description: "Integrate the Basktre unified LLM API to access 60+ AI models with automatic cost optimization.",
  alternates: { canonical: "/docs" }
};

export default function PublicDocsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 lg:px-12 py-12">
      <DocsContent />
    </div>
  );
}
