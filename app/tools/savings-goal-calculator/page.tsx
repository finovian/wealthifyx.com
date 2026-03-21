
import SavingsGoalCalculator from "@/components/tools/SavingsGoalCalculator";
import { faqs } from "@/constants/savings-goal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savings Goal Calculator — How Long or How Much Per Month | WealthifyX",
  description:
    "Free savings goal calculator. Find out how long it takes to reach any savings target — or how much you need to save each month to hit your goal by a specific date. Accounts for interest compounding on your existing balance. No sign-up, no data stored.",
  alternates: {
    canonical: "https://wealthifyx.com/tools/savings-goal-calculator",
  },
  openGraph: {
    title: "Savings Goal Calculator — How Long or How Much Per Month | WealthifyX",
    description:
      "Calculate exactly when you'll hit your savings goal or how much to save monthly to get there on time. Accounts for compound interest.",
    url: "https://wealthifyx.com/tools/savings-goal-calculator",
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
                name: "Savings Goal Calculator",
                item: "https://wealthifyx.com/tools/savings-goal-calculator",
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
            "name": "Savings Goal Calculator",
            "url": "https://wealthifyx.com/tools/savings-goal-calculator",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free savings goal calculator. Calculates time to reach any savings target or required monthly contribution, with compound interest on existing balance."
          }),
        }}
      />
      <SavingsGoalCalculator />
    </>
  );
}