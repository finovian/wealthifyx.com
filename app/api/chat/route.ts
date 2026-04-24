
import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/agent/agent";
import { saveMessage, getHistory, initDB } from "@/agent/db";

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, userId } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!sessionId || !userId) {
      return NextResponse.json({ error: "Session and User ID are required" }, { status: 400 });
    }

    // Ensure DB is ready (in production you might do this elsewhere or assume it's done)
    await initDB();

    // 1. Save user message to DB
    await saveMessage(userId, sessionId, "user", message);

    // 2. Fetch last N messages for context (e.g., last 6 messages)
    const dbHistory = await getHistory(sessionId, 6);
    
    // Convert DB history to format expected by runAgent
    // Note: getHistory already returns {role, content}
    const historyForModel = dbHistory.map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content
    })).filter(m => m.content !== message); // Avoid duplicating current message if it's already in history

    // 3. Run agent
    const result = await runAgent(message, historyForModel as any);

    // 4. Save assistant response to DB
    await saveMessage(userId, sessionId, "assistant", result.answer);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[Agent API Error]", err);
    return NextResponse.json(
      { error: err.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}

// Add a GET method to fetch history if needed
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    const history = await getHistory(sessionId, 50); // Fetch more for UI display
    return NextResponse.json({ history });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}