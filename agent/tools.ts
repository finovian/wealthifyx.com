

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  frequency: number = 12,
  monthlyContribution: number = 0
) {
  const r = annualRate / 100;
  const exp = Math.pow(1 + r / frequency, frequency * years);
  const base = principal * exp;
  const contrib =
    monthlyContribution > 0
      ? ((monthlyContribution * 12) / frequency) * ((exp - 1) / (r / frequency))
      : 0;
  const total = r > 0
    ? base + contrib
    : principal + monthlyContribution * 12 * years;
  const invested = principal + monthlyContribution * 12 * years;

  return {
    finalAmount: Math.round(total),
    totalGain: Math.round(total - invested),
    totalInvested: Math.round(invested),
  };
}


export function calculateSIP(
  monthlyAmount: number,
  annualRate: number,
  years: number
) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const result = r > 0
    ? monthlyAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    : monthlyAmount * n;

  return {
    totalInvested: Math.round(monthlyAmount * n),
    finalValue: Math.round(result),
    totalGain: Math.round(result - monthlyAmount * n),
  };
}


export function calculateRetirementCorpus(
  monthlyExpenses: number,
  yearsToRetire: number,
  inflationRate: number = 6,
  withdrawalYears: number = 25
) {
  const futureMonthly =
    monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetire);
  const annualExpenses = futureMonthly * 12;
  const corpusNeeded = annualExpenses * withdrawalYears;
  const r = 0.12 / 12;
  const n = yearsToRetire * 12;
  const sipNeeded =
    corpusNeeded / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

  return {
    corpusNeeded: Math.round(corpusNeeded),
    futureMonthlyExpenses: Math.round(futureMonthly),
    monthlySIPNeeded: Math.round(sipNeeded),
  };
}


export function calculateRothIRA(
  currentAge: number,
  retirementAge: number,
  annualContribution: number,
  existingBalance: number,
  rate: number
) {
  const r = rate / 100;
  const years = retirementAge - currentAge;

  if (r === 0) {
    const finalBalance = existingBalance + annualContribution * years;
    return {
      finalBalance: Math.round(finalBalance),
      totalContributions: Math.round(existingBalance + annualContribution * years),
      taxFreeGrowth: 0,
      yearsToRetirement: years,
    };
  }

  const exp = Math.pow(1 + r, years);
  const growth = existingBalance * exp;
  const contribGrowth = years > 0 ? annualContribution * ((exp - 1) / r) : 0;
  const finalBalance = growth + contribGrowth;
  const totalContributions = existingBalance + annualContribution * years;

  return {
    finalBalance: Math.round(finalBalance),
    totalContributions: Math.round(totalContributions),
    taxFreeGrowth: Math.round(Math.max(0, finalBalance - totalContributions)),
    yearsToRetirement: years,
  };
}


const LIMIT_UNDER_50 = 23000;
const LIMIT_50_PLUS = 30500;

export function calculate401k(
  salary: number,
  empContribPct: number,
  matchPct: number,
  matchUpToPct: number,
  existingBalance: number,
  rate: number,
  currentAge: number,
  retirementAge: number
) {
  const r = rate / 100;
  const years = retirementAge - currentAge;
  const irsLimit = currentAge >= 50 ? LIMIT_50_PLUS : LIMIT_UNDER_50;

  const employeeRaw = salary * (empContribPct / 100);
  const employeeContrib = Math.min(employeeRaw, irsLimit);
  const effectiveMatchBase = Math.min(empContribPct, matchUpToPct);
  const employerContrib =
    salary * (effectiveMatchBase / 100) * (matchPct / 100);
  const totalAnnual = employeeContrib + employerContrib;

  let finalBalance: number;
  if (r === 0) {
    finalBalance = existingBalance + totalAnnual * years;
  } else {
    const exp = Math.pow(1 + r, years);
    finalBalance =
      existingBalance * exp + totalAnnual * ((exp - 1) / r);
  }

  return {
    finalBalance: Math.round(finalBalance),
    totalEmployeeContrib: Math.round(employeeContrib * years),
    totalEmployerMatch: Math.round(employerContrib * years),
    employeeAnnual: Math.round(employeeContrib),
    employerAnnual: Math.round(employerContrib),
    totalAnnual: Math.round(totalAnnual),
    irsLimitHit: employeeRaw > irsLimit,
    years,
  };
}


