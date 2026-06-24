# Desktop Copilot — Auth + Pricing-Gated Access Flow

## Context

This is the second of three planned specs for the desktop Copilot expansion (the first, [desktop-copilot-use-cases-design.md](2026-06-24-desktop-copilot-use-cases-design.md), built the 5 use-case flows and the free-form `UseCaseSelectionScreen`). The product direction changed: use-case access is no longer freely chosen — it's gated behind sign-up and what the user buys (or was invited to). Onboarding is now followed by Sign Up/Sign In, then Pricing, and the plan purchased there (or an enterprise invite code entered at sign-up) determines which use case(s) the user can reach next.

## Flow Change

Old: `Splash → Onboarding → UseCaseSelectionScreen (free pick of all 5) → Setup → Preference → Canvas → Complete`

New:
```
Splash → Onboarding → Sign Up/Sign In
  → (no invite code) → Pricing → Payment → UseCaseSelectionScreen (scoped) or straight to Setup → Preference → Canvas → Complete
  → (invite code)    → Enterprise Sign In → Sales Call Setup → Preference → Canvas → Complete
```

`UseCaseSelectionScreen` is reused, not replaced — it gains a `useCaseIds: UseCaseId[]` filter prop so it can render a subset of `USE_CASES` instead of always all 5.

## Sign Up / Sign In

A new screen between Onboarding and Pricing. Mirrors the existing web app's auth pattern (`src/pages/Auth.tsx`, `useAuth`/`AuthProvider`, `src/hooks/useAuth.tsx`) — same account system, same `login(token)` call, same demo-login fallback — but restyled to match this prototype's dark `MacWindow` aesthetic (`BG`, `CARD`, `BORDER` tokens) instead of `Auth.tsx`'s light web theme. It mirrors `Auth.tsx`'s mode structure (choice → email → password → login), not its literal markup.

One addition: a secondary link, **"I have an invite code"**, next to the normal sign-up/sign-in options. Clicking it reveals an invite-code field and switches the form into **enterprise sign-in mode** — email + password only, no "create account" path, since enterprise users are pre-provisioned by their organization's admin (per the product rule: anyone with an invite code was already paid for by the enterprise admin). Any non-empty code + credentials succeeds, consistent with how the rest of this prototype mocks validation.

- **Regular sign-up/sign-in** (no invite code) → proceeds to **Pricing**.
- **Enterprise sign-in** (invite code entered) → skips Pricing entirely and routes straight to the existing Sales Call `SetupScreen`, treated as the enterprise user's "dashboard."

## Pricing Tracks

Because Sales Call is now reached only via an enterprise invite code at sign-in, it's removed from the Pricing screen. Pricing shows **three** cards:

| Plan | Price | Unlocks | Access path |
|---|---|---|---|
| **PRO** | $49/mo, 50 credits | Interview, Coding, Meeting (pick freely each session, 1 credit/session) | Mock card-form payment |
| **Premium** | $79/mo, 100 credits | Interview, Coding, Meeting (same bundle as PRO, just more credits) | Mock card-form payment |
| **Exam** | $500 one-time | Exam only | Mock card-form payment |

```ts
type PlanId = 'pro' | 'premium' | 'exam'

interface PlanConfig {
  id: PlanId
  label: string
  priceLabel: string          // "$49/mo", "$79/mo", "$500 one-time"
  description: string
  unlockedUseCases: UseCaseId[]
}
```

`PRO`/`Premium` both set `unlockedUseCases: ['interview', 'coding', 'meeting']` — they differ only in `priceLabel`/credits, not in which use cases they unlock. `exam` sets `unlockedUseCases: ['exam']`. Every plan on this screen uses the same access path (payment) now that Sales Call has its own separate gate, so `PlanConfig` no longer needs an `accessKind` field.

## New Screens

**`SignInScreen`** — mirrors `Auth.tsx`'s mode flow (choice / email / password / login), restyled dark. Adds the "I have an invite code" link described above, which reveals an invite-code field and switches to enterprise sign-in mode.

**`PricingScreen`** — renders 3 cards from a `PLANS: PlanConfig[]` array (parallel structure to `USE_CASES`). Each card's CTA leads to `PaymentScreen`.

**`PaymentScreen`** — one generic component reused for PRO, Premium, and Exam. Mock card form (card number, expiry, CVC — no real validation beyond non-empty). Shows a one-line purchase summary derived from the selected `PlanConfig` (e.g. "$49/mo — PRO Plan"). On submit, proceeds to the next step.

## Post-Access Routing

After `PaymentScreen` completes:
- If `unlockedUseCases.length > 1` (PRO/Premium): route to `UseCaseSelectionScreen` with `useCaseIds={config.unlockedUseCases}`, which renders only the Interview/Coding/Meeting cards.
- If `unlockedUseCases.length === 1` (Exam): skip the picker entirely and route straight to Exam's `SetupScreen`.

After enterprise sign-in (invite code): route straight to Sales Call's `SetupScreen`, bypassing Pricing and the picker entirely.

From there, the flow is unchanged from the first spec: `Setup → Preference → Canvas (conversational or screenshot-qa per use case) → Complete`.

## Out of Scope

- Real payment processing, subscription billing, or invite-code/organization backend validation — this remains a client-side mock prototype.
- A persistent "credits remaining" indicator during live sessions — explicitly deferred; not part of this pass.
- The Knowledge Center spec (third planned spec) — document upload per use case is still untouched here.
- A dedicated, distinct "Sales Dashboard" screen — the existing Sales Call `SetupScreen` serves as the enterprise user's landing point for this pass.

## Verification

Run the prototype locally (`npm run dev`, navigate to `/desktop-copilot-preview`) and walk both paths end to end:
- Regular sign-up → PRO → mock payment → scoped picker shows only Interview/Coding/Meeting → pick each in turn → correct Setup fields → correct canvas pattern
- Regular sign-up → Premium → same as PRO, different price/credit copy on the payment summary
- Regular sign-up → Exam → mock payment → straight to Exam Setup (no picker shown)
- Sign-in with "I have an invite code" → enterprise sign-in fields appear, no sign-up option → straight to Sales Call Setup (no Pricing screen shown at all)
