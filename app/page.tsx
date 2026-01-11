import Link from "next/link";
import { generateBreadcrumbSchema } from "@/lib/schema";
import ExploreToolsLink from "@/components/ExploreToolsLink";
import ToolLink from "@/components/ToolLink";

const breadcrumbs = [{ name: "Home", url: "/" }];

export default function Home() {
  return (
    <section className="py-24 sm:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Simple finance tools for better money decisions
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Clean, fast, and free calculators for investors worldwide.
        </p>
        <ExploreToolsLink />
      </div>

      <div className="mx-auto mt-24 max-w-2xl px-4">
        <h2 className="text-center text-xl font-semibold leading-8 text-gray-900">
          Our Calculators
        </h2>

        <div className="mt-8 border-t border-gray-200">
          <ToolLink href="/tools/sip-calculator" toolName="sip_calculator">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  SIP Calculator
                </h3>
                <p className="mt-1 text-base text-gray-600">
                  Estimate the future value of your monthly investments.
                </p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </ToolLink>
          <ToolLink href="/tools/stock-return" toolName="stock_return">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Stock Return & CAGR Calculator
                </h3>
                <p className="mt-1 text-base text-gray-600">
                  Calculate CAGR and total returns on your investments.
                </p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </ToolLink>
        </div>
      </div>

      <div className="mx-auto mt-24 max-w-2xl px-4 text-center">
        <p className="text-sm leading-6 text-gray-600">
          Wealthifyx is a collection of free, open-source financial calculators
          designed for clarity and precision. We are committed to user privacy.
          We do not store your data, and we do not use tracking or advertising
          cookies.
        </p>
      </div>
    </section>
  );
}
