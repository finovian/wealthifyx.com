
import SavingsGoalCalculator from "@/components/tools/SavingsGoalCalculator";
import { faqs } from "@/constants/savings-goal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savings Goal Calculator",
  description:
    "Calculate how long it takes to reach any savings goal — or how much you need to save each month to hit your target by a specific date. Accounts for interest compounding. Free, no sign-up.",
  alternates: {
    canonical: "https://wealthifyx.com/tools/savings-goal-calculator",
  },
  openGraph: {
    title: "Savings Goal Calculator",
    description:
      "Find out exactly when you'll hit your savings goal — or how much to save each month to get there on time.",
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
      <SavingsGoalCalculator />
    </>
  );
}