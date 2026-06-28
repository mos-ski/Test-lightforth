# Lightforth Copilot (Desktop) — Product Requirements Document

**Version:** 1.0
**Status:** Draft / In-Review
**Author:** Product
**Product:** A stealth, real-time AI assistant that runs on a user's desktop during live interviews, coding assessments, meetings, and sales calls — sold as three distinct products to three distinct buyers.

---

## 1. Problem Statement

High-stakes live conversations — job interviews, technical assessments, client meetings, sales calls — reward people who can think and respond quickly under pressure, regardless of whether they actually know the material best. Today, candidates and reps either go in unprepared, or rely on a second monitor full of notes that's awkward to use and obvious to the other party.

Lightforth Copilot removes that disadvantage. It listens (or watches the screen), understands what's being asked in real time, and surfaces the right response — invisibly, so the other party never knows it's there.

The product serves three very different buyers with three very different needs, so it is packaged and sold as three separate products built on one shared core engine.

---

## 2. Target Users

| Segment | Who they are | What they're using Copilot for |
|---|---|---|
| **Individual job seeker** | Actively interviewing for roles, often across multiple companies in the same week | Live interviews, take-home/live coding rounds, and prep calls — wants confidence and speed under pressure |
| **Certification / exam candidate** | Sitting a proctored or remote knowledge exam (professional certifications, licensing exams, etc.) | A single, focused need: answer on-screen questions correctly and quickly — no interview or meeting use case required |
| **Enterprise sales team** | A B2B sales organization (manager/admin buys, reps use) | Live sales calls where reps need instant, accurate answers about their own product/pricing/policies, pulled from their company's own knowledge base, not generic AI knowledge |

---

## 3. Product Lineup & Pricing

Three products, three buyers, one underlying engine:

| Product | Buyer | Price | What it unlocks |
|---|---|---|---|
| **Regular Copilot — Pro** | Individual | **$49/mo** | Interview and Coding use cases |
| **Regular Copilot — Premium** | Individual | **$79/mo** | Everything in Pro, **plus** the Meeting use case |
| **Exam Copilot** | Individual | **$500 one-time** | Exam use case only — no subscription, no other use cases |
| **Enterprise Sales Copilot** | Company (admin buys on behalf of team) | **$5,000 one-time setup fee** + **$79/seat/month** | Sales Call use case for every activated rep, plus a web admin dashboard for the company |

Each product has its own landing page, its own checkout, and its own first-run destination after purchase. A buyer should never see pricing, features, or setup steps belonging to a product they didn't choose.

### Why split it this way
- **Regular** customers are shopping for an ongoing career tool and expect subscription pricing with room to grow (more use cases, more credits).
- **Pro vs. Premium is a real feature gate, not just a credits difference.** Meeting is the use case most likely to be used by people already paying for more — internal stakeholders, account managers, client-facing roles — so it's the natural upsell lever that gives Premium a distinct reason to exist beyond "more of the same." A Pro subscriber who tries to start a Meeting session should be clearly prompted to upgrade, not see the use case at all in their setup screen.
- **Exam** customers have one task, one sitting, and don't want to commit to a subscription for a single use — one-time pricing matches the one-time need.
- **Enterprise** is sold top-down to a company, not bottom-up to an individual rep. The admin is the buyer and the seat-manager; reps never see a price tag.

---

## 4. Account Recognition & Sign-In Routing

A returning user who signs in must land exactly where their purchase entitles them to be — never repeating a payment flow or a setup step they've already completed, and never seeing a use case they haven't unlocked.

| Account type | How it's created | Where sign-in routes them |
|---|---|---|
| Regular individual | Signs up, picks Pro/Premium, pays | Straight to their unlocked use cases (Interview/Coding/Meeting) |
| Exam individual | Signs up, pays the one-time fee | Straight to the Exam canvas — never the use-case picker |
| Enterprise admin | Buys the Enterprise plan, pays setup fee + own seat | Straight to Sales Call (their seat is active immediately, independent of the rest of their team) |
| Enterprise member (rep) | Invited by their admin via name + email, gets an invite code | Once their admin has activated their seat (paid the $79/mo for them), they sign in with the invite code and land on Sales Call. Before their seat is activated, sign-in should clearly tell them their seat isn't active yet, not silently fail |

The admin's own access is **never blocked waiting on the rest of the team** — they paid for their own seat the moment they completed setup.

