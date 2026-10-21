-- Additive Batch 5 approval + MFA fields. For disposable test DB first.
ALTER TABLE "ElectoralBody" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "StaffAccount" ADD COLUMN "mfaSecretEncrypted" TEXT;
ALTER TABLE "StaffAccount" ADD COLUMN "mfaLastCounter" BIGINT;
ALTER TABLE "StaffSession" ADD COLUMN "mfaVerifiedAt" TIMESTAMP(3);

CREATE TABLE "OrganizationReview" (
  "id" TEXT NOT NULL,
  "electoralBodyId" TEXT NOT NULL,
  "reviewerId" TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrganizationReview_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "OrganizationReview_electoralBodyId_createdAt_idx"
  ON "OrganizationReview"("electoralBodyId", "createdAt");
ALTER TABLE "OrganizationReview" ADD CONSTRAINT "OrganizationReview_electoralBodyId_fkey"
  FOREIGN KEY ("electoralBodyId") REFERENCES "ElectoralBody"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrganizationReview" ADD CONSTRAINT "OrganizationReview_reviewerId_fkey"
  FOREIGN KEY ("reviewerId") REFERENCES "StaffAccount"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
