import { neon } from "@neondatabase/serverless";

function getDB() {
  const url = process.env.NEON_DATABASE_URL;

  if (!url) {
    throw new Error("Missing NEON_DATABASE_URL");
  }

  return neon(url);
}

export async function initDB() {
  const sql = getDB();

  await sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  try {
    await sql`
      ALTER TABLE conversations 
      ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'legacy_user'
    `;
  } catch (e) {
    console.log("Migration notice:", e);
  }

  await sql`
    CREATE INDEX IF NOT EXISTS idx_session_id 
    ON conversations(session_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_user_session 
    ON conversations(user_id, session_id)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_session_created 
    ON conversations(session_id, created_at DESC)
  `;
}


const VALID_ROLES = ["user", "assistant", "system", "tool"] as const;
type Role = (typeof VALID_ROLES)[number];


export async function saveMessage(
  userId: string,
  sessionId: string,
  role: Role,
  content: string
) {
  if (!content.trim()) return;

  if (!VALID_ROLES.includes(role)) {
    throw new Error(`Invalid role: ${role}`);
  }

  const sql = getDB();

  try {
    await sql`
      INSERT INTO conversations (user_id, session_id, role, content)
      VALUES (${userId}, ${sessionId}, ${role}, ${content})
    `;
  } catch (e) {
    console.error("DB insert failed:", e);
  }
}


export async function getHistory(
  sessionId: string,
  limit = 10
) {
  const sql = getDB();

  const rows = await sql`
    SELECT role, content FROM (
      SELECT role, content, created_at 
      FROM conversations
      WHERE session_id = ${sessionId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    ) sub
    ORDER BY created_at ASC
  `;

  return rows.map((r) => ({
    role: r.role as Role,
    content: r.content,
  }));
}


export async function getSessions(userId: string) {
  const sql = getDB();

  const rows = await sql`
    SELECT session_id, MAX(created_at) as last_active
    FROM conversations
    WHERE user_id = ${userId}
    GROUP BY session_id
    ORDER BY last_active DESC
  `;

  return rows;
}