---

## 5. Core Experience: The Live Canvas

This is the shared engine behind Interview, Meeting, and Sales Call. All three are the same kind of moment — a live, spoken, multi-party conversation — so they share one canvas pattern.

### 5.1 Setup (before the call)

One screen, not a multi-step wizard. Fields needed depend on the use case, but the pattern is consistent: title on top, input field directly under it, plain vertical flow — no buried settings.

- **Use case selector** — for Regular Copilot, the unlocked use cases are presented as a single setup screen with a segmented tab control at the top (not a separate "pick a use case" screen). Switching tabs swaps which fields are shown. **Only the tabs the user's plan has unlocked are shown** — a Pro subscriber sees Interview and Coding; a Premium subscriber sees Interview, Coding, and Meeting. A locked use case should never be reachable from this screen at all, not just disabled.
- **Position / role** — a type-ahead field that suggests common job titles as the user types, rather than a flat text box.
- **Job description** — optional paste field, with a "Suggest for me" action that generates a plausible job description from the role alone, for users who don't have one handy.
- **Company name** (Sales Call) — who the rep is calling.
- A **"don't ask me again"** option so repeat users skip straight to the canvas next time. The only way to bring setup back is a control inside the canvas itself, so it's never triggered by accident mid-session.

### 5.2 Going live

When the session starts, the assistant:
1. Listens to the live audio.
2. Transcribes what's said in real time.
3. Identifies who is speaking.
4. Generates and streams a suggested response toward the user.

Target time from "question finishes" to "first word of the suggested answer appears" is **about 2 seconds**.

### 5.3 Multi-speaker awareness (new in this phase)

