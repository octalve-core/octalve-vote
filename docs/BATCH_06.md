# Batch 6 — Email verification, unconfirmed payment claims, draft voter registers

**Branch:** `phase/06-email-payments-voter-register`, stacked on Batch 5. **Draft / review only.**

## Source and implementation
- Uses Next.js 16 App Router, strict TypeScript/TSX, Tailwind CSS section components.
- Keeps GoVotin role navigation: public, Electoral Body, Platform Admin, plus election-specific Voters.
- Email verification issues a cryptographic random 32-byte URL token, stores only SHA-256, enforces 20-minute expiry, one-time transactional consumption, supersedes old challenges and throttles sends. Delivers using configured SMTP with TLS in non-CI environments. **No console tokens, fake delivery, or automatic GET redemption.**
- Email validation is identity-channel confirmation only, not organization approval or payment evidence. New signups remain PENDING/UNPAID.
- Payment claims capture bank transfer reference, reported NGN amount and optional note. Stored as SUBMITTED; MFA-admin reviewers can mark NEEDS_EVIDENCE or REJECTED, with immutable auditor action and reason. No action can set ElectoralBody.paymentStatus=PAID; separate provider-confirmed bank/gateway settlement is **not yet implemented**.
- Draft voter register is tenant- and election-scoped. Adds single voter or parses 1–100-record UTF-8 CSV with `name,email,phone` headers, quoted commas and a 100 KB cap. In a serializable transaction rechecks account, approved/paid/verified body, DRAFT election, and 1,000-voter pilot cap. Uses cryptographically generated, non-rendered voter codes; stores no raw OTP. Unique email per election. All-or-nothing import.
- Sensitive reads and writes are server-only, every feature defaults OFF.

## Review flags and credentials
```env
ENABLE_EMAIL_VERIFICATION=false
APP_ORIGIN=https://preview.your-owned-domain.example
SMTP_HOST=
SMTP_PORT=587
SMTP_FROM=
SMTP_USER=
SMTP_PASSWORD=
ENABLE_PAYMENT_REVIEW=false
ENABLE_VOTER_REGISTER=false
```
Use real, secret SMTP credentials and verified sending domain before production. Never commit secrets. Do not use the example origin literally. CI uses isolated Mailpit SMTP, temporary PostgreSQL and synthetic test accounts.

## Test boundary and known issues
- The full browser-only CI journey starts on the homepage and only uses clicks, typing, file selection and visible links. CI database seeding/migration happens before recording.
- Neither organization approval nor self-reported payment claims verify a bank transfer.
- No real voter invitations, QR/OTP or ballot operations. Current Ballot -> Voter linkage means secret ballot authority remains unsuitable for binding elections.
- Email deliverability, SMS and recovery require real-provider integration tests; Mailpit receipt proves only local SMTP transaction.
- Secure contact data retention/consent policy, privacy exports, audit log with resource refs, MFA recovery, IDOR negative cases, and election lifecycle regression remain required.
- **Do not merge to production or activate real voting.** The old `govotin` database requires an independent migration review.
