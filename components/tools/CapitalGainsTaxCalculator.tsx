"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Receipt, ArrowRight, AlertTriangle, Info, TrendingDown } from "lucide-react";
import { faqs, relatedTools } from "@/constants/capital-gains";
import FAQSection from "../FAQSection";
import {
  trackCalculatorResult,
  trackRelatedToolClick,
  debounce,
} from "@/lib/analytics";

/* ─── 2024 IRS Brackets ──────────────────────────────────── */
type FilingStatus = "single" | "married_joint" | "married_sep" | "hoh";

const LTCG_BRACKETS: Record<FilingStatus, { rate: number; upTo: number }[]> = {
  single:        [{ rate: 0, upTo: 47025 }, { rate: 0.15, upTo: 518900 }, { rate: 0.20, upTo: Infinity }],
  married_joint: [{ rate: 0, upTo: 94050 }, { rate: 0.15, upTo: 583750 }, { rate: 0.20, upTo: Infinity }],
  married_sep:   [{ rate: 0, upTo: 47025 }, { rate: 0.15, upTo: 291850 }, { rate: 0.20, upTo: Infinity }],
  hoh:           [{ rate: 0, upTo: 63000 }, { rate: 0.15, upTo: 551350 }, { rate: 0.20, upTo: Infinity }],
};

const STCG_BRACKETS: Record<FilingStatus, { rate: number; upTo: number }[]> = {
  single: [
    { rate: 0.10, upTo: 11600 }, { rate: 0.12, upTo: 47150 }, { rate: 0.22, upTo: 100525 },
    { rate: 0.24, upTo: 191950 }, { rate: 0.32, upTo: 243725 }, { rate: 0.35, upTo: 609350 },
    { rate: 0.37, upTo: Infinity },
  ],
  married_joint: [
    { rate: 0.10, upTo: 23200 }, { rate: 0.12, upTo: 94300 }, { rate: 0.22, upTo: 201050 },
    { rate: 0.24, upTo: 383900 }, { rate: 0.32, upTo: 487450 }, { rate: 0.35, upTo: 731200 },
    { rate: 0.37, upTo: Infinity },
  ],
  married_sep: [
    { rate: 0.10, upTo: 11600 }, { rate: 0.12, upTo: 47150 }, { rate: 0.22, upTo: 100525 },
    { rate: 0.24, upTo: 191950 }, { rate: 0.32, upTo: 243725 }, { rate: 0.35, upTo: 609350 },
    { rate: 0.37, upTo: Infinity },
  ],
  hoh: [
    { rate: 0.10, upTo: 16550 }, { rate: 0.12, upTo: 63100 }, { rate: 0.22, upTo: 100500 },
    { rate: 0.24, upTo: 191950 }, { rate: 0.32, upTo: 243700 }, { rate: 0.35, upTo: 609350 },
    { rate: 0.37, upTo: Infinity },
  ],
};

const NIIT_THRESHOLD: Record<FilingStatus, number> = {
  single: 200000, married_joint: 250000, married_sep: 125000, hoh: 200000,
};

const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: "Single", married_joint: "Married Filing Jointly",
  married_sep: "Married Filing Separately", hoh: "Head of Household",
};

/* ─── Types ─────────────────────────────────────────────── */
interface CalcResult {
  gain: number;
  proceeds: number;
  costBasis: number;
  federalTax: number;
  niit: number;
  stateTax: number;
  totalTax: number;
  effectiveRate: number;
  federalRate: number;
  netProfit: number;
  isLoss: boolean;
  ltcgRate: number | null; // effective marginal LTCG rate applied (for display)
  niitApplies: boolean;
}

/* ─── Tax engine ─────────────────────────────────────────── */
function calcLTCGTax(gain: number, ordinaryIncome: number, fs: FilingStatus): number {
  const brackets = LTCG_BRACKETS[fs];
  let tax = 0, remaining = gain, cursor = ordinaryIncome;
  for (const b of brackets) {
    if (remaining <= 0) break;
    if (cursor >= b.upTo) continue;
    const room = b.upTo - cursor;
    const taxable = Math.min(remaining, room);
    tax += taxable * b.rate;
    remaining -= taxable;
    cursor = b.upTo;
  }
  return tax;
}

