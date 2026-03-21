import CapitalGainsTaxCalculator from "@/components/tools/CapitalGainsTaxCalculator";
import { faqs } from "@/constants/capital-gains";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capital Gains Tax Calculator 2024 — Estimate Tax Before You Sell | WealthifyX",
  description:
    "Free capital gains tax calculator for 2024. Estimates federal tax on stock and investment sales using long-term rates (0%, 15%, 20%), short-term ordinary income rates, NIIT surcharge, and optional state tax. No sign-up, no data stored.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Capital Gains Tax Calculator",
            "url": "https://wealthifyx.com/tools/capital-gains-calculator",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free 2024 capital gains tax calculator. Estimates federal tax on investment sales with long-term rates, short-term rates, NIIT, and state tax."
          }),
        }}
      />
      <CapitalGainsTaxCalculator />
    </>
  );
}