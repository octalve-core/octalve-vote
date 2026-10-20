import "server-only";

import { createHmac } from "node:crypto";
import { getDb } from "@/lib/db/client";

// DB-persisted per-identifier throttle, shared across serverless workers.
// Additional edge/IP abuse controls are required before a public launch.
export async function consumeAuthAttempt(scope: string, identifier: string, limit = 8): Promise<boolean> {
  const secret = process.env.AUTH_THROTTLE_SECRET;
  if (!secret || secret.length < 32) {
    return false; // fail closed, never silently disable throttling
  }
  const key = createHmac("sha256", secret).update(scope + ":" + identifier.trim().toLowerCase()).digest("hex");
  const db = getDb();
  const cutoff = new Date(Date.now() - 15 * 60 * 1000);
  const now = new Date();

  await db.authThrottle.updateMany({
    where: { key, windowStart: { lt: cutoff } },
    data: { attempts: 0, windowStart: now }
  });

  const entry = await db.authThrottle.upsert({
    where: { key },
    create: { key, windowStart: now, attempts: 1 },
    update: { attempts: { increment: 1 } }
  });

  return entry.attempts <= limit;
}
