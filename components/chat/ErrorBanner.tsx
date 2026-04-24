"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="flex justify-start animate-fade-up" role="alert">
      <div className="flex !gap-2.5 max-w-[88%] md:max-w-[75%]">
        {/* Avatar placeholder */}
        <div className="!w-7 !h-7 rounded-full shrink-0 flex items-center justify-center bg-[var(--bg-muted)] text-[var(--negative)] border border-[var(--border)] !mt-0.5" aria-hidden="true">
          <AlertTriangle size={13} />
        </div>

        <div className="flex flex-col !gap-1.5 items-start">
          <div className="!px-4 !py-2.5 text-[13px] leading-[1.6] font-sans bg-[var(--bg-subtle)] text-[var(--negative)] border border-[var(--border)] rounded-[16px] rounded-tl-[4px]">
            {message}
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center !gap-1.5 text-[11px] font-ubuntu font-medium text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors duration-150 bg-transparent border-none cursor-pointer px-1"
            >
              <RotateCcw size={10} />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
