# Octalve Vote — Source-preserving Next.js migration map

**Principle:** Keep the original GoVotin JSX as a design reference. No invented replacement UI or speculative database migrations. Rename visible product branding to Octalve Vote only after importing source on a review branch.

## Role-based navigation mapping

| Original Page | Proposed Next.js path | Scope |
|---|---|---|
| Home | `/` | Public |
| About | `/about` | Public |
| Pricing | `/pricing` | Public |
| Contact | `/contact` | Public |
| VoterLogin | `/voter/login` | Voter |
| VotingBooth | `/voter/ballot` | Voter (server-auth) |
| PublicResults | `/results/[election]` | Public aggregate, only if published |
| ElectoralLogin | `/electoral/login` | Electoral body |
| ElectoralDashboard | `/electoral` | Electoral body |
| ElectoralElections | `/electoral/elections` | Electoral body |
| ElectoralSetup | `/electoral/elections/[election]/setup` | Electoral body |
| ElectoralVoters | `/electoral/voters` | Electoral body |
| ElectoralAnalytics | `/electoral/elections/[election]/analytics` | Electoral body |
| ElectoralPayment | `/electoral/payment` | Electoral body |
| ElectoralSupport | `/electoral/support` | Electoral body |
| PlatformLogin | `/admin/login` | Platform |
| PlatformDashboard | `/admin` | Platform |
| PlatformBodies | `/admin/organizations` | Platform |
| PlatformPayments | `/admin/payments` | Platform |
| PlatformSettings | `/admin/settings` | Platform |
| PlatformTickets | `/admin/support` | Platform |

**Legacy navigation constraint:** Preserve query parameter behavior (`id`, `token`, `election`) only after validating authorization and converting to typed Next navigation; tokens must not authorize raw data queries. Provide harmless redirects for old bookmarks as appropriate.

## Recommended release slices

- **A — Preserve & compile:** import existing public pages, shared components, shadcn, CSS, assets; rename visible brand, fix routes and mobile navigation; produce working preview without a voting backend. Keep voting disabled.
- **B — Platform authority:** protected admin/electoral accounts and organizations; authenticated sessions; RBAC/MFA; tenant-scoped read/write; migration history.
- **C — Election setup:** draft editing, positions, candidates, voters/CSV, invitations, approval/schedule; stop all editing when voting opens.
- **D — Ballot authority:** server OTP verification + eligibility claim; atomic, private, idempotent submission; separate voter confirmation from secret ballot; formal audits/tests.
- **E — Results/payments:** verifiable tallies, controlled certification/publication and exports, independent payment verification, support.
- **F — Browser acceptance:** one continuous UI-driven video from homepage across three roles with synthetic data and evidence matrix. Review deploy only; production approval requires all gates.

## Non-negotiable

Do not expose `base44.entities.Voter` or `base44.entities.Vote` as universal client-readable CRUD in a new API. Even if existing screens call that API, returning full raw entities can expose credentials, PII and ballot selections. Prefer limited DTOs and server-owned mutations.
