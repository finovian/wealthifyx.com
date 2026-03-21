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
import { DollarSign, ArrowRight, AlertTriangle, Info } from "lucide-react";
import { faqs, relatedTools } from "@/constants/dividend";
import FAQSection from "../FAQSection";
import {
  trackCalculatorResult,
  trackRelatedToolClick,
  debounce,
} from "@/lib/analytics";

/* ─── Types ─────────────────────────────────────────────── */
interface ChartPoint {
  year: string;
  portfolioValue: number;
  annualDividend: number;
  cumulativeDividends: number;
  shares: number;
}

interface CalcResult {
  initialInvestment: number;
  finalValue: number;
  finalAnnualIncome: number;
  totalDividendsReceived: number;
  totalReturn: number;
  yieldOnCost: number;
  currentYield: number;
  finalShares: number;
  chartData: ChartPoint[];
}

/* ─── Formula ────────────────────────────────────────────── */
function calculate(
  sharePrice: number,
  shares: number,
  dividendPerShare: number,
  stockGrowthRate: number,
  divGrowthRate: number,
  years: number,
  additionalAnnual: number,
  drip: boolean,
): CalcResult {
  const initialInvestment = sharePrice * shares;
  let currentPrice = sharePrice;
  let currentDPS = dividendPerShare;
  let currentShares = shares;
  let totalDividendsReceived = 0;
  let totalAdditionalInvested = 0;

  const chartData: ChartPoint[] = [
    {
      year: "Y0",
      portfolioValue: Math.round(currentPrice * currentShares),
      annualDividend: Math.round(currentDPS * currentShares),
      cumulativeDividends: 0,
      shares: currentShares,
    },
  ];

  for (let y = 1; y <= years; y++) {
    currentPrice *= 1 + stockGrowthRate / 100;
    currentDPS   *= 1 + divGrowthRate / 100;

    if (drip) {
      // Quarterly reinvestment — 4 compounding periods per year
      for (let q = 0; q < 4; q++) {
        const quarterlyDiv = currentShares * (currentDPS / 4);
        totalDividendsReceived += quarterlyDiv;
        currentShares += quarterlyDiv / currentPrice;
      }
    } else {
      totalDividendsReceived += currentShares * currentDPS;
    }

    if (additionalAnnual > 0) {
      currentShares += additionalAnnual;
      totalAdditionalInvested += additionalAnnual * currentPrice;
    }

    chartData.push({
      year: `Y${y}`,
      portfolioValue: Math.round(currentPrice * currentShares),
      annualDividend: Math.round(currentDPS * currentShares),
      cumulativeDividends: Math.round(totalDividendsReceived),
      shares: Math.round(currentShares * 100) / 100,
    });
  }

  const finalValue     = currentPrice * currentShares;
  const finalAnnualInc = currentDPS   * currentShares;
  const totalCost      = initialInvestment + totalAdditionalInvested;
  const totalReturn    = finalValue + totalDividendsReceived - totalCost;
  const yieldOnCost    = totalCost > 0 ? (finalAnnualInc / totalCost) * 100 : 0;
  const currentYield   = sharePrice > 0 ? (dividendPerShare / sharePrice) * 100 : 0;

  return {
    initialInvestment: Math.round(initialInvestment),
    finalValue:             Math.round(finalValue),
    finalAnnualIncome:      Math.round(finalAnnualInc),
    totalDividendsReceived: Math.round(totalDividendsReceived),
    totalReturn:            Math.round(totalReturn),
    yieldOnCost:   Math.round(yieldOnCost   * 100) / 100,
    currentYield:  Math.round(currentYield  * 100) / 100,
    finalShares:   Math.round(currentShares * 100) / 100,
    chartData,
  };
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
  if (a >= 1_000)     return `${s}$${(a / 1_000).toFixed(0)}k`;
  return `${s}$${a}`;
}
function pct(n: number) {
  return (Math.round(n * 100) / 100).toFixed(2) + "%";
}

