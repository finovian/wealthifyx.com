"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="flex justify-start animate-fade-up" role="alert">
      <div className="flex gap-[10px] max-w-[88%] md:max-w-[75%]">
        {/* Avatar placeholder */}
        <div className="w-[28px] h-[28px] rounded-full shrink-0 flex items-center justify-center bg-[var(--bg-muted)] text-[var(--negative)] border-[1px] border-[var(--border)] mt-[2px]" aria-hidden="true">
          <AlertTriangle size={13} />
        </div>

        <div className="flex flex-col gap-[6px] items-start">
          <div className="p-[10px_16px] text-[13px] leading-[1.6] font-sans bg-[var(--bg-subtle)] text-[var(--negative)] border-[1px] border-[var(--border)] rounded-[4px_16px_16px_16px]">
            {message}
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-[6px] text-[11px] font-ubuntu font-medium text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors duration-150 bg-transparent border-none cursor-pointer px-[4px]"
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
