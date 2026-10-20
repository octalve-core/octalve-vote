import "server-only";
import { getDb } from "@/lib/db/client";

export async function getAvailableVoterElections(bodyId: string) {
  return getDb().election.findMany({
    where: { electoralBodyId: bodyId },
    select: { id: true, title: true, status: true, _count: { select: { voters: true } } },
    orderBy: { createdAt: "desc" }, take: 100
  });
}
export async function getOwnedVoterRegister(bodyId: string, electionId: string) {
  return getDb().election.findFirst({
    where: { electoralBodyId: bodyId, id: electionId },
    select: {
      id: true, title: true, status: true,
      voters: {
        select: { id: true, fullName: true, email: true, isActive: true, createdAt: true },
        orderBy: { createdAt: "desc" }, take: 200
      },
      _count: { select: { voters: true } }
    }
  });
}