/* ─── Custom Tooltip ─────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-[12px_16px] font-sans text-[12px] shadow-[var(--shadow-md)] min-w-[200px]">
      <div className="text-[var(--text-faint)] mb-[8px] text-[11px]">{label}</div>
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
    <svg viewBox="0 0 200 12" preserveAspectRatio="none"
      className="absolute bottom-[-6px] left-[0] w-[100%] h-[12px] overflow-visible" aria-hidden="true">
      <path d="M 2 8 Q 50 2, 100 6 T 198 6" fill="none" stroke="var(--accent)"
        strokeWidth="4" strokeLinecap="round" strokeDasharray="250" strokeDashoffset="250"
        style={{ animation: "drawUnderline 0.8s ease-out 0.5s forwards" }} />
      <style>{`@keyframes drawUnderline { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}

/* ─── DRIP toggle ────────────────────────────────────────── */
function DripToggle({ drip, onChange }: { drip: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex bg-[var(--bg-muted)] border border-[var(--border)] rounded-[10px] p-[3px] gap-[2px]">
      {[
        { label: "With DRIP", sub: "Reinvest dividends", value: true  },
        { label: "Cash Dividends", sub: "Take as income",   value: false },
      ].map((opt) => (
        <button key={String(opt.value)} onClick={() => onChange(opt.value)}
          className={`flex-1 h-[42px] px-[10px] border-none rounded-[8px] font-ubuntu text-[12px] font-[500] cursor-pointer transition-all duration-[0.15s] flex flex-col items-center justify-center gap-[1px] ${
            drip === opt.value
              ? "bg-[var(--accent)] text-[white] shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-transparent hover:bg-[var(--bg-card)]"
          }`}>
          <span className="text-[12px] font-[600]">{opt.label}</span>
          <span className={`text-[10px] font-[400] ${drip === opt.value ? "text-[white]/80" : "text-[var(--text-faint)]"}`}>
            {opt.sub}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ─── Chart toggle ───────────────────────────────────────── */
type ChartView = "value" | "income";

/* ─── Main component ─────────────────────────────────────── */
export default function DividendCalculator() {
  const [sharePrice,      setSharePrice]      = useState("50");
  const [shares,          setShares]          = useState("100");
  const [inputMode,       setInputMode]       = useState<"dps" | "yield">("yield");
  const [dividendYield,   setDividendYield]   = useState("4");
  const [dividendPerShare,setDividendPerShare]= useState("2");
  const [stockGrowth,     setStockGrowth]     = useState("6");
  const [divGrowth,       setDivGrowth]       = useState("5");
  const [years,           setYears]           = useState("20");
  const [additionalShares,setAdditionalShares]= useState("");
  const [drip,            setDrip]            = useState(true);
  const [chartView,       setChartView]       = useState<ChartView>("value");

  /* ─── Derive DPS from yield or vice versa ── */
  const effectiveDPS = useMemo(() => {
    const sp = parseFloat(sharePrice);
    if (inputMode === "yield") {
      const y = parseFloat(dividendYield);
      return !isNaN(sp) && !isNaN(y) && sp > 0 ? (sp * y) / 100 : 0;
    }
    return parseFloat(dividendPerShare) || 0;
  }, [inputMode, sharePrice, dividendYield, dividendPerShare]);

  /* ─── GA4 ── */
  const debouncedTrack = useMemo(() =>
    debounce((finalValue: number, annualIncome: number, yoc: number) => {
      trackCalculatorResult({
        calculator_name: "dividend",
        final_balance: Math.round(finalValue),
        years: parseInt(years),
        rate: yoc,
        has_contributions: drip,
      });
    }, 1500), [years, drip]);

  /* ─── Validation ── */
  const validationError = useMemo((): string | null => {
    const sp  = parseFloat(sharePrice);
    const sh  = parseFloat(shares);
    const sg  = parseFloat(stockGrowth);
    const dg  = parseFloat(divGrowth);
    const y   = parseInt(years);
    const add = parseFloat(additionalShares) || 0;

    if (isNaN(sp) || sp <= 0)  return "Share price must be above $0.";
    if (isNaN(sh) || sh <= 0)  return "Number of shares must be above 0.";
    if (effectiveDPS < 0)      return "Dividend cannot be negative.";
    if (isNaN(sg) || sg < -50) return "Stock growth rate cannot be below −50%.";
    if (sg > 50)               return "Stock growth above 50% is not realistic.";
    if (isNaN(dg) || dg < -50) return "Dividend growth rate cannot be below −50%.";
    if (dg > 50)               return "Dividend growth above 50% is not realistic.";
    if (isNaN(y)  || y < 1)    return "Time horizon must be at least 1 year.";
    if (y > 60)                return "Time horizon cannot exceed 60 years.";
    if (add < 0)               return "Additional shares cannot be negative.";
    if (inputMode === "yield") {
      const dy = parseFloat(dividendYield);
      if (isNaN(dy) || dy < 0)  return "Dividend yield cannot be negative.";
      if (dy > 30)              return "A yield above 30% is likely a data error or unsustainable.";
    } else {
      if (isNaN(effectiveDPS) || effectiveDPS > parseFloat(sharePrice))
        return "Dividend per share cannot exceed the share price.";
    }
    return null;
  }, [sharePrice, shares, effectiveDPS, stockGrowth, divGrowth, years, additionalShares, inputMode, dividendYield]);

  /* ─── High yield warning ── */
  const highYieldWarning = useMemo(() => {
    const dy = inputMode === "yield"
      ? parseFloat(dividendYield)
      : (effectiveDPS / (parseFloat(sharePrice) || 1)) * 100;
    return dy >= 8 && dy < 30;
  }, [inputMode, dividendYield, effectiveDPS, sharePrice]);

  /* ─── Result ── */
  const result = useMemo<CalcResult | null>(() => {
    if (validationError) return null;
    const sp  = parseFloat(sharePrice);
    const sh  = parseFloat(shares);
    const sg  = parseFloat(stockGrowth);
    const dg  = parseFloat(divGrowth);
    const y   = parseInt(years);
    const add = parseFloat(additionalShares) || 0;
    if ([sp, sh, sg, dg, y].some(isNaN)) return null;
    const res = calculate(sp, sh, effectiveDPS, sg, dg, y, add, drip);
    debouncedTrack(res.finalValue, res.finalAnnualIncome, res.yieldOnCost);
    return res;
  }, [sharePrice, shares, effectiveDPS, stockGrowth, divGrowth, years,
      additionalShares, drip, validationError, debouncedTrack]);

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <div className="bg-[var(--bg-subtle)] border-b-[1px] border-b-[var(--border)] p-[90px_48px_48px] max-md:p-[80px_20px_28px]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="flex items-center justify-center w-fit gap-[6px] bg-[var(--accent-bg)] border-[1px] border-[var(--accent-border)] rounded-[100px] p-[4px_12px] font-sans text-[11px] font-[500] text-[var(--accent)] tracking-[0.5px] m-[0_auto_16px]">
            <DollarSign size={13} />
            <span>Dividend Calculator</span>
          </div>
          <h1 className="font-sans font-[400] tracking-[-2px] leading-[1.05] text-[var(--text-primary)] m-[0_auto_20px] max-w-[860px] text-center text-[clamp(48px,6vw,72px)] max-md:text-[32px] max-md:tracking-[0px]">
            Calculate{" "}
            <span className="relative inline-block text-[var(--accent)]">
              dividend income
              <CurvedUnderline />
            </span>{" "}
            and DRIP growth over time.
          </h1>
          <p className="font-sans text-[16px] max-md:text-[14px] text-[var(--text-muted)] leading-[1.7] max-w-[780px] m-[auto] text-center">
            Project dividend income, DRIP compounding, and portfolio value
            growth for any dividend-paying stock or ETF. See your annual
            income, total dividends received, and yield on cost at any time
            horizon.
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
                  Your position
                </h2>

                {/* DRIP toggle */}
                <DripToggle drip={drip} onChange={setDrip} />

                <div className="border-t border-[var(--border)]" />

                {/* Share price + shares */}
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[10px]">
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">Share Price</label>
                    <div className="relative">
                      <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                      <input type="number" inputMode="decimal"
                        className="input-field min-h-[46px] !pl-[22px]"
                        placeholder="50.00" value={sharePrice}
                        onChange={(e) => setSharePrice(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">Shares Owned</label>
                    <input type="number" inputMode="decimal"
                      className="input-field min-h-[46px]"
                      placeholder="100" min={1} value={shares}
                      onChange={(e) => setShares(e.target.value)} />
                  </div>
                </div>

                {/* Dividend input mode */}
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center justify-between">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)]">Dividend</label>
                    <div className="flex bg-[var(--bg-muted)] border border-[var(--border)] rounded-[8px] p-[2px] gap-[2px]">
                      {(["yield", "dps"] as const).map((m) => (
                        <button key={m} onClick={() => setInputMode(m)}
                          className={`h-[26px] border-none px-[10px] rounded-[6px] font-ubuntu text-[11px] font-[500] cursor-pointer transition-all duration-[0.1s] ${
                            inputMode === m
                              ? "bg-[var(--accent)] text-[white] shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                              : "text-[var(--text-faint)] hover:text-[var(--text-muted)] bg-transparent hover:bg-[var(--bg-card)]"
                          }`}>
                          {m === "yield" ? "Yield %" : "Per share"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {inputMode === "yield" ? (
                    <div className="relative">
                      <input type="number" inputMode="decimal"
                        className="input-field min-h-[46px] pr-[36px]"
                        placeholder="4.00" min={0} max={30} value={dividendYield}
                        onChange={(e) => setDividendYield(e.target.value)} />
                      <span className="absolute right-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">%</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <span className="absolute left-[14px] top-[50%] -translate-y-[50%] font-ubuntu text-[14px] text-[var(--text-faint)] pointer-events-none">$</span>
                      <input type="number" inputMode="decimal"
                        className="input-field min-h-[46px] !pl-[22px]"
                        placeholder="2.00" min={0} value={dividendPerShare}
                        onChange={(e) => setDividendPerShare(e.target.value)} />
                    </div>
                  )}
                  {result && (
                    <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                      {inputMode === "yield"
                        ? `= $${(effectiveDPS).toFixed(2)} per share · $${fmt(effectiveDPS * parseFloat(shares || "0"))} / yr today`
                        : `= ${pct((effectiveDPS / (parseFloat(sharePrice) || 1)) * 100)} current yield`}
                    </div>
                  )}
                </div>

                {/* High yield warning */}
                {highYieldWarning && (
                  <div className="calc-fade-in flex gap-[10px] p-[10px_12px] bg-[#fefce8] border border-[#fde68a] rounded-xl">
                    <AlertTriangle size={14} className="text-[#ca8a04] shrink-0 mt-[2px]" />
                    <p className="font-sans text-[12px] text-[#92400e] leading-[1.5] m-0">
                      Yields above 8% often signal elevated risk — a dividend cut or declining share price. Verify the payout ratio and earnings coverage before projecting this yield forward.
                    </p>
                  </div>
                )}

                <div className="border-t border-[var(--border)]" />

                {/* Growth rates */}
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[10px]">
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-muted)]">Stock Growth / yr</label>
                    <div className="relative">
                      <input type="number" inputMode="decimal"
                        className="input-field min-h-[46px] pr-[36px]"
                        placeholder="6" value={stockGrowth}
                        onChange={(e) => setStockGrowth(e.target.value)} />
                      <span className="absolute right-[12px] top-[50%] -translate-y-[50%] font-ubuntu text-[13px] text-[var(--text-faint)] pointer-events-none">%</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-muted)]">Dividend Growth / yr</label>
                    <div className="relative">
                      <input type="number" inputMode="decimal"
                        className="input-field min-h-[46px] pr-[36px]"
                        placeholder="5" value={divGrowth}
                        onChange={(e) => setDivGrowth(e.target.value)} />
                      <span className="absolute right-[12px] top-[50%] -translate-y-[50%] font-ubuntu text-[13px] text-[var(--text-faint)] pointer-events-none">%</span>
                    </div>
                  </div>
                </div>
                <div className="font-sans text-[10px] text-[var(--text-faint)] -mt-[14px]">
                  Dividend Aristocrats avg: ~6–8% div growth · Conservative: 3–4%
                </div>

                {/* Years */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-muted)]">Holding Period (Years)</label>
                  <input type="number" inputMode="numeric"
                    className="input-field min-h-[46px]"
                    placeholder="20" min={1} max={60} value={years}
                    onChange={(e) => setYears(e.target.value)} />
                </div>

                {/* Additional shares */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-ubuntu text-[13px] font-[500] text-[var(--text-secondary)] flex items-center gap-[8px]">
                    Additional Shares / Year
                    <span className="text-[10px] font-[400] text-[var(--text-faint)] bg-[var(--bg-muted)] rounded-[4px] p-[1px_6px]">optional</span>
                  </label>
                  <input type="number" inputMode="decimal"
                    className="input-field min-h-[46px]"
                    placeholder="0" min={0} value={additionalShares}
                    onChange={(e) => setAdditionalShares(e.target.value)} />
                  <div className="font-sans text-[10px] text-[var(--text-faint)] mt-[2px]">
                    Shares you plan to buy each year beyond DRIP
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

              {/* Key metrics bar */}
              {result && (
                <div className="calc-fade-in card p-[18px_22px] mb-[12px]">
                  <div className="flex flex-wrap gap-x-[28px] gap-y-[12px]">
                    {[
                      { label: "Current Yield",  value: pct(result.currentYield),  color: "var(--text-secondary)" },
                      { label: "Yield on Cost",  value: pct(result.yieldOnCost),   color: "var(--accent)"         },
                      { label: "Final Shares",   value: result.finalShares.toLocaleString("en-US", { maximumFractionDigits: 2 }), color: "var(--text-primary)" },
                    ].map((m) => (
                      <div key={m.label} className="flex flex-col gap-[3px]">
                        <span className="font-sans text-[10px] uppercase tracking-[1px] text-[var(--text-faint)]">{m.label}</span>
                        <span className="font-sans text-[20px] font-[600]" style={{ color: m.color }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Result cards */}
              <div className="grid grid-cols-[1fr_1fr] md:max-lg:grid-cols-[repeat(3,1fr)] max-md:grid-cols-[1fr] gap-[12px] max-md:gap-[8px] mb-[16px]">
                {[
                  { label: "Portfolio Value",       value: result ? fmt(result.finalValue)            : "—", color: "var(--positive)",      large: true  },
                  { label: "Annual Dividend Income", value: result ? fmt(result.finalAnnualIncome)     : "—", color: "var(--accent)",         large: false },
                  { label: "Total Dividends Earned", value: result ? fmt(result.totalDividendsReceived): "—", color: "var(--text-secondary)", large: false },
                ].map((card) => (
                  <div key={card.label}
                    className={`card flex flex-col gap-[6px] p-[20px_22px] ${card.large ? "col-[1/-1] max-lg:col-auto p-[24px_28px]" : ""}`}
                    style={{ opacity: result ? 1 : 0.4, transition: "opacity 0.3s ease" }}
                  >
                    <span className="font-sans text-[10px] font-[600] tracking-[1px] uppercase text-[var(--text-faint)]">{card.label}</span>
                    <span className={`font-sans font-[500] leading-[1.1] ${card.large ? "text-[40px] max-md:text-[32px] md:max-lg:text-[28px]" : "text-[28px] max-md:text-[22px]"}`}
                      style={{ color: card.color }}>{card.value}</span>
                  </div>
                ))}
              </div>

              {/* Yield on cost callout */}
              {result && result.yieldOnCost > result.currentYield * 1.5 && (
                <div className="calc-fade-in flex gap-[10px] p-[12px_16px] bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-xl mb-[16px]">
                  <Info size={15} className="text-[var(--accent)] shrink-0 mt-[2px]" />
                  <p className="font-sans text-[13px] text-[var(--text-primary)] leading-[1.55] m-0">
                    Your yield on cost grows to{" "}
                    <strong className="font-semibold text-[var(--accent)]">{pct(result.yieldOnCost)}</strong>{" "}
                    by year {years} — versus your current yield of{" "}
                    <strong className="font-semibold">{pct(result.currentYield)}</strong> today.
                    Dividend growth and{drip ? " DRIP compounding" : " share accumulation"} are doing the work.
                  </p>
                </div>
              )}

              {/* Chart */}
              {result && result.chartData.length > 1 && (
                <div className="card p-[20px_20px_16px] calc-slide-up">
                  <div className="flex items-center justify-between mb-[16px] flex-wrap gap-[8px]">
                    <span className="font-sans text-[10px] font-[600] tracking-[1px] uppercase text-[var(--text-faint)]">
                      {chartView === "value" ? "Portfolio value over time" : "Annual dividend income over time"}
                    </span>
                    <div className="flex bg-[var(--bg-muted)] border border-[var(--border)] rounded-[8px] p-[2px] gap-[2px]">
                      {([
                        { label: "Portfolio", value: "value" },
                        { label: "Income",    value: "income" },
                      ] as { label: string; value: ChartView }[]).map((opt) => (
                        <button key={opt.value} onClick={() => setChartView(opt.value)}
                          className={`h-[26px] border-none px-[10px] rounded-[6px] font-ubuntu text-[11px] font-[500] cursor-pointer transition-all duration-[0.1s] ${
                            chartView === opt.value
                              ? "bg-[var(--accent)] text-[white] shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                              : "text-[var(--text-faint)] hover:text-[var(--text-muted)] bg-transparent hover:bg-[var(--bg-card)]"
                          }`}>{opt.label}</button>
                      ))}
                    </div>
                  </div>

                  <div className="w-[100%] h-[220px] [&_svg]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_*:focus]:outline-none">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartView === "value" ? (
                        <AreaChart data={result.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="gDivValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.25} />
                              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="gDivCumDiv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--border-strong)" stopOpacity={0.35} />
                              <stop offset="100%" stopColor="var(--border-strong)" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                          <XAxis dataKey="year" axisLine={false} tickLine={false}
                            tick={{ fontSize: 11, fill: "var(--text-faint)", fontFamily: "DM Mono" }}
                            interval="preserveStartEnd" />
                          <YAxis axisLine={false} tickLine={false}
                            tick={{ fontSize: 10, fill: "var(--text-faint)", fontFamily: "DM Mono" }}
                            tickFormatter={fmtK} width={52} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="cumulativeDividends" name="Cumul. Dividends"
                            stroke="var(--border-strong)" strokeWidth={1.5} fill="url(#gDivCumDiv)" stackId="1" />
                          <Area type="monotone" dataKey="portfolioValue" name="Portfolio Value"
                            stroke="var(--accent)" strokeWidth={2} fill="url(#gDivValue)" animationDuration={600} />
                        </AreaChart>
                      ) : (
                        <AreaChart data={result.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="gDivIncome" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--positive)" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="var(--positive)" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                          <XAxis dataKey="year" axisLine={false} tickLine={false}
                            tick={{ fontSize: 11, fill: "var(--text-faint)", fontFamily: "DM Mono" }}
                            interval="preserveStartEnd" />
                          <YAxis axisLine={false} tickLine={false}
                            tick={{ fontSize: 10, fill: "var(--text-faint)", fontFamily: "DM Mono" }}
                            tickFormatter={fmtK} width={52} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="annualDividend" name="Annual Income"
                            stroke="var(--positive)" strokeWidth={2} fill="url(#gDivIncome)"
                            animationDuration={600} />
                        </AreaChart>
                      )}
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
            <span className="section-eyebrow">{"// WHAT IS DRIP INVESTING"}</span>
            <h2 className="section-heading">How dividends compound into serious wealth.</h2>
          </div>
          <div className="grid grid-cols-[1fr_400px] max-lg:grid-cols-1 gap-[48px] items-start">
            {/* Left Column: Prose */}
            <div className="flex flex-col gap-[24px]">
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                A dividend is a cash payment a company makes to shareholders — typically every quarter — out of its profits. When you own a dividend-paying stock or ETF, you receive these payments simply for holding shares. A Dividend Reinvestment Plan (DRIP) takes those cash payments and automatically uses them to buy more shares instead. More shares means more dividends next quarter. Those dividends buy more shares. The cycle repeats — this is dividend compounding.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                The longer you hold, the more powerful this becomes. <strong className="text-[var(--text-primary)] font-[600]">Yield on cost</strong> is the metric that shows it most clearly: it measures your annual dividend income as a percentage of your original investment. A stock bought at a 4% yield that grows its dividend at 7% per year doubles its yield on cost in roughly 10 years — meaning you are earning 8% annually on the same dollars you originally invested, regardless of what the stock price does.
              </p>
              <p className="font-sans text-[15px] text-[var(--text-muted)] leading-[1.75] max-w-[680px]">
                <strong className="text-[var(--text-primary)] font-[600]">Dividend Aristocrats</strong> — companies that have raised their dividend every year for 25+ consecutive years — have historically grown dividends at 6 to 8% annually. Combined with share price appreciation and DRIP reinvestment, long-term dividend investors often see their income stream grow faster than inflation every single year. This calculator models all three forces simultaneously: price growth, dividend growth, and reinvestment compounding.
              </p>
            </div>

            {/* Right Column: Stat Cards */}
            <div className="grid grid-cols-1 md:max-lg:grid-cols-3 gap-[16px]">
              {/* Card 1 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">4×</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">DRIP vs cash dividends over 30 years</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">Reinvesting dividends at 4% yield with 6% stock growth produces roughly 4x more wealth than taking cash</div>
              </div>
              {/* Card 2 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">25+</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Years of consecutive dividend growth</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">Required to qualify as a Dividend Aristocrat — the benchmark for dividend reliability</div>
              </div>
              {/* Card 3 */}
              <div className="bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[14px] p-[28px_32px]">
                <div className="font-sans text-[32px] font-[500] text-[var(--accent)]">7%</div>
                <div className="font-sans text-[13px] font-[600] text-[var(--text-primary)] mt-[4px]">Average Dividend Aristocrat growth rate</div>
                <div className="font-sans text-[12px] text-[var(--text-muted)] mt-[4px] leading-[1.5]">Annual dividend growth rate for companies in the S&P 500 Dividend Aristocrats index</div>
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
            <h2 className="section-heading">The DRIP compounding formula.</h2>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-[28px_32px] mb-[24px]">
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[24px] mb-[20px] pb-[20px] border-b border-[var(--border)]">
              <div>
                <div className="font-sans text-[11px] uppercase tracking-[1px] text-[var(--accent)] mb-[10px]">With DRIP (quarterly)</div>
                <div className="font-mono text-[14px] text-[var(--text-primary)] mb-[8px]">
                  New shares = (S × DPS/4) ÷ P
                </div>
                <div className="font-sans text-[13px] text-[var(--text-muted)] leading-[1.6]">
                  Each quarter, your dividend payment buys fractional shares at the current price. Those shares immediately start paying dividends — creating quarterly compounding on top of annual price and dividend growth.
                </div>
              </div>
              <div>
                <div className="font-sans text-[11px] uppercase tracking-[1px] text-[var(--text-faint)] mb-[10px]">Without DRIP (cash)</div>
                <div className="font-mono text-[14px] text-[var(--text-primary)] mb-[8px]">
                  Annual income = S × DPS
                </div>
                <div className="font-sans text-[13px] text-[var(--text-muted)] leading-[1.6]">
                  Dividends are paid as cash. Share count only grows if you manually purchase additional shares. Portfolio value still grows with stock price appreciation and dividend growth.
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              {[
                { sym: "S",   def: "Current shares owned (grows with each DRIP reinvestment)" },
                { sym: "DPS", def: "Annual dividend per share (grows at dividend growth rate each year)" },
                { sym: "P",   def: "Current share price (grows at stock growth rate each year)" },
                { sym: "YOC", def: "Yield on Cost = (Final Annual Income ÷ Original Cost Basis) × 100" },
              ].map((v) => (
                <div key={v.sym} className="flex items-start gap-[16px]">
                  <span className="font-mono text-[13px] font-[500] text-[var(--accent)] w-[36px] shrink-0">{v.sym}</span>
                  <span className="font-sans text-[13px] text-[var(--text-muted)] leading-[1.5]">{v.def}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="font-sans text-[14px] text-[var(--text-faint)] leading-[1.7] max-w-[680px] italic">
            This calculator models pre-tax returns. Qualified dividends are taxed at 0%, 15%, or 20% depending on your income — the same rates as long-term capital gains. Dividends inside a Roth IRA or 401(k) grow tax-free or tax-deferred.
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
                  from_calculator: "dividend",
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