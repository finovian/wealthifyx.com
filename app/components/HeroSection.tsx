'use client';

import { useRef, useEffect, useState } from 'react';
import { Lock, Shield, Zap } from 'lucide-react';

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
        <span ref={ref} className="stat-value">
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
            <style jsx global>{`
                /* ── Hero headline responsive ── */
                .hero-headline {
                    font-family: "DM Sans", sans-serif;
                    font-weight: 400;
                    letter-spacing: -2px;
                    line-height: 1.05;
                    color: var(--text-primary);
                    margin: 0 auto 20px;
                    max-width: 820px;
                    text-align: center;
                }

                @media (max-width: 320px) {
                    .hero-headline { font-size: 32px; letter-spacing: 0px; }
                }
                @media (min-width: 321px) and (max-width: 480px) {
                    .hero-headline { font-size: 32px; letter-spacing: 0px; }
                }
                @media (min-width: 481px) and (max-width: 767px) {
                    .hero-headline { font-size: 52px; }
                }
                @media (min-width: 768px) {
                    .hero-headline { font-size: clamp(56px, 7vw, 85px); }
                }

                /* ── Stats strip ── */
                .hero-stats-strip {
                    display: flex;
                    gap: 16px;
                    margin-top: 48px;
                    justify-content: center;
                    max-width: 860px;
                    width: 100%;
                }

                /* Mobile: label left, value right in a row */
                @media (max-width: 640px) {
                    .hero-stats-strip {
                        flex-direction: column !important;
                        gap: 10px !important;
                        max-width: 100% !important;
                    }
                    .stat-card {
                        padding: 14px 16px !important;
                        flex-direction: row !important;
                        align-items: center !important;
                        justify-content: space-between !important;
                        gap: 12px !important;
                    }
                    .stat-label {
                        font-size: 11px !important;
                        text-align: left !important;
                        flex: 1 !important;
                        white-space: nowrap !important;
                    }
                    .stat-value {
                        font-size: 22px !important;
                        text-align: right !important;
                        flex-shrink: 0 !important;
                    }
                }

                /* Tablet+ stats */
                @media (min-width: 641px) {
                    .stat-card {
                        flex: 1 !important;
                        flex-direction: column !important;
                        padding: 24px 32px !important;
                        text-align: center !important;
                    }
                    .stat-value {
                        font-size: 36px !important;
                    }
                }

                /* ── Stat value base style ── */
                .stat-value {
                    font-family:  '"Ubuntu", "sans-serif"',
                    font-weight: 500;
                    line-height: 1.1;
                }

                /* ── CTA row ── */
                .hero-cta-row {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 28px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                @media (max-width: 480px) {
                    .hero-cta-row {
                        flex-direction: column !important;
                        width: 100% !important;
                        gap: 10px !important;
                    }
                    .hero-cta-row a {
                        width: 100% !important;
                        justify-content: center !important;
                        height: 50px !important;
                        font-size: 15px !important;
                        text-align: center !important;
                    }
                }

                /* ── Trust row ── */
                .hero-trust-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 12px 20px;
                    margin-bottom: 0;
                }

                /* No dividers — use gap only so no orphaned lines on mobile */
                .trust-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    white-space: nowrap;
                }

                /* ── Hero section mobile padding ── */
                @media (max-width: 767px) {
                    .hero-section {
                        padding-top: 72px !important;
                        padding-bottom: 40px !important;
                        padding-left: 20px !important;
                        padding-right: 20px !important;
                        align-items: flex-start !important;
                        text-align: left !important;
                    }
                    .hero-headline {
                        text-align: left !important;
                        margin-left: 0 !important;
                    }
                    .hero-subheadline {
                        text-align: left !important;
                        max-width: 100% !important;
                    }
                    .hero-badge {
                        align-self: flex-start !important;
                    }
                    .hero-cta-row {
                        justify-content: flex-start !important;
                    }
                    .hero-trust-row {
                        justify-content: flex-start !important;
                    }
                    .hero-stats-strip {
                        margin-top: 32px !important;
                    }
                }

                /* ── Subheadline ── */
                .hero-subheadline {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 18px;
                    font-weight: 400;
                    color: var(--text-muted);
                    line-height: 1.7;
                    /* max-width: 500px; */
                    margin-bottom: 28px;
                    text-align: center;
                }

                @media (max-width: 480px) {
                    .hero-subheadline {
                        font-size: 15px !important;
                        line-height: 1.65 !important;
                    }
                }
            `}</style>

            {/* Hero Header Structure */}
            <div className="section-header hero-header" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Badge (Eyebrow equivalent) */}
                <div
                    className="animate-fade-up delay-1 hero-badge"
                    style={{ marginBottom: 24, alignSelf: 'center' }}
                >
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'var(--accent-bg)',
                            border: '1px solid var(--accent-border)',
                            borderRadius: 100,
                            padding: '5px 14px',
                        }}
                    >
                        <span
                            className="pulse-dot"
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: 'var(--accent)',
                                display: 'inline-block',
                                flexShrink: 0,
                            }}
                        />
                        <span
                            style={{
                                fontFamily: `"DM Sans", "sans-serif"`,
                                fontSize: 11,
                                fontWeight: 500,
                                letterSpacing: 1.5,
                                textTransform: 'uppercase',
                                color: 'var(--accent)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            8 Free Professional Tools
                        </span>
                    </div>
                </div>

                {/* Main headline */}
                <h1 className="animate-fade-up delay-2 hero-headline">
                    The smartest way to
                    <br />
                    <span style={{ position: 'relative', display: 'inline-block', color : 'var(--accent)' }}>
                        understand
                        <CurvedUnderline />
                    </span>{' '}
                    
                    your money.
                </h1>

                {/* Subheadline */}
                <p className="animate-fade-up delay-3 hero-subheadline">
                    Free finance calculators built for investors who want precision, not guesswork.
                    No accounts. No data stored. Always free.
                </p>
            </div>

            {/* CTA Row */}
            <div className="animate-fade-up delay-4 hero-cta-row">
                <a
                    href="#tools"
                    className="btn-primary"
                    style={{ padding: '12px 28px', fontSize: 15, textDecoration: 'none' }}
                >
                    Explore All Tools →
                </a>
                <a
                    href="#features"
                    className="btn-ghost"
                    style={{ padding: '12px 28px', fontSize: 15, textDecoration: 'none' }}
                >
                    How it works
                </a>
            </div>

            {/* Trust Row — no dividers, uses gap only */}
            <div className="animate-fade-up delay-5 hero-trust-row">
                {[
                    { icon: <Lock size={14} />, text: 'No Accounts' },
                    { icon: <Shield size={14} />, text: 'No Data Stored' },
                    { icon: <Zap size={14} />, text: '100% Client-Side' },
                ].map((item, i) => (
                    <span key={i} className="trust-item">
                        <span style={{ color: 'var(--accent)', display: 'flex', flexShrink: 0 }}>
                            {item.icon}
                        </span>
                        <span
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 13,
                                color: 'var(--text-muted)',
                            }}
                        >
                            {item.text}
                        </span>
                    </span>
                ))}
            </div>

            {/* Stats Strip */}
            <div className="animate-fade-up delay-6 hero-stats-strip">
                {[
                    {
                        label: 'S&P 500 CAGR (10Y)',
                        value: 10.7,
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
                        className="card stat-card"
                        style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
                    >
                        <span
                            className="stat-label"
                            style={{
                                fontFamily: '"Ubuntu", "sans-serif"',
                                fontSize: 10,
                                fontWeight: 500,
                                letterSpacing: 1.5,
                                textTransform: 'uppercase',
                                color: 'var(--text-faint)',
                            }}
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