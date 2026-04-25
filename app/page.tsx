import type { Metadata } from "next";
import HeroSection from "../components/HeroSection";
import SocialProofBar from "../components/SocialProofBar";
import ToolsDirectory from "../components/ToolsDirectory";
import FeatureCards from "../components/FeatureCards";
import InlineCalculator from "../components/InlineCalculator";
import FAQSection from "../components/FAQSection";

export const metadata: Metadata = {
  title: "Free Finance Calculators for Investors",
  description:
    "Free, precise finance calculators for investors. Compound interest, investment returns, retirement planning, and more. No accounts. No data stored. Always free.",
  alternates: {
    canonical: "https://wealthifyx.com",
  },
  openGraph: {
    title: "WealthifyX — Free Finance Calculators for Investors",
    description:
      "Calculate compound interest, investment returns, retirement savings, and more. Free tools built for investors, not accountants.",
    url: "https://wealthifyx.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WealthifyX — Free Finance Calculators",
    description: "Precise finance calculators for investors. Free, no sign-up required.",
  },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SocialProofBar />
      <ToolsDirectory />
      <FeatureCards />
      <InlineCalculator />
      
      <FAQSection />
    </main>
  );
}