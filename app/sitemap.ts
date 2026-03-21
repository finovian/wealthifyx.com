import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wealthifyx.com";

  // Core pages
  const corePages = [
    "",
    "/about",
    "/contact",
    "/disclaimer",
    "/methodology",
    "/privacy-policy",
    "/terms",
    "/tools",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Calculator tools
  const toolPages = [
    "/tools/401k-calculator",
    "/tools/capital-gains-calculator",
    "/tools/compound-interest-calculator",
    "/tools/dividend-calculator",
    "/tools/investment-calculator",
    "/tools/options-profit-calculator",
    "/tools/roth-ira-calculator",
    "/tools/savings-goal-calculator",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...corePages, ...toolPages];
}
