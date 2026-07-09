# Lightforth — Sales Copilot Knowledge Base

This folder is the content source for Lightforth's own **Sales Copilot Knowledge Base** — the material an internal Lightforth sales rep leans on while closing customers on the **real Lightforth Copilot product**, live on a call.

This is not a knowledge base about some other SaaS tool. It is Lightforth selling Lightforth.

## Who the rep is talking to

1. **Individual job seekers** buying Pro or Premium for their own job search.
2. **Coaches & organizations** (career coaches, bootcamps, university career centers, outplacement firms) buying a bundle of seats for the job seekers they support.

## Structure

```
knowledge/
├── documents/          # Playbook, pricing, competitive battlecards, case studies, security, onboarding
├── faqs/               # Common questions and answers, by product area
├── knowledge-center/   # Refund policy, objection handling, escalation, discounts, onboarding process
├── text/               # Talk tracks, rep reminders, quick notes
└── links/              # Website, email, phone, social references
```

## What's actually being sold

**Product:** Lightforth — Resume Builder, Auto-Apply, Interview Prep, and Interview Copilot (the live, real-time coaching desktop app for Interview / Coding / Meeting).

**Plans** (source of truth: `src/pages/desktopCopilot/plans.ts`):
| Plan | Price | Credits | Unlocks |
|---|---|---|---|
| Pro | $49/mo ($39/mo billed annually) | 50/mo | Interview + Coding Copilot |
| Premium | $79/mo ($63/mo billed annually) | 100/mo | Interview + Coding + Meeting Copilot |

Resume Builder, Auto-Apply, and Interview Prep are available on the core Lightforth account (freemium, with Pro/Premium raising usage limits); the live desktop Copilot (Interview/Coding/Meeting) is what Pro and Premium specifically unlock.

## Usage

Upload these files into the Sales Copilot's Knowledge Base (`/sales/dashboard/knowledge-base`). Each file is written to be pasted in as-is — a document, an FAQ, a knowledge-center category, or freeform text, matching the tab it lives under here.

---

**Client:** Lightforth
**Product:** AI-Powered Career Platform (Resume Builder, Auto-Apply, Interview Prep, Interview Copilot)
**Market:** United States, individual consumers + career-services organizations
**Last Updated:** July 2026
