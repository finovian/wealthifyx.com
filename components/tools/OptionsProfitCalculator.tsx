"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Activity, ArrowRight, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { faqs, relatedTools } from "@/constants/options-profit";
import FAQSection from "../FAQSection";
import {
  trackCalculatorResult,
  trackRelatedToolClick,
  debounce,
} from "@/lib/analytics";

/* ─── Types ─────────────────────────────────────────────── */
type PositionType = "long_call" | "long_put" | "short_call" | "short_put";

interface CalcResult {
  pnlAtTarget: number;
  breakeven: number;
  maxProfit: number | null;   // null = unlimited
  maxLoss: number | null;     // null = unlimited
  totalCost: number;          // premium paid (long) or received (short)
  roi: number | null;         // null for short positions (credit received, roi undefined)
  isProfit: boolean;
  chartData: { price: number; pnl: number }[];
  beNegative: boolean;        // breakeven below 0 — degenerate position
}

/* ─── Formula ────────────────────────────────────────────── */
function calcResult(
  positionType: PositionType,
  strikePrice: number,
  premiumPerShare: number,
  contracts: number,
  targetPrice: number,
): CalcResult {
  const mult = 100 * contracts;
  const totalCost = premiumPerShare * mult;

  let pnl: number;
  let breakeven: number;
  let maxProfit: number | null;
  let maxLoss: number | null;

  switch (positionType) {
    case "long_call":
      pnl = (Math.max(0, targetPrice - strikePrice) - premiumPerShare) * mult;
      breakeven = strikePrice + premiumPerShare;
      maxProfit = null; // unlimited
      maxLoss = -totalCost;
      break;
    case "long_put":
      pnl = (Math.max(0, strikePrice - targetPrice) - premiumPerShare) * mult;
      breakeven = strikePrice - premiumPerShare;
      maxProfit = (strikePrice - premiumPerShare) * mult; // stock → 0
      maxLoss = -totalCost;
      break;
    case "short_call":
      pnl = (premiumPerShare - Math.max(0, targetPrice - strikePrice)) * mult;
      breakeven = strikePrice + premiumPerShare;
      maxProfit = totalCost;
      maxLoss = null; // unlimited
      break;
    case "short_put":
      pnl = (premiumPerShare - Math.max(0, strikePrice - targetPrice)) * mult;
      breakeven = strikePrice - premiumPerShare;
      maxProfit = totalCost;
      maxLoss = -(strikePrice - premiumPerShare) * mult; // stock → 0
      break;
  }

  // Chart: 50 price points spanning strike ×0.45 → ×1.75
  const low = Math.max(0.01, strikePrice * 0.45);
  const high = strikePrice * 1.75;
  const step = (high - low) / 50;
  const chartData = [];
  for (let i = 0; i <= 50; i++) {
    const S = low + i * step;
    let p: number;
    switch (positionType) {
      case "long_call":  p = (Math.max(0, S - strikePrice) - premiumPerShare) * mult; break;
      case "long_put":   p = (Math.max(0, strikePrice - S) - premiumPerShare) * mult; break;
      case "short_call": p = (premiumPerShare - Math.max(0, S - strikePrice)) * mult; break;
      case "short_put":  p = (premiumPerShare - Math.max(0, strikePrice - S)) * mult; break;
    }
    chartData.push({ price: Math.round(S * 100) / 100, pnl: Math.round(p) });
  }

  const roi = (positionType === "long_call" || positionType === "long_put")
    ? (pnl / totalCost) * 100
    : null;

  return {
    pnlAtTarget: Math.round(pnl),
    breakeven: Math.round(breakeven * 100) / 100,
    maxProfit: maxProfit !== null ? Math.round(maxProfit) : null,
    maxLoss: maxLoss !== null ? Math.round(maxLoss) : null,
    totalCost: Math.round(totalCost),
    roi: roi !== null ? Math.round(roi * 10) / 10 : null,
    isProfit: pnl > 0,
    chartData,
    beNegative: breakeven < 0,
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

function fmtSigned(n: number) {
  const abs = Math.abs(n);
  const str = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(abs);
  return n >= 0 ? `+${str}` : `-${str}`;
}

function fmtPrice(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtK(v: number) {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return `${sign}$${abs}`;
}

const POSITIONS: { value: PositionType; label: string; short: string; direction: "buy" | "sell" }[] = [
  { value: "long_call",  label: "Long Call",  short: "Buy Call",  direction: "buy"  },
  { value: "long_put",   label: "Long Put",   short: "Buy Put",   direction: "buy"  },
  { value: "short_call", label: "Short Call", short: "Sell Call", direction: "sell" },
  { value: "short_put",  label: "Short Put",  short: "Sell Put",  direction: "sell" },
];

/* ─── Custom Tooltip ─────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const pnl = payload[0]?.value as number;
  const isPos = pnl >= 0;
  return (
    <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[10px] p-[12px_16px] font-sans text-[12px] shadow-[var(--shadow-md)] min-w-[160px]">
      <div className="text-[var(--text-faint)] mb-[8px] text-[11px]">
        Stock @ {fmtPrice(label)}
      </div>
      <div className="flex justify-between gap-[16px]">
        <span style={{ color: isPos ? "var(--positive)" : "var(--negative, #e11d48)" }}>
          P&L
        </span>
        <span
          className="font-[600]"
          style={{ color: isPos ? "var(--positive)" : "var(--negative, #e11d48)" }}
        >
          {fmtSigned(pnl)}
        </span>
      </div>
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

/* ─── Position selector ─────────────────────────────────── */
function PositionSelector({
  value,
  onChange,
}: {
  value: PositionType;
  onChange: (v: PositionType) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-[6px]">
      {POSITIONS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`h-[42px] border-[1px] rounded-[8px] font-ubuntu text-[12px] font-[500] cursor-pointer transition-all duration-[0.15s] flex flex-col items-center justify-center gap-[1px] ${
            value === p.value
              ? "bg-[var(--accent)] border-[var(--accent)] text-[#fff] font-[700]"
              : "border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)]"
          }`}
        >
          <span className="text-[12px] font-[600]">{p.label}</span>
          <span
            className={`text-[10px] font-[400] ${
              value === p.value ? "text-[rgba(255,255,255,0.75)]" : "text-[var(--text-faint)]"
            }`}
          >
            {p.direction === "buy" ? "Pay premium" : "Receive premium"}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function OptionsProfitCalculator() {
  const [positionType, setPositionType] = useState<PositionType>("long_call");
  const [strikePrice, setStrikePrice] = useState("150");
  const [premiumPerShare, setPremiumPerShare] = useState("5");
  const [contracts, setContracts] = useState("1");
  const [targetPrice, setTargetPrice] = useState("165");

  /* ─── GA4 ── */
  const debouncedTrack = useMemo(
    () =>
      debounce(
        (pnl: number, posType: string, roi: number | null) => {
          trackCalculatorResult({
            calculator_name: "options_profit",
            final_balance: Math.round(pnl),
            years: 0,
            rate: roi ?? 0,
            has_contributions: false,
          });
        },
        1500,
      ),
    [],
  );

  /* ─── Validation ── */
  const validationError = useMemo((): string | null => {
    const k = parseFloat(strikePrice);
    const p = parseFloat(premiumPerShare);
    const c = parseInt(contracts);
    const t = parseFloat(targetPrice);

    if (isNaN(k) || k <= 0) return "Strike price must be above $0.";
    if (isNaN(p) || p <= 0) return "Premium must be above $0.";
    if (p >= k) return "Premium cannot exceed the strike price.";
    if (isNaN(c) || c < 1 || c > 1000) return "Contracts must be between 1 and 1,000.";
    if (isNaN(t) || t < 0) return "Target stock price cannot be negative.";
    if (t > k * 10) return "Target price is unusually high. Double-check your inputs.";
    return null;
  }, [strikePrice, premiumPerShare, contracts, targetPrice]);

  /* ─── Unlimited risk warning ── */
  const unlimitedRiskWarning =
    positionType === "short_call"
      ? "Short calls carry theoretically unlimited loss. Your loss grows without a ceiling if the stock keeps rising above the breakeven price."
      : null;

  /* ─── Result ── */
  const result = useMemo<CalcResult | null>(() => {
    if (validationError) return null;
    const k = parseFloat(strikePrice);
    const p = parseFloat(premiumPerShare);
    const c = parseInt(contracts);
    const t = parseFloat(targetPrice);
    if (isNaN(k) || isNaN(p) || isNaN(c) || isNaN(t)) return null;
    const res = calcResult(positionType, k, p, c, t);
    debouncedTrack(res.pnlAtTarget, positionType, res.roi);
    return res;
  }, [positionType, strikePrice, premiumPerShare, contracts, targetPrice, validationError, debouncedTrack]);

  const isShort = positionType === "short_call" || positionType === "short_put";

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <div className="bg-[var(--bg-subtle)] border-b-[1px] border-b-[var(--border)] p-[90px_48px_48px] max-md:p-[80px_20px_28px]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="flex items-center justify-center w-fit gap-[6px] bg-[var(--accent-bg)] border-[1px] border-[var(--accent-border)] rounded-[100px] p-[4px_12px] font-sans text-[11px] font-[500] text-[var(--accent)] tracking-[0.5px] m-[0_auto_16px]">
            <Activity size={13} />
            <span>Options Profit Calculator</span>
          </div>
          <h1 className="font-sans font-[400] tracking-[-2px] leading-[1.05] text-[var(--text-primary)] m-[0_auto_20px] max-w-[860px] text-center text-[clamp(48px,6vw,72px)] max-md:text-[32px] max-md:tracking-[0px]">
            Calculate{" "}
            <span className="relative inline-block text-[var(--accent)]">
              options profit
              <CurvedUnderline />
            </span>{" "}
            and max risk before you trade.
          </h1>
          <p className="font-sans text-[16px] max-md:text-[14px] text-[var(--text-muted)] leading-[1.7] max-w-[780px] m-[auto] text-center">
            Calculate profit, loss, breakeven, and maximum risk at expiry for
            long calls, long puts, short calls, and short puts. See the full
            P&L chart across every expiry price — before you place the trade.
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
                <h2 className="font-sans text-[10px] font-[600] tracking-[1px] uppercase text-[var(--accent)] m-[0]">
                  Your trade
                </h2>

                {/* Position type */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                    Position Type
                  </label>
                  <PositionSelector value={positionType} onChange={setPositionType} />
                </div>

                {/* Unlimited risk warning */}
                {unlimitedRiskWarning && (
                  <div className="calc-fade-in flex gap-[10px] p-[10px_12px] bg-[#fff1f2] border border-[#fecdd3] rounded-xl">
                    <AlertTriangle size={14} className="text-[#e11d48] shrink-0 mt-[2px]" />
                    <p className="font-sans text-[12px] text-[#9f1239] leading-[1.5] m-0">
                      {unlimitedRiskWarning}
                    </p>
                  </div>
                )}

                <div className="border-t border-[var(--border)]" />

                {/* Strike price */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                    Strike Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] !pl-[22px]"
                      placeholder="150.00"
                      value={strikePrice}
                      onChange={(e) => setStrikePrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* Premium per share */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                    Premium Per Share
                  </label>
                  <div className="relative">
                    <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] !pl-[22px]"
                      placeholder="5.00"
                      value={premiumPerShare}
                      onChange={(e) => setPremiumPerShare(e.target.value)}
                    />
                  </div>
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                    {isShort ? "Premium received per share · 1 contract = 100 shares" : "Premium paid per share · 1 contract = 100 shares"}
                  </div>
                </div>

                {/* Contracts */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-muted)]">
                    Number of Contracts
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    className="input-field min-h-[46px]"
                    placeholder="1"
                    min={1}
                    value={contracts}
                    onChange={(e) => setContracts(e.target.value)}
                  />
                  {result && (
                    <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                      {isShort ? "Total credit received: " : "Total premium paid: "}
                      <span className="text-[var(--text-secondary)]">{fmt(result.totalCost)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[var(--border)]" />

                {/* Target price */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">
                    Target Stock Price at Expiry
                  </label>
                  <div className="relative">
                    <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="input-field min-h-[46px] !pl-[22px]"
                      placeholder="165.00"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                    />
                  </div>
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                    Where do you expect the stock to be at expiry?
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

              {/* Result cards */}
              <div className="grid grid-cols-[1fr_1fr] md:max-lg:grid-cols-[repeat(3,1fr)] max-md:grid-cols-[1fr] gap-[12px] max-md:gap-[8px] mb-[16px]">
                {/* P&L at target — large card */}
                <div
                  className="card col-[1/-1] max-lg:col-auto flex flex-col gap-[6px] p-[24px_28px]"
                  style={{ opacity: result ? 1 : 0.4, transition: "opacity 0.3s ease" }}
                >
                  <div className="flex items-center gap-[8px]">
                    <span className="font-sans text-[10px] font-[500] tracking-[1.2px] uppercase text-[var(--text-faint)]">
                      P&L at Target Price
                    </span>
                    {result && (
                      result.isProfit
                        ? <TrendingUp size={13} className="text-[var(--positive)]" />
                        : <TrendingDown size={13} style={{ color: "var(--negative, #e11d48)" }} />
                    )}
                  </div>
                  <span
                    className="font-sans font-[500] leading-[1.1] text-[40px] max-md:text-[32px] md:max-lg:text-[28px]"
                    style={{
                      color: result
                        ? result.isProfit
                          ? "var(--positive)"
                          : "var(--negative, #e11d48)"
                        : "var(--text-faint)",
                    }}
                  >
                    {result ? fmtSigned(result.pnlAtTarget) : "—"}
                  </span>
                  {result?.roi !== null && result?.roi !== undefined && (
                    <span
                      className="font-sans text-[13px]"
                      style={{ color: result.roi >= 0 ? "var(--positive)" : "var(--negative, #e11d48)" }}
                    >
                      {result.roi >= 0 ? "+" : ""}{result.roi}% ROI
                    </span>
                  )}
                </div>

                {/* Breakeven */}
                <div
                  className="card flex flex-col gap-[6px] p-[20px_22px]"
                  style={{ opacity: result ? 1 : 0.4, transition: "opacity 0.3s ease" }}
                >
                  <span className="font-sans text-[10px] font-[500] tracking-[1.2px] uppercase text-[var(--text-faint)]">
                    Breakeven Price
                  </span>
                  <span className="font-sans font-[500] leading-[1.1] text-[28px] max-md:text-[22px] text-[var(--accent)]">
                    {result
                      ? result.beNegative
                        ? "None"
                        : fmtPrice(result.breakeven)
                      : "—"}
                  </span>
                </div>

                {/* Max profit */}
                <div
                  className="card flex flex-col gap-[6px] p-[20px_22px]"
                  style={{ opacity: result ? 1 : 0.4, transition: "opacity 0.3s ease" }}
                >
                  <span className="font-sans text-[10px] font-[500] tracking-[1.2px] uppercase text-[var(--text-faint)]">
                    Max Profit
                  </span>
                  <span className="font-sans font-[500] leading-[1.1] text-[28px] max-md:text-[22px] text-[var(--positive)]">
                    {result
                      ? result.maxProfit === null
                        ? "Unlimited"
                        : fmt(result.maxProfit)
                      : "—"}
                  </span>
                </div>

                {/* Max loss */}
                <div
                  className="card flex flex-col gap-[6px] p-[20px_22px]"
                  style={{ opacity: result ? 1 : 0.4, transition: "opacity 0.3s ease" }}
                >
                  <span className="font-sans text-[10px] font-[500] tracking-[1.2px] uppercase text-[var(--text-faint)]">
                    Max Loss
                  </span>
                  <span
                    className="font-sans font-[500] leading-[1.1] text-[28px] max-md:text-[22px]"
                    style={{ color: "var(--negative, #e11d48)" }}
                  >
                    {result
                      ? result.maxLoss === null
                        ? "Unlimited"
                        : fmt(result.maxLoss)
                      : "—"}
                  </span>
                </div>
              </div>

              {/* P&L Chart */}
              {result && result.chartData.length > 1 && (
                <div className="card p-[20px_20px_16px] calc-slide-up">
                  <div className="flex items-center justify-between mb-[16px]">
                    <span className="font-sans text-[10px] font-[500] tracking-[1.2px] uppercase text-[var(--text-faint)]">
                      P&L at expiry vs stock price
                    </span>
                    <div className="flex items-center gap-[12px] font-sans text-[11px] text-[var(--text-muted)]">
                      <div className="flex items-center gap-[4px]">
                        <span className="w-[8px] h-[8px] rounded-[50%] shrink-0 bg-[var(--positive)]" />
                        <span>Profit</span>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <span className="w-[8px] h-[8px] rounded-[50%] shrink-0" style={{ background: "var(--negative, #e11d48)" }} />
                        <span>Loss</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-[100%] h-[240px] [&_svg]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_*:focus]:outline-none [&_*]:focus-visible:outline-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={result.chartData}
                        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                          dataKey="price"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "var(--text-faint)", fontFamily: "DM Sans" }}
                          interval="preserveStartEnd"
                          tickFormatter={(v) => `$${v}`}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "var(--text-faint)", fontFamily: "DM Sans" }}
                          tickFormatter={fmtK}
                          width={56}
                        />
                        {/* Zero line */}
                        <ReferenceLine
                          y={0}
                          stroke="var(--border-strong)"
                          strokeWidth={1.5}
                        />
                        {/* Breakeven */}
                        {!result.beNegative && (
                          <ReferenceLine
                            x={result.breakeven}
                            stroke="var(--accent)"
                            strokeDasharray="4 4"
                            strokeWidth={1.5}
                            label={{
                              value: `BE $${result.breakeven}`,
                              position: "insideTopRight",
                              style: { fontSize: 10, fill: "var(--accent)", fontFamily: "DM Sans" },
                            }}
                          />
                        )}
                        {/* Target price vertical line */}
                        <ReferenceLine
                          x={parseFloat(targetPrice)}
                          stroke="var(--text-faint)"
                          strokeDasharray="3 3"
                          strokeWidth={1}
                          label={{
                            value: "Target",
                            position: "insideTopLeft",
                            style: { fontSize: 10, fill: "var(--text-faint)", fontFamily: "DM Sans" },
                          }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="linear"
                          dataKey="pnl"
                          name="P&L"
                          stroke="var(--accent)"
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{ r: 4, fill: "var(--accent)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Chart legend note */}
                  <div className="flex items-center gap-[16px] mt-[10px] pt-[10px] border-t border-[var(--border)]">
                    <div className="flex items-center gap-[6px]">
                      <span className="w-[16px] h-[1.5px] bg-[var(--accent)] inline-block" />
                      <span className="font-sans text-[10px] text-[var(--text-faint)]">P&L curve</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <span className="w-[16px] h-[1.5px] inline-block" style={{ background: "var(--accent)", opacity: 0.5, borderTop: "1.5px dashed var(--accent)" }} />
                      <span className="font-sans text-[10px] text-[var(--text-faint)]">Breakeven</span>
                    </div>
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
            <span className="section-eyebrow">{"// UNDERSTANDING OPTIONS"}</span>
            <h2 className="section-heading">Know your risk before you place the trade.</h2>
          </div>
          <div className="grid grid-cols-[1fr_400px] max-lg:grid-cols-1 gap-[48px] items-start">
            {/* Left Column: Prose */}
            <div className="flex flex-col gap-[24px]">
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                A stock option gives you the right — but not the obligation — to buy or sell 100 shares of a stock at a fixed price (the strike price) before expiry. A call option profits when the stock rises above the strike. A put option profits when the stock falls below it. Each contract controls 100 shares, so a $5 premium per share costs $500 total — and that premium is your maximum loss on a long position.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                The <strong className="text-[var(--text-primary)] font-[600]">breakeven price</strong> is the stock price at expiry where your trade neither profits nor loses. For a long call it is the strike price plus the premium paid. For a long put it is the strike price minus the premium paid. If the stock lands exactly at breakeven at expiry, your P&L is zero — you recover the cost of the premium but nothing more. Anything above breakeven on a call, or below it on a put, is profit.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                Short options — selling calls or puts — reverse the risk profile entirely. You receive the premium upfront and keep it if the option expires worthless. But a short call carries theoretically unlimited downside if the stock keeps rising above the breakeven price. A short put loses up to the full strike price minus premium if the stock crashes to zero. This calculator shows the complete P&L curve so you can see where every dollar of profit and loss comes from before entering a position.
              </p>
            </div>

            {/* Right Column: Stat Cards */}
            <div className="grid grid-cols-1 md:max-lg:grid-cols-3 gap-[16px]">
              {/* Card 1 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">100</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Shares controlled per contract</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">Every options contract represents exactly 100 shares of the underlying stock</div>
              </div>
              {/* Card 2 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">Defined</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Maximum loss on long options</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">Buying calls or puts limits your maximum loss to the premium paid — nothing more</div>
              </div>
              {/* Card 3 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500]" style={{ color: "var(--negative, #e11d48)" }}>Unlimited</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Maximum loss on short calls</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">Selling uncovered calls exposes you to unlimited loss as the stock price rises</div>
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
            <h2 className="section-heading">Options P&L at expiry.</h2>
          </div>
          <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px] mb-[24px]">
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[24px]">
              {[
                {
                  label: "Long Call",
                  formula: "P&L = (max(0, S − K) − P) × 100 × N",
                  be: "K + P",
                  maxP: "Unlimited",
                  maxL: "−P × 100 × N",
                },
                {
                  label: "Long Put",
                  formula: "P&L = (max(0, K − S) − P) × 100 × N",
                  be: "K − P",
                  maxP: "(K − P) × 100 × N",
                  maxL: "−P × 100 × N",
                },
                {
                  label: "Short Call",
                  formula: "P&L = (P − max(0, S − K)) × 100 × N",
                  be: "K + P",
                  maxP: "P × 100 × N",
                  maxL: "Unlimited",
                },
                {
                  label: "Short Put",
                  formula: "P&L = (P − max(0, K − S)) × 100 × N",
                  be: "K − P",
                  maxP: "P × 100 × N",
                  maxL: "−(K − P) × 100 × N",
                },
              ].map((pos) => (
                <div key={pos.label} className="flex flex-col gap-[10px] pb-[20px] border-b border-[var(--border)] last:border-0 max-md:last:pb-0">
                  <div className="font-sans text-[11px] font-[600] tracking-[1px] uppercase text-[var(--accent)]">{pos.label}</div>
                  <div className="font-mono text-[13px] text-[var(--text-primary)]">{pos.formula}</div>
                  <div className="flex flex-col gap-[4px]">
                    <div className="flex gap-[8px] font-sans text-[13px]">
                      <span className="text-[var(--text-faint)] w-[80px] shrink-0">Breakeven</span>
                      <span className="font-mono text-[var(--accent)]">{pos.be}</span>
                    </div>
                    <div className="flex gap-[8px] font-sans text-[13px]">
                      <span className="text-[var(--text-faint)] w-[80px] shrink-0">Max profit</span>
                      <span className="font-mono text-[var(--positive)]">{pos.maxP}</span>
                    </div>
                    <div className="flex gap-[8px] font-sans text-[13px]">
                      <span className="text-[var(--text-faint)] w-[80px] shrink-0">Max loss</span>
                      <span className="font-mono" style={{ color: "var(--negative, #e11d48)" }}>{pos.maxL}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-[8px] mt-[20px] pt-[20px] border-t border-[var(--border)]">
              {[
                { sym: "S", def: "Stock price at expiry" },
                { sym: "K", def: "Strike price of the option" },
                { sym: "P", def: "Premium per share (paid for long, received for short)" },
                { sym: "N", def: "Number of contracts (1 contract = 100 shares)" },
              ].map((v) => (
                <div key={v.sym} className="flex items-start gap-[16px]">
                  <span className="font-mono text-[13px] font-[500] text-[var(--accent)] w-[24px] shrink-0">{v.sym}</span>
                  <span className="font-sans text-[13px] text-[var(--text-muted)] leading-[1.5]">{v.def}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
            These formulas calculate P&L at expiry only — based on intrinsic
            value. They do not model time decay (theta), implied volatility
            (vega), or delta. Before expiry, an option trades at intrinsic
            value plus time premium — this calculator shows the worst-case and
            best-case outcomes if you hold to expiry.
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
                    from_calculator: "options_profit",
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