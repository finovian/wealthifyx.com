import CompoundInterestCalculator from "@/components/tools/CompoundInterestCalculator";
import { faqs } from "@/constants/compound-interest";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Compound Interest Calculator 2024 — See How Money Grows | WealthifyX",
  description:
    "Free compound interest calculator. See exactly how your money grows with daily, monthly, quarterly, or annual compounding. Supports monthly contributions, any time horizon, and precise floating-point math. No sign-up, no data stored.",
  alternates: {
    canonical: "https://wealthifyx.com/tools/compound-interest-calculator",
  },
  openGraph: {
    title: "Compound Interest Calculator 2024 — See How Money Grows | WealthifyX",
    description:
      "Calculate compound interest with monthly contributions. Supports daily, monthly, quarterly, and annual compounding with precise math.",
    url: "https://wealthifyx.com/tools/compound-interest-calculator",
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
                "@type": "ListItem",
                position: 3,
                name: "Compound Interest Calculator",
                item: "https://wealthifyx.com/tools/compound-interest-calculator",
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Compound Interest Calculator",
            "url": "https://wealthifyx.com/tools/compound-interest-calculator",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free compound interest calculator with monthly contribution support. Calculates daily, monthly, quarterly, and annual compounding with full floating-point precision."
          }),
        }}
      />
      <CompoundInterestCalculator />
    </>
  );
}