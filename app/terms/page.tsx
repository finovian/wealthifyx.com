import type { Metadata } from 'next';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — WealthifyX Finance Calculators',
  description:
    'Read the terms and conditions for using WealthifyX finance calculators and tools. Free to use, educational purposes only.',
  alternates: {
    canonical: 'https://wealthifyx.com/terms',
  },
  openGraph: {
    title: 'Terms of Service — WealthifyX',
    description: 'Terms and conditions for using WealthifyX finance calculators.',
    url: 'https://wealthifyx.com/terms',
    type: 'website',
  },
};

export default function TermsPage() {
  const lastUpdated = 'March 11, 2026';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wealthifyx.com' },
      { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: 'https://wealthifyx.com/terms' },
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
              Terms of Service
            </h1>
            <p className="font-sans text-[14px] text-[var(--text-faint)] m-0">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="p-[80px_48px] md:max-lg:p-[64px_32px] max-md:p-[48px_20px] bg-[var(--bg-base)]">
          <div className="max-w-[1100px] m-[0_auto]">
            <div className="max-w-[800px] flex flex-col gap-[40px]">

              {/* Summary banner */}
              <div className="flex gap-[16px] p-[24px] bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-2xl">
              <FileText size={22} className="text-[var(--accent)] shrink-0 mt-[2px]" />
              <div className="flex flex-col gap-[8px]">
                <h2 className="font-ubuntu text-[15px] font-[700] text-[var(--text-primary)] uppercase tracking-[1px] m-0">
                  Plain English Summary
                </h2>
                <p className="font-sans text-[15px] text-[var(--text-primary)] m-0 leading-[1.65]">
                  WealthifyX is free to use. Our tools and AI Assistant are for educational purposes 
                  only — not financial advice. Don&apos;t misuse the site or copy our work without 
                  permission. That&apos;s the short version. The full version is below.
                </p>
              </div>
              </div>

              {/* Body */}
              <div className="font-sans text-[15px] md:text-[16px] text-[var(--text-muted)] leading-[1.8] flex flex-col gap-[32px]">

              <div className="flex flex-col gap-[12px]">
                <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                  1. Acceptance of Terms
                </h2>
                <p className="m-0">
                  By accessing and using WealthifyX (&quot;the Website&quot;), including our 
                  financial calculators and AI Assistant, you agree to be bound by these
                  Terms of Service and our Privacy Policy. If you do not agree to these terms, please
                  do not use our tools or services.
                </p>
              </div>

              <div className="flex flex-col gap-[12px]">
                <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                  2. Use of Tools and AI
                </h2>
                <p className="m-0">
                  The financial calculators and AI Assistant on this Website are for educational 
                  and informational purposes only. They are not intended to provide professional 
                  financial, investment, or tax advice. AI-generated responses should be treated 
                  as experimental guidance and should not be used as the sole basis for financial 
                  decisions.
                </p>
              </div>

              <div className="flex flex-col gap-[12px]">
                <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                  3. Accuracy of Results and AI Outputs
                </h2>
                <p className="m-0">
                  While we use industry-standard formulas and advanced AI models, WealthifyX 
                  does not guarantee the accuracy, completeness, or reliability of any 
                  calculation results or AI responses. Results are projections or model-generated 
                  guidance — not guarantees of future financial performance.
                </p>
              </div>
                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                    4. Intellectual Property
                  </h2>
                  <p className="m-0">
                    The design, branding, written content, and proprietary code of WealthifyX are
                    protected by intellectual property laws. You may not reproduce, distribute, or
                    create derivative works from this Website without our express written permission.
                    Standard financial formulas used in our calculators are in the public domain.
                  </p>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                    5. Prohibited Uses
                  </h2>
                  <p className="m-0">You agree not to use WealthifyX to:</p>
                  <div className="flex flex-col gap-[8px] mt-[4px]">
                    {[
                      'Scrape, copy, or reproduce our content or tools without permission',
                      'Attempt to reverse-engineer or interfere with the site',
                      'Use our platform to mislead others about financial projections',
                      'Violate any applicable laws or regulations',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-[12px]">
                        <span className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] shrink-0 mt-[10px]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                    6. Limitation of Liability
                  </h2>
                  <p className="m-0">
                    In no event shall WealthifyX or its owners be liable for any damages — including
                    loss of data, loss of profit, or business interruption — arising from your use of
                    or inability to use the Website or its tools. Your use of WealthifyX is entirely
                    at your own risk.
                  </p>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                    7. Changes to Terms
                  </h2>
                  <p className="m-0">
                    We reserve the right to update these Terms of Service at any time. The &quot;Last
                    updated&quot; date at the top of this page will reflect any changes. Continued use of
                    WealthifyX after changes are posted constitutes your acceptance of the revised terms.
                  </p>
                </div>

              </div>

              {/* Contact note */}
              <div className="p-[20px] bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl">
                <p className="font-sans text-[14px] text-[var(--text-muted)] m-0">
                  Questions about these terms? Email us at{' '}
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
