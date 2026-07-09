% Sales Copilot Desktop App — Product Requirements Document
% Lightforth
% Draft — v1.0

# 1. Summary

The Sales Copilot Desktop App is a focused, standalone product: a live, in-call AI coach for sales reps. A rep uploads their playbook once, opens the app during a real (or video) call, and gets a suggested response for every turn of the conversation — pulled only from what they uploaded, delivered in the moment the objection lands, not in a call-review doc afterward.

It ships in two tiers — **Individual** and **Teams** — and is deliberately scoped narrower than Cosella. Cosella is a full revenue-operations platform (payment collection on the call, revenue ledger, live deal-rescue monitoring, installment-risk tracking, admin analytics). This product is the coaching layer only: the "what do I say right now" layer. A team that only needs live coaching should never have to buy — or pay for — the revenue-ops half of Cosella to get it.

# 2. Problem

Reps lose winnable deals in the fifteen seconds after an objection lands, not because the answer doesn't exist, but because it isn't in their head at the moment they need it. Today that knowledge lives in scattered docs, a senior rep's memory, or a training deck nobody re-reads before a call.

The people most affected by this can't justify a revenue-ops platform:

- **A solo closer or independent consultant** has no team to roll out playbook training to, no ledger to reconcile, no rescue board to monitor — they just want to sound like their best day, every call.
- **A small sales team lead** wants every rep, including the one hired last week, working off the same answers — without buying a platform sized for a 50-person revenue org.

# 3. Goals

- Get a new user from signup to their first coached call in under 10 minutes, with zero onboarding call required.
- Make the knowledge base the single source of truth: every suggestion is traceable to something the user actually uploaded — never invented.
- Make the entry tier genuinely self-serve: no sales call, no setup fee, card on file and go.
- Give team leads a lightweight way to keep every rep's answers consistent without needing revenue-ops tooling they don't want yet.

# 4. Non-Goals (explicitly out of scope)

This is what separates the product from Cosella. None of the following ship in this product — they remain Cosella-exclusive, and should stay that way to avoid the two products cannibalizing each other:

- **No payment collection on the call.** No Stripe/PayPal/NMI checkout links, no Payment Moment Engine.
- **No revenue ledger or attribution reporting.**
- **No Live Rescue Board** or manager-side call-intervention tooling.
- **No Ghost Simulator** practice mode (candidate for a future add-on, not v1).
- **No installment / payment-plan risk tracking.**
- **No org-wide billing/finance dashboards.**

If a team outgrows this product and needs any of the above, the upgrade path is Cosella — not new features bolted onto this one.

# 5. Target Users

## 5.1 Individual

Solo closer, independent sales consultant, freelance appointment-setter, or small agency owner running their own calls. Self-serve signup, single seat, manages their own knowledge base, pays by card.

**Needs:** fast setup, low price, no team-admin overhead they'll never use.

## 5.2 Teams

A sales team lead, enablement manager, or small sales org (roughly 3–50 reps) buying seats for their team — SDRs, AEs, or CS reps doing renewal calls.

**Needs:** one shared knowledge base so every rep gives the same answer, simple seat management, and just enough visibility to know the tool is actually being used — not a full analytics suite.

# 6. Core User Journeys

1. **Sign up / activate a seat.** Individual: self-serve signup with a card. Teams: admin buys N seats, invites reps by email or invite code; reps activate on first launch.
2. **Build the knowledge base.** Individual uploads their own playbook/FAQ/objection docs. Teams: the admin uploads once; every rep on the team inherits the same knowledge base automatically — no per-rep setup.
3. **Go live on a call.** Rep opens the desktop app, starts a session. The app listens, and for every turn of the conversation shows: Listening → Processing → a suggested response, one to three sentences, sourced only from the knowledge base.
4. **Review afterward (lightweight).** A simple call history list — timestamps and outcomes a rep logs themselves. No ledger, no revenue tie-in, no manager dashboard.

# 7. Feature Requirements

## 7.1 Desktop App Shell

- Native-feeling floating window (macOS-style chrome already validated in prototype).
- **Stealth mode**: hides the app from screen-share capture.
- **Transparent background** option, adjustable.
- **Always on top** toggle.
- Font size / auto-scroll controls for the live transcript.

