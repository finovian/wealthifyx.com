"use client";

import { RefreshCcw, History, ChevronDown, X, Moon, Sun } from "lucide-react";
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

      <Link
          href="/"
          className="flex items-center no-underline shrink-0 group w-fit"
        >
          <div className="flex flex-col leading-none">
            <span className="font-sans text-[18px] font-[500] tracking-[-0.5px] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-[0.15s]">
              WealthifyX 
            </span>
          </div>
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] ml-[2px] mb-[-10px] shrink-0" />
        </Link>

      <div className="flex items-center gap-[4px] sm:gap-[8px] relative" ref={dropdownRef}>
        {/* Theme toggle - Minimalist style */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="bg-transparent border-none cursor-pointer text-[var(--text-muted)] flex items-center justify-center rounded-full w-[34px] h-[34px] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all duration-[0.15s] shrink-0"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <div className="h-[20px] w-[1px] bg-[var(--border)] mx-[4px] hidden sm:block" />

        {/* History Action */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center gap-[6px] h-[34px] px-[12px] rounded-full border transition-all duration-[0.15s] cursor-pointer font-sans text-[12px] font-[600] ${
            showHistory 
              ? 'bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--bg-base)] shadow-md' 
              : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <History size={14} strokeWidth={2.5} />
          <span className="hidden md:inline">History</span>
          <ChevronDown size={12} className={`transition-transform duration-[0.2s] opacity-60 ${showHistory ? 'rotate-180' : ''}`} />
        </button>

        {/* New Thread CTA - Fixed position for stability */}
        <button
          onClick={onReset}
          disabled={messageCount === 0}
          aria-label="New thread"
          className={`flex items-center justify-center gap-[8px] h-[34px] px-[14px] rounded-full transition-all duration-[0.15s] font-ubuntu text-[12px] font-[600] shrink-0 border ${
            messageCount > 0 
              ? 'bg-[var(--accent-bg)] text-[var(--accent)] border-[var(--accent-border)] cursor-pointer hover:bg-[var(--accent)] hover:text-[white]! shadow-sm'
              : 'bg-[var(--bg-subtle)] text-[var(--text-faint)] border-[var(--border)] cursor-not-allowed opacity-50'
          }`}
        >
          <RefreshCcw size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline ">New Thread</span>
        </button>

        {showHistory && (
          <>
            {/* Mobile Backdrop Overlay */}
            <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[105]" onClick={() => setShowHistory(false)} />
            
            <div className="nav-drop absolute top-[calc(100%+12px)] right-0 md:w-[320px] max-md:fixed max-md:top-[64px] max-md:left-[16px] max-md:right-[16px] max-md:w-auto bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] shadow-[0_20px_48px_rgba(0,0,0,0.14)] flex flex-col overflow-hidden z-[110] backdrop-blur-[12px]">
              <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-[var(--border)] bg-[var(--bg-subtle)]/50">
                <div className="flex items-center gap-[8px]">
                  <History size={13} className="text-[var(--accent)]" />
                  <span className="font-sans text-[11px] font-[800] text-[var(--text-primary)] uppercase tracking-[1.2px]">Recent Threads</span>
                </div>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-[5px] hover:bg-[var(--bg-muted)] rounded-full transition-colors duration-[0.1s] border-none h-[24px]! w-[24px]!"
                >
                  <X size={14} className="text-[var(--text-primary)] " />
                </button>
              </div>

              <div className="max-h-[40vh] md:max-h-[350px] overflow-y-auto p-[8px] flex flex-col gap-[2px] no-scrollbar">
                {sessions.length === 0 ? (
                  <div className="text-center py-[32px]">
                    <div className="w-[40px] h-[40px] bg-[var(--bg-subtle)] rounded-full flex items-center justify-center mx-auto mb-[12px] opacity-40">
                      <History size={18} />
                    </div>
                    <p className="font-sans text-[12px] text-[var(--text-faint)] font-[500]">No history found</p>
                  </div>
                ) : (
                  sessions.map(s => (
                    <button
                      key={s.session_id}
                      onClick={() => {
                        onSessionSelect(s.session_id);
                        setShowHistory(false);
                      }}
                      className={`text-left p-[10px_12px] rounded-[10px] transition-all duration-[0.1s] cursor-pointer group relative border ${
                        currentSessionId === s.session_id 
                          ? 'bg-[var(--accent-bg)] border-[var(--accent-border)]' 
                          : 'bg-transparent border-transparent hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-[12px]">
                        <div className="flex flex-col gap-[1px] min-w-0">
                          <div className={`truncate font-ubuntu text-[13px] font-[600] ${currentSessionId === s.session_id ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                            {s.session_id.split('-')[0].toUpperCase()} Conversation
                          </div>
                          <div className="font-sans text-[10px] text-[var(--text-faint)] font-[500]">
                            {new Date(s.last_active).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        {currentSessionId === s.session_id && (
                          <div className="w-[6px] h-[6px] bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              <div className="p-[12px] border-t border-[var(--border)] bg-[var(--bg-subtle)]/30">
                <button
                  onClick={() => { onReset(); setShowHistory(false); }}
                  className="w-full flex items-center justify-center gap-[8px] h-[38px] rounded-[10px] bg-[var(--accent)] text-white font-ubuntu text-[13px] font-[600] hover:bg-[var(--accent-hover)] transition-all duration-[0.15s] shadow-sm border-none"
                >
                  <RefreshCcw size={13} strokeWidth={2.5} />
                  New Conversation
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
