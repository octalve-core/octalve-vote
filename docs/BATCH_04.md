# Batch 4 — Original GoVotin election-list and draft workflow

**Date:** 20 October 2026  
**Branch:** `phase/04-electoral-authority-and-draft-workflows` (stacked on Batch 3). Draft GitHub review only.

## Evidence and source fidelity

Original GoVotin `Pages/ElectoralElections.jsx` includes title/description draft creation, election usage, edit/start/close actions, iframe embedding, CSV export and deletion. Its browser-side creation used `Math.random()` to generate embed tokens, wrote directly to Base44 entities and incremented a separate election counter. Those mutations are not suitable for our independent Next.js backend.

Batch 4 preserves the original **green/emerald** electoral design language and the **title/description** draft inputs, converted to a full-page TypeScript form. Existing Dashboard, Elections and Recent Elections UI now link to tenant-scoped routes.

## Implemented

- Next.js App Router pages for draft creation `/electoral/elections/new` and protected read-only election details `/electoral/elections/[electionId]`.
- `createElectionDraftAction` authenticates the staff user, derives the organization from its DB-backed server session, checks role and account state and **rechecks organization approval/payment within the same database transaction**.
- Uses PostgreSQL serializable isolation and a configured operational creation capacity, preventing silent race-driven quota overruns. A serialization conflict fails closed; automatic retry is deliberately not added without idempotency design.
- Creates **only** `DRAFT` records with a title and optional description. No embed code, token, publication, position, candidates, voter register, votes or lifecycle status mutations.
- View-only election detail queries always include both `electoralBodyId` and `electionId`. A missing or another organization's election returns the same not-found response.
- Dashboard total/active election counts use organization-scoped database aggregate counts rather than the most recent 100 rows displayed in the picker.
- Approved/paid ownership is required, **and** feature gate `ENABLE_DRAFT_ELECTIONS=true` with numeric `DRAFT_ELECTION_CAPACITY` from 1 to 1000. Defaults OFF. Capacity is an independent pilot safety configuration, not an asserted subscription benefit.
- No production election is enabled. Voter OTP, confidential ballots, admin MFA, approval, payment verification and certified results remain pending.

## Run / safety

1. Do not modify the existing local `govotin` database without a data-preserving migration review. Use an isolated test DB only.
2. Run GitHub's public preview CI and PostgreSQL electoral integration with synthetic users.
3. In these acceptance tests, pending/unpaid newly registered bodies **cannot** access a draft creation link. Positive approved-body creation and negative direct cross-tenant access require a controlled admin-approved test fixture and remain acceptance gates.
4. Even if `ENABLE_DRAFT_ELECTIONS` is enabled by accident, non-approved/unpaid bodies cannot create drafts because the write action repeats the authorization check inside its DB transaction.

## Release decision

**Review-only.** Must not merge to production or market as a complete voting system. Needed next: organization email verification and staff MFA, audited admin approvals, approved-body draft creation tests, fully authorized candidate/position editing, voter OTP redesign and privacy-safe atomic ballots.

## Additional isolated positive acceptance case

The CI electoral workflow creates a **synthetic approved/paid** staff organization and a foreign organization's draft *before* the recording, guarded to a local disposable `vote_integration_ci` PostgreSQL instance. During recording, Playwright signs in by clicking the portal, creates a draft with only UI controls, opens its details, and verifies the foreign organization's draft title is absent in its visible list. This setup is not a platform admin approval feature, payment confirmation or proof of exhaustive IDOR resistance.

The CI-only approved fixture password is synthetic and is unusable after the temporary container is destroyed. Never reuse the credentials in another environment. The browser's account actions make no direct database/API calls.
