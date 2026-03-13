export const faqs = [
  {
    q: "What is a savings goal calculator?",
    a: "A savings goal calculator tells you either how long it will take to reach a target savings amount, or how much you need to save each month to hit that target by a specific date. You enter your goal amount, current savings, expected return rate, and either your monthly contribution or your deadline — and the calculator does the math. It accounts for interest earned on your growing balance so you get an accurate projection, not just a simple division.",
  },
  {
    q: "How is the time to reach my goal calculated?",
    a: "The calculator simulates your balance month by month, applying your monthly return rate to the existing balance and then adding your contribution. It counts how many months until your balance first reaches your goal. This approach handles any combination of interest rate, contribution, and existing savings correctly — including when interest alone is sufficient to reach the goal without any monthly contribution.",
  },
  {
    q: "How is the required monthly contribution calculated?",
    a: "Given a goal, existing savings, time horizon, and return rate, the calculator solves the future value of an ordinary annuity formula for the monthly payment. The formula is: Monthly = (Goal − ExistingSavings × (1+r)^n) ÷ [((1+r)^n − 1) ÷ r], where r is the monthly rate and n is the number of months. If your existing savings already exceed the goal value at the target date with no additional contributions, the required monthly amount is zero.",
  },
  {
    q: "What return rate should I use for a savings goal?",
    a: "It depends on where you're keeping the money. For a high-yield savings account or short-term goal (under 3 years), use 4–5% — realistic for current HYSA rates. For a goal funded through a brokerage account invested in index funds, 7% is a reasonable long-term estimate (S&P 500 inflation-adjusted average). For a basic savings account, use 1–2%. Never use a high rate for a short-horizon goal — that money should not be in equities if you need it in 12–24 months.",
  },
  {
    q: "Does this calculator account for taxes on interest?",
    a: "No. The calculator shows gross returns without tax deductions. Interest in taxable accounts is subject to ordinary income tax, which reduces your real return. If your savings are in a tax-advantaged account like a Roth IRA or 401(k), this doesn't apply. For taxable accounts, reduce your rate by your marginal tax rate to estimate after-tax growth — for example, if your rate is 5% and you're in the 22% bracket, use approximately 3.9% as a conservative after-tax estimate.",
  },
  {
    q: "Why does starting with existing savings reduce the time so much?",
    a: "Because existing savings earn interest immediately. Every dollar already saved is compounding right now. If you have $10,000 saved toward a $50,000 goal at 7% annual return, that $10,000 alone grows to over $19,000 in 10 years — without a single additional contribution. The earlier you start and the more you already have, the more compounding does the heavy lifting so you don't have to.",
  },
];

export const relatedTools = [
  {
    name: "Compound Interest Calculator",
    desc: "See how interest compounds across different frequencies",
    href: "/tools/compound-interest-calculator",
  },
  {
    name: "Investment Calculator",
    desc: "Project long-term investment growth with custom return rates",
    href: "/tools/investment-calculator",
  },
  {
    name: "Roth IRA Calculator",
    desc: "Project tax-free retirement growth with IRS contribution limits",
    href: "/tools/roth-ira-calculator",
  },
  {
    name: "401k Calculator",
    desc: "Model pre-tax retirement savings with employer match",
    href: "/tools/401k-calculator",
  },
];