## 7.2 Knowledge Base

- Upload documents (PDF, Markdown, plain text).
- Individual: one personal knowledge base per account.
- Teams: one shared knowledge base per team, managed by the admin; all seats read from it — no per-seat duplication.
- Suggestions must never answer from outside the uploaded knowledge base. If the answer isn't in there, the app falls back to a clarifying question rather than inventing a fact (see the AI Closer Instructions behavior spec).

## 7.3 Live Call Coaching

- Real-time transcription of the prospect's side of the conversation.
- Three-phase status per turn: **Listening → Processing → Answering**, shown explicitly (not an instant flash-answer).
- A suggested response for **every** turn, not only ones flagged as objections.
- Response format: one to three sentences, phrased the way a person would actually say it out loud, always ending in a question or a clear next step.
- Tone/behavior governed by a single reusable instruction set (Acknowledge → Reframe → Ask; escalation ladder value → trial → discount → solve blocker → split ask → lock next step) — not re-authored per account.

## 7.4 Team Management (Teams tier only)

- Invite reps via email or a shareable invite code.
- Seat activation / deactivation by the admin.
- One shared knowledge base, single source of truth across the team.
- Lightweight usage visibility: which reps are activated, last-active date, calls run — deliberately **not** the Ledger, revenue attribution, or a rep-performance leaderboard.

## 7.5 Call History (basic)

- Local, per-rep list of past calls with date/time and a rep-entered outcome tag.
- No dollar figures, no revenue rollups — that data belongs in Cosella if a team eventually needs it.

# 8. Pricing & Packaging (proposed — for review)

| | Individual | Teams |
|---|---|---|
| Price | $39/mo per seat | $29/mo per seat (min. 3 seats) |
| Setup fee | None | None |
| Knowledge base | Personal, self-managed | One shared KB, admin-managed |
| Seats | 1 | 3–50 |
| Admin console | — | Included |
| Billing | Self-serve, card on file | Self-serve, card on file |

Deliberately no setup fee at either tier — that is a Cosella-specific charge tied to its revenue-ops onboarding, and reintroducing it here would undercut this product's self-serve positioning. Exact price points are a proposal, not a final decision.

# 9. Success Metrics

- **Activation:** % of signups that upload a knowledge base and complete a first coached call within 7 days.
- **Suggestion quality:** in-app thumbs up/down rate on suggested responses.
- **Retention:** 30/60/90-day active usage per seat.
- **Team expansion:** average seats added per team account over its first 90 days.
- **Upgrade signal:** % of Teams accounts that request a Cosella demo (a proxy for "this team has outgrown coaching-only").

# 10. Technical Notes

- Reuses the desktop shell and live-call canvas patterns already validated in the Cosella prototype (window chrome, Listening/Processing/Answering flow, per-turn suggested response) — this is a re-scoping of proven UX, not a rebuild from zero.
- Needs its **own** account and billing model, separate from a Cosella org — this is a distinct product and price point, not a feature flag inside Cosella.
- v1 can ship with the same scripted-turn prototype pattern already built; real-time transcription/inference is a pre-GA requirement, not a v1 blocker for design and pricing validation.

# 11. Risks & Open Questions

- **Cannibalization risk:** Teams tier pricing needs a clear enough gap from Cosella that a team who genuinely needs revenue-ops still upgrades rather than staying on the cheaper coaching-only tier indefinitely.
- **Call recording consent:** transcribing live sales calls raises two-party consent requirements in some US states and jurisdictions abroad — needs a compliance pass before GA, independent of this PRD.
- **Real-time transcription latency/accuracy** at production scale is unproven — the prototype uses scripted turns, not live speech-to-text.
- **Knowledge base quality is the product's ceiling** — a thin or outdated upload produces thin, outdated suggestions; onboarding needs to set that expectation clearly.

# 12. Proposed Milestones

1. **Phase 1 — Individual MVP:** signup, personal knowledge base upload, live coaching, basic call history.
2. **Phase 2 — Teams tier:** seat management, shared knowledge base, admin console, lightweight usage visibility.
3. **Phase 3 — Production coaching engine:** replace the scripted-turn prototype with real-time transcription and live inference.
