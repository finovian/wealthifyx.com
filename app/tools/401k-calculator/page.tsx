
import FourOhOneKCalculator from "@/components/tools/FourOhOneKCalculator";
import { faqs } from "@/constants/401k";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{
    sal?: string;
    emp?: string;
    mp?: string;
    mu?: string;
    bal?: string;
    rate?: string;
    age?: string;
    ret?: string;
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

    const title = `${formatted} at retirement — 401k Calculator | WealthifyX`;
    const description = `See how ${formatted} in retirement savings was projected using the WealthifyX 401k Calculator. Try it with your own numbers.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: "https://wealthifyx.com/tools/401k-calculator",
        type: "website",
      },
    };
  }

  return {
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
      <FourOhOneKCalculator initialValues={params} />
    </>
  );
}