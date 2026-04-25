import type { Metadata } from 'next';
import { Shield, Lock, Zap, Heart, ArrowRight, Calculator, TrendingUp, Users } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

/* ── SEO ── */
export const metadata: Metadata = {
  title: 'About WealthifyX — Free Finance Calculators Built for Investors',
  description:
    'WealthifyX builds free, precision finance calculators for everyday investors. No accounts, no data stored, no tracking. Learn why we built it and how we keep it free.',
  alternates: {
    canonical: 'https://wealthifyx.com/about',
  },
  openGraph: {
    title: 'About WealthifyX — Free Finance Calculators Built for Investors',
    description:
      'Free, precise finance calculators with zero data collection. Learn about our mission, how the math works, and why WealthifyX stays free forever.',
    url: 'https://wealthifyx.com/about',
    type: 'website',
  },
};

/* ── Data ── */
const values = [
  {
    icon: Shield,
    title: 'Privacy by Design',
    desc: 'We never see your numbers. Every calculation runs entirely in your browser — no servers, no databases, no logs. Close the tab and it never existed.',
  },
  {
    icon: Lock,
    title: 'Zero Accounts Required',
    desc: 'Financial planning should be frictionless. Every tool on this site is available immediately — no sign-up wall, no email, no credit card, ever.',
  },
  {
    icon: Zap,
    title: 'Institutional-Grade Math',
    desc: 'Our calculators use the same formulas professional analysts use — no rounding drift, no shortcuts, no simplified assumptions that silently skew your results.',
  },
  {
    icon: Heart,
    title: 'Free Forever',
    desc: 'Precision tools should be accessible to everyone. WealthifyX is funded through contextual affiliate partnerships — not by charging you, not by selling your data.',
  },
];

const stats = [
  { value: '0', label: 'Data Points Stored', mono: true },
  { value: '100%', label: 'Client-Side Calculations', mono: true },
  { value: '14+', label: 'Tools Being Built', mono: true },
  { value: '$0', label: 'Cost to You, Ever', mono: true },
];

const tools = [
  { name: 'Compound Interest Calculator', href: '/tools/compound-interest-calculator' },
  { name: 'Investment Calculator', href: '/tools/investment-calculator' },
  { name: 'Roth IRA Calculator', href: '/tools/roth-ira-calculator' },
  { name: '401k Calculator', href: '/tools/401k-calculator' },
  { name: 'Savings Goal Calculator', href: '/tools/savings-goal-calculator' },
  { name: 'Capital Gains Tax Calculator', href: '/tools/capital-gains-calculator' },
  { name: 'Dividend Calculator', href: '/tools/dividend-calculator' },
  { name: 'APY Interest Calculator', href: '/tools/apy-interest-calculator' },
];

const faqs = [
  {
    q: 'Is WealthifyX really free?',
    a: 'Yes. Every calculator on WealthifyX is completely free with no usage limits, no account required, and no premium tier. We sustain the site through affiliate partnerships with financial services we personally vet.',
  },
  {
    q: 'Does WealthifyX store my financial data?',
    a: 'No. All calculations run entirely in your browser using JavaScript. Nothing is sent to our servers. When you close the tab, the numbers are gone. We have no database of user financial data because we never collect it.',
  },
  {
    q: 'How accurate are the calculators?',
    a: 'We use industry-standard formulas — the same ones used in professional financial modeling software. Unlike simplified online calculators, we avoid intermediate rounding that causes drift in long-term projections.',
  },
  {
    q: 'Who is WealthifyX built for?',
    a: 'Retail investors, personal finance beginners, and anyone who wants to model their financial decisions without paying for software or handing over personal information to a data broker masquerading as a finance app.',
  },
];

