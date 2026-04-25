"use client";

import { User } from "lucide-react";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-[100%] ${isUser ? "justify-end" : "justify-start"} animate-fade-up`}
      role="listitem"
    >
      <div
        className={`flex gap-[12px] max-w-[95%] sm:max-w-[85%] md:max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        <div
          className={`w-[32px] h-[32px] rounded-[10px] shrink-0 flex items-center justify-center mt-[4px] shadow-sm border-[1px] transition-transform duration-200 hover:scale-105 ${
            isUser
              ? "bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border)]"
              : "bg-white text-[var(--accent)] border-[var(--accent-border)]"
          }`}
          aria-hidden="true"
        >
          {isUser ? (
            <User size={14} strokeWidth={2.5} />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="10 7 17 7 17 14" />
              <line x1="7" y1="7" x2="11" y2="11" opacity="0.5" />
            </svg>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`flex flex-col gap-[8px] ${isUser ? "items-end" : "items-start"} min-w-0`}
        >
          <div
            className={`p-[14px_20px] text-[15px] leading-[1.6] font-sans transition-all duration-200 ${
              isUser
                ? "bg-[var(--accent)] text-white rounded-[20px_4px_20px_20px] shadow-[0_4px_15px_rgba(var(--accent-rgb),0.2)]"
                : "bg-white text-[var(--text-primary)] border-[1px] border-[var(--border)] rounded-[4px_20px_20px_20px] shadow-sm hover:shadow-md"
            }`}
          >
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({children}) => <p className="mb-2 last:mb-0 whitespace-pre-wrap break-words font-[450]">{children}</p>,
                  ul: ({children}) => <ul className="list-disc ml-4 mb-2 flex flex-col gap-1">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal ml-4 mb-2 flex flex-col gap-1">{children}</ol>,
                  li: ({children}) => <li className="mb-0">{children}</li>,
                  strong: ({children}) => <strong className="font-[700]">{children}</strong>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
          <div className="flex items-center gap-[6px] px-[4px]">
             <span className="text-[10px] text-[var(--text-faint)] font-[700] tracking-[0.5px] uppercase opacity-70">
              {isUser ? "You" : "WealthifyX AI"}
            </span>
            <span className="w-[3px] h-[3px] rounded-full bg-[var(--text-faint)] opacity-30"></span>
            <span className="text-[10px] text-[var(--text-faint)] font-mono tracking-tight opacity-70">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MessageBubble);
