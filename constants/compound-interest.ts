

export const faqs = [
  {
    q: "What is compound interest?",
    a: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, it grows exponentially over time — often called "interest on interest."',
  },
  {
    q: "How often should I compound?",
    a: "The more frequently interest compounds, the more you earn. Daily compounding yields slightly more than monthly, which yields more than annually. For most savings accounts and investments, monthly or daily compounding is standard.",
  },
  {
    q: "What is a realistic interest rate to use?",
    a: "For reference: high-yield savings accounts average 4–5% (2024), S&P 500 historical average is ~10.7% annually, bonds average 3–5%. Use a conservative rate for planning — it's better to be pleasantly surprised than disappointed.",
  },
  {
    q: "Does this calculator account for inflation?",
    a: "No. This shows nominal (not inflation-adjusted) returns. To estimate real returns, subtract the inflation rate (~3%) from your interest rate. Use our Inflation-Adjusted Return Calculator for that.",
  },
  {
    q: "How accurate is this calculator?",
    a: "It uses the standard compound interest formula A = P(1 + r/n)^(nt) with contribution support. The math is exact — no intermediate rounding or shortcuts that cause drift in simpler calculators.",
  },
];

export const relatedTools = [
  { name: "Investment Calculator",      desc: "Project returns on any investment",          href: "/tools/investment-calculator" },
  { name: "Savings Goal Calculator",    desc: "How long to reach your target",              href: "/tools/savings-goal-calculator" },
  { name: "Capital Gains Tax Calculator", desc: "Estimate tax owed when you sell",         href: "/tools/capital-gains-calculator" },
  { name: "Roth IRA Calculator",        desc: "Estimate your tax-free retirement growth",   href: "/tools/roth-ira-calculator" },
];