'use client';

import { useRef, useEffect, useState } from 'react';
import { Lock, Shield, Zap } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';

/* ============================================
   ANIMATED COUNTER COMPONENT
   ============================================ */
function AnimatedCounter({
    end,
    suffix = '',
    prefix = '',
    duration = 1000,
    decimals = 1,
    color,
}: {
    end: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    decimals?: number;
    color: string;
}) {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const start = performance.now();
                    const animate = (now: number) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setValue(eased * end);
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [end, duration]);

    return (
        <span ref={ref} className="font-ubuntu font-[500] leading-[1.1] text-[36px] max-[640px]:text-[22px] max-[640px]:text-right max-[640px]:shrink-0" style={{ color }}>
            {prefix}
            {value.toFixed(decimals)}
            {suffix}
        </span>
    );
}

/* ============================================
   SVG UNDERLINE COMPONENT
   ============================================ */
function CurvedUnderline() {
    return (
        <svg
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            style={{
                position: 'absolute',
                bottom: -6,
                left: 0,
                width: '100%',
                height: 12,
                overflow: 'visible',
            }}
            aria-hidden="true"
        >
            <path
                d="M 2 8 Q 50 2, 100 6 T 198 6"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="250"
                strokeDashoffset="250"
                style={{
                    animation: 'drawUnderline 0.8s ease-out 0.5s forwards',
                }}
            />
            <style>{`
                @keyframes drawUnderline {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </svg>
    );
}

/* ============================================
   HERO SECTION
   ============================================ */
export default function HeroSection() {
    return (
        <section className="hero-section section-wrapper">
            {/* Hero Header Structure */}
            <div className="section-header w-[100%] flex flex-col">
                {/* Badge (Eyebrow equivalent) */}
                <div
                    className="animate-fade-up delay-1 mb-[24px] self-center max-md:self-start"
                >
                    <div
                        className="inline-flex items-center gap-[8px] bg-[var(--accent-bg)] border-[1px] border-[var(--accent-border)] rounded-[100px] py-[5px] px-[14px]"
                    >
                        <span
                            className="pulse-dot w-[6px] h-[6px] rounded-[50%] bg-[var(--accent)] inline-block shrink-0"
                        />
                        <span
                            className="font-sans text-[11px] font-[500] tracking-[1.5px] uppercase text-[var(--accent)] whitespace-nowrap"
                        >
                            8 Free Professional Tools
                        </span>
                    </div>
                </div>

                {/* Main headline */}
                <h1 className="animate-fade-up delay-2 font-sans font-[400] tracking-[-2px] max-sm:tracking-[0px] leading-[1.05] text-[var(--text-primary)] m-[0_auto_20px] max-w-[820px] text-center text-[clamp(56px,7vw,85px)] max-md:text-left max-md:ml-[0] max-md:text-[52px] max-sm:text-[32px]">
                    The smartest way to
                    <br />
                    <span style={{ position: 'relative', display: 'inline-block', color : 'var(--accent)' }}>
                        understand
                        <CurvedUnderline />
                    </span>{' '}
                    
                    your money.
                </h1>

                {/* Subheadline */}
                <p className="animate-fade-up delay-3 font-sans text-[18px] max-sm:text-[15px] font-[400] text-[var(--text-muted)] leading-[1.7] max-sm:leading-[1.65] mb-[28px] text-center max-md:text-left max-md:max-w-[100%]">
                    Free finance calculators built for investors who want precision, not guesswork.
                    No accounts. No data stored. Always free.
                </p>
            </div>

            {/* CTA Row */}
            <div className="animate-fade-up delay-4 flex gap-[10px] mb-[28px] flex-wrap justify-center max-md:justify-start max-sm:flex-col max-sm:w-[100%]">
                <a
                  href="/tools"
                  onClick={() => trackCTAClick({
                    cta_label: 'Explore All Tools',
                    cta_location: 'hero',
                    href: '/tools',
                  })}
                    className="btn-primary py-[12px] px-[28px] text-[15px] no-underline max-sm:w-[100%] max-sm:justify-center max-sm:h-[50px] max-sm:text-center"
                >
                    Explore All Tools →
                </a>
     
                <a
                    href="#features"
                    className="btn-ghost py-[12px] px-[28px] text-[15px] no-underline max-sm:w-[100%] max-sm:justify-center max-sm:h-[50px] max-sm:text-center"
                >
                    How it works
                </a>
            </div>

            {/* Trust Row — no dividers, uses gap only */}
            <div className="animate-fade-up delay-5 flex items-center justify-center max-md:justify-start flex-wrap gap-[12px_20px] mb-[0]">
                {[
                    { icon: <Lock size={14} />, text: 'No Accounts' },
                    { icon: <Shield size={14} />, text: 'No Data Stored' },
                    { icon: <Zap size={14} />, text: '100% Client-Side' },
                ].map((item, i) => (
                    <span key={i} className="flex items-center gap-[6px] whitespace-nowrap">
                        <span className="text-[var(--accent)] flex shrink-0">
                            {item.icon}
                        </span>
                        <span
                            className="font-sans text-[13px] text-[var(--text-muted)]"
                        >
                            {item.text}
                        </span>
                    </span>
                ))}
            </div>

            {/* Stats Strip */}
            <div className="animate-fade-up delay-6 flex gap-[16px] mt-[48px] justify-center max-w-[860px] w-[100%] max-md:mt-[32px] max-sm:flex-col max-sm:gap-[10px] max-sm:max-w-[100%]">
                {[
                    {
                        label: 'S&P 500 CAGR (10Y)',
                        value: 14,
                        suffix: '%',
                        color: 'var(--positive)',
                        decimals: 1,
                    },
                    {
                        label: 'US Inflation Rate',
                        value: 3.2,
                        suffix: '%',
                        color: 'var(--negative)',
                        decimals: 1,
                    },
                    {
                        label: 'Tools Available',
                        value: 8,
                        suffix: '+',
                        color: 'var(--accent)',
                        decimals: 0,
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="card flex flex-col gap-[6px] flex-[1] p-[24px_32px] text-center max-sm:p-[14px_16px] max-sm:flex-row max-sm:items-center max-sm:justify-between max-sm:gap-[12px]"
                    >
                        <span
                            className="font-ubuntu text-[10px] max-sm:text-[11px] font-[500] tracking-[1.5px] uppercase text-[var(--text-faint)] max-sm:text-left max-sm:flex-[1] max-sm:whitespace-nowrap"
                        >
                            {stat.label}
                        </span>
                        <AnimatedCounter
                            end={stat.value}
                            suffix={stat.suffix}
                            color={stat.color}
                            decimals={stat.decimals}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
