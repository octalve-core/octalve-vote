# Octalve Vote

**Status:** Review-only Batch 1 frontend preview. Real voting is disabled.

Octalve Vote continues the original GoVotin/Base44 application using strictly **TypeScript / TSX**, **Next.js App Router** and **Tailwind CSS 4** with reusable section-based components. The original source has been audited; only public pages and role-entry gates are migrated in this batch.

## Run locally

```powershell
git clone https://github.com/octalve-core/octalve-vote.git
cd octalve-vote
git switch review/octalve-vote-foundation-2026-10-20
npm install
npm run dev
```

Open http://localhost:3000. No secrets or PostgreSQL database are required for the public preview because live auth/voting is disabled.

## Review gates

```powershell
npm run typecheck
npm run lint
npm run build
npm run test:browser
```

The browser suite starts only on the homepage, follows UI links for public and role-entry screens, and writes one continuous Chromium WebM recording plus trace and screenshots. It does **not** simulate successful authenticated voting.

## Structure

- `app/(public)/` — public routes and role-entry previews
- `components/layout/` — brand, header and footer
- `components/sections/home/` — original home content reorganized into typed sections
- `components/sections/role-entry/` — voter, electoral body and platform admin entry boundaries
- `lib/release.ts` — explicit fail-closed voting flags
- `tests/e2e/` — browser-only navigation recording
- `docs/` — recovered-code security audit, migration map and release gates

## Important

No credentials, votes, real OTPs or election/payment data are collected or accepted in this preview. The original Base44 client-side authorization/voting code has **not** been reused. The confidential ballot model and server-owned PostgreSQL backend remain separate acceptance gates.

See `docs/MIGRATION_STATUS.md` and `docs/audits/2026-10-20-original-govotin-source-audit.md`.
