import type { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer — WealthifyX Finance Calculators',
  description:
    'WealthifyX calculators are for educational purposes only. Read our full financial and investment disclaimer before using our tools.',
  alternates: {
    canonical: 'https://wealthifyx.com/disclaimer',
  },
  openGraph: {
    title: 'Disclaimer — WealthifyX',
    description: 'Financial and investment disclaimer for WealthifyX calculators and tools.',
    url: 'https://wealthifyx.com/disclaimer',
    type: 'website',
  },
};

export default function DisclaimerPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wealthifyx.com' },
      { '@type': 'ListItem', position: 2, name: 'Disclaimer', item: 'https://wealthifyx.com/disclaimer' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="min-h-screen">

        {/* ── Hero ── */}
        <section className="bg-[var(--bg-subtle)] border-b border-[var(--border)] p-[90px_48px_60px] md:max-lg:p-[80px_32px_48px] max-md:p-[72px_20px_40px]">
          <div className="max-w-[1100px] m-[0_auto]">
            <span className="section-eyebrow block mb-[16px]">{'// LEGAL'}</span>
            <h1 className="font-sans font-[400] tracking-[-2px] leading-[1.05] text-[var(--text-primary)] m-[0_0_24px_0] text-[clamp(40px,6vw,64px)] max-md:text-[36px] max-md:tracking-[-1px]">
              Legal Disclaimer
            </h1>
            <p className="font-sans text-[14px] text-[var(--text-faint)] m-0">
              Please read this information carefully before using WealthifyX tools.
            </p>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-base)]">
          <div className="max-w-[1100px] m-[0_auto]">
            <div className="max-w-[800px] flex flex-col gap-[40px]">

              {/* Not financial advice banner */}
              <div className="flex gap-[16px] p-[24px] bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-2xl">
                <AlertTriangle size={22} className="text-[var(--accent)] shrink-0 mt-[2px]" />
                <div className="flex flex-col gap-[8px]">
                  <h2 className="font-ubuntu text-[15px] font-[700] text-[var(--text-primary)] uppercase tracking-[1px] m-0">
                    Not Financial Advice
                  </h2>
                  <p className="font-sans text-[15px] text-[var(--text-primary)] m-0 leading-[1.65]">
                    WealthifyX is an educational resource. We do not provide personalized financial,
                    investment, legal, or tax advice. Our calculators are designed to help you model
                    scenarios — not to tell you what to do with your money.
                  </p>
                </div>
              </div>

              {/* Body content */}
              <div className="font-sans text-[15px] md:text-[16px] text-[var(--text-muted)] leading-[1.8] flex flex-col gap-[32px]">

                <div className="flex flex-col gap-[12px]">
                  <h3 className="font-sans text-[18px] font-[600] text-[var(--text-primary)] m-0">
                    Investment Risk
                  </h3>
                  <p className="m-0">
                    Investing involves risk, including the possible loss of principal. Past performance
                    is not indicative of future results. Any projections provided by our tools are
                    hypothetical and do not reflect actual investment results. Market conditions,
                    taxes, fees, and inflation will all affect real-world outcomes.
                  </p>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h3 className="font-sans text-[18px] font-[600] text-[var(--text-primary)] m-0">
                    No Fiduciary Relationship
                  </h3>
                  <p className="m-0">
                    Your use of WealthifyX does not create a fiduciary or advisor-client relationship
                    between you and WealthifyX. All information is provided on an &quot;as-is&quot; basis without
                    warranty of any kind, express or implied.
                  </p>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h3 className="font-sans text-[18px] font-[600] text-[var(--text-primary)] m-0">
                    Affiliate Disclosure
                  </h3>
                  <p className="m-0">
                    Some links on this website are affiliate links. If you click a link and open an
                    account or purchase a product, WealthifyX may receive an affiliate commission at
                    no additional cost to you. This is how we keep our tools free. We only recommend
                    services we believe provide genuine value.
                  </p>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h3 className="font-sans text-[18px] font-[600] text-[var(--text-primary)] m-0">
                    Calculator Accuracy
                  </h3>
                  <p className="m-0">
                    While we use industry-standard financial formulas and full floating-point precision,
                    our calculators produce projections — not guarantees. Real investment returns vary
                    based on market conditions, fees, taxes, timing, and other factors our tools do not
                    model.
                  </p>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h3 className="font-sans text-[18px] font-[600] text-[var(--text-primary)] m-0">
                    Seek Professional Advice
                  </h3>
                  <p className="m-0">
                    We strongly recommend consulting a qualified financial advisor, tax professional,
                    or legal counsel before making any significant financial decision or implementing
                    any investment strategy modeled on this website.
                  </p>
                </div>

              </div>

              {/* Contact note */}
              <div className="p-[20px] bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl">
                <p className="font-sans text-[14px] text-[var(--text-muted)] m-0">
                  Questions about this disclaimer? Email us at{' '}
                  <a href="mailto:legal@wealthifyx.com" className="text-[var(--accent)] font-[500] no-underline hover:underline">
                    legal@wealthifyx.com
                  </a>
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}