
'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { calculateStockReturn } from "@/lib/calculators/stock-return";
import { useState } from "react";
import type { ChangeEvent } from "react";

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
    <section className="py-16">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Stock Return / CAGR Calculator
        </h1>
        <p className="mt-2 text-gray-600">
          Calculate the CAGR and total returns on your investments.
        </p>
      </header>

      {/* Calculator */}
      <div className="max-w-sm space-y-6">
        <div>
          <Label className="text-sm text-gray-600">Initial Investment ($)</Label>
          <Input
            type="number"
            value={initialInvestment}
            onChange={handleNumericChange(setInitialInvestment)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600">Final Value ($)</Label>
          <Input
            type="number"
            value={finalValue}
            onChange={handleNumericChange(setFinalValue)}
            className="mt-1"
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
            className="mt-1"
          />
        </div>
      </div>

      <Separator className="my-8" />

      {/* Results */}
      <div className="space-y-4">
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
          value={`$ ${result.absoluteProfit.toLocaleString()}`}
          highlight
        />
      </div>


      {/* Explanation (SEO GOLD) */}
      <article className="prose prose-gray mt-16 max-w-none">
        <h2>How CAGR is calculated</h2>
        <p>
          The Compound Annual Growth Rate (CAGR) is the rate of return that would be required for an investment to grow from its beginning balance to its ending balance, assuming the profits were reinvested at the end of each year of the investment’s lifespan.
        </p>
        <p>
            This calculator uses the standard formula to compute CAGR. The results are for educational purposes only and do not constitute investment advice.
        </p>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is CAGR?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "CAGR stands for Compound Annual Growth Rate. It's the annualized rate of return of an investment over a specific period, assuming profits are reinvested.",
                },
              },
              {
                "@type": "Question",
                name: "How is CAGR different from total return?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Total return shows the overall percentage gain or loss on an investment. CAGR, on the other hand, provides a smoothed-out annual growth rate, making it easier to compare different investments over time.",
                },
              },
              {
                "@type": "Question",
                name: "Is a higher CAGR always better?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A higher CAGR generally indicates better performance, but it doesn't account for volatility or risk. It's a historical measure and does not guarantee future results.",
                },
              },
            ],
          }),
        }}
      />
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
    <div className="flex items-baseline justify-between">
      <span className="text-gray-600">{label}</span>
      <span
        className={`text-xl font-medium ${
          highlight ? "font-semibold text-gray-900" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
