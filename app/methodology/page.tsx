import type { Metadata } from 'next';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Zap, Layers, Percent } from 'lucide-react';
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
  { label: 'Intermediate rounding',   typical: 'Yes — 2 decimal places',      wealthify: 'Never' },
  { label: 'Compounding frequency',   typical: 'Monthly only',                 wealthify: 'Daily / Monthly / Quarterly / Annual' },
  { label: 'IRS limit enforcement',   typical: 'Not applied',                  wealthify: '2024 limits on every retirement tool' },
  { label: 'Formula standard',        typical: 'Simplified approximation',     wealthify: 'IEEE 754 full precision' },
  { label: 'Tax bracket stacking',    typical: 'Flat rate on full gain',        wealthify: 'Gains stacked on ordinary income' },
  { label: '30-year drift',           typical: 'Up to 3–8% error',             wealthify: 'None' },
];

const formulas = [
  {
    name: 'Compound Interest',
    id: 'compound-interest-calculator',
    eyebrow: '// FORMULA — COMPOUND INTEREST',
    formula: 'A = P(1 + r/n)^(nt)',
    secondaryFormula: 'With contributions: A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) − 1) / (r/n)]',
    variables: [
      { sym: 'A',   def: 'Final balance (future value)' },
      { sym: 'P',   def: 'Principal — initial investment' },
      { sym: 'r',   def: 'Annual interest rate as a decimal' },
      { sym: 'n',   def: 'Compounding periods per year (12 = monthly, 365 = daily)' },
      { sym: 't',   def: 'Time in years' },
      { sym: 'PMT', def: 'Monthly contribution amount' },
    ],
  },
  {
    name: 'Investment Calculator',
    id: 'investment-calculator',
    eyebrow: '// FORMULA — INVESTMENT',
    formula: 'FV = PV(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) − 1) / (r/n)]',
    variables: [
      { sym: 'FV',  def: 'Future value — final portfolio worth' },
      { sym: 'PV',  def: 'Present value — initial investment' },
      { sym: 'r',   def: 'Annual return rate as a decimal' },
      { sym: 'n',   def: 'Compounding periods per year' },
      { sym: 't',   def: 'Time in years' },
      { sym: 'PMT', def: 'Periodic contribution amount' },
    ],
  },
  {
    name: 'Roth IRA Calculator',
    id: 'roth-ira-calculator',
    eyebrow: '// FORMULA — ROTH IRA',
    formula: 'FV = B₀(1 + r)^t + C × [((1 + r)^t − 1) / r]',
    variables: [
      { sym: 'FV', def: 'Tax-free balance at retirement' },
      { sym: 'B₀', def: 'Existing Roth IRA balance today' },
      { sym: 'r',  def: 'Annual return rate (7% default — S&P inflation-adjusted)' },
      { sym: 't',  def: 'Years from current age to retirement age' },
      { sym: 'C',  def: 'Annual contribution — capped at 2024 IRS limit ($7,000 / $8,000 age 50+)' },
    ],
  },
  {
    name: '401k Calculator',
    id: '401k-calculator',
    eyebrow: '// FORMULA — 401K',
    formula: 'FV = B₀(1 + r)^t + C_total × [((1 + r)^t − 1) / r]',
    secondaryFormula: 'C_total = min(salary × emp%, IRS_limit) + salary × min(emp%, match_ceiling%) × match_rate%',
    variables: [
      { sym: 'FV',       def: 'Pre-tax 401k balance at retirement' },
      { sym: 'B₀',       def: 'Existing 401k balance' },
      { sym: 'r',        def: 'Annual return rate' },
      { sym: 't',        def: 'Years to retirement' },
      { sym: 'C_total',  def: 'Total annual contribution — employee + employer match' },
      { sym: 'IRS_limit',def: '$23,000 (2024) · $30,500 age 50+ with catch-up' },
    ],
  },
  {
    name: 'Savings Goal Calculator',
    id: 'savings-goal-calculator',
    eyebrow: '// FORMULA — SAVINGS GOAL',
    formula: 'C = (Goal − B₀(1+r)^n) ÷ [((1+r)^n − 1) ÷ r]',
    secondaryFormula: 'Time mode: balance iterated month-by-month until balance ≥ Goal',
    variables: [
      { sym: 'C',    def: 'Required monthly contribution to reach Goal in n months' },
      { sym: 'B₀',   def: 'Current savings — starting balance' },
      { sym: 'r',    def: 'Monthly return rate (annual ÷ 12)' },
      { sym: 'n',    def: 'Number of months to target date' },
      { sym: 'Goal', def: 'Target savings amount' },
    ],
  },
  {
    name: 'Options Profit Calculator',
    id: 'options-profit-calculator',
    eyebrow: '// FORMULA — OPTIONS P&L AT EXPIRY',
    formula: 'Long Call:  P&L = (max(0, S − K) − P) × 100 × N',
    secondaryFormula: 'Long Put: P&L = (max(0, K − S) − P) × 100 × N  ·  Short: flip sign',
    variables: [
      { sym: 'S', def: 'Stock price at expiry' },
      { sym: 'K', def: 'Strike price of the option' },
      { sym: 'P', def: 'Premium per share (paid for long, received for short)' },
      { sym: 'N', def: 'Number of contracts (1 contract = 100 shares)' },
      { sym: 'BE', def: 'Breakeven — Long Call: K + P  ·  Long Put: K − P' },
    ],
  },
  {
    name: 'Capital Gains Tax Calculator',
    id: 'capital-gains-calculator',
    eyebrow: '// FORMULA — CAPITAL GAINS TAX',
    formula: 'Federal Tax = calcLTCG(gain, ordinaryIncome, filingStatus)',
    secondaryFormula: 'NIIT = min(gain, max(0, MAGI − threshold)) × 3.8%  ·  Total = Federal + NIIT + State',
    variables: [
      { sym: 'LTCG',      def: '0% / 15% / 20% — gains stacked on top of ordinary income (2024 brackets)' },
      { sym: 'STCG',      def: 'Ordinary income rate 10%–37% — applied as marginal tax on gain' },
      { sym: 'NIIT',      def: '+3.8% on gains where MAGI > $200k single / $250k married joint' },
      { sym: 'State',     def: 'Flat rate applied to total gain (optional, user-entered)' },
      { sym: 'Net Profit', def: 'Gain − Federal Tax − NIIT − State Tax' },
    ],
  },
  {
    name: 'Dividend Calculator',
    id: 'dividend-calculator',
    eyebrow: '// FORMULA — DIVIDEND & DRIP',
    formula: 'DRIP: new shares = (S × DPS/4) ÷ P  (quarterly)',
    secondaryFormula: 'Yield on Cost = (Final Annual Income ÷ Original Cost Basis) × 100',
    variables: [
      { sym: 'S',   def: 'Current shares owned — grows with each DRIP reinvestment' },
      { sym: 'DPS', def: 'Annual dividend per share — grows at dividend growth rate each year' },
      { sym: 'P',   def: 'Current share price — grows at stock growth rate each year' },
      { sym: 'YOC', def: 'Yield on Cost — annual income return on original purchase price' },
    ],
  },
];

