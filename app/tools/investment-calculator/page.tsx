import type { Metadata } from "next";


import InvestmentCalculator from "@/components/tools/InvestmentCalculator";
import { faqs } from "@/constants/investment-calculator";

export const metadata: Metadata = {
  title: "Investment Calculator",
  description:
    "Calculate how your investment grows over time with compound returns. Set your initial amount, expected return rate, time horizon, and monthly contributions. Free, no sign-up.",
  alternates: {
    canonical: "https://wealthifyx.com/tools/investment-calculator",
  },
  openGraph: {
    title: "Investment Calculator",
    description:
      "Project the future value of any investment with compound growth. Free calculator, no account required.",
    url: "https://wealthifyx.com/tools/investment-calculator",
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
              { "@type": "ListItem", position: 3, name: "Investment Calculator", item: "https://wealthifyx.com/tools/investment-calculator" },
            ],
          }),
        }}
      />
      <InvestmentCalculator />
    </>
  );
}