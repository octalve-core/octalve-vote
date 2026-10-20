"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { readStaffSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { draftCapacity } from "@/lib/electoral/draft-policy";

const draftSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(2000)
});

/** Independent authorisation: Server Actions are callable beyond visible UI. */
export async function createElectionDraftAction(
  _previous: { error: string },
  form: FormData
): Promise<{ error: string }> {
  const account = await readStaffSession();
  if (account?.role !== "ELECTORAL_ADMIN" || !account.electoralBodyId) {
    return { error: "You are not authorized to create an election." };
  }
  const limit = draftCapacity();
  if (limit === null) {
    return { error: "Draft creation is not enabled in this environment." };
  }

  const parsed = draftSchema.safeParse({
    title: form.get("title"),
    description: form.get("description") ?? ""
  });
  if (!parsed.success) {
    return { error: "Enter a title of 3–120 characters and a description of at most 2,000 characters." };
  }

  try {
    await getDb().$transaction(async (tx) => {
      // Re-evaluate privileges inside the same transaction as creation:
      // a browser gate or previous session snapshot cannot authorize writes.
      const staff = await tx.staffAccount.findUnique({
        where: { id: account.id },
        select: { role: true, electoralBodyId: true, isDisabled: true }
      });
      if (!staff || staff.role !== "ELECTORAL_ADMIN" || staff.isDisabled ||
          staff.electoralBodyId !== account.electoralBodyId) {
        throw new Error("staff-not-permitted");
      }
      const body = await tx.electoralBody.findUnique({
        where: { id: account.electoralBodyId! },
        select: { status: true, paymentStatus: true }
      });
      if (body?.status !== "APPROVED" || body.paymentStatus !== "PAID") {
        throw new Error("draft-not-permitted");
      }
      const count = await tx.election.count({
        where: { electoralBodyId: account.electoralBodyId! }
      });
      if (count >= limit) throw new Error("draft-capacity-reached");
      await tx.election.create({
        data: {
          electoralBodyId: account.electoralBodyId!,
          title: parsed.data.title,
          description: parsed.data.description || null,
          status: "DRAFT"
        },
        select: { id: true }
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch {
    // Do not expose internal IDs, existence of other tenants or SQL errors.
    return { error: "Draft creation is unavailable. Check your organization approval or capacity and try again." };
  }

  revalidatePath("/electoral/elections");
  revalidatePath("/electoral/dashboard");
  redirect("/electoral/elections");
}