export function calculateSavingsGoal(
  goal: number,
  currentSavings: number,
  monthlyContrib: number,
  annualRate: number
) {
  const MAX_MONTHS = 1200;

  if (currentSavings >= goal) {
    return { months: 0, years: 0, requiredMonthly: 0, reachable: true };
  }

  if (annualRate === 0) {
    if (monthlyContrib <= 0) return { months: null, years: null, requiredMonthly: null, reachable: false };
    const months = Math.ceil((goal - currentSavings) / monthlyContrib);
    return { months, years: +(months / 12).toFixed(1), requiredMonthly: monthlyContrib, reachable: true };
  }

  const r = annualRate / 100 / 12;
  let balance = currentSavings;
  for (let m = 1; m <= MAX_MONTHS; m++) {
    balance = balance * (1 + r) + monthlyContrib;
    if (balance >= goal) {
      return { months: m, years: +(m / 12).toFixed(1), requiredMonthly: monthlyContrib, reachable: true };
    }
  }


  const months = MAX_MONTHS;
  const growth = Math.pow(1 + r, months);
  const futureExisting = currentSavings * growth;
  const annuityFactor = (growth - 1) / r;
  const required = futureExisting >= goal ? 0 : (goal - futureExisting) / annuityFactor;

  return { months: null, years: null, requiredMonthly: Math.round(required), reachable: false };
}


export function calculateOptionsProfit(
  positionType: "long_call" | "long_put" | "short_call" | "short_put",
  strikePrice: number,
  premiumPerShare: number,
  contracts: number,
  targetPrice: number
) {
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
      maxProfit = null;
      maxLoss = -totalCost;
      break;
    case "long_put":
      pnl = (Math.max(0, strikePrice - targetPrice) - premiumPerShare) * mult;
      breakeven = strikePrice - premiumPerShare;
      maxProfit = (strikePrice - premiumPerShare) * mult;
      maxLoss = -totalCost;
      break;
    case "short_call":
      pnl = (premiumPerShare - Math.max(0, targetPrice - strikePrice)) * mult;
      breakeven = strikePrice + premiumPerShare;
      maxProfit = totalCost;
      maxLoss = null;
      break;
    case "short_put":
      pnl = (premiumPerShare - Math.max(0, strikePrice - targetPrice)) * mult;
      breakeven = strikePrice - premiumPerShare;
      maxProfit = totalCost;
      maxLoss = -(strikePrice - premiumPerShare) * mult;
      break;
  }

  const roi =
    positionType === "long_call" || positionType === "long_put"
      ? Math.round((pnl / totalCost) * 1000) / 10
      : null;

  return {
    pnlAtTarget: Math.round(pnl),
    breakeven: Math.round(breakeven * 100) / 100,
    maxProfit: maxProfit !== null ? Math.round(maxProfit) : "Unlimited",
    maxLoss: maxLoss !== null ? Math.round(maxLoss) : "Unlimited",
    totalCost: Math.round(totalCost),
    roi,
    isProfit: pnl > 0,
  };
}


export function calculateCapitalGainsTax(
  buyPrice: number,
  sellPrice: number,
  shares: number,
  isLongTerm: boolean,
  annualIncome: number,
  stateTaxRate: number = 0
) {
  const proceeds = sellPrice * shares;
  const costBasis = buyPrice * shares;
  const gain = proceeds - costBasis;

  if (gain <= 0) {
    return {
      gain: Math.round(gain),
      proceeds: Math.round(proceeds),
      costBasis: Math.round(costBasis),
      federalTax: 0,
      stateTax: 0,
      totalTax: 0,
      effectiveRate: 0,
      netProfit: Math.round(gain),
      isLoss: true,
    };
  }


  let federalRate: number;
  if (isLongTerm) {
    if (annualIncome <= 44625) federalRate = 0;
    else if (annualIncome <= 492300) federalRate = 0.15;
    else federalRate = 0.20;
  } else {

    if (annualIncome <= 11000) federalRate = 0.10;
    else if (annualIncome <= 44725) federalRate = 0.12;
    else if (annualIncome <= 95375) federalRate = 0.22;
    else if (annualIncome <= 182050) federalRate = 0.24;
    else if (annualIncome <= 231250) federalRate = 0.32;
    else if (annualIncome <= 578125) federalRate = 0.35;
    else federalRate = 0.37;
  }


  const niit = annualIncome > 200000 ? gain * 0.038 : 0;
  const federalTax = gain * federalRate;
  const stateTax = gain * (stateTaxRate / 100);
  const totalTax = federalTax + niit + stateTax;
  const netProfit = gain - totalTax;

  return {
    gain: Math.round(gain),
    proceeds: Math.round(proceeds),
    costBasis: Math.round(costBasis),
    federalTax: Math.round(federalTax),
    niit: Math.round(niit),
    stateTax: Math.round(stateTax),
    totalTax: Math.round(totalTax),
    effectiveRate: Math.round((totalTax / gain) * 1000) / 10,
    netProfit: Math.round(netProfit),
    isLoss: false,
  };
}


