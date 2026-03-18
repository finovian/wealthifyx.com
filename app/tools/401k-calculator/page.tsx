
import FourOhOneKCalculator from "@/components/tools/FourOhOneKCalculator";
import { faqs } from "@/constants/401k";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "401k Calculator 2024 — Retirement Savings with Employer Match",
  description:
    "Calculate your 401k balance at retirement with employer match, 2024 IRS contribution limits ($23,000), and catch-up contributions for age 50+. See exactly how much your employer match adds over time. Free, no sign-up.",
  alternates: {
    canonical: "https://wealthifyx.com/tools/401k-calculator",
  },
  openGraph: {
    title: "401k Calculator 2024 — With Employer Match",
    description:
      "Project your 401k retirement balance with employer matching, 2024 IRS limits, and catch-up contributions. See your total balance at retirement.",
    url: "https://wealthifyx.com/tools/401k-calculator",
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
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://wealthifyx.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Tools",
                item: "https://wealthifyx.com/tools",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "401k Calculator",
                item: "https://wealthifyx.com/tools/401k-calculator",
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
            "name": "401k Calculator",
            "url": "https://wealthifyx.com/tools/401k-calculator",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free 401k calculator for 2024. Projects retirement balance with employer match, IRS contribution limits ($23,000), and catch-up contributions for age 50+."
          }),
        }}
      />
      <FourOhOneKCalculator />
    </>
  );
}