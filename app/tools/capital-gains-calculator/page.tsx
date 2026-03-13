import CapitalGainsTaxCalculator from "@/components/tools/CapitalGainsTaxCalculator";
import { faqs } from "@/constants/capital-gains";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capital Gains Tax Calculator 2024",
  description:
    "Calculate your 2024 federal capital gains tax on any stock or investment sale. Includes long-term rates (0%, 15%, 20%), short-term ordinary income rates, NIIT, and optional state tax. Free, no sign-up.",
  alternates: {
    canonical: "https://wealthifyx.com/tools/capital-gains-calculator",
  },
  openGraph: {
    title: "Capital Gains Tax Calculator 2024",
    description:
      "Estimate your capital gains tax before you sell — with 2024 federal brackets, NIIT, and state tax included.",
    url: "https://wealthifyx.com/tools/capital-gains-calculator",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://wealthifyx.com" },
              { "@type": "ListItem", position: 2, name: "Tools", item: "https://wealthifyx.com/tools" },
              {
                "@type": "ListItem", position: 3,
                name: "Capital Gains Tax Calculator",
                item: "https://wealthifyx.com/tools/capital-gains-calculator",
              },
            ],
          }),
        }}
      />
      <CapitalGainsTaxCalculator />
    </>
  );
}