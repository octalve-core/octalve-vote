/**
 * Synthetic CI fixture only. Runs before the browser recording.
 * Refuses any database except the disposable local CI PostgreSQL container.
 * Never run against the user's govotin database or deployment database.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL ?? "";
const parsed = (() => { try { return new URL(connectionString); } catch { return null; } })();
if (
  process.env.CI !== "true" ||
  process.env.CI_ELECTORAL_INTEGRATION !== "true" ||
  parsed?.hostname !== "127.0.0.1" ||
  parsed?.pathname !== "/vote_integration_ci" ||
  !process.env.CI_APPROVED_ELECTORAL_EMAIL ||
  !process.env.CI_APPROVED_ELECTORAL_PASSWORD
) {
  throw new Error("CI fixture guard refused this environment.");
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

try {
  await db.$transaction(async (tx) => {
    const approved = await tx.electoralBody.create({
      data: {
        name: "Octalve CI Approved Organization",
        contactPerson: "CI Synthetic Administrator",
        email: process.env.CI_APPROVED_ELECTORAL_EMAIL!,
        status: "APPROVED",
        paymentStatus: "PAID",
        subscriptionType: "ORGANIZATIONAL"
      }
    });
    await tx.staffAccount.create({
      data: {
        email: process.env.CI_APPROVED_ELECTORAL_EMAIL!,
        passwordHash: await hash(process.env.CI_APPROVED_ELECTORAL_PASSWORD!, 12),
        role: "ELECTORAL_ADMIN",
        electoralBodyId: approved.id
      }
    });
    const foreign = await tx.electoralBody.create({
      data: {
        name: "Octalve CI Foreign Organization",
        contactPerson: "CI Other Officer",
        email: "octalve-ci-other-org@example.test",
        status: "APPROVED",
        paymentStatus: "PAID",
        subscriptionType: "ORGANIZATIONAL"
      }
    });
    await tx.election.create({
      data: {
        electoralBodyId: foreign.id,
        title: "Other Organization Confidential Test Draft",
        status: "DRAFT"
      }
    });
  });
  process.stdout.write("Synthetic CI-only organization fixture created.\n");
} finally {
  await db.$disconnect();
}
