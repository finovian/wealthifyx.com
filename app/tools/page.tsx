import Link from "next/link";

const tools = [
  {
    name: "SIP Calculator",
    description: "Estimate future value of monthly investments",
    href: "/tools/sip-calculator",
  },
  {
    name: "Stock Return Calculator",
    description: "Calculate CAGR and total returns",
    href: "/tools/stock-return",
  },
];

export default function ToolsPage() {
  return (
    <section className="py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Finance Tools
        </h1>
        <p className="mt-2 text-gray-600">
          Simple, fast, and free calculators to help you make better
          investment decisions.
        </p>
      </header>

      <div className="divide-y divide-gray-200">
        {tools.map(tool => (
          <Link
            key={tool.name}
            href={tool.href}
            className="block py-6 transition hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium text-gray-900">
              {tool.name}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
