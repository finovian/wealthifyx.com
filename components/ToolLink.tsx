"use client";

import Link from "next/link";
import { event as trackEvent } from "@/lib/analytics";

interface ToolLinkProps {
  href: string;
  toolName: string;
  children: React.ReactNode;
}

export default function ToolLink({ href, toolName, children }: ToolLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        trackEvent("tool_select", {
          tool_name: toolName,
          location: "home_tools_list",
        });
      }}
      className="block border-b border-gray-200 py-6"
    >
      {children}
    </Link>
  );
}
