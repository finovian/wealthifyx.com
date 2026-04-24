import type { Metadata } from "next";
import ChatClient from "../../components/chat/ChatClient";

export const metadata: Metadata = {
  title: "AI Financial Chat Assistant | WealthifyX",
  description:
    "Ask financial questions and get personalized insights using AI-powered tools.",
  openGraph: {
    title: "AI Financial Chat Assistant | WealthifyX",
    description:
      "Ask financial questions and get personalized insights using AI-powered tools.",
  },
};

export default function ChatPage() {
  return (
    <main className="h-[100dvh] flex flex-col overflow-hidden bg-[var(--bg-base)]">
      <ChatClient />
    </main>
  );
}
