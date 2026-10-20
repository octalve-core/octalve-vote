"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { readStaffSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

export type SetupResult = { error: string; success: string };

const positionSchema = z.object({
  electionId: z.string().cuid(),
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000)
});
const candidateSchema = z.object({
  electionId: z.string().cuid(),
  positionId: z.string().cuid(),
  name: z.string().trim().min(2).max(120),
  manifesto: z.string().trim().max(2000)
});

async function requireDraftWriteContext() {
  if (process.env.ENABLE_ELECTION_CONFIGURATION !== "true")
    throw new Error("configuration-disabled");
  const staff = await readStaffSession();
  if (!staff || staff.role !== "ELECTORAL_ADMIN" || !staff.electoralBodyId)
    throw new Error("not-authorized");
  return { id: staff.id, bodyId: staff.electoralBodyId };
}

export async function createPositionAction(_previous: SetupResult, form: FormData): Promise<SetupResult> {
  const parsed = positionSchema.safeParse({
    electionId: form.get("electionId"), title: form.get("title"),
    description: form.get("description") ?? ""
  });
  if (!parsed.success) return { error: "Check position title and description lengths.", success: "" };
  try {
    const staff = await requireDraftWriteContext();
    await getDb().$transaction(async tx => {
      const [account, election] = await Promise.all([
        tx.staffAccount.findUnique({ where: { id: staff.id },
          select: { role: true, isDisabled: true, electoralBodyId: true } }),
        tx.election.findFirst({ where: {
          id: parsed.data.electionId, electoralBodyId: staff.bodyId, status: "DRAFT"
        }, select: { id: true,
          electoralBody: { select: { status: true, paymentStatus: true } }
        } })
      ]);
      if (!account || account.isDisabled || account.role !== "ELECTORAL_ADMIN" ||
          account.electoralBodyId !== staff.bodyId || !election ||
          election.electoralBody.status !== "APPROVED" || election.electoralBody.paymentStatus !== "PAID")
        throw new Error("denied");
      const count = await tx.position.count({ where: { electionId: election.id } });
      if (count >= 25) throw new Error("safety-cap");
      // Single-choice only: prevents disagreement with the existing ballot model.
      await tx.position.create({ data: {
        electionId: election.id, title: parsed.data.title,
        description: parsed.data.description || null, maxVotes: 1
      } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch {
    return { error: "Cannot add position. Check approval, draft status and the 25-position safety limit.", success: "" };
  }
  revalidatePath("/electoral/elections/" + parsed.data.electionId);
  return { error: "", success: "Position added to draft." };
}

export async function createCandidateAction(_previous: SetupResult, form: FormData): Promise<SetupResult> {
  const parsed = candidateSchema.safeParse({
    electionId: form.get("electionId"), positionId: form.get("positionId"),
    name: form.get("name"), manifesto: form.get("manifesto") ?? ""
  });
  if (!parsed.success) return { error: "Check position, name and manifesto lengths.", success: "" };
  try {
    const staff = await requireDraftWriteContext();
    await getDb().$transaction(async tx => {
      const [account, position] = await Promise.all([
        tx.staffAccount.findUnique({ where: { id: staff.id },
          select: { role: true, isDisabled: true, electoralBodyId: true } }),
        tx.position.findFirst({ where: {
          id: parsed.data.positionId, electionId: parsed.data.electionId,
          election: { electoralBodyId: staff.bodyId, status: "DRAFT" }
        }, select: { id: true, election: { select: {
          electoralBody: { select: { status: true, paymentStatus: true } }
        } } } })
      ]);
      if (!account || account.isDisabled || account.role !== "ELECTORAL_ADMIN" ||
          account.electoralBodyId !== staff.bodyId || !position ||
          position.election.electoralBody.status !== "APPROVED" ||
          position.election.electoralBody.paymentStatus !== "PAID") throw new Error("denied");
      const count = await tx.candidate.count({ where: { positionId: position.id } });
      if (count >= 50) throw new Error("safety-cap");
      await tx.candidate.create({ data: {
        electionId: parsed.data.electionId, positionId: position.id,
        name: parsed.data.name, manifesto: parsed.data.manifesto || null
      } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch {
    return { error: "Cannot add candidate. Check election ownership, draft status and candidate limit.", success: "" };
  }
  revalidatePath("/electoral/elections/" + parsed.data.electionId);
  return { error: "", success: "Candidate added to draft." };
}
