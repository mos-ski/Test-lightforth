# Cosella — Design Spec

**Date:** 2026-07-08
**Source:** `Closer_OS_PRD_7_Money_Features.docx.md` (Thelix Holdings / Lightforth, v1.0, July 2026)
**Status:** Approved by user, prototype-level, single spec covering all 7 features

## 1. What this is

A brand-new, fully separate sold product — **Cosella** — forked from the existing Enterprise
Sales Copilot (`desktop-copilot-preview`'s Sales Call use case + the `/sales` Sales Admin
Dashboard), stripped down to sales-only, and extended with the 7 "money features" from the PRD:

1. F1 — Payment Moment Engine
2. F2 — Installment Recovery Copilot
3. F3 — Funnel-to-Call Intelligence
4. F4 — The Money Slack Report
5. F5 — Revenue Attribution Ledger
6. F6 — Ghost Prospect Simulator
7. F7 — Second Voice (Live Deal Rescue)

This is a **prototype**: fully simulated end-to-end (no real Stripe/NMI/PayPal, Twilio, Slack, or
voice-AI calls — matches how the existing desktop-copilot-preview / Sales Admin Dashboard mock
system already works), built to let the founder and engineers walk the entire flow before real
implementation is scoped against the production backend (NestJS/FastAPI, Postgres, AWS per the
PRD's stack section).

Existing Enterprise Sales Copilot code (`/copilot/enterprise`, `/sales/*`,
`desktop-copilot-preview`'s Sales Call use case) is **untouched** — Cosella is a duplicate, not a
refactor of shared code.

## 2. Scope decisions (confirmed with user)

- **One spec, all 7 features.** Implementation will still be sequenced (see plan doc), but the
  design is written as one complete picture.
- **Sales-only fork.** No Interview/Coding/Meeting/Exam use cases in Cosella's desktop app —
  only the Sales Call flow, rebranded.
- **Fully simulated integrations**, all 7 features. Nothing calls a real external API.
- **Fresh visual identity** — a distinct accent (emerald/money-green) instead of the existing
  Enterprise navy/teal, so the two products are visually distinguishable in screenshots/demos.
- **One Owner/Manager dashboard + one Closer app** (no separate third "manager-only" login). The
  same admin login sees Payment Settings, Plan Tracker, Ledger, Slack Report config, Prospect
  Intel, Ghost Simulator, and the Live Rescue Board — mirroring how the existing Sales Admin
  Dashboard already unifies Team/Billing/Integrations under one admin.
- **Route namespace:** everything under `/cosella/*`.

## 3. Architecture & file layout

New, isolated directory — nothing shared/parameterized with the existing sales code, only shared
UI primitives (shadcn components, `.lf-table`/`.lf-tabs` CSS classes already in `index.css`):

```
src/pages/cosella/
  marketing/
    CosellaLanding.tsx          — public landing page (7-feature pitch, pricing)
    CosellaCheckoutPage.tsx     — signup + mock payment (2-step, mirrors EnterpriseCheckoutPage)
    CosellaDownloadPage.tsx     — post-checkout "download the app" page
  app/
    CosellaDesktopApp.tsx       — orchestrator: sign-in → setup → live call → summary
    PaymentMomentPanel.tsx       — F1: green/yellow payment panel overlay
    ProspectCard.tsx             — F3: pre-call brief panel
    DangerWhisper.tsx            — F7: risk indicator + text-whisper overlay
  dashboard/
    CosellaAdminLayout.tsx      — sidebar shell, emerald theme
    Overview.tsx                 — F4 digest preview + F5 guarantee bar + today's cash
    PaymentSettings.tsx          — F1 offer/plan setup + mock payment "connections"
    PlanTracker.tsx              — F2 installment plans + risk + recovery scripts
    Ledger.tsx                   — F5 assisted/saved deals + renewal deck generator
    SlackReport.tsx              — F4 config + live preview of the Slack message
    ProspectIntel.tsx            — F3 upcoming calls + prospect cards
    GhostSimulator.tsx           — F6 ghost library + practice leaderboard
    LiveRescueBoard.tsx          — F7 live call board (listen/whisper/warm-join)
    Team.tsx, CallHistory.tsx, Billing.tsx, Integrations.tsx, Settings.tsx
                                 — duplicated from src/pages/sales/*, re-themed
  cosellaOrgStore.ts              — new mock localStorage store (forked shape from mockOrg.ts)
  cosellaAccounts.ts              — new mock account registry (forked from mockAccounts.ts)
```

Routes registered in `src/App.tsx`, lazy-loaded, under `/cosella`, `/cosella/checkout`,
`/cosella/download`, `/cosella/app`, `/cosella/dashboard/*`, `/cosella/sign-in` — parallel
to the existing `/copilot/*` and `/sales/*` routes.

## 4. Data model — `cosellaOrgStore.ts`

Own localStorage key (e.g. `cosella-orgs`), forked shape from `SalesOrg`:

```ts
interface CosellaOrg {
  id: string
  name: string
  admin: { name: string; email: string }
  setupFeePaid: boolean
  members: Member[]                    // reused shape: name, email, role, seatPaid, inviteCode
  deals: Deal[]
  paymentPlans: PaymentPlan[]
  ledgerEntries: LedgerEntry[]
  prospectCards: ProspectCard[]
  ghostPersonas: GhostPersona[]
  ghostSessions: GhostSession[]
  liveCallRiskEntries: LiveCallRiskEntry[]
  slackDigestConfig: SlackDigestConfig
  calls: CallRecord[]                  // extended with leak/objection tags
  connectedIntegrations: string[]
  auditLog: AuditEntry[]
}

interface Deal {
  id: string; prospectName: string; dealType: string
  priceOptions: { pif: number; plans: { label: string; installments: number[] }[] }
  status: 'open' | 'paid' | 'lost'
  closerId: string; callId: string
}

interface PaymentPlan {
  id: string; dealId: string; buyerName: string; totalAmount: number
  installments: { amount: number; dueDate: string; status: 'pending' | 'paid' | 'failed' }[]
  cardOnFile: { last4: string; expiresSoon: boolean }
  riskScore: 'green' | 'yellow' | 'red'
  retryCount: number
}

interface LedgerEntry {
  id: string; dealId: string; closerId: string; objection: string
  counterUsed: string; tag: 'organic' | 'assisted' | 'saved'
  dollarValue: number; date: string
}

interface ProspectCard {
  id: string; callId: string; prospectName: string
  vslWatchPct: number; rewatchedParts: string[]
  applicationAnswers: string[]; emailOpens: number
  heatSignal: 'HOT' | 'WARM' | 'COLD'
  openingLines: string[]
}

interface GhostPersona {
  id: string; sourceCallId: string; name: string
  objectionStyle: string; tone: string; stalls: string[]
}

interface GhostSession {
  id: string; ghostId: string; closerId: string; score: number
  objectionsHandled: number; countersUsed: number
  closeAttempted: boolean; paymentAsked: boolean; date: string
}

interface LiveCallRiskEntry {
  callId: string; closerId: string; dealValue: number
  riskLevel: 'green' | 'yellow' | 'red'; dangerSignals: string[]
  rescueLog?: { managerJoinedAt: string; mode: 'listen' | 'whisper' | 'warm-join'; outcome: 'saved' | 'lost'; dollarsSaved: number }
}

interface SlackDigestConfig { channel: string; sendTime: string; bigWinThreshold: number }

interface AuditEntry { id: string; action: string; actor: string; timestamp: string; detail: string }
```

`demoSeedCosellaOrg(adminEmail, adminName, orgName)` seeds all of the above with realistic data on
signup — several deals/plans across green/yellow/red risk, a handful of ledger entries mixing
organic/assisted/saved, 2-3 prospect cards, 2 ghost personas with sessions, one active live-risk
entry, a populated Slack config — so the dashboard is never empty on first view, matching the
existing `demoSeedOrg` pattern for the Enterprise dashboard.

`cosellaAccounts.ts` mirrors `mockAccounts.ts` — a separate localStorage-backed registry so Closer
OS logins don't collide with Enterprise/regular Copilot accounts.

## 5. Marketing → Checkout → Download

- **`CosellaLanding.tsx`** — hero pitch ("every other tool helps closers talk, Cosella helps you
  get paid"), one section per feature (7 cards/rows), pricing: **$7,500 one-time setup +
  $149/seat/month** (placeholder, distinct from Enterprise's $5,000/$79 so the two products don't
  look identical — change freely). CTA → checkout.
- **`CosellaCheckoutPage.tsx`** — 2-step (org + admin details, then mock payment), on complete
  calls `demoSeedCosellaOrg()` and redirects to the download page.
- **`CosellaDownloadPage.tsx`** — mock Mac/Windows download buttons (toast, no real file) +
  "Open Cosella" → `/cosella/sign-in`.

## 6. Closer's live app (F1, F3, F7)

`CosellaDesktopApp.tsx` forks the existing sign-in → setup → live-call orchestration, but with
only one destination (no use-case picker): Sign-In (via `cosellaAccounts.ts`, invite-code
activation reused from `SignInScreen`'s enterprise mode) → Setup (customer name + deal type/price
picker, pulling from the org's `Deal.priceOptions`) → **Prospect Card** shown once before the call
starts (F3: heat signal, VSL/application highlights, 3 opening lines) → Live call canvas, forked
from `SalesLiveCanvas`, keeping its existing Deal / Talk Track / Objections tabs, plus:

- **Payment Moment Engine (F1):** specific `MOCK_SALES_QA`-style turns are tagged
  `isYesSignal: true`. Reaching one slides in `PaymentMomentPanel` (green): PIF or plan buttons
  from the deal's price options. "Send Link" simulates SMS + email (toast), then auto-advances a
  status ticker — Link opened → Card entered → PAID — over a few seconds. A "Simulate Decline"
  dev control flips the panel yellow, showing the plain-language decline reason + rescue script +
  backup options (second card / smaller deposit / split). A hotkey (e.g. `P`) force-opens the
  panel manually at any time (R1.8). On PAID: writes a `Deal` (paid) + `PaymentPlan` (if an
  installment plan was chosen) + a `LedgerEntry` (tagged `assisted`/`saved` if an objection/counter
  was shown earlier in this same call, `organic` otherwise) + a `CallRecord`, and simulates
  "📣 Posted to #cosella-wins" via toast.
- **Danger detector (F7):** other turns are tagged `isDangerSignal: true`. Reaching one flips a
  corner risk badge to red and simulates a manager Slack ping (toast). After a short delay,
  `DangerWhisper` shows a small text-only overlay ("🎧 Manager whisper: ...") as if a manager
  intervened remotely — **text whisper only**, per the PRD's own explicit fallback rule (R7.3: only
  use voice whisper on a tested setup; this prototype has none, so text is the correct default,
  not a corner cut). Outcome (saved/lost, dollar value) is written to `LiveCallRiskEntry` and, if
  saved, to the Ledger.

## 7. Owner/Admin dashboard (F2, F4, F5, F6, F7-board)

`CosellaAdminLayout.tsx` — emerald-accented sidebar, same shell pattern as `SalesAdminLayout`.
Nav: **Overview, Payment Settings, Plan Tracker, Ledger, Slack Report, Prospect Intel, Ghost
Simulator, Live Rescue Board, Team, Call History, Billing, Integrations, Settings.**

- **Overview** — today's cash (sum of paid deals + installments + recovered, vs. yesterday/goal),
  deals-saved list, money-leaked list, cash-ranked leaderboard, tomorrow's pipeline + 3 hottest
  prospects. This is the on-screen mirror of what the Slack digest (F4) sends.
- **Payment Settings (F1 R1.2)** — per deal-type offer setup (PIF price, plan tiers, deposit
  minimum), plus mock Stripe/NMI/PayPal "Connect" toggles styled like the existing
  `Integrations.tsx` cards.
- **Plan Tracker (F2)** — table of `PaymentPlan`s with risk badges; row click opens a drawer with
  card-on-file, retry history, and the recovery script matched to the failure reason; "Send
  reminder now" button.
- **Ledger (F5)** — filterable (month/closer/objection) table of `LedgerEntry`s, a guarantee
  tracker progress bar, "Generate renewal deck" (produces a simple printable/downloadable summary,
  not a real PDF service).
- **Slack Report (F4)** — config form (channel, send time, big-win $ threshold) + a live preview
  card styled like an actual Slack message block, "Send test digest now" button that fires the
  same toast simulation used elsewhere.
- **Prospect Intel (F3)** — list of upcoming booked calls with their `ProspectCard`s (heat badges,
  VSL %, opening lines) — this is the data the closer's app reads from.
- **Ghost Simulator (F6)** — library of `GhostPersona`s (created via a "Make a Ghost" button on a
  lost call in Call History), and a practice leaderboard of `GhostSession`s. Practice itself is
  scoped down for the prototype: a short scripted exchange against the persona's canned objections
  ending in a scored result screen — not real-time voice AI (explicitly out of scope, confirmed).
- **Live Rescue Board (F7)** — cards for calls currently live, color-coded green/yellow/red with
  deal value. Since there's no real concurrent call engine in this prototype, the board is driven
  by a small set of seeded example live entries (from `demoSeedCosellaOrg`) that a "Simulate live
  calls" control can advance/refresh. "Listen"/"Whisper"/"Warm Join" buttons are simulated actions
  that write to the rescue log.
- **Team, Call History, Billing, Integrations, Settings** — duplicated from `src/pages/sales/*`
  with Cosella theming; Call History gains the "Make a Ghost" action and leak/objection tags;
  Billing reflects the Cosella pricing model from section 5.

## 8. Cross-cutting concerns

- **Audit log:** every simulated money-moving action (send link, retry, decline-rescue offered,
  rescue join, renewal deck generated) appends an `AuditEntry` — satisfies the PRD's blanket "every
  money-moving action must be logged" rule even though nothing here is a real charge.
- **Testing:** a `.test.tsx`/`.test.ts` alongside each new component/store function, matching this
  repo's existing convention (Vitest). Manual end-to-end verification via a throwaway Playwright
  script during implementation (not committed), same as prior desktop-copilot-preview work.
- **Explicitly out of scope:** any real Stripe/NMI/PayPal/Twilio/Slack API call, any real voice AI,
  any real backend/Postgres/NestJS work described in the PRD's stack section. This spec is the
  prototype that precedes that real build.

## 9. Open items carried into the implementation plan

- Exact sequencing of the ~20 new files (data model first, then app-side features, then dashboard
  tabs) — to be laid out in the implementation plan, not this spec.
- Pricing numbers in section 5 are placeholders pending the user's real pricing decision.
