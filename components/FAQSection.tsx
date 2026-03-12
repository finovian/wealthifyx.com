'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    q: string;
    a: string;
}

interface FAQSectionProps {
    faqs?: FAQItem[];
    eyebrow?: string;
    heading?: string;
    background?: 'base' | 'subtle';
    id?: string;
}

const defaultFaqs = [
    {
        q: 'Are these calculators really free?',
        a: 'Yes. Always. WealthifyX is funded by contextual advertising and affiliate partnerships — never by charging users.',
    },
    {
        q: 'How accurate are the calculations?',
        a: 'All formulas follow standard financial mathematics. We avoid intermediate rounding that causes drift in simpler calculators.',
    },
    {
        q: 'Do you store my financial data?',
        a: 'No. Every calculation runs entirely in your browser using JavaScript. Nothing is sent to any server. We have no user database.',
    },
    {
        q: 'How often are new tools added?',
        a: 'We ship 1–2 new tools monthly. Subscribe to the email list to get notified immediately.',
    },
    {
        q: 'Does this work on mobile?',
        a: 'Yes. Every tool is fully responsive and tested on real mobile devices at multiple screen sizes.',
    },
];

export default function FAQSection({
    faqs = defaultFaqs,
    eyebrow = '// FAQ',
    heading = 'Common questions.',
    background = 'base',
    id = 'faq'
}: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={`section-wrapper flex justify-center ${
                background === 'subtle' ? 'bg-[var(--bg-subtle)] border-y border-[var(--border)]' : 'bg-[var(--bg-base)]'
            }`}
        >
            <div className="w-[100%] max-w-[1100px]">
                {/* Section header */}
                <div className="section-header mb-[48px] max-md:mb-[32px]">
                    <span className="section-eyebrow">{eyebrow}</span>
                    <h2 className="section-heading mt-[8px] text-[clamp(28px,5vw,40px)]">{heading}</h2>
                </div>

                {/* Accordion */}
                <div className="border-t-[1px] border-t-[var(--border)]">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="border-b-[1px] border-b-[var(--border)] transition-[background] duration-[0.15s] ease-[ease]"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="group w-[100%] flex justify-between items-center gap-[16px] max-md:gap-[12px] p-[18px_0] max-md:p-[16px_0] xl:p-[20px_0] bg-transparent border-none cursor-pointer text-left min-h-[56px] max-md:min-h-[52px]"
                                    aria-expanded={isOpen}
                                >
                                    <span className="font-sans font-[500] text-[var(--text-primary)] text-[15px] max-md:text-[14px] xl:text-[16px] leading-[1.4] flex-[1] min-w-[0] group-hover:text-[var(--accent)] transition-colors duration-[0.15s]">
                                        {faq.q}
                                    </span>
                                    <span
                                        className={`shrink-0 flex items-center justify-center w-[32px] h-[32px] max-md:w-[28px] max-md:h-[28px] rounded-[6px] border-[1px] transition-[transform,color,background-color,border-color] duration-[0.2s] ease-[ease] ${
                                            isOpen
                                                ? 'text-[var(--accent)] bg-[var(--accent-bg)] border-[var(--accent-border)] rotate-[180deg]'
                                                : 'text-[var(--text-muted)] bg-[var(--bg-subtle)] border-[var(--border)]'
                                        }`}
                                    >
                                        <ChevronDown size={18} />
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: 'easeOut' }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <p className="font-sans text-[var(--text-muted)] text-[14px] max-md:text-[13px] xl:text-[15px] leading-[1.7] max-md:leading-[1.65] p-[0_48px_18px_0] max-md:pr-[40px] max-md:pb-[14px] xl:pb-[20px] m-[0]">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}
