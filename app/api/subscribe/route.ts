export const runtime = "edge";

import { Redis } from "@upstash/redis";

export async function POST(req: Request) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  try {
    const { email } = await req.json();

    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return Response.json({ error: "Missing env vars" }, { status: 500 });
    }

    if (
      !email ||
      typeof email !== "string" ||
      !email.includes("@") ||
      !email.includes(".")
    ) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await redis.hexists("subscribers", normalizedEmail);

    if (existing) {
      return Response.json({
        success: true,
        message: "You're already subscribed.",
      });
    }

    await redis.hset("subscribers", {
      [normalizedEmail]: JSON.stringify({
        createdAt: new Date().toISOString(),
        source: req.headers.get("referer") || "unknown",
      }),
    });

    return Response.json({
      success: true,
      message: "You're on the list. We'll notify you when new tools go live.",
    });
  } catch (err) {
    console.error("[subscribe] error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

