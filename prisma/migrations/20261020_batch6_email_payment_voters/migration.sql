-- Batch 6 additive migration. First apply ONLY to disposable CI PostgreSQL.
-- The original local govotin database requires a separate data-preserving migration review.
CREATE TYPE "PaymentClaimStatus" AS ENUM ('SUBMITTED', 'NEEDS_EVIDENCE', 'REJECTED');

CREATE TABLE "EmailVerificationChallenge" (
  "id" TEXT NOT NULL,
  "electoralBodyId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "consumedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailVerificationChallenge_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EmailVerificationChallenge_tokenHash_key" ON "EmailVerificationChallenge"("tokenHash");
CREATE INDEX "EmailVerificationChallenge_electoralBodyId_expiresAt_idx" ON "EmailVerificationChallenge"("electoralBodyId", "expiresAt");
ALTER TABLE "EmailVerificationChallenge" ADD CONSTRAINT "EmailVerificationChallenge_electoralBodyId_fkey"
  FOREIGN KEY ("electoralBodyId") REFERENCES "ElectoralBody"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "PaymentClaim" (
  "id" TEXT NOT NULL,
  "electoralBodyId" TEXT NOT NULL,
  "reference" TEXT NOT NULL,
  "amountKobo" BIGINT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'NGN',
  "note" TEXT,
  "status" "PaymentClaimStatus" NOT NULL DEFAULT 'SUBMITTED',
  "reviewReason" TEXT,
  "reviewerId" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaymentClaim_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PaymentClaim_reference_key" ON "PaymentClaim"("reference");
CREATE INDEX "PaymentClaim_electoralBodyId_createdAt_idx" ON "PaymentClaim"("electoralBodyId", "createdAt");
CREATE INDEX "PaymentClaim_status_createdAt_idx" ON "PaymentClaim"("status", "createdAt");
ALTER TABLE "PaymentClaim" ADD CONSTRAINT "PaymentClaim_electoralBodyId_fkey"
  FOREIGN KEY ("electoralBodyId") REFERENCES "ElectoralBody"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PaymentClaim" ADD CONSTRAINT "PaymentClaim_reviewerId_fkey"
  FOREIGN KEY ("reviewerId") REFERENCES "StaffAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Assumes pre-existing development data has no duplicate non-null email per election.
CREATE UNIQUE INDEX "Voter_electionId_email_key" ON "Voter"("electionId", "email");
