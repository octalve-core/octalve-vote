# Octalve Vote — Continuous browser-only acceptance walkthrough

**Status:** Plan only. No walkthrough or video has been executed or recorded.

## Evidence rules

- Start at the application's homepage in a real desktop browser.
- Navigate **only via visible user links, controls, forms and uploads** (not by going directly to deep routes).
- Do not use database edits, seed commands, direct API calls, browser console injections, internal localStorage/session mutations, or programmatic bypass of authentication.
- Use pre-approved synthetic test identities and an isolated preview environment, never live election voters.
- Record **one continuous video** with browser UI, timestamps, URL bar, visible state changes, and error messages.
- Record functional outcomes with time-coded notes; blur OTP, passwords, voter identifying data and secrets in any distributable copy.
- If the UI does not expose a journey, record the blocker and stop that journey; do not invent an alternative route.

## Journey sequence (only when implementation exists)

1. Open homepage; use menu links and role entry points to inspect public information, responsive layout, accessibility and error pages.
2. From homepage, enter electoral-body onboarding; create an organizational account using form inputs; check validation and confirmation; sign in via the UI.
3. In electoral workspace, create a draft election, positions, nomination/candidate entries and eligibility list; upload a test CSV through file picker; examine validation, duplicates and approval checkpoints.
4. Publish/schedule/start the test election if and only if authorized through visible controls; inspect the election link/invitation and voter instructions.
5. Sign out, return to home using UI; follow a real test invitation; go through voter OTP verification using the test delivery channel and visible form.
6. Review positions and candidates; select choices; view confirmation; submit once; capture confirmation; attempt UI re-entry and confirm duplicate vote is blocked without exposing ballot choices.
7. Sign out; use visible links to return to electoral login; monitor participation and close election through UI where authorized; inspect tally reconciliation and publish/certify controls.
8. Sign out; return home; open platform administrator access through visible navigation; authenticate with MFA when implemented; inspect tenant approval, support, operational audit and controls while verifying inability to view or alter secret choices.
9. Return home using navigation; check footer, accessibility, mobile viewport and error recovery using only browser UI.

## Report each checkpoint

For each action note: role, navigation path, start/end video timestamp, expected result, observed result, screenshot/video evidence, pass/fail/blocked, severity, and follow-up issue.

## Go/no-go gates

All three roles must complete relevant flows with no privilege bypass. Duplicate/expired vote protection, same-election candidate validation, anonymity (if required), result reconciliation, tenancy, logs and audit behavior must pass independent verification. A styled interface or green build alone does not authorize voting.
