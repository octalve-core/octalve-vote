import "server-only";

import type { BodyStatus, PaymentStatus } from "@prisma/client";

/**
 * Operational safeguard, not a published subscription limit.
 * Fail closed if the owner has not explicitly configured preview capacity.
 */
export function draftCapacity(): number | null {
  if (process.env.ENABLE_DRAFT_ELECTIONS !== "true") return null;
  const raw = process.env.DRAFT_ELECTION_CAPACITY;
  if (!raw || !/^[1-9][0-9]*$/.test(raw)) return null;
  const limit = Number(raw);
  return Number.isSafeInteger(limit) && limit >= 1 && limit <= 1000 ? limit : null;
}

export function canCreateDraft(status: BodyStatus, payment: PaymentStatus): boolean {
  return status === "APPROVED" && payment === "PAID" && draftCapacity() !== null;
}
