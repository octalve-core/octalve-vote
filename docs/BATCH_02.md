# Batch 2 — Electoral staff authentication and dashboard migration

## Source fidelity
Migrated the original GoVotin ElectoralLogin sign-in/register tabs, green/emerald brand, Navbar, Dashboard, election selection, approval banner, quick statistics and results-card layout into strict TypeScript/TSX and Tailwind CSS. The legacy React Router, Base44 and sessionStorage security pattern are not used.

## Server-side authority
- Prisma 7.3 + PostgreSQL pg adapter, normalized StaffAccount model, roles ELECTORAL_ADMIN and PLATFORM_ADMIN.
- Passwords hashed using bcryptjs with cost 12, never returned to browser.
- 32-byte random opaque session token; SHA-256 token hash stored in database; HttpOnly, SameSite=lax cookies; expiry and revocation on logout.
- Every protected route checks role via server-rendered layout and its server-side data-access function.
- ElectoralDashboard reads only elections belonging to the signed-in electoral body and returns aggregate voter/ballot counts, not Voter/OTP or Vote records.
- Persistent HMAC-keyed per-account throttle (8 attempts/15 minutes); login account lockout (5 failures/15 minutes). Additional network/IP limit and account lockout abuse protection needed for public release.
- Public registration creates PENDING, UNPAID ElectoralBody + ELECTORAL_ADMIN staff account in one transaction; it cannot create platform-admin accounts or self-approve/payment-confirm.
- All authentication and registration disabled by default and fail closed if DATABASE_URL or throttle secret is missing; explicit feature toggles required to test.
- Sensitive election editing, bulk voter management, support writes, ballots and result charts remain inaccessible until feature-specific authorization and confidentiality model is approved.

## Known blockers — do NOT enable for production
1. Staff MFA is **not yet implemented**; account email verification, password reset and strong bot mitigation are pending. Production staff sign-in should remain disabled.
2. Prisma schema is a proposed fresh-developer-database schema, not an incremental migration of the old `govotin` database. It changes ElectoralBody fields, and the previous local DB may contain test data. **Do not use `db push` or migrate against the old database without a backup and a reviewed migration strategy.**
3. A versioned baseline migration has not yet been generated/approved. For a brand-new, empty and dedicated development DB only: configure DATABASE_URL, then run `npm run db:migrate -- --name baseline_batch2`; review SQL before applying to any persistent environment, and commit the reviewed migrations. Prisma 7 shadow DB privileges are required locally.
4. Existing `Ballot`/ `Vote` entities retain direct voter linkages from the starter schema and are **not** safe for confidential voting; no vote APIs or result query are enabled.
5. There is no verified provisioning and MFA workflow for platform administrators. Never invent a default admin password.
6. No external PostgreSQL credentials or Vercel project are configured in GitHub; CI only checks typecheck/lint/build/browser preview without a database.
7. Onboarding subscriptions are selected as categories only. Registration does not process money or grant approval.

## Reviewer local setup (Windows)
- Check out `phase/02-electoral-auth-dashboard`.
- `npm install`; `npm run typecheck`; `npm run lint`; `npm run build`; `npm run dev`.
- Without DATABASE_URL, the public pages and role-entry controls run safely with disabled credential submission.
- For database testing, use a **separate, empty** Postgres DB and an independent schema migration review; provide private env vars locally only.
- Set `AUTH_THROTTLE_SECRET` to a 32+ character random string; enable staff and signup toggles **only after** checking DB and scope, for preview testing.
- Use synthetic accounts; check pending banner, real organization scoping and unauthenticated redirect.

## Browser-only requirement
Run Playwright from homepage; use only UI clicks and forms. Existing continuous recording currently proves public pages and disabled role entry flow only. Authenticated election creation/OTP/voting/results cannot be claimed as recorded before those services are built.

## Next
Implement MFA and email verification, versioned migrations, tenant cross-access tests, UI sign-in and pending signup with synthetic data, controlled role provisioning and independent security review.
