"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Landmark, ArrowRight, AlertTriangle, Info } from "lucide-react";
import { faqs, relatedTools } from "@/constants/401k";
import FAQSection from "../FAQSection";
import {
  trackCalculatorResult,
  trackRelatedToolClick,
  debounce,
} from "@/lib/analytics";

/* ─── IRS 2024 Limits ───────────────────────────────────── */
const LIMIT_UNDER_50 = 23000;
const LIMIT_50_PLUS = 30500;

/* ─── Types ─────────────────────────────────────────────── */
interface CalcResult {
  finalBalance: number;
  totalEmployeeContrib: number;
  totalEmployerMatch: number;
  totalGrowth: number;
  employeeAnnual: number;
  employerAnnual: number;
  totalAnnual: number;
  irsLimitHit: boolean;
  years: number;
  chartData: {
    age: string;
    employee: number;
    employer: number;
    growth: number;
    total: number;
  }[];
}

/* ─── Formula ────────────────────────────────────────────── */
// FV = B₀(1+r)^t + C_total × [((1+r)^t − 1) / r]
// Annual compounding — standard for retirement projections
// Employer match = salary × min(empPct, matchUpTo)/100 × matchPct/100
function calculate(
  salary: number,
  empContribPct: number,
  matchPct: number,
  matchUpToPct: number,
  existingBalance: number,
  rate: number,
  currentAge: number,
  retirementAge: number,
): CalcResult {
  const r = rate / 100;
  const years = retirementAge - currentAge;
  const irsLimit = currentAge >= 50 ? LIMIT_50_PLUS : LIMIT_UNDER_50;

  // Employee contribution — hard-capped at IRS limit
  const employeeRaw = salary * (empContribPct / 100);
  const employeeContrib = Math.min(employeeRaw, irsLimit);
  const irsLimitHit = employeeRaw > irsLimit;

  // Employer match: match matchPct% of salary, up to matchUpToPct% of salary
  const effectiveMatchBase = Math.min(empContribPct, matchUpToPct);
  const employerContrib = salary * (effectiveMatchBase / 100) * (matchPct / 100);

  const totalAnnual = employeeContrib + employerContrib;

  const chartData = [];
  for (let y = 0; y <= years; y++) {
    let balance: number;
    if (r === 0) {
      balance = existingBalance + totalAnnual * y;
    } else {
      const exp = Math.pow(1 + r, y);
      const balanceGrowth = existingBalance * exp;
      const contribGrowth = y > 0 ? totalAnnual * ((exp - 1) / r) : 0;
      balance = balanceGrowth + contribGrowth;
    }
    const totalContributed = existingBalance + totalAnnual * y;
    const growth = Math.max(0, balance - totalContributed);

    chartData.push({
      age: String(currentAge + y),
      employee: Math.round(existingBalance + employeeContrib * y),
      employer: Math.round(employerContrib * y),
      growth: Math.round(growth),
      total: Math.round(balance),
    });
  }

  const last = chartData[chartData.length - 1];
  return {
    finalBalance: last.total,
    totalEmployeeContrib: Math.round(employeeContrib * years),
    totalEmployerMatch: Math.round(employerContrib * years),
    totalGrowth: last.growth,
    employeeAnnual: Math.round(employeeContrib),
    employerAnnual: Math.round(employerContrib),
    totalAnnual: Math.round(totalAnnual),
    irsLimitHit,
    years,
    chartData,
  };
}

/* ─── Helpers ────────────────────────────────────────────── */
function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtK(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
  return `$${v}`;
}

/* ─── Custom Tooltip ─────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[10px] p-[12px_16px] font-sans text-[12px] shadow-[var(--shadow-md)] min-w-[180px]">
      <div className="text-[var(--text-faint)] mb-[8px] text-[11px]">Age {label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-[16px] mb-[4px]">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-[var(--text-primary)] font-[500]">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── SVG underline ──────────────────────────────────────── */