function calcSTCGTax(gain: number, ordinaryIncome: number, fs: FilingStatus): number {
  const brackets = STCG_BRACKETS[fs];
  const totalTax = (inc: number) => {
    let t = 0, prev = 0;
    for (const b of brackets) {
      if (inc <= prev) break;
      t += (Math.min(inc, b.upTo) - prev) * b.rate;
      prev = b.upTo;
      if (!isFinite(b.upTo)) break;
    }
    return t;
  };
  return totalTax(ordinaryIncome + gain) - totalTax(ordinaryIncome);
}

function calcNIIT(gain: number, ordinaryIncome: number, fs: FilingStatus): number {
  const threshold = NIIT_THRESHOLD[fs];
  const magi = ordinaryIncome + gain;
  if (magi <= threshold) return 0;
  return Math.min(gain, magi - threshold) * 0.038;
}

function getLTCGMarginalRate(gain: number, ordinaryIncome: number, fs: FilingStatus): number {
  // Rate that applies to the last dollar of gain
  const brackets = LTCG_BRACKETS[fs];
  let cursor = ordinaryIncome + gain;
  for (const b of brackets) { if (cursor <= b.upTo) return b.rate; }
  return 0.20;
}

function calculate(
  buyPrice: number, sellPrice: number, shares: number,
  isLongTerm: boolean, fs: FilingStatus,
  annualIncome: number, stateTaxRate: number,
): CalcResult {
  const proceeds = sellPrice * shares;
  const costBasis = buyPrice * shares;
  const gain = proceeds - costBasis;

  if (gain <= 0) {
    return { gain, proceeds, costBasis, federalTax: 0, niit: 0, stateTax: 0,
      totalTax: 0, effectiveRate: 0, federalRate: 0, netProfit: gain,
      isLoss: true, ltcgRate: null, niitApplies: false };
  }

  const federalTax = isLongTerm
    ? calcLTCGTax(gain, annualIncome, fs)
    : calcSTCGTax(gain, annualIncome, fs);

  const niit = calcNIIT(gain, annualIncome, fs);
  const stateTax = gain * (stateTaxRate / 100);
  const totalTax = federalTax + niit + stateTax;
  const effectiveRate = (totalTax / gain) * 100;
  const netProfit = gain - totalTax;
  const federalRate = (federalTax / gain) * 100;
  const ltcgRate = isLongTerm ? getLTCGMarginalRate(gain, annualIncome, fs) : null;

  return { gain, proceeds, costBasis, federalTax, niit, stateTax, totalTax,
    effectiveRate, netProfit, federalRate, isLoss: false,
    ltcgRate, niitApplies: niit > 0 };
}

