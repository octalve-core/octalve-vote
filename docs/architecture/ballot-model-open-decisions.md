# Ballot security and privacy — open architecture decisions

This is a decision register, **not an implemented design**.

## Must decide before voting API implementation

1. Is Octalve Vote a secret-ballot product for all elections, or must organizations explicitly choose public/non-secret elections?
2. What is the ballot unit: one candidate per position, up to `maxVotes` candidates, ranked choice, abstention, write-in?
3. Does eligibility belong to an organization, a single election, or multiple elections through an eligibility join table?
4. Can an officer change candidates or positions after an election opens? If not, when does the configuration become immutable?
5. When and to whom are preliminary participation metrics, tallies and certified results visible?
6. What is the exact retention policy for identifying data, ballots, results and audit trails?
7. Who certifies/voids an election, and how are disputes handled with independent approval and recorded reasons?

## Suggested invariants for implementation

- A voter can obtain at most one completed ballot for an election; concurrent double submissions have the same outcome.
- All selections refer to valid, approved candidates for the right positions **in the same election**.
- Actual ballot write and participation/eligibility claim are atomic; errors cannot yield partial votes.
- Operational administrators must not read or mutate secret selections.
- Result totals can be independently reconciled with accepted ballots and allowed selections.
- No candidate/position changes after voting opens without an explicitly audited controlled process.
- Prefer soft retirement, retention and immutable history over destructive cascading delete for regulated election evidence.
- Never expose OTP values, hashes, credentials, personal identifiers or full ballot linkage in logs or downloadable reports.

## Non-goals right now

Do not migrate the schema speculatively and do not claim end-to-end encryption or anonymity solely because a UI has hidden data. Privacy guarantees depend on threat model, database architecture, operational access and independent verification.
