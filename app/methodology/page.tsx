import type { Metadata } from 'next';
import { CheckCircle2, AlertTriangle, Info, ArrowRight, Calculator, TrendingUp, BarChart3, Receipt, PiggyBank, ShieldCheck, Zap, Layers, Percent } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

/* ── SEO ── */
export const metadata: Metadata = {
  title: 'Methodology — How WealthifyX Finance Calculators Work',
  description:
    'WealthifyX uses industry-standard financial formulas with full floating-point precision. No rounding drift, no shortcuts. See the exact math behind every calculator.',
  alternates: {
    canonical: 'https://wealthifyx.com/methodology',
  },
  openGraph: {
    title: 'Methodology — How WealthifyX Finance Calculators Work',
    description:
      'See the exact formulas and precision standards behind every WealthifyX finance calculator.',
    url: 'https://wealthifyx.com/methodology',
    type: 'website',
  },
};

/* ── Data ── */
const comparisonData = [
  { label: 'Intermediate rounding', typical: 'Yes — 2 decimal places', wealthify: 'Never' },
  { label: 'Compounding frequency', typical: 'Monthly only', wealthify: 'Daily / Monthly / Quarterly / Annual' },
  { label: 'Contribution timing', typical: 'Start of period only', wealthify: 'Configurable' },
  { label: 'Formula standard', typical: 'Simplified approximation', wealthify: 'IEEE 754 full precision' },
  { label: '30-year drift', typical: 'Up to 3–8% error', wealthify: 'None' },
];

const formulas = [
  {
    name: 'Compound Interest',
    id: 'compound-interest-calculator',
    eyebrow: '// FORMULA — COMPOUND INTEREST',
    formula: 'FV = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]',
    variables: [
      { sym: 'FV', def: 'Future Value' },
      { sym: 'P', def: 'Principal (Initial Investment)' },
      { sym: 'r', def: 'Annual interest rate (decimal)' },
      { sym: 'n', def: 'Compounding periods per year' },
      { sym: 't', def: 'Number of years' },
      { sym: 'PMT', def: 'Payment amount per period' }
    ]
  },
  {
    name: 'CAGR',
    id: 'stock-cagr',
    eyebrow: '// FORMULA — CAGR',
    formula: 'CAGR = (FV / PV)^(1/t) - 1',
    variables: [
      { sym: 'CAGR', def: 'Compound Annual Growth Rate' },
      { sym: 'FV', def: 'Final Value' },
      { sym: 'PV', def: 'Present Value (Initial)' },
      { sym: 't', def: 'Time in years' }
    ]
  },
  {
    name: 'Savings Goal',
    id: 'savings-goal-calculator',
    eyebrow: '// FORMULA — SAVINGS GOAL',
    formula: 't = log(FV / PV) / log(1 + r)',
    variables: [
      { sym: 't', def: 'Time in years' },
      { sym: 'FV', def: 'Future Value (Target)' },
      { sym: 'PV', def: 'Present Value (Current Savings)' },
      { sym: 'r', def: 'Annual growth rate' }
    ]
  },
  {
    name: 'Capital Gains Tax',
    id: 'capital-gains-calculator',
    eyebrow: '// FORMULA — CAPITAL GAINS TAX',
    formula: 'Tax = (Sale Price - Cost Basis) × Tax Rate',
    secondaryFormula: 'Net Gain = (Sale Price - Cost Basis) × (1 - Tax Rate)',
    variables: [
      { sym: 'Tax', def: 'Federal tax liability' },
      { sym: 'Sale Price', def: 'Final value of asset' },
      { sym: 'Cost Basis', def: 'Original purchase price' },
      { sym: 'Tax Rate', def: 'Federal rate based on income' }
    ]
  },
  {
    name: 'Dividend Yield',
    id: 'dividend-calculator',
    eyebrow: '// FORMULA — DIVIDEND YIELD',
    formula: 'Yield = Annual Div / Share Price × 100',
    variables: [
      { sym: 'Yield', def: 'Annual yield percentage' },
      { sym: 'Annual Div', def: 'Total dividends paid per year' },
      { sym: 'Price', def: 'Current market price per share' }
    ]
  }
];

const edgeCases = [
  {
    icon: ShieldCheck,
    title: 'Zero contribution amounts',
    desc: 'If monthly contribution is left blank or set to 0, the formula reduces to pure compound interest with no PMT term. No divide-by-zero errors, no NaN outputs.'
  },
  {
    icon: Layers,
    title: 'Very long time horizons',
    desc: "JavaScript's IEEE 754 double-precision handles values up to 10^308. Even at 50 years with a 12% annual rate, calculation precision is unaffected."
  },
  {
    icon: Zap,
    title: 'High compounding frequencies',
    desc: 'Daily compounding (n=365) is calculated with the exact daily rate, not approximated using continuous compounding shortcuts found in simpler tools.'
  },
  {
    icon: Percent,
    title: 'Decimal interest rates',
    desc: 'Rates like 7.35% are stored as 0.0735 internally — not rounded to 7% or 8% before calculation, ensuring accurate long-term projections.'
  }
];

