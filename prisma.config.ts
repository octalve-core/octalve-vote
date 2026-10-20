import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma generates types without connecting. This invalid placeholder is NEVER used by
// the app: lib/db/client.ts refuses to connect without an explicit DATABASE_URL.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://invalid:invalid@127.0.0.1:1/_codegen_only",
  },
});
