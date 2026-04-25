
import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/agent/agent";
import { saveMessage, getHistory, initDB } from "@/agent/db";

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, userId } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: "Message too long (max 2000 chars)" }, { status: 400 });
    }

    if (!sessionId || !userId) {
      return NextResponse.json({ error: "Session and User ID are required" }, { status: 400 });
    }

    await initDB();
    await saveMessage(userId, sessionId, "user", message);

    const dbHistory = await getHistory(sessionId, 6);

    const historyForModel = dbHistory.map(m => ({
      role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
      content: m.content
    })).filter(m => m.content !== message);

    const result = await runAgent(message, sessionId, historyForModel ?? []);

    await saveMessage(userId, sessionId, "assistant", result.answer);

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("[Agent API Error]", err);

    return NextResponse.json(
      { error: "Our AI assistant is currently unavailable. Please try again later." },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    const history = await getHistory(sessionId, 50);
    return NextResponse.json({ history });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}