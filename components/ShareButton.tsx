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
      className="w-full cursor-pointer flex items-center justify-center gap-[10px] p-[16px] bg-[var(--accent-bg)] border-[1.5px] border-[var(--accent-border)] rounded-[16px] font-ubuntu text-[14px] font-[600] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[white] hover:border-[var(--accent)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_2px_10px_-3px_rgba(22,163,74,0.15)] hover:shadow-[0_8px_25px_-5px_rgba(22,163,74,0.3)] active:scale-[0.98]"
    >
      {copied ? (
        <>
          <Check size={18} className="shrink-0 transition-colors" />
          <span className="tracking-[0.2px]">Link copied to clipboard!</span>
        </>
      ) : (
        <>
          <Share2 size={18} className="shrink-0 group-hover:rotate-[-12deg] transition-transform duration-300" />
          <span className="tracking-[0.2px]">Share My Results</span>
        </>
      )}
    </button>
  );
}
