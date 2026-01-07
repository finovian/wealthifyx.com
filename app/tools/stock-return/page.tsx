import type { Metadata } from "next";
import StockReturnCalculatorPage from "@/screens/StockReturnCalculatorPage";

export const metadata: Metadata = {
  title: "Stock Return / CAGR Calculator | Wealthifyx",
  description:
    "Calculate the CAGR and total return of your stock investments. See your portfolio's annualized growth rate and absolute profit with our simple tool.",
  alternates: {
    canonical: "https://wealthifyx.com/tools/stock-return",
  },
};

export default function StockReturnPage() {
  return (
    <div>
      <StockReturnCalculatorPage />
    </div>
  );
}
