import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Wealthifyx",
  description: "Read the Wealthifyx privacy policy. We do not track or store your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </header>

      <article className="prose prose-gray max-w-none">
        <p>
          Your privacy is important to us. It is Wealthifyx's policy to respect
          your privacy regarding any information we may collect from you across
          our website.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We do not collect any personally identifiable information (PII) from
          our users. You can use all the tools on our website without creating
          an account or providing any personal data.
        </p>
        <p>
          The data you enter into the calculators is processed in your browser
          and is not stored on our servers.
        </p>

        <h2>2. Cookies and Analytics</h2>
        <p>
          We may use cookies to help improve your experience of our website.
          These cookies are used to store information about your preferences and
          to track your usage of the site.
        </p>
        <p>
          We use Google Analytics to understand how our website is used. This
          service may collect information such as your device's IP address,
          browser type, and the pages you visit. This data is aggregated and
          anonymized, and cannot be used to identify you personally.
        </p>

        <h2>3. Advertising</h2>
        <p>
          We may use Google AdSense to display ads on our website. Google AdSense
          may use cookies to serve ads based on your prior visits to this and
          other websites. You can opt out of personalized advertising by
          visiting Google's Ad Settings.
        </p>

        <h2>4. Links to Other Sites</h2>
        <p>
          Our website may contain links to other sites that are not operated by
          us. Please be aware that we have no control over the content and
          practices of these sites, and cannot accept responsibility or
          liability for their respective privacy policies.
        </p>

        <h2>5. Changes to This Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us.
        </p>
      </article>
    </main>
  );
}
