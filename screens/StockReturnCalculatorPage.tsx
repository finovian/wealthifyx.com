'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { calculateStockReturn } from "@/lib/calculators/stock-return";
import {
  generateBreadcrumbSchema,
  generateFaqSchema,
  generateFinancialProductSchema,
} from "@/lib/schema";
import { useState } from "react";
import type { ChangeEvent } from "react";

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "Stock Return Calculator", url: "/tools/stock-return" },
];

const faqs = [
  {
    question: "What is CAGR?",
    answer:
      "CAGR stands for Compound Annual Growth Rate. It is the measure of an investment's annual growth rate over a specified period of time. CAGR is one of the most accurate ways to calculate and determine an investor's return.",
  },
  {
    question: "How to calculate stock returns?",
    answer:
      "To calculate stock returns, you need the initial investment value, the final investment value, and the investment duration. Our stock return calculator uses these inputs to compute the CAGR and the absolute and total returns on your investment.",
  },
  {
    question: "Is CAGR the same as annual return?",
    answer:
      "No, CAGR is not the same as a simple annual return. Annual return can fluctuate year by year, while CAGR provides a smoothed-out average annual return over a given period. It provides a more accurate picture of an investment's performance.",
  },
  {
    question: "Why is CAGR important for investors?",
    answer:
      "CAGR is important because it allows investors to compare the performance of different investments over the same time horizon. It provides a single, easy-to-understand figure that represents the annual growth of an investment.",
  },
];

const financialProduct = {
  name: "Stock Return / CAGR Calculator",
  description:
    "A free online tool to calculate the Compound Annual Growth Rate (CAGR) and total returns of your stock investments. Evaluate your portfolio's performance with ease.",
  url: "/tools/stock-return",
};

export default function StockReturnCalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState("10000");
  const [finalValue, setFinalValue] = useState("25000");
  const [years, setYears] = useState("5");

  const result = calculateStockReturn({
    initialInvestment: Number(initialInvestment) || 0,
    finalValue: Number(finalValue) || 0,
    years: Number(years) || 0,
  });

  const handleNumericChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (value.length > 1 && value.startsWith("0") && !value.startsWith("0.")) {
        value = value.substring(1);
      }
      setter(value);
    };

  return (
    <section className="py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFaqSchema(faqs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateFinancialProductSchema(financialProduct)
          ),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Stock Return Calculator
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Calculate the Compound Annual Growth Rate (CAGR) and total returns
            for your stock investments.
          </p>
        </header>

        {/* Calculator */}
        <div className="space-y-6">
          <div>
            <Label className="text-sm text-gray-600">
              Initial Investment (₹)
            </Label>
            <Input
              type="number"
              value={initialInvestment}
              onChange={handleNumericChange(setInitialInvestment)}
              className="mt-2 text-lg"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600">Final Value (₹)</Label>
            <Input
              type="number"
              value={finalValue}
              onChange={handleNumericChange(setFinalValue)}
              className="mt-2 text-lg"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600">
              Investment Duration (Years)
            </Label>
            <Input
              type="number"
              value={years}
              onChange={handleNumericChange(setYears)}
              className="mt-2 text-lg"
            />
          </div>
        </div>

        <Separator className="my-12" />

        {/* Results */}
        <div>
          <ResultRow
            label="CAGR"
            value={`${result.cagr.toLocaleString()} %`}
          />
          <ResultRow
            label="Total Return"
            value={`${result.totalReturn.toLocaleString()} %`}
          />
          <ResultRow
            label="Absolute Profit"
            value={`₹ ${result.absoluteProfit.toLocaleString()}`}
            highlight
          />
        </div>

        {/* Explanation (SEO GOLD) */}
        <article className="prose prose-gray mt-24 max-w-none">
          <h2>How to Calculate Stock Returns and CAGR</h2>
          <p>
            This calculator helps you determine the profitability of your stock
            investments by calculating the Compound Annual Growth Rate (CAGR),
            total return, and absolute profit. To get started, you need to
            provide:
          </p>
          <ul>
            <li>
              <strong>Initial Investment:</strong> The total amount you
              invested at the beginning.
            </li>
            <li>
              <strong>Final Value:</strong> The current market value of your
              investment.
            </li>
            <li>
              <strong>Investment Duration (Years):</strong> The number of years
              you held the investment.
            </li>
          </ul>
          <p>
            These inputs will allow the calculator to provide a clear picture of
            your investment's performance over time.
          </p>

          <h2>Understanding CAGR and Total Return</h2>
          <p>
            <strong>CAGR (Compound Annual Growth Rate)</strong> is a key metric
            used to evaluate the performance of an investment. It provides a
            smoothed-out annual rate of return, making it easy to compare
            different investments. It is a much more accurate measure than
            simple annual return because it accounts for compounding.
          </p>
          <p>
            <strong>Total Return</strong> represents the full return of an
            investment, including capital gains and dividends. It is expressed
            as a percentage of the initial investment. While useful, it doesn't
            account for the time value of money, which is where CAGR excels.
          </p>

          <h2>Frequently Asked Questions (FAQ)</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-1 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function ResultRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-gray-200 py-4 last:border-none">
      <span className="text-md text-gray-600">{label}</span>
      <span
        className={`font-medium ${
          highlight
            ? "text-2xl font-semibold tracking-tight text-gray-900"
            : "text-lg text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
