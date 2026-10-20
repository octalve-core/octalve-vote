# Octalve Vote — Original GoVotin code audit (20 October 2026)

**Evidence**: `govotin.zip` supplied by the product owner, compared with `octalve-vote-local-source.zip` supplied the same day.

**Scope**: Static source review only. No authenticated real-user session, working production backend, build, Vercel deployment, load test or browser recording has been executed. These findings do not establish whether Base44 independently enforced access control behind the client SDK.

## Inventory
Original archive: 64 ZIP entries / **55 files** / **13,463 lines**, comprised of 21 `Pages/*.jsx` files, 23 `Components/**/*.jsx` files (including one zero-byte file), 10 `Entities/*.json` files and `Layout.js`. No `package.json`, Next.js scaffold, local auth module, Base44 SDK implementation or server-side vote transaction handler in the archive.

Next.js archive: 38 ZIP entries, Next.js **16.1.6**, React **19.2.3**, Prisma ORM **7.3.0**, PostgreSQL configuration, shadcn components and default starter page; it does not contain the original application.

## Confirmed strengths

1. Strong scope coverage: public Home, About, Pricing and Contact; VoterLogin and VotingBooth; electoral signup/payment/dashboard/elections/setup/voters/analytics/support; PlatformLogin/dashboard/bodies/payments/settings/tickets; PublicResults.
2. Candidate cards, position-by-position ballot progress and confirmation UX, CSV invitation management and credentials sending exist as dedicated components.
3. Election branding, embed code, results export/share, statistics and charts have UI patterns that can be preserved in the new framework.
4. Role-specific navigation/visual hierarchy and Tailwind/framer-motion patterns offer a usable visual basis. Responsive behavior requires browser testing rather than being presumed.
5. Base44 entity definitions cover Election, ElectoralBody, Voter, Position, Candidate, Ballot, Vote, Payment, SupportTicket and PlatformSettings.
6. Electoral dashboard fetches voting-related data on a 10-second interval (`Pages/ElectoralDashboard.jsx:77-129`). This is **polling**, not a proven real-time push channel.

## Critical verified defects / design exposures

| ID | Severity | Exact source | Evidence | Required remediation |
|---|---|---|---|---|
| S01 | Critical | `Pages/ElectoralLogin.jsx:129-165,220-237` | Finds an ElectoralBody via client query, compares `password_hash` directly to password, and writes raw `regPassword` into `password_hash`; session is client-controlled `sessionStorage`. | Server-side Argon2id/bcrypt hash+verify, authenticated session cookie, account lockout and role/tenant DAL. Never expose password hashes in responses. |
| S02 | Critical | `Pages/VoterLogin.jsx:87-99,119-170` | Queries Voter records by raw `otp`, checks expiration on browser and sets `otp_used` plus `voted_at` **at login**. | Server-side cryptographically secure challenge issue/verify, hashed short-lived token, attempt limits, distinct `verifiedAt` and `votedAt` milestones. |
| S03 | Critical | `Pages/VotingBooth.jsx:98-131,151-193` | Individual Vote entities are created before final ballot submission, and subsequent Ballot status update is separate. | Atomic, idempotent, transactionally validated cast endpoint with concurrency/duplicate protection; never tally provisional choices as final. |
| S04 | Critical | `Entities/Vote.json` and `Pages/VotingBooth.jsx:158-164` | Every Vote includes voter_id as well as ballot_id, election_id and candidate_id; Ballot also contains voter_id. | Agree secret/non-secret election policy. For secret voting design ballot selections without direct identity relation and independently validate threat model, logs and access paths. |
| S05 | High | `Pages/ElectoralElections.jsx:187-225` | Generates embed token with `Math.random`; permits client-controlled status transition and separate election-counter update. | Server cryptographic token, server-side schedule/lifecycle approvals, transactional counters or computed counts. |
| S06 | High | `Components/electoral/VoterUploadModal.jsx:28-34,46-69,84-133` | Generates voter access codes using `Math.random` and parses CSV with `split(',')`. | Server issue secure one-time codes; standards-compliant CSV parser, bounded size, validation, duplicate/idempotence handling, safe error report. |
| S07 | High | `Pages/PublicResults.jsx:34-103` | Raw voter, ballot and vote queries execute in component before client-side `isAuthorized` check; permission enforcement by Base44 itself is not visible. | Move public results to server-sanitized aggregate endpoint; authorize token and publication state on server before reading; never send voter/ballot rows publicly. |
| S08 | High | `Pages/ElectoralDashboard.jsx:41-129`, `Pages/PlatformPayments.jsx:47-75` | Electoral login gate uses sessionStorage; platform pages query data in client hooks while redirect checks run in useEffect. | Server-side authorization on every data request/mutation, tenancy scoped by authenticated principal; minimize DTOs. |
| S09 | High | `Pages/VoterLogin.jsx:142-150` | Checks election.status === 'live' but not start_date/end_date on a trusted server clock. | Enforce time windows and state transition on server with UTC stored instants and election timezone display. |
| S10 | High | `Pages/ElectoralSetup.jsx:137-163,186-236` | Candidate and position writes are separate client SDK calls; no transaction/immutable-post-open guard visible. | Server authorization and strict referential election/position checks; prohibit edits after approved opening. |
| S11 | High | `Pages/PlatformPayments.jsx:68-99`, `Pages/ElectoralPayment.jsx:124-149` | Approval changes organization/payment status and then sends email; there is no separately verifiable payment ledger in workflow; email failure can occur after status mutation. | Gateway verification/webhooks or two-person evidence-based bank reconciliation; immutable payment state machine + notification outbox. |
| S12 | High | `Entities/Voter.json`, `Pages/ElectoralVoters.jsx:184-215`, `Components/electoral/SendCredentialsModal.jsx:55` | Raw OTPs are displayed, copied, exported and sent by email, creating long-lived replay/PII exposure. | Short-lived invite issuance; one-time delivery, redaction, rotate/resend flow and no reusable OTP exports. |
| S13 | Medium | `Components/electoral/CustomVoterUploadModal.jsx` | File is zero bytes. | Remove dead entry or implement fully once invocation/use is verified. |
| S14 | High | `Pages/Pricing.jsx:140-155` | Marketing text claims complete audit trails and encryption; audit implementation cannot be found in supplied source. | Remove/unpublish unverifiable security promises until implemented and tested. |

