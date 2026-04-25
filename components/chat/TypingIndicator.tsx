"use client";

import { Zap } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-up" role="status" aria-label="Assistant is typing">
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        .dot-bounce {
          animation: typingBounce 1.4s infinite ease-in-out;
        }
      `}</style>
      
      <div className="flex !gap-[12px]">
        {/* Avatar placeholder to match MessageBubble alignment */}
        <div className="!w-[32px] !h-[32px] rounded-[10px] shrink-0 flex items-center justify-center bg-white text-[var(--accent)] border-[1px] border-[var(--accent-border)] !mt-[4px] shadow-sm" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="10 7 17 7 17 14" />
            <line x1="7" y1="7" x2="11" y2="11" opacity="0.5" />
          </svg>
        </div>

        <div className="bg-white border-[1px] border-[var(--border)] rounded-[4px_20px_20px_20px] !px-[22px] !py-[14px] flex items-center !gap-[6px] shadow-sm">
          <span className="!w-[6px] !h-[6px] bg-[var(--accent)] rounded-full dot-bounce" style={{ animationDelay: '0ms' }} />
          <span className="!w-[6px] !h-[6px] bg-[var(--accent)] rounded-full dot-bounce" style={{ animationDelay: '150ms' }} />
          <span className="!w-[6px] !h-[6px] bg-[var(--accent)] rounded-full dot-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

