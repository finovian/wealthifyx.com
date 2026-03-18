import DividendCalculator from "@/components/tools/DividendCalculator";
import { faqs } from "@/constants/dividend";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dividend Calculator 2024 — DRIP Growth & Income Estimator | WealthifyX",
  description:
    "Free dividend calculator for 2024. Projects dividend income, DRIP compounding, yield on cost, and portfolio value for any dividend stock or ETF. Supports quarterly reinvestment, dividend growth rate, and custom holding periods. No sign-up, no data stored.",
  alternates: {
    canonical: "https://wealthifyx.com/tools/dividend-calculator",
  },
  openGraph: {
    title: "Dividend Calculator — DRIP Growth & Income Estimator",
    description:
      "Project dividend income and DRIP compounding growth over time. See yield on cost, total dividends, and portfolio value at any horizon.",
    url: "https://wealthifyx.com/tools/dividend-calculator",
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
              { "@type": "ListItem", position: 1, name: "Home",  item: "https://wealthifyx.com" },
              { "@type": "ListItem", position: 2, name: "Tools", item: "https://wealthifyx.com/tools" },
              {
                "@type": "ListItem", position: 3,
                name: "Dividend Calculator",
                item: "https://wealthifyx.com/tools/dividend-calculator",
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
            "name": "Dividend Calculator",
            "url": "https://wealthifyx.com/tools/dividend-calculator",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free dividend calculator. Projects DRIP compounding, dividend income growth, yield on cost, and portfolio value for any dividend stock or ETF over any time horizon."
          }),
        }}
      />
      <DividendCalculator />
    </>
  );
}