export default function AboutPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wealthifyx.com' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://wealthifyx.com/about' },
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
            <span className="section-eyebrow block mb-[16px]">{'// ABOUT WEALTHIFYX'}</span>
            <h1 className="font-sans font-[400] tracking-[-2px] leading-[1.05] text-[var(--text-primary)] m-[0_0_24px_0] text-[clamp(36px,6vw,64px)] max-md:text-[36px] max-md:tracking-[-1px]">
              Finance tools built for <br className="hidden md:block" />
              <span className="text-[var(--accent)] ">investors, not accountants.</span>
            </h1>
            <p className="font-sans text-[18px] md:max-lg:text-[17px] max-md:text-[15px] text-[var(--text-muted)] leading-[1.7] max-w-[680px] m-[0]">
              Most finance calculators are either paywalled, account-gated, or quietly harvest your data.
              WealthifyX exists to fix that — free, private, precise tools that work for anyone
              trying to understand their money.
            </p>

            {/* Quick nav pills */}
            <div className="flex flex-wrap gap-[8px] mt-[32px]">
              {['Our Mission', 'How It Works', 'The Math', 'FAQ'].map((label, i) => {
                const anchors = ['#mission', '#how-it-works', '#the-math', '#faq'];
                return (
                  <a
                    key={label}
                    href={anchors[i]}
                    className="font-ubuntu text-[12px] font-[500] px-[16px] py-[6px] rounded-full border border-[var(--border)] text-[var(--text-muted)] bg-[var(--bg-base)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] transition-colors duration-150 no-underline"
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="bg-[var(--bg-base)] border-b border-[var(--border)] p-[24px_48px] md:max-lg:p-[24px_32px] max-md:p-[24px_20px]">
          <div className="max-w-[1100px] m-[0_auto] grid grid-cols-2 md:grid-cols-4 gap-[24px] md:gap-0 md:divide-x md:divide-[var(--border)]">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-start md:items-center md:px-[24px] gap-[4px]">
                <span className="font-sans text-[28px] md:text-[32px] font-[500] text-[var(--text-primary)] leading-none">
                  {s.value}
                </span>
                <span className="font-sans text-[11px] text-[var(--text-faint)] uppercase tracking-[1px]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mission / Values ── */}
        <section id="mission" className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-base)]">
          <div className="max-w-[1100px] m-[0_auto]">
            <div className="section-header mb-[48px] max-md:mb-[32px]">
              <span className="section-eyebrow">{'// OUR MISSION'}</span>
              <h2 className="section-heading mt-[8px]">What we stand for.</h2>
              <p className="section-subtext max-w-[560px] mt-[12px]">
                Four principles that govern every decision we make — from how we write formulas to how we pay the bills.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-[16px] md:gap-[20px]">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="card p-[32px] md:max-lg:p-[28px] max-md:p-[24px] flex flex-col gap-[16px]">
                    <div className="w-[48px] h-[48px] max-md:w-[40px] max-md:h-[40px] rounded-xl bg-[var(--accent-bg)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] shrink-0">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-sans font-semibold text-[17px] max-md:text-[16px] text-[var(--text-primary)] mb-[8px] leading-snug">
                        {v.title}
                      </h3>
                      <p className="font-sans text-[14px] md:text-[15px] text-[var(--text-muted)] leading-[1.65] m-0">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-subtle)] border-y border-[var(--border)]">
          <div className="max-w-[1100px] m-[0_auto] grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-[48px] lg:gap-[64px] items-center">
            <div>
              <span className="section-eyebrow mb-[16px] block">{'// HOW IT WORKS'}</span>
              <h2 className="section-heading mb-[24px] max-md:mb-[16px]">How is this free?</h2>
              <div className="font-sans text-[15px] md:text-[16px] text-[var(--text-muted)] leading-[1.8] flex flex-col gap-[20px]">
                <p>
                  WealthifyX is a labor of love. We believe professional-grade financial modeling
                  should be available to every retail investor — not behind a paywall or a &quot;free trial&quot;
                  that expires when you need it most.
                </p>
                <p>
                  We sustain the site through contextual affiliate partnerships with brokers and financial
                  service providers we personally use and trust. If you choose to open an account through
                  one of our links, we may earn a commission at no cost to you.
                </p>
                <p>
                  This keeps the math pure, the tools free, and your data exactly where it belongs:
                  <strong className="text-[var(--text-primary)] font-semibold"> on your own device.</strong>
                </p>
              </div>

              <div className="mt-[32px] p-[20px] rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col gap-[12px]">
                <div className="font-sans text-[11px] font-[500] uppercase tracking-[1.5px] text-[var(--text-faint)]">
                  Revenue model breakdown
                </div>
                {[
                  { label: 'Affiliate commissions', pct: 'Primary' },
                  { label: 'Display advertising (planned)', pct: 'Secondary' },
                  { label: 'Selling your data', pct: 'Never' },
                  { label: 'Charging users', pct: 'Never' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-[16px]">
                    <span className="font-sans text-[13px] text-[var(--text-muted)]">{row.label}</span>
                    <span className={`font-sans text-[11px] font-[500] px-[8px] py-[2px] rounded-full border ${
                      row.pct === 'Never'
                        ? 'bg-red-50 border-red-100 text-red-500'
                        : row.pct === 'Primary'
                        ? 'bg-[var(--accent-bg)] border-[var(--accent-border)] text-[var(--accent)]'
                        : 'bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-faint)]'
                    }`}>
                      {row.pct}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats card */}
            <div className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-[32px] md:p-[40px] overflow-hidden shadow-[var(--shadow-lg)] w-full">
              <div className="relative z-10">
                <div className="font-sans text-[10px] text-[var(--accent)] uppercase tracking-[2px] mb-[32px]">
                  Privacy Dashboard
                </div>
                <div className="flex flex-col gap-[24px]">
                  <div>
                    <div className="font-sans text-[56px] max-md:text-[48px] font-[500] text-[var(--text-primary)] leading-none">0</div>
                    <div className="font-sans text-[12px] text-[var(--text-faint)] uppercase tracking-[1px] mt-[8px]">
                      Data points ever stored
                    </div>
                  </div>
                  <div className="w-full h-px bg-[var(--border)]" />
                  <div>
                    <div className="font-sans text-[56px] max-md:text-[48px] font-[500] text-[var(--text-primary)] leading-none">100%</div>
                    <div className="font-sans text-[12px] text-[var(--text-faint)] uppercase tracking-[1px] mt-[8px]">
                      Client-side math
                    </div>
                  </div>
                  <div className="w-full h-px bg-[var(--border)]" />
                  <div>
                    <div className="font-sans text-[56px] max-md:text-[48px] font-[500] text-[var(--accent)] leading-none">∞</div>
                    <div className="font-sans text-[12px] text-[var(--text-faint)] uppercase tracking-[1px] mt-[8px]">
                      Calculations available
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute top-[-10%] right-[-10%] w-[280px] h-[280px] bg-[var(--accent-bg)] rounded-full blur-[80px] opacity-60 z-0 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* ── The Math ── */}
        <section id="the-math" className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-base)]">
          <div className="max-w-[1100px] m-[0_auto]">
            <div className="section-header mb-[48px] max-md:mb-[32px]">
              <span className="section-eyebrow">{'// THE MATH'}</span>
              <h2 className="section-heading mt-[8px]">Why our numbers are different.</h2>
              <p className="section-subtext max-w-[600px] mt-[12px]">
                Most free calculators take shortcuts that silently skew long-term projections.
                Here&apos;s exactly what we do differently.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-[16px] md:gap-[20px]">
              {[
                {
                  icon: Calculator,
                  title: 'No intermediate rounding',
                  desc: 'We carry full floating-point precision through every calculation step. Rounding only happens at display time — never inside the formula.',
                },
                {
                  icon: TrendingUp,
                  title: 'Industry-standard formulas',
                  desc: 'Every calculator uses the same formulas taught in CFA and CFP curriculum — not simplified approximations that introduce hidden error.',
                },
                {
                  icon: Users,
                  title: 'Built by someone who trades',
                  desc: 'WealthifyX was built by a developer with a background in technical analysis and options trading. We know what numbers matter.',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="card p-[24px] flex flex-col gap-[16px]">
                    <div className="w-[40px] h-[40px] rounded-lg bg-[var(--accent-bg)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] shrink-0">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-sans font-[600] text-[15px] text-[var(--text-primary)] mb-[8px]">{item.title}</h3>
                      <p className="font-sans text-[13px] text-[var(--text-muted)] leading-[1.6] m-0">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Tools list ── */}
        <section className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-subtle)] border-y border-[var(--border)]">
          <div className="max-w-[1100px] m-[0_auto]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-[48px] items-start">
              <div>
                <span className="section-eyebrow mb-[16px] block">{'// WHAT WE BUILD'}</span>
                <h2 className="section-heading mb-[16px]">Our calculator library.</h2>
                <p className="section-subtext mb-[24px]">
                  14 precision finance calculators covering investing, retirement, savings, and tax planning.
                  All free, all private, all available without an account.
                </p>
                <a href="/tools" className="btn-primary inline-flex items-center gap-[8px] px-[24px] py-[12px] no-underline">
                  Browse All Tools <ArrowRight size={14} />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[8px]">
                {tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.href}
                    className="flex items-center justify-between gap-[12px] px-[16px] py-[12px] rounded-lg border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] text-[var(--text-muted)] transition-colors duration-150 no-underline group"
                  >
                    <span className="font-sans text-[13px] font-[500] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-150">
                      {tool.name}
                    </span>
                    <ArrowRight size={12} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <FAQSection faqs={faqs} id="faq" />

        {/* ── Final CTA ── */}
        <section className="p-[100px_48px] md:max-lg:p-[80px_32px] max-md:p-[64px_20px] bg-[var(--bg-subtle)] border-t border-[var(--border)] text-center">
          <div className="max-w-[640px] m-[0_auto]">
            <span className="section-eyebrow mb-[16px] block">{'// GET STARTED'}</span>
            <h2 className="section-heading mb-[20px]">Ready to run the numbers?</h2>
            <p className="section-subtext mb-[32px] max-md:text-[14px]">
              No account. No credit card. No data collected. Just open a tool and start calculating.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px]">
              <a href="/tools" className="btn-primary px-[32px] py-[12px] text-[15px] max-md:w-full no-underline">
                Browse All Tools →
              </a>
              <a href="/tools/compound-interest-calculator" className="btn-ghost px-[32px] py-[12px] text-[15px] max-md:w-full no-underline">
                Try Calculator
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
