import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { ThemeProvider } from "../components/ThemeProvider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmailCapture from "@/components/EmailCapture";
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  metadataBase: new URL("https://wealthifyx.com"),
  title: {
    default: "WealthifyX — Free Finance Calculators",
    template: "%s | WealthifyX",
  },
  description:
    "Free, precise finance calculators for investors. CAGR, compound interest, retirement planning, and more. No accounts. No data stored. Always free.",
  openGraph: {
    siteName: "WealthifyX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('wealthifyx-theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (!theme) theme = 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* ── Site-level schemas — injected once globally ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "WealthifyX",
              url: "https://wealthifyx.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://wealthifyx.com/tools?q={query}",
                "query-input": "required name=query",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "WealthifyX",
              url: "https://wealthifyx.com",
              description:
                "Free precision finance calculators built for investors.",
            }),
          }}
        />
      </head>
      <body style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <ThemeProvider>
          {/* ── Google Analytics 4 ── */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-6PR1F8E717"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6PR1F8E717', {
                page_path: window.location.pathname,
                send_page_view: true
              });
            `}
          </Script>
          <Suspense fallback={null}>
            <AnalyticsProvider />
            <Analytics />
          </Suspense>
          <Navbar />
          {children}
          <EmailCapture />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
