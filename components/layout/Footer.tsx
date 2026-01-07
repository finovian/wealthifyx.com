import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Wealthifyx</p>

        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-gray-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-900">
            Terms
          </Link>
          <Link href="/disclaimer" className="hover:text-gray-900">
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
}
