


'use client'



import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";

import { calculateSip } from "@/lib/calculators/sip";

import { useState } from "react";

import type { ChangeEvent } from "react";



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

          SIP Calculator

        </h1>

        <p className="mt-2 text-gray-600">

          Estimate the future value of your monthly investments using a

          Systematic Investment Plan (SIP).

        </p>

      </header>



      {/* Calculator */}

      <div className="max-w-sm space-y-6">

        <div>

          <Label className="text-sm text-gray-600">Monthly Investment (₹)</Label>

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

        <h2>How SIP returns are calculated</h2>

        <p>

          SIP (Systematic Investment Plan) allows you to invest a fixed amount

          every month in mutual funds or other investment instruments.

        </p>

        <p>

          This calculator uses a compound interest formula to estimate the

          future value of your monthly investments based on the expected annual

          return rate and investment duration.

        </p>

        <p>

          The results are estimates and actual returns may vary depending on

          market conditions.

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

                name: "What is a SIP?",

                acceptedAnswer: {

                  "@type": "Answer",

                  text: "A SIP (Systematic Investment Plan) allows you to invest a fixed amount at regular intervals, usually monthly, to build wealth over time through compounding.",

                },

              },

              {

                "@type": "Question",

                name: "How does the SIP calculator work?",

                acceptedAnswer: {

                  "@type": "Answer",

                  text: "The SIP calculator estimates the future value of your investments using a compound interest formula based on your monthly investment, expected annual return rate, and investment duration.",

                },

              },

              {

                "@type": "Question",

                name: "Is SIP return guaranteed?",

                acceptedAnswer: {

                  "@type": "Answer",

                  text: "No, SIP returns are not guaranteed. The calculator provides an estimate based on expected returns, and actual results depend on market performance.",

                },

              },

              {

                "@type": "Question",

                name: "Is this SIP calculator free to use?",

                acceptedAnswer: {

                  "@type": "Answer",

                  text: "Yes, the Wealthifyx SIP calculator is completely free and does not require any signup or personal information.",

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
