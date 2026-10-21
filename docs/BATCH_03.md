# Octalve Vote — Batch 3: Electoral authentication and dashboard verification

Batch 3 is an extension of Batch 2, not a repeat of its UI migration. It adds a disposable PostgreSQL-backed integration test covering the **real** server-action registration/session/authentication flow, and completes the dashboard's tenant-scoped read-only presentation.

## Non-negotiable platform standard

- TypeScript/TSX only; Next.js App Router; Tailwind CSS 4.
- Public and electoral layouts split into reusable, feature-owned sections.
- Never copy the original Base44 plaintext passwords, OTP queries or client-side voting writes.
- Keep voting disabled. Platform-administrator authentication remains disabled pending MFA.
- Do not run schema changes against the original local `govotin` database. CI uses a temporary PostgreSQL database.

## Browser-only acceptance design

A single Playwright test starts at the homepage, clicks Electoral Body, fills the registration form using synthetic credentials, reaches a pending dashboard, navigates Elections/Voters/Support, logs out, creates a second synthetic electoral organization through the same UI, checks the other organization's name is absent, logs out, signs back into the first account and returns home. No direct deep URLs, direct fetch/API requests, database queries, database edits or console injections occur **during** the recorded journey.

Only the CI setup (before the browser test) applies the reviewed initial migration to an isolated, ephemeral database. The browser video should never be presented as proof of fully tested tenant isolation against cross-organization election IDs, which requires test fixtures and a targeted negative test.

## Explicitly outstanding

- Production organization email verification, staff MFA and account recovery.
- Authorization negative tests with real election data for two organizations.
- Admin provisioning and approval workflow.
- Election mutations and lifecycle controls.
- Voter invitation/OTP and transactionally secure ballot casting, secret ballot redesign, certified results.
- Production Vercel preview and completed all-role end-to-end recording.

## Gate

Do not merge into production or enable real users unless the independent security review, PostgreSQL-backed tests, cross-tenant access tests and full-browser acceptance evidence pass.
