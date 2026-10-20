import "server-only";

import { getDb } from "@/lib/db/client";

export async function getOwnedElectionConfiguration(bodyId: string, electionId: string) {
  return getDb().election.findFirst({
    where: { id: electionId, electoralBodyId: bodyId },
    select: {
      id: true, title: true, description: true, status: true,
      positions: {
        orderBy: { createdAt: "asc" },
        select: { id: true, title: true, description: true, maxVotes: true,
          candidates: { orderBy: { createdAt: "asc" }, select: { id: true, name: true, manifesto: true } }
        }
      }
    }
  });
}