const edgeCases = [
  {
    icon: ShieldCheck,
    title: 'Zero contribution amounts',
    desc: "If monthly contribution is left blank or set to 0, every formula reduces to pure compound growth with no PMT term. No divide-by-zero errors, no NaN outputs — validated before any calculation runs.",
  },
  {
    icon: Layers,
    title: 'Very long time horizons',
    desc: "JavaScript's IEEE 754 double-precision handles values up to 10^308. Even at 50 years with a 12% annual rate, calculation precision is completely unaffected.",
  },
  {
    icon: Zap,
    title: 'High compounding frequencies',
    desc: 'Daily compounding (n=365) uses the exact daily rate — not approximated using continuous compounding shortcuts. This matters most at high rates over long periods.',
  },
  {
    icon: Percent,
    title: 'Tax bracket stacking',
    desc: 'Capital gains are stacked on top of ordinary income — not taxed from $0. The LTCG engine identifies how much of the gain falls in each bracket and applies the correct rate to each portion.',
  },
];

const disclosures = [
  {
    title: 'Inflation',
    desc: 'Unless explicitly stated, results are shown in nominal terms — not adjusted for inflation. A $1M balance in 30 years will have significantly less purchasing power than $1M today. Subtract your expected inflation rate (~3%) from the return rate to approximate real returns.',
  },
  {
    title: 'Taxation',
    desc: 'Growth calculators show pre-tax returns unless they are explicitly a tax calculator. Actual take-home amounts will vary based on your account type (taxable, Roth, traditional) and applicable tax law.',
  },
  {
    title: 'Past Performance',
    desc: "Historical rates — like the S&P 500's ~10.7% average — are reference points, not guarantees. Actual future returns will vary based on market conditions, fees, and your specific holdings.",
  },
  {
    title: 'Not Financial Advice',
    desc: 'WealthifyX calculators are educational tools. They do not constitute financial, tax, or investment advice. Consult a qualified advisor before making investment decisions.',
  },
];