export function calculateDividend(
  sharePrice: number,
  shares: number,
  dividendPerShare: number,
  stockGrowthRate: number,
  divGrowthRate: number,
  years: number,
  drip: boolean = false
) {
  let currentPrice = sharePrice;
  let currentDPS = dividendPerShare;
  let currentShares = shares;
  let totalDividendsReceived = 0;
  const initialInvestment = sharePrice * shares;

  for (let y = 1; y <= years; y++) {
    currentPrice *= 1 + stockGrowthRate / 100;
    currentDPS *= 1 + divGrowthRate / 100;

    if (drip) {
      for (let q = 0; q < 4; q++) {
        const quarterlyDiv = currentShares * (currentDPS / 4);
        totalDividendsReceived += quarterlyDiv;
        currentShares += quarterlyDiv / currentPrice;
      }
    } else {
      totalDividendsReceived += currentShares * currentDPS;
    }
  }

  const finalValue = currentPrice * currentShares;
  const finalAnnualIncome = currentDPS * currentShares;
  const currentYield = sharePrice > 0 ? (dividendPerShare / sharePrice) * 100 : 0;
  const yieldOnCost = initialInvestment > 0 ? (finalAnnualIncome / initialInvestment) * 100 : 0;

  return {
    initialInvestment: Math.round(initialInvestment),
    finalValue: Math.round(finalValue),
    finalAnnualIncome: Math.round(finalAnnualIncome),
    totalDividendsReceived: Math.round(totalDividendsReceived),
    totalReturn: Math.round(finalValue + totalDividendsReceived - initialInvestment),
    currentYield: Math.round(currentYield * 100) / 100,
    yieldOnCost: Math.round(yieldOnCost * 100) / 100,
    finalShares: Math.round(currentShares * 100) / 100,
  };
}