## Cross-archive model mismatch

- Original status enum: `draft/live/closed`; Prisma: `DRAFT/ACTIVE/CLOSED`. Requires deliberate mapping.
- Original ElectoralBody: `organization_name`, `contact_person`, `payment_status`, approval and plan limits; Prisma only `name`, `email`, `passwordHash`, `isApproved`, etc.
- Original Voter: `username`, `custom_voter_id`, `otp`, `otp_used`, `voted_at`, `email_sent`; Prisma: `voterCode`, `otpHash`, login attempts but not complete eligibility/verification lifecycle.
- Original Candidate: `tagline`, `candidate_number`; Prisma: `manifesto`, `photoUrl`. Preserve or explicitly migrate both.
- Original Payment entity exists in Base44 but is missing from Next Prisma schema.
- Original per-position format appears single-choice; Prisma `maxVotes` allows >1 while `@@unique([ballotId, positionId])` permits only one Vote per ballot+position. Resolve before migration.
- Prisma ballot and votes link directly to voter; secret ballot needs redesigned separation.
- Prisma `Voter.electionId` is scalar without election relation; approved eligibility between voter and election needs a defined model.
- Several relational cascading deletes can erase election evidence; enforce retention and controlled voiding.
- Original date, storage and UI naming conventions differ from scaffold. Do not automatically run `db push` against user production data.

## Dependency/migration inventory

Original React imports require `react-router-dom`, `@tanstack/react-query`, `framer-motion`, `lucide-react`, `date-fns`, `recharts`, `sonner`, `jspdf` and `html2canvas`. Under Next.js, replace React Router/navigation with App Router (`next/link` + `next/navigation`), and replace `@/api/base44Client` with authenticated, server-authorized services. Add client boundaries only where state/hooks/browser APIs exist.

No Base44 SDK or local `@/api/base44Client` was provided. Reimplementing an unrestricted generic CRUD compatibility API would propagate security risks. Prefer typed feature endpoints (auth, election lifecycle, voter enrollment, issue/verify OTP, cast ballot, result aggregate, payment status, support) with audited policy checks.

## Required acceptance gates

- Authn: password never stored plain, staff MFA, session cookie, CSRF/cookie options, role/tenant checks on reads AND writes.
- Enrollment: bulk CSV validity, duplicates, correct election, max user caps, safe credential delivery and bounded file validation.
- Voting: expired/non-live election, invalid voter, replayed token, double-submission across tabs and concurrent clients, wrong-position/wrong-election candidate, atomicity under failure, election closure mid-submit, tally reconciliation.
- Privacy: auditor/admin cannot correlate individual selections to voter under the agreed secret-ballot policy.
- Results: no public raw vote/ballot/PII data, controlled publication/certification, auditable export snapshot.
- Payments: never approve on client-written payment claim; independently verified evidence and recorded approver.
- Operations: migrations in Git, tests+CI, staging/production separation, rate limits, monitoring, backups/restores, security review, incident procedure.
- Browser-only continuous walkthrough: one unbroken recording, homepage-first, click/type/file-picker/navigation; no direct deep URLs, database actions, API calls or console/injection.

## Timeline position

A **preview of UI and a sandbox election** may be pursued this week once source is migrated. A real, confidential, binding organization election must stay blocked until all critical acceptance gates pass. No branch merge, deployment or passing browser video is asserted by this audit.
