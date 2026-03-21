'use client';

const calculatorLinks = [
  { name: 'Compound Interest', href: '/tools/compound-interest-calculator' },
  { name: 'Investment Calculator', href: '/tools/investment-calculator' },
  { name: 'Roth IRA Calculator', href: '/tools/roth-ira-calculator' },
  { name: '401k Calculator', href: '/tools/401k-calculator' },
  { name: 'Savings Goal', href: '/tools/savings-goal-calculator' },
  { name: 'Options Profit Calculator', href: '/tools/options-profit-calculator' },
  { name: 'Capital Gains Tax', href: '/tools/capital-gains-calculator' },
  { name: 'Dividend Calculator', href: '/tools/dividend-calculator' },
];

const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Methodology', href: '/methodology' },
    { name: 'Contact', href: '/contact' },
];

const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Disclaimer', href: '/disclaimer' },
];

function FooterColumn({
    heading,
    links,
    isFirst = false,
}: {
    heading: string;
    links: { name: string; href: string }[];
    isFirst?: boolean;
}) {
    return (
        <div className={`flex flex-col ${isFirst ? 'max-md:col-[1/-1]' : ''}`}>
            <h4 className="font-sans text-[10px] font-[500] tracking-[1.5px] uppercase text-[var(--text-faint)] m-[0_0_14px_0] max-md:text-[9px] max-md:mb-[10px]">
                {heading}
            </h4>
            <div className={`flex flex-col ${isFirst ? 'max-md:grid max-md:grid-cols-[1fr_1fr] max-md:gap-[0_12px]' : ''}`}>
                {links.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className="font-sans text-[13px] text-[var(--text-muted)] no-underline leading-[2.1] py-[2px] px-[0] transition-colors duration-[0.15s] ease-[ease] whitespace-nowrap hover:text-[var(--accent)] max-md:text-[12px] max-md:leading-[2]"
                    >
                        {link.name}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default function Footer() {
    return (
        <footer className="w-[100%] bg-[var(--bg-subtle)] border-t-[1px] border-t-[var(--border)] p-[56px_48px_28px] max-md:p-[36px_20px_24px] md:max-lg:p-[44px_32px_24px] xl:p-[64px_48px_32px]">
            <div className="max-w-[1100px] mx-auto">

                {/* ── Top: brand + link columns ── */}
                <div className="grid grid-cols-[1.4fr_2fr] gap-[48px] mb-[40px] max-md:grid-cols-[1fr] max-md:gap-[28px] max-md:mb-[28px] md:max-lg:grid-cols-[1fr_2fr] md:max-lg:gap-[32px] xl:gap-[64px]">

                    {/* Brand */}
                    <div className="flex flex-col gap-[0]">
                        <div className="inline-flex items-center mb-[12px]">
                            <span className="font-ubuntu text-[18px] font-[400] text-[var(--text-primary)] tracking-[-0.3px]">WealthifyX</span>
                            <span className="w-[5px] h-[5px] rounded-[50%] bg-[var(--accent)] ml-[2px] mb-[-3px] inline-block shrink-0" />
                        </div>
                        <p className="font-sans text-[13px] text-[var(--text-muted)] leading-[1.6] m-[0] max-w-[220px] max-md:max-w-[100%] md:max-lg:max-w-[180px]">
                            Free precision finance tools for modern investors.
                        </p>
                    </div>

                    {/* Link columns — wrapped in a div for mobile 2-col grid */}
                    <div className="grid grid-cols-[2fr_1fr_1fr] gap-[32px] max-md:grid-cols-[1fr_1fr] max-md:gap-[24px_16px] md:max-lg:grid-cols-[2fr_1fr_1fr] md:max-lg:gap-[20px] xl:gap-[40px]">
                        <FooterColumn heading="Calculators" links={calculatorLinks} isFirst={true} />
                        <FooterColumn heading="Company" links={companyLinks} />
                        <FooterColumn heading="Legal" links={legalLinks} />
                    </div>
                </div>

                {/* ── Bottom: copyright + badges ── */}
                <div className="pt-[24px] border-t-[1px] border-t-[var(--border)] flex justify-between items-center flex-wrap gap-[10px] max-md:flex-col max-md:items-start max-md:gap-[8px]">
                    <span className="font-sans text-[11px] text-[var(--text-faint)] whitespace-nowrap max-md:text-[10px]">
                        © {new Date().getFullYear()} WEALTHIFYX. ALL RIGHTS RESERVED.
                    </span>
                    <div className="flex items-center gap-[10px] max-md:gap-[8px]">
                        <span className="font-sans text-[11px] text-[var(--text-faint)] whitespace-nowrap max-md:text-[10px]">🔒 Privacy by Design</span>
                        <span className="font-sans text-[11px] text-[var(--text-faint)]">·</span>
                        <span className="font-sans text-[11px] text-[var(--text-faint)] whitespace-nowrap max-md:text-[10px]">⚡ No Data Persistence</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
