"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "./ChatInput";
import MessageBubble, { type ChatMessage } from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import EmptyState from "./EmptyState";
import ErrorBanner from "./ErrorBanner";
import ChatHeader from "./ChatHeader";


let idCounter = 0;
function generateId(): string {
  return `msg_${Date.now()}_${++idCounter}`;
}

export default function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [userId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      let storedUserId = localStorage.getItem("wx_user_id");
      if (!storedUserId) {
        storedUserId = uuidv4();
        localStorage.setItem("wx_user_id", storedUserId);
      }
      return storedUserId;
    }
    return "";
  });

  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      let currentSessionId = sessionStorage.getItem("wx_session_id");
      if (!currentSessionId) {
        currentSessionId = uuidv4();
        sessionStorage.setItem("wx_session_id", currentSessionId);
      }
      return currentSessionId;
    }
    return "";
  });

  const fetchHistory = useCallback(async (sid: string) => {
    if (!sid) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsHistoryLoading(true);
    try {
      const res = await fetch(`/api/chat?sessionId=${sid}`, {
        signal: abortControllerRef.current.signal
      });
      if (res.ok) {
        const data = await res.json();
        // Double check sid matches current session before updating state
        if (data.history) {
          const chatMessages: ChatMessage[] = data.history.map((h: { role: string; content: string }) => ({
            id: generateId(),
            role: h.role === "assistant" ? "assistant" : "user",
            content: h.content,
            timestamp: Date.now(),
          }));
          setMessages(chatMessages);
        } else {
          setMessages([]);
        }
      }
    } catch (err: unknown) {
      const isAbort = (err instanceof Error && err.name === 'AbortError') || 
                      (typeof err === 'object' && err !== null && 'name' in err && err.name === 'AbortError');
      if (isAbort) return;
      
      console.error("Failed to load history:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchHistory(sessionId);
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [sessionId, fetchHistory]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!isHistoryLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading, isHistoryLoading, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading || !userId || !sessionId) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setError(null);
      setLastUserMessage(text);

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const currentSid = sessionId;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            sessionId: currentSid,
            userId,
          }),
          signal: abortControllerRef.current.signal
        });

        if (!res.ok) {
          let errorMessage = `Server error (${res.status})`;
          try {
            const errData = await res.json();
            errorMessage = errData.error || errorMessage;
          } catch (e) {
             console.error("Error parsing error response:", e);
          }
          throw new Error(errorMessage);
        }

        const data = await res.json();
        const reply = data.answer || "I couldn't generate a response.";

        setMessages((prev) => {
          const assistantMsg: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: reply,
            timestamp: Date.now(),
          };
          return [...prev, assistantMsg];
        });
      } catch (err: unknown) {
        const isAbort = (err instanceof Error && err.name === 'AbortError') || 
                        (typeof err === 'object' && err !== null && 'name' in err && err.name === 'AbortError');
        if (isAbort) return;
        
        console.error("[ChatClient] error:", err);
        const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, userId, sessionId]
  );

  const handleRetry = useCallback(() => {
    if (lastUserMessage) {
      setError(null);
      setMessages((prev) => {
        const withoutLast = [...prev];
        if (withoutLast.length > 0 && withoutLast[withoutLast.length - 1].role === "user") {
          withoutLast.pop();
        }
        return withoutLast;
      });
      sendMessage(lastUserMessage);
    }
  }, [lastUserMessage, sendMessage]);

  const handleReset = useCallback(() => {
    const newSessionId = uuidv4();
    sessionStorage.setItem("wx_session_id", newSessionId);
    setSessionId(newSessionId);
    setMessages([]);
    setError(null);
    setLastUserMessage(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const handleAbort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const handleSessionSelect = useCallback((sid: string) => {
    if (sid === sessionId) return;
    sessionStorage.setItem("wx_session_id", sid);
    setSessionId(sid);
    setError(null);
    setLastUserMessage(null);
  }, [sessionId]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-[100%] w-[100%] overflow-hidden bg-[var(--bg-base)]" suppressHydrationWarning>
      <ChatHeader 
        onReset={handleReset} 
        onSessionSelect={handleSessionSelect}
        messageCount={messages.length} 
        userId={userId}
        currentSessionId={sessionId}
      />

      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,var(--bg-subtle),transparent)] relative"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {isHistoryLoading ? (
          <div className="h-full flex items-center justify-center animate-fade-in bg-[var(--bg-base)]">
            <div className="flex flex-col items-center gap-[20px]">
              <div className="flex items-center gap-[6px]">
                <span className="w-[8px] h-[8px] bg-[var(--accent)] rounded-full animate-[pulse_1s_infinite_0ms] shadow-[0_0_8px_var(--accent-bg)]"></span>
                <span className="w-[8px] h-[8px] bg-[var(--accent)] rounded-full animate-[pulse_1s_infinite_200ms] shadow-[0_0_8px_var(--accent-bg)]"></span>
                <span className="w-[8px] h-[8px] bg-[var(--accent)] rounded-full animate-[pulse_1s_infinite_400ms] shadow-[0_0_8px_var(--accent-bg)]"></span>
              </div>
              <div className="flex flex-col items-center gap-[4px]">
                <span className="text-[12px] text-[var(--text-primary)] font-[700] uppercase tracking-[2px]">Synchronizing</span>
                <span className="text-[10px] text-[var(--text-faint)] font-[500] uppercase tracking-[1px]">Loading your conversation</span>
              </div>
            </div>
          </div>
        ) : !hasMessages && !isLoading ? (
          <EmptyState onSuggestionClick={sendMessage} />
        ) : (
          <div className="max-w-[800px] mx-auto p-[24px_20px] lg:p-[40px_48px] flex flex-col gap-[32px]">
            <div role="list" className="flex flex-col gap-[32px]">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>

            {isLoading && <TypingIndicator />}

            {error && !isLoading && (
              <ErrorBanner message={error} onRetry={handleRetry} />
            )}

            <div ref={bottomRef} className="h-[1px]" aria-hidden="true" />
          </div>
        )}
      </div>

      <ChatInput 
        key={sessionId}
        onSend={sendMessage}
        onAbort={handleAbort}
        isLoading={isLoading}
        disabled={isHistoryLoading} 
      />
    </div>
  );
}
