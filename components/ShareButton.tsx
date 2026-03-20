"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  params: Record<string, string | number | undefined>;
  disabled?: boolean;
}

export default function ShareButton({ params, disabled }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    const url = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`;
    
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: url,
      }).catch(() => {
        // Fallback to clipboard if share fails or is cancelled
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-[10px] p-[14px] bg-[var(--bg-card)] border-[1px] border-[var(--border-strong)] rounded-[14px] font-ubuntu text-[13px] font-[500] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
    >
      {copied ? (
        <>
          <Check size={16} className="text-[var(--positive)]" />
          <span>Link copied to clipboard!</span>
        </>
      ) : (
        <>
          <Share2 size={16} className="group-hover:scale-110 transition-transform" />
          <span>Share Results</span>
        </>
      )}
    </button>
  );
}
