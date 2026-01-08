import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateBreadcrumbSchema } from "@/lib/schema";

const breadcrumbs = [{ name: "Home", url: "/" }];

export default function Home() {
  return (
    <div className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Simple finance tools for better money decisions
      </h1>

      <p className="mt-4 text-lg text-gray-600">
        Clean, fast, and free calculators for investors worldwide.
      </p>

      <Link
        href="/tools"
        className={cn(buttonVariants({ variant: "outline" }), "mt-8")}
      >
        Explore tools
      </Link>

      <div className="mt-16">
        <h2 className="text-xl font-semibold">Featured tools</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          <li>
            <Link
              href="/tools/sip-calculator"
              className="block rounded-lg border p-4 hover:border-gray-400"
            >
              <h3 className="font-semibold">SIP Calculator</h3>
              <p className="text-sm text-gray-600">
                Estimate future value of your monthly investments.
              </p>
            </Link>
          </li>
          <li>
            <Link
              href="/tools/stock-return"
              className="block rounded-lg border p-4 hover:border-gray-400"
            >
              <h3 className="font-semibold">Stock Return / CAGR Calculator</h3>
              <p className="text-sm text-gray-600">
                Calculate CAGR and total returns on your investments.
              </p>
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-16 rounded-lg border border-dashed p-4 text-center">
        <h3 className="font-semibold">No signup. No tracking. Just calculations.</h3>
        <p className="text-sm text-gray-600">
          Your privacy is important. We do not store or sell your data.
        </p>
      </div>
    </div>
  );
}
