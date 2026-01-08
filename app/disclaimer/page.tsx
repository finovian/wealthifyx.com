import type { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/lib/schema";

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Disclaimer", url: "/disclaimer" },
];

export const metadata: Metadata = {
  title: "Disclaimer | Wealthifyx",
  description:
    "Read the Wealthifyx disclaimer. All information is for educational purposes only.",
};

export default function DisclaimerPage() {
  return (
    <main className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
          }}
        />
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Disclaimer
          </h1>
          <p className="mt-2 text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <article className="prose prose-gray">
          <h2>Estimates Only</h2>
          <p>
            The calculations provided by the tools on Wealthifyx are estimates
            based on the data you provide and certain assumptions. They are not
            guarantees of future performance.
          </p>

          <h2>No Guarantee of Returns</h2>
          <p>
            Investing in financial markets involves risk. There is no guarantee
            that you will achieve the returns projected by our calculators. Past
            performance is not indicative of future results.
          </p>

          <h2>Market Risk</h2>
          <p>
            All investments are subject to market risk, including the possible
            loss of principal. The value of investments can go up as well as
            down.
          </p>

          <h2>Not Investment Advice</h2>
          <p>
            The content on this website is for informational and educational
            purposes only and does not constitute financial or investment advice.
            You should consult with a qualified professional before making any
            financial decisions.
          </p>
        </article>
      </div>
    </main>
  );
}
