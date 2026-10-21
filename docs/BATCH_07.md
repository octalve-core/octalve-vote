# Batch 7 — Unified authentication and controlled Vercel release

The single route `/auth` now handles all three visible user entrances: Voter, Electoral Body and Platform Administrator. Roles are selected through navigable cards; electoral organizations may switch between sign-in and registration. Admin login retains server-enforced TOTP MFA; voter access is strictly a disabled preview. Old login URLs are compatibility redirects only, not separate auth implementations.

All forms remain Next.js server actions. Organization approval, payment confirmation, voter OTP, and ballot casting are **not** enabled by this UI consolidation.

## Deployment gates
1. Preserve the original `main` history and verify all stacked Batch 1–6 changes and Batch 7 CI checks.
2. Deploy only with **staff signup/login, organization approvals, payment intake, draft setup, voter register and ballot flows OFF** until production-grade database migration, identity and settlement verification are complete.
3. If Vercel GitHub repository connection cannot be authorized, do not invent a deployment URL. Correct Vercel/GitHub team permissions first.
4. A public informational website is not certification for electronic elections. Keep `robots` noindex and disable claims that voting is live.
5. Test desktop public navigation, mobile hamburger menu, unified role selection, legacy URL redirects, and isolated PostgreSQL-backed organization workflows. All deep routes in the continuous recording must be reached through visible browser interactions.

## Release blockers
No production-safe voter credential issuance/OTP, secret ballot separation, immutable certified counts, external payment verification, verified admin provisioning/recovery, audited organization approval policy or complete privacy/regulatory review. No live election rollout is allowed.
