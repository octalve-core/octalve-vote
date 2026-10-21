import "server-only";

import { getDb } from "@/lib/db/client";

// This module is the tenant-owned data boundary. Never send raw voter, OTP,
// Ballot.voterId or Vote rows to dashboard client components.
export async function getElectoralOverview(bodyId: string, requestedElection?: string) {
  const db = getDb();
  const [elections, totalElections, activeElections] = await Promise.all([
    db.election.findMany({
      where: { electoralBodyId: bodyId },
      select: { id: true, title: true, status: true, startAt: true, endAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 100
    }),
    db.election.count({ where: { electoralBodyId: bodyId } }),
    db.election.count({ where: { electoralBodyId: bodyId, status: "ACTIVE" } })
  ]);

  const selected = elections.find(e => e.id === requestedElection) ?? elections[0] ?? null;
  const [voterCount, submittedBallots, inProgressBallots] = selected
    ? await Promise.all([
        db.voter.count({ where: { electoralBodyId: bodyId, electionId: selected.id } }),
        db.ballot.count({ where: { electionId: selected.id, election: { electoralBodyId: bodyId }, submittedAt: { not: null } } }),
        db.ballot.count({ where: { electionId: selected.id, election: { electoralBodyId: bodyId }, submittedAt: null } })
      ])
    : [0, 0, 0];

  return {
    elections,
    selected,
    totalElections,
    activeElections,
    voterCount,
    submittedBallots,
    inProgressBallots
  };
}
