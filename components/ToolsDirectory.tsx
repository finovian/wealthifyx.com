"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  Landmark,
  PiggyBank,
  Receipt,
  DollarSign,
  Activity,
} from "lucide-react";
import { trackToolCardClick } from "@/lib/analytics";

const tools = [
  {
    name: "Compound Interest Calculator",
    description:
      "Calculate how your money grows with the power of compounding.",
    icon: TrendingUp,
    href: "/tools/compound-interest-calculator",
    category: "Savings",
    live: true,
  },
  {
    name: "Investment Calculator",
    description:
      "Project returns on any investment with custom rate and time horizon.",
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
export default function ToolsDirectory() {
  return (
    <motion.section
      id="tools"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="section-wrapper"
    >
      <div className="max-w-[1100px] m-[0_auto]">
        {/* Section header */}
        <div className="section-header">
          <span className="section-eyebrow">{"// CALCULATORS"}</span>
          <h2 className="section-heading">Every tool you need.</h2>
          <p className="section-subtext">Precision-built. Free forever.</p>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-[repeat(2,1fr)] max-md:grid-cols-[1fr] gap-[12px] max-md:gap-[8px] items-stretch">
          {tools.map((tool, index) =>
            tool.live ? (
              <motion.a
                key={tool.name}
                href={tool.href}
                onClick={() =>
                  trackToolCardClick({
                    tool_name: tool.name.toLowerCase().replace(/\s+/g, "_"),
                    from_page: "homepage",
                  })
                }
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="group card card-hoverable flex items-center justify-between no-underline text-inherit cursor-pointer p-[20px_22px] md:max-lg:p-[16px_18px] max-md:p-[14px_16px]"
                role="link"
                tabIndex={0}
              >
                <div className="flex items-center gap-[14px] min-w-[0]">
                  <div className="flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-[10px] bg-[var(--accent-bg)] border-[1.5px] border-[var(--accent-border)] max-md:w-[36px] max-md:h-[36px] max-md:rounded-[9px]">
                    <tool.icon
                      size={18}
                      className="text-[var(--accent)]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-[0]">
                    <div className="font-sans font-[600] text-[var(--text-primary)] text-[15px] md:max-lg:text-[14px] max-md:text-[14px] leading-[1.3] max-md:leading-[1.35] overflow-hidden max-md:overflow-visible text-ellipsis max-md:text-clip whitespace-nowrap max-md:whitespace-normal">
                      {tool.name}
                    </div>
                    <div className="font-sans text-[var(--text-muted)] mt-[3px] max-md:mt-[2px] leading-[1.45] text-[13px] md:max-lg:text-[12px] max-md:text-[12px] whitespace-normal overflow-hidden line-clamp-2 max-md:line-clamp-1">
                      {tool.description}
                    </div>
                  </div>
                </div>
                <span className="font-sans text-[11px] text-[var(--text-faint)] transition-[color,transform] duration-[0.15s] ease-[ease] shrink-0 ml-[12px] whitespace-nowrap group-hover:text-[var(--accent)] group-hover:translate-x-[2px] max-md:hidden">
                  Open →
                </span>
              </motion.a>
            ) : (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="card flex items-center justify-between cursor-default opacity-[0.55] p-[20px_22px] md:max-lg:p-[16px_18px] max-md:p-[14px_16px]"
              >
                <div className="flex items-center gap-[14px] min-w-[0]">
                  <div className="flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-[10px] bg-[var(--bg-subtle)] border-[1.5px] border-[var(--border)] max-md:w-[36px] max-md:h-[36px] max-md:rounded-[9px]">
                    <tool.icon
                      size={18}
                      className="text-[var(--text-faint)]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-[0]">
                    <div className="font-sans font-[600] text-[var(--text-muted)] text-[15px] md:max-lg:text-[14px] max-md:text-[14px] leading-[1.3] max-md:leading-[1.35] overflow-hidden max-md:overflow-visible text-ellipsis max-md:text-clip whitespace-nowrap max-md:whitespace-normal">
                      {tool.name}
                    </div>
                    <div className="font-sans text-[var(--text-muted)] mt-[3px] max-md:mt-[2px] leading-[1.45] text-[13px] md:max-lg:text-[12px] max-md:text-[12px] whitespace-normal overflow-hidden line-clamp-2 max-md:line-clamp-1">
                      {tool.description}
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[9px] font-[500] tracking-[1px] uppercase bg-[var(--bg-subtle)] border-[1px] border-[var(--border)] rounded-[100px] p-[3px_8px] text-[var(--text-faint)] shrink-0 ml-[12px] whitespace-nowrap">
                  Soon
                </span>
              </motion.div>
            ),
          )}
        </div>

        {/* Footer note */}
        <div className="text-center mt-[28px] flex items-center justify-center gap-[8px]">
          <span className="w-[6px] h-[6px] rounded-[50%] bg-[var(--accent)] inline-block shrink-0" />
          <a
            href="/tools"
            className="font-sans text-[14px] text-[var(--text-faint)] no-underline"
          >
            View all calculators →
          </a>
        </div>
      </div>
    </motion.section>
  );
}