export const TOOLS = [
  {
    name: "calculate_compound_interest",
    description: "Calculate compound interest growth on a lump sum investment. Use when user asks about investment growth, one-time investing, or how money grows over time.",
    input_schema: {
      type: "object",
      properties: {
        principal: { type: "number", description: "Initial investment amount" },
        annual_rate: { type: "number", description: "Expected annual return as percentage e.g. 10 for 10%" },
        years: { type: "number", description: "Number of years" },
        frequency: { type: "number", description: "Compounding frequency: 1=annually, 12=monthly, 365=daily. Default 12." },
        monthly_contribution: { type: "number", description: "Optional monthly addition. Default 0." },
      },
      required: ["principal", "annual_rate", "years"],
    },
  },
  {
    name: "calculate_sip",
    description: "Calculate SIP returns for recurring monthly investments. Use when user asks about monthly investing, mutual funds, or building wealth slowly over time.",
    input_schema: {
      type: "object",
      properties: {
        monthly_amount: { type: "number", description: "Amount invested every month" },
        annual_rate: { type: "number", description: "Expected annual return as percentage" },
        years: { type: "number", description: "Investment duration in years" },
      },
      required: ["monthly_amount", "annual_rate", "years"],
    },
  },
  {
    name: "calculate_retirement",
    description: "Calculate corpus needed to retire and monthly SIP required to get there. Use when user mentions retirement, financial independence, or FIRE goals.",
    input_schema: {
      type: "object",
      properties: {
        monthly_expenses: { type: "number", description: "Current monthly expenses" },
        years_to_retire: { type: "number", description: "Years until target retirement" },
        inflation_rate: { type: "number", description: "Expected inflation rate. Default 6 for India, 3 for US." },
      },
      required: ["monthly_expenses", "years_to_retire"],
    },
  },
  {
    name: "calculate_roth_ira",
    description: "Calculate Roth IRA balance at retirement with tax-free growth. Use when user asks about Roth IRA, tax-free retirement accounts, or US retirement planning.",
    input_schema: {
      type: "object",
      properties: {
        current_age: { type: "number", description: "User's current age" },
        retirement_age: { type: "number", description: "Target retirement age" },
        annual_contribution: { type: "number", description: "Annual contribution amount (max $7,000 in 2024)" },
        existing_balance: { type: "number", description: "Current Roth IRA balance. Default 0." },
        rate: { type: "number", description: "Expected annual return as percentage. Default 10." },
      },
      required: ["current_age", "retirement_age", "annual_contribution"],
    },
  },
  {
    name: "calculate_401k",
    description: "Calculate 401k balance at retirement including employer match. Use when user asks about 401k, employer match, or workplace retirement plans.",
    input_schema: {
      type: "object",
      properties: {
        salary: { type: "number", description: "Annual salary" },
        emp_contrib_pct: { type: "number", description: "Employee contribution as percentage of salary e.g. 6 for 6%" },
        match_pct: { type: "number", description: "Employer match percentage e.g. 50 means employer matches 50 cents per dollar" },
        match_up_to_pct: { type: "number", description: "Employer matches up to this % of salary e.g. 6" },
        existing_balance: { type: "number", description: "Current 401k balance. Default 0." },
        rate: { type: "number", description: "Expected annual return as percentage. Default 10." },
        current_age: { type: "number", description: "User's current age" },
        retirement_age: { type: "number", description: "Target retirement age. Default 65." },
      },
      required: ["salary", "emp_contrib_pct", "match_pct", "match_up_to_pct", "current_age"],
    },
  },
  {
    name: "calculate_savings_goal",
    description: "Calculate how long to reach a savings goal, or how much to save monthly. Use when user has a specific financial target like emergency fund, house down payment, or any goal amount.",
    input_schema: {
      type: "object",
      properties: {
        goal: { type: "number", description: "Target savings amount" },
        current_savings: { type: "number", description: "Current savings balance. Default 0." },
        monthly_contrib: { type: "number", description: "Monthly savings contribution" },
        annual_rate: { type: "number", description: "Expected annual return as percentage. Use 0 for simple savings account." },
      },
      required: ["goal", "monthly_contrib"],
    },
  },
  {
    name: "calculate_options_profit",
    description: "Calculate options P&L, breakeven, max profit and max loss. Use when user asks about options trading, calls, puts, or derivatives.",
    input_schema: {
      type: "object",
      properties: {
        position_type: {
          type: "string",
          enum: ["long_call", "long_put", "short_call", "short_put"],
          description: "Type of options position",
        },
        strike_price: { type: "number", description: "Option strike price" },
        premium_per_share: { type: "number", description: "Option premium per share" },
        contracts: { type: "number", description: "Number of contracts. Each contract = 100 shares. Default 1." },
        target_price: { type: "number", description: "Stock price at expiry to calculate P&L" },
      },
      required: ["position_type", "strike_price", "premium_per_share", "target_price"],
    },
  },
  {
    name: "calculate_capital_gains_tax",
    description: "Calculate US capital gains tax on a stock sale. Use when user asks about tax on selling stocks, capital gains, or tax liability on investments.",
    input_schema: {
      type: "object",
      properties: {
        buy_price: { type: "number", description: "Price per share when bought" },
        sell_price: { type: "number", description: "Price per share when sold" },
        shares: { type: "number", description: "Number of shares sold" },
        is_long_term: { type: "boolean", description: "true if held more than 1 year (long-term), false if less (short-term)" },
        annual_income: { type: "number", description: "User's annual income, used to determine tax bracket" },
        state_tax_rate: { type: "number", description: "State capital gains tax rate as percentage. Default 0." },
      },
      required: ["buy_price", "sell_price", "shares", "is_long_term", "annual_income"],
    },
  },
  {
    name: "calculate_dividend",
    description: "Calculate dividend income, portfolio growth, and yield over time. Use when user asks about dividend investing, passive income from stocks, or DRIP.",
    input_schema: {
      type: "object",
      properties: {
        share_price: { type: "number", description: "Current price per share" },
        shares: { type: "number", description: "Number of shares owned" },
        dividend_per_share: { type: "number", description: "Annual dividend per share" },
        stock_growth_rate: { type: "number", description: "Expected annual stock price growth as percentage" },
        div_growth_rate: { type: "number", description: "Expected annual dividend growth as percentage" },
        years: { type: "number", description: "Investment horizon in years" },
        drip: { type: "boolean", description: "true to reinvest dividends (DRIP), false to take as cash. Default false." },
      },
      required: ["share_price", "shares", "dividend_per_share", "years"],
    },
  },
];


