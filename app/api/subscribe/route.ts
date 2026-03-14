// app/api/subscribe/route.ts
export const runtime = 'edge';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@') || !email.includes('.')) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Store as hash — email is key, timestamp + source as value
    const existing = await redis.hexists('subscribers', normalizedEmail);

    if (existing) {
      return Response.json({ success: true, message: "You're already subscribed." });
    }

    await redis.hset('subscribers', {
      [normalizedEmail]: JSON.stringify({
        createdAt: new Date().toISOString(),
        source: req.headers.get('referer') || 'unknown',
      }),
    });

    return Response.json({
      success: true,
      message: "You're on the list. We'll notify you when new tools go live.",
    });
  } catch (err) {
    console.error('[subscribe] error:', err);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
