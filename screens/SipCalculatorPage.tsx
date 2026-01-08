"use client";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";

import { calculateSip } from "@/lib/calculators/sip";

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

  { name: "SIP Calculator", url: "/tools/sip-calculator" },
];

const faqs = [
  {
    question: "What is a SIP?",

    answer:
      "A SIP (Systematic Investment Plan) is a method of investing in mutual funds where you invest a fixed amount of money at regular intervals (usually monthly). It helps in disciplined investing and benefits from the power of compounding and rupee cost averaging.",
  },

  {
    question: "How does this SIP return calculator work?",

    answer:
      "This calculator estimates the future value of your SIP investments using a compound interest formula. You need to provide the monthly investment amount, the expected annual rate of return, and the investment duration in years.",
  },

  {
    question: "Are the returns from a SIP guaranteed?",

    answer:
      "No, SIP returns are not guaranteed as they are linked to market performance. The returns can vary based on the performance of the mutual fund scheme you have invested in. This calculator provides an estimate based on the expected rate of return you provide.",
  },

  {
    question: "What is rupee cost averaging?",

    answer:
      "Rupee cost averaging is an investment strategy where you invest a fixed amount of money at regular intervals. When the market is down, you buy more units, and when the market is up, you buy fewer units. This averages out the cost of your investment over time and reduces the impact of market volatility.",
  },

  {
    question: "Can I use this calculator for lumpsum investments?",

    answer:
      "No, this calculator is specifically designed for Systematic Investment Plans (SIPs). For lumpsum investments, you would need a different calculator that calculates the future value of a single one-time investment.",
  },
];

const financialProduct = {
  name: "SIP Calculator",

  description:
    "A free online tool to calculate the future value of your Systematic Investment Plan (SIP) investments. Estimate your returns based on your monthly investment, expected return rate, and investment tenure.",

  url: "/tools/sip-calculator",
};

export default function SipCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("5000");

  const [annualReturnRate, setAnnualReturnRate] = useState("12");

  const [years, setYears] = useState("10");

  const result = calculateSip({
    monthlyInvestment: Number(monthlyInvestment) || 0,

    annualReturnRate: Number(annualReturnRate) || 0,

    years: Number(years) || 0,
  });

  const handleNumericChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (
        value.length > 1 &&
        value.startsWith("0") &&
        !value.startsWith("0.")
      ) {
        value = value.substring(1);
      }

      setter(value);
    };

  return (
    <section className="py-16">
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

      {/* Header */}

      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          SIP Calculator India
        </h1>

        <p className="mt-2 text-gray-600">
          Estimate the future value of your monthly investments with our free
          and easy-to-use Systematic Investment Plan (SIP) calculator.
        </p>
      </header>

      {/* Calculator */}

      <div className="max-w-sm space-y-6">
        <div>
          <Label className="text-sm text-gray-600">
            Monthly Investment (₹)
          </Label>

          <Input
            type="number"
            value={monthlyInvestment}
            onChange={handleNumericChange(setMonthlyInvestment)}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-600">
            Expected Annual Return (%)
          </Label>

          <Input
            type="number"
            value={annualReturnRate}
            onChange={handleNumericChange(setAnnualReturnRate)}
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
          label="Total Invested"
          value={`₹ ${result.investedAmount.toLocaleString()}`}
        />

        <ResultRow
          label="Estimated Returns"
          value={`₹ ${result.estimatedReturns.toLocaleString()}`}
        />

        <ResultRow
          label="Total Value"
          value={`₹ ${result.totalValue.toLocaleString()}`}
          highlight
        />
      </div>

      {/* Explanation (SEO GOLD) */}

      <article className="prose prose-gray mt-16 max-w-none">
        <h2>How to Use the SIP Calculator</h2>

        <p>
          Our SIP calculator helps you get a clear idea of the potential returns
          on your monthly investments. To use the calculator, you need to
          provide three key inputs:
        </p>

        <ul>
          <li>
            <strong>Monthly Investment:</strong> The amount you plan to invest
            every month.
          </li>

          <li>
            <strong>Expected Annual Return (%):</strong> The annual rate of
            return you expect from your investment. This is an estimate and can
            vary based on the type of fund and market conditions.
          </li>

          <li>
            <strong>Investment Duration (Years):</strong> The number of years
            you plan to stay invested.
          </li>
        </ul>

        <p>
          Once you enter these values, the calculator will instantly show you
          the total amount you have invested, the estimated returns you have
          earned, and the total future value of your investment.
        </p>

        <h2>Understanding SIP Returns</h2>

        <p>
          SIP (Systematic Investment Plan) is a disciplined way of investing in
          mutual funds. It allows you to invest a fixed amount regularly, which
          helps in building wealth over the long term. The two main factors that
          contribute to SIP returns are the power of compounding and rupee cost
          averaging.
        </p>

        <p>
          <strong>The Power of Compounding:</strong> Compounding is when you
          earn returns not just on your principal amount but also on the
          accumulated returns. The longer you stay invested, the more your money
          grows, thanks to the magic of compounding.
        </p>

        <p>
          <strong>Rupee Cost Averaging:</strong> Since you invest a fixed amount
          every month, you buy more units when the market is low and fewer units
          when the market is high. This averages out your purchase cost over
          time and protects you from market volatility.
        </p>

        <h2>Frequently Asked Questions (FAQ)</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="font-semibold">{faq.question}</h3>

              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </article>
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