Real conversations aren't one-on-one. An interview panel can have two interviewers; a meeting can have five attendees; a sales call can have the prospect plus a colleague who joins midway. The Copilot already knows which voice is the user's own (they're wearing the mic) — the requirement here is to track and label the **other voices** in the room:

- **Audio source is the other party's side of the call** — the interviewer, the meeting attendees, the customer/prospect — not the user's own microphone feed. Multi-speaker detection only matters on that side; the user is always one known, separate voice.
- When a new, previously-unheard voice joins the conversation, the assistant should recognize it as distinct from voices already tracked, without requiring the user to manually introduce every attendee.
- Each tracked voice gets a label (e.g., "Interviewer 1," "Interviewer 2," or a name if one was provided at setup) and subsequent lines in the transcript are attributed to the right speaker.
- **Interjections** — when one speaker cuts into another speaker's question or answer before they finish — should be visually distinguishable from a normal back-and-forth turn, so the user can tell at a glance "this wasn't the original question, someone jumped in." This should read as a lightweight, secondary thread off the main line of conversation, not its own heavyweight UI element competing for attention with the actual answer the user needs.

### 5.4 Response style

Users choose how they want answers presented, set once and reusable across sessions:
- **Default** — a complete, ready-to-read-aloud answer.
- **Headlines** — STAR-format bullet points (Situation, Task, Action, Result).
- **Coaching** — short directional pointers rather than a scripted answer, for users who want to formulate their own words but need a nudge.

### 5.5 Window behavior (stealth — the core differentiator)

This is why the product exists as a desktop app instead of a browser tab:
- **Invisible on screen shares and recordings.** If the other party asks to see the user's full screen, or the call gets recorded, the Copilot window must not appear in either.
- **Stealth mode toggle** — on by default; can be turned off if the user wants a normal, visible window (e.g., while testing).
- **Transparency control** — adjustable opacity so the window can sit over other applications without blocking what's behind it.
- **Always-on-top** — keeps the window floating above whatever else is in focus.

### 5.6 Ending a session

A single, clear "End" action. On completion, the user gets confirmation that the session was saved. For Sales Call specifically, the completed call (with its full transcript) is what populates the admin's Call History — see §7.4.

---

## 6. Core Experience: The Screenshot Canvas (Coding & Exam)

Coding rounds and exams aren't spoken conversations — they're a question on screen that needs an answer. This is a separate, simpler canvas pattern shared by the Coding use case (under Regular Copilot) and the standalone Exam Copilot.

- **Auto-capture by default.** The assistant watches the screen and automatically captures and answers new questions as they appear — the user shouldn't have to remember to trigger anything during a timed exam.
- **Manual override always available.** Power users or edge cases (a question the auto-capture missed, or wanting to force a re-read) can trigger a capture manually at any time. Two ways to trigger it, so the user isn't boxed into one input method (e.g., a single key press, or a key combination) — both must always work side-by-side with auto-capture, never one replacing the other.
- Response streams in the same way as the live canvas: fast, visibly "thinking," then answering.

**Exam Copilot specifically:** after purchase, the user goes straight from download/sign-in to this canvas. There is no use-case picker, no setup screen asking which use case they want — they bought exactly one thing and should land on exactly that.

---

## 7. Enterprise Sales Copilot — Admin Dashboard

This is the part of the product that doesn't live in the desktop app at all — it's a web dashboard for the company admin who bought the product. Think of it as the control plane for everything the sales team's Copilot says and does.

### 7.1 Overview (landing page)
At-a-glance status: setup fee paid, how many seats are active out of how many added, and team call activity — total calls completed, which rep has made the most calls, and average call length. This is the admin's "is this thing working and is my team using it" check, so it leads with usage, not configuration.

### 7.2 Knowledge Base
The single most important admin surface, because **this is what the AI says on a live sales call instead of generic answers.** It has five areas:
- **Documents** — uploaded reference files (pricing sheets, playbooks, case studies).
- **FAQs** — structured question/answer pairs.
- **Knowledge Center** — named, freeform policy/process write-ups organized into categories the admin defines (e.g., "Refund Policy," "Objection Handling," "Escalation Procedure"). There's always a default catch-all category for anything that doesn't fit elsewhere, separate from any categories the admin creates themselves.
- **Text** — short freeform notes that don't need a title or category (a quick reminder, a talking point).
- **Links** — reference URLs and contact info (website, email, phone, social), with website links automatically scanned for relevant content.
- Every individual entry across all five areas can be toggled on/off without being deleted — admins should be able to temporarily silence something without losing it.

### 7.3 Team
The admin adds reps by name and email; each gets an invite code. A rep's desktop access only activates once the admin pays their $79/mo seat — the admin can add as many reps as they want up front and activate seats on their own schedule as the team grows, without being forced to pay for everyone on day one. **Seat activation is admin-only for MVP** — there is no self-serve path for a rep to activate or expense their own seat. **Access control is also admin-only for MVP**: the admin has full access to every area of the dashboard (Knowledge Base, Team, Call History, Billing, Integrations). Role-based permissions (e.g., a rep-level login with restricted access) are a deliberate phase-2 scope cut, not an oversight.

### 7.4 Call History
Every completed sales call from every rep on the team, with the full transcript available to review. This is both a coaching tool (review how a rep handled a call) and a trust-building tool (proof the product is actually being used, and used well).

### 7.5 Billing & Subscription
What's been paid (the one-time setup fee) and what's being paid monthly (sum of active seats × $79), broken down per person so the admin can see exactly what each teammate costs and reconcile it against who's actually using the product.

### 7.6 Integrations
Connections to the tools the sales team already lives in — CRM (Salesforce, HubSpot, Pipedrive), calling/meeting tools (Zoom, Google Meet), and team communication (Slack, Google Calendar) — so call data and Copilot usage can flow into the systems of record the team already trusts, rather than living only inside this dashboard.

### 7.7 Settings
Admin profile and account security.

---

## 8. Monetization Summary

| | Regular | Exam | Enterprise |
|---|---|---|---|
| **Buyer** | Individual | Individual | Company admin |
| **Model** | Subscription | One-time | Setup fee + per-seat subscription |
| **Price** | $49–$79/mo | $500 | $5,000 + $79/seat/mo |
| **What scales the price** | Plan tier (more credits/use cases) | Nothing — flat | Number of activated seats |
| **Who can downgrade/cancel** | The individual, anytime | N/A (one-time) | The admin, per seat |

### How a credit is consumed (Regular Copilot)
Credits are tied to session length, not session count: a session **under 1 hour costs 1 credit**, and each additional full hour adds another credit (a session that runs 2 hours costs 2 credits, 3 hours costs 3 credits, and so on). The user should be **notified when they have less than 1 hour of credit remaining**, so a long session doesn't quietly run out mid-conversation — credit balance needs to be visible going into a session, not just discovered after.

---

## 9. Non-Functional Requirements

- **Undetectability is non-negotiable.** The Copilot window must never appear in a screen share, a screen recording, or any captured footage of the call, on any of the platforms it's used alongside (video conferencing apps, proctoring software for exams, etc.). This is the entire value proposition — a visible Copilot is a liability, not a feature.
- **Response latency.** Target ~2 seconds from end-of-question to start-of-answer on the live canvas; near-instant on the screenshot canvas once a capture is triggered.
- **Speaker attribution accuracy.** Misattributing a line to the wrong speaker, or failing to separate two distinct voices, actively damages trust in the product — this needs a high accuracy bar before multi-speaker support is considered reliable enough to rely on in a real interview or call.
- **Data handling.** Live audio, transcripts, screenshots, and enterprise knowledge base content are all sensitive by nature (job interviews, exams, client conversations, proprietary sales material). **Retention is set at up to 90 days** for call transcripts and recordings. Formal compliance work (SOC 2, recording-consent disclosures, region-specific data residency) is explicitly deferred past MVP — revisit once enterprise demand justifies the investment, not before.
- **Seat-gating integrity.** An enterprise rep without an activated seat must not be able to access the desktop canvas, even with a valid invite code — billing correctness depends on this being airtight.

---

## 10. Success Metrics

- **Activation:** % of purchasers who complete at least one full session within 7 days of buying.
- **Reliability:** % of sessions where a response was generated within the target latency window.
- **Speaker accuracy:** % of multi-speaker sessions where attendee voices were correctly distinguished and labeled (measured against session recordings/feedback, not self-reported).
- **Enterprise seat utilization:** % of admin-activated seats with at least one completed call in the last 30 days — a proxy for whether the admin is getting their money's worth and likely to keep paying.
- **Enterprise knowledge base adoption:** % of accounts with at least one populated Knowledge Base category — an empty knowledge base means the AI is falling back to generic answers, undermining the entire enterprise pitch.
- **Retention:** Regular subscription renewal rate; Enterprise seat count trend (growing vs. shrinking) per account over time.
- **Conversion:** Landing page → checkout completion rate, tracked separately per product (Regular / Exam / Enterprise), since they have different buyers and different friction points.

---

## 11. Out of Scope (this PRD)

- Real payment processing / subscription billing infrastructure.
- CRM-level two-way sync logic for Integrations (beyond "data flows in") — depth of each integration is its own scope.
- Mobile Copilot — covered separately in the mobile app PRD; this document is desktop-only.
- Resume building, ATS scoring, or any other Lightforth web-app feature — this PRD is the Copilot product only.
- Specific underlying AI/transcription vendor selection — a technical decision for the implementing team, not a product requirement here.

---

## 12. Decisions (resolved from the prior open questions)

1. **Audio source for multi-speaker detection — resolved.** Captured from the other party's side of the call (the interviewer, the meeting attendees, the customer/prospect), not the user's own microphone. The assistant must distinguish between multiple distinct voices on that side whenever more than one person is present. See §5.3.
2. **Enterprise data retention — resolved.** Up to 90 days for call transcripts and recordings. Role-based access control is explicitly deferred to a later phase — for MVP, the admin has unrestricted access to every area of their own dashboard, with no separate permission tiers yet. See §7.3 and §9.
3. **Compliance — resolved (deferred).** SOC 2, consent disclosures, and data-residency guarantees are out of scope for MVP. This is revisited once real enterprise demand makes it necessary, not before.
4. **Self-serve seat activation — resolved.** No self-serve. The admin always activates (and pays for) each rep's seat. See §7.3.
5. **Exam proctoring conflicts — intentionally not specified here.** This PRD does not document "defeating anti-cheating/proctoring software" as a product requirement. Helping a candidate evade the controls a certification or licensing body uses to verify a test-taker's own knowledge is a materially different kind of harm than the interview/meeting "stealth" framing used elsewhere in this document (§5.5) — it's enabling fraud against whoever issues the credential and against anyone who later relies on it. If Exam Copilot's $500 price point is meant to be justified specifically by defeating proctoring, that's a product direction worth a direct conversation with whoever owns this line, not something to quietly formalize in a requirements doc. Everything else about Exam Copilot already documented in §6 (one-time pricing, dedicated landing/checkout, screenshot-based Q&A) stands as-is.
6. **Credit/usage limits — resolved.** See "How a credit is consumed" under §8: under 1 hour = 1 credit, each additional full hour = 1 more credit, with a low-balance notification before the user's last hour of credit runs out.
