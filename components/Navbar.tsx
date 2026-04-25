"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  PiggyBank,
  Target,
  BarChart3,
  Percent,
  DollarSign,
  Calculator,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

/* ─── Tool data ─────────────────────────────────────────── */
const tools = [
  {
    category: "Savings",
    items: [
      {
        name: "Compound Interest",
        desc: "Exponential growth over time",
        href: "/tools/compound-interest-calculator",
        icon: TrendingUp,
        color: "#16a34a",
      },
      {
        name: "Savings Goal",
        desc: "Time or monthly to your target",
        href: "/tools/savings-goal-calculator",
        icon: Target,
        color: "#0891b2",
      },
    ],
  },
  {
    category: "Retirement",
    items: [
      {
        name: "Roth IRA",
        desc: "Tax-free growth projection",
        href: "/tools/roth-ira-calculator",
        icon: PiggyBank,
        color: "#7c3aed",
      },
      {
        name: "401k",
        desc: "Match + compound at retirement",
        href: "/tools/401k-calculator",
        icon: Building2,
        color: "#b45309",
      },
    ],
  },
  {
    category: "Investment",
    items: [
      {
        name: "Investment",
        desc: "Portfolio growth at any rate",
        href: "/tools/investment-calculator",
        icon: BarChart3,
        color: "#0284c7",
      },
      {
        name: "Dividend & DRIP",
        desc: "Income and yield on cost",
        href: "/tools/dividend-calculator",
        icon: DollarSign,
        color: "#16a34a",
      },
      {
        name: "Options Profit",
        desc: "P&L at expiry for any position",
        href: "/tools/options-profit-calculator",
        icon: Calculator,
        color: "#dc2626",
      },
    ],
  },
  {
    category: "Tax",
    items: [
      {
        name: "Capital Gains Tax",
        desc: "Federal + NIIT on your gains",
        href: "/tools/capital-gains-calculator",
        icon: Percent,
        color: "#0891b2",
      },
    ],
  },
];