function CurvedUnderline() {
  return (
    <svg
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      className="absolute bottom-[-6px] left-[0] w-[100%] h-[12px] overflow-visible"
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
        style={{ animation: "drawUnderline 0.8s ease-out 0.5s forwards" }}
      />
      <style>{`@keyframes drawUnderline { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function FourOhOneKCalculator() {
  const [salary, setSalary] = useState("80000");
  const [empContribPct, setEmpContribPct] = useState("6");
  const [matchPct, setMatchPct] = useState("50");
  const [matchUpToPct, setMatchUpToPct] = useState("6");
  const [existingBalance, setExistingBalance] = useState("");
  const [rate, setRate] = useState("7");
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("65");

  /* ─── Derived ── */
  const irsLimit = useMemo(() => {
    const age = parseInt(currentAge);
    return !isNaN(age) && age >= 50 ? LIMIT_50_PLUS : LIMIT_UNDER_50;
  }, [currentAge]);

  /* ─── GA4 tracking ── */
  const debouncedTrack = useMemo(
    () =>
      debounce(
        (finalBalance: number, years: number, rate: number) => {
          trackCalculatorResult({
            calculator_name: "401k",
            final_balance: Math.round(finalBalance),
            years,
            rate,
            has_contributions: true,
          });
        },
        1500,
      ),
    [],
  );

  /* ─── Validation ── */
  const validationError = useMemo((): string | null => {
    const ca = parseInt(currentAge);
    const ra = parseInt(retirementAge);
    const s = parseFloat(salary);
    const ep = parseFloat(empContribPct);
    const r = parseFloat(rate);
    const mp = parseFloat(matchPct);
    const mu = parseFloat(matchUpToPct);

    if (isNaN(s) || s <= 0) return "Enter a valid annual salary.";
    if (isNaN(ca) || ca < 18 || ca > 80) return "Current age must be between 18 and 80.";
    if (isNaN(ra) || ra <= ca) return "Retirement age must be greater than current age.";
    if (ra > 90) return "Retirement age must be 90 or below.";
    if (isNaN(ep) || ep < 0 || ep > 100) return "Contribution % must be between 0 and 100.";
    if (isNaN(r) || r < 0) return "Return rate must be 0% or above.";
    if (r > 30) return "Return rate above 30% is not realistic.";
    if (!isNaN(mp) && (mp < 0 || mp > 300)) return "Employer match % must be between 0 and 300.";
    if (!isNaN(mu) && (mu < 0 || mu > 100)) return "Match ceiling must be between 0 and 100.";
    return null;
  }, [currentAge, retirementAge, salary, empContribPct, rate, matchPct, matchUpToPct]);

  /* ─── Early withdrawal warning ── */
  const earlyWarning = useMemo(() => {
    const ra = parseInt(retirementAge);
    return !isNaN(ra) && ra < 60;
  }, [retirementAge]);

  /* ─── Under-contributing warning ── */
  const underMatchWarning = useMemo(() => {
    const ep = parseFloat(empContribPct);
    const mu = parseFloat(matchUpToPct);
    const mp = parseFloat(matchPct);
    return !isNaN(ep) && !isNaN(mu) && !isNaN(mp) && mp > 0 && mu > 0 && ep < mu;
  }, [empContribPct, matchUpToPct, matchPct]);

  /* ─── Result ── */
  const result = useMemo<CalcResult | null>(() => {
    if (validationError) return null;
    const s = parseFloat(salary);
    const ep = parseFloat(empContribPct) || 0;
    const mp = parseFloat(matchPct) || 0;
    const mu = parseFloat(matchUpToPct) || 0;
    const b = parseFloat(existingBalance) || 0;
    const r = parseFloat(rate);
    const ca = parseInt(currentAge);
    const ra = parseInt(retirementAge);
    if (isNaN(s) || isNaN(r) || isNaN(ca) || isNaN(ra)) return null;

    const res = calculate(s, ep, mp, mu, b, r, ca, ra);
    debouncedTrack(res.finalBalance, res.years, r);
    return res;
  }, [salary, empContribPct, matchPct, matchUpToPct, existingBalance, rate, currentAge, retirementAge, validationError, debouncedTrack]);

  return (
    <div className="min-h-screen">

      {/* ── Page hero ── */}
      <div className="bg-[var(--bg-subtle)] border-b-[1px] border-b-[var(--border)] p-[90px_48px_48px] max-md:p-[80px_20px_28px]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="flex items-center justify-center w-fit gap-[6px] bg-[var(--accent-bg)] border-[1px] border-[var(--accent-border)] rounded-[100px] p-[4px_12px] font-sans text-[11px] font-[500] text-[var(--accent)] tracking-[0.5px] m-[0_auto_16px]">
            <Landmark size={13} />
            <span>401k Calculator</span>
          </div>
          <h1 className="font-sans font-[400] tracking-[-2px] leading-[1.05] text-[var(--text-primary)] m-[0_auto_20px] max-w-[860px] text-center text-[clamp(48px,6vw,72px)] max-md:text-[32px] max-md:tracking-[0px]">
            Calculate your{" "}
            <span className="relative inline-block text-[var(--accent)]">
              401k balance
              <CurvedUnderline />
            </span>{" "}
            at retirement.
          </h1>
          <p className="font-sans text-[16px] max-md:text-[14px] text-[var(--text-muted)] leading-[1.7] max-w-[780px] m-[auto] text-center">
            Project your 401(k) retirement balance with employer match, 2024
            IRS contribution limits, and catch-up contributions for investors
            age 50 and older. Free, no sign-up required.
          </p>
        </div>
      </div>

      {/* ── Calculator + Results ── */}
      <div className="p-[48px_48px] max-md:p-[24px_20px] md:max-lg:p-[40px_32px] bg-[var(--bg-base)]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="grid grid-cols-[400px_1fr] max-lg:grid-cols-1 xl:grid-cols-[420px_1fr] gap-[32px] max-md:gap-[20px] items-start">

            {/* LEFT — inputs */}
            <div className="w-[100%]">
              <div className="card p-[28px] max-md:p-[20px_18px] flex flex-col gap-[20px] max-md:gap-[16px]">
                <h2 className="font-sans text-[10px] font-[600] tracking-[1px] uppercase text-[var(--accent)] m-[0]">
                  Your numbers
                </h2>

                {/* Salary */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                    Annual Salary
                  </label>
                  <div className="relative">
                    <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] !pl-[22px]"
                      placeholder="80,000"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  </div>
                </div>

                {/* Age row */}
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[10px]">
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                      Current Age
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="input-field min-h-[46px]"
                      placeholder="30"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                      Retirement Age
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="input-field min-h-[46px]"
                      placeholder="65"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(e.target.value)}
                    />
                  </div>
                </div>

                {/* Early withdrawal warning */}
                {earlyWarning && (
                  <div className="calc-fade-in flex gap-[10px] p-[10px_12px] bg-[#fefce8] border border-[#fde68a] rounded-xl">
                    <AlertTriangle size={14} className="text-[#ca8a04] shrink-0 mt-[2px]" />
                    <p className="font-sans text-[12px] text-[#92400e] leading-[1.5] m-0">
                      Withdrawals before age 59½ incur a 10% penalty plus
                      income tax. The IRS qualifies distributions at 59½ or
                      later.
                    </p>
                  </div>
                )}

                {/* Employee contribution % */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-muted)]">
                    Your Contribution Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] pr-[36px]"
                      placeholder="6"
                      min={0}
                      max={100}
                      value={empContribPct}
                      onChange={(e) => setEmpContribPct(e.target.value)}
                    />
                    <span className="absolute right-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">%</span>
                  </div>
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                    {parseInt(currentAge) >= 50
                      ? `2024 IRS limit: $30,500 (catch-up eligible, age 50+)`
                      : `2024 IRS limit: $23,000 · $30,500 at age 50+ (catch-up)`}
                    {result?.irsLimitHit && (
                      <span className="text-[var(--accent)] ml-[6px]">· limit applied</span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border)]" />

                {/* Employer match */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)] flex items-center gap-[8px]">
                    Employer Match
                  </label>
                  <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[10px]">
                    <div className="flex flex-col gap-[4px]">
                      <span className="font-sans text-[10px] text-[var(--text-faint)] uppercase tracking-[0.8px]">Match rate</span>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="decimal"
                          className="input-field min-h-[44px] pr-[36px]"
                          placeholder="50"
                          min={0}
                          value={matchPct}
                          onChange={(e) => setMatchPct(e.target.value)}
                        />
                        <span className="absolute right-[12px] top-[50%] -translate-y-[50%] font-ubuntu text-[13px] text-[var(--text-faint)] pointer-events-none">%</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <span className="font-sans text-[10px] text-[var(--text-faint)] uppercase tracking-[0.8px]">Up to</span>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="decimal"
                          className="input-field min-h-[44px] pr-[36px]"
                          placeholder="6"
                          min={0}
                          max={100}
                          value={matchUpToPct}
                          onChange={(e) => setMatchUpToPct(e.target.value)}
                        />
                        <span className="absolute right-[12px] top-[50%] -translate-y-[50%] font-ubuntu text-[13px] text-[var(--text-faint)] pointer-events-none">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                    e.g. 50% match up to 6% of salary — most common US plan
                  </div>
                </div>

                {/* Under-contributing warning */}
                {underMatchWarning && (
                  <div className="calc-fade-in flex gap-[10px] p-[10px_12px] bg-[#fefce8] border border-[#fde68a] rounded-xl">
                    <Info size={14} className="text-[#ca8a04] shrink-0 mt-[2px]" />
                    <p className="font-sans text-[12px] text-[#92400e] leading-[1.5] m-0">
                      You're contributing less than your employer's match
                      ceiling. Increase your contribution to{" "}
                      <strong>{matchUpToPct}%</strong> to capture the full
                      employer match — it's free money.
                    </p>
                  </div>
                )}

                {/* Existing balance */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)] flex items-center gap-[8px]">
                    Existing 401k Balance
                    <span className="text-[10px] font-[400] text-[var(--text-faint)] bg-[var(--bg-muted)] rounded-[4px] p-[1px_6px]">
                      optional
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] !pl-[22px]"
                      placeholder="0"
                      value={existingBalance}
                      onChange={(e) => setExistingBalance(e.target.value)}
                    />
                  </div>
                </div>

                {/* Return rate */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-muted)]">
                    Expected Annual Return
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] pr-[36px]"
                      placeholder="7"
                      min={0}
                      max={30}
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                    <span className="absolute right-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">%</span>
                  </div>
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                    7% = S&P 500 inflation-adjusted avg · 5% = conservative
                  </div>
                </div>

                {/* Validation error */}
                {validationError && (
                  <div className="calc-fade-in flex gap-[10px] p-[10px_12px] bg-[#fff1f2] border border-[#fecdd3] rounded-xl">
                    <AlertTriangle size={14} className="text-[#e11d48] shrink-0 mt-[2px]" />
                    <p className="font-sans text-[12px] text-[#9f1239] leading-[1.5] m-0">
                      {validationError}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — results */}
            <div className="w-[100%]">

              {/* Annual breakdown bar */}
              {result && (
                <div className="calc-fade-in card p-[18px_22px] mb-[12px] flex flex-wrap gap-x-[32px] gap-y-[10px]">
                  {[
                    { label: "Your annual contribution", value: fmt(result.employeeAnnual), color: "var(--border-strong)" },
                    { label: "Employer match / year", value: fmt(result.employerAnnual), color: "var(--accent-light)" },
                    { label: "Total going in / year", value: fmt(result.totalAnnual), color: "var(--accent)" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-[3px]">
                      <span className="font-sans text-[10px] uppercase tracking-[1px] text-[var(--text-faint)]">{item.label}</span>
                      <span className="font-sans text-[18px] font-[500]" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Result cards */}
              <div className="grid grid-cols-[1fr_1fr] md:max-lg:grid-cols-[repeat(3,1fr)] max-md:grid-cols-[1fr] gap-[12px] max-md:gap-[8px] mb-[16px]">
                {[
                  {
                    label: "401k Balance at Retirement",
                    value: result ? fmt(result.finalBalance) : "—",
                    color: "var(--positive)",
                    large: true,
                  },
                  {
                    label: "Total Employer Match",
                    value: result ? fmt(result.totalEmployerMatch) : "—",
                    color: "var(--accent)",
                    large: false,
                  },
                  {
                    label: "Total You Contributed",
                    value: result ? fmt(result.totalEmployeeContrib) : "—",
                    color: "var(--text-secondary)",
                    large: false,
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={`card flex flex-col gap-[6px] p-[20px_22px] ${card.large ? "col-[1/-1] max-lg:col-auto p-[24px_28px]" : ""}`}
                    style={{ opacity: result ? 1 : 0.4, transition: "opacity 0.3s ease" }}
                  >
                    <span className="font-sans text-[10px] font-[600] tracking-[1px] uppercase text-[var(--text-faint)]">
                      {card.label}
                    </span>
                    <span
                      className={`font-sans font-[500] leading-[1.1] ${card.large ? "text-[40px] max-md:text-[32px] md:max-lg:text-[28px]" : "text-[28px] max-md:text-[22px]"}`}
                      style={{ color: card.color }}
                    >
                      {card.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Employer match callout */}
              {result && result.totalEmployerMatch > 0 && (
                <div className="calc-fade-in flex gap-[10px] p-[12px_16px] bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-xl mb-[16px]">
                  <Landmark size={15} className="text-[var(--accent)] shrink-0 mt-[2px]" />
                  <p className="font-sans text-[13px] text-[var(--text-primary)] leading-[1.55] m-0">
                    Your employer contributes{" "}
                    <strong className="font-semibold">{fmt(result.employerAnnual)}</strong> per
                    year in matching funds —{" "}
                    <strong className="font-semibold text-[var(--accent)]">
                      {fmt(result.totalEmployerMatch)}
                    </strong>{" "}
                    total over {result.years} years before growth. That's free
                    money added to your balance at zero cost to you.
                  </p>
                </div>
              )}

              {/* Chart */}
              {result && result.chartData.length > 1 && (
                <div className="card p-[20px_20px_16px] calc-slide-up">
                  <div className="flex items-center justify-between mb-[16px]">
                    <span className="font-sans text-[10px] font-[600] tracking-[1px] uppercase text-[var(--text-faint)] flex-[1] min-w-[0] whitespace-nowrap overflow-hidden text-ellipsis">
                      401k growth by age
                    </span>
                    <div className="flex items-center gap-[12px] font-sans text-[11px] text-[var(--text-muted)]">
                      <div className="flex items-center gap-[4px]">
                        <span className="w-[8px] h-[8px] rounded-[50%] shrink-0" style={{ background: "var(--accent)" }} />
                        <span>Growth</span>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <span className="w-[8px] h-[8px] rounded-[50%] shrink-0" style={{ background: "var(--accent-light)" }} />
                        <span>Employer</span>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <span className="w-[8px] h-[8px] rounded-[50%] shrink-0" style={{ background: "var(--border-strong)" }} />
                        <span>You</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-[100%] h-[220px] [&_svg]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={result.chartData}
                        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="g401kGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="g401kEmployer" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent-light)" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="var(--accent-light)" stopOpacity={0.05} />
                          </linearGradient>
                          <linearGradient id="g401kEmployee" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--border-strong)" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="var(--border-strong)" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                          dataKey="age"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "var(--text-faint)", fontFamily: "DM Sans" }}
                          interval="preserveStartEnd"
                          label={{ value: "Age", position: "insideBottomRight", offset: -4, style: { fontSize: 10, fill: "var(--text-faint)", fontFamily: "DM Sans" } }}
                        />
                        <YAxis
                          hide={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "var(--text-faint)", fontFamily: "DM Sans" }}
                          tickFormatter={fmtK}
                          width={52}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="employee" name="You" stroke="var(--border-strong)" strokeWidth={1.5} fill="url(#g401kEmployee)" stackId="1" />
                        <Area type="monotone" dataKey="employer" name="Employer" stroke="var(--accent-light)" strokeWidth={1.5} fill="url(#g401kEmployer)" stackId="1" />
                        <Area type="monotone" dataKey="growth" name="Growth" stroke="var(--accent)" strokeWidth={2} fill="url(#g401kGrowth)" stackId="1" animationDuration={600} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SEO Section ── */}
      <div className="section-wrapper bg-[var(--bg-base)]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="section-header">
            <span className="section-eyebrow">{"// WHAT IS A 401K"}</span>
            <h2 className="section-heading">The retirement account that cuts your tax bill today.</h2>
          </div>
          <div className="grid grid-cols-[1fr_400px] max-lg:grid-cols-1 gap-[48px] items-start">
            {/* Left Column: Prose */}
            <div className="flex flex-col gap-[24px]">
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                A 401(k) is an employer-sponsored retirement account where you contribute pre-tax dollars directly from your paycheck. Pre-tax means the contribution reduces your taxable income today — if you earn $80,000 and contribute $6,000, you only pay income tax on $74,000 that year. Your investments then grow tax-deferred until you withdraw in retirement, when withdrawals are taxed as ordinary income.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                The employer match is the most valuable part most employees underuse. The most common structure is 50% match up to 6% of salary — meaning your employer adds $0.50 for every $1 you contribute, up to 6% of your paycheck. On an $80,000 salary that is $2,400 of free money per year. Employees who contribute below the match ceiling are leaving guaranteed compensation on the table. No investment in the market offers a guaranteed 50% return on day one.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                The 2024 employee contribution limit is $23,000 per year — $30,500 if you are age 50 or older, thanks to the catch-up contribution provision. Employer matching contributions are on top of this and do not count toward your personal limit. The combined limit including employer contributions is $69,000 in 2024. Unlike a Roth IRA, there are no income limits on 401(k) contributions — anyone with access to a plan can contribute up to the IRS maximum.
              </p>
            </div>

            {/* Right Column: Stat Cards */}
            <div className="grid grid-cols-1 md:max-lg:grid-cols-3 gap-[16px]">
              {/* Card 1 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">$23,000</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">2024 employee contribution limit</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">$30,500 with catch-up contribution for employees age 50 and older</div>
              </div>
              {/* Card 2 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">50%</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Guaranteed return on matched contributions</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">A 50% match up to 6% means every matched dollar earns 50% before any market return</div>
              </div>
              {/* Card 3 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">$69,000</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Total 2024 combined contribution limit</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">Maximum across employee plus employer contributions to a single 401(k) plan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="section-wrapper bg-[var(--bg-subtle)]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="section-header">
            <span className="section-eyebrow">{"// HOW IT WORKS"}</span>
            <h2 className="section-heading">The 401k growth formula.</h2>
          </div>
          <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px] mb-[24px]">
            <div
              className="font-sans text-[22px] max-md:text-[16px] tracking-[1px] mb-[24px] pb-[20px] border-b-[1px] border-b-[var(--border)]"
              style={{ color: "var(--accent)" }}
            >
              FV = B₀(1 + r)<sup>t</sup> + C<sub>total</sub> × [((1 + r)<sup>t</sup> − 1) / r]
            </div>
            <div className="flex flex-col gap-[10px]">
              {[
                { sym: "FV", def: "Future Value — your 401k balance at retirement (pre-tax)" },
                { sym: "B₀", def: "Existing 401k balance — what you have today" },
                { sym: "r", def: "Annual return rate as a decimal (7% = 0.07)" },
                { sym: "t", def: "Years from current age to retirement age" },
                { sym: "C", def: "Total annual contribution (your contribution + employer match)" },
              ].map((v) => (
                <div key={v.sym} className="flex items-start gap-[16px]">
                  <span className="font-mono text-[14px] font-[500] text-[var(--accent)] w-[28px] shrink-0">{v.sym}</span>
                  <span className="font-sans text-[14px] text-[var(--text-muted)] leading-[1.5]">{v.def}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
            The formula uses annual compounding — the standard for retirement
            projections. The employer match is calculated as{" "}
            <strong className="text-[var(--text-primary)] font-[600]">
              min(your%, match ceiling%) × salary × match rate
            </strong>
            . This means contributing below the match ceiling costs you free
            money. Employer contributions are not subject to the $23,000 IRS
            limit — only your employee contributions are capped.
          </p>
        </div>
      </div>

      {/* ── FAQ ── */}
      <FAQSection faqs={faqs} id="faq" />

      {/* ── Related tools ── */}
      <div className="section-wrapper bg-[var(--bg-subtle)]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="section-header">
            <span className="section-eyebrow">{"// RELATED TOOLS"}</span>
            <h2 className="section-heading">Keep calculating.</h2>
          </div>
          <div className="grid grid-cols-[repeat(2,1fr)] max-md:grid-cols-[1fr] gap-[12px]">
            {relatedTools.map((tool) => (
              <a
                key={tool.name}
                href={tool.href}
                onClick={() =>
                  trackRelatedToolClick({
                    from_calculator: "401k",
                    to_calculator: tool.name.toLowerCase().replace(/\s+/g, "_"),
                    href: tool.href,
                  })
                }
                className="card card-hoverable p-[18px_20px] flex items-center justify-between gap-[16px] no-underline text-inherit cursor-pointer"
              >
                <div>
                  <div className="font-sans text-[14px] font-[600] text-[var(--text-primary)] mb-[3px]">{tool.name}</div>
                  <div className="font-sans text-[12px] text-[var(--text-muted)]">{tool.desc}</div>
                </div>
                <ArrowRight size={16} className="text-[var(--text-faint)] shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}