export type StockReturnInput = {
  initialInvestment: number; // $
  finalValue: number; // $
  years: number;
};

export type StockReturnResult = {
  cagr: number; // %
  totalReturn: number; // %
  absoluteProfit: number; // $
};

export function calculateStockReturn({
  initialInvestment,
  finalValue,
  years,
}: StockReturnInput): StockReturnResult {
  if (initialInvestment <= 0 || years <= 0) {
    return {
      cagr: 0,
      totalReturn: 0,
      absoluteProfit: 0,
    };
  }

  const cagr = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
  const absoluteProfit = finalValue - initialInvestment;
  const totalReturn = (absoluteProfit / initialInvestment) * 100;

  return {
    cagr: parseFloat(cagr.toFixed(2)),
    totalReturn: parseFloat(totalReturn.toFixed(2)),
    absoluteProfit: parseFloat(absoluteProfit.toFixed(2)),
  };
}