/* ─── Component ─────────────────────────────────────────── */
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileCalcOpen, setMobileCalcOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  /* scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* body lock when mobile drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes navDrop { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { transform:translateX(100%); }           to { transform:translateX(0); } }
        @keyframes fadeIn  { from { opacity:0; }                            to { opacity:1; } }
        .nav-drop        { animation: navDrop 0.18s ease forwards; }
        .drawer-slide    { animation: slideIn 0.25s cubic-bezier(0.32,0.72,0,1) forwards; }
        .drawer-backdrop { animation: fadeIn  0.2s ease forwards; }
      `}</style>

      {/* ══════════════════════════════════════════════════ */}
      {/*  NAV BAR — CSS grid 3-zone layout                 */}
      {/* ══════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] w-full flex items-center justify-between h-[60px] px-[20px] lg:px-[48px] transition-[background,border-color] duration-[0.25s] ${
          scrolled
            ? "bg-[color-mix(in_srgb,var(--bg-base)_93%,transparent)] backdrop-blur-[14px] border-b border-[var(--border)]"
            : "bg-[var(--bg-base)] border-b border-transparent"
        }`}
      >
        {/* ── ZONE 1: Logo ── */}
        <Link
          href="/"
          className="flex items-center no-underline shrink-0 group w-fit"
        >
          <div className="flex flex-col leading-none">
            <span className="font-sans text-[18px] font-[500] tracking-[-0.5px] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-[0.15s]">
              WealthifyX
            </span>
          </div>
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] ml-[2px] mb-[-10px] shrink-0" />
        </Link>

        {/* ── ZONE 2: Center nav — naturally centered by grid ── */}
        <div className="hidden lg:flex items-center gap-[2px]">
          {/* Calculators — hover trigger */}
          <div
            ref={dropRef}
            className="relative"
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}
          >
            <button
              className={`flex items-center gap-[5px] h-[34px] px-[14px] rounded-full font-ubuntu text-[13px] font-[500] border cursor-pointer transition-all duration-[0.15s] select-none ${
                dropOpen
                  ? "bg-[var(--accent)] border-[var(--accent)] text-[white]"
                  : "bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
            >
              Calculators
              <ChevronDown
                size={12}
                className={`transition-transform duration-[0.2s] ${dropOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div className="absolute top-[100%] left-[-20px] right-[-20px] h-[10px]" />

            {/* Mega-menu — stays open while hovering wrapper */}
            {dropOpen && (
              <div className="nav-drop absolute top-[calc(100%+10px)] left-[50%] -translate-x-[50%] w-[640px] bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] shadow-[0_20px_48px_rgba(0,0,0,0.14)] p-[20px] grid grid-cols-2 gap-x-[8px]">
                {/* Header */}
                <div className="col-span-2 flex items-center justify-between pb-[12px] mb-[4px] border-b border-[var(--border)]">
                  <span className="font-sans text-[11px] font-[600] uppercase tracking-[1.2px] text-[var(--text-faint)]">
                    All Calculators
                  </span>
                  <Link
                    href="/tools"
                    onClick={() => setDropOpen(false)}
                    className="font-ubuntu text-[11px] font-[600] text-[var(--accent)] no-underline hover:underline"
                  >
                    Browse all →
                  </Link>
                </div>

                {/* Tool groups */}
                {tools.map((group) => (
                  <div key={group.category} className="mb-[8px]">
                    <div className="font-sans text-[10px] font-[600] uppercase tracking-[1.2px] text-[var(--text-faint)] px-[8px] mb-[4px]">
                      {group.category}
                    </div>
                    {group.items.map((tool) => (
                      <Link
                        key={tool.name}
                        href={tool.href}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-[10px] p-[8px_10px] rounded-[10px] no-underline group/tool hover:bg-[var(--bg-subtle)] transition-colors duration-[0.1s]"
                      >
                        <div
                          className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0"
                          style={{
                            background: `${tool.color}1a`,
                            color: tool.color,
                          }}
                        >
                          <tool.icon size={15} />
                        </div>
                        <div className="flex flex-col gap-[1px] min-w-0">
                          <span className="font-ubuntu text-[13px] font-[500] text-[var(--text-primary)] group-hover/tool:text-[var(--accent)] transition-colors duration-[0.1s] truncate">
                            {tool.name}
                          </span>
                          <span className="font-sans text-[11px] text-[var(--text-faint)] truncate">
                            {tool.desc}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Static links */}
          {[
            { label: "Methodology", href: "/methodology" },
            { label: "Chat Advisor", href: "/ai" },
            { label: "About", href: "/about" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center h-[34px] px-[14px] rounded-full font-ubuntu text-[13px] font-[500] text-[var(--text-muted)] no-underline hover:text-[var(--text-primary)] transition-colors duration-[0.15s]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── ZONE 3: Actions — pushed right ── */}
        <div className="flex items-center gap-[6px] justify-end">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="bg-transparent border-none cursor-pointer text-[var(--text-muted)] flex items-center justify-center rounded-[8px] w-[36px] h-[36px] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all duration-[0.15s]"
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Get Started — desktop */}
          <Link
            href="/tools"
            className="hidden lg:flex items-center h-[34px] px-[16px] rounded-full bg-[var(--accent)] text-[white] font-ubuntu text-[13px] font-[600] no-underline hover:bg-[var(--accent-hover)] transition-colors duration-[0.15s] shrink-0"
          >
            Get Started
          </Link>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex lg:hidden bg-transparent border-none cursor-pointer text-[var(--text-primary)] items-center justify-center w-[36px] h-[36px]"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════ */}
      {/*  MOBILE DRAWER                                    */}
      {/* ══════════════════════════════════════════════════ */}
      {mobileOpen && (
        <>
          <div
            className="drawer-backdrop fixed inset-0 z-[199] bg-[rgba(0,0,0,0.5)] backdrop-blur-[4px]"
            onClick={() => setMobileOpen(false)}
          />

          <div className="drawer-slide fixed top-0 right-0 bottom-0 w-[min(100%,100vw)] z-[200] bg-[var(--bg-base)] border-l border-[var(--border)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between h-[60px] px-[20px] border-b border-[var(--border)] shrink-0">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center no-underline"
              >
                <span className="font-sans text-[17px] font-[500] tracking-[-0.5px] text-[var(--text-primary)]">
                  WealthifyX
                </span>
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] ml-[2px] mb-[-3px] inline-block" />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="bg-transparent border-none cursor-pointer text-[var(--text-primary)] w-[36px] h-[36px] flex items-center justify-center rounded-[8px] hover:bg-[var(--bg-subtle)]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto py-[8px] px-[16px]">
              {/* Calculators accordion */}
              <button
                onClick={() => setMobileCalcOpen((v) => !v)}
                className="w-full  flex items-center justify-between h-[52px] px-[4px] font-ubuntu text-[15px] font-[500] text-[var(--text-primary)] border-b border-t-0 border-l-0 border-r-0 border-[var(--border)] bg-transparent cursor-pointer hover:text-[var(--accent)] transition-colors duration-[0.15s]"
              >
                Calculators
                <ChevronDown
                  size={16}
                  className={`text-[var(--text-faint)] transition-transform duration-[0.2s] ${mobileCalcOpen ? "rotate-180" : ""}`}
                />
              </button>

              {mobileCalcOpen && (
                <div className="py-[10px] flex flex-col gap-[2px] max-h-[60vh] overflow-y-auto">
                  {tools.map((group) => (
                    <div key={group.category} className="mb-[8px]">
                      <div className="font-sans text-[10px] font-[600] uppercase tracking-[1.2px] text-[var(--text-faint)] px-[4px] py-[6px]">
                        {group.category}
                      </div>
                      {group.items.map((tool) => (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-[12px] p-[10px_8px] rounded-[10px] no-underline hover:bg-[var(--bg-subtle)] transition-colors duration-[0.1s]"
                        >
                          <div
                            className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center shrink-0"
                            style={{
                              background: `${tool.color}1a`,
                              color: tool.color,
                            }}
                          >
                            <tool.icon size={16} />
                          </div>
                          <div className="flex flex-col gap-[1px]">
                            <span className="font-ubuntu text-[14px] font-[500] text-[var(--text-primary)]">
                              {tool.name}
                            </span>
                            <span className="font-sans text-[12px] text-[var(--text-faint)]">
                              {tool.desc}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {[
                { label: "Methodology", href: "/methodology" },
                { label: "Chat Advisor", href: "/ai" },
                { label: "About", href: "/about" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center h-[52px] px-[4px] font-ubuntu text-[15px] font-[500] text-[var(--text-primary)] no-underline border-b border-[var(--border)] hover:text-[var(--accent)] transition-colors duration-[0.15s]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="px-[16px] pt-[14px] pb-[32px] border-t border-[var(--border)] flex flex-col gap-[10px] shrink-0">
              <Link
                href="/tools"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full h-[50px] bg-[var(--accent)] text-[white] rounded-[10px] font-ubuntu text-[15px] font-[600] no-underline hover:bg-[var(--accent-hover)] transition-colors duration-[0.15s]"
              >
                Explore All Tools →
              </Link>
              <button
                onClick={toggleTheme}
                className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-[10px] h-[44px] px-[16px] text-[var(--text-primary)] font-ubuntu text-[14px] cursor-pointer flex items-center justify-center gap-[8px] w-full hover:border-[var(--border-strong)] transition-colors duration-[0.15s]"
              >
                {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
                {theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"}
              </button>
              <span className="font-sans text-[11px] text-[var(--text-faint)] text-center">
                Free. Always.
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
