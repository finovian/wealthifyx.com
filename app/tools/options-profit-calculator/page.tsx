import OptionsProfitCalculator from "@/components/tools/OptionsProfitCalculator";
import { faqs } from "@/constants/options-profit";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Options Profit Calculator — P&L, Breakeven & Max Risk | WealthifyX",
  description:
    "Free options profit calculator. Calculate profit, loss, breakeven price, and maximum risk at expiry for long calls, long puts, short calls, and short puts. Full P&L chart across every stock price. No sign-up, no data stored.",
  alternates: {
    canonical: "https://wealthifyx.com/tools/options-profit-calculator",
  },
  openGraph: {
    title: "Options Profit Calculator — P&L, Breakeven & Max Risk | WealthifyX",
    description:
      "See exact profit or loss at expiry for any options position. Includes P&L chart, breakeven price, max profit, and max loss for calls and puts.",
    url: "https://wealthifyx.com/tools/options-profit-calculator",
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
                name: "Options Profit Calculator",
                item: "https://wealthifyx.com/tools/options-profit-calculator",
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
            "name": "Options Profit Calculator",
            "url": "https://wealthifyx.com/tools/options-profit-calculator",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free options profit calculator. Shows P&L at expiry, breakeven price, max profit, and max loss for long calls, long puts, short calls, and short puts."
          }),
        }}
      />
      <OptionsProfitCalculator />
    </>
  );
}