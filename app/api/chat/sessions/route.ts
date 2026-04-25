import { NextRequest, NextResponse } from "next/server";
import { getSessions, initDB } from "@/agent/db";
let initialized = false;

export async function GET(req: NextRequest) {
  if (!initialized) {
    await initDB();
    initialized = true;
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const sessions = await getSessions(userId);
    return NextResponse.json({ sessions });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
