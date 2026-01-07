import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Wealthifyx",
  description: "Read the Wealthifyx terms of service.",
};

export default function TermsPage() {
  return (
    <main className="py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </header>

      <article className="prose prose-gray max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Wealthifyx (the "Website"), you accept and
          agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Educational Use Only</h2>
        <p>
          All calculators, tools, and content on this Website are for
          informational and educational purposes only. They are not intended as
          financial advice.
        </p>

        <h2>3. No Financial Advice</h2>
        <p>
          The information provided on this Website does not constitute
          investment advice, financial advice, trading advice, or any other
          sort of advice and you should not treat any of the Website's content
          as such. Wealthifyx does not recommend that any financial instrument
          should be bought, sold, or held by you.
        </p>

        <h2>4. Limitation of Liability</h2>
        <p>
          The information on this website is provided "as is" without any
          warranties, expressed or implied. Wealthifyx will not be liable for
          any losses, injuries, or damages from the display or use of this
          information.
        </p>

        <h2>5. Accuracy of Information</h2>
        <p>
          We strive to provide accurate information, but we make no representation
          or warranty of any kind, express or implied, regarding the accuracy,
          adequacy, validity, reliability, availability, or completeness of any
          information on the site.
        </p>

        <h2>6. Changes to aour Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will notify
          you of any changes by posting the new Terms of Service on this page.
        </p>
      </article>
    </main>
  );
}
