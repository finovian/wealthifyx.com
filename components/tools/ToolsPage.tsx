"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  Landmark,
  PiggyBank,
  Receipt,
  DollarSign,
  Search,
  ArrowRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

const categories = ["All Tools", "Retirement", "Investment", "Tax", "Savings"];

const tools = [
  {
    name: "Compound Interest Calculator",
    description: "Calculate how your money grows with the power of compounding.",
    icon: TrendingUp,
    href: "/tools/compound-interest-calculator",
    category: "Savings",
    live: true,
  },
  {
    name: "Investment Calculator",
    description: "Project returns on any investment with custom rate and time horizon.",
    icon: BarChart3,
    href: "/tools/investment-calculator",
    category: "Investment",
    live: true,
  },
  {
    name: "Roth IRA Calculator",
    description: "Estimate your Roth IRA growth and retirement balance.",
    icon: Landmark,
    href: "/tools/roth-ira-calculator",
    category: "Retirement",
    live: true,
  },
  {
    name: "401k Calculator",
    description: "See how your 401k contributions grow with employer match.",
    icon: Landmark,
    href: "/tools/401k-calculator",
    category: "Retirement",
    live: true,
  },
  {
    name: "Savings Goal Calculator",
    description: "Find out how long it takes to reach any savings target.",
    icon: PiggyBank,
    href: "/tools/savings-goal-calculator",
    category: "Savings",
    live: true,
  },
  {
  name: "Options Profit Calculator",
  description: "Calculate profit, loss, and breakeven on any options trade.",
  icon: Activity,
  href: "/tools/options-profit-calculator",
  category: "Investment",
  live: true,
},
  {
    name: "Capital Gains Tax Calculator",
    description: "Estimate federal capital gains tax on investment profits.",
    icon: Receipt,
    href: "/tools/capital-gains-calculator",
    category: "Tax",
    live: true,
  },
  {
    name: "Dividend Calculator",
    description: "Estimate dividend income and DRIP growth from any portfolio.",
    icon: DollarSign,
    href: "/tools/dividend-calculator",
    category: "Investment",
    live: true,
  },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("All Tools");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      activeCategory === "All Tools" || tool.category === activeCategory;
    const matchesSearch = tool.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* ── Header Section ── */}
      <div className="bg-[var(--bg-subtle)] border-b-[1px] border-b-[var(--border)] p-[90px_48px_60px] md:max-lg:p-[80px_32px_48px] max-md:p-[72px_20px_40px]">
        <div className="max-w-[1100px] m-[0_auto]">
          <span className="section-eyebrow mb-[16px]">{"// TOOL DIRECTORY"}</span>
          <h1 className="font-sans font-[400] tracking-[-2px] leading-[1.05] text-[var(--text-primary)] m-[0_0_24px_0] text-[clamp(40px,6vw,64px)] max-md:text-[36px] max-md:tracking-[-1px]">
            Free Finance Calculators <span className="text-accent">for Investors.</span>
            
          </h1>
          <p className="font-sans text-[18px] md:max-lg:text-[17px] max-md:text-[15px] text-[var(--text-muted)] leading-[1.7] max-w-[600px] m-[0]">
            4 live now · 4 more coming soon. All free, no sign-up, no data stored.
          </p>
        </div>
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="bg-[var(--bg-base)] border-b-[1px] border-b-[var(--border)] px-[48px] max-md:px-[20px] md:max-lg:px-[32px] sticky top-[60px] max-md:top-[56px] z-[10]">
        <div className="max-w-[1100px] m-[0_auto] flex items-center justify-between overflow-x-auto overflow-y-hidden no-scrollbar">
          <div className="flex gap-[8px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-[7px] p-[16px_18px] max-md:p-[14px_12px] bg-transparent border-none border-b-[2px] font-sans text-[13px] max-md:text-[12px] font-[500] cursor-pointer whitespace-nowrap transition-all duration-[0.15s] ease-[ease] mb-[-1px] hover:text-[var(--text-primary)] ${
                  activeCategory === cat
                    ? "border-[var(--accent)] text-accent"
                    : "border-transparent text-[var(--text-muted)]"
                }`}
              >
                {cat}
                  <span className={`font-sans text-[10px] font-[500] border-[1px] rounded-[100px] p-[1px_6px] transition-colors duration-[0.15s] ease-[ease] ${
                  activeCategory === cat
                    ? 'bg-[var(--accent-bg)] border-[var(--accent-border)] text-[var(--accent)]' 
                    : 'bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-faint)]'
                }`}>
                  {cat === "All Tools" ? tools.length : tools.filter(t => t.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-[10px] text-[var(--text-faint)]">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none font-sans text-[13px] text-[var(--text-primary)] min-w-[200px]"
            />
          </div>
        </div>
      </div>

      {/* ── Grid Section ── */}
      <div className="p-[60px_48px] max-md:p-[40px_20px] md:max-lg:p-[48px_32px]">
        <div className="max-w-[1100px] m-[0_auto]">
          <div className="grid grid-cols-[repeat(2,1fr)] max-md:grid-cols-[1fr] xl:grid-cols-[repeat(2,1fr)] gap-[12px] max-md:gap-[8px] items-stretch">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => (
                <motion.div
                  layout
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {tool.live ? (
                    <Link
                      href={tool.href}
                      className="group card card-hoverable flex flex-col p-[24px_28px] max-md:p-[20px_22px] h-full no-underline"
                    >
                      <div className="flex items-center justify-between mb-[20px]">
                        <div className="flex items-center justify-center w-[44px] h-[44px] rounded-[12px] bg-[var(--accent-bg)] border-[1.5px] border-[var(--accent-border)]">
                          <tool.icon size={20} className="text-[var(--accent)]" />
                        </div>
                        <ArrowRight
                          size={18}
                          className="text-[var(--text-faint)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        />
                      </div>
                      <div className="font-sans font-[600] text-[var(--text-primary)] text-[14px] leading-[1.3] whitespace-nowrap max-md:whitespace-normal overflow-hidden text-ellipsis">{tool.name}</div>
                      <p className="font-sans text-[var(--text-muted)] text-[13px] leading-[1.6] mt-[8px] flex-grow">
                        {tool.description}
                      </p>
                      <div className="mt-[20px] pt-[16px] border-t-[1px] border-[var(--border)] flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-[1px] text-[var(--text-faint)]">
                          {tool.category}
                        </span>
                        <span className="font-sans text-[11px] font-[500] text-[var(--accent)]">
                          Open Tool
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="card flex flex-col p-[24px_28px] max-md:p-[20px_22px] h-full opacity-[0.6] grayscale-[0.5]">
                      <div className="flex items-center justify-between mb-[20px]">
                        <div className="flex items-center justify-center w-[44px] h-[44px] rounded-[12px] bg-[var(--bg-subtle)] border-[1.5px] border-[var(--border)]">
                          <tool.icon size={20} className="text-[var(--text-faint)]" />
                        </div>
                        <span className="font-mono text-[9px] font-[600] tracking-[1px] uppercase text-[var(--text-faint)] bg-[var(--bg-muted)] px-[8px] py-[3px] rounded-[4px]">
                          Soon
                        </span>
                      </div>
                      <div className="font-sans font-[600] text-[var(--text-muted)] text-[14px] leading-[1.3] whitespace-nowrap max-md:whitespace-normal overflow-hidden text-ellipsis">{tool.name}</div>
                      <p className="font-sans text-[var(--text-faint)] text-[13px] leading-[1.6] mt-[8px] flex-grow">
                        {tool.description}
                      </p>
                      <div className="mt-[20px] pt-[16px] border-t-[1px] border-[var(--border)]">
                        <span className="font-mono text-[9px] uppercase tracking-[1px] text-[var(--text-faint)]">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-[100px]">
              <p className="font-sans text-[15px] text-[var(--text-muted)]">
                No calculators found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All Tools");
                }}
                className="btn-ghost mt-[16px] text-[13px] px-[20px] py-[8px] min-h-0"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
