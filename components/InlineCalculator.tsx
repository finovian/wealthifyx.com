"use client";

import { useState, useMemo } from "react";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function InlineCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const t = parseFloat(years) || 0;
    const r = 0.08; // fixed 8% for preview
    const balance = p * Math.pow(1 + r, t);
    return {
      balance,
    };
  }, [principal, years]);

  const fmt = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <section className="section-wrapper bg-[var(--bg-base)]">
      <div className="max-w-[1100px] m-[0_auto]">
        <div className="grid grid-cols-[45fr_55fr] max-md:flex max-md:flex-col md:max-lg:grid-cols-[1fr] gap-[56px] max-md:gap-[24px] md:max-lg:gap-[32px] xl:gap-[72px] items-center">
          {/* Left: Text & Features */}
          <div className="md:max-lg:order-2 max-md:w-[100%]">
            <div className="section-header">
              <span className="section-eyebrow">{"// WHY PRECISION MATTERS"}</span>
              <h2 className="section-heading m-[8px_0_14px_0] max-md:text-[26px] max-md:tracking-[-0.5px]">
                Precision engineering for your capital.
              </h2>
              <p className="font-sans text-[15px] max-md:text-[14px] text-[var(--text-muted)] leading-[1.7] mb-[20px] max-md:mb-[14px] max-w-[380px] md:max-lg:max-w-[100%]">
                Most online calculators use simplified formulas that round numbers at every step. WealthifyX uses full-precision floating point math — the same standard used by CFAs and financial institutions.
              </p>
            </div>

            <ul className="list-none p-[0] m-[0_0_22px_0] max-md:m-[0_0_16px_0] flex flex-col gap-[10px] max-md:gap-[8px]">
              {[
                "Institutional-grade TVM formulas",
                "Continuous compounding support",
                "No intermediate rounding drift",
                "Zero data collection or storage",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-[10px] font-sans text-[14px] max-md:text-[13px] text-[var(--text-muted)] leading-[1.5]"
                >
                  <div className="shrink-0 w-[6px] h-[6px] rounded-[50%] bg-[var(--accent)]" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="/methodology"
              className="font-sans text-[14px] font-[500] text-[var(--accent)] no-underline inline-flex items-center gap-[4px] min-h-[44px] max-md:min-h-[40px] transition-opacity duration-[0.15s] ease-[ease] hover:opacity-[0.75]"
            >
              Learn about our math <ArrowRight size={14} />
            </a>
          </div>

          {/* Right: Interactive Mini-Calc */}
          <div className="w-[100%]">
            <div className="card p-[28px] max-md:p-[18px_16px] rounded-[16px] max-md:rounded-[14px] shadow-[var(--shadow-md)] md:max-lg:max-w-[520px] md:max-lg:m-[0_auto] md:max-lg:w-[100%] xl:p-[36px]">
              <div className="flex items-center justify-between mb-[24px]">
                <div className="flex items-center gap-[8px]">
                  <TrendingUp size={18} className="text-[var(--accent)]" />
                  <span className="font-sans font-[600] text-[15px] text-[var(--text-primary)]">
                    Compound Growth
                  </span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[1px] text-[var(--text-faint)]">
                  LIVE PREVIEW
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[16px] mb-[20px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="font-sans text-[12px] font-[500] text-[var(--text-muted)]">
                    Initial Principal
                  </label>
                  <div className="relative">
                    <span className="absolute left-[12px] top-[50%] -translate-y-[50%] font-ubuntu text-[13px] text-[var(--text-faint)]">$</span>
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      className="input-field !pl-[24px] !h-[42px] !min-h-[42px] !text-[14px] !py-0"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="font-sans text-[12px] font-[500] text-[var(--text-muted)]">
                    Time (Years)
                  </label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="input-field !h-[42px] !min-h-[42px] !text-[14px] !py-0"
                  />
                </div>
              </div>

              <div className="bg-[var(--bg-subtle)] border-[1px] border-[var(--border)] rounded-[12px] p-[16px_20px] mb-[20px] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-[1px] text-[var(--text-faint)]">
                    Projected Final Balance
                  </span>
                  <div className="font-mono text-[22px] font-[600] text-[var(--accent)] mt-[2px]">
                    {fmt(result.balance)}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-[9px] uppercase tracking-[1px] text-[var(--text-faint)]">
                    Rate: 8%
                  </span>
                  <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[2px]">
                    {years} yr horizon
                  </div>
                </div>
              </div>

              <a
                href="/tools/compound-interest-calculator"
                className="btn-primary w-[100%] justify-center mt-[18px] p-[13px_24px] text-[15px] max-md:text-[16px] min-h-[50px] max-md:min-h-[52px]"
              >
                Open Full Calculator →
              </a>

              {/* Mini Chart Visual */}
              <div className="mt-[24px] border-t-[1px] border-[var(--border)] pt-[20px]">
                <div className="flex items-center gap-[12px]">
                  <div className="flex-1 flex flex-col gap-[10px]">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[8px] h-[8px] rounded-[50%] bg-[var(--accent)]" />
                      <span className="font-sans text-[11px] text-[var(--text-muted)]">
                        Compound Growth
                      </span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[8px] h-[8px] rounded-[50%] bg-[var(--border-strong)]" />
                      <span className="font-sans text-[11px] text-[var(--text-muted)]">
                        Initial Capital
                      </span>
                    </div>
                  </div>
                  <div className="flex-[1.5]">
                    <div className="relative w-[100%] h-[140px] max-md:h-[120px] overflow-hidden rounded-[8px] bg-[var(--bg-muted)]/30 border-[1px] border-[var(--border)]/50">
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="w-[100%] h-[100%]"
                      >
                        <path
                          d="M 0 100 Q 40 95, 100 20 L 100 100 L 0 100 Z"
                          fill="var(--accent)"
                          fillOpacity="0.1"
                        />
                        <path
                          d="M 0 100 Q 40 95, 100 20"
                          fill="none"
                          stroke="var(--accent)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="0"
                          y1="100"
                          x2="100"
                          y2="80"
                          stroke="var(--border-strong)"
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
