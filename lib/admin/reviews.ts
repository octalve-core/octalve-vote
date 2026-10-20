import "server-only";

import { getDb } from "@/lib/db/client";

export async function getPendingOrganizationReviews() {
  return getDb().electoralBody.findMany({
    where: { status: "PENDING" },
    select: {
      id: true, name: true, contactPerson: true, email: true,
      emailVerifiedAt: true, paymentStatus: true, subscriptionType: true, createdAt: true,
    },
    take: 100,
    orderBy: { createdAt: "asc" },
  });
}
