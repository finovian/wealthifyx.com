import RothIRACalculator from "@/components/tools/RothIRACalculator";
import { faqs } from "@/constants/roth-ira";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roth IRA Calculator",
  description:
    "Calculate your tax-free Roth IRA balance at retirement. Accounts for 2024 IRS contribution limits ($7,000 / $8,000 catch-up), income phase-outs, and existing balances. Free, no sign-up.",
  alternates: {
    canonical: "https://wealthifyx.com/tools/roth-ira-calculator",
  },
  openGraph: {
    title: "Roth IRA Calculator — Tax-Free Retirement Balance",
    description:
      "See exactly how much your Roth IRA will be worth at retirement. Accounts for 2024 contribution limits and income phase-outs.",
    url: "https://wealthifyx.com/tools/roth-ira-calculator",
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
                name: "Roth IRA Calculator",
                item: "https://wealthifyx.com/tools/roth-ira-calculator",
              },
            ],
          }),
        }}
      />
      <RothIRACalculator />
    </>
  );
}