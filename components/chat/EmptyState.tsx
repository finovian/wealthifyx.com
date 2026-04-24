"use client";

import { Sparkles, TrendingUp, PiggyBank, DollarSign, Calculator } from "lucide-react";

const SUGGESTIONS = [
  { text: "How much SIP to retire at 50?", icon: PiggyBank },
  { text: "Calculate compound interest on ₹5L", icon: TrendingUp },
  { text: "What's my capital gains tax?", icon: DollarSign },
  { text: "Compare Roth IRA vs 401k", icon: Calculator },
];

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export default function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[100%] p-[40px_20px] lg:p-[60px_48px] text-center max-w-[800px] mx-auto">
      {/* Icon */}
      <div className="w-[56px] h-[56px] rounded-[18px] bg-[var(--accent-bg)] border-[1.5px] border-[var(--accent-border)] flex items-center justify-center mb-[24px] shadow-sm">
        <Sparkles size={24} className="text-[var(--accent)]" />
      </div>

      {/* Heading */}
      <h2 className="text-[clamp(24px,4vw,28px)] font-sans font-[500] tracking-[-0.8px] text-[var(--text-primary)] m-[0_0_12px_0] leading-tight">
        Personal Finance <span className="text-[var(--accent)]">Intelligence.</span>
      </h2>
      <p className="text-[15px] text-[var(--text-muted)] max-w-[420px] leading-[1.65] m-[0_0_40px_0]">
        Ask questions about your investments, retirement goals, or taxes. Our AI uses precision calculators to give you accurate answers.
      </p>

      {/* Suggestion cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] w-[100%]">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            onClick={() => onSuggestionClick(s.text)}
            className="flex items-start gap-[14px] p-[16px_18px] rounded-[16px] border-[1px] border-[var(--border)] bg-[var(--bg-card)] text-left hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] transition-all duration-[0.2s] cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="w-[32px] h-[32px] rounded-[8px] bg-[var(--bg-subtle)] group-hover:bg-[var(--bg-card)] flex items-center justify-center shrink-0 border-[1px] border-[var(--border)] group-hover:border-[var(--accent-border)] transition-colors duration-[0.2s]">
              <s.icon
                size={16}
                className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-[0.2s]"
              />
            </div>
            <div className="flex flex-col gap-[2px]">
               <span className="text-[14px] font-[500] text-[var(--text-primary)] group-hover:text-[var(--text-primary)] leading-[1.4]">
                 {s.text}
               </span>
               <span className="text-[11px] text-[var(--text-faint)] font-sans uppercase tracking-[0.5px]">
                 Click to ask
               </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
