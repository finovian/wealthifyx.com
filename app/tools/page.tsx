import Link from "next/link";
import type { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/lib/schema";

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
];

export const metadata: Metadata = {
  title: "Financial Calculators and Tools | Wealthifyx",
  description:
    "A collection of free and easy-to-use financial calculators for investment planning, including SIP and stock return calculators.",
};

const tools = [
  {
    name: "SIP Calculator",
    description: "Estimate the future value of your monthly investments.",
    href: "/tools/sip-calculator",
  },
  {
    name: "Stock Return Calculator",
    description: "Calculate CAGR and total returns on your investments.",
    href: "/tools/stock-return",
  },
];

export default function ToolsPage() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
          }}
        />
        <header>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Financial Tools
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            A focused collection of calculators for long-term investment
            planning and return estimation.
          </p>
        </header>

        <div className="mt-12 border-t border-gray-200">
          {tools.map(tool => (
            <Link
              key={tool.name}
              href={tool.href}
              className="block border-b border-gray-200 py-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {tool.name}
                  </h2>
                  <p className="mt-1 text-base text-gray-600">
                    {tool.description}
                  </p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
