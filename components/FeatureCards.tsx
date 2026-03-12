'use client';

import { motion } from 'framer-motion';
import { LineChart, ShieldCheck, Calculator } from 'lucide-react';

const features = [
    {
        icon: LineChart,
        title: 'Visual results, not just numbers',
        body: 'Every calculation renders a chart. See your growth trajectory over time, not just a final number.',
    },
    {
        icon: ShieldCheck,
        title: 'Zero data collection',
        body: 'All math happens in your browser. Nothing is sent to our servers. No accounts, no cookies, no tracking.',
    },
    {
        icon: Calculator,
        title: 'Precision-grade math',
        body: 'No rounding drift. No simplified shortcuts. The same mathematical standards used in professional financial software.',
    },
];

export default function FeatureCards() {
    return (
        <motion.section
            id="features"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="section-wrapper bg-[var(--bg-subtle)]"
        >
            <div className="max-w-[1100px] m-[0_auto]">
                <div className="section-header">
                    <span className="section-eyebrow">{'// WHY WEALTHIFYX'}</span>
                    <h2 className="section-heading">Built different.</h2>
                    <p className="section-subtext">
                        Most finance calculators were built for accountants. These were built for investors.
                    </p>
                </div>

                <div className="grid grid-cols-[repeat(3,1fr)] max-md:grid-cols-[1fr] md:max-lg:grid-cols-[repeat(2,1fr)] gap-[20px] max-md:gap-[10px] md:max-lg:gap-[16px] xl:gap-[24px] items-stretch">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.35, delay: i * 0.08, ease: 'easeOut' }}
                            className="card flex flex-col max-md:flex-row max-md:items-start max-md:gap-[14px] p-[32px_28px] max-md:p-[18px_16px] md:max-lg:p-[28px_24px] xl:p-[36px_32px] rounded-[16px] max-md:rounded-[12px] transition-[box-shadow,border-color,transform] duration-[0.2s] ease-[ease] hover:border-[var(--accent-border)] hover:shadow-[var(--shadow-md)] hover:-translate-y-[2px] max-md:hover:translate-y-[0] max-md:hover:shadow-[var(--shadow-sm)]"
                        >
                            {/* Icon container */}
                            <div className="flex items-center justify-center shrink-0 w-[48px] h-[48px] max-md:w-[38px] max-md:h-[38px] rounded-[12px] max-md:rounded-[9px] bg-[var(--accent-bg)] border-[1.5px] border-[var(--accent-border)] mb-[18px] max-md:mb-[0] max-md:mt-[2px]">
                                <feature.icon size={22} className="text-[var(--accent)] max-md:w-[18px] max-md:h-[18px]" strokeWidth={2.2} />
                            </div>

                            {/* Text content */}
                            <div className="flex flex-col">
                                <h3 className="font-sans font-[600] text-[var(--text-primary)] text-[16px] max-md:text-[14px] leading-[1.35] max-md:leading-[1.3] m-[0_0_10px_0] max-md:m-[0_0_5px_0] whitespace-normal">{feature.title}</h3>
                                <p className="font-sans text-[var(--text-muted)] text-[14px] max-md:text-[13px] leading-[1.7] max-md:leading-[1.6] m-[0]">{feature.body}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
