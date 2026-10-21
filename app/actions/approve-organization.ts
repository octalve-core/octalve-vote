"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { areApprovalsEnabled } from "@/lib/auth/config";
import { readStaffSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

const input = z.object({
  electoralBodyId: z.string().cuid(),
  reason: z.string().trim().min(10).max(500),
});

export type ReviewResult = { error: string; success: string };

/**
 * Server-owned status mutation. This never updates paymentStatus.
 * No public signup or electoral staff account can perform this action.
 */
export async function approveOrganizationAction(
  _previous: ReviewResult, form: FormData
): Promise<ReviewResult> {
  if (!areApprovalsEnabled()) return { error: "Review actions are disabled.", success: "" };
  const account = await readStaffSession();
  if (!account || account.role !== "PLATFORM_ADMIN") {
    return { error: "Not authorized.", success: "" };
  }
  const parsed = input.safeParse({
    electoralBodyId: form.get("electoralBodyId"),
    reason: form.get("reason"),
  });
  if (!parsed.success) return { error: "A reason of 10–500 characters is required.", success: "" };

  try {
    await getDb().$transaction(async tx => {
      const updated = await tx.electoralBody.updateMany({
        where: {
          id: parsed.data.electoralBodyId,
          status: "PENDING",
          emailVerifiedAt: { not: null },
        },
        data: { status: "APPROVED" },
      });
      if (updated.count !== 1) throw new Error("ineligible-or-reviewed");
      await tx.organizationReview.create({
        data: {
          electoralBodyId: parsed.data.electoralBodyId,
          reviewerId: account.id,
          decision: "APPROVED",
          reason: parsed.data.reason,
        },
      });
      await tx.authAuditEvent.create({ data: { accountId: account.id, action: "ORGANIZATION_APPROVED" } });
    });
  } catch {
    return { error: "Approval refused. Confirm pending status and verified email.", success: "" };
  }
  revalidatePath("/admin");
  return { error: "", success: "Organization approved. Payment remains independently unverified." };
}
