# Landing Pages

Marketing-funnel pages. Each one is a single self-contained `index.html` — no build
step, no framework, no dependency on `src/` or anything else in this repo's app code.

This folder lives under `public/`, so Vite copies it verbatim into the build output and
it deploys automatically with the main app, reachable at:
- `https://test-lightforth.vercel.app/landing-pages/concierge/`
- `https://test-lightforth.vercel.app/landing-pages/manager/`

No separate Vercel project needed — these are live the moment the main app deploys.

## Structure

```
public/landing-pages/
  _template.html       starter file for a new funnel page
  concierge/index.html Lightforth Concierge — $500 one-time "Success Manager" upsell
  manager/index.html   Lightforth Manager — $10 first-month Pro coupon funnel
```

One folder per funnel, `index.html` as the entry point.

## Adding a new funnel page

1. `cp _template.html <new-funnel-name>/index.html`
2. Customize the hero, pricing/offer copy, and FAQ. Keep the CSS variables, the real
   logo markup, and base nav/footer markup as-is so it stays visually consistent with
   the others.
3. Wire up the mock checkout (see "Checkout flow" below) or copy the pattern from
   `concierge/index.html` or `manager/index.html`.

## Design standards

- **Use the real logo** — the inline SVG already in `_template.html`'s nav, same mark
  `src/components/shared/LightforthLogo.tsx` renders elsewhere in the app. Never swap in
  a placeholder icon.
- **Every page needs real motion** — scroll-reveal on each major section, a hero entrance
  animation, and hover/press feedback on buttons. This is already wired into
  `_template.html`; keep it when copying from there rather than stripping it out.
- **Long lead forms (6+ fields) must be a multi-step wizard**, not one long scrolling
  panel — see `concierge/index.html` for the worked example (progress bar, per-step
  validation, back/continue). Short forms (~5 fields or fewer, low-friction funnels) stay
  a single step — see `manager/index.html`.

## Checkout flow (prototype — no real payment processing)

Every funnel uses the same pattern: an offer/pricing card → a lead-capture form → a mock
card-entry panel → a success state, all as same-page show/hide toggles (see the
`<script>` block at the bottom of each `index.html`). There's no real Stripe integration
and no backend call — clicking "Pay" just reveals the success state.

Each page's lead form logs the captured fields plus auto-captured UTM params and device
info to the browser console (`Lead captured (prototype only, not sent anywhere): ...`).
**Nothing is sent to a CRM yet.** Wiring this to GoHighLevel (or any real CRM/webhook) is
real backend work — replace the `console.log(...)` in the `<script>` block with a real
`fetch()` POST once you have a webhook URL. Calendly booking, email/SMS tracking, and
Clay enrichment are not implemented here for the same reason — they need real third-party
accounts and credentials this prototype doesn't have.

## Going live on a real domain

By default every page just rides along with the main app's deployment (see above) —
good for review and for running ads where a `/landing-pages/...` path is fine.

If a funnel needs its own bare domain (e.g. `getlightforthconcierge.com` with nothing
else on it), pull that one folder out into its own Vercel project instead:
1. Create a new Vercel project from this repo.
2. Set **Root Directory** to `public/landing-pages/<funnel-name>`.
3. Deploy, then attach the real domain in that project's Domains settings.
This is a separate, independent deployment from the main app at that point — breaking
or redesigning it won't affect `test-lightforth.vercel.app` or any other funnel.