const faqs = [
  {
    q: 'Why does my result differ from another calculator?',
    a: 'Most calculators round intermediate values to 2 decimal places at each compounding period. Over 30 years at monthly compounding, this creates hundreds of rounding events and can produce errors of 3–8% vs the mathematically correct result. WealthifyX carries full precision throughout every calculation.',
  },
  {
    q: 'What compounding frequency should I use?',
    a: 'Match your actual account — most US savings accounts compound daily, most investment accounts use annual or quarterly projections. The retirement calculators (Roth IRA, 401k) use annual compounding, which is the standard for long-horizon retirement modeling.',
  },
  {
    q: 'How does the capital gains calculator handle tax brackets?',
    a: 'The calculator stacks your capital gain on top of your ordinary income. Your ordinary income fills the brackets first, and the gain is taxed starting from where your income leaves off — not from $0. This is the correct IRS treatment and produces meaningfully different results from flat-rate approaches at mid-range incomes.',
  },
  {
    q: 'How is the options P&L chart built?',
    a: 'The chart samples 50 evenly-spaced stock prices between 45% and 175% of the strike price and calculates intrinsic value at expiry at each point. This is pure expiry math — no time value, no Greeks. It shows your exact payoff profile if you hold to expiration.',
  },
  {
    q: 'Are your formulas open source?',
    a: 'Yes. WealthifyX is built on standard TVM (Time Value of Money) equations documented in any finance textbook, plus the IRS 2024 published tax brackets. No proprietary black-box math.',
  },
];

