'use client';

import { motion } from 'framer-motion';

const countries = [
    { flag: '🇺🇸', name: 'United States' },
    { flag: '🇩🇪', name: 'Germany' },
    { flag: '🇬🇧', name: 'United Kingdom' },
    { flag: '🇮🇳', name: 'India' },
    { flag: '🇫🇷', name: 'France' },
];

export default function SocialProofBar() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-[100%] bg-[var(--bg-subtle)] border-y-[1px] border-y-[var(--border)] mt-[0] p-[16px_48px] max-md:p-[14px_20px] max-md:flex max-md:flex-col max-md:align-center max-md:text-center max-md:gap-[6px]"
        >
            {/* Desktop layout */}
            <div
                className="max-w-[1100px] m-[0_auto] flex items-center justify-between gap-[12px] max-md:hidden"
            >
                <span
                    className="font-sans text-[10px] font-[500] tracking-[1.5px] uppercase text-[var(--text-faint)] whitespace-nowrap shrink-0"
                >
                    Used by investors in
                </span>
                <span
                    className="font-sans text-[13px] text-[var(--text-muted)] whitespace-nowrap"
                >
                    🇺🇸 United States · 🇩🇪 Germany · 🇬🇧 United Kingdom · 🇮🇳 India · 🇫🇷 France
                </span>
            </div>

            {/* Mobile layout — stacked, centered, flags in a wrap row */}
            <div
                className="max-w-[1100px] m-[0_auto] hidden flex-col items-center gap-[10px] text-center max-md:flex"
            >
                <span
                    className="font-sans text-[10px] font-[500] tracking-[1.5px] uppercase text-[var(--text-faint)]"
                >
                    Used by investors in
                </span>
                {/* Country chips */}
                <div
                    className="flex flex-wrap justify-center gap-[6px]"
                >
                    {countries.map((c) => (
                        <span
                            key={c.name}
                            className="inline-flex items-center gap-[5px] bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[100px] p-[3px_10px] font-sans text-[12px] text-[var(--text-muted)] whitespace-nowrap"
                        >
                            {c.flag} {c.name}
                        </span>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}