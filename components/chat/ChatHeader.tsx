"use client";

import { RefreshCcw, Zap, History, ChevronDown, X, ArrowLeft, Moon, Sun } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "../ThemeProvider";

interface ChatHeaderProps {
  onReset: () => void;
  onSessionSelect: (sessionId: string) => void;
  messageCount: number;
  userId: string;
  currentSessionId: string;
}

export default function ChatHeader({ 
  onReset, 
  onSessionSelect, 
  messageCount, 
  userId, 
  currentSessionId 
}: ChatHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<{session_id: string, last_active: string}[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showHistory && userId) {
      fetch(`/api/chat/sessions?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.sessions) setSessions(data.sessions);
        })
        .catch(err => console.error("Failed to load sessions:", err));
    }
  }, [showHistory, userId]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    }
    if (showHistory) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHistory]);

  return (
    <header className="w-[100%] h-[60px] border-b-[1px] border-[var(--border)] bg-[var(--bg-base)] flex items-center justify-between p-[0_20px] lg:p-[0_48px] shrink-0 z-[100] relative">
      {/* <div className="flex items-center gap-[12px]">
        <Link 
          href="/" 
          className="flex items-center justify-center p-[6px] rounded-[8px] text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all mr-[-4px]"
          title="Back to Home"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </Link>

        <Link href="/" className="flex items-center gap-[12px] no-underline group">
          <div className="w-[32px] h-[32px] rounded-[10px] bg-[var(--accent)] flex items-center justify-center text-white shadow-[0_2px_12px_var(--accent-bg)] group-hover:scale-105 transition-transform shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="10 7 17 7 17 14" />
              <line x1="7" y1="7" x2="11" y2="11" opacity="0.5" />
            </svg>
          </div>
          <div className="flex flex-col gap-[1px]">
            <h1 className="text-[13px] sm:text-[14px] font-[700] text-[var(--text-primary)] leading-none font-sans tracking-[-0.3px]">
              WealthifyX AI
            </h1>
            <div className="flex items-center gap-[6px]">
              <span className="relative flex h-[5px] w-[5px] sm:h-[6px] sm:w-[6px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-[5px] w-[5px] sm:h-[6px] sm:w-[6px] bg-[var(--accent)]"></span>
              </span>
              <p className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-[600] uppercase tracking-[1px] font-sans m-[0]">
                Live Assistant
              </p>
            </div>
          </div>
        </Link>
      </div> */}

      <a
          href="/"
          className="flex items-center no-underline shrink-0 group w-fit"
        >
          <div className="flex flex-col leading-none">
            <span className="font-sans text-[18px] font-[500] tracking-[-0.5px] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-[0.15s]">
              WealthifyX 
            </span>
          </div>
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] ml-[2px] mb-[-10px] shrink-0" />
        </a>

      <div className="flex items-center gap-[6px] sm:gap-[10px]" ref={dropdownRef}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="bg-transparent border-none cursor-pointer text-[var(--text-muted)] flex items-center justify-center rounded-[8px] w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all duration-[0.15s] shrink-0"
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* Backdrop for mobile to handle click-away and focus */}
        {showHistory && (
          <div 
            className="md:hidden fixed inset-0 bg-black/5 backdrop-blur-[2px] z-[105]" 
            onClick={() => setShowHistory(false)}
          />
        )}
        
        {/* History Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-[6px] text-[11px] font-[700] uppercase tracking-[1px] font-sans p-[7px_10px] sm:p-[8px_12px] rounded-[10px] border-[1px] transition-all cursor-pointer ${
              showHistory 
                ? 'bg-[var(--accent-bg)] border-[var(--accent-border)] text-[var(--accent)]' 
                : 'bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] shadow-sm'
            }`}
          >
            <History size={14} />
            <span className="hidden sm:inline">History</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${showHistory ? 'rotate-180' : ''}`} />
          </button>

          {showHistory && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-[300px] max-md:fixed max-md:top-[70px] max-md:left-[16px] max-md:right-[16px] max-md:w-auto bg-[var(--bg-card)] border-[1px] border-[var(--border)] rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-[12px] flex flex-col gap-[8px] animate-fade-up z-[110] backdrop-blur-[10px]">
              <div className="flex items-center justify-between px-[10px] py-[6px] border-b-[1px] border-[var(--border)] mb-[6px]">
                <span className="text-[10px] font-[800] text-[var(--text-faint)] uppercase tracking-[1.5px]">Recent Conversations</span>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-[4px] hover:bg-[var(--bg-subtle)] rounded-full transition-colors"
                >
                  <X size={14} className="text-[var(--text-faint)]" />
                </button>
              </div>
              <div className="max-h-[350px] overflow-y-auto flex flex-col gap-[6px] no-scrollbar">
                {sessions.length === 0 ? (
                  <div className="text-center py-[32px]">
                    <div className="w-[40px] h-[40px] bg-[var(--bg-subtle)] rounded-full flex items-center justify-center mx-auto mb-[10px]">
                      <History size={18} className="text-[var(--text-faint)] opacity-30" />
                    </div>
                    <p className="text-[13px] text-[var(--text-muted)] font-[500]">No chat history found</p>
                  </div>
                ) : (
                  sessions.map(s => (
                    <button
                      key={s.session_id}
                      onClick={() => {
                        onSessionSelect(s.session_id);
                        setShowHistory(false);
                      }}
                      className={`text-left p-[12px_14px] rounded-[14px] transition-all cursor-pointer group relative overflow-hidden ${
                        currentSessionId === s.session_id 
                          ? 'bg-[var(--accent-bg)] text-[var(--accent)] border-[1px] border-[var(--accent-border)]' 
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] border-[1px] border-transparent hover:border-[var(--border)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 relative z-10">
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="truncate font-[700] text-[13px] tracking-[-0.2px]">
                            {s.session_id.split('-')[0].toUpperCase()} Thread
                          </div>
                          <div className="text-[10px] opacity-60 font-[500]">
                            {new Date(s.last_active).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        {currentSessionId === s.session_id && (
                          <div className="w-[6px] h-[6px] bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]"></div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {messageCount > 0 && (
          <button
            onClick={onReset}
            aria-label="Reset chat session"
            className="text-[11px] font-[700] text-[var(--text-faint)] hover:text-[var(--accent)] uppercase tracking-[1px] flex items-center gap-[8px] transition-all duration-[0.2s] bg-[var(--bg-subtle)] border-[1px] border-[var(--border)] cursor-pointer font-sans p-[8px_14px] rounded-[10px] hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] shadow-sm"
          >
            <RefreshCcw size={12} strokeWidth={2.5} />
            <span className="hidden sm:inline">New Thread</span>
          </button>
        )}
      </div>
    </header>
  );
}
