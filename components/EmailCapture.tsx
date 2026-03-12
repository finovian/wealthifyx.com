'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { trackEmailSignup } from '@/lib/analytics';

export default function EmailCapture() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.includes('@')) {
            setSubmitted(true);
            trackEmailSignup({ location: 'homepage_email_capture' });
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="section-wrapper flex justify-center"
        >
            <div className="w-[100%] max-w-[1100px]">
                <div className="bg-[var(--accent-bg)] border-[1px] border-[var(--accent-border)] rounded-[16px] max-[639px]:rounded-[14px] p-[44px_40px] max-[639px]:p-[28px_20px] xl:p-[52px_48px] text-center flex flex-col items-center">
                    {/* Header Structure */}
                    <div className="section-header flex flex-col items-center mb-[24px] text-center">
                        <span className="section-eyebrow text-center">
                            {'// STAY UPDATED'}
                        </span>
                        <h2 className="section-heading text-center max-[639px]:text-[22px] max-[639px]:max-w-[100%] xl:text-[32px]">
                            Get notified when new tools drop.
                        </h2>
                        <p className="section-subtext text-center max-[639px]:text-[14px]">
                            Monthly tool updates, finance insights, no spam.
                        </p>
                    </div>

                    {/* Form or success state */}
                    {!submitted ? (
                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <div className="flex w-[100%] items-center justify-center gap-[10px] max-[639px]:flex-col max-[639px]:gap-[8px]">
                                {/* EXPLICIT input — not textarea, not input-field class */}
                                <input
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex-[1_1_0] min-w-[0] max-w-[360px] max-[639px]:max-w-none max-[639px]:w-[100%] max-[639px]:flex-none h-[48px] px-[16px] bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[8px] font-ubuntu text-[16px] text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-[0.15s] ease-[ease] block resize-none overflow-hidden whitespace-nowrap placeholder:text-[var(--text-faint)] placeholder:font-ubuntu focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-bg)]"
                                />
                                <button
                                    type="submit"
                                    className="btn-primary shrink-0 h-[48px] px-[22px] text-[14px] whitespace-nowrap max-[639px]:w-[100%] max-[639px]:h-[50px] max-[639px]:text-[15px]"
                                >
                                    Subscribe →
                                </button>
                            </div>
                            <p className="font-sans text-[12px] text-[var(--text-faint)] m-[12px_0_0_0] text-center">
                                No spam. Unsubscribe anytime.
                            </p>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-center gap-[8px] py-[16px]"
                        >
                            <span className="w-[8px] h-[8px] rounded-[50%] bg-[var(--accent)] shrink-0" />
                            <span className="font-sans text-[15px] font-[500] text-[var(--accent)]">
                                You&apos;re in! We&apos;ll keep you updated.
                            </span>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.section>
    );
}
