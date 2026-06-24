# Desktop Copilot — Pricing-Gated Access Flow

## Context

This is the second of three planned specs for the desktop Copilot expansion (the first, [desktop-copilot-use-cases-design.md](2026-06-24-desktop-copilot-use-cases-design.md), built the 5 use-case flows and the free-form `UseCaseSelectionScreen`). The product direction changed: use-case access is no longer freely chosen — it's determined by what the user buys. Onboarding is now followed immediately by a Pricing screen, and the plan purchased there determines which use case(s) the user can reach next. This spec covers that re-sequencing and the three distinct access paths (credit subscription, enterprise invite, one-time fee) it introduces.

## Flow Change

Old: `Splash → Onboarding → UseCaseSelectionScreen (free pick of all 5) → Setup → Preference → Canvas → Complete`

New: `Splash → Onboarding → Pricing → [Payment | Invite Code] → UseCaseSelectionScreen (scoped) or straight to Setup → Preference → Canvas → Complete`

`UseCaseSelectionScreen` is reused, not replaced — it gains a `useCaseIds: UseCaseId[]` filter prop so it can render a subset of `USE_CASES` instead of always all 5.

## Pricing Tracks

Four cards on the Pricing screen, each mapped to a `PlanConfig`:

| Plan | Price | Unlocks | Access path |
|---|---|---|---|
| **PRO** | $49/mo, 50 credits | Interview, Coding, Meeting (pick freely each session, 1 credit/session) | Mock card-form payment |
| **Premium** | $79/mo, 100 credits | Interview, Coding, Meeting (same bundle as PRO, just more credits) | Mock card-form payment |
| **Sales Call** | Enterprise, invite-only | Sales Call only | Invite-code entry (no payment) |
| **Exam** | $500 one-time | Exam only | Mock card-form payment |

```ts
type PlanId = 'pro' | 'premium' | 'sales-call' | 'exam'

interface PlanConfig {
  id: PlanId
  label: string
  priceLabel: string          // "$49/mo", "$79/mo", "Invite only", "$500 one-time"
  description: string
  accessKind: 'payment' | 'invite-code'
  unlockedUseCases: UseCaseId[]
}
```

`PRO`/`Premium` both set `unlockedUseCases: ['interview', 'coding', 'meeting']` — they differ only in `priceLabel`/credits, not in which use cases they unlock. `sales-call` sets `unlockedUseCases: ['sales-call']`; `exam` sets `unlockedUseCases: ['exam']`.

## New Screens

**`PricingScreen`** — renders 4 cards from a `PLANS: PlanConfig[]` array (parallel structure to `USE_CASES`). Each card's CTA branches on `accessKind`: `'payment'` → `PaymentScreen`, `'invite-code'` → `InviteCodeScreen`.

**`PaymentScreen`** — one generic component reused for PRO, Premium, and Exam. Mock card form (card number, expiry, CVC — no real validation beyond non-empty, consistent with the rest of this prototype's mocked inputs). Shows a one-line purchase summary derived from the selected `PlanConfig` (e.g. "$49/mo — PRO Plan"). On submit, proceeds to the next step.

**`InviteCodeScreen`** — single text field ("Enter your invite code") + Continue button, used only for the Sales Call plan. Any non-empty code succeeds — there's no real organization backend to validate against.

## Post-Access Routing

After `PaymentScreen` or `InviteCodeScreen` completes:
- If `unlockedUseCases.length > 1` (PRO/Premium): route to `UseCaseSelectionScreen` with `useCaseIds={config.unlockedUseCases}`, which renders only the Interview/Coding/Meeting cards.
- If `unlockedUseCases.length === 1` (Sales Call, Exam): skip the picker entirely and route straight to that use case's `SetupScreen`.

From there, the flow is unchanged from the first spec: `Setup → Preference → Canvas (conversational or screenshot-qa per use case) → Complete`.

## Out of Scope

- Real payment processing, subscription billing, or invite-code/organization backend validation — this remains a client-side mock prototype.
- A persistent "credits remaining" indicator during live sessions — explicitly deferred; not part of this pass.
- The Knowledge Center spec (third planned spec) — document upload per use case is still untouched here.

## Verification

Run the prototype locally (`npm run dev`, navigate to `/desktop-copilot-preview`) and walk all 4 pricing tracks end to end:
- PRO → mock payment → scoped picker shows only Interview/Coding/Meeting → pick each in turn → correct Setup fields → correct canvas pattern
- Premium → same as PRO, different price/credit copy on the payment summary
- Sales Call → invite-code screen → straight to Sales Call Setup (no picker shown)
- Exam → mock payment → straight to Exam Setup (no picker shown)
