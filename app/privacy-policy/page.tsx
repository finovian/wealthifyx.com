import type { Metadata } from 'next';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — WealthifyX Finance Calculators',
  description:
    'WealthifyX never stores your financial data. All calculations run locally in your browser. Read our full privacy policy.',
  alternates: {
    canonical: 'https://wealthifyx.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy — WealthifyX',
    description: 'WealthifyX never stores your financial data. All calculations are 100% client-side.',
    url: 'https://wealthifyx.com/privacy-policy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  const lastUpdated = 'March 11, 2026';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wealthifyx.com' },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://wealthifyx.com/privacy-policy' },
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
              Privacy Policy
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

              {/* Privacy-first banner */}
              <div className="flex gap-[16px] p-[24px] bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-2xl">
                <Shield size={22} className="text-[var(--accent)] shrink-0 mt-[2px]" />
                <div className="flex flex-col gap-[8px]">
                  <h2 className="font-ubuntu text-[15px] font-[700] text-[var(--text-primary)] uppercase tracking-[1px] m-0">
                    Privacy by Design
                  </h2>
                  <p className="font-sans text-[15px] text-[var(--text-primary)] m-0 leading-[1.65]">
                    When you use our calculators, the numbers stay on your device. Nothing you enter
                    is transmitted to our servers. Close the tab and it&apos;s gone — because we never had it.
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="font-sans text-[15px] md:text-[16px] text-[var(--text-muted)] leading-[1.8] flex flex-col gap-[32px]">

                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                    1. Our Privacy-First Commitment
                  </h2>
                  <p className="m-0">
                    WealthifyX was built on the principle that your financial data is your business.
                    We do not require you to create an account, provide an email, or link any financial
                    accounts to use our tools. You can run every calculator on this site anonymously.
                  </p>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                    2. Calculator Data (Client-Side Only)
                  </h2>
                  <p className="m-0">
                    All calculator math runs locally in your browser via JavaScript.{' '}
                    <strong className="text-[var(--text-primary)] font-[600]">
                      No financial data entered into our calculators is ever transmitted to or stored
                      on our servers.
                    </strong>{' '}
                    When you close your browser tab, that data is cleared from your device&apos;s memory.
                    We have no database of user financial inputs.
                  </p>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                    3. What We Do Collect
                  </h2>
                  <p className="m-0">
                    While we don&apos;t collect your financial data, we do collect limited technical information:
                  </p>
                  <div className="flex flex-col gap-[12px] mt-[4px]">
                    {[
                      {
                        label: 'Analytics',
                        desc: 'We use Google Analytics (GA4) to understand which tools are popular and how users navigate the site. This data is anonymized — we cannot identify individual users from it.',
                      },
                      {
                        label: 'Cookies',
                        desc: 'We use a minimal cookie to remember your theme preference (Light/Dark mode). No advertising cookies, no tracking pixels.',
                      },
                      {
                        label: 'Email (optional)',
                        desc: 'If you subscribe to our newsletter, we store your email address solely to send you tool updates. You can unsubscribe at any time. We never sell or share email lists.',
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex gap-[12px] p-[16px] bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl">
                        <div>
                          <span className="font-[600] text-[var(--text-primary)]">{item.label}: </span>
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                    4. Third-Party Links
                  </h2>
                  <p className="m-0">
                    WealthifyX contains links to third-party websites including brokers and financial
                    service providers. We are not responsible for the privacy practices of those sites.
                    We encourage you to review their privacy policies before sharing any personal information.
                  </p>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-sans text-[20px] font-[600] text-[var(--text-primary)] m-0">
                    5. Changes to This Policy
                  </h2>
                  <p className="m-0">
                    We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the
                    top of this page will reflect any changes. Continued use of WealthifyX after changes
                    are posted constitutes your acceptance of the updated policy.
                  </p>
                </div>

              </div>

              {/* Contact note */}
              <div className="p-[20px] bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl">
                <p className="font-sans text-[14px] text-[var(--text-muted)] m-0">
                  Questions about our privacy practices? Email us at{' '}
                  <a href="mailto:privacy@wealthifyx.com" className="text-[var(--accent)] font-[500] no-underline hover:underline">
                    privacy@wealthifyx.com
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
