import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Basic validation
    if (!email || typeof email !== "string" || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const client = await clientPromise;
    const db = client.db("wealthifyx");

    // Upsert — silently ignore duplicates
    const result = await db.collection("subscribers").updateOne(
      { email: normalizedEmail },
      {
        $setOnInsert: {
          email: normalizedEmail,
          createdAt: new Date(),
          source: req.headers.get("referer") || "unknown",
        },
      },
      { upsert: true }
    );

    const isNew = result.upsertedCount > 0;

    return NextResponse.json({
      success: true,
      message: isNew
        ? "You're on the list. We'll notify you when new tools go live."
        : "You're already subscribed.",
    });
  } catch (err) {
    console.error("[subscribe] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}