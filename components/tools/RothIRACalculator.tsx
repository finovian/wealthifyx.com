"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp, ArrowRight, AlertTriangle, Info } from "lucide-react";
import FAQSection from "../FAQSection";
import ShareButton from "@/components/ShareButton";
import {
  trackCalculatorResult,
  trackRelatedToolClick,
  debounce,
} from "@/lib/analytics";
import { faqs, relatedTools } from "@/constants/roth-ira";

/* ─── IRS Constants (2024) ──────────────────────────────── */
const CONTRIBUTION_LIMIT_UNDER_50 = 7000;
const CONTRIBUTION_LIMIT_50_PLUS = 8000;

const PHASE_OUT = {
  single: { start: 146000, end: 161000 },
  married: { start: 230000, end: 240000 },
  married_sep: { start: 0, end: 10000 },
};

const FILING_OPTIONS = [
  { label: "Single", value: "single" as const },
  { label: "Married (Joint)", value: "married" as const },
  { label: "Married (Sep.)", value: "married_sep" as const },
];

/* ─── Types ──────────────────────────────────────────────── */
type FilingStatus = "single" | "married" | "married_sep";

interface InitialValues {
  age?: string;
  ret?: string;
  con?: string;
  bal?: string;
  rate?: string;
  fil?: string;
  inc?: string;
  result?: string;
}

interface RothIRACalculatorProps {
  initialValues?: InitialValues;
}

interface CalcResult {
  finalBalance: number;
  totalContributions: number;
  taxFreeGrowth: number;
  yearsToRetirement: number;
  chartData: {
    age: string;
    contributions: number;
    growth: number;
    total: number;
  }[];
}

type IncomeWarning = "phase_out" | "ineligible" | null;

/* ─── Core Formula ──────────────────────────────────────── */
function calculate(
  currentAge: number,
  retirementAge: number,
  annualContribution: number,
  existingBalance: number,
  rate: number,
): CalcResult {
  const r = rate / 100;
  const years = retirementAge - currentAge;
  const chartData = [];

  for (let y = 0; y <= years; y++) {
    const age = currentAge + y;
    let balance: number;

    if (r === 0) {
      balance = existingBalance + annualContribution * y;
    } else {
      const exp = Math.pow(1 + r, y);
      const growth = existingBalance * exp;
      const contribGrowth =
        y > 0
          ? annualContribution * ((exp - 1) / r)
          : 0;
      balance = growth + contribGrowth;
    }

    const totalContributions = existingBalance + annualContribution * y;
    const totalGrowth = Math.max(0, balance - totalContributions);

    chartData.push({
      age: `${age}`,
      contributions: Math.round(totalContributions),
      growth: Math.round(totalGrowth),
      total: Math.round(balance),
    });
  }

  const last = chartData[chartData.length - 1];

  return {
    finalBalance: last.total,
    totalContributions: last.contributions,
    taxFreeGrowth: last.growth,
    yearsToRetirement: years,
    chartData,
  };
}

/* ─── Income phase-out check ────────────────────────────── */
function getIncomeWarning(
  income: number,
  filing: FilingStatus,
): IncomeWarning {
  if (!income || income <= 0) return null;
  const range = PHASE_OUT[filing];
  if (income >= range.end) return "ineligible";
  if (income >= range.start) return "phase_out";
  return null;
}

