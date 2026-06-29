# Landing Pages

Standalone marketing-funnel pages, separate from the main Lightforth app. Each one is a
single self-contained `index.html` — no build step, no framework, no dependency on
`src/` or anything else in this repo. Safe to copy, safe to deploy independently.

## Structure

```
landing-pages/
  _template.html       starter file for a new funnel page
  concierge/index.html Lightforth Concierge — $500 one-time "Success Manager" upsell
  manager/index.html   Lightforth Manager — $10 first-month Pro coupon funnel
```

One folder per funnel, `index.html` as the entry point.

## Adding a new funnel page

1. `cp _template.html <new-funnel-name>/index.html`
2. Customize the hero, pricing/offer copy, and FAQ. Keep the CSS variables and base
   nav/footer markup as-is so it stays visually consistent with the others.
3. Wire up the mock checkout (see "Checkout flow" below) or copy the pattern from
   `concierge/index.html` or `manager/index.html`.

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

## Deploying one page live

1. Create a new Vercel project.
2. Set **Root Directory** to `landing-pages/<funnel-name>` (e.g. `landing-pages/concierge`).
3. Deploy — Vercel serves the `index.html` with zero build config.
4. Attach your real domain in the Vercel project's Domains settings.

Each funnel is fully independent — deploying, breaking, or redesigning one never affects
another or the main Lightforth app.
