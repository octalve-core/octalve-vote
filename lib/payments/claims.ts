import "server-only";
import { getDb } from "@/lib/db/client";

export async function getOrganizationPaymentClaims(bodyId: string) {
  return getDb().paymentClaim.findMany({
    where: { electoralBodyId: bodyId },
    select: { id: true, reference: true, amountKobo: true, currency: true, status: true, createdAt: true, reviewReason: true },
    orderBy: { createdAt: "desc" }, take: 50
  });
}

export async function getPendingPaymentClaims() {
  return getDb().paymentClaim.findMany({
    where: { status: "SUBMITTED" },
    select: {
      id: true, reference: true, amountKobo: true, createdAt: true, note: true,
      electoralBody: { select: { name: true, paymentStatus: true } }
    },
    orderBy: { createdAt: "asc" }, take: 50
  });
}