/* ─── Formatting helpers ─────────────────────────────────── */
function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtK(v: number) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
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
        style={{
          animation: "drawUnderline 0.8s ease-out 0.5s forwards",
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

/* ─── Main component ─────────────────────────────────────── */
export default function RothIRACalculator({ initialValues }: RothIRACalculatorProps) {
  const [currentAge, setCurrentAge] = useState(initialValues?.age || "30");
  const [retirementAge, setRetirementAge] = useState(initialValues?.ret || "65");
  const [contribution, setContribution] = useState(initialValues?.con || "7000");
  const [existingBalance, setExistingBalance] = useState(initialValues?.bal || "");
  const [rate, setRate] = useState(initialValues?.rate || "7");
  const [filing, setFiling] = useState<FilingStatus>((initialValues?.fil as FilingStatus) || "single");
  const [income, setIncome] = useState(initialValues?.inc || "");

  const maxContribution = useMemo(() => {
    const age = parseInt(currentAge);
    return !isNaN(age) && age >= 50
      ? CONTRIBUTION_LIMIT_50_PLUS
      : CONTRIBUTION_LIMIT_UNDER_50;
  }, [currentAge]);

  const debouncedTrack = useMemo(
    () =>
      debounce(
        (finalBalance: number, years: number, rate: number) => {
          trackCalculatorResult({
            calculator_name: "roth_ira",
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

  const validationError = useMemo((): string | null => {
    const ca = parseInt(currentAge);
    const ra = parseInt(retirementAge);
    const c = parseFloat(contribution);
    const r = parseFloat(rate);

    if (isNaN(ca) || ca < 18 || ca > 80) return "Current age must be between 18 and 80.";
    if (isNaN(ra) || ra <= ca) return "Retirement age must be greater than current age.";
    if (ra > 90) return "Retirement age must be 90 or below.";
    if (isNaN(r) || r < 0) return "Return rate must be 0% or above.";
    if (r > 30) return "Return rate above 30% is not realistic.";
    if (!isNaN(c) && c > maxContribution)
      return `Annual contribution cannot exceed the IRS limit of ${fmt(maxContribution)}.`;
    return null;
  }, [currentAge, retirementAge, contribution, rate, maxContribution]);

  const incomeWarning = useMemo(
    () => getIncomeWarning(parseFloat(income), filing),
    [income, filing],
  );

  const earlyWithdrawalWarning = useMemo(() => {
    const ra = parseInt(retirementAge);
    return !isNaN(ra) && ra < 60;
  }, [retirementAge]);

  const result = useMemo<CalcResult | null>(() => {
    if (validationError) return null;
    const ca = parseInt(currentAge);
    const ra = parseInt(retirementAge);
    const c = parseFloat(contribution) || 0;
    const b = parseFloat(existingBalance) || 0;
    const r = parseFloat(rate);
    if (isNaN(ca) || isNaN(ra) || isNaN(r)) return null;

    const res = calculate(ca, ra, c, b, r);
    debouncedTrack(res.finalBalance, res.yearsToRetirement, r);
    return res;
  }, [currentAge, retirementAge, contribution, existingBalance, rate, validationError, debouncedTrack]);

  return (
    <div className="min-h-screen">
      {/* ── Page hero ── */}
      <div className="bg-[var(--bg-subtle)] border-b-[1px] border-b-[var(--border)] p-[90px_48px_48px] max-md:p-[80px_20px_28px]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="flex items-center justify-center w-fit gap-[6px] bg-[var(--accent-bg)] border-[1px] border-[var(--accent-border)] rounded-[100px] p-[4px_12px] font-sans text-[11px] font-[500] text-[var(--accent)] tracking-[0.5px] m-[0_auto_16px]">
            <TrendingUp size={13} />
            <span>Roth IRA Calculator</span>
          </div>
          <h1 className="font-sans font-[400] tracking-[-2px] leading-[1.05] text-[var(--text-primary)] m-[0_auto_20px] max-w-[860px] text-center text-[clamp(56px,7vw,75px)] max-md:text-[32px] max-md:tracking-[0px] sm:max-md:text-[52px]">
            Calculate your{" "}
            <span className="relative inline-block text-[var(--accent)]">
              tax-free
              <CurvedUnderline />
            </span>{" "}
            retirement balance.
          </h1>
          <p className="font-sans text-[16px] max-md:text-[14px] text-[var(--text-muted)] leading-[1.7] max-w-[780px] m-[auto] text-center">
            Project exactly how much your Roth IRA will be worth at retirement.
            Accounts for 2024 IRS contribution limits, income phase-outs, and
            catch-up contributions for age 50+.
          </p>
        </div>
      </div>

      {/* ── Calculator + Result ── */}
      <div className="p-[48px_48px] max-md:p-[24px_20px] md:max-lg:p-[40px_32px] bg-[var(--bg-base)]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="grid grid-cols-[400px_1fr] max-lg:grid-cols-[1fr] xl:grid-cols-[420px_1fr] gap-[32px] max-md:gap-[20px] md:max-lg:gap-[24px] xl:gap-[40px] items-start">
            
            {/* LEFT — inputs */}
            <div className="w-[100%]">
              <div className="card p-[28px] max-md:p-[20px_18px] flex flex-col gap-[20px] max-md:gap-[16px]">
                <h2 className="font-sans text-[10px] font-[600] tracking-[1px] uppercase text-[var(--accent)] m-[0]">
                  Your numbers
                </h2>

                {/* Age row */}
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[10px]">
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">Current Age</label>
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
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">Retirement Age</label>
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
                <AnimatePresence>
                  {earlyWithdrawalWarning && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-[10px] p-[12px] bg-[var(--accent-bg)] border-[1px] border-[var(--accent-border)] rounded-[12px] overflow-hidden"
                    >
                      <AlertTriangle size={14} className="text-[var(--accent)] shrink-0 mt-[2px]" />
                      <p className="font-sans text-[12px] text-[var(--text-primary)] leading-[1.5] m-[0]">
                        Withdrawals before age 59½ may trigger a 10% penalty plus taxes on earnings.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Contribution */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)] flex items-center gap-[8px]">
                    Annual Contribution
                  </label>
                  <div className="relative">
                    <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] !pl-[22px]"
                      placeholder={String(maxContribution)}
                      value={contribution}
                      onChange={(e) => setContribution(e.target.value)}
                    />
                  </div>
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                    2024 IRS limit: {fmt(maxContribution)}
                  </div>
                </div>

                {/* Balance */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)] flex items-center gap-[8px]">
                    Existing Balance
                    <span className="text-[10px] font-[400] text-[var(--text-faint)] bg-[var(--bg-muted)] rounded-[4px] p-[1px_6px]">optional</span>
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

                {/* Rate */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-muted)] flex items-center gap-[8px]">Expected Annual Return</label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] pr-[36px]"
                      placeholder="7"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                    <span className="absolute right-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">%</span>
                  </div>
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">7% = Conservative avg · 10% = Aggressive</div>
                </div>

                <div className="border-t-[1px] border-t-[var(--border)]" />

                {/* Filing */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)] flex items-center gap-[8px]">Filing Status</label>
                  <div className="grid grid-cols-[repeat(3,1fr)] max-md:grid-cols-[1fr] gap-[6px]">
                    {FILING_OPTIONS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setFiling(f.value)}
                        className={`h-[36px] border-[1px] rounded-[8px] font-ubuntu text-[11px] font-[500] cursor-pointer transition-all duration-[0.15s] ease-[ease] ${
                          filing === f.value
                            ? "bg-[var(--accent)] border-[var(--accent)] text-[#fff] font-[700]"
                            : "border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)]"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Income */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)] flex items-center gap-[8px]">
                    Annual Income (MAGI)
                    <span className="text-[10px] font-[400] text-[var(--text-faint)] bg-[var(--bg-muted)] rounded-[4px] p-[1px_6px]">optional</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] !pl-[22px]"
                      placeholder="0"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                    />
                  </div>
                </div>

                {/* Warnings */}
                <AnimatePresence>
                  {incomeWarning === "ineligible" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-[12px] bg-[#fff1f2] border-[1px] border-[#fecdd3] rounded-[12px] flex gap-[10px] overflow-hidden">
                      <AlertTriangle size={14} className="text-[#e11d48] shrink-0 mt-[2px]" />
                      <p className="font-sans text-[12px] text-[#9f1239] leading-[1.5] m-[0]">You may exceed income limits for direct contributions. Consider a Backdoor Roth.</p>
                    </motion.div>
                  )}
                  {incomeWarning === "phase_out" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-[12px] bg-[#fefce8] border-[1px] border-[#fde68a] rounded-[12px] flex gap-[10px] overflow-hidden">
                      <Info size={14} className="text-[#ca8a04] shrink-0 mt-[2px]" />
                      <p className="font-sans text-[12px] text-[#92400e] leading-[1.5] m-[0]">Your income is in the phase-out range. Your maximum limit may be reduced.</p>
                    </motion.div>
                  )}
                  {validationError && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-[12px] bg-[#fff1f2] border-[1px] border-[#fecdd3] rounded-[12px] flex gap-[10px] overflow-hidden">
                      <AlertTriangle size={14} className="text-[#e11d48] shrink-0 mt-[2px]" />
                      <p className="font-sans text-[12px] text-[#9f1239] leading-[1.5] m-[0]">{validationError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT — results */}
            <div className="w-[100%]">
              <div className="grid grid-cols-[1fr_1fr] md:max-lg:grid-cols-[repeat(3,1fr)] max-md:grid-cols-[1fr] gap-[12px] max-md:gap-[8px] mb-[16px]">
                {[
                  {
                    label: "Retirement Balance",
                    value: result ? fmt(result.finalBalance) : "—",
                    color: "var(--positive)",
                    large: true,
                  },
                  {
                    label: "Total Contributed",
                    value: result ? fmt(result.totalContributions) : "—",
                    color: "var(--text-secondary)",
                    large: false,
                  },
                  {
                    label: "Tax-Free Growth",
                    value: result ? fmt(result.taxFreeGrowth) : "—",
                    color: "var(--accent)",
                    large: false,
                  },
                ].map((card) => (
                  <motion.div
                    key={card.label}
                    className={`card flex flex-col gap-[6px] p-[20px_22px] max-md:p-[20px_22px] ${card.large ? "col-[1/-1] max-lg:col-auto p-[24px_28px] max-md:p-[24px_28px]" : ""}`}
                    animate={{ opacity: result ? 1 : 0.4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-sans text-[10px] font-[600] tracking-[1px] uppercase text-[var(--text-faint)]">{card.label}</span>
                    <span className={`font-sans font-[500] leading-[1.1] ${card.large ? "text-[40px] max-md:text-[32px] md:max-lg:text-[28px]" : "text-[28px] max-md:text-[22px]"}`} style={{ color: card.color }}>
                      {card.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Share Results Button */}
              <div className="mb-[16px] relative z-10">
                <ShareButton
                  params={{
                    age: currentAge,
                    ret: retirementAge,
                    con: contribution,
                    bal: existingBalance,
                    rate: rate,
                    fil: filing,
                    inc: income,
                    result: result?.finalBalance.toString() || "",
                  }}
                  disabled={!!validationError}
                />
              </div>

              {/* Chart */}
              {result && result.chartData.length > 1 && (
                <motion.div className="card p-[20px_20px_16px]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <div className="flex items-center justify-between mb-[16px]">
                    <span className="font-sans text-[10px] font-[600] tracking-[1px] uppercase text-[var(--text-faint)] flex-[1] min-w-[0] whitespace-nowrap overflow-hidden text-ellipsis">Growth by age</span>
                    <div className="flex items-center gap-[8px] font-sans text-[11px] text-[var(--text-muted)]">
                      <span className="w-[8px] h-[8px] rounded-[50%] shrink-0" style={{ background: "var(--accent)" }} />
                      <span>Growth</span>
                      <span className="w-[8px] h-[8px] rounded-[50%] shrink-0" style={{ background: "var(--border-strong)" }} />
                      <span>Contributions</span>
                    </div>
                  </div>
                  <div className="w-[100%] h-[220px] [&_svg]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--border-strong)" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="var(--border-strong)" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-faint)", fontFamily: "DM Sans" }} interval="preserveStartEnd" />
                        <YAxis hide={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--text-faint)", fontFamily: "DM Sans" }} tickFormatter={fmtK} width={48} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="contributions" name="Contributed" stroke="var(--border-strong)" strokeWidth={1.5} fill="url(#gContrib)" stackId="1" />
                        <Area type="monotone" dataKey="growth" name="Growth" stroke="var(--accent)" strokeWidth={2} fill="url(#gGrowth)" stackId="1" animationDuration={600} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SEO Section ── */}
      <div className="section-wrapper bg-[var(--bg-base)]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="section-header">
            <span className="section-eyebrow">{"// WHAT IS A ROTH IRA"}</span>
            <h2 className="section-heading">The retirement account that grows tax-free.</h2>
          </div>
          <div className="grid grid-cols-[1fr_400px] max-lg:grid-cols-1 gap-[48px] items-start">
            {/* Left Column: Prose */}
            <div className="flex flex-col gap-[24px]">
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                A Roth IRA is an individual retirement account where you contribute after-tax dollars — meaning you pay income tax on the money now. In exchange, every dollar of growth and every qualified withdrawal after age 59½ is completely federal-tax-free. No taxes on dividends. No taxes on capital gains. No taxes when you withdraw in retirement.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                The 2024 contribution limit is $7,000 per year if you are under 50, and $8,000 if you are 50 or older. Your ability to contribute phases out if your Modified Adjusted Gross Income (MAGI) exceeds $146,000 as a single filer or $230,000 married filing jointly. Above $161,000 single or $240,000 married, direct contributions are not allowed — though a backdoor Roth conversion remains an option.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                Unlike a Traditional IRA or 401(k), a Roth IRA has no Required Minimum Distributions (RMDs). You are never forced to withdraw. If you do not need the money at retirement, it keeps compounding tax-free and can be passed to heirs. This flexibility makes the Roth IRA one of the most powerful long-term wealth-building tools available to individual investors.
              </p>
            </div>

            {/* Right Column: Stat Cards */}
            <div className="grid grid-cols-1 md:max-lg:grid-cols-3 gap-[16px]">
              {/* Card 1 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">$7,000</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">2024 contribution limit (under 50)</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">$8,000 with catch-up contribution (age 50+)</div>
              </div>
              {/* Card 2 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">0%</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Tax on qualified withdrawals</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">After age 59½, all growth comes out federal-tax-free</div>
              </div>
              {/* Card 3 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">$161k</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Single filer income cutoff</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">Phase-out begins at $146,000 MAGI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

            <div className="section-wrapper bg-[var(--bg-subtle)]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="section-header">
            <span className="section-eyebrow">{"// HOW IT WORKS"}</span>
            <h2 className="section-heading">The Roth IRA growth formula.</h2>
          </div>
          <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px] mb-[24px]">
            <div className="font-sans text-[24px] max-md:text-[18px] tracking-[1px] mb-[24px] pb-[20px] border-b-[1px] border-b-[var(--border)]" style={{ color: "var(--accent)" }}>
              FV = B₀(1 + r)<sup>t</sup> + C × [((1 + r)<sup>t</sup> − 1) / r]
            </div>
            <div className="flex flex-col gap-[10px]">
              {[
                { sym: "FV", def: "Future Value — your tax-free balance at retirement" },
                { sym: "B₀", def: "Starting balance — your existing Roth IRA value today" },
                { sym: "r", def: "Annual return rate as a decimal (7% = 0.07)" },
                { sym: "t", def: "Years from current age to retirement age" },
                { sym: "C", def: "Annual contribution amount" },
              ].map((v) => (
                <div key={v.sym} className="flex items-start gap-[16px]">
                  <span className="font-mono text-[14px] font-[500] text-[var(--accent)] w-[28px] shrink-0">{v.sym}</span>
                  <span className="font-sans text-[14px] text-[var(--text-muted)] leading-[1.5]">{v.def}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
            The formula uses annual compounding — the standard for retirement projections. The real power of a Roth IRA is that the entire output — every dollar of <strong className="text-[var(--text-primary)] font-[600]">FV</strong> — comes out federal-tax-free after age 59½.
          </p>
        </div>
      </div>

      <FAQSection faqs={faqs} id="faq" />

      <div className="section-wrapper bg-[var(--bg-subtle)]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="section-header">
            <span className="section-eyebrow">{"// RELATED TOOLS"}</span>
            <h2 className="section-heading">Keep calculating.</h2>
          </div>
          <div className="grid grid-cols-[repeat(2,1fr)] max-md:grid-cols-[1fr] gap-[12px]">
            {relatedTools.map((tool) => (
              <a key={tool.name} href={tool.href} className="card card-hoverable p-[18px_20px] flex items-center justify-between gap-[16px] no-underline text-inherit cursor-pointer">
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
