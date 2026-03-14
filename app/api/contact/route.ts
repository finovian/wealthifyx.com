export const runtime = 'edge';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return Response.json({ error: 'Please enter your name.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!subject || typeof subject !== 'string') {
      return Response.json({ error: 'Please select a subject.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return Response.json({ error: 'Message must be at least 10 characters long.' }, { status: 400 });
    }

    // Store as a list — each contact message is a JSON string pushed to 'contact_messages'
    await redis.lpush(
      'contact_messages',
      JSON.stringify({
        name:      name.trim(),
        email:     email.toLowerCase().trim(),
        subject,
        message:   message.trim(),
        createdAt: new Date().toISOString(),
        ip:        req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent')      || 'unknown',
      })
    );

    return Response.json({
      success: true,
      message: "Message received! We'll get back to you within 24–48 hours.",
    });
  } catch (err) {
    console.error('[contact] error:', err);
    return Response.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}