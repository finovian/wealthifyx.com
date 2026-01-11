import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { generateWebsiteSchema } from "@/lib/schema";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Wealthifyx – Simple Finance Tools",
  description:
    "Clean, fast, and free finance calculators to help you make better investment decisions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="icon" href="/favicon.svg" />

        {/* GA4 base script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6PR1F8E717"
          strategy="afterInteractive"
        />

        {/* GA4 init */}
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            gtag('js', new Date());
            gtag('config', 'G-6PR1F8E717', {
              debug_mode: true
            });
          `}
        </Script>
      </head>

      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteSchema()),
          }}
        />

        <Navbar />
        <main className="mx-auto max-w-6xl px-4">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}