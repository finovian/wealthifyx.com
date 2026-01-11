"use client";

import Link from "next/link";
import { event as trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function ExploreToolsLink() {
  return (
    <Link
      href="/tools"
      className={cn(buttonVariants({ variant: "outline" }), "mt-10")}
      onClick={() => {
        trackEvent("cta_click_primary", {
          cta_name: "explore_tools",
          location: "home_hero",
        });
      }}
    >
      Explore tools
    </Link>
  );
}