export function executeTool(name: string, input: Record<string, unknown>): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const i = input as any;
    switch (name) {
      case "calculate_compound_interest":
        if (i.principal <= 0) throw new Error("Principal must be greater than 0");
        if (i.annual_rate < 0) throw new Error("Annual rate cannot be negative");
        if (i.years <= 0) throw new Error("Years must be greater than 0");
        return JSON.stringify(calculateCompoundInterest(
          i.principal, i.annual_rate, i.years,
          i.frequency ?? 12, i.monthly_contribution ?? 0
        ));

      case "calculate_sip":
        if (i.monthly_amount <= 0) throw new Error("Monthly amount must be greater than 0");
        if (i.annual_rate < 0) throw new Error("Annual rate cannot be negative");
        if (i.years <= 0) throw new Error("Years must be greater than 0");
        return JSON.stringify(calculateSIP(
          i.monthly_amount, i.annual_rate, i.years
        ));

      case "calculate_retirement":
        if (i.monthly_expenses <= 0) throw new Error("Monthly expenses must be greater than 0");
        if (i.years_to_retire < 0) throw new Error("Years to retire cannot be negative");
        return JSON.stringify(calculateRetirementCorpus(
          i.monthly_expenses, i.years_to_retire,
          i.inflation_rate ?? 6
        ));

      case "calculate_roth_ira":
        if (i.current_age < 0) throw new Error("Current age cannot be negative");
        if (i.retirement_age <= i.current_age) throw new Error("Retirement age must be greater than current age");
        if (i.annual_contribution <= 0) throw new Error("Annual contribution must be greater than 0");
        return JSON.stringify(calculateRothIRA(
          i.current_age, i.retirement_age,
          i.annual_contribution, i.existing_balance ?? 0,
          i.rate ?? 10
        ));

      case "calculate_401k":
        if (i.salary <= 0) throw new Error("Salary must be greater than 0");
        if (i.emp_contrib_pct < 0 || i.emp_contrib_pct > 100) throw new Error("Employee contribution percentage must be between 0 and 100");
        if (i.match_pct < 0 || i.match_pct > 100) throw new Error("Match percentage must be between 0 and 100");
        if (i.match_up_to_pct < 0 || i.match_up_to_pct > 100) throw new Error("Match up to percentage must be between 0 and 100");
        if (i.current_age < 0) throw new Error("Current age cannot be negative");
        if (i.retirement_age <= i.current_age) throw new Error("Retirement age must be greater than current age");
        return JSON.stringify(calculate401k(
          i.salary, i.emp_contrib_pct, i.match_pct,
          i.match_up_to_pct, i.existing_balance ?? 0,
          i.rate ?? 10, i.current_age,
          i.retirement_age ?? 65
        ));

      case "calculate_savings_goal":
        if (i.goal <= 0) throw new Error("Goal must be greater than 0");
        if (i.monthly_contrib < 0) throw new Error("Monthly contribution cannot be negative");
        if (i.annual_rate < 0) throw new Error("Annual rate cannot be negative");
        return JSON.stringify(calculateSavingsGoal(
          i.goal, i.current_savings ?? 0,
          i.monthly_contrib, i.annual_rate ?? 0
        ));

      case "calculate_options_profit":
        if (!["long_call", "long_put", "short_call", "short_put"].includes(i.position_type as string)) {
          throw new Error("Invalid position type");
        }
        if (i.strike_price <= 0) throw new Error("Strike price must be greater than 0");
        if (i.premium_per_share < 0) throw new Error("Premium per share cannot be negative");
        if (i.contracts <= 0) throw new Error("Contracts must be greater than 0");
        if (i.target_price <= 0) throw new Error("Target price must be greater than 0");
        return JSON.stringify(calculateOptionsProfit(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          i.position_type as any, i.strike_price,
          i.premium_per_share, i.contracts ?? 1,
          i.target_price
        ));

      case "calculate_capital_gains_tax":
        if (i.buy_price <= 0) throw new Error("Buy price must be greater than 0");
        if (i.sell_price <= 0) throw new Error("Sell price must be greater than 0");
        if (i.shares <= 0) throw new Error("Shares must be greater than 0");
        if (i.annual_income < 0) throw new Error("Annual income cannot be negative");
        return JSON.stringify(calculateCapitalGainsTax(
          i.buy_price, i.sell_price, i.shares,
          i.is_long_term, i.annual_income,
          i.state_tax_rate ?? 0
        ));

      case "calculate_dividend":
        if (i.share_price <= 0) throw new Error("Share price must be greater than 0");
        if (i.shares <= 0) throw new Error("Shares must be greater than 0");
        if (i.dividend_per_share < 0) throw new Error("Dividend per share cannot be negative");
        if (i.years <= 0) throw new Error("Years must be greater than 0");
        return JSON.stringify(calculateDividend(
          i.share_price, i.shares, i.dividend_per_share,
          i.stock_growth_rate ?? 7, i.div_growth_rate ?? 5,
          i.years, i.drip ?? false
        ));

      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (err: unknown) {
    return JSON.stringify({ error: (err as Error).message });
  }
}