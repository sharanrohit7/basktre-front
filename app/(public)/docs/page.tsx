import DocsContent from "@/components/docs/DocsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation | Basktre",
  description: "Learn how to integrate the Basktre API to access 60+ AI models with automated cost optimization."
};

export default function PublicDocsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 lg:px-12 py-12">
      <DocsContent />
    </div>
  );
}
