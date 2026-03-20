import RothIRACalculator from "@/components/tools/RothIRACalculator";
import { faqs } from "@/constants/roth-ira";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{
    age?: string;
    ret?: string;
    con?: string;
    bal?: string;
    rate?: string;
    fil?: string;
    inc?: string;
    result?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const result = params.result;

  if (result) {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(result));

    const title = `${formatted} tax-free at retirement — Roth IRA Calculator | WealthifyX`;
    const description = `See how ${formatted} in tax-free retirement savings was projected using the WealthifyX Roth IRA Calculator. Try it with your own numbers.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: "https://wealthifyx.com/tools/roth-ira-calculator",
        type: "website",
      },
    };
  }

  return {
    title: "Roth IRA Calculator 2024 — Tax-Free Retirement Balance | WealthifyX",
    description:
      "Free Roth IRA calculator for 2024. Projects your tax-free retirement balance with IRS contribution limits ($7,000 / $8,000 catch-up), income phase-outs, and existing balance. No sign-up, no data stored.",
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
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Roth IRA Calculator",
            "url": "https://wealthifyx.com/tools/roth-ira-calculator",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free Roth IRA calculator. Projects tax-free retirement balance with 2024 IRS contribution limits, income phase-outs, and catch-up contributions for age 50+."
          }),
        }}
      />
      <RothIRACalculator initialValues={params} />
    </>
  );
}