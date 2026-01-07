export type SipInput = {
  monthlyInvestment: number; // ₹
  annualReturnRate: number; // %
  years: number;
};

export type SipResult = {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
};

export function calculateSip({
  monthlyInvestment,
  annualReturnRate,
  years,
}: SipInput): SipResult {
  const months = years * 12;
  const monthlyRate = annualReturnRate / 100 / 12;

  // SIP future value formula
  const totalValue =
    monthlyInvestment *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
    (1 + monthlyRate);

  const investedAmount = monthlyInvestment * months;
  const estimatedReturns = totalValue - investedAmount;

  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
  };
}
