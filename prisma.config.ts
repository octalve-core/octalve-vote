import "dotenv/config";
import { defineConfig } from "prisma/config";

// Type-generation fallback only: a deliberately non-functional URL.
// Database operations REQUIRE an explicit DATABASE_URL in your environment.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://invalid:invalid@127.0.0.1:1/_codegen_only"
  }
});
