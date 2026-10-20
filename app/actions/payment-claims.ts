"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db/client";
import { readStaffSession } from "@/lib/auth/session";
import { isAdminMfaEnabled } from "@/lib/auth/config";

export type ClaimActionState = { error: string; success: string };
const claim = z.object({
  reference: z.string().trim().toUpperCase().regex(/^[A-Z0-9][A-Z0-9-]{5,79}$/),
  amount: z.string().trim().regex(/^[1-9][0-9]{0,8}(\.[0-9]{1,2})?$/),
  note: z.string().trim().max(500),
});
function toKobo(raw: string): bigint {
  const [naira, decimals = ""] = raw.split(".");
  return BigInt(naira) * 100n + BigInt((decimals + "00").slice(0, 2));
}

/** Records an unconfirmed claim. Never settles or activates a subscription. */
export async function submitPaymentClaimAction(
  _previous: ClaimActionState, form: FormData
): Promise<ClaimActionState> {
  if (process.env.ENABLE_PAYMENT_REVIEW !== "true") return { error: "Payment claim intake is disabled.", success: "" };
  const staff = await readStaffSession();
  if (staff?.role !== "ELECTORAL_ADMIN" || !staff.electoralBodyId)
    return { error: "Not authorized.", success: "" };
  const parsed = claim.safeParse({
    reference: form.get("reference"), amount: form.get("amount"), note: form.get("note") ?? ""
  });
  if (!parsed.success) return { error: "Enter a valid reference, amount (NGN) and optional note.", success: "" };
  try {
    const db = getDb();
    const body = await db.electoralBody.findUnique({
      where: { id: staff.electoralBodyId },
      select: { id: true, emailVerifiedAt: true, status: true }
    });
    if (!body || body.status === "SUSPENDED" || !body.emailVerifiedAt)
      return { error: "Verify your organization email before submitting a payment claim.", success: "" };
    await db.paymentClaim.create({
      data: {
        electoralBodyId: body.id,
        reference: parsed.data.reference,
        amountKobo: toKobo(parsed.data.amount),
        note: parsed.data.note || null,
        status: "SUBMITTED"
      }
    });
  } catch {
    return { error: "Unable to save this reference. It may already have been submitted.", success: "" };
  }
  revalidatePath("/electoral/payment");
  revalidatePath("/admin/payments");
  return { error: "", success: "Claim recorded for review. Payment is NOT confirmed." };
}

export async function reviewPaymentClaimAction(
  _previous: ClaimActionState, form: FormData
): Promise<ClaimActionState> {
  if (process.env.ENABLE_PAYMENT_REVIEW !== "true" || !isAdminMfaEnabled())
    return { error: "Review is disabled.", success: "" };
  const staff = await readStaffSession();
  if (staff?.role !== "PLATFORM_ADMIN") return { error: "Not authorized.", success: "" };
  const input = z.object({
    claimId: z.string().cuid(),
    decision: z.enum(["NEEDS_EVIDENCE", "REJECTED"]),
    reason: z.string().trim().min(10).max(500)
  }).safeParse({
    claimId: form.get("claimId"), decision: form.get("decision"), reason: form.get("reason")
  });
  if (!input.success) return { error: "A valid review decision and reason are required.", success: "" };
  try {
    await getDb().$transaction(async tx => {
      const changed = await tx.paymentClaim.updateMany({
        where: { id: input.data.claimId, status: "SUBMITTED" },
        data: {
          status: input.data.decision,
          reviewReason: input.data.reason,
          reviewerId: staff.id,
          reviewedAt: new Date()
        }
      });
      if (changed.count !== 1) throw new Error("not-pending");
      await tx.authAuditEvent.create({ data: { accountId: staff.id, action: "PAYMENT_CLAIM_REVIEWED" } });
      // Never set ElectoralBody.paymentStatus to PAID here.
    });
  } catch {
    return { error: "Claim could not be reviewed or was already processed.", success: "" };
  }
  revalidatePath("/admin/payments");
  return { error: "", success: "Review recorded; no funds were certified or settled." };
}
