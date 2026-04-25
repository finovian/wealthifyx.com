"use client";

import { useState, useRef, FormEvent, KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    // Cap at ~4 lines (approx 96px)
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  };

  return (
    <div className="w-[100%] bg-[var(--bg-base)] border-t-[1px] border-[var(--border)] p-[12px_16px] lg:p-[20px_48px] shrink-0 z-[20]">
      <div className="max-w-[800px] mx-auto">
        <div className="relative flex items-end bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[20px] p-[4px] sm:p-[6px] shadow-sm focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--accent-bg)] transition-all duration-[0.2s]">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent border-none outline-none p-[10px_12px] sm:p-[12px_16px] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-faint)] font-sans resize-none leading-[1.6] min-h-[44px] max-h-[120px]"
            placeholder="Ask a financial question..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            disabled={disabled}
            rows={1}
            aria-label="Type your message"
            id="chat-input"
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-[12px] sm:rounded-[14px] bg-[var(--accent)] text-white flex items-center justify-center disabled:opacity-[0.25] transition-all duration-[0.2s] hover:bg-[var(--accent-hover)] active:scale-[0.92] cursor-pointer shrink-0 m-[2px] shadow-sm hover:shadow-md border-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:hover:bg-[var(--accent)] disabled:focus:ring-[var(--accent)] disabled:focus:ring-offset-0"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-[6px] mt-[8px] sm:mt-[10px] m-[8px_0_0_0]">
           <span className="hidden sm:block w-[4px] h-[4px] rounded-full bg-[var(--text-faint)] opacity-40"></span>
           <p className="text-[9px] sm:text-[10px] text-[var(--text-faint)] font-[500] font-sans tracking-[0.3px] uppercase text-center">
             AI Financial Guide • Educational purposes only
           </p>
           <span className="hidden sm:block w-[4px] h-[4px] rounded-full bg-[var(--text-faint)] opacity-40"></span>
        </div>
      </div>
    </div>
  );
}
