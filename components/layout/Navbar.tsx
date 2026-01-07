import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
        >
          Wealthifyx
        </Link>

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/tools" className="hover:text-gray-900">
            Tools
          </Link>
          <Link href="/about" className="hover:text-gray-900">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
