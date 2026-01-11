"use client";

import Link from "next/link";
import { event as trackEvent } from "@/lib/analytics";

interface ToolLinkProps {
  href: string;
  toolName: string;
  location: string;
  children: React.ReactNode;
}

export default function ToolsLink({
  href,
  toolName,
  location,
  children,
}: ToolLinkProps) {
  return (
    <Link
      href={href}
      className="block border-b border-gray-200 py-6"
      onClick={() => {
        trackEvent("tool_select", {
          tool_name: toolName,
          location,
        });
      }}
    >
      {children}
    </Link>
  );
}