const disclosures = [
  {
    title: 'Inflation',
    desc: 'Unless explicitly stated, results are shown in "nominal" terms (not adjusted for inflation). A $1M balance in 30 years will have significantly less purchasing power than $1M today.'
  },
  {
    title: 'Taxation',
    desc: 'Our growth calculators do not automatically deduct capital gains or income taxes. Actual "take-home" amounts will vary based on your local tax laws and account types.'
  },
  {
    title: 'Past Performance',
    desc: "Historical rates (like the S&P 500's ~10.7% average) are reference points, not guarantees. Actual future returns will vary based on market conditions."
  },
  {
    title: 'Not Financial Advice',
    desc: 'WealthifyX calculators are educational tools. They do not constitute financial, tax, or investment advice. Consult a qualified advisor before making investment decisions.'
  }
];

const faqs = [
  {
    q: 'Why does my result differ from another calculator?',
    a: 'Most calculators round intermediate values to 2 decimal places at each compounding period. Over 30 years at monthly compounding, this creates hundreds of rounding events and can produce errors of 3–8% vs the mathematically correct result. WealthifyX carries full precision throughout.'
  },
  {
    q: 'What compounding frequency should I use?',
    a: 'Match your actual account — most US savings accounts compound daily, most investment accounts use annual or quarterly. When in doubt, monthly is the most common default.'
  },
  {
    q: 'Do you support inflation-adjusted returns?',
    a: 'Not yet within the compound interest calculator, but an Inflation-Adjusted Return calculator is on the roadmap. To approximate: subtract your expected inflation rate (~3%) from the interest rate you input.'
  },
  {
    q: 'Are your formulas open source?',
    a: 'Yes. WealthifyX is built on standard TVM (Time Value of Money) equations that are publicly documented in any finance textbook. No proprietary black-box math.'
  }
];

