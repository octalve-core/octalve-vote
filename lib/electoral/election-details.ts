import "server-only";

import { getDb } from "@/lib/db/client";

/** Tenant scope is mandatory, even if a user manually changes the URL ID. */
export async function findOwnedElection(electoralBodyId: string, electionId: string) {
  if (!electoralBodyId || !electionId) return null;
  return getDb().election.findFirst({
    where: { id: electionId, electoralBodyId },
    select: {
      id: true, title: true, description: true, status: true,
      startAt: true, endAt: true, createdAt: true
    }
  });
}
