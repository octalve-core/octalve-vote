# Batch 5 — Approval and draft election configuration

## Source and architecture
This batch builds on Batch 4. It preserves GoVotin's green/emerald electoral portal layout, draft election configuration with positions and candidates, and distinct platform admin workflows. New files are strict TypeScript/TSX with Next.js App Router and Tailwind CSS sections.

## Admin security
- Admin login is disabled unless `ENABLE_ADMIN_MFA=true`, `ENABLE_STAFF_LOGIN=true`, `DATABASE_URL` exists, and `MFA_ENCRYPTION_KEY` is a valid 32-byte hex key.
- Platform accounts cannot be public-registered. Admin account provision is **CI-only** in the acceptance fixture; a production secure provisioning/recovery process remains a release blocker.
- Admin TOTP verifies RFC 6238 HMAC-SHA1 30-second codes with an encrypted-at-rest base32 secret, unique counter CAS replay prevention, and existing staff throttling. Cookie sessions are marked MFA-verified on the server.
- Organization approval requires a server-authenticated MFA-verified admin, explicit flag `ENABLE_ORGANIZATION_APPROVALS=true`, a **PENDING** organization with non-null `emailVerifiedAt`, and recorded reason. Payment status remains untouched.
- In the real product email verification is not yet implemented. A fresh public signup remains **unverified** and cannot pass approval. This is intentional fail-closed behavior; CI fixture creates a synthetic verified applicant only.

## Draft configuration
- Draft-only Position and Candidate forms; server actions independently check enabled flag, same-tenant election ownership, approved+paid body, staff status, and election DRAFT status within serializable PostgreSQL transactions.
- Candidate position must belong to the same election. Max 25 positions and 50 candidates per position are operational bounds, not subscription entitlements. Positions enforce single-choice `maxVotes=1`.
- No election opening, candidate photo uploads, voter registration, OTP, ballot casting, payment verification or publication implemented.

## Tests
PostgreSQL 18 temporary GitHub Actions service, reviewed additive migration, seeded CI-only approved/admin identities and verified applicant before recording. One continuous Chromium browser walkthrough starts at the homepage and uses only UI navigation, typing and form submission to exercise electoral signup, draft creation, configuration, MFA admin sign-in and verified-applicant approval. No direct API calls or DB edits during recorded browser journey.

## Remaining
Production email delivery and verification, staff MFA self-enrollment/recovery, independent staff onboarding, payment reconciliation, negative cross-tenant IDOR tests with foreign resources, full election lifecycle, secret ballots and certified results. Do not approve a production launch based only on CI.