export default function MethodologyPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wealthifyx.com' },
      { '@type': 'ListItem', position: 2, name: 'Methodology', item: 'https://wealthifyx.com/methodology' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="min-h-screen">
        {/* ── Hero ── */}
        <section className="bg-[var(--bg-subtle)] border-b border-[var(--border)] p-[90px_48px_60px] md:max-lg:p-[80px_32px_48px] max-md:p-[80px_20px_40px]">
          <div className="max-w-[1100px] m-[0_auto]">
            <span className="section-eyebrow block mb-[16px]">{'// METHODOLOGY'}</span>
            <h1 className="font-sans font-[400] tracking-[-2px] leading-[1.05] text-[var(--text-primary)] m-[0_0_24px_0] text-[clamp(40px,6vw,64px)] max-md:text-[36px] max-md:tracking-[-1px]">
              How our finance <br className="hidden md:block" />
              <span className="text-[var(--accent)] ">calculators work.</span>
            </h1>
            <p className="font-sans text-[18px] md:max-lg:text-[17px] max-md:text-[15px] text-[var(--text-muted)] leading-[1.7] max-w-[720px] m-[0]">
              We use the same financial formulas taught in CFA and CFP certification programs — with full 
              floating-point precision and zero intermediate rounding. Here&apos;s exactly how every calculation works.
            </p>
          </div>
        </section>

        {/* ── Section 1: Precision Standards ── */}
        <section className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-base)]">
          <div className="max-w-[1100px] m-[0_auto]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-[48px] items-start">
              <div>
                <span className="section-eyebrow mb-[12px]">{'// MATH STANDARDS'}</span>
                <h2 className="section-heading mb-[16px]">Precision Standards</h2>
                <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.7] mb-[24px]">
                  Most web calculators use simplified formulas or round intermediate numbers to two decimal places at every step. Over long time horizons, this creates significant drift.
                </p>
                <div className="flex flex-col gap-[16px]">
                  {[
                    { title: 'Zero Rounding Drift', desc: 'Calculations are performed with 16-decimal precision before rounding for display.' },
                    { title: 'Standard TVM Equations', desc: 'We use institutional Time Value of Money equations for all projections.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-[16px]">
                      <CheckCircle2 size={20} className="text-[var(--accent)] shrink-0 mt-[2px]" />
                      <div>
                        <div className="font-ubuntu text-[15px] font-[600] text-[var(--text-primary)] mb-[2px]">{item.title}</div>
                        <p className="font-sans text-[14px] text-[var(--text-muted)] leading-[1.5] m-[0]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison Table */}
              <div className="card overflow-hidden">
                <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-[var(--bg-subtle)] border-b border-[var(--border)] p-[14px_20px] max-sm:p-[12px_16px]">
                  <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--text-faint)]">What</div>
                  <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--text-faint)]">Typical</div>
                  <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--text-faint)]">WealthifyX</div>
                </div>
                {comparisonData.map((row, i) => (
                  <div key={i} className={`grid grid-cols-[1.2fr_1fr_1fr] p-[14px_20px] max-sm:p-[12px_16px] border-b border-[var(--border)] last:border-0 ${i % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-subtle)]'}`}>
                    <div className="font-sans text-[13px] text-[var(--text-primary)] font-[500] pr-4">{row.label}</div>
                    <div className="font-sans text-[12px] text-[var(--text-muted)] pr-4">{row.typical}</div>
                    <div className="font-sans text-[12px] text-[var(--accent)] font-[600]">{row.wealthify}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Formulas ── */}
        <section className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-subtle)] border-y border-[var(--border)]">
          <div className="max-w-[1100px] m-[0_auto]">
            <div className="section-header mb-[48px] max-md:mb-[32px]">
              <span className="section-eyebrow">{'// FORMULARY'}</span>
              <h2 className="section-heading">Formula transparency.</h2>
              <p className="section-subtext max-w-[600px]">The exact mathematical logic powering our calculator suite.</p>
            </div>

            <div className="flex flex-col gap-[24px]">
              {formulas.map((f) => (
                <div key={f.name} className="card p-[40px] max-md:p-[24px]">
                  <span className="font-mono text-[10px] text-[var(--text-faint)] uppercase tracking-[2px] block mb-[20px]">
                    {f.eyebrow}
                  </span>
                  <div className="font-sans text-[28px] max-md:text-[18px] text-[var(--accent)] tracking-[1px] mb-[32px] pb-[24px] border-b border-[var(--border)] overflow-x-auto whitespace-nowrap scrollbar-none">
                    {f.formula}
                    {f.secondaryFormula && (
                      <div className="mt-[12px] pt-[12px] border-t border-[var(--border)] opacity-80">
                        {f.secondaryFormula}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[12px]">
                    {f.variables.map((v) => (
                      <div key={v.sym} className="flex gap-[16px] items-baseline border-b border-[var(--border)] border-dotted pb-[8px]">
                        <span className="font-sans text-[13px] font-[600] text-[var(--accent)] w-[32px] shrink-0">{v.sym}</span>
                        <span className="font-sans text-[14px] text-[var(--text-muted)] leading-[1.5]">{v.def}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-[32px] pt-[24px] border-t border-[var(--border)]">
                    <a href={`/tools/${f.id}`} className="font-sans text-[13px] font-[600] text-[var(--text-primary)] no-underline flex items-center gap-[8px] hover:text-[var(--accent)] transition-colors group">
                      Use this calculator <ArrowRight size={14} className="group-hover:translate-x-[4px] transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: Edge Cases ── */}
        <section className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-base)]">
          <div className="max-w-[1100px] m-[0_auto]">
            <div className="section-header mb-[48px] max-md:mb-[32px]">
              <span className="section-eyebrow">{'// PRECISION DETAILS'}</span>
              <h2 className="section-heading">Edge cases we handle correctly.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {edgeCases.map((item, i) => (
                <div key={i} className="card p-[32px] max-md:p-[24px] flex flex-col gap-[16px]">
                  <div className="w-[40px] h-[40px] rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)]">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-sans font-[600] text-[17px] text-[var(--text-primary)] mb-[8px]">{item.title}</h3>
                    <p className="font-sans text-[14px] text-[var(--text-muted)] leading-[1.6] m-[0]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 4: Disclosures ── */}
        <section className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-subtle)] border-y border-[var(--border)]">
          <div className="max-w-[1100px] m-[0_auto]">
            <div className="section-header mb-[48px] max-md:mb-[32px]">
              <span className="section-eyebrow">{'// DISCLOSURES'}</span>
              <h2 className="section-heading">Important Caveats</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {disclosures.map((item, i) => (
                <div key={i} className="card p-[24px] border-l-[4px] border-l-[#f59e0b]">
                  <div className="flex items-center gap-[10px] mb-[12px]">
                    <AlertTriangle size={18} className="text-[#f59e0b]" />
                    <span className="font-ubuntu text-[13px] font-[600] uppercase tracking-[1px] text-[var(--text-primary)]">{item.title}</span>
                  </div>
                  <p className="font-sans text-[14px] text-[var(--text-muted)] leading-[1.6] m-[0]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <FAQSection faqs={faqs} id="faq" />

        {/* ── Final CTA ── */}
        <section className="p-[100px_48px] md:max-lg:p-[80px_32px] max-md:p-[64px_20px] bg-[var(--bg-subtle)] border-t border-[var(--border)] text-center">
          <div className="max-w-[700px] m-[0_auto]">
            <span className="section-eyebrow block mb-[16px]">{'// GET STARTED'}</span>
            <h2 className="section-heading mb-[20px] max-md:mb-[12px]">See the math in action.</h2>
            <p className="section-subtext mb-[32px] max-md:mb-[24px] m-[0_auto] max-md:text-[14px]">
              Every formula on this page powers a live calculator. Open any tool and run your own numbers — free, no account required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px]">
              <a href="/tools" className="btn-primary inline-flex py-[14px] px-[32px] max-md:px-[28px] max-md:h-[50px] text-[16px] max-md:text-[15px] no-underline">
                Browse All Calculators →
              </a>
              <a href="/tools/compound-interest-calculator" className="btn-ghost inline-flex py-[14px] px-[32px] max-md:px-[28px] max-md:h-[50px] text-[16px] max-md:text-[15px] no-underline">
                Compound Interest Calculator
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