/* ─── Helpers ────────────────────────────────────────────── */
function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(n);
}
function fmtK(v: number) {
  const a = Math.abs(v);
  const s = v < 0 ? "-" : "";
  if (a >= 1_000_000) return `${s}$${(a / 1_000_000).toFixed(1)}M`;
  if (a >= 1_000) return `${s}$${(a / 1_000).toFixed(0)}k`;
  return `${s}$${a}`;
}
function pct(n: number, dp = 1) {
  return (Math.round(n * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp) + "%";
}

/* ─── Custom Bar Tooltip ─────────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-[12px_16px] font-sans text-[12px] shadow-[var(--shadow-md)] min-w-[160px]">
      <div className="text-[var(--text-faint)] mb-[6px] text-[11px]">{label}</div>
      <div className="flex justify-between gap-[16px]">
        <span style={{ color: payload[0]?.fill }}>{label}</span>
        <span className="text-[var(--text-primary)] font-[600]">{fmt(payload[0]?.value)}</span>
      </div>
    </div>
  );
}

/* ─── SVG underline ──────────────────────────────────────── */
function CurvedUnderline() {
  return (
    <svg viewBox="0 0 200 12" preserveAspectRatio="none"
      className="absolute bottom-[-6px] left-[0] w-[100%] h-[12px] overflow-visible" aria-hidden="true">
      <path d="M 2 8 Q 50 2, 100 6 T 198 6" fill="none" stroke="var(--accent)"
        strokeWidth="4" strokeLinecap="round" strokeDasharray="250" strokeDashoffset="250"
        style={{ animation: "drawUnderline 0.8s ease-out 0.5s forwards" }} />
      <style>{`@keyframes drawUnderline { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}

/* ─── Holding period toggle ──────────────────────────────── */
function HoldingToggle({ isLongTerm, onChange }: { isLongTerm: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex bg-[var(--bg-muted)] border border-[var(--border)] rounded-[10px] p-[3px] gap-[2px]">
      {[
        { label: "Long-Term  (>1 yr)", value: true },
        { label: "Short-Term (<1 yr)", value: false },
      ].map((opt) => (
        <button key={String(opt.value)} onClick={() => onChange(opt.value)}
          className={`flex-1 h-[36px] px-[10px] border-none rounded-[8px] font-ubuntu text-[12px] font-[500] cursor-pointer transition-all duration-[0.15s] whitespace-nowrap ${
            isLongTerm === opt.value
              ? "bg-[var(--accent)] text-[white] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-transparent hover:bg-[var(--bg-card)]"
          }`}
        >{opt.label}</button>
      ))}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function CapitalGainsTaxCalculator() {
  const [buyPrice, setBuyPrice]       = useState("50");
  const [sellPrice, setSellPrice]     = useState("120");
  const [shares, setShares]           = useState("100");
  const [isLongTerm, setIsLongTerm]   = useState(true);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [annualIncome, setAnnualIncome] = useState("80000");
  const [stateTaxRate, setStateTaxRate] = useState("");

  /* ─── GA4 ── */
  const debouncedTrack = useMemo(() =>
    debounce((gain: number, totalTax: number, rate: number) => {
      trackCalculatorResult({
        calculator_name: "capital_gains_tax",
        final_balance: Math.round(gain),
        years: 0,
        rate,
        has_contributions: false,
      });
    }, 1500), []);

  /* ─── Validation ── */
  const validationError = useMemo((): string | null => {
    const bp = parseFloat(buyPrice);
    const sp = parseFloat(sellPrice);
    const sh = parseInt(shares);
    const ai = parseFloat(annualIncome);
    const st = parseFloat(stateTaxRate) || 0;
    if (isNaN(bp) || bp <= 0) return "Enter a valid purchase price above $0.";
    if (isNaN(sp) || sp <= 0) return "Enter a valid sale price above $0.";
    if (isNaN(sh) || sh < 1) return "Number of shares must be at least 1.";
    if (isNaN(ai) || ai < 0) return "Annual income cannot be negative.";
    if (ai > 100_000_000) return "Annual income seems unrealistically high.";
    if (st < 0 || st > 20) return "State tax rate must be between 0% and 20%.";
    return null;
  }, [buyPrice, sellPrice, shares, annualIncome, stateTaxRate]);

  /* ─── Result ── */
  const result = useMemo<CalcResult | null>(() => {
    if (validationError) return null;
    const bp = parseFloat(buyPrice);
    const sp = parseFloat(sellPrice);
    const sh = parseInt(shares);
    const ai = parseFloat(annualIncome) || 0;
    const st = parseFloat(stateTaxRate) || 0;
    if ([bp, sp, sh].some(isNaN)) return null;
    const res = calculate(bp, sp, sh, isLongTerm, filingStatus, ai, st);
    if (!res.isLoss) debouncedTrack(res.gain, res.totalTax, res.effectiveRate);
    return res;
  }, [buyPrice, sellPrice, shares, isLongTerm, filingStatus, annualIncome, stateTaxRate, validationError, debouncedTrack]);

  /* ─── Chart data ── */
  const chartData = useMemo(() => {
    if (!result || result.isLoss) return [];
    const items = [
      { name: "Net Profit", value: Math.round(result.netProfit), color: "var(--positive)" },
      { name: "Federal Tax", value: Math.round(result.federalTax), color: "var(--accent)" },
    ];
    if (result.niit > 0)
      items.push({ name: "NIIT (3.8%)", value: Math.round(result.niit), color: "#f59e0b" });
    if (result.stateTax > 0)
      items.push({ name: "State Tax", value: Math.round(result.stateTax), color: "var(--border-strong)" });
    return items;
  }, [result]);

  /* ─── Short-term warning ── */
  const shortTermWarning = !isLongTerm && result && !result.isLoss && result.federalRate > 15;

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <div className="bg-[var(--bg-subtle)] border-b-[1px] border-b-[var(--border)] p-[90px_48px_48px] max-md:p-[80px_20px_28px]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="flex items-center justify-center w-fit gap-[6px] bg-[var(--accent-bg)] border-[1px] border-[var(--accent-border)] rounded-[100px] p-[4px_12px] font-sans text-[11px] font-[500] text-[var(--accent)] tracking-[0.5px] m-[0_auto_16px]">
            <Receipt size={13} />
            <span>Capital Gains Tax Calculator</span>
          </div>
          <h1 className="font-sans font-[400] tracking-[-2px] leading-[1.05] text-[var(--text-primary)] m-[0_auto_20px] max-w-[860px] text-center text-[clamp(48px,6vw,72px)] max-md:text-[32px] max-md:tracking-[0px]">
            Estimate your{" "}
            <span className="relative inline-block text-[var(--accent)]">
              capital gains tax
              <CurvedUnderline />
            </span>{" "}
            before you sell.
          </h1>
          <p className="font-sans text-[16px] max-md:text-[14px] text-[var(--text-muted)] leading-[1.7] max-w-[780px] m-[auto] text-center">
            Calculate your 2024 federal capital gains tax on any stock or
            investment sale. Includes long-term and short-term rates, the 3.8%
            Net Investment Income Tax, and optional state tax. See your exact
            net profit after all taxes.
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
                <h2 className="font-sans text-[10px] font-[500] tracking-[1.5px] uppercase text-[var(--accent)] m-[0]">
                  Your sale
                </h2>

                {/* Buy / Sell prices */}
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[8px]">
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                      Purchase Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                      <input type="number" inputMode="decimal"
                        className="input-field min-h-[46px] !pl-[22px]"
                        placeholder="50.00" value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                      Sale Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                      <input type="number" inputMode="decimal"
                        className="input-field min-h-[46px] !pl-[22px]"
                        placeholder="120.00" value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Shares */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                    Number of Shares
                  </label>
                  <input type="number" inputMode="numeric"
                    className="input-field min-h-[46px]"
                    placeholder="100" min={1} value={shares}
                    onChange={(e) => setShares(e.target.value)} />
                  {result && !result.isLoss && (
                    <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                      Cost basis: <span className="text-[var(--text-secondary)]">{fmt(result.costBasis)}</span>
                      {" · "}Proceeds: <span className="text-[var(--text-secondary)]">{fmt(result.proceeds)}</span>
                    </div>
                  )}
                </div>

                {/* Holding period */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                    Holding Period
                  </label>
                  <HoldingToggle isLongTerm={isLongTerm} onChange={setIsLongTerm} />
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                    {isLongTerm
                      ? "Held > 1 year — qualifies for preferential long-term rates (0%, 15%, 20%)"
                      : "Held ≤ 1 year — taxed as ordinary income (10%–37%)"}
                  </div>
                </div>

                {/* Short-term warning */}
                {shortTermWarning && (
                  <div className="calc-fade-in flex gap-[10px] p-[10px_12px] bg-[#fefce8] border border-[#fde68a] rounded-xl">
                    <Info size={14} className="text-[#ca8a04] shrink-0 mt-[2px]" />
                    <p className="font-sans text-[12px] text-[#92400e] leading-[1.5] m-0">
                      Waiting until your 1-year holding date qualifies this
                      gain for long-term rates — potentially cutting your tax
                      bill significantly.
                    </p>
                  </div>
                )}

                <div className="border-t border-[var(--border)]" />

                {/* Filing status */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                    Filing Status
                  </label>
                  <select
                    className="input-field min-h-[46px] font-ubuntu cursor-pointer"
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
                  >
                    {(Object.entries(FILING_STATUS_LABELS) as [FilingStatus, string][]).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Annual income */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-muted)]">
                    Annual Taxable Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                    <input type="number" inputMode="decimal"
                      className="input-field min-h-[46px] !pl-[22px]"
                      placeholder="80,000" value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value)} />
                  </div>
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                    Excluding this gain — used to determine your tax bracket
                  </div>
                </div>

                {/* State tax rate */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)] flex items-center gap-[8px]">
                    State Tax Rate
                    <span className="text-[10px] font-[400] text-[var(--text-faint)] bg-[var(--bg-muted)] rounded-[4px] p-[1px_6px]">optional</span>
                  </label>
                  <div className="relative">
                    <input type="number" inputMode="decimal"
                      className="input-field min-h-[46px] pr-[36px]"
                      placeholder="0" min={0} max={20} value={stateTaxRate}
                      onChange={(e) => setStateTaxRate(e.target.value)} />
                    <span className="absolute right-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">%</span>
                  </div>
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                    CA: 13.3% · NY: 10.9% · TX/FL: 0% · Leave blank to show federal only
                  </div>
                </div>

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

              {/* Capital loss banner */}
              {result?.isLoss && (
                <div className="calc-fade-in flex gap-[10px] p-[14px_16px] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl mb-[16px]">
                  <TrendingDown size={16} className="text-[var(--text-faint)] shrink-0 mt-[1px]" />
                  <div>
                    <p className="font-sans text-[13px] font-[600] text-[var(--text-primary)] m-0 mb-[3px]">
                      Capital Loss: {fmt(result.gain)}
                    </p>
                    <p className="font-sans text-[12px] text-[var(--text-muted)] m-0 leading-[1.5]">
                      No tax owed. You can use this loss to offset other capital
                      gains this year, or deduct up to $3,000 against ordinary
                      income. Carry forward any excess to future years.
                    </p>
                  </div>
                </div>
              )}

              {/* Result cards */}
              {!result?.isLoss && (
                <>
                  <div className="grid grid-cols-[1fr_1fr] md:max-lg:grid-cols-[repeat(3,1fr)] max-md:grid-cols-[1fr] gap-[12px] max-md:gap-[8px] mb-[16px]">
                    {[
                      {
                        label: "Total Capital Gain",
                        value: result ? fmt(result.gain) : "—",
                        color: "var(--positive)",
                        large: true,
                      },
                      {
                        label: "Total Tax Owed",
                        value: result ? fmt(result.totalTax) : "—",
                        color: "var(--negative, #e11d48)",
                        large: false,
                      },
                      {
                        label: "Net Profit After Tax",
                        value: result ? fmt(result.netProfit) : "—",
                        color: "var(--accent)",
                        large: false,
                      },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className={`card flex flex-col gap-[6px] p-[20px_22px] ${card.large ? "col-[1/-1] max-lg:col-auto p-[24px_28px]" : ""}`}
                        style={{ opacity: result ? 1 : 0.4, transition: "opacity 0.3s ease" }}
                      >
                        <span className="font-sans text-[10px] font-[500] tracking-[1.2px] uppercase text-[var(--text-faint)]">
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

                  {/* Rate breakdown bar */}
                  {result && (
                    <div className="calc-fade-in card p-[18px_22px] mb-[16px]">
                      <div className="flex flex-wrap gap-x-[28px] gap-y-[12px]">
                        <div className="flex flex-col gap-[3px]">
                          <span className="font-sans text-[10px] uppercase tracking-[1px] text-[var(--text-faint)]">Effective total rate</span>
                          <span className="font-sans text-[20px] font-[600] text-[var(--text-primary)]">{pct(result.effectiveRate)}</span>
                        </div>
                        <div className="flex flex-col gap-[3px]">
                          <span className="font-sans text-[10px] uppercase tracking-[1px] text-[var(--text-faint)]">Federal rate</span>
                          <span className="font-sans text-[20px] font-[600] text-[var(--accent)]">
                            {isLongTerm && result.ltcgRate !== null
                              ? `${(result.ltcgRate * 100).toFixed(0)}% LTCG`
                              : pct(result.federalRate)}
                          </span>
                        </div>
                        {result.niitApplies && (
                          <div className="flex flex-col gap-[3px]">
                            <span className="font-sans text-[10px] uppercase tracking-[1px] text-[var(--text-faint)]">NIIT</span>
                            <span className="font-sans text-[20px] font-[600] text-[#f59e0b]">3.8%</span>
                          </div>
                        )}
                        {result.stateTax > 0 && (
                          <div className="flex flex-col gap-[3px]">
                            <span className="font-sans text-[10px] uppercase tracking-[1px] text-[var(--text-faint)]">State rate</span>
                            <span className="font-sans text-[20px] font-[600] text-[var(--text-secondary)]">{stateTaxRate}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* NIIT notice */}
                  {result?.niitApplies && (
                    <div className="calc-fade-in flex gap-[10px] p-[10px_14px] bg-[#fffbeb] border border-[#fde68a] rounded-xl mb-[16px]">
                      <Info size={14} className="text-[#ca8a04] shrink-0 mt-[2px]" />
                      <p className="font-sans text-[12px] text-[#92400e] leading-[1.5] m-0">
                        <strong className="font-semibold">Net Investment Income Tax applies.</strong>{" "}
                        Your income including this gain exceeds the{" "}
                        {filingStatus === "married_joint" ? "$250,000" : "$200,000"} NIIT threshold.
                        An additional 3.8% applies to{" "}
                        <strong className="font-semibold">{fmt(result.niit / 0.038)}</strong> of your gain —
                        adding <strong className="font-semibold">{fmt(result.niit)}</strong> to your tax bill.
                      </p>
                    </div>
                  )}

                  {/* Bar chart */}
                  {chartData.length > 0 && (
                    <div className="card p-[20px_20px_16px] calc-slide-up">
                      <div className="flex items-center justify-between mb-[16px]">
                        <span className="font-sans text-[10px] font-[500] tracking-[1.2px] uppercase text-[var(--text-faint)]">
                          Where your money goes
                        </span>
                      </div>
                      <div className="w-[100%] h-[200px] [&_svg]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_*:focus]:outline-none">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={48}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false}
                              tick={{ fontSize: 11, fill: "var(--text-faint)", fontFamily: "DM Sans" }} />
                            <YAxis axisLine={false} tickLine={false}
                              tick={{ fontSize: 10, fill: "var(--text-faint)", fontFamily: "DM Sans" }}
                              tickFormatter={fmtK} width={52} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-muted)" }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                              {chartData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── SEO Section ── */}
      <div className="section-wrapper bg-[var(--bg-base)]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="section-header">
            <span className="section-eyebrow">{"// WHAT IS CAPITAL GAINS TAX"}</span>
            <h2 className="section-heading">The tax you owe when an investment pays off.</h2>
          </div>
          <div className="grid grid-cols-[1fr_400px] max-lg:grid-cols-1 gap-[48px] items-start">
            {/* Left Column: Prose */}
            <div className="flex flex-col gap-[24px]">
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                A capital gain is the profit you make when you sell an investment for more than you paid for it. The IRS taxes that profit — but at very different rates depending on one factor: how long you held the asset. Hold for more than one year and you qualify for long-term capital gains rates of 0%, 15%, or 20%. Sell within a year and the profit is taxed as ordinary income, the same rate as your salary — up to 37% in 2024.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                Your tax bracket is determined by your total taxable income including the gain. Your ordinary income fills the brackets first, and the capital gain is stacked on top. This means a $50,000 gain on top of a $100,000 salary is taxed differently than the same gain on top of a $40,000 salary. Income matters as much as the gain itself.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                High-income investors face an additional layer: the Net Investment Income Tax (NIIT) adds 3.8% on top of the regular rate once your income exceeds $200,000 as a single filer or $250,000 married filing jointly. Combined with the top 20% long-term rate, the maximum effective federal rate on long-term gains is 23.8% — before any state tax. This calculator shows your complete picture.
              </p>
            </div>

            {/* Right Column: Stat Cards */}
            <div className="grid grid-cols-1 md:max-lg:grid-cols-3 gap-[16px]">
              {/* Card 1 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">0%</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Minimum long-term capital gains rate</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">For single filers with income up to $47,025 in 2024</div>
              </div>
              {/* Card 2 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">23.8%</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Maximum federal rate on long-term gains</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">20% LTCG rate plus 3.8% NIIT for high-income investors</div>
              </div>
              {/* Card 3 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">1 year</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">The holding period that changes everything</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">One extra day past 12 months can cut your tax rate in half</div>
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
            <h2 className="section-heading text-[clamp(32px,4vw,48px)]">2024 capital gains tax rates.</h2>
          </div>

          {/* LTCG brackets table */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-[28px_32px] max-md:p-[24px_20px] mb-[16px]">
            <div className="font-sans text-[11px] font-[600] tracking-[1.2px] uppercase text-[var(--accent)] mb-[20px]">
              Long-Term Capital Gains — 2024 Brackets
            </div>
            
            {/* Desktop Table */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-[100%] border-collapse font-sans text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {["Rate", "Single", "Married Joint", "Head of Household"].map((h) => (
                      <th key={h} className="text-left pb-[10px] pr-[20px] font-sans text-[10px] uppercase tracking-[1px] text-[var(--text-faint)] font-[500]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rate: "0%",  single: "≤ $47,025",   mj: "≤ $94,050",   hoh: "≤ $63,000"  },
                    { rate: "15%", single: "≤ $518,900",  mj: "≤ $583,750",  hoh: "≤ $551,350" },
                    { rate: "20%", single: "> $518,900",  mj: "> $583,750",  hoh: "> $551,350" },
                  ].map((row) => (
                    <tr key={row.rate} className="border-b border-[var(--border)] last:border-0">
                      <td className="py-[12px] pr-[20px] font-sans font-[600] text-[var(--accent)] text-[15px]">{row.rate}</td>
                      <td className="py-[12px] pr-[20px] text-[var(--text-muted)]">{row.single}</td>
                      <td className="py-[12px] pr-[20px] text-[var(--text-muted)]">{row.mj}</td>
                      <td className="py-[12px] text-[var(--text-muted)]">{row.hoh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-[16px] md:hidden">
              {[
                { rate: "0%",  single: "≤ $47,025",   mj: "≤ $94,050",   hoh: "≤ $63,000"  },
                { rate: "15%", single: "≤ $518,900",  mj: "≤ $583,750",  hoh: "≤ $551,350" },
                { rate: "20%", single: "> $518,900",  mj: "> $583,750",  hoh: "> $551,350" },
              ].map((row) => (
                <div key={row.rate} className="flex flex-col gap-[10px] p-[16px] bg-[var(--bg-subtle)] rounded-[12px] border border-[var(--border)]">
                  <div className="flex justify-between items-center border-b border-[var(--border)] pb-[8px] mb-[4px]">
                    <span className="font-sans text-[10px] font-[600] uppercase tracking-[1px] text-[var(--text-faint)]">Tax Rate</span>
                    <span className="font-sans font-[700] text-[18px] text-[var(--accent)]">{row.rate}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-[12px] gap-y-[8px]">
                    <div className="flex flex-col">
                      <span className="font-sans text-[9px] uppercase tracking-[0.5px] text-[var(--text-faint)]">Single</span>
                      <span className="font-sans text-[13px] text-[var(--text-primary)] font-[500]">{row.single}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-[9px] uppercase tracking-[0.5px] text-[var(--text-faint)]">Married Joint</span>
                      <span className="font-sans text-[13px] text-[var(--text-primary)] font-[500]">{row.mj}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-[9px] uppercase tracking-[0.5px] text-[var(--text-faint)]">Head of Household</span>
                      <span className="font-sans text-[13px] text-[var(--text-primary)] font-[500]">{row.hoh}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key rules */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-[28px_32px] max-md:p-[24px_20px] mb-[24px]">
            <div className="font-sans text-[11px] font-[600] tracking-[1.2px] uppercase text-[var(--accent)] mb-[20px]">
              Tax Filing Rules & Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] max-md:gap-[20px]">
              {[
                { 
                  label: "Gains stack on top", 
                  desc: "Your ordinary income fills the brackets first. Capital gains are taxed starting from where your income leaves off — not from $0.",
                  icon: <TrendingDown size={18} className="text-[var(--accent)]" />
                },
                { 
                  label: "Short-term = income rate", 
                  desc: "Assets held 1 year or less are taxed at your ordinary income rate (10%–37%). No preferential treatment applies here.",
                  icon: <AlertTriangle size={18} className="text-[var(--accent)]" />
                },
                { 
                  label: "NIIT: +3.8% Surcharge", 
                  desc: "High earners (>$200k single / $250k joint) owe an extra 3.8% on investment income to fund Medicare programs.",
                  icon: <Info size={18} className="text-[var(--accent)]" />
                },
                { 
                  label: "State tax is separate", 
                  desc: "Most states tax gains as ordinary income. California (13.3%) and New York (10.9%) are highest; others have none.",
                  icon: <Receipt size={18} className="text-[var(--accent)]" />
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-[16px] p-[4px]">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-[var(--accent-bg)] border border-[var(--accent-border)] flex items-center justify-center shrink-0 mt-[2px]">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-sans text-[14px] font-[600] text-[var(--text-primary)] m-[0_0_4px]">{item.label}</h4>
                    <p className="font-sans text-[13px] text-[var(--text-muted)] leading-[1.6] m-0">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="font-sans text-[14px] text-[var(--text-faint)] leading-[1.7] max-w-[680px] italic">
            This calculator estimates federal tax only unless you enter a state rate. It does not account for AMT,
            qualified opportunity zones, installment sales, or wash sale rules.
            Consult a tax professional before making final decisions.
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
              <a key={tool.name} href={tool.href}
                onClick={() => trackRelatedToolClick({
                  from_calculator: "capital_gains_tax",
                  to_calculator: tool.name.toLowerCase().replace(/\s+/g, "_"),
                  href: tool.href,
                })}
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