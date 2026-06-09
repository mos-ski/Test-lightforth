# Agents Module — Product Requirements Document

**Product:** Lightforth Career Specialist  
**Module:** Agents Tab  
**Status:** v1.0 — Live  
**Owner:** Lightforth Product  
**Last updated:** 2026-06-09

---

## Overview

The Agents Module is a real-time monitoring interface inside the Career Specialist dashboard. It allows Student Success Managers (SSMs) to observe the AI pipeline working on behalf of each student — from job discovery through application submission — without needing to manually intervene.

The module lives as the default tab on the Student Profile page at `/career-specialist/students/:id`.

---

## Problem Statement

Student Success Managers have no visibility into what the AI agents are doing on behalf of their students. Without a monitoring surface, SSMs cannot:

- Confirm that agents are actively running for a student
- Understand why certain jobs were rejected or prioritised
- Know when a resume was tailored or an application was submitted
- Intervene or escalate if the pipeline stalls

---

## Goals

1. Give SSMs real-time visibility into all four AI agents running for each student
2. Surface enough context per action that SSMs understand the *why*, not just the *what*
3. Keep the interface view-only — SSMs monitor, they do not control
4. Match Lightforth's design system so the module feels native to the product

---

## Non-Goals

- SSMs cannot pause, restart, or configure agents from this screen
- The module does not replace the Applications tab (detailed application records live there)
- No backend integration in v1 — all data is simulated

---

## User

**Primary:** Student Success Managers (SSMs)  
Student-facing staff who manage a portfolio of students enrolled in the Lightforth auto-apply programme. They check this screen to stay informed and to prepare for student check-in calls.

---

## The Four Agents

| Agent | Role | Trigger |
|---|---|---|
| **Scout** | Scans job boards (LinkedIn, Greenhouse, Workday, Lever, Indeed) for roles matching the student's profile | Always running |
| **Filter** | Scores each job Scout finds against the student's profile. Passes roles ≥85% match, rejects the rest | Triggered by Scout |
| **Tailor** | Rewrites the student's resume for each passed role. Runs ATS simulation and generates a cover letter | Triggered by Filter |
| **Driver** | Submits the tailored application to the employer's ATS or application portal | Triggered by Tailor |

---

## UI Sections

### 1. Stats Summary

Four stat cards in a grid showing running totals for the current session:

| Stat | Definition |
|---|---|
| **Found** | Total unique job postings discovered by Scout |
| **Matched** | Jobs that passed Filter's ≥85% threshold |
| **Tailored** | Resumes successfully tailored by Tailor |
| **Applied** | Applications successfully submitted by Driver |

### 2. Agent Status Cards

One card per agent showing:

- Agent name
- Current status badge: `running` (green) / `working` (amber) / `idle` (grey)
- One-line description of the current task

### 3. Live Activity Feed

A vertical timeline of agent events, updating every ~4 seconds. Each event includes:

- **Agent icon** — unique icon per agent (Scout: Search, Filter: Filter, Tailor: Scissors, Driver: Send)
- **Agent name** — coloured by hierarchy (Scout full-weight, downstream agents muted) on the All tab
- **Timestamp**
- **Message** — what the agent did, with enough context to understand the decision
- **Thought** *(italic)* — the agent's internal reasoning (e.g. scoring weights, keyword matching logic)
- **Links** *(blue text)* — clickable references to jobs, tailored resumes, cover letters, and submitted applications

#### Tab Filtering

The feed has five tabs: **All / Scout / Filter / Tailor / Driver**

- **All tab**: Scout events sit at root level; Filter, Tailor, Driver events are indented beneath them to show pipeline hierarchy. Downstream agents render in muted grey text.
- **Per-agent tabs**: All events for that agent render at full weight with no indentation — flat view.

The feed auto-scrolls to the latest event as new items arrive.

---

## Design Principles

- **White/light theme** — matches Lightforth's existing design system (`#eef4ff` background, white cards, `border-border` borders)
- **Instrument Sans** — consistent with the rest of the product
- **Minimal** — no decorative chrome; typography and hierarchy do the work
- **Information density** — each event carries enough context to be useful on its own

---

## Technical Notes

- **Route:** `/career-specialist/students/:id` (Agents tab is default active)
- **Data:** Mock real-time simulation via `useAgentSession(studentId)` hook — `setInterval` fires every 4 seconds, cycling through 12 pre-scripted tick steps
- **State:** Fully client-side; no backend dependency in v1
- **Components:**
  - `AgentsTab` — orchestrator
  - `AgentStatsSummary` — stats grid
  - `AgentStatusCards` — agent cards
  - `AgentFeed` — tabbed timeline feed
  - `useAgentSession` — data hook

---

## v2 Considerations

- Connect to real agent event stream (WebSocket or polling)
- Allow SSMs to add notes or flags to individual events
- Show per-student session history (previous runs, not just current)
- Add application status tracking (interview invited, rejected, ghosted)
- Export feed as a PDF summary for student check-in calls
