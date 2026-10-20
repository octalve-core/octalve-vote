import "server-only";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { octalveVotePrisma?: PrismaClient };

export function getDb(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured. Database-backed features are unavailable.");
  }

  if (!globalForPrisma.octalveVotePrisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    globalForPrisma.octalveVotePrisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.octalveVotePrisma;
}
