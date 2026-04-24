
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


    await initDB();


    await saveMessage(userId, sessionId, "user", message);


    const dbHistory = await getHistory(sessionId, 6);
    

    const historyForModel = dbHistory.map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content
    })).filter(m => m.content !== message); 


    const result = await runAgent(message, historyForModel as any);


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