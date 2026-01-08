import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { generateWebsiteSchema } from "@/lib/schema";

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
        <script defer src="https://www.googletagmanager.com/gtag/js?id=G-6PR1F8E717" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6PR1F8E717');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteSchema()) }}
        />
        <Navbar />
        <main className="mx-auto max-w-6xl px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