export default function MethodologyPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://wealthifyx.com' },
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
              How our finance{' '}
              <br className="hidden md:block" />
              <span className="text-[var(--accent)]">calculators work.</span>
            </h1>
            <p className="font-sans text-[18px] md:max-lg:text-[17px] max-md:text-[15px] text-[var(--text-muted)] leading-[1.7] max-w-[720px] m-[0]">
              We use the same financial formulas taught in CFA and CFP certification programs —
              with full floating-point precision, 2024 IRS brackets, and zero intermediate rounding.
              Here&apos;s exactly how every calculation works.
            </p>
          </div>
        </section>

        {/* ── Section 1: Precision Standards ── */}
        <section className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-base)]">
          <div className="max-w-[1100px] m-[0_auto]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-[48px] items-start">
              <div>
                <span className="section-eyebrow mb-[12px]">{'// MATH STANDARDS'}</span>
                <h2 className="section-heading mb-[16px]">Precision standards.</h2>
                <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.7] mb-[24px]">
                  Most web calculators use simplified formulas or round intermediate numbers to two
                  decimal places at every step. Over long time horizons, this creates significant
                  drift. WealthifyX carries full precision through every calculation and only rounds
                  at the final display step.
                </p>
                <div className="flex flex-col gap-[16px]">
                  {[
                    { title: 'Zero Rounding Drift',     desc: 'Calculations run at 16-decimal precision. Display rounding happens once — at the output.' },
                    { title: '2024 IRS Limits Applied',  desc: 'Retirement calculators enforce the current contribution limits and tax brackets automatically.' },
                    { title: 'Standard TVM Equations',  desc: 'Institutional Time Value of Money formulas for all growth projections — not simplified shortcuts.' },
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

              {/* Comparison table */}
              <div className="card overflow-hidden">
                <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-[var(--bg-subtle)] border-b border-[var(--border)] p-[14px_20px] max-sm:p-[12px_16px]">
                  {['What', 'Typical', 'WealthifyX'].map((h) => (
                    <div key={h} className="font-mono text-[10px] uppercase tracking-[1.5px] text-[var(--text-faint)]">{h}</div>
                  ))}
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
              <p className="section-subtext max-w-[600px]">
                The exact mathematical logic powering all 8 calculators.
              </p>
            </div>

            <div className="flex flex-col gap-[24px]">
              {formulas.map((f) => (
                <div key={f.name} className="card p-[40px] max-md:p-[24px]">
                  <span className="font-sans text-[10px] text-[var(--text-faint)] uppercase tracking-[2px] block mb-[20px]">
                    {f.eyebrow}
                  </span>
                  <div className="font-mono text-[18px] max-md:text-[14px] text-[var(--accent)] tracking-[0.5px] mb-[24px] pb-[20px] border-b border-[var(--border)] overflow-x-auto">
                    {f.formula}
                    {f.secondaryFormula && (
                      <div className="mt-[10px] pt-[10px] border-t border-[var(--border)] text-[14px] max-md:text-[12px] opacity-75">
                        {f.secondaryFormula}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[40px] gap-y-[10px] mb-[24px]">
                    {f.variables.map((v) => (
                      <div key={v.sym} className="flex gap-[16px] items-baseline border-b border-dotted border-[var(--border)] pb-[8px]">
                        <span className="font-mono text-[13px] font-[600] text-[var(--accent)] w-[40px] shrink-0">{v.sym}</span>
                        <span className="font-sans text-[13px] text-[var(--text-muted)] leading-[1.5]">{v.def}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-[20px] border-t border-[var(--border)]">
                    <a href={`/tools/${f.id}`}
                      className="font-sans text-[13px] font-[600] text-[var(--text-primary)] no-underline flex items-center gap-[8px] hover:text-[var(--accent)] transition-colors group w-fit">
                      Use this calculator
                      <ArrowRight size={14} className="group-hover:translate-x-[4px] transition-transform" />
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
              <h2 className="section-heading">Important caveats.</h2>
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

        {/* ── FAQ ── */}
        <FAQSection faqs={faqs} id="faq" />

        {/* ── CTA ── */}
        <section className="p-[100px_48px] md:max-lg:p-[80px_32px] max-md:p-[64px_20px] bg-[var(--bg-subtle)] border-t border-[var(--border)] text-center">
          <div className="max-w-[700px] m-[0_auto]">
            <span className="section-eyebrow block mb-[16px]">{'// GET STARTED'}</span>
            <h2 className="section-heading mb-[20px] max-md:mb-[12px]">See the math in action.</h2>
            <p className="section-subtext mb-[32px] max-md:mb-[24px] m-[0_auto] max-md:text-[14px]">
              Every formula on this page powers a live calculator. Run your own numbers — free, no account required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px]">
              <a href="/tools"
                className="btn-primary inline-flex py-[14px] px-[32px] max-md:px-[28px] max-md:h-[50px] text-[16px] max-md:text-[15px] no-underline">
                Browse All Calculators →
              </a>
              <a href="/tools/compound-interest-calculator"
                className="btn-ghost inline-flex py-[14px] px-[32px] max-md:px-[28px] max-md:h-[50px] text-[16px] max-md:text-[15px] no-underline">
                Compound Interest Calculator
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}