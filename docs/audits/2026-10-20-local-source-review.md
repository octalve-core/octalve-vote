# Octalve Vote — Evidence-based local source audit

**Date:** 2026-10-20  
**Evidence:** User-provided `octalve-vote-local-source.zip`, 38 ZIP entries (including directory entries).  
**Audit status:** Partial. The original GoVotin/Base44 application was not in this archive. This document is NOT a certification or a production approval.

## Verified strengths

- Next.js 16.1.6, React 19.2.3, TypeScript, Tailwind CSS 4 configured by `package.json`.
- `app/` App Router scaffold is present, and `components/ui/` contains 14 reusable shadcn UI files.
- Prisma ORM 7.3.0 with `prisma.config.ts` using environment-based `DATABASE_URL` and PostgreSQL datasource.
- An initial data model in `prisma/schema.prisma` with ElectoralBody, Election, Position, Candidate, Voter, Ballot, Vote, SupportTicket and PlatformSettings.
- Some useful constraints, e.g. `@@unique([electionId, voterId])` on Ballot and `@@unique([ballotId,positionId])` on Vote, though their semantics need review.
- No `.env` file was included in the uploaded archive.

## Verified gaps

### Application / flows
- `app/page.tsx` is the default Next starter, not the GoVotin product interface.
- `app/layout.tsx` metadata is `Create Next App`.
- No voter/electoral/admin pages, election workflow screens, OTP endpoint, ballot submission handler, result API or session/auth implementation were present.
- `src/` contains empty directory entries; no original `Pages/*.jsx`, `Entities/*.json`, or Base44 compatibility code appeared.
- `README.md` is the default Next readme and has no deploy/runbook or security gates.
- `prisma/migrations` was absent, so versioned migration history is missing from the archive.

### Config mismatch
- `components.json` points to `src/app/globals.css` even though actual file is `app/globals.css`.
- `components.json` lists `tailwind.config.ts`, which was not included; Tailwind 4 uses CSS-first config by default.
- `tsconfig.json` maps `@/*` to `./*` (matching root `components`, not `src/components`). Do not change the alias without also choosing and enforcing a single consistent structure.

### Database integrity / voting security
- `Ballot.voterId -> Voter.id` and `Vote.ballotId -> Ballot.id` form a direct path from voter identity to selections. For a secret-ballot election this is unacceptable without redesign; election privacy policy must be agreed first.
- `Position.maxVotes` defaults to 1 but may exceed 1; `@@unique([ballotId, positionId])` on Vote prevents multiple choices for a single position, contradicting a multi-select interpretation.
- `Candidate.electionId` and `Candidate.positionId` reference their respective records, but the schema does not guarantee the position belongs to the same election. Similar same-election consistency must be checked for submitted votes.
- `Voter.electionId` is a scalar `String?` with an index, not a declared relation/foreign key to Election. Eligibility model for voters across multiple elections is unresolved.
- Several core relations have `onDelete: Cascade`. Destructive deletion of election/voter/ballot data can erase voting evidence; lifecycle, retention and audit rules must be specified.
- `UserRole` and `VoteMethod` enums are declared but not used by a role-authority implementation in this archive. There is no distinct platform administrator account model.
- OTP hash/expiry and login attempt fields are **data fields only**, not proof of secure OTP verification, rate limiting, session integrity, or delivery.
- There is no demonstrated transactionally enforced one-voter-one-ballot submission, result certification, audit log, immutable snapshot, voter consent/privacy controls or tenant isolation.

## Scope boundaries

This inspection is of the **uploaded archive only**, not the January Base44 source or a working hosted app. No build, tests, database mutations, API calls, authenticated user journeys, real-vote trials, or continuous browser recording are claimed as completed.

## Recommendations, in order

1. Recover and import the original Base44 UI source **without replacing it with newly invented screens**. Compare routes/components/entity names before migration.
2. Agree written election requirements: public vs private results; single- vs multi-choice; candidate approval; nomination; invitations; abstention/spoilt ballot; result challenge/appeal; organization tenancy; election window/timezone; accessible voting.
3. Redesign ballot privacy and voter eligibility before implementing write endpoints. Enforce uniqueness and election/position/candidate consistency in server-side transactions and suitable DB constraints. Never rely on client guards.
4. Add server-enforced admin/electoral/voter RBAC, tenant checks, MFA for staff, securely handled OTP, rate limits, secure sessions and audit trails.
5. Make election lifecycle explicit: draft -> reviewed -> scheduled -> open -> closed -> certified -> published; time guards enforced on server.
6. Add versioned migrations, ephemeral test environment with synthetic data, and reproducible `pnpm` lockfile build pipeline.
7. Build tests around duplicate submits, concurrency, unauthorized actions, repeat OTP, expired elections, tenant crossing, privacy and result reconciliation.
8. Use preview-only release until independent end-to-end browser evidence plus security and functional acceptance gates pass.

## Release determination

**Not publishable for a live election yet.** The uploaded project is a starter scaffold and an initial schema; the actual GoVotin interface/backend are absent. Preview changes should be on a review branch. Production elections must not be enabled by default.
