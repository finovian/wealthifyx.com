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
  ReferenceLine,
} from "recharts";
import { PiggyBank, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { faqs, relatedTools } from "@/constants/savings-goal";
import FAQSection from "../FAQSection";
import ShareButton from "@/components/ShareButton";
import {
  trackCalculatorResult,
  trackRelatedToolClick,
  debounce,
} from "@/lib/analytics";

/* ─── Types ─────────────────────────────────────────────── */
type Mode = "time" | "monthly";

interface InitialValues {
  target?: string;
  start?: string;
  rate?: string;
  contrib?: string;
  months?: string;
  mode?: string;
  result?: string;
}

interface SavingsGoalCalculatorProps {
  initialValues?: InitialValues;
}

interface ChartPoint {
  label: string;
  savings: number;
  interest: number;
  balance: number;
}

interface TimeResult {
  mode: "time";
  months: number;
  years: number;
  remainingMonths: number;
  totalContributions: number;
  totalInterest: number;
  finalBalance: number;
  alreadyReached: boolean;
  unreachable: boolean;
  chartData: ChartPoint[];
}

interface MonthlyResult {
  mode: "monthly";
  requiredMonthly: number;
  totalContributions: number;
  totalInterest: number;
  alreadyReached: boolean;
  chartData: ChartPoint[];
}

type CalcResult = TimeResult | MonthlyResult;

/* ─── Formulas ───────────────────────────────────────────── */
const MAX_MONTHS = 1200; // 100 year hard cap

function monthsToGoal(
  goal: number,
  currentSavings: number,
  monthlyContrib: number,
  annualRate: number,
): { months: number | null; unreachable: boolean } {
  if (currentSavings >= goal) return { months: 0, unreachable: false };
  if (annualRate === 0) {
    if (monthlyContrib <= 0) return { months: null, unreachable: true };
    return { months: Math.ceil((goal - currentSavings) / monthlyContrib), unreachable: false };
  }
  const r = annualRate / 100 / 12;
  let balance = currentSavings;
  for (let m = 1; m <= MAX_MONTHS; m++) {
    balance = balance * (1 + r) + monthlyContrib;
    if (balance >= goal) return { months: m, unreachable: false };
  }
  return { months: null, unreachable: true };
}

// FV annuity solve for C: C = (Goal - B0*(1+r)^n) / [((1+r)^n - 1) / r]
function requiredMonthly(
  goal: number,
  currentSavings: number,
  months: number,
  annualRate: number,
): number {
  if (months <= 0) return 0;
  if (annualRate === 0) return Math.max(0, (goal - currentSavings) / months);
  const r = annualRate / 100 / 12;
  const growth = Math.pow(1 + r, months);
  const futureExisting = currentSavings * growth;
  if (futureExisting >= goal) return 0;
  const annuityFactor = (growth - 1) / r;
  return (goal - futureExisting) / annuityFactor;
}

function buildChartData(
  goal: number,
  currentSavings: number,
  monthlyContrib: number,
  annualRate: number,
  totalMonths: number,
): ChartPoint[] {
  const r = annualRate / 100 / 12;
  const step =
    totalMonths <= 24 ? 1
    : totalMonths <= 60 ? 3
    : totalMonths <= 120 ? 6
    : 12;
  const data: ChartPoint[] = [];
  let balance = currentSavings;
  let totalContrib = currentSavings;

  for (let m = 0; m <= totalMonths; m++) {
    if (m % step === 0 || m === totalMonths) {
      const capped = Math.min(balance, goal * 1.01);
      const contribCapped = Math.min(totalContrib, capped);
      const interest = Math.max(0, capped - contribCapped);
      let label: string;
      if (m === 0) label = "Now";
      else if (m < 12) label = `${m}mo`;
      else label = `${Math.round(m / 12)}yr`;

      data.push({
        label,
        savings: Math.round(contribCapped),
        interest: Math.round(interest),
        balance: Math.round(capped),
      });
    }
    if (m < totalMonths) {
      balance = balance * (1 + r) + monthlyContrib;
      totalContrib += monthlyContrib;
    }
  }
  return data;
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

function formatDuration(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} month${m !== 1 ? "s" : ""}`;
  if (m === 0) return `${y} year${y !== 1 ? "s" : ""}`;
  return `${y} yr ${m} mo`;
}

/* ─── Tooltip ────────────────────────────────────────────── */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[10px] p-[12px_16px] font-sans text-[12px] shadow-[var(--shadow-md)] min-w-[180px]">
      <div className="text-[var(--text-faint)] mb-[8px] text-[11px]">{label}</div>
      {payload.map((p) => (
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

/* ─── Mode toggle ────────────────────────────────────────── */
function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="flex bg-[var(--bg-muted)] border border-[var(--border)] rounded-[10px] p-[3px] gap-[2px] w-fit">
      {(
        [
          { value: "time", label: "How long?" },
          { value: "monthly", label: "How much/mo?" },
        ] as { value: Mode; label: string }[]
      ).map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`h-[34px] px-[14px] rounded-[8px] border-none font-sans text-[12px] font-[500] cursor-pointer transition-all duration-[0.15s] whitespace-nowrap ${
            mode === opt.value
              ? "bg-[var(--accent)] text-[white] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-transparent hover:bg-[var(--bg-card)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function SavingsGoalCalculator({ initialValues }: SavingsGoalCalculatorProps) {
  const [mode, setMode] = useState<Mode>((initialValues?.mode as Mode) || "time");

  // shared inputs
  const [goal, setGoal] = useState(initialValues?.target || "50000");
  const [currentSavings, setCurrentSavings] = useState(initialValues?.start || "5000");
  const [rate, setRate] = useState(initialValues?.rate || "5");

  // mode-specific inputs
  const [monthlyContrib, setMonthlyContrib] = useState(initialValues?.contrib || "500");
  const [timeYears, setTimeYears] = useState(initialValues?.months ? Math.floor(parseInt(initialValues.months) / 12).toString() : "5");
  const [timeMonths, setTimeMonths] = useState(initialValues?.months ? (parseInt(initialValues.months) % 12).toString() : "0");

  /* ─── GA4 ── */
  const debouncedTrack = useMemo(
    () =>
      debounce(
        (finalBalance: number, months: number, rate: number) => {
          trackCalculatorResult({
            calculator_name: "savings_goal",
            final_balance: Math.round(finalBalance),
            years: Math.round(months / 12),
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
    const g = parseFloat(goal);
    const cs = parseFloat(currentSavings) || 0;
    const r = parseFloat(rate);
    const mc = parseFloat(monthlyContrib) || 0;
    const ty = parseInt(timeYears) || 0;
    const tm = parseInt(timeMonths) || 0;
    const totalMonths = ty * 12 + tm;

    if (isNaN(g) || g <= 0) return "Enter a valid savings goal above $0.";
    if (cs < 0) return "Current savings cannot be negative.";
    if (isNaN(r) || r < 0) return "Return rate must be 0% or above.";
    if (r > 30) return "Return rate above 30% is not realistic.";
    if (mode === "time" && mc < 0) return "Monthly contribution cannot be negative.";
    if (mode === "time" && mc === 0 && cs <= 0 && r === 0) return "Enter a monthly contribution or existing savings to project growth.";
    if (mode === "monthly" && totalMonths <= 0) return "Enter a time horizon greater than 0.";
    if (mode === "monthly" && totalMonths > MAX_MONTHS) return "Time horizon cannot exceed 100 years.";
    return null;
  }, [goal, currentSavings, rate, monthlyContrib, timeYears, timeMonths, mode]);

  /* ─── Result ── */
  const result = useMemo<CalcResult | null>(() => {
    if (validationError) return null;
    const g = parseFloat(goal);
    const cs = parseFloat(currentSavings) || 0;
    const r = parseFloat(rate);
    const mc = parseFloat(monthlyContrib) || 0;
    const ty = parseInt(timeYears) || 0;
    const tm = parseInt(timeMonths) || 0;
    const totalMonths = ty * 12 + tm;

    if (mode === "time") {
      const { months, unreachable } = monthsToGoal(g, cs, mc, r);
      if (unreachable) {
        return {
          mode: "time",
          months: 0,
          years: 0,
          remainingMonths: 0,
          totalContributions: 0,
          totalInterest: 0,
          finalBalance: 0,
          alreadyReached: false,
          unreachable: true,
          chartData: [],
        };
      }
      const m = months!;
      const alreadyReached = m === 0;
      const contribTotal = cs + mc * m;
      const chart = alreadyReached ? [] : buildChartData(g, cs, mc, r, m);
      const interest = alreadyReached ? 0 : Math.max(0, g - contribTotal);
      debouncedTrack(g, m, r);
      return {
        mode: "time",
        months: m,
        years: Math.floor(m / 12),
        remainingMonths: m % 12,
        totalContributions: Math.round(contribTotal),
        totalInterest: Math.round(interest),
        finalBalance: Math.round(g),
        alreadyReached,
        unreachable: false,
        chartData: chart,
      };
    } else {
      const alreadyReached = cs >= g;
      const req = alreadyReached ? 0 : requiredMonthly(g, cs, totalMonths, r);
      const contribTotal = cs + req * totalMonths;
      const interest = Math.max(0, g - contribTotal);
      const chart = buildChartData(g, cs, req, r, totalMonths);
      debouncedTrack(g, totalMonths, r);
      return {
        mode: "monthly",
        requiredMonthly: req,
        totalContributions: Math.round(contribTotal),
        totalInterest: Math.round(interest),
        alreadyReached,
        chartData: chart,
      };
    }
  }, [
    mode, goal, currentSavings, rate, monthlyContrib,
    timeYears, timeMonths, validationError, debouncedTrack,
  ]);

  const timeResult = result?.mode === "time" ? result : null;
  const monthlyResult = result?.mode === "monthly" ? result : null;

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <div className="bg-[var(--bg-subtle)] border-b-[1px] border-b-[var(--border)] p-[90px_48px_48px] max-md:p-[80px_20px_28px]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="flex items-center justify-center w-fit gap-[6px] bg-[var(--accent-bg)] border-[1px] border-[var(--accent-border)] rounded-[100px] p-[4px_12px] font-sans text-[11px] font-[500] text-[var(--accent)] tracking-[0.5px] m-[0_auto_16px]">
            <PiggyBank size={13} />
            <span>Savings Goal Calculator</span>
          </div>
          <h1 className="font-sans font-[400] tracking-[-2px] leading-[1.05] text-[var(--text-primary)] m-[0_auto_20px] max-w-[860px] text-center text-[clamp(48px,6vw,72px)] max-md:text-[32px] max-md:tracking-[-1px]">
            Find out when you&apos;ll hit your{" "}
            <span className="relative inline-block text-[var(--accent)]">
              savings goal.
              <CurvedUnderline />
            </span>
          </h1>
          <p className="font-sans text-[16px] max-md:text-[14px] text-[var(--text-muted)] leading-[1.7] max-w-[780px] m-[auto] text-center">
            Calculate how long it takes to reach any savings target — or how
            much you need to save each month to hit your goal by a specific
            date. Accounts for interest compounding on your existing balance.
          </p>
        </div>
      </div>

      {/* ── Calculator ── */}
      <div className="p-[48px_48px] max-md:p-[24px_20px] md:max-lg:p-[40px_32px] bg-[var(--bg-base)]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="grid grid-cols-[400px_1fr] max-lg:grid-cols-[1fr] xl:grid-cols-[420px_1fr] gap-[32px] max-md:gap-[20px] md:max-lg:gap-[24px] xl:gap-[40px] items-start">

            {/* LEFT — inputs */}
            <div className="w-[100%]">
              <div className="card p-[28px] max-md:p-[20px_18px] flex flex-col gap-[20px] max-md:gap-[16px]">
                <div className="flex items-center justify-between flex-wrap gap-[10px]">
                  <h2 className="font-sans text-[10px] font-[600] tracking-[1px] uppercase text-[var(--accent)] m-[0]">
                    Your numbers
                  </h2>
                  <ModeToggle mode={mode} onChange={setMode} />
                </div>

                {/* Goal */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                    Savings Goal
                  </label>
                  <div className="relative">
                    <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] !pl-[22px]"
                      placeholder="50,000"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    />
                  </div>
                </div>

                {/* Current savings */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)] flex items-center gap-[8px]">
                    Current Savings
                    <span className="text-[10px] font-[400] text-[var(--text-faint)] bg-[var(--bg-muted)] rounded-[4px] p-[1px_6px]">optional</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] !pl-[22px]"
                      placeholder="0"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(e.target.value)}
                    />
                  </div>
                </div>

                {/* Rate */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-muted)]">
                    Annual Return Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] pr-[36px]"
                      placeholder="5"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                    <span className="absolute right-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">%</span>
                  </div>
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                    HYSA: 4–5% · Index funds: 7% · Savings account: 1–2%
                  </div>
                </div>

                {/* Mode A: monthly contribution */}
                {mode === "time" && (
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                      Monthly Contribution
                    </label>
                    <div className="relative">
                      <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        className="input-field min-h-[46px] !pl-[22px]"
                        placeholder="500"
                        value={monthlyContrib}
                        onChange={(e) => setMonthlyContrib(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Mode B: time horizon */}
                {mode === "monthly" && (
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                      Time to Reach Goal
                    </label>
                    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
                      <div className="flex flex-col gap-[4px]">
                        <span className="font-sans text-[10px] text-[var(--text-faint)] uppercase tracking-[0.8px]">Years</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          className="input-field min-h-[44px]"
                          placeholder="5"
                          min={0}
                          value={timeYears}
                          onChange={(e) => setTimeYears(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-[4px]">
                        <span className="font-sans text-[10px] text-[var(--text-faint)] uppercase tracking-[0.8px]">Months</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          className="input-field min-h-[44px]"
                          placeholder="0"
                          min={0}
                          max={11}
                          value={timeMonths}
                          onChange={(e) => setTimeMonths(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation error */}
                {validationError && (
                  <div className="calc-fade-in flex gap-[10px] p-[10px_12px] bg-[#fff1f2] border border-[#fecdd3] rounded-xl">
                    <AlertTriangle size={14} className="text-[#e11d48] shrink-0 mt-[2px]" />
                    <p className="font-sans text-[12px] text-[#9f1239] leading-[1.5] m-0">{validationError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — results */}
            <div className="w-[100%]">

              {/* Already reached */}
              {(timeResult?.alreadyReached || monthlyResult?.alreadyReached) && (
                <div className="calc-fade-in flex gap-[10px] p-[14px_16px] bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-xl mb-[16px]">
                  <CheckCircle2 size={16} className="text-[var(--accent)] shrink-0 mt-[1px]" />
                  <p className="font-sans text-[13px] text-[var(--text-primary)] leading-[1.55] m-0">
                    Your current savings already exceed your goal.{" "}
                    <strong className="font-semibold text-[var(--accent)]">You&apos;re there.</strong>
                  </p>
                </div>
              )}

              {/* Unreachable */}
              {timeResult?.unreachable && (
                <div className="calc-fade-in flex gap-[10px] p-[14px_16px] bg-[#fff1f2] border border-[#fecdd3] rounded-xl mb-[16px]">
                  <AlertTriangle size={16} className="text-[#e11d48] shrink-0 mt-[1px]" />
                  <p className="font-sans text-[13px] text-[#9f1239] leading-[1.55] m-0">
                    At $0/month with no interest, this goal is unreachable.
                    Add a monthly contribution or increase your return rate to
                    get a projection.
                  </p>
                </div>
              )}

              {/* Result cards — Mode A */}
              {mode === "time" && !timeResult?.unreachable && !timeResult?.alreadyReached && (
                <div className="grid grid-cols-[1fr_1fr] md:max-lg:grid-cols-[repeat(3,1fr)] max-md:grid-cols-[1fr] gap-[12px] max-md:gap-[8px] mb-[16px]">
                  {[
                    {
                      label: "Time to Reach Goal",
                      value: timeResult ? formatDuration(timeResult.months) : "—",
                      color: "var(--positive)",
                      large: true,
                    },
                    {
                      label: "Interest Earned",
                      value: timeResult ? fmt(timeResult.totalInterest) : "—",
                      color: "var(--accent)",
                      large: false,
                    },
                    {
                      label: "Total Contributions",
                      value: timeResult ? fmt(timeResult.totalContributions) : "—",
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
              )}

              {/* Result cards — Mode B */}
              {mode === "monthly" && !monthlyResult?.alreadyReached && (
                <div className="grid grid-cols-[1fr_1fr] md:max-lg:grid-cols-[repeat(3,1fr)] max-md:grid-cols-[1fr] gap-[12px] max-md:gap-[8px] mb-[16px]">
                  {[
                    {
                      label: "Required Monthly Savings",
                      value: monthlyResult ? fmt(monthlyResult.requiredMonthly) : "—",
                      color: "var(--positive)",
                      large: true,
                    },
                    {
                      label: "Interest Earned",
                      value: monthlyResult ? fmt(monthlyResult.totalInterest) : "—",
                      color: "var(--accent)",
                      large: false,
                    },
                    {
                      label: "Total Contributions",
                      value: monthlyResult ? fmt(monthlyResult.totalContributions) : "—",
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
              )}

              {/* Share Results Button */}
              <div className="mb-[16px] relative z-10">
                <ShareButton
                  params={{
                    target: goal,
                    start: currentSavings,
                    rate: rate,
                    contrib: monthlyContrib,
                    months: (parseInt(timeYears) * 12 + parseInt(timeMonths)).toString(),
                    mode: mode,
                    result: (result?.mode === "time" ? result.months : result?.requiredMonthly)?.toString() || "",
                  }}
                  disabled={!result || (result.mode === "time" && result.unreachable)}
                />
              </div>

              {/* Chart */}
              {result && result.chartData.length > 1 && (
                <div className="card p-[20px_20px_16px] calc-slide-up">
                  <div className="flex items-center justify-between mb-[16px]">
                    <span className="font-sans text-[10px] font-[600] tracking-[1px] uppercase text-[var(--text-faint)] flex-[1] min-w-[0] whitespace-nowrap overflow-hidden text-ellipsis">
                      Balance over time
                    </span>
                    <div className="flex items-center gap-[12px] font-sans text-[11px] text-[var(--text-muted)]">
                      <div className="flex items-center gap-[4px]">
                        <span className="w-[8px] h-[8px] rounded-[50%] shrink-0" style={{ background: "var(--accent)" }} />
                        <span>Interest</span>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <span className="w-[8px] h-[8px] rounded-[50%] shrink-0" style={{ background: "var(--border-strong)" }} />
                        <span>Savings</span>
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
                          <linearGradient id="gSGInterest" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="gSGSavings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--border-strong)" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="var(--border-strong)" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "var(--text-faint)", fontFamily: "DM Sans" }}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "var(--text-faint)", fontFamily: "DM Sans" }}
                          tickFormatter={fmtK}
                          width={52}
                        />
                        <ReferenceLine
                          y={parseFloat(goal)}
                          stroke="var(--accent)"
                          strokeDasharray="4 4"
                          strokeWidth={1.5}
                          label={{
                            value: "Goal",
                            position: "insideTopRight",
                            style: { fontSize: 10, fill: "var(--accent)", fontFamily: "DM Sans" },
                          }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="savings"
                          name="Savings"
                          stroke="var(--border-strong)"
                          strokeWidth={1.5}
                          fill="url(#gSGSavings)"
                          stackId="1"
                        />
                        <Area
                          type="monotone"
                          dataKey="interest"
                          name="Interest"
                          stroke="var(--accent)"
                          strokeWidth={2}
                          fill="url(#gSGInterest)"
                          stackId="1"
                          animationDuration={600}
                        />
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
            <span className="section-eyebrow">{"// HOW SAVINGS GOALS WORK"}</span>
            <h2 className="section-heading">Two numbers that change everything: rate and time.</h2>
          </div>
          <div className="grid grid-cols-[1fr_400px] max-lg:grid-cols-1 gap-[48px] items-start">
            {/* Left Column: Prose */}
            <div className="flex flex-col gap-[24px]">
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                A savings goal has two variables you can control: how much you put in each month, and how long you give it to grow. The interest rate on your account is a third factor — but one you have less control over. The most powerful lever is <strong className="text-[var(--text-primary)] font-[600]">time</strong>. Starting 12 months earlier on a 5-year goal is worth more than increasing your monthly contribution by $100, because every earlier dollar earns interest for the entire remaining period.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                Your existing savings are not idle. Every dollar already saved is compounding right now — earning interest on interest every month before you add a single new contribution. A $5,000 existing balance at 5% annual return earns $250 in year one, $263 in year two, $276 in year three. That growth compounds automatically. The more you already have, the less new money you need to contribute to reach your goal on time.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                The right return rate depends entirely on where the money lives. High-yield savings accounts currently pay 4 to 5% — appropriate for goals under 3 years where the money must stay safe. Index fund accounts average 7% over long periods in real terms — appropriate for goals 5 years or more away where short-term volatility is acceptable. Never use a high return rate for a short-term goal. If you need the money in 18 months, it should not be in equities.
              </p>
            </div>

            {/* Right Column: Stat Cards */}
            <div className="grid grid-cols-1 md:max-lg:grid-cols-3 gap-[16px]">
              {/* Card 1 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">4–5%</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Current high-yield savings account rate</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">HYSA rates as of 2024 — appropriate for goals under 3 years where capital must be safe</div>
              </div>
              {/* Card 2 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">7%</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Long-term index fund return estimate</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">S&P 500 inflation-adjusted average — use for goals 5+ years away in a brokerage account</div>
              </div>
              {/* Card 3 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">Month 1</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">When compounding starts working for you</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">Your existing savings earn interest immediately — every dollar already saved reduces how much new money you need</div>
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
            <h2 className="section-heading">The savings goal formula.</h2>
          </div>
          <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px] mb-[24px]">
            <div
              className="font-sans text-[20px] max-md:text-[15px] tracking-[0.5px] mb-[24px] pb-[20px] border-b-[1px] border-b-[var(--border)]"
              style={{ color: "var(--accent)" }}
            >
              C = (Goal − B<sub>0</sub>(1+r)<sup>n</sup>) ÷ [((1+r)<sup>n</sup> − 1) ÷ r]
            </div>
            <div className="flex flex-col gap-[10px]">
              {[
                { sym: "C", def: "Required monthly contribution to reach Goal in n months" },
                { sym: "B₀", def: "Current savings — your starting balance today" },
                { sym: "r", def: "Monthly return rate (annual rate ÷ 12)" },
                { sym: "n", def: "Number of months to your goal date" },
                { sym: "Goal", def: "Your target savings amount" },
              ].map((v) => (
                <div key={v.sym} className="flex items-start gap-[16px]">
                  <span className="font-mono text-[14px] font-[500] text-[var(--accent)] w-[28px] shrink-0">{v.sym}</span>
                  <span className="font-sans text-[14px] text-[var(--text-muted)] leading-[1.5]">{v.def}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
            For the &quot;How long?&quot; mode, the calculator iterates month by month —
            applying your monthly return rate to the current balance, then
            adding your contribution — and counts the months until the balance
            first reaches your goal. For the &quot;How much/mo?&quot; mode, it solves
            the future value of an ordinary annuity formula directly for the
            monthly payment. Both modes account for interest compounding on
            your existing savings from day one.
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
                    from_calculator: "savings_goal",
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
