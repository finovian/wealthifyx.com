import type { Metadata } from "next";
import SipCalculatorPage from "@/screens/SipCalculatorPage";

export const metadata: Metadata = {
  title: "SIP Calculator – Calculate Monthly Investment Returns | Wealthifyx",
  description:
    "Use Wealthifyx SIP Calculator to estimate the future value of your monthly investments. Calculate total invested amount, estimated returns, and maturity value easily.",
  alternates: {
    canonical: "https://wealthifyx.com/tools/sip-calculator",
  },
};

const page = () => {
  return (
    <div>
      <SipCalculatorPage />
    </div>
  );
};

export default page;
