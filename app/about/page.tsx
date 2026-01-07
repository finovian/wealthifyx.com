import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Wealthifyx",
  description:
    "Learn about Wealthifyx's mission to provide simple, fast, and free financial calculators for everyone.",
};

export default function AboutPage() {
  return (
    <main className="py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          About Wealthifyx
        </h1>
      </header>

      <article className="prose prose-gray max-w-none">
        <h2>What Wealthifyx Is</h2>
        <p>
          Wealthifyx provides simple, unbiased financial calculators to help
          people understand long-term investment outcomes. Our tools are clean,
          fast, and free, designed for anyone who wants to make better money
          decisions without the noise.
        </p>

        <h2>What Wealthifyx Is NOT</h2>
        <ul>
          <li>
            <strong>We are not financial advisors.</strong> All content and
            calculations are for educational and informational purposes only.
          </li>
          <li>
            <strong>We are not a trading platform.</strong> We do not
            facilitate the buying or selling of any securities.
          </li>
          <li>
            <strong>We are not a news site.</strong> We focus on calculations,
            not market commentary or news.
          </li>
          <li>
            <strong>We do not track you.</strong> We do not collect or store
            any personal data from our users. Your calculations are your own.
          </li>
        </ul>

        <h2>Our Philosophy</h2>
        <p>
          We believe that financial literacy should be accessible to everyone.
          By providing simple, powerful tools, we hope to empower individuals
          to take control of their financial future.
        </p>
      </article>
    </main>
  );
}
