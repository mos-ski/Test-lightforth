# Closer OS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Closer OS — a standalone, fully-simulated sales product forked from the existing Enterprise Sales Copilot — implementing all 7 PRD money features end-to-end under `/closer-os/*`.

**Architecture:** New, isolated file tree at `src/pages/closerOS/**`. A single new localStorage-backed mock store (`closerOrgStore.ts`) holds all org/deal/plan/ledger/prospect/ghost/risk data. The marketing→checkout→download funnel mirrors the existing Enterprise pattern (reusing the generic `CheckoutFlow` component only). The closer's live-call app and the owner's admin dashboard are new components that borrow visual patterns (MacWindow chrome, `.lf-panel`/`.lf-table` CSS) but do not import from `src/pages/sales/*` or `src/pages/desktopCopilot/*` — full duplication, per the approved design spec.

**Tech Stack:** React 18 + TypeScript, React Router v6, Tailwind (existing `.lf-*` utility classes), lucide-react icons, sonner for toasts, Vitest + Testing Library for tests, localStorage for all mock persistence.

## Global Constraints

- Spec of record: `docs/superpowers/specs/2026-07-08-closer-os-design.md` — every task below implements a section of it.
- Fully simulated: no real Stripe/NMI/PayPal/Twilio/Slack/voice-AI network calls anywhere in this plan.
- Route namespace: everything under `/closer-os/*`.
- Visual identity: emerald/money-green accent (`#10b981` accent, `#052e14`/`#052e1f`-family dark backgrounds), distinct from the existing navy/teal (`#08285c`/teal-400) Enterprise product.
- No file imports across product boundaries: Closer OS files must not import from `src/pages/sales/*` or `src/pages/desktopCopilot/*`, except the genuinely generic, already-multi-product `CheckoutFlow` component (`src/pages/marketing/checkout/CheckoutFlow.tsx`) and global UI primitives (`@/components/ui/*`, `@/lib/utils`, `@/components/shared/LightforthLogo`).
- Every new store mutation that represents a "money-moving action" (send link, retry, decline-rescue offered, rescue join, renewal deck generated) must append an `AuditEntry`.
- Test convention: one `.test.ts`/`.test.tsx` per new file, Vitest + Testing Library, `localStorage.clear()` in `beforeEach` for any store-touching test — matches `src/pages/sales/mockOrg.test.ts` and `src/pages/sales/Overview.test.tsx`.
- CSS: reuse existing utility classes `.lf-panel`, `.lf-input`, `.lf-tabs`, `.lf-tab`, `.lf-tab-active`, `.lf-table-wrap`, `.lf-table`, `.lf-table-head`, `.lf-table-th`, `.lf-table-row`, `.lf-table-cell`, `.lf-label`, `.lf-section-title` (all already defined in `src/index.css`) instead of inventing new ones.

---

## Task 1: `closerOrgStore.ts` — data model and mock persistence

**Files:**
- Create: `src/pages/closerOS/closerOrgStore.ts`
- Test: `src/pages/closerOS/closerOrgStore.test.ts`

**Interfaces:**
- Consumes: nothing (foundation file).
- Produces: all types and functions below, imported by every other Closer OS file that touches org data:
  - Types: `CloserMember`, `PriceOption`, `Deal`, `Installment`, `PaymentPlan`, `LedgerEntry`, `ProspectCard`, `GhostPersona`, `GhostSession`, `RescueLog`, `LiveCallRiskEntry`, `SlackDigestConfig`, `CallRecord`, `AuditEntry`, `CloserOrg`
  - Functions: `getOrgByAdminEmail(adminEmail): CloserOrg | null`, `findMemberByEmail(email): { adminEmail: string; org: CloserOrg; member: CloserMember } | null`, `createOrg(adminEmail, org): void`, `updateOrg(adminEmail, updater): CloserOrg | null`, `addMember(adminEmail, { name, email }): CloserMember | null`, `markMemberSeatPaid(adminEmail, memberId): void`, `emailDomain(email): string`, `generateInviteCode(): string`, `recordDeal(adminEmail, deal): Deal`, `markDealPaid(adminEmail, dealId): void`, `markDealLost(adminEmail, dealId): void`, `addPaymentPlan(adminEmail, plan): PaymentPlan`, `recordInstallmentOutcome(adminEmail, planId, installmentIndex, status): void`, `addLedgerEntry(adminEmail, entry): LedgerEntry`, `addProspectCard(adminEmail, card): ProspectCard`, `addGhostPersonaFromCall(adminEmail, call): GhostPersona`, `recordGhostSession(adminEmail, session): GhostSession`, `addLiveCallRiskEntry(adminEmail, entry): LiveCallRiskEntry`, `resolveRescue(adminEmail, riskEntryId, rescueLog): void`, `updateSlackDigestConfig(adminEmail, config): void`, `recordCall(adminEmail, call): CallRecord`, `toggleIntegration(adminEmail, integrationId): void`, `setActiveAdminEmail(email): void`, `getActiveAdminEmail(): string | null`, `demoSeedCloserOrg(adminEmail, adminName, orgName): CloserOrg`, `addDealTypePriceOption(adminEmail, option): PriceOption`, `updateDealTypePriceOption(adminEmail, label, option): void`, `removeDealTypePriceOption(adminEmail, label): void`, `logAuditEvent(adminEmail, action, actor, detail): void`

- [ ] **Step 1: Write the failing test for store plumbing + demo seeding**

```ts
// src/pages/closerOS/closerOrgStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import {
  createOrg, getOrgByAdminEmail, updateOrg, addMember, markMemberSeatPaid,
  findMemberByEmail, demoSeedCloserOrg, recordInstallmentOutcome, addLedgerEntry,
  addGhostPersonaFromCall, resolveRescue, recordDeal, markDealPaid,
  addDealTypePriceOption, updateDealTypePriceOption, removeDealTypePriceOption, logAuditEvent,
} from './closerOrgStore'

describe('closerOrgStore', () => {
  beforeEach(() => localStorage.clear())

  it('creates and reads back an org by admin email, case-insensitively', () => {
    const org = demoSeedCloserOrg('Admin@Acme.com', 'Ada Admin', 'Acme Closers')
    createOrg('Admin@Acme.com', org)
    expect(getOrgByAdminEmail('admin@acme.com')?.orgName).toBe('Acme Closers')
  })

  it('demoSeedCloserOrg seeds every feature area with non-empty demo data', () => {
    const org = demoSeedCloserOrg('admin@acme.com', 'Ada Admin', 'Acme Closers')
    expect(org.deals.length).toBeGreaterThan(0)
    expect(org.paymentPlans.length).toBeGreaterThan(0)
    expect(org.ledgerEntries.length).toBeGreaterThan(0)
    expect(org.prospectCards.length).toBeGreaterThan(0)
    expect(org.ghostPersonas.length).toBeGreaterThan(0)
    expect(org.ghostSessions.length).toBeGreaterThan(0)
    expect(org.liveCallRiskEntries.length).toBeGreaterThan(0)
    expect(org.calls.length).toBeGreaterThan(0)
    expect(org.slackDigestConfig.channel).toMatch(/^#/)
    expect(org.paymentPlans.some(p => p.riskScore === 'red')).toBe(true)
    expect(org.paymentPlans.some(p => p.riskScore === 'green')).toBe(true)
  })

  it('addMember creates a member with an invite code and seatPaid false', () => {
    createOrg('admin@acme.com', demoSeedCloserOrg('admin@acme.com', 'Ada Admin', 'Acme Closers'))
    const member = addMember('admin@acme.com', { name: 'Jordan Lee', email: 'jordan@acme.com' })
    expect(member?.seatPaid).toBe(false)
    expect(member?.inviteCode).toMatch(/^[A-Z0-9]{6}$/)
    markMemberSeatPaid('admin@acme.com', member!.id)
    expect(getOrgByAdminEmail('admin@acme.com')?.members.find(m => m.id === member!.id)?.seatPaid).toBe(true)
  })

  it('findMemberByEmail locates a member across orgs', () => {
    createOrg('admin@acme.com', demoSeedCloserOrg('admin@acme.com', 'Ada Admin', 'Acme Closers'))
    addMember('admin@acme.com', { name: 'Jordan Lee', email: 'jordan@acme.com' })
    const found = findMemberByEmail('jordan@acme.com')
    expect(found?.adminEmail).toBe('admin@acme.com')
    expect(found?.member.name).toBe('Jordan Lee')
  })

  it('recordInstallmentOutcome flips risk to red on a failed installment and increments retryCount', () => {
    createOrg('admin@acme.com', demoSeedCloserOrg('admin@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('admin@acme.com')!
    const plan = org.paymentPlans[0]
    recordInstallmentOutcome('admin@acme.com', plan.id, 0, 'failed')
    const updated = getOrgByAdminEmail('admin@acme.com')!.paymentPlans.find(p => p.id === plan.id)!
    expect(updated.installments[0].status).toBe('failed')
    expect(updated.riskScore).toBe('red')
    expect(updated.retryCount).toBe(1)
  })

  it('addLedgerEntry and recordDeal + markDealPaid append an audit entry each', () => {
    createOrg('admin@acme.com', demoSeedCloserOrg('admin@acme.com', 'Ada Admin', 'Acme Closers'))
    const deal = recordDeal('admin@acme.com', {
      prospectName: 'Jamie Doe', dealType: 'Core Program',
      priceOption: { label: 'Core', pif: 12599, planInstallments: [1599, 3000, 4000, 4000] },
      status: 'open', closerName: 'Jordan Lee', callId: 'call-1', date: new Date().toISOString(),
    })
    markDealPaid('admin@acme.com', deal.id)
    addLedgerEntry('admin@acme.com', {
      dealId: deal.id, closerName: 'Jordan Lee', objection: 'Price is too high',
      counterUsed: 'Re-anchor on ROI', tag: 'saved', dollarValue: 12599, date: new Date().toISOString(),
    })
    const org = getOrgByAdminEmail('admin@acme.com')!
    expect(org.deals.find(d => d.id === deal.id)?.status).toBe('paid')
    expect(org.ledgerEntries).toHaveLength(1 + demoSeedCloserOrg('x', 'x', 'x').ledgerEntries.length - demoSeedCloserOrg('x', 'x', 'x').ledgerEntries.length) // sanity: at least the one we added
    expect(org.auditLog.length).toBeGreaterThanOrEqual(2)
  })

  it('addGhostPersonaFromCall builds a persona from a call record', () => {
    createOrg('admin@acme.com', demoSeedCloserOrg('admin@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('admin@acme.com')!
    const call = org.calls[0]
    const ghost = addGhostPersonaFromCall('admin@acme.com', call)
    expect(ghost.sourceCallId).toBe(call.id)
    expect(getOrgByAdminEmail('admin@acme.com')!.ghostPersonas.some(g => g.id === ghost.id)).toBe(true)
  })

  it('resolveRescue writes a rescueLog onto the matching risk entry', () => {
    createOrg('admin@acme.com', demoSeedCloserOrg('admin@acme.com', 'Ada Admin', 'Acme Closers'))
    const entry = getOrgByAdminEmail('admin@acme.com')!.liveCallRiskEntries[0]
    resolveRescue('admin@acme.com', entry.id, { managerJoinedAt: new Date().toISOString(), mode: 'whisper', outcome: 'saved', dollarsSaved: 8000 })
    const updated = getOrgByAdminEmail('admin@acme.com')!.liveCallRiskEntries.find(e => e.id === entry.id)!
    expect(updated.rescueLog?.outcome).toBe('saved')
  })

  it('adds, updates, and removes a deal-type price option', () => {
    createOrg('admin@acme.com', demoSeedCloserOrg('admin@acme.com', 'Ada Admin', 'Acme Closers'))
    addDealTypePriceOption('admin@acme.com', { label: 'Starter', pif: 5000, planInstallments: [1000, 2000, 2000] })
    expect(getOrgByAdminEmail('admin@acme.com')!.dealTypePriceOptions.some(o => o.label === 'Starter')).toBe(true)
    updateDealTypePriceOption('admin@acme.com', 'Starter', { label: 'Starter', pif: 5500, planInstallments: [1000, 2000, 2500] })
    expect(getOrgByAdminEmail('admin@acme.com')!.dealTypePriceOptions.find(o => o.label === 'Starter')?.pif).toBe(5500)
    removeDealTypePriceOption('admin@acme.com', 'Starter')
    expect(getOrgByAdminEmail('admin@acme.com')!.dealTypePriceOptions.some(o => o.label === 'Starter')).toBe(false)
  })

  it('logAuditEvent appends a standalone audit entry', () => {
    createOrg('admin@acme.com', demoSeedCloserOrg('admin@acme.com', 'Ada Admin', 'Acme Closers'))
    const before = getOrgByAdminEmail('admin@acme.com')!.auditLog.length
    logAuditEvent('admin@acme.com', 'renewal-deck-generated', 'Ada Admin', 'Q3 renewal deck')
    const after = getOrgByAdminEmail('admin@acme.com')!.auditLog
    expect(after.length).toBe(before + 1)
    expect(after[0].action).toBe('renewal-deck-generated')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/closerOrgStore.test.ts`
Expected: FAIL — `Cannot find module './closerOrgStore'`

- [ ] **Step 3: Write the implementation**

```ts
// src/pages/closerOS/closerOrgStore.ts
// Mock, localStorage-backed Closer OS org registry — fully separate from
// src/pages/sales/mockOrg.ts. Nothing here calls a real backend; every
// mutation is a local, simulated stand-in for the PRD's real (future) system.

export interface CloserMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
  inviteCode: string
  seatPaid: boolean
}

export interface PriceOption {
  label: string
  pif: number
  planInstallments: number[]
}

export interface Deal {
  id: string
  prospectName: string
  dealType: string
  priceOption: PriceOption
  status: 'open' | 'paid' | 'lost'
  closerName: string
  callId: string
  date: string
}

export interface Installment {
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'failed'
}

export interface PaymentPlan {
  id: string
  dealId: string
  buyerName: string
  totalAmount: number
  installments: Installment[]
  cardOnFile: { last4: string; expiresSoon: boolean }
  riskScore: 'green' | 'yellow' | 'red'
  retryCount: number
}

export interface LedgerEntry {
  id: string
  dealId: string
  closerName: string
  objection: string
  counterUsed: string
  tag: 'organic' | 'assisted' | 'saved'
  dollarValue: number
  date: string
}

export interface ProspectCard {
  id: string
  callId: string
  prospectName: string
  vslWatchPct: number
  rewatchedParts: string[]
  applicationAnswers: string[]
  emailOpens: number
  heatSignal: 'HOT' | 'WARM' | 'COLD'
  openingLines: string[]
}

export interface GhostPersona {
  id: string
  sourceCallId: string
  name: string
  objectionStyle: string
  tone: string
  stalls: string[]
}

export interface GhostSession {
  id: string
  ghostId: string
  closerName: string
  score: number
  objectionsHandled: number
  countersUsed: number
  closeAttempted: boolean
  paymentAsked: boolean
  date: string
}

export interface RescueLog {
  managerJoinedAt: string
  mode: 'listen' | 'whisper' | 'warm-join'
  outcome: 'saved' | 'lost'
  dollarsSaved: number
}

export interface LiveCallRiskEntry {
  id: string
  callId: string
  closerName: string
  prospectName: string
  dealValue: number
  riskLevel: 'green' | 'yellow' | 'red'
  dangerSignals: string[]
  rescueLog: RescueLog | null
}

export interface SlackDigestConfig {
  channel: string
  sendTime: string
  bigWinThreshold: number
}

export interface CallRecord {
  id: string
  closerName: string
  closerEmail: string
  date: string
  durationSeconds: number
  transcript: { speaker: string; text: string }[]
  outcome: 'won' | 'lost' | 'no-decision'
  leakReason: string | null
}

export interface AuditEntry {
  id: string
  action: string
  actor: string
  timestamp: string
  detail: string
}

export interface CloserOrg {
  orgName: string
  admin: { name: string; email: string }
  setupFeePaid: boolean
  members: CloserMember[]
  dealTypePriceOptions: PriceOption[]
  deals: Deal[]
  paymentPlans: PaymentPlan[]
  ledgerEntries: LedgerEntry[]
  prospectCards: ProspectCard[]
  ghostPersonas: GhostPersona[]
  ghostSessions: GhostSession[]
  liveCallRiskEntries: LiveCallRiskEntry[]
  slackDigestConfig: SlackDigestConfig
  calls: CallRecord[]
  connectedIntegrations: string[]
  auditLog: AuditEntry[]
}

const ORGS_KEY = 'closer-os-orgs'
const ACTIVE_ADMIN_KEY = 'closer-os-active-admin'

function readStore(): Record<string, CloserOrg> {
  try {
    const raw = localStorage.getItem(ORGS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, CloserOrg>) {
  try {
    localStorage.setItem(ORGS_KEY, JSON.stringify(store))
  } catch {
    // ignore — mock persistence only
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function generateInviteCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function emailDomain(email: string): string {
  return email.split('@')[1]?.trim().toLowerCase() ?? ''
}

export function getOrgByAdminEmail(adminEmail: string): CloserOrg | null {
  const store = readStore()
  return store[normalizeEmail(adminEmail)] ?? null
}

export function findMemberByEmail(email: string): { adminEmail: string; org: CloserOrg; member: CloserMember } | null {
  const store = readStore()
  const target = normalizeEmail(email)
  for (const [adminEmail, org] of Object.entries(store)) {
    const member = org.members.find(m => normalizeEmail(m.email) === target)
    if (member) return { adminEmail, org, member }
  }
  return null
}

export function createOrg(adminEmail: string, org: CloserOrg): void {
  const store = readStore()
  store[normalizeEmail(adminEmail)] = org
  writeStore(store)
}

export function updateOrg(adminEmail: string, updater: (org: CloserOrg) => CloserOrg): CloserOrg | null {
  const store = readStore()
  const key = normalizeEmail(adminEmail)
  const current = store[key]
  if (!current) return null
  const next = updater(current)
  store[key] = next
  writeStore(store)
  return next
}

function appendAudit(org: CloserOrg, action: string, actor: string, detail: string): CloserOrg {
  const entry: AuditEntry = { id: crypto.randomUUID(), action, actor, timestamp: new Date().toISOString(), detail }
  return { ...org, auditLog: [entry, ...org.auditLog] }
}

export function addMember(adminEmail: string, member: { name: string; email: string }): CloserMember | null {
  const newMember: CloserMember = {
    id: crypto.randomUUID(), name: member.name, email: member.email,
    role: 'member', inviteCode: generateInviteCode(), seatPaid: false,
  }
  const updated = updateOrg(adminEmail, org => {
    const target = normalizeEmail(member.email)
    const exists = org.members.some(m => normalizeEmail(m.email) === target)
    const members = exists
      ? org.members.map(m => (normalizeEmail(m.email) === target ? newMember : m))
      : [...org.members, newMember]
    return appendAudit({ ...org, members }, 'member-added', adminEmail, `Added ${member.name}`)
  })
  return updated ? newMember : null
}
```

**Fixed during Task 6 (upsert, not append):** the original version above unconditionally appended, which meant a real invite to an email colliding with one of `demoSeedCloserOrg`'s three always-seeded demo reps (`jordan@<domain>`, `sam@<domain>`, `taylor@<domain>`) created a shadow duplicate — `findMemberByEmail` returns the *first* array match, so the stale seeded record's invite code kept winning over the real one. `addMember` now upserts by normalized email instead. Note this resets `seatPaid`/`role`/`id` on any collision (including a legitimate re-invite of an already-activated member) — acceptable for this prototype since there's no "resend invite" caller yet, but flag it if a future task adds one.

```ts
export function markMemberSeatPaid(adminEmail: string, memberId: string): void {
  updateOrg(adminEmail, org => ({ ...org, members: org.members.map(m => (m.id === memberId ? { ...m, seatPaid: true } : m)) }))
}

export function recordDeal(adminEmail: string, deal: Omit<Deal, 'id'>): Deal {
  const item: Deal = { id: crypto.randomUUID(), ...deal }
  updateOrg(adminEmail, org => appendAudit({ ...org, deals: [item, ...org.deals] }, 'deal-recorded', deal.closerName, `${deal.prospectName} — ${deal.dealType}`))
  return item
}

export function markDealPaid(adminEmail: string, dealId: string): void {
  updateOrg(adminEmail, org => appendAudit(
    { ...org, deals: org.deals.map(d => (d.id === dealId ? { ...d, status: 'paid' as const } : d)) },
    'deal-paid', adminEmail, `Deal ${dealId} marked paid`,
  ))
}

export function markDealLost(adminEmail: string, dealId: string): void {
  updateOrg(adminEmail, org => ({ ...org, deals: org.deals.map(d => (d.id === dealId ? { ...d, status: 'lost' as const } : d)) }))
}

export function addPaymentPlan(adminEmail: string, plan: Omit<PaymentPlan, 'id'>): PaymentPlan {
  const item: PaymentPlan = { id: crypto.randomUUID(), ...plan }
  updateOrg(adminEmail, org => appendAudit({ ...org, paymentPlans: [item, ...org.paymentPlans] }, 'plan-created', adminEmail, `Plan for ${plan.buyerName}`))
  return item
}

function computeRisk(installments: Installment[], cardOnFile: { expiresSoon: boolean }): 'green' | 'yellow' | 'red' {
  if (installments.some(i => i.status === 'failed')) return 'red'
  if (cardOnFile.expiresSoon) return 'yellow'
  return 'green'
}

export function recordInstallmentOutcome(adminEmail: string, planId: string, installmentIndex: number, status: Installment['status']): void {
  updateOrg(adminEmail, org => appendAudit({
    ...org,
    paymentPlans: org.paymentPlans.map(p => {
      if (p.id !== planId) return p
      const installments = p.installments.map((inst, i) => (i === installmentIndex ? { ...inst, status } : inst))
      return {
        ...p,
        installments,
        riskScore: computeRisk(installments, p.cardOnFile),
        retryCount: status === 'failed' ? p.retryCount + 1 : p.retryCount,
      }
    }),
  }, 'installment-outcome', adminEmail, `Plan ${planId} installment ${installmentIndex} -> ${status}`))
}

export function addLedgerEntry(adminEmail: string, entry: Omit<LedgerEntry, 'id'>): LedgerEntry {
  const item: LedgerEntry = { id: crypto.randomUUID(), ...entry }
  updateOrg(adminEmail, org => appendAudit({ ...org, ledgerEntries: [item, ...org.ledgerEntries] }, 'ledger-entry', entry.closerName, `${entry.tag} — $${entry.dollarValue}`))
  return item
}

export function addProspectCard(adminEmail: string, card: Omit<ProspectCard, 'id'>): ProspectCard {
  const item: ProspectCard = { id: crypto.randomUUID(), ...card }
  updateOrg(adminEmail, org => ({ ...org, prospectCards: [item, ...org.prospectCards] }))
  return item
}

export function addGhostPersonaFromCall(adminEmail: string, call: CallRecord): GhostPersona {
  const item: GhostPersona = {
    id: crypto.randomUUID(),
    sourceCallId: call.id,
    name: `Ghost of ${call.leakReason ?? 'Lost Call'} (${new Date(call.date).toLocaleDateString()})`,
    objectionStyle: call.leakReason ?? 'Generic stall',
    tone: 'Skeptical, price-sensitive',
    stalls: call.transcript.filter(t => t.speaker !== call.closerName).map(t => t.text).slice(0, 3),
  }
  updateOrg(adminEmail, org => appendAudit({ ...org, ghostPersonas: [item, ...org.ghostPersonas] }, 'ghost-created', adminEmail, `Ghost built from call ${call.id}`))
  return item
}

export function recordGhostSession(adminEmail: string, session: Omit<GhostSession, 'id'>): GhostSession {
  const item: GhostSession = { id: crypto.randomUUID(), ...session }
  updateOrg(adminEmail, org => ({ ...org, ghostSessions: [item, ...org.ghostSessions] }))
  return item
}

export function addLiveCallRiskEntry(adminEmail: string, entry: Omit<LiveCallRiskEntry, 'id'>): LiveCallRiskEntry {
  const item: LiveCallRiskEntry = { id: crypto.randomUUID(), ...entry }
  updateOrg(adminEmail, org => ({ ...org, liveCallRiskEntries: [item, ...org.liveCallRiskEntries] }))
  return item
}

export function resolveRescue(adminEmail: string, riskEntryId: string, rescueLog: RescueLog): void {
  updateOrg(adminEmail, org => appendAudit({
    ...org,
    liveCallRiskEntries: org.liveCallRiskEntries.map(e => (e.id === riskEntryId ? { ...e, rescueLog } : e)),
  }, 'rescue-resolved', adminEmail, `Risk entry ${riskEntryId} — ${rescueLog.outcome}`))
}

export function updateSlackDigestConfig(adminEmail: string, config: SlackDigestConfig): void {
  updateOrg(adminEmail, org => ({ ...org, slackDigestConfig: config }))
}

export function recordCall(adminEmail: string, call: Omit<CallRecord, 'id'>): CallRecord {
  const item: CallRecord = { id: crypto.randomUUID(), ...call }
  updateOrg(adminEmail, org => ({ ...org, calls: [item, ...org.calls] }))
  return item
}

export function toggleIntegration(adminEmail: string, integrationId: string): void {
  updateOrg(adminEmail, org => {
    const connected = org.connectedIntegrations.includes(integrationId)
    return {
      ...org,
      connectedIntegrations: connected
        ? org.connectedIntegrations.filter(id => id !== integrationId)
        : [...org.connectedIntegrations, integrationId],
    }
  })
}

export function addDealTypePriceOption(adminEmail: string, option: PriceOption): PriceOption {
  updateOrg(adminEmail, org => appendAudit({ ...org, dealTypePriceOptions: [...org.dealTypePriceOptions, option] }, 'price-option-added', adminEmail, option.label))
  return option
}

export function updateDealTypePriceOption(adminEmail: string, label: string, option: PriceOption): void {
  updateOrg(adminEmail, org => ({ ...org, dealTypePriceOptions: org.dealTypePriceOptions.map(o => (o.label === label ? option : o)) }))
}

export function removeDealTypePriceOption(adminEmail: string, label: string): void {
  updateOrg(adminEmail, org => ({ ...org, dealTypePriceOptions: org.dealTypePriceOptions.filter(o => o.label !== label) }))
}

/** Generic audit-log write for actions (e.g. renewal deck generation) that don't otherwise mutate org data. */
export function logAuditEvent(adminEmail: string, action: string, actor: string, detail: string): void {
  updateOrg(adminEmail, org => appendAudit(org, action, actor, detail))
}

export function setActiveAdminEmail(email: string): void {
  try {
    localStorage.setItem(ACTIVE_ADMIN_KEY, normalizeEmail(email))
  } catch {
    // ignore
  }
}

export function getActiveAdminEmail(): string | null {
  try {
    return localStorage.getItem(ACTIVE_ADMIN_KEY)
  } catch {
    return null
  }
}

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()
}

function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString()
}

/** A fully populated demo org — used at signup so the dashboard never shows empty states. */
export function demoSeedCloserOrg(adminEmail: string, adminName: string, orgName: string): CloserOrg {
  const domain = emailDomain(adminEmail)
  const reps = [
    { name: 'Jordan Lee', local: 'jordan' },
    { name: 'Sam Patel', local: 'sam' },
    { name: 'Taylor Brooks', local: 'taylor' },
  ]
  const members: CloserMember[] = [
    { id: crypto.randomUUID(), name: adminName, email: adminEmail, role: 'admin', inviteCode: generateInviteCode(), seatPaid: true },
    ...reps.map(r => ({ id: crypto.randomUUID(), name: r.name, email: `${r.local}@${domain}`, role: 'member' as const, inviteCode: generateInviteCode(), seatPaid: true })),
  ]

  const dealTypePriceOptions: PriceOption[] = [
    { label: 'Core Program', pif: 12599, planInstallments: [1599, 3000, 4000, 4000] },
    { label: 'Advanced Program', pif: 18599, planInstallments: [2599, 4000, 6000, 6000] },
    { label: 'Elite Program', pif: 25599, planInstallments: [3599, 6000, 8000, 8000] },
  ]

  const deals: Deal[] = [
    { id: crypto.randomUUID(), prospectName: 'Jamie Whitfield', dealType: 'Core Program', priceOption: dealTypePriceOptions[0], status: 'paid', closerName: 'Jordan Lee', callId: 'seed-call-1', date: daysAgo(1) },
    { id: crypto.randomUUID(), prospectName: 'Morgan Reyes', dealType: 'Advanced Program', priceOption: dealTypePriceOptions[1], status: 'paid', closerName: 'Sam Patel', callId: 'seed-call-2', date: daysAgo(3) },
    { id: crypto.randomUUID(), prospectName: 'Casey Nguyen', dealType: 'Elite Program', priceOption: dealTypePriceOptions[2], status: 'open', closerName: 'Taylor Brooks', callId: 'seed-call-3', date: daysAgo(0) },
    // Gives the seeded lost call (below) a matching deal, so "money leaked" joins (org.deals.find(d => d.callId === call.id)) resolve to a real dollar value instead of silently computing $0.
    { id: crypto.randomUUID(), prospectName: 'Drew Sanders', dealType: 'Core Program', priceOption: dealTypePriceOptions[0], status: 'lost', closerName: 'Taylor Brooks', callId: 'seed-call-lost-1', date: daysAgo(2) },
  ]

  const paymentPlans: PaymentPlan[] = [
    {
      id: crypto.randomUUID(), dealId: deals[0].id, buyerName: 'Jamie Whitfield', totalAmount: 12599,
      installments: [
        { amount: 1599, dueDate: daysAgo(1), status: 'paid' },
        { amount: 3000, dueDate: daysFromNow(13), status: 'pending' },
        { amount: 4000, dueDate: daysFromNow(30), status: 'pending' },
        { amount: 4000, dueDate: daysFromNow(60), status: 'pending' },
      ],
      cardOnFile: { last4: '4242', expiresSoon: false }, riskScore: 'green', retryCount: 0,
    },
    {
      id: crypto.randomUUID(), dealId: deals[1].id, buyerName: 'Morgan Reyes', totalAmount: 18599,
      installments: [
        { amount: 2599, dueDate: daysAgo(3), status: 'paid' },
        { amount: 4000, dueDate: daysAgo(0), status: 'failed' },
        { amount: 6000, dueDate: daysFromNow(28), status: 'pending' },
        { amount: 6000, dueDate: daysFromNow(58), status: 'pending' },
      ],
      cardOnFile: { last4: '9981', expiresSoon: false }, riskScore: 'red', retryCount: 1,
    },
    {
      id: crypto.randomUUID(), dealId: deals[0].id, buyerName: 'Devon Marsh', totalAmount: 12599,
      installments: [
        { amount: 1599, dueDate: daysAgo(10), status: 'paid' },
        { amount: 3000, dueDate: daysFromNow(4), status: 'pending' },
        { amount: 4000, dueDate: daysFromNow(34), status: 'pending' },
        { amount: 4000, dueDate: daysFromNow(64), status: 'pending' },
      ],
      cardOnFile: { last4: '1187', expiresSoon: true }, riskScore: 'yellow', retryCount: 0,
    },
  ]

  const ledgerEntries: LedgerEntry[] = [
    { id: crypto.randomUUID(), dealId: deals[0].id, closerName: 'Jordan Lee', objection: 'Price is too high', counterUsed: 'Re-anchor on ROI + phased start', tag: 'saved', dollarValue: 12599, date: daysAgo(1) },
    { id: crypto.randomUUID(), dealId: deals[1].id, closerName: 'Sam Patel', objection: 'Need to check with a partner', counterUsed: 'Offered a 3-way call same week', tag: 'assisted', dollarValue: 18599, date: daysAgo(3) },
    { id: crypto.randomUUID(), dealId: deals[0].id, closerName: 'Taylor Brooks', objection: '', counterUsed: '', tag: 'organic', dollarValue: 12599, date: daysAgo(6) },
  ]

  const prospectCards: ProspectCard[] = [
    { id: crypto.randomUUID(), callId: 'seed-call-3', prospectName: 'Casey Nguyen', vslWatchPct: 92, rewatchedParts: ['Guarantee section', 'Pricing breakdown'], applicationAnswers: ['I need a career change fast', 'Budget is flexible if ROI is clear'], emailOpens: 3, heatSignal: 'HOT', openingLines: ["You mentioned needing a fast career change — let's talk timeline first.", 'I saw you rewatched the guarantee section twice — want me to walk through it again?', "Since budget flexibility depends on ROI, let's start there."] },
    { id: crypto.randomUUID(), callId: 'seed-call-4', prospectName: 'Riley Chen', vslWatchPct: 61, rewatchedParts: ['Pricing breakdown'], applicationAnswers: ['Comparing a few options right now'], emailOpens: 1, heatSignal: 'WARM', openingLines: ['Since you\'re comparing options, want a quick side-by-side?', 'What matters most in your decision — price, support, or speed?'] },
    { id: crypto.randomUUID(), callId: 'seed-call-5', prospectName: 'Avery Stone', vslWatchPct: 24, rewatchedParts: [], applicationAnswers: [], emailOpens: 0, heatSignal: 'COLD', openingLines: ['Thanks for booking — what made you take a look at us today?'] },
  ]

  const calls: CallRecord[] = [
    { id: 'seed-call-1', closerName: 'Jordan Lee', closerEmail: `jordan@${domain}`, date: daysAgo(1), durationSeconds: 640, transcript: [{ speaker: 'Jamie Whitfield', text: 'The price is a stretch this quarter.' }, { speaker: 'Jordan Lee', text: 'Totally hear you — let\'s look at the ROI versus staying stuck.' }], outcome: 'won', leakReason: null },
    { id: 'seed-call-2', closerName: 'Sam Patel', closerEmail: `sam@${domain}`, date: daysAgo(3), durationSeconds: 820, transcript: [{ speaker: 'Morgan Reyes', text: 'I need to check with my business partner first.' }, { speaker: 'Sam Patel', text: 'Makes sense — want to loop them in on a quick call this week?' }], outcome: 'won', leakReason: null },
    { id: 'seed-call-lost-1', closerName: 'Taylor Brooks', closerEmail: `taylor@${domain}`, date: daysAgo(2), durationSeconds: 410, transcript: [{ speaker: 'Prospect', text: 'Honestly this feels too expensive for what it is.' }, { speaker: 'Taylor Brooks', text: 'I get that — what budget were you expecting?' }, { speaker: 'Prospect', text: "I think I'll pass for now." }], outcome: 'lost', leakReason: 'Price objection' },
  ]

  const ghostSourceCall = calls.find(c => c.outcome === 'lost')!
  const ghostPersonas: GhostPersona[] = [
    { id: crypto.randomUUID(), sourceCallId: ghostSourceCall.id, name: `Ghost of ${ghostSourceCall.leakReason} (${new Date(ghostSourceCall.date).toLocaleDateString()})`, objectionStyle: 'Price objection, non-committal', tone: 'Polite but closed off', stalls: ['Honestly this feels too expensive for what it is.', "I think I'll pass for now."] },
    { id: crypto.randomUUID(), sourceCallId: 'seed-call-2', name: 'Ghost of Partner Stall (recurring pattern)', objectionStyle: 'Defers to an absent decision-maker', tone: 'Agreeable but non-committal', stalls: ['I need to check with my business partner first.', "Let me get back to you next week."] },
  ]

  const ghostSessions: GhostSession[] = [
    { id: crypto.randomUUID(), ghostId: ghostPersonas[0].id, closerName: 'Taylor Brooks', score: 74, objectionsHandled: 2, countersUsed: 1, closeAttempted: true, paymentAsked: true, date: daysAgo(1) },
    { id: crypto.randomUUID(), ghostId: ghostPersonas[1].id, closerName: 'Sam Patel', score: 88, objectionsHandled: 3, countersUsed: 3, closeAttempted: true, paymentAsked: true, date: daysAgo(2) },
  ]

  const liveCallRiskEntries: LiveCallRiskEntry[] = [
    { id: crypto.randomUUID(), callId: 'seed-call-live-1', closerName: 'Taylor Brooks', prospectName: 'Riley Chen', dealValue: 18599, riskLevel: 'red', dangerSignals: ['Prospect talking less', 'Two failed close attempts'], rescueLog: null },
    { id: crypto.randomUUID(), callId: 'seed-call-live-2', closerName: 'Sam Patel', prospectName: 'Devon Marsh', dealValue: 12599, riskLevel: 'yellow', dangerSignals: ['Long silences'], rescueLog: null },
    { id: crypto.randomUUID(), callId: 'seed-call-live-3', closerName: 'Jordan Lee', prospectName: 'Avery Stone', dealValue: 25599, riskLevel: 'red', dangerSignals: ["Prospect said 'this isn't for me'"], rescueLog: { managerJoinedAt: daysAgo(0), mode: 'whisper', outcome: 'saved', dollarsSaved: 25599 } },
  ]

  return {
    orgName,
    admin: { name: adminName, email: adminEmail },
    setupFeePaid: true,
    members,
    dealTypePriceOptions,
    deals,
    paymentPlans,
    ledgerEntries,
    prospectCards,
    ghostPersonas,
    ghostSessions,
    liveCallRiskEntries,
    slackDigestConfig: { channel: '#closer-os-wins', sendTime: '18:00', bigWinThreshold: 10000 },
    calls,
    connectedIntegrations: ['stripe', 'slack'],
    auditLog: [{ id: crypto.randomUUID(), action: 'org-seeded', actor: adminName, timestamp: new Date().toISOString(), detail: `${orgName} created` }],
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/closerOrgStore.test.ts`
Expected: PASS (11 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/closerOrgStore.ts src/pages/closerOS/closerOrgStore.test.ts
git commit -m "feat(closer-os): add closerOrgStore mock data model"
```

---

## Task 2: `closerAccounts.ts` — mock account registry

**Files:**
- Create: `src/pages/closerOS/closerAccounts.ts`
- Test: `src/pages/closerOS/closerAccounts.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `AccountType = 'closer-os-admin' | 'closer-os-member'`, `CloserAccountRecord { accountType, orgName? }`, `getCloserAccount(email): CloserAccountRecord | null`, `setCloserAccount(email, record): void`, `setActiveMemberEmail(email): void`, `getActiveMemberEmail(): string | null` — used by the checkout page (Task 4) and sign-in page (Task 6). The active-member functions track which closer (non-admin) is currently signed into the live-call app, mirroring `setActiveAdminEmail`/`getActiveAdminEmail` in Task 1's store but for the member/closer role.

- [ ] **Step 1: Write the failing test**

```ts
// src/pages/closerOS/closerAccounts.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { getCloserAccount, setCloserAccount, getActiveMemberEmail, setActiveMemberEmail } from './closerAccounts'

describe('closerAccounts', () => {
  beforeEach(() => localStorage.clear())

  it('returns null for an unknown email', () => {
    expect(getCloserAccount('nobody@example.com')).toBeNull()
  })

  it('stores and retrieves an account record, case-insensitively', () => {
    setCloserAccount('Admin@Acme.com', { accountType: 'closer-os-admin', orgName: 'Acme Closers' })
    expect(getCloserAccount('admin@acme.com')).toEqual({ accountType: 'closer-os-admin', orgName: 'Acme Closers' })
  })

  it('tracks the active signed-in member email', () => {
    expect(getActiveMemberEmail()).toBeNull()
    setActiveMemberEmail('Jordan@Acme.com')
    expect(getActiveMemberEmail()).toBe('jordan@acme.com')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/closerAccounts.test.ts`
Expected: FAIL — `Cannot find module './closerAccounts'`

- [ ] **Step 3: Write the implementation**

```ts
// src/pages/closerOS/closerAccounts.ts
// Mock, localStorage-backed account registry for Closer OS logins —
// fully separate from src/pages/desktopCopilot/mockAccounts.ts.

export type AccountType = 'closer-os-admin' | 'closer-os-member'

export interface CloserAccountRecord {
  accountType: AccountType
  orgName?: string
}

const STORAGE_KEY = 'closer-os-mock-accounts'

function readStore(): Record<string, CloserAccountRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, CloserAccountRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore — mock persistence only
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function getCloserAccount(email: string): CloserAccountRecord | null {
  const store = readStore()
  return store[normalizeEmail(email)] ?? null
}

export function setCloserAccount(email: string, record: CloserAccountRecord): void {
  const store = readStore()
  store[normalizeEmail(email)] = record
  writeStore(store)
}

const ACTIVE_MEMBER_KEY = 'closer-os-active-member'

export function setActiveMemberEmail(email: string): void {
  try {
    localStorage.setItem(ACTIVE_MEMBER_KEY, normalizeEmail(email))
  } catch {
    // ignore
  }
}

export function getActiveMemberEmail(): string | null {
  try {
    return localStorage.getItem(ACTIVE_MEMBER_KEY)
  } catch {
    return null
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/closerAccounts.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/closerAccounts.ts src/pages/closerOS/closerAccounts.test.ts
git commit -m "feat(closer-os): add closerAccounts mock account registry"
```

---

## Task 3: `CloserOSLanding.tsx` — marketing landing page

**Files:**
- Create: `src/pages/closerOS/marketing/CloserOSLanding.tsx`
- Test: `src/pages/closerOS/marketing/CloserOSLanding.test.tsx`

**Interfaces:**
- Consumes: `@/components/shared/LightforthLogo`, `@/components/ui/button` (`Button`), `useNavigate` from `react-router-dom`.
- Produces: default export `CloserOSLanding`, plus exported consts `CLOSER_OS_SETUP_FEE = 7500` and `CLOSER_OS_SEAT_PRICE = 149` (consumed by Task 4's checkout page).

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/marketing/CloserOSLanding.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import CloserOSLanding from './CloserOSLanding'

function renderLanding() {
  return render(
    <MemoryRouter initialEntries={['/closer-os']}>
      <Routes>
        <Route path="/closer-os" element={<CloserOSLanding />} />
        <Route path="/closer-os/checkout" element={<p>Checkout landed</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CloserOSLanding', () => {
  it('renders the hero headline and all 7 feature names', () => {
    renderLanding()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Closer OS helps you get paid')
    expect(screen.getByText('Payment Moment Engine')).toBeInTheDocument()
    expect(screen.getByText('Installment Recovery Copilot')).toBeInTheDocument()
    expect(screen.getByText('Funnel-to-Call Intelligence')).toBeInTheDocument()
    expect(screen.getByText('The Money Slack Report')).toBeInTheDocument()
    expect(screen.getByText('Revenue Attribution Ledger')).toBeInTheDocument()
    expect(screen.getByText('Ghost Prospect Simulator')).toBeInTheDocument()
    expect(screen.getByText('Second Voice')).toBeInTheDocument()
  })

  it('navigates to the checkout route from either Get Started button (hero + pricing)', () => {
    renderLanding()
    const ctas = screen.getAllByRole('button', { name: /get started/i })
    expect(ctas).toHaveLength(2)
    fireEvent.click(ctas[0])
    expect(screen.getByText('Checkout landed')).toBeInTheDocument()
  })
})
```

**Note on `Button`:** this repo's `@/components/ui/button` wraps `@base-ui/react/button` and does **not** support an `asChild` prop (confirmed in `src/components/ui/button.tsx` — it renders its own `ButtonPrimitive`, not a Radix-style slot). The established pattern elsewhere in this repo for a button that navigates (see `src/pages/marketing/CopilotLanding.tsx:87`) is `<Button onClick={() => navigate(...)}>`, using `useNavigate()` — not `<Button asChild><Link>...</Link></Button>`. Use that pattern below.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/marketing/CloserOSLanding.test.tsx`
Expected: FAIL — `Cannot find module './CloserOSLanding'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/marketing/CloserOSLanding.tsx
import { useNavigate } from 'react-router-dom'
import { CreditCard, RefreshCw, Radar, MessageSquare, BookOpen, Ghost, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LightforthLogo from '@/components/shared/LightforthLogo'

export const CLOSER_OS_SETUP_FEE = 7500
export const CLOSER_OS_SEAT_PRICE = 149

const FEATURES = [
  { icon: CreditCard, name: 'Payment Moment Engine', description: 'The instant a prospect says yes, the payment link is already on your closer\'s screen.' },
  { icon: RefreshCw, name: 'Installment Recovery Copilot', description: 'Catches at-risk payment plans before they\'re missed, not after.' },
  { icon: Radar, name: 'Funnel-to-Call Intelligence', description: 'Every closer opens the call already knowing what the prospect watched, clicked, and wrote.' },
  { icon: MessageSquare, name: 'The Money Slack Report', description: 'One Slack message every evening: cash collected, deals saved, money leaked.' },
  { icon: BookOpen, name: 'Revenue Attribution Ledger', description: 'Proof, deal by deal, of exactly how much Closer OS made you.' },
  { icon: Ghost, name: 'Ghost Prospect Simulator', description: 'Practice against an AI copy of the real prospect your team lost last week.' },
  { icon: Radio, name: 'Second Voice', description: 'When a deal starts dying live, your best closer can step in before it\'s gone.' },
]

export default function CloserOSLanding() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <LightforthLogo to="/closer-os" />
        <Button variant="outline" onClick={() => navigate('/closer-os/sign-in')}>Sign in</Button>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Closer OS</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Every other tool helps closers talk. <span className="text-emerald-600">Closer OS helps you get paid.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          7 money features built directly into the sales call — turning every yes into cash, every missed payment into a save, and every deal into proof.
        </p>
        <Button size="lg" className="mt-8 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/closer-os/checkout')}>
          Get started
        </Button>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(f => (
            <div key={f.name} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <f.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 font-bold text-slate-900">{f.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Pricing</p>
          <p className="mt-3 text-3xl font-black text-slate-900">${CLOSER_OS_SETUP_FEE.toLocaleString()} <span className="text-base font-medium text-slate-500">setup</span></p>
          <p className="mt-1 text-sm text-slate-500">+ ${CLOSER_OS_SEAT_PRICE}/seat/month</p>
          <Button size="lg" className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/closer-os/checkout')}>
            Get started
          </Button>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/marketing/CloserOSLanding.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/marketing/CloserOSLanding.tsx src/pages/closerOS/marketing/CloserOSLanding.test.tsx
git commit -m "feat(closer-os): add Closer OS marketing landing page"
```

---

## Task 4: `CloserOSCheckoutPage.tsx` — signup + mock payment

**Files:**
- Create: `src/pages/closerOS/marketing/CloserOSCheckoutPage.tsx`
- Test: `src/pages/closerOS/marketing/CloserOSCheckoutPage.test.tsx`

**Interfaces:**
- Consumes: `CheckoutFlow`, `CheckoutResult` from `@/pages/marketing/checkout/CheckoutFlow` (the one generic, cross-product component this plan is allowed to reuse), `CLOSER_OS_SETUP_FEE`/`CLOSER_OS_SEAT_PRICE` from Task 3, `setCloserAccount` from Task 2, `createOrg`/`demoSeedCloserOrg`/`setActiveAdminEmail` from Task 1.
- Produces: default export `CloserOSCheckoutPage`, registered at `/closer-os/checkout` in Task 23.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/marketing/CloserOSCheckoutPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import CloserOSCheckoutPage from './CloserOSCheckoutPage'
import { getCloserAccount } from '../closerAccounts'
import { getOrgByAdminEmail, getActiveAdminEmail } from '../closerOrgStore'

describe('CloserOSCheckoutPage', () => {
  beforeEach(() => localStorage.clear())

  it('creates a seeded Closer OS org and account on completed checkout', () => {
    render(<MemoryRouter><CloserOSCheckoutPage /></MemoryRouter>)

    fireEvent.change(screen.getByPlaceholderText('Acme Inc.'), { target: { value: 'Acme Closers' } })
    fireEvent.change(screen.getByPlaceholderText('Jane Doe'), { target: { value: 'Ada Admin' } })
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'ada@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }))

    fireEvent.change(screen.getByPlaceholderText('4242 4242 4242 4242'), { target: { value: '4242424242424242' } })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/29' } })
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /pay .* and continue/i }))

    expect(getCloserAccount('ada@acme.com')?.accountType).toBe('closer-os-admin')
    expect(getOrgByAdminEmail('ada@acme.com')?.orgName).toBe('Acme Closers')
    expect(getActiveAdminEmail()).toBe('ada@acme.com')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/marketing/CloserOSCheckoutPage.test.tsx`
Expected: FAIL — `Cannot find module './CloserOSCheckoutPage'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/marketing/CloserOSCheckoutPage.tsx
import { useNavigate } from 'react-router-dom'
import { CheckoutFlow } from '@/pages/marketing/checkout/CheckoutFlow'
import { CLOSER_OS_SETUP_FEE, CLOSER_OS_SEAT_PRICE } from './CloserOSLanding'
import { setCloserAccount } from '../closerAccounts'
import { createOrg, demoSeedCloserOrg, setActiveAdminEmail } from '../closerOrgStore'

export default function CloserOSCheckoutPage() {
  const navigate = useNavigate()

  return (
    <CheckoutFlow
      productLabel="Closer OS"
      collectCompany
      lineItems={[
        { label: 'Setup fee — one-time', amount: `$${CLOSER_OS_SETUP_FEE.toLocaleString()}` },
        { label: 'Your seat — first month', amount: `$${CLOSER_OS_SEAT_PRICE}` },
      ]}
      totalLabel={`$${(CLOSER_OS_SETUP_FEE + CLOSER_OS_SEAT_PRICE).toLocaleString()}`}
      payButtonLabel={`Pay $${(CLOSER_OS_SETUP_FEE + CLOSER_OS_SEAT_PRICE).toLocaleString()} and continue`}
      accentClassName="bg-emerald-600 hover:bg-emerald-700"
      onCancel={() => navigate('/closer-os')}
      onComplete={({ email, fullName, companyName }) => {
        const orgName = companyName ?? `${fullName}'s team`
        setCloserAccount(email, { accountType: 'closer-os-admin', orgName })
        createOrg(email, demoSeedCloserOrg(email, fullName, orgName))
        setActiveAdminEmail(email)
        navigate(`/closer-os/download?email=${encodeURIComponent(email)}`)
      }}
    />
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/marketing/CloserOSCheckoutPage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/marketing/CloserOSCheckoutPage.tsx src/pages/closerOS/marketing/CloserOSCheckoutPage.test.tsx
git commit -m "feat(closer-os): add Closer OS checkout page"
```

---

## Task 5: `CloserOSDownloadPage.tsx` — post-checkout download page

**Files:**
- Create: `src/pages/closerOS/marketing/CloserOSDownloadPage.tsx`
- Test: `src/pages/closerOS/marketing/CloserOSDownloadPage.test.tsx`

**Interfaces:**
- Consumes: `@/components/shared/LightforthLogo`, `@/components/ui/button`, `sonner`'s `toast`.
- Produces: default export `CloserOSDownloadPage`, registered at `/closer-os/download` in Task 23. "Open Closer OS" navigates to `/closer-os/sign-in?email=...`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/marketing/CloserOSDownloadPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import CloserOSDownloadPage from './CloserOSDownloadPage'

describe('CloserOSDownloadPage', () => {
  it('renders download buttons and an Open Closer OS link carrying the email through', () => {
    render(
      <MemoryRouter initialEntries={['/closer-os/download?email=ada%40acme.com']}>
        <Routes>
          <Route path="/closer-os/download" element={<CloserOSDownloadPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /download for mac/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download for windows/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /download for mac/i }))
    expect(screen.getByRole('button', { name: /open closer os/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/marketing/CloserOSDownloadPage.test.tsx`
Expected: FAIL — `Cannot find module './CloserOSDownloadPage'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/marketing/CloserOSDownloadPage.tsx
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Apple, Check, MonitorDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LightforthLogo from '@/components/shared/LightforthLogo'

function mockDownload(os: string) {
  toast.success(`Downloading Closer OS for ${os}...`, {
    description: 'This is a prototype — no file is actually downloading.',
  })
}

export default function CloserOSDownloadPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email') ?? ''

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md text-center">
        <LightforthLogo className="mx-auto" to="/closer-os" />

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <Check className="h-6 w-6 text-emerald-500" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-slate-900">You're all set</h1>
          <p className="mt-1 text-sm text-slate-500">Download Closer OS to your computer to get started.</p>

          <div className="mt-7 space-y-3">
            <Button size="lg" variant="outline" className="w-full" onClick={() => mockDownload('Mac')}>
              <Apple className="h-4 w-4" /> Download for Mac
            </Button>
            <Button size="lg" variant="outline" className="w-full" onClick={() => mockDownload('Windows')}>
              <MonitorDown className="h-4 w-4" /> Download for Windows
            </Button>
          </div>

          <div className="mt-7 border-t border-slate-100 pt-7">
            <p className="text-sm text-slate-500">Already downloaded it?</p>
            <Button
              size="lg"
              className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => navigate(`/closer-os/sign-in${email ? `?email=${encodeURIComponent(email)}` : ''}`)}
            >
              Open Closer OS
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/marketing/CloserOSDownloadPage.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/marketing/CloserOSDownloadPage.tsx src/pages/closerOS/marketing/CloserOSDownloadPage.test.tsx
git commit -m "feat(closer-os): add Closer OS download page"
```

---

## Task 6: `CloserOSSignIn.tsx` — owner sign-in + closer invite-code activation

**Files:**
- Create: `src/pages/closerOS/CloserOSSignIn.tsx`
- Test: `src/pages/closerOS/CloserOSSignIn.test.tsx`

**Interfaces:**
- Consumes: `getCloserAccount`, `setCloserAccount` and `setActiveMemberEmail` from Task 2; `findMemberByEmail`, `setActiveAdminEmail` from Task 1.
- Produces: default export `CloserOSSignIn`, registered at `/closer-os/sign-in` in Task 23. Routes an admin login to `/closer-os/dashboard`, a member login (post-activation) or first-time invite-code activation to `/closer-os/app`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/CloserOSSignIn.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import CloserOSSignIn from './CloserOSSignIn'
import { createOrg, demoSeedCloserOrg, addMember, getActiveAdminEmail } from './closerOrgStore'
import { setCloserAccount, getActiveMemberEmail } from './closerAccounts'

function renderSignIn(initialPath = '/closer-os/sign-in') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/closer-os/sign-in" element={<CloserOSSignIn />} />
        <Route path="/closer-os/dashboard" element={<p>Dashboard landed</p>} />
        <Route path="/closer-os/app" element={<p>App landed</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CloserOSSignIn', () => {
  beforeEach(() => localStorage.clear())

  it('signs an existing admin account in and routes to the dashboard', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    setCloserAccount('ada@acme.com', { accountType: 'closer-os-admin', orgName: 'Acme Closers' })
    renderSignIn()

    fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: 'ada@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'anything' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByText('Dashboard landed')).toBeInTheDocument()
    expect(getActiveAdminEmail()).toBe('ada@acme.com')
  })

  it('activates a member seat with a correct invite code and routes to the app', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const member = addMember('ada@acme.com', { name: 'Jordan Lee', email: 'jordan@acme.com' })!

    renderSignIn()
    fireEvent.click(screen.getByRole('button', { name: /i have an invite code/i }))
    fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: 'jordan@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('Invite code'), { target: { value: member.inviteCode } })
    fireEvent.change(screen.getByPlaceholderText('Create a password'), { target: { value: 'newpassword' } })
    fireEvent.click(screen.getByRole('button', { name: /activate/i }))

    expect(screen.getByText('App landed')).toBeInTheDocument()
    expect(getActiveMemberEmail()).toBe('jordan@acme.com')
  })

  it('rejects a wrong invite code with an inline error and does not navigate', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    addMember('ada@acme.com', { name: 'Jordan Lee', email: 'jordan@acme.com' })

    renderSignIn()
    fireEvent.click(screen.getByRole('button', { name: /i have an invite code/i }))
    fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: 'jordan@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('Invite code'), { target: { value: 'WRONGCODE' } })
    fireEvent.change(screen.getByPlaceholderText('Create a password'), { target: { value: 'newpassword' } })
    fireEvent.click(screen.getByRole('button', { name: /activate/i }))

    expect(screen.getByText(/invite code doesn't match/i)).toBeInTheDocument()
    expect(screen.queryByText('App landed')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/CloserOSSignIn.test.tsx`
Expected: FAIL — `Cannot find module './CloserOSSignIn'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/CloserOSSignIn.tsx
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import LightforthLogo from '@/components/shared/LightforthLogo'
import { findMemberByEmail, setActiveAdminEmail } from './closerOrgStore'
import { getCloserAccount, setCloserAccount, setActiveMemberEmail } from './closerAccounts'

export default function CloserOSSignIn() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<'sign-in' | 'invite-code'>('sign-in')
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSignIn() {
    setError(null)
    const account = getCloserAccount(email)
    if (!account) {
      setError('No Closer OS account found for this email.')
      return
    }
    if (account.accountType === 'closer-os-admin') {
      setActiveAdminEmail(email)
      navigate('/closer-os/dashboard')
    } else {
      setActiveMemberEmail(email)
      navigate('/closer-os/app')
    }
  }

  function handleActivate() {
    setError(null)
    const found = findMemberByEmail(email)
    if (!found) {
      setError("We couldn't find a teammate with that email.")
      return
    }
    if (found.member.inviteCode !== inviteCode.trim().toUpperCase()) {
      setError("That invite code doesn't match this email.")
      return
    }
    setCloserAccount(email, { accountType: 'closer-os-member', orgName: found.org.orgName })
    setActiveMemberEmail(email)
    navigate('/closer-os/app')
  }

  const signInValid = email.trim().length > 0 && password.length > 0
  const activateValid = email.trim().length > 0 && inviteCode.trim().length > 0 && password.length > 0

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8"><LightforthLogo to="/closer-os" /></div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">{mode === 'sign-in' ? 'Sign in to Closer OS' : 'Activate your seat'}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {mode === 'sign-in' ? 'Owners and activated closers sign in here.' : "First time on your team's Closer OS? Enter the invite code from your admin."}
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="lf-input" />
            </div>
            {mode === 'invite-code' && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Invite code</label>
                <input value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Invite code" className="lf-input font-mono uppercase" />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">{mode === 'sign-in' ? 'Password' : 'Create a password'}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'sign-in' ? '••••••••' : 'Create a password'} className="lf-input" />
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          {mode === 'sign-in' ? (
            <Button size="lg" className="mt-7 w-full bg-emerald-600 hover:bg-emerald-700" disabled={!signInValid} onClick={handleSignIn}>
              Sign in
            </Button>
          ) : (
            <Button size="lg" className="mt-7 w-full bg-emerald-600 hover:bg-emerald-700" disabled={!activateValid} onClick={handleActivate}>
              Activate seat
            </Button>
          )}

          <button
            onClick={() => { setMode(m => (m === 'sign-in' ? 'invite-code' : 'sign-in')); setError(null) }}
            className="mt-4 w-full text-center text-sm font-medium text-emerald-700 hover:underline"
          >
            {mode === 'sign-in' ? 'I have an invite code' : 'Back to sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/CloserOSSignIn.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/CloserOSSignIn.tsx src/pages/closerOS/CloserOSSignIn.test.tsx
git commit -m "feat(closer-os): add Closer OS sign-in with owner + invite-code paths"
```

---

## Task 7: `app/shared.tsx` — Closer OS live-app chrome (emerald theme)

**Files:**
- Create: `src/pages/closerOS/app/shared.tsx`
- Test: `src/pages/closerOS/app/shared.test.tsx`

**Interfaces:**
- Consumes: `@/lib/utils` (`cn`).
- Produces: `BG`, `CARD`, `BORDER`, `GREEN` color constants, `formatTime(seconds): string`, `CloserLogo({ size }): JSX.Element`, `CloserMacWindow({ children, transparency }): JSX.Element`, `Toggle({ on, onToggle }): JSX.Element` — consumed by Tasks 8–12. Deliberately self-contained (does not import `desktopCopilot/shared.tsx`) so Closer OS has its own visual identity per the design spec.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/app/shared.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { formatTime, CloserMacWindow } from './shared'

describe('closerOS app shared chrome', () => {
  it('formats seconds as mm:ss', () => {
    expect(formatTime(65)).toBe('01:05')
    expect(formatTime(5)).toBe('00:05')
  })

  it('CloserMacWindow renders its children', () => {
    render(<CloserMacWindow><p>Inside window</p></CloserMacWindow>)
    expect(screen.getByText('Inside window')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/app/shared.test.tsx`
Expected: FAIL — `Cannot find module './shared'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/app/shared.tsx
import { cn } from '@/lib/utils'

export const BG     = '#03140d'
export const CARD   = 'rgba(16,185,129,0.07)'
export const BORDER = 'rgba(16,185,129,0.18)'
export const GREEN  = '#10b981'

export function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

export function CloserLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#065f46" />
      <path d="M16 8v16M12 12.5c0-1.5 1.8-2.5 4-2.5s4 1 4 2.5-1.8 2.5-4 2.5-4 1-4 2.5 1.8 2.5 4 2.5 4-1 4-2.5" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function CloserMacWindow({ children, transparency = 0 }: { children: React.ReactNode; transparency?: number }) {
  const bgAlpha = (100 - transparency) / 100
  const windowBg = `rgba(3, 20, 13, ${bgAlpha})`

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: 'linear-gradient(145deg, #010b07 0%, #04150e 50%, #01100a 100%)' }}
    >
      <div
        className="flex w-full max-w-[960px] flex-col overflow-hidden rounded-2xl shadow-2xl transition-all duration-150"
        style={{ background: windowBg, height: 700, backdropFilter: `blur(${Math.round(transparency / 10)}px)` }}
      >
        <div className="flex h-10 flex-shrink-0 items-center px-4" style={{ background: `rgba(0,0,0,${0.15 * bgAlpha + 0.05})` }}>
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
          </div>
        </div>
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={cn('relative flex h-6 w-10 flex-shrink-0 items-center rounded-full px-0.5 transition-colors duration-200', on ? 'bg-emerald-500' : 'bg-white/20')}>
      <div className={cn('h-5 w-5 rounded-full bg-white shadow transition-transform duration-200', on ? 'translate-x-4' : 'translate-x-0')} />
    </button>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/app/shared.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/app/shared.tsx src/pages/closerOS/app/shared.test.tsx
git commit -m "feat(closer-os): add emerald-themed app chrome shared by the live-call app"
```

---

## Task 8: `ProspectCard.tsx` — F3 pre-call brief screen

**Files:**
- Create: `src/pages/closerOS/app/ProspectCard.tsx`
- Test: `src/pages/closerOS/app/ProspectCard.test.tsx`

**Interfaces:**
- Consumes: `ProspectCard` type (imported and aliased `ProspectCardData`) from `../closerOrgStore`; `BG`/`CARD`/`BORDER`/`GREEN` from Task 7.
- Produces: default export `ProspectCardScreen({ card: ProspectCardData; onContinue: () => void })` — used by Task 12's orchestrator between Setup and the live call.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/app/ProspectCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProspectCardScreen from './ProspectCard'
import type { ProspectCard } from '../closerOrgStore'

const CARD: ProspectCard = {
  id: 'p1', callId: 'c1', prospectName: 'Casey Nguyen', vslWatchPct: 92,
  rewatchedParts: ['Guarantee section'], applicationAnswers: ['I need a career change fast'],
  emailOpens: 3, heatSignal: 'HOT', openingLines: ['Let\'s talk timeline first.'],
}

describe('ProspectCardScreen', () => {
  it('renders the prospect name, heat badge, VSL percentage, and opening lines', () => {
    render(<ProspectCardScreen card={CARD} onContinue={() => {}} />)
    expect(screen.getByText('Casey Nguyen')).toBeInTheDocument()
    expect(screen.getByText('HOT')).toBeInTheDocument()
    expect(screen.getByText(/92%/)).toBeInTheDocument()
    expect(screen.getByText("Let's talk timeline first.")).toBeInTheDocument()
  })

  it('calls onContinue when the Start Call button is clicked', () => {
    const onContinue = vi.fn()
    render(<ProspectCardScreen card={CARD} onContinue={onContinue} />)
    fireEvent.click(screen.getByRole('button', { name: /start call/i }))
    expect(onContinue).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/app/ProspectCard.test.tsx`
Expected: FAIL — `Cannot find module './ProspectCard'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/app/ProspectCard.tsx
import { Mail, PlayCircle, Sparkles } from 'lucide-react'
import { BG, CARD as CARD_BG, BORDER, GREEN } from './shared'
import type { ProspectCard as ProspectCardData } from '../closerOrgStore'

const HEAT_COLOR: Record<ProspectCardData['heatSignal'], string> = {
  HOT: '#ef4444', WARM: '#f59e0b', COLD: '#60a5fa',
}

export default function ProspectCardScreen({ card, onContinue }: { card: ProspectCardData; onContinue: () => void }) {
  return (
    <div className="flex min-h-[580px] flex-col items-center px-10 py-10" style={{ background: BG }}>
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Prospect Card</p>
      <h1 className="mt-2 text-2xl font-bold text-white">{card.prospectName}</h1>
      <span
        className="mt-2 rounded-full px-3 py-1 text-xs font-bold"
        style={{ background: `${HEAT_COLOR[card.heatSignal]}22`, color: HEAT_COLOR[card.heatSignal] }}
      >
        {card.heatSignal}
      </span>

      <div className="mt-8 w-full max-w-lg space-y-4">
        <div className="rounded-xl p-4" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Funnel activity</p>
          <p className="mt-2 text-sm text-white">Watched <span className="font-bold text-emerald-400">{card.vslWatchPct}%</span> of the VSL</p>
          {card.rewatchedParts.length > 0 && (
            <p className="mt-1 text-sm text-slate-300">Rewatched: {card.rewatchedParts.join(', ')}</p>
          )}
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-300"><Mail className="h-3.5 w-3.5" /> Opened {card.emailOpens} email{card.emailOpens === 1 ? '' : 's'}</p>
        </div>

        {card.applicationAnswers.length > 0 && (
          <div className="rounded-xl p-4" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">In their own words</p>
            {card.applicationAnswers.map((a, i) => <p key={i} className="mt-2 text-sm italic text-slate-200">"{a}"</p>)}
          </div>
        )}

        <div className="rounded-xl p-4" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400"><Sparkles className="h-3.5 w-3.5" /> Suggested openers</p>
          <div className="mt-2 space-y-2">
            {card.openingLines.map((line, i) => (
              <p key={i} className="rounded-lg px-3 py-2 text-sm text-white" style={{ background: 'rgba(16,185,129,0.12)' }}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="mt-8 flex h-11 items-center gap-2 rounded-xl px-8 text-sm font-semibold text-white hover:opacity-90"
        style={{ background: GREEN }}
      >
        <PlayCircle className="h-4 w-4" /> Start Call
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/app/ProspectCard.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/app/ProspectCard.tsx src/pages/closerOS/app/ProspectCard.test.tsx
git commit -m "feat(closer-os): add F3 prospect card pre-call brief screen"
```

---

## Task 9: `PaymentMomentPanel.tsx` — F1 payment panel

**Files:**
- Create: `src/pages/closerOS/app/PaymentMomentPanel.tsx`
- Test: `src/pages/closerOS/app/PaymentMomentPanel.test.tsx`

**Interfaces:**
- Consumes: `PriceOption` type from `../closerOrgStore`.
- Produces: `PaymentStatus = 'hidden' | 'offered' | 'link-sent' | 'link-opened' | 'card-entering' | 'paid' | 'declined'` type and default export `PaymentMomentPanel({ status, priceOption, onSendLink, onBackupOption }: { status: PaymentStatus; priceOption: PriceOption; onSendLink: (choice: 'pif' | 'plan') => void; onBackupOption: (option: 'second-card' | 'split' | 'smaller-deposit') => void })`. Purely presentational — Task 11 (`CloserOSLiveCanvas`) owns the `PaymentStatus` state machine and its timers.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/app/PaymentMomentPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PaymentMomentPanel, { type PaymentStatus } from './PaymentMomentPanel'
import type { PriceOption } from '../closerOrgStore'

const PRICE_OPTION: PriceOption = { label: 'Core Program', pif: 12599, planInstallments: [1599, 3000, 4000, 4000] }

function setup(status: PaymentStatus, onSendLink = vi.fn(), onBackupOption = vi.fn()) {
  render(<PaymentMomentPanel status={status} priceOption={PRICE_OPTION} onSendLink={onSendLink} onBackupOption={onBackupOption} />)
  return { onSendLink, onBackupOption }
}

describe('PaymentMomentPanel', () => {
  it('renders nothing when hidden', () => {
    const { container } = render(<PaymentMomentPanel status="hidden" priceOption={PRICE_OPTION} onSendLink={() => {}} onBackupOption={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('offers PIF and Plan buttons when offered, and calls onSendLink with the chosen option', () => {
    const { onSendLink } = setup('offered')
    expect(screen.getByText(/\$12,599/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /send pif link/i }))
    expect(onSendLink).toHaveBeenCalledWith('pif')
  })

  it('shows the status ticker once a link has been sent', () => {
    setup('link-opened')
    expect(screen.getByText('Link opened')).toBeInTheDocument()
  })

  it('shows the paid confirmation when paid', () => {
    setup('paid')
    expect(screen.getByText(/paid/i)).toBeInTheDocument()
  })

  it('shows the decline rescue script and backup options when declined, and calls onBackupOption', () => {
    const { onBackupOption } = setup('declined')
    expect(screen.getByText(/card declined/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /second card/i }))
    expect(onBackupOption).toHaveBeenCalledWith('second-card')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/app/PaymentMomentPanel.test.tsx`
Expected: FAIL — `Cannot find module './PaymentMomentPanel'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/app/PaymentMomentPanel.tsx
import { Check, CreditCard, Loader2 } from 'lucide-react'
import type { PriceOption } from '../closerOrgStore'

export type PaymentStatus = 'hidden' | 'offered' | 'link-sent' | 'link-opened' | 'card-entering' | 'paid' | 'declined'

const TICKER_STEPS: { key: PaymentStatus; label: string }[] = [
  { key: 'link-sent', label: 'Link sent' },
  { key: 'link-opened', label: 'Link opened' },
  { key: 'card-entering', label: 'Card entered' },
  { key: 'paid', label: 'PAID' },
]

function stepReached(status: PaymentStatus, stepKey: PaymentStatus): boolean {
  const order: PaymentStatus[] = ['link-sent', 'link-opened', 'card-entering', 'paid']
  const statusIdx = order.indexOf(status)
  const stepIdx = order.indexOf(stepKey)
  return statusIdx >= 0 && stepIdx >= 0 && statusIdx >= stepIdx
}

export default function PaymentMomentPanel({
  status, priceOption, onSendLink, onBackupOption,
}: {
  status: PaymentStatus
  priceOption: PriceOption
  onSendLink: (choice: 'pif' | 'plan') => void
  onBackupOption: (option: 'second-card' | 'split' | 'smaller-deposit') => void
}) {
  if (status === 'hidden') return null

  const isDeclined = status === 'declined'
  const planFirst = priceOption.planInstallments[0]

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: isDeclined ? 'rgba(234,179,8,0.10)' : 'rgba(16,185,129,0.10)',
        border: `1px solid ${isDeclined ? 'rgba(234,179,8,0.4)' : 'rgba(16,185,129,0.4)'}`,
      }}
    >
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: isDeclined ? '#eab308' : '#10b981' }}>
        <CreditCard className="h-3.5 w-3.5" /> Payment Moment
      </p>

      {status === 'offered' && (
        <div className="mt-3 space-y-2">
          <button onClick={() => onSendLink('pif')} className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-left text-sm font-semibold text-white hover:bg-emerald-600">
            Send PIF Link — ${priceOption.pif.toLocaleString()}
          </button>
          <button onClick={() => onSendLink('plan')} className="w-full rounded-lg border border-emerald-500/50 px-3 py-2 text-left text-sm font-semibold text-emerald-300 hover:bg-emerald-500/10">
            Send Plan Link — ${planFirst.toLocaleString()} today + {priceOption.planInstallments.length - 1} more
          </button>
        </div>
      )}

      {(status === 'link-sent' || status === 'link-opened' || status === 'card-entering' || status === 'paid') && (
        <div className="mt-3 space-y-1.5">
          {TICKER_STEPS.map(step => {
            const reached = stepReached(status, step.key)
            const isCurrent = status === step.key && status !== 'paid'
            return (
              <div key={step.key} className="flex items-center gap-2 text-sm">
                {isCurrent ? <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" /> : reached ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <div className="h-3.5 w-3.5 rounded-full border border-white/20" />}
                <span className={reached ? 'font-semibold text-white' : 'text-slate-400'}>{step.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Fixed post-review: `stepReached` uses an inclusive >= comparison, so the currently-active
          step was always also "reached" — checking `isCurrent` first (not `reached` first) is what
          actually lets the in-progress spinner render instead of a premature checkmark. */}

      {isDeclined && (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-white">Card declined — not enough funds. Try: "No problem, that happens all the time — do you have another card handy? We can also split today's amount across two cards."</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onBackupOption('second-card')} className="rounded-lg bg-yellow-500/20 px-3 py-1.5 text-xs font-semibold text-yellow-300 hover:bg-yellow-500/30">Try second card</button>
            <button onClick={() => onBackupOption('split')} className="rounded-lg bg-yellow-500/20 px-3 py-1.5 text-xs font-semibold text-yellow-300 hover:bg-yellow-500/30">Split into two charges</button>
            <button onClick={() => onBackupOption('smaller-deposit')} className="rounded-lg bg-yellow-500/20 px-3 py-1.5 text-xs font-semibold text-yellow-300 hover:bg-yellow-500/30">Reduce today's deposit</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/app/PaymentMomentPanel.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/app/PaymentMomentPanel.tsx src/pages/closerOS/app/PaymentMomentPanel.test.tsx
git commit -m "feat(closer-os): add F1 Payment Moment panel"
```

---

## Task 10: `DangerWhisper.tsx` — F7 risk badge + text whisper overlay

**Files:**
- Create: `src/pages/closerOS/app/DangerWhisper.tsx`
- Test: `src/pages/closerOS/app/DangerWhisper.test.tsx`

**Interfaces:**
- Consumes: nothing beyond React.
- Produces: `DangerState = 'none' | 'flagged' | 'whisper-shown'` type and default export `DangerWhisper({ state, reason, whisperLine, onResolve }: { state: DangerState; reason: string; whisperLine: string; onResolve: (outcome: 'saved' | 'lost') => void })`. Presentational only — Task 11 owns the `DangerState` state machine and timers. Text whisper only, per the PRD's own fallback rule (voice whisper requires a tested setup this prototype doesn't have).

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/app/DangerWhisper.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DangerWhisper from './DangerWhisper'

describe('DangerWhisper', () => {
  it('renders nothing when state is none', () => {
    const { container } = render(<DangerWhisper state="none" reason="" whisperLine="" onResolve={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the risk reason when flagged, with no whisper text yet', () => {
    render(<DangerWhisper state="flagged" reason="Prospect sentiment dropping" whisperLine="Ask what's really holding them back." onResolve={() => {}} />)
    expect(screen.getByText(/prospect sentiment dropping/i)).toBeInTheDocument()
    expect(screen.queryByText(/ask what's really holding them back/i)).not.toBeInTheDocument()
  })

  it('shows the whisper line and Saved/Lost buttons when whisper-shown, and calls onResolve', () => {
    const onResolve = vi.fn()
    render(<DangerWhisper state="whisper-shown" reason="Prospect sentiment dropping" whisperLine="Ask what's really holding them back." onResolve={onResolve} />)
    expect(screen.getByText(/ask what's really holding them back/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /mark deal saved/i }))
    expect(onResolve).toHaveBeenCalledWith('saved')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/app/DangerWhisper.test.tsx`
Expected: FAIL — `Cannot find module './DangerWhisper'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/app/DangerWhisper.tsx
import { Headphones, TriangleAlert } from 'lucide-react'

export type DangerState = 'none' | 'flagged' | 'whisper-shown'

export default function DangerWhisper({
  state, reason, whisperLine, onResolve,
}: {
  state: DangerState
  reason: string
  whisperLine: string
  onResolve: (outcome: 'saved' | 'lost') => void
}) {
  if (state === 'none') return null

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.4)' }}>
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-400">
        <TriangleAlert className="h-3.5 w-3.5" /> Risk detected
      </p>
      <p className="mt-1.5 text-sm text-white">{reason}</p>

      {state === 'whisper-shown' && (
        <div className="mt-3 space-y-3">
          <p className="flex items-start gap-1.5 rounded-lg px-3 py-2 text-sm text-white" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <Headphones className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-300" />
            <span>Manager whisper: {whisperLine}</span>
          </p>
          <div className="flex gap-2">
            <button onClick={() => onResolve('saved')} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600">Mark deal saved</button>
            <button onClick={() => onResolve('lost')} className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/30">Mark deal lost</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/app/DangerWhisper.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/app/DangerWhisper.tsx src/pages/closerOS/app/DangerWhisper.test.tsx
git commit -m "feat(closer-os): add F7 danger detector + text whisper overlay"
```

---

## Task 11: `CloserOSLiveCanvas.tsx` — the live call screen (F1 + F3 tie-in + F5 hook + F7)

**Files:**
- Create: `src/pages/closerOS/app/CloserOSLiveCanvas.tsx`
- Test: `src/pages/closerOS/app/CloserOSLiveCanvas.test.tsx`

**Interfaces:**
- Consumes: `BG`, `CARD`, `BORDER`, `formatTime` from Task 7; `PaymentMomentPanel`, `PaymentStatus` from Task 9; `DangerWhisper`, `DangerState` from Task 10; `PriceOption` type from `../closerOrgStore`; `sonner`'s `toast`.
- Produces: default export `CloserOSLiveCanvas({ prospectName, priceOption, onEnd }: { prospectName: string; priceOption: PriceOption; onEnd: (result: LiveCallResult) => void })` and exported type:
  ```ts
  export interface LiveCallResult {
    elapsed: number
    transcript: { speaker: string; text: string }[]
    outcome: 'won' | 'lost' | 'no-decision'
    paymentChoice: 'pif' | 'plan' | null
    usedObjections: { objection: string; counter: string }[]
    dangerResolution: { outcome: 'saved' | 'lost'; reason: string } | null
  }
  ```
  Consumed by Task 12's orchestrator, which writes the result into `closerOrgStore`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/app/CloserOSLiveCanvas.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CloserOSLiveCanvas from './CloserOSLiveCanvas'
import { toast } from 'sonner'
import type { PriceOption } from '../closerOrgStore'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() } }))

const PRICE_OPTION: PriceOption = { label: 'Core Program', pif: 12599, planInstallments: [1599, 3000, 4000, 4000] }

function advanceOneTurn() {
  act(() => { vi.advanceTimersByTime(3000) }) // finish typing the current turn
  fireEvent.keyDown(window, { code: 'Space' })
}

describe('CloserOSLiveCanvas', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows the prospect name in the header and starts with an empty transcript', () => {
    render(<CloserOSLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} />)
    expect(screen.getByText(/Casey Nguyen/)).toBeInTheDocument()
  })

  it('adds an objection to the sidebar once its turn finishes typing, and logs it as used on click', () => {
    render(<CloserOSLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} />)
    advanceOneTurn() // turn 0: small talk
    act(() => { vi.advanceTimersByTime(3000) }) // turn 1 finishes typing: price objection
    expect(screen.getByText('Price is too high')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /mark as used/i }))
    expect(screen.getByText(/used this call/i)).toBeInTheDocument()
  })

  it('opens the Payment Moment panel once the yes-signal turn is reached, and reports a won outcome on End Call after paying', () => {
    const onEnd = vi.fn()
    render(<CloserOSLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={onEnd} />)
    // advance through all 4 preceding turns to reach the yes-signal turn
    for (let i = 0; i < 4; i++) advanceOneTurn()
    act(() => { vi.advanceTimersByTime(3000) }) // final turn finishes typing -> payment offered
    expect(screen.getByRole('button', { name: /send pif link/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /send pif link/i }))
    act(() => { vi.advanceTimersByTime(4000) }) // link-sent -> link-opened -> card-entering -> paid
    expect(screen.getByText(/paid/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /end call/i }))
    expect(onEnd).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'won', paymentChoice: 'pif' }))
  })

  it('force-opens the Payment Moment panel with the P hotkey at any time', () => {
    render(<CloserOSLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} />)
    fireEvent.keyDown(window, { key: 'p' })
    expect(screen.getByRole('button', { name: /send pif link/i })).toBeInTheDocument()
  })

  it('cancels the in-flight payment cascade on End Call, so no late "wins" toast fires and the reported outcome does not later flip to won', () => {
    const onEnd = vi.fn()
    render(<CloserOSLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={onEnd} />)
    for (let i = 0; i < 4; i++) advanceOneTurn()
    act(() => { vi.advanceTimersByTime(3000) }) // payment offered
    fireEvent.click(screen.getByRole('button', { name: /send pif link/i }))
    act(() => { vi.advanceTimersByTime(1200) }) // only reaches 'link-opened' — cascade still in flight

    fireEvent.click(screen.getByRole('button', { name: /end call/i }))
    expect(onEnd).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'no-decision' }))
    expect(onEnd).toHaveBeenCalledTimes(1)

    // If the pending timeout weren't cancelled, this would complete the cascade and fire the toast.
    act(() => { vi.advanceTimersByTime(5000) })
    expect(toast.success).not.toHaveBeenCalled()
    expect(onEnd).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/app/CloserOSLiveCanvas.test.tsx`
Expected: FAIL — `Cannot find module './CloserOSLiveCanvas'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/app/CloserOSLiveCanvas.tsx
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { BG, CARD, BORDER, formatTime } from './shared'
import PaymentMomentPanel, { type PaymentStatus } from './PaymentMomentPanel'
import DangerWhisper, { type DangerState } from './DangerWhisper'
import type { PriceOption } from '../closerOrgStore'

interface CloserTurn {
  speaker: string
  text: string
  objection?: string
  counter?: string
  isYesSignal?: boolean
  isDangerSignal?: string
  whisperLine?: string
}

const CLOSER_QA: CloserTurn[] = [
  { speaker: 'Prospect', text: "Thanks for hopping on — I've been looking forward to this." },
  { speaker: 'Prospect', text: 'Honestly the price is more than I budgeted for this quarter.', objection: 'Price is too high', counter: 'Re-anchor on ROI and time saved — offer a phased start if it helps.' },
  { speaker: 'Prospect', text: "I don't know... this isn't really clicking the way I hoped.", isDangerSignal: "Prospect sentiment dropping — possible buyer's remorse forming", whisperLine: "Slow down and ask what's really holding them back before you talk price again." },
  { speaker: 'Prospect', text: "I'd also want to check with my business partner before committing.", objection: 'Need to check with a partner', counter: 'Offer a 3-way call this week so the partner hears it firsthand.' },
  { speaker: 'Prospect', text: 'Okay, you know what — let\'s do it. How do I pay?', isYesSignal: true },
]

export interface LiveCallResult {
  elapsed: number
  transcript: { speaker: string; text: string }[]
  outcome: 'won' | 'lost' | 'no-decision'
  paymentChoice: 'pif' | 'plan' | null
  usedObjections: { objection: string; counter: string }[]
  dangerResolution: { outcome: 'saved' | 'lost'; reason: string } | null
}

export default function CloserOSLiveCanvas({
  prospectName, priceOption, onEnd,
}: {
  prospectName: string
  priceOption: PriceOption
  onEnd: (result: LiveCallResult) => void
}) {
  const [turnIndex, setTurnIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const [history, setHistory] = useState<CloserTurn[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [shownObjections, setShownObjections] = useState<{ objection: string; counter: string; used: boolean }[]>([])
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('hidden')
  const [paymentChoice, setPaymentChoice] = useState<'pif' | 'plan' | null>(null)
  const [simulateDecline, setSimulateDecline] = useState(false)
  const [dangerState, setDangerState] = useState<DangerState>('none')
  const [dangerReason, setDangerReason] = useState('')
  const [dangerWhisperLine, setDangerWhisperLine] = useState('')
  const [dangerResolution, setDangerResolution] = useState<{ outcome: 'saved' | 'lost'; reason: string } | null>(null)

  const turnIndexRef = useRef(turnIndex)
  useEffect(() => { turnIndexRef.current = turnIndex }, [turnIndex])

  useEffect(() => { const id = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(id) }, [])

  // Typing effect for the current turn.
  useEffect(() => {
    setDisplayed('')
    setTypingDone(false)
    const turn = CLOSER_QA[turnIndex]
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(turn.text.slice(0, i))
      if (i >= turn.text.length) {
        clearInterval(id)
        setTypingDone(true)
        if (turn.objection && turn.counter) {
          setShownObjections(prev => [...prev, { objection: turn.objection!, counter: turn.counter!, used: false }])
        }
        if (turn.isDangerSignal) {
          setDangerReason(turn.isDangerSignal)
          setDangerWhisperLine(turn.whisperLine ?? '')
          setDangerState('flagged')
          setTimeout(() => setDangerState('whisper-shown'), 1500)
        }
        if (turn.isYesSignal) {
          setPaymentStatus('offered')
        }
      }
    }, 22)
    return () => clearInterval(id)
  }, [turnIndex])

  // Advance to the next turn on Space (only once typing has finished and we're not on the final turn).
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setPaymentStatus(s => (s === 'hidden' ? 'offered' : s))
        return
      }
      if (e.code !== 'Space') return
      e.preventDefault()
      if (!typingDone) return
      if (turnIndexRef.current >= CLOSER_QA.length - 1) return
      setHistory(h => [...h, CLOSER_QA[turnIndexRef.current]])
      setTurnIndex(i => i + 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [typingDone])

  // Kept in a ref (rather than read directly from state) because the payment cascade below
  // schedules its timeouts eagerly, nested inside one another, so the final stage needs the
  // latest "simulate decline" checkbox value at the moment it fires, not a stale closure value.
  const simulateDeclineRef = useRef(simulateDecline)
  useEffect(() => { simulateDeclineRef.current = simulateDecline }, [simulateDecline])

  // Holds whichever payment-cascade timeout is currently pending, so it can be cancelled — on
  // unmount, or if the call ends mid-cascade — instead of firing (and posting a "wins" toast)
  // after the call has already been reported with a different outcome.
  const pendingPaymentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (pendingPaymentTimeoutRef.current) clearTimeout(pendingPaymentTimeoutRef.current) }, [])

  // Toast when the payment lands — this only reacts to the final status, it doesn't drive it.
  useEffect(() => {
    if (paymentStatus === 'paid') {
      toast.success(`📣 Posted to #closer-os-wins`, { description: `${prospectName} — $${(paymentChoice === 'plan' ? priceOption.planInstallments[0] : priceOption.pif).toLocaleString()}` })
    }
  }, [paymentStatus, prospectName, paymentChoice, priceOption])

  // Payment status cascade. Each stage schedules the next stage's timeout directly (nested),
  // rather than reacting to a state/prop change in a separate effect keyed on `paymentStatus`.
  // That matters under fake timers: an effect keyed on `paymentStatus` only re-runs once React
  // has committed a render for the previous stage, so a single big `advanceTimersByTime` call
  // would only ever complete one stage per test `act()` boundary — scheduling eagerly, inside
  // the previous timeout's own callback, lets the whole chain fire within one `act()`.
  function handleSendLink(choice: 'pif' | 'plan') {
    setPaymentChoice(choice)
    setPaymentStatus('link-sent')
    toast.info('Payment link sent by SMS + email')
    pendingPaymentTimeoutRef.current = setTimeout(() => {
      setPaymentStatus('link-opened')
      pendingPaymentTimeoutRef.current = setTimeout(() => {
        setPaymentStatus('card-entering')
        pendingPaymentTimeoutRef.current = setTimeout(() => {
          pendingPaymentTimeoutRef.current = null
          setPaymentStatus(simulateDeclineRef.current ? 'declined' : 'paid')
        }, 1200)
      }, 1200)
    }, 1200)
  }

  function handleBackupOption() {
    setSimulateDecline(false)
    simulateDeclineRef.current = false
    setPaymentStatus('card-entering')
    pendingPaymentTimeoutRef.current = setTimeout(() => {
      pendingPaymentTimeoutRef.current = null
      setPaymentStatus('paid')
    }, 1200)
  }

  function handleDangerResolve(outcome: 'saved' | 'lost') {
    setDangerResolution({ outcome, reason: dangerReason })
    setDangerState('none')
  }

  function handleMarkUsed(index: number) {
    setShownObjections(prev => prev.map((o, i) => (i === index ? { ...o, used: true } : o)))
  }

  function handleEndCall() {
    // Cancel any in-flight payment-cascade timeout so it can't fire (and post a "wins" toast)
    // after the call has already been reported with whatever outcome is true right now.
    if (pendingPaymentTimeoutRef.current) {
      clearTimeout(pendingPaymentTimeoutRef.current)
      pendingPaymentTimeoutRef.current = null
    }
    const outcome: LiveCallResult['outcome'] =
      paymentStatus === 'paid' ? 'won' : dangerResolution?.outcome === 'lost' ? 'lost' : 'no-decision'
    onEnd({
      elapsed,
      transcript: [...history, ...(displayed ? [{ speaker: CLOSER_QA[turnIndex].speaker, text: displayed }] : [])].map(t => ({ speaker: t.speaker, text: t.text })),
      outcome,
      paymentChoice,
      usedObjections: shownObjections.filter(o => o.used).map(o => ({ objection: o.objection, counter: o.counter })),
      dangerResolution,
    })
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col" style={{ background: BG }}>
      <div className="flex flex-shrink-0 items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span>Call with {prospectName}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-400">
            <input type="checkbox" checked={simulateDecline} onChange={e => setSimulateDecline(e.target.checked)} /> Simulate decline
          </label>
          <span className="font-mono text-sm text-slate-300">{formatTime(elapsed)}</span>
          <button onClick={handleEndCall} className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600">End Call</button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 gap-2 overflow-hidden p-2">
        <div className="flex flex-1 min-h-0 flex-col overflow-y-auto rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {history.map((turn, i) => (
            <p key={i} className="mb-3 text-sm text-white"><span className="font-semibold text-emerald-400">{turn.speaker}: </span>{turn.text}</p>
          ))}
          <p className="text-sm text-white"><span className="font-semibold text-emerald-400">{CLOSER_QA[turnIndex].speaker}: </span>{displayed}</p>
          {typingDone && turnIndex < CLOSER_QA.length - 1 && <p className="mt-4 text-xs italic text-slate-500">Press Space to continue...</p>}
        </div>

        <div className="flex w-[300px] flex-shrink-0 flex-col gap-2">
          <PaymentMomentPanel status={paymentStatus} priceOption={priceOption} onSendLink={handleSendLink} onBackupOption={handleBackupOption} />
          <DangerWhisper state={dangerState} reason={dangerReason} whisperLine={dangerWhisperLine} onResolve={handleDangerResolve} />

          <div className="flex-1 overflow-y-auto rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Objections</p>
            {shownObjections.length === 0 && <p className="mt-2 text-xs italic text-slate-600">None raised yet.</p>}
            <div className="mt-2 space-y-2">
              {shownObjections.map((o, i) => (
                <div key={i} className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-xs font-semibold text-amber-400">{o.objection}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{o.counter}</p>
                  {o.used ? (
                    <p className="mt-1.5 text-[11px] font-semibold text-emerald-400">Used this call ✓</p>
                  ) : (
                    <button onClick={() => handleMarkUsed(i)} className="mt-1.5 rounded-md bg-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/30">
                      Mark as used
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }))} className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-medium text-slate-400 hover:text-white">
            <ArrowLeft className="hidden h-3 w-3" /> Hotkey: press P to open Payment Moment manually
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/app/CloserOSLiveCanvas.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/app/CloserOSLiveCanvas.tsx src/pages/closerOS/app/CloserOSLiveCanvas.test.tsx
git commit -m "feat(closer-os): add live call canvas wiring F1 payment moment + F7 danger whisper"
```

---

## Task 12: `CloserOSDesktopApp.tsx` — orchestrator (setup → prospect card → live → summary)

**Files:**
- Create: `src/pages/closerOS/app/CloserOSDesktopApp.tsx`
- Test: `src/pages/closerOS/app/CloserOSDesktopApp.test.tsx`

**Interfaces:**
- Consumes: `getActiveMemberEmail` from Task 2; `findMemberByEmail`, `recordDeal`, `addPaymentPlan`, `addLedgerEntry`, `recordCall`, `addLiveCallRiskEntry`, `resolveRescue` from Task 1; `CloserMacWindow` from Task 7; `ProspectCardScreen` from Task 8; `CloserOSLiveCanvas`, `LiveCallResult` from Task 11.
- Produces: default export `CloserOSDesktopApp`, registered at `/closer-os/app` in Task 23. This is the task where a completed call's `LiveCallResult` gets translated into real `closerOrgStore` writes (Deal, PaymentPlan, LedgerEntry, CallRecord, LiveCallRiskEntry).

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/app/CloserOSDesktopApp.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import CloserOSDesktopApp from './CloserOSDesktopApp'
import { createOrg, demoSeedCloserOrg, addMember, getOrgByAdminEmail } from '../closerOrgStore'
import { setActiveMemberEmail } from '../closerAccounts'

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/closer-os/app']}>
      <Routes>
        <Route path="/closer-os/app" element={<CloserOSDesktopApp />} />
        <Route path="/closer-os/sign-in" element={<p>Sign-in landed</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

function advanceOneTurn() {
  act(() => { vi.advanceTimersByTime(3000) })
  fireEvent.keyDown(window, { code: 'Space' })
}

describe('CloserOSDesktopApp', () => {
  beforeEach(() => { localStorage.clear(); vi.useFakeTimers() })
  afterEach(() => vi.useRealTimers())

  it('redirects to sign-in when no member is signed in', () => {
    renderApp()
    expect(screen.getByText('Sign-in landed')).toBeInTheDocument()
  })

  it('walks a signed-in closer through setup, prospect card, a full paid call, and writes the deal + ledger + call record', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const member = addMember('ada@acme.com', { name: 'Jordan Lee', email: 'jordan@acme.com' })!
    setActiveMemberEmail(member.email)

    renderApp()

    fireEvent.change(screen.getByLabelText(/prospect/i), { target: { value: 'Casey Nguyen' } })
    fireEvent.change(screen.getByLabelText(/deal type/i), { target: { value: 'Core Program' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(screen.getByText('Casey Nguyen')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /start call/i }))

    for (let i = 0; i < 4; i++) advanceOneTurn()
    act(() => { vi.advanceTimersByTime(3000) })
    fireEvent.click(screen.getByRole('button', { name: /send pif link/i }))
    act(() => { vi.advanceTimersByTime(4000) })
    fireEvent.click(screen.getByRole('button', { name: /end call/i }))

    const org = getOrgByAdminEmail('ada@acme.com')!
    const newDeal = org.deals.find(d => d.prospectName === 'Casey Nguyen' && d.closerName === 'Jordan Lee')
    expect(newDeal?.status).toBe('paid')
    const newCall = org.calls.find(c => c.closerEmail === 'jordan@acme.com')
    expect(newCall?.outcome).toBe('won')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/app/CloserOSDesktopApp.test.tsx`
Expected: FAIL — `Cannot find module './CloserOSDesktopApp'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/app/CloserOSDesktopApp.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CloserMacWindow } from './shared'
import ProspectCardScreen from './ProspectCard'
import CloserOSLiveCanvas, { type LiveCallResult } from './CloserOSLiveCanvas'
import { getActiveMemberEmail } from '../closerAccounts'
import {
  findMemberByEmail, recordDeal, addPaymentPlan, addLedgerEntry, recordCall,
  addLiveCallRiskEntry, resolveRescue, type CloserOrg, type CloserMember, type ProspectCard, type PriceOption,
} from '../closerOrgStore'

type View = 'loading' | 'setup' | 'prospect-card' | 'live' | 'summary'

function planDueDates(): string[] {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  return [new Date(now).toISOString(), new Date(now + 14 * day).toISOString(), new Date(now + 30 * day).toISOString(), new Date(now + 60 * day).toISOString()]
}

export default function CloserOSDesktopApp() {
  const navigate = useNavigate()
  const [view, setView] = useState<View>('loading')
  const [context, setContext] = useState<{ adminEmail: string; org: CloserOrg; member: CloserMember } | null>(null)
  const [selectedProspect, setSelectedProspect] = useState<ProspectCard | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<PriceOption | null>(null)
  const [lastResult, setLastResult] = useState<LiveCallResult | null>(null)

  useEffect(() => {
    const email = getActiveMemberEmail()
    if (!email) { navigate('/closer-os/sign-in'); return }
    const found = findMemberByEmail(email)
    if (!found) { navigate('/closer-os/sign-in'); return }
    setContext(found)
    setView('setup')
  }, [navigate])

  if (view === 'loading' || !context) return null

  function handleSetupContinue() {
    if (!selectedProspect || !selectedPrice) return
    setView('prospect-card')
  }

  function handleCallEnd(result: LiveCallResult) {
    const { adminEmail, org, member } = context!
    const prospectName = selectedProspect!.prospectName
    const priceOption = selectedPrice!
    const callId = crypto.randomUUID()

    const call = recordCall(adminEmail, {
      closerName: member.name, closerEmail: member.email, date: new Date().toISOString(),
      durationSeconds: result.elapsed, transcript: result.transcript,
      outcome: result.outcome, leakReason: result.outcome !== 'won' ? (result.usedObjections[0]?.objection ?? 'No decision reached') : null,
    })

    const deal = recordDeal(adminEmail, {
      prospectName, dealType: priceOption.label, priceOption,
      status: result.outcome === 'won' ? 'paid' : result.outcome === 'lost' ? 'lost' : 'open',
      closerName: member.name, callId: call.id, date: new Date().toISOString(),
    })

    if (result.outcome === 'won' && result.paymentChoice === 'plan') {
      const dueDates = planDueDates()
      addPaymentPlan(adminEmail, {
        dealId: deal.id, buyerName: prospectName, totalAmount: priceOption.planInstallments.reduce((a, b) => a + b, 0),
        installments: priceOption.planInstallments.map((amount, i) => ({ amount, dueDate: dueDates[i], status: i === 0 ? 'paid' as const : 'pending' as const })),
        cardOnFile: { last4: '4242', expiresSoon: false }, riskScore: 'green', retryCount: 0,
      })
    }

    if (result.outcome === 'won') {
      // Ledger dollarValue is always the full deal value (priceOption.pif), matching the
      // demoSeedCloserOrg precedent and the LiveCallRiskEntry/dollarsSaved writes below — a
      // payment-plan close still represents the whole deal, not just today's deposit.
      const dollarValue = priceOption.pif
      if (result.usedObjections.length > 0) {
        addLedgerEntry(adminEmail, { dealId: deal.id, closerName: member.name, objection: result.usedObjections[0].objection, counterUsed: result.usedObjections[0].counter, tag: 'saved', dollarValue, date: new Date().toISOString() })
      } else {
        addLedgerEntry(adminEmail, { dealId: deal.id, closerName: member.name, objection: '', counterUsed: '', tag: 'organic', dollarValue, date: new Date().toISOString() })
      }
    }

    if (result.dangerResolution) {
      const entry = addLiveCallRiskEntry(adminEmail, {
        callId: call.id, closerName: member.name, prospectName, dealValue: priceOption.pif,
        riskLevel: 'red', dangerSignals: [result.dangerResolution.reason], rescueLog: null,
      })
      resolveRescue(adminEmail, entry.id, {
        managerJoinedAt: new Date().toISOString(), mode: 'whisper',
        outcome: result.dangerResolution.outcome, dollarsSaved: result.dangerResolution.outcome === 'saved' ? priceOption.pif : 0,
      })
    }

    setLastResult(result)
    setView('summary')
  }

  return (
    <CloserMacWindow>
      {view === 'setup' && (
        <div className="flex min-h-[580px] flex-col items-center justify-center gap-5 px-10 text-white">
          <h1 className="text-2xl font-bold">Start a Sales Call</h1>
          <div className="w-full max-w-sm space-y-4">
            <div>
              <label htmlFor="prospect-select" className="mb-1.5 block text-sm font-medium">Prospect</label>
              <select
                id="prospect-select"
                className="lf-input"
                value={selectedProspect?.prospectName ?? ''}
                onChange={e => setSelectedProspect(context.org.prospectCards.find(p => p.prospectName === e.target.value) ?? null)}
              >
                <option value="">Choose a prospect...</option>
                {context.org.prospectCards.map(p => <option key={p.id} value={p.prospectName}>{p.prospectName} ({p.heatSignal})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="deal-type-select" className="mb-1.5 block text-sm font-medium">Deal type</label>
              <select
                id="deal-type-select"
                className="lf-input"
                value={selectedPrice?.label ?? ''}
                onChange={e => setSelectedPrice(context.org.dealTypePriceOptions.find(p => p.label === e.target.value) ?? null)}
              >
                <option value="">Choose a deal type...</option>
                {context.org.dealTypePriceOptions.map(p => <option key={p.label} value={p.label}>{p.label} — ${p.pif.toLocaleString()}</option>)}
              </select>
            </div>
          </div>
          <button disabled={!selectedProspect || !selectedPrice} onClick={handleSetupContinue} className="h-11 rounded-xl bg-emerald-500 px-8 text-sm font-semibold text-white disabled:opacity-40">
            Continue
          </button>
        </div>
      )}

      {view === 'prospect-card' && selectedProspect && (
        <ProspectCardScreen card={selectedProspect} onContinue={() => setView('live')} />
      )}

      {view === 'live' && selectedProspect && selectedPrice && (
        <CloserOSLiveCanvas prospectName={selectedProspect.prospectName} priceOption={selectedPrice} onEnd={handleCallEnd} />
      )}

      {view === 'summary' && lastResult && (
        <div className="flex min-h-[580px] flex-col items-center justify-center gap-4 px-10 text-center text-white">
          <h1 className="text-2xl font-bold">{lastResult.outcome === 'won' ? '🎉 Deal closed!' : 'Call complete'}</h1>
          <p className="text-sm text-white/60">Your call notes and payment status have been saved.</p>
          <button onClick={() => { setSelectedProspect(null); setSelectedPrice(null); setLastResult(null); setView('setup') }} className="mt-4 h-11 rounded-xl bg-emerald-500 px-8 text-sm font-semibold text-white">
            Start another call
          </button>
        </div>
      )}
    </CloserMacWindow>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/app/CloserOSDesktopApp.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/app/CloserOSDesktopApp.tsx src/pages/closerOS/app/CloserOSDesktopApp.test.tsx
git commit -m "feat(closer-os): add Closer OS desktop app orchestrator wiring calls into the store"
```

---

## Task 13: `CloserOSAdminLayout.tsx` — owner/manager dashboard shell

**Files:**
- Create: `src/pages/closerOS/dashboard/CloserOSAdminLayout.tsx`
- Test: `src/pages/closerOS/dashboard/CloserOSAdminLayout.test.tsx`

**Interfaces:**
- Consumes: `getActiveAdminEmail`, `getOrgByAdminEmail`, `CloserOrg` from Task 1.
- Produces: default export `CloserOSAdminLayout` and exported `CloserDashboardContext { adminEmail: string; org: CloserOrg; refresh: () => void }` — the outlet context type every dashboard page (Tasks 14–22) reads via `useOutletContext<CloserDashboardContext>()`. Registered as the parent route for `/closer-os/dashboard/*` in Task 23.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/dashboard/CloserOSAdminLayout.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import CloserOSAdminLayout from './CloserOSAdminLayout'
import { createOrg, demoSeedCloserOrg, setActiveAdminEmail } from '../closerOrgStore'

describe('CloserOSAdminLayout', () => {
  beforeEach(() => localStorage.clear())

  it('redirects to the landing page when no admin is signed in', () => {
    render(
      <MemoryRouter initialEntries={['/closer-os/dashboard']}>
        <Routes>
          <Route path="/closer-os/dashboard" element={<CloserOSAdminLayout />} />
          <Route path="/closer-os" element={<p>Landing page</p>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Landing page')).toBeInTheDocument()
  })

  it('renders the org name and all 13 nav items for a signed-in admin', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    setActiveAdminEmail('ada@acme.com')
    render(
      <MemoryRouter initialEntries={['/closer-os/dashboard']}>
        <Routes>
          <Route path="/closer-os/dashboard" element={<CloserOSAdminLayout />}>
            <Route index element={<p>Overview page</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Acme Closers')).toBeInTheDocument()
    expect(screen.getByText('Overview page')).toBeInTheDocument()
    for (const label of ['Overview', 'Payment Settings', 'Plan Tracker', 'Ledger', 'Slack Report', 'Prospect Intel', 'Ghost Simulator', 'Live Rescue Board', 'Team', 'Call History', 'Billing', 'Integrations', 'Settings']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/dashboard/CloserOSAdminLayout.test.tsx`
Expected: FAIL — `Cannot find module './CloserOSAdminLayout'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/dashboard/CloserOSAdminLayout.tsx
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CreditCard, RefreshCw, BookOpen, MessageSquare, Radar, Ghost, Radio,
  Users, Phone, CircleDollarSign, Plug, Settings as SettingsIcon, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getActiveAdminEmail, getOrgByAdminEmail, type CloserOrg } from '../closerOrgStore'

const NAV = [
  { to: '/closer-os/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/closer-os/dashboard/payment-settings', label: 'Payment Settings', icon: CreditCard, end: false },
  { to: '/closer-os/dashboard/plan-tracker', label: 'Plan Tracker', icon: RefreshCw, end: false },
  { to: '/closer-os/dashboard/ledger', label: 'Ledger', icon: BookOpen, end: false },
  { to: '/closer-os/dashboard/slack-report', label: 'Slack Report', icon: MessageSquare, end: false },
  { to: '/closer-os/dashboard/prospect-intel', label: 'Prospect Intel', icon: Radar, end: false },
  { to: '/closer-os/dashboard/ghost-simulator', label: 'Ghost Simulator', icon: Ghost, end: false },
  { to: '/closer-os/dashboard/rescue-board', label: 'Live Rescue Board', icon: Radio, end: false },
  { to: '/closer-os/dashboard/team', label: 'Team', icon: Users, end: false },
  { to: '/closer-os/dashboard/calls', label: 'Call History', icon: Phone, end: false },
  { to: '/closer-os/dashboard/billing', label: 'Billing', icon: CircleDollarSign, end: false },
  { to: '/closer-os/dashboard/integrations', label: 'Integrations', icon: Plug, end: false },
  { to: '/closer-os/dashboard/settings', label: 'Settings', icon: SettingsIcon, end: false },
]

export interface CloserDashboardContext {
  adminEmail: string
  org: CloserOrg
  refresh: () => void
}

export default function CloserOSAdminLayout() {
  const navigate = useNavigate()
  const [adminEmail] = useState(() => getActiveAdminEmail())
  const [org, setOrg] = useState<CloserOrg | null>(() => (adminEmail ? getOrgByAdminEmail(adminEmail) : null))

  useEffect(() => {
    if (!adminEmail || !org) navigate('/closer-os')
  }, [adminEmail, org, navigate])

  if (!adminEmail || !org) return null

  const refresh = () => setOrg(getOrgByAdminEmail(adminEmail))

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-shrink-0 flex-col justify-between bg-[#052e1f] px-5 py-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400 text-xs font-black text-[#052e1f]">C</span>
            <span className="text-base font-bold text-white">Closer OS</span>
          </div>
          <p className="mt-6 truncate text-xs font-semibold uppercase tracking-wide text-emerald-300">{org.orgName}</p>

          <nav className="mt-6 flex flex-col gap-1">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={() => navigate('/closer-os')}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet context={{ adminEmail, org, refresh } satisfies CloserDashboardContext} />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/dashboard/CloserOSAdminLayout.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/dashboard/CloserOSAdminLayout.tsx src/pages/closerOS/dashboard/CloserOSAdminLayout.test.tsx
git commit -m "feat(closer-os): add Closer OS admin dashboard shell"
```

---

## Task 14: `Overview.tsx` — F4 digest mirror + F5 guarantee tracker

**Files:**
- Create: `src/pages/closerOS/dashboard/Overview.tsx`
- Test: `src/pages/closerOS/dashboard/Overview.test.tsx`

**Interfaces:**
- Consumes: `CloserDashboardContext` from Task 13.
- Produces: default export `Overview`, registered as the index route under `/closer-os/dashboard` in Task 23. Deliberately aggregates all-time data (not literally "today") since seeded demo dates are relative — matches how `src/pages/sales/Overview.tsx` already avoids day-boundary filtering for the same reason.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/dashboard/Overview.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Overview from './Overview'
import { demoSeedCloserOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<Overview />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Overview', () => {
  it('shows cash collected, deals saved, money leaked, a leaderboard, and the guarantee tracker', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Cash collected')).toBeInTheDocument()
    expect(screen.getByText('Deals saved')).toBeInTheDocument()
    expect(screen.getByText('Money leaked')).toBeInTheDocument()
    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    expect(screen.getByText('Guarantee tracker')).toBeInTheDocument()
    // Sam Patel has the single largest seeded ledger entry ($18,599 assisted), so leads the cash leaderboard.
    const rows = screen.getAllByRole('row').slice(1) // drop the header row
    expect(rows[0]).toHaveTextContent('Sam Patel')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/dashboard/Overview.test.tsx`
Expected: FAIL — `Cannot find module './Overview'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/dashboard/Overview.tsx
import { useOutletContext } from 'react-router-dom'
import { DollarSign, Flame, ShieldCheck, TrendingDown, Trophy } from 'lucide-react'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

const GUARANTEE_TARGET = 20000

export default function Overview() {
  const { org } = useOutletContext<CloserDashboardContext>()

  const cashCollected = org.ledgerEntries.reduce((sum, e) => sum + e.dollarValue, 0)
  const dealsSaved = org.ledgerEntries.filter(e => e.tag === 'saved')
  const dealsSavedTotal = dealsSaved.reduce((sum, e) => sum + e.dollarValue, 0)

  const lostCalls = org.calls.filter(c => c.outcome !== 'won')
  const leakedDeals = lostCalls.map(c => {
    const deal = org.deals.find(d => d.callId === c.id)
    return { call: c, value: deal?.priceOption.pif ?? 0 }
  })
  const moneyLeakedTotal = leakedDeals.reduce((sum, l) => sum + l.value, 0)

  const cashByCloser = new Map<string, number>()
  for (const entry of org.ledgerEntries) cashByCloser.set(entry.closerName, (cashByCloser.get(entry.closerName) ?? 0) + entry.dollarValue)
  const leaderboard = [...cashByCloser.entries()].sort((a, b) => b[1] - a[1])

  const hottestProspects = [...org.prospectCards].sort((a, b) => {
    const rank = { HOT: 0, WARM: 1, COLD: 2 }
    return rank[a.heatSignal] - rank[b.heatSignal]
  }).slice(0, 3)

  const guaranteePct = Math.min(100, Math.round((cashCollected / GUARANTEE_TARGET) * 100))

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Welcome back, {org.orgName}</h1>
      <p className="mt-1 text-sm text-slate-500">Here's your money report — the same numbers the Slack digest sends.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><DollarSign className="h-4 w-4 text-emerald-500" /> Cash collected</div>
          <p className="mt-3 text-2xl font-black text-slate-900">${cashCollected.toLocaleString()}</p>
        </div>
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Deals saved</div>
          <p className="mt-3 text-2xl font-black text-slate-900">{dealsSaved.length} <span className="text-base font-medium text-slate-500">/ ${dealsSavedTotal.toLocaleString()}</span></p>
        </div>
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><TrendingDown className="h-4 w-4 text-red-500" /> Money leaked</div>
          <p className="mt-3 text-2xl font-black text-slate-900">${moneyLeakedTotal.toLocaleString()}</p>
          <p className="mt-1 text-sm text-slate-500">{leakedDeals.length} lost call{leakedDeals.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">Leaderboard</h2>
      <div className="mt-4 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head"><tr><th className="lf-table-th">Closer</th><th className="lf-table-th text-right">Cash collected</th></tr></thead>
          <tbody>
            {leaderboard.map(([name, total], i) => (
              <tr key={name} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{i === 0 && <Trophy className="mr-1.5 inline h-3.5 w-3.5 text-amber-500" />}{name}</td>
                <td className="lf-table-cell text-right text-slate-600">${total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">Tomorrow's hottest prospects</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {hottestProspects.map(p => (
          <div key={p.id} className="lf-panel p-4">
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900"><Flame className="h-3.5 w-3.5 text-red-500" /> {p.prospectName}</div>
            <p className="mt-1 text-xs font-semibold text-emerald-600">{p.heatSignal}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">Guarantee tracker</h2>
      <div className="mt-4 lf-panel p-6">
        <div className="flex justify-between text-sm font-semibold text-slate-700">
          <span>${cashCollected.toLocaleString()} of ${GUARANTEE_TARGET.toLocaleString()}</span>
          <span>{guaranteePct}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${guaranteePct}%` }} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/dashboard/Overview.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/dashboard/Overview.tsx src/pages/closerOS/dashboard/Overview.test.tsx
git commit -m "feat(closer-os): add F4/F5 Overview dashboard page"
```

---

## Task 15: `PaymentSettings.tsx` — F1 offer setup + mock payment connections

**Files:**
- Create: `src/pages/closerOS/dashboard/PaymentSettings.tsx`
- Test: `src/pages/closerOS/dashboard/PaymentSettings.test.tsx`

**Interfaces:**
- Consumes: `CloserDashboardContext` from Task 13; `addDealTypePriceOption`, `removeDealTypePriceOption`, `toggleIntegration` from Task 1.
- Produces: default export `PaymentSettings`, registered at `/closer-os/dashboard/payment-settings` in Task 23.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/dashboard/PaymentSettings.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import PaymentSettings from './PaymentSettings'
import { createOrg, demoSeedCloserOrg, getOrgByAdminEmail } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(adminEmail: string, org: ReturnType<typeof demoSeedCloserOrg>, refresh: () => void) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={{ adminEmail, org, refresh } satisfies CloserDashboardContext} />}>
          <Route index element={<PaymentSettings />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('PaymentSettings', () => {
  beforeEach(() => localStorage.clear())

  it('lists existing deal-type price options and their PIF price', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext('ada@acme.com', org, () => {})
    expect(screen.getByText('Core Program')).toBeInTheDocument()
    expect(screen.getByText(/\$12,599/)).toBeInTheDocument()
  })

  it('adds a new deal type with PIF price and one plan installment amount', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    let org = getOrgByAdminEmail('ada@acme.com')!
    const refresh = () => { org = getOrgByAdminEmail('ada@acme.com')! }
    const { rerender } = renderWithContext('ada@acme.com', org, refresh)

    fireEvent.change(screen.getByPlaceholderText('Deal type name'), { target: { value: 'Starter Program' } })
    fireEvent.change(screen.getByPlaceholderText('PIF price'), { target: { value: '5000' } })
    fireEvent.change(screen.getByPlaceholderText('Deposit today'), { target: { value: '1000' } })
    fireEvent.click(screen.getByRole('button', { name: /add deal type/i }))

    rerender(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{ adminEmail: 'ada@acme.com', org, refresh } satisfies CloserDashboardContext} />}>
            <Route index element={<PaymentSettings />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Starter Program')).toBeInTheDocument()
    expect(getOrgByAdminEmail('ada@acme.com')!.dealTypePriceOptions.some(o => o.label === 'Starter Program')).toBe(true)
  })

  it('toggles a payment connection on and off', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    let org = getOrgByAdminEmail('ada@acme.com')!
    const refresh = () => { org = getOrgByAdminEmail('ada@acme.com')! }
    const { rerender } = renderWithContext('ada@acme.com', org, refresh)

    // Seeded org already has 'stripe' connected (see demoSeedCloserOrg) — NMI is not, so its button reads "Connect".
    // Regex is anchored (^...$) so it matches only an exact "Connect" label, not "Disconnect" —
    // /connect/i without anchors also matches "Disconnect" (it contains the substring "connect"),
    // which would hit Stripe's already-connected button instead of NMI's.
    expect(org.connectedIntegrations).toContain('stripe')
    expect(org.connectedIntegrations).not.toContain('nmi')

    fireEvent.click(screen.getAllByRole('button', { name: /^connect$/i })[0]) // NMI's "Connect" button
    rerender(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{ adminEmail: 'ada@acme.com', org, refresh } satisfies CloserDashboardContext} />}>
            <Route index element={<PaymentSettings />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(getOrgByAdminEmail('ada@acme.com')!.connectedIntegrations).toContain('nmi')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/dashboard/PaymentSettings.test.tsx`
Expected: FAIL — `Cannot find module './PaymentSettings'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/dashboard/PaymentSettings.tsx
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { addDealTypePriceOption, removeDealTypePriceOption, toggleIntegration } from '../closerOrgStore'

const PAYMENT_PROCESSORS = [
  { id: 'stripe', name: 'Stripe' },
  { id: 'nmi', name: 'NMI' },
  { id: 'paypal', name: 'PayPal' },
]

export default function PaymentSettings() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [label, setLabel] = useState('')
  const [pif, setPif] = useState('')
  const [deposit, setDeposit] = useState('')

  const canAdd = label.trim().length > 0 && Number(pif) > 0 && Number(deposit) > 0

  function handleAdd() {
    const pifAmount = Number(pif)
    const depositAmount = Number(deposit)
    const remaining = pifAmount - depositAmount
    addDealTypePriceOption(adminEmail, {
      label: label.trim(), pif: pifAmount,
      planInstallments: [depositAmount, Math.round(remaining / 3), Math.round(remaining / 3), remaining - 2 * Math.round(remaining / 3)],
    })
    refresh()
    setLabel(''); setPif(''); setDeposit('')
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Payment Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Set up PIF pricing and payment plans once per deal type — this is what the closer's Payment Moment panel offers on the call.</p>

      <div className="mt-8 lf-panel p-5">
        <p className="lf-section-title">Add a deal type</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Deal type name" className="lf-input" />
          <input value={pif} onChange={e => setPif(e.target.value)} placeholder="PIF price" type="number" className="lf-input" />
          <input value={deposit} onChange={e => setDeposit(e.target.value)} placeholder="Deposit today" type="number" className="lf-input" />
        </div>
        <button disabled={!canAdd} onClick={handleAdd} className="mt-4 h-9 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white disabled:opacity-40">
          Add deal type
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {org.dealTypePriceOptions.map(option => (
          <div key={option.label} className="lf-panel flex items-center justify-between p-5">
            <div>
              <p className="font-bold text-slate-900">{option.label}</p>
              <p className="mt-1 text-sm text-slate-500">PIF ${option.pif.toLocaleString()} · Plan: ${option.planInstallments.map(n => n.toLocaleString()).join(' + $')}</p>
            </div>
            <button onClick={() => { removeDealTypePriceOption(adminEmail, option.label); refresh() }} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">Payment connections</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {PAYMENT_PROCESSORS.map(p => {
          const connected = org.connectedIntegrations.includes(p.id)
          return (
            <div key={p.id} className="lf-panel p-5">
              <p className="font-bold text-slate-900">{p.name}</p>
              <button
                onClick={() => { toggleIntegration(adminEmail, p.id); refresh() }}
                className={connected
                  ? 'mt-3 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-muted'
                  : 'mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700'}
              >
                {connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/dashboard/PaymentSettings.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/dashboard/PaymentSettings.tsx src/pages/closerOS/dashboard/PaymentSettings.test.tsx
git commit -m "feat(closer-os): add F1 payment settings page"
```

---

## Task 16: `PlanTracker.tsx` — F2 installment plan risk tracker

**Files:**
- Create: `src/pages/closerOS/dashboard/PlanTracker.tsx`
- Test: `src/pages/closerOS/dashboard/PlanTracker.test.tsx`

**Interfaces:**
- Consumes: `CloserDashboardContext` from Task 13; `recordInstallmentOutcome` from Task 1.
- Produces: default export `PlanTracker`, registered at `/closer-os/dashboard/plan-tracker` in Task 23.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/dashboard/PlanTracker.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import PlanTracker from './PlanTracker'
import { demoSeedCloserOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<PlanTracker />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('PlanTracker', () => {
  it('lists every payment plan with a risk badge', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Jamie Whitfield')).toBeInTheDocument()
    expect(screen.getByText('Morgan Reyes')).toBeInTheDocument()
    expect(screen.getAllByText(/red|yellow|green/i).length).toBeGreaterThan(0)
  })

  it('opens a plan detail with the matching recovery script for a red-risk plan', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    fireEvent.click(screen.getByText('Morgan Reyes')) // seeded red-risk plan
    expect(screen.getByText(/recovery script/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reminder now/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/dashboard/PlanTracker.test.tsx`
Expected: FAIL — `Cannot find module './PlanTracker'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/dashboard/PlanTracker.tsx
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { recordInstallmentOutcome, type PaymentPlan } from '../closerOrgStore'

const RISK_BADGE: Record<PaymentPlan['riskScore'], string> = {
  green: 'bg-emerald-50 text-emerald-600',
  yellow: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
}

const RECOVERY_SCRIPT: Record<PaymentPlan['riskScore'], string> = {
  green: 'No action needed — this plan is on track.',
  yellow: "Card expiring soon: \"Just a heads up your card on file expires soon — want to update it now so nothing gets interrupted?\"",
  red: "Payment failed: \"No problem, that happens all the time — do you have another card handy? We can also split today's amount or move the date once.\"",
}

export default function PlanTracker() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [selected, setSelected] = useState<PaymentPlan | null>(null)

  if (selected) {
    const nextPending = selected.installments.findIndex(i => i.status !== 'paid')
    return (
      <div className="mx-auto max-w-3xl px-10 py-12">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Plan Tracker
        </button>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{selected.buyerName}</h1>
        <p className="mt-1 text-sm text-slate-500">${selected.totalAmount.toLocaleString()} total · card on file •••• {selected.cardOnFile.last4} · {selected.retryCount} retr{selected.retryCount === 1 ? 'y' : 'ies'} so far</p>

        <div className="mt-6 lf-panel p-5">
          <p className="lf-section-title">Recovery script</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{RECOVERY_SCRIPT[selected.riskScore]}</p>
          <button
            onClick={() => toast.success(`Reminder sent to ${selected.buyerName}`)}
            className="mt-4 h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Send reminder now
          </button>
          {nextPending >= 0 && selected.installments[nextPending].status === 'failed' && (
            <button
              onClick={() => { recordInstallmentOutcome(adminEmail, selected.id, nextPending, 'paid'); refresh(); setSelected(null) }}
              className="ml-3 h-9 rounded-lg border border-border px-4 text-sm font-semibold text-slate-700 hover:bg-muted"
            >
              Mark retry successful
            </button>
          )}
        </div>

        <div className="mt-6 lf-table-wrap">
          <table className="lf-table">
            <thead className="lf-table-head"><tr><th className="lf-table-th">Due</th><th className="lf-table-th">Amount</th><th className="lf-table-th text-right">Status</th></tr></thead>
            <tbody>
              {selected.installments.map((inst, i) => (
                <tr key={i} className="lf-table-row">
                  <td className="lf-table-cell text-slate-600">{new Date(inst.dueDate).toLocaleDateString()}</td>
                  <td className="lf-table-cell text-slate-600">${inst.amount.toLocaleString()}</td>
                  <td className="lf-table-cell text-right capitalize text-slate-600">{inst.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Plan Tracker</h1>
      <p className="mt-1 text-sm text-slate-500">Every payment plan and its risk level — click a row for the matching recovery script.</p>

      <div className="mt-8 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr><th className="lf-table-th">Buyer</th><th className="lf-table-th">Total</th><th className="lf-table-th">Next due</th><th className="lf-table-th text-right">Risk</th></tr>
          </thead>
          <tbody>
            {org.paymentPlans.map(plan => {
              const next = plan.installments.find(i => i.status !== 'paid')
              return (
                <tr key={plan.id} className="lf-table-row cursor-pointer" onClick={() => setSelected(plan)}>
                  <td className="lf-table-cell font-medium text-slate-900">{plan.buyerName}</td>
                  <td className="lf-table-cell text-slate-600">${plan.totalAmount.toLocaleString()}</td>
                  <td className="lf-table-cell text-slate-600">{next ? `$${next.amount.toLocaleString()} on ${new Date(next.dueDate).toLocaleDateString()}` : 'Paid in full'}</td>
                  <td className="lf-table-cell text-right">
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold capitalize', RISK_BADGE[plan.riskScore])}>{plan.riskScore}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/dashboard/PlanTracker.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/dashboard/PlanTracker.tsx src/pages/closerOS/dashboard/PlanTracker.test.tsx
git commit -m "feat(closer-os): add F2 installment plan tracker"
```

---

## Task 17: `Ledger.tsx` — F5 revenue attribution ledger

**Files:**
- Create: `src/pages/closerOS/dashboard/Ledger.tsx`
- Test: `src/pages/closerOS/dashboard/Ledger.test.tsx`

**Interfaces:**
- Consumes: `CloserDashboardContext` from Task 13; `logAuditEvent` from Task 1.
- Produces: default export `Ledger`, registered at `/closer-os/dashboard/ledger` in Task 23.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/dashboard/Ledger.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import Ledger from './Ledger'
import { createOrg, demoSeedCloserOrg, getOrgByAdminEmail } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<Ledger />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Ledger', () => {
  beforeEach(() => localStorage.clear())

  it('lists ledger entries and the guarantee tracker', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Price is too high')).toBeInTheDocument()
    expect(screen.getByText(/guarantee target/i)).toBeInTheDocument()
  })

  it('filters by closer', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    fireEvent.change(screen.getByLabelText(/closer/i), { target: { value: 'Sam Patel' } })
    expect(screen.queryByText('Price is too high')).not.toBeInTheDocument() // that entry belongs to Jordan Lee
    expect(screen.getByText('Need to check with a partner')).toBeInTheDocument()
  })

  it('logs an audit entry when generating a renewal deck', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    fireEvent.click(screen.getByRole('button', { name: /generate renewal deck/i }))
    expect(getOrgByAdminEmail('ada@acme.com')!.auditLog.some(a => a.action === 'renewal-deck-generated')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/dashboard/Ledger.test.tsx`
Expected: FAIL — `Cannot find module './Ledger'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/dashboard/Ledger.tsx
import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { FileDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { logAuditEvent, type LedgerEntry } from '../closerOrgStore'

const GUARANTEE_TARGET = 20000

const TAG_BADGE: Record<LedgerEntry['tag'], string> = {
  organic: 'bg-slate-100 text-slate-600',
  assisted: 'bg-blue-50 text-blue-600',
  saved: 'bg-emerald-50 text-emerald-600',
}

export default function Ledger() {
  const { adminEmail, org } = useOutletContext<CloserDashboardContext>()
  const [closerFilter, setCloserFilter] = useState('')
  const [tagFilter, setTagFilter] = useState<'' | LedgerEntry['tag']>('')

  const closers = useMemo(() => [...new Set(org.ledgerEntries.map(e => e.closerName))], [org.ledgerEntries])

  const filtered = org.ledgerEntries.filter(e =>
    (closerFilter === '' || e.closerName === closerFilter) && (tagFilter === '' || e.tag === tagFilter),
  )

  const totalCollected = org.ledgerEntries.reduce((sum, e) => sum + e.dollarValue, 0)
  const guaranteePct = Math.min(100, Math.round((totalCollected / GUARANTEE_TARGET) * 100))

  function handleGenerateRenewalDeck() {
    logAuditEvent(adminEmail, 'renewal-deck-generated', adminEmail, `${org.orgName} renewal deck — $${totalCollected.toLocaleString()} proven`)
    toast.success('Renewal deck generated', { description: 'This is a prototype — no real PDF file is produced yet.' })
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ledger</h1>
          <p className="mt-1 text-sm text-slate-500">Proof, deal by deal, of exactly what Closer OS has made you.</p>
        </div>
        <button onClick={handleGenerateRenewalDeck} className="flex h-10 flex-shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">
          <FileDown className="h-4 w-4" /> Generate renewal deck
        </button>
      </div>

      <div className="mt-6 lf-panel p-5">
        <div className="flex justify-between text-sm font-semibold text-slate-700">
          <span>Guarantee target ${GUARANTEE_TARGET.toLocaleString()} — tracked so far: ${totalCollected.toLocaleString()}</span>
          <span>{guaranteePct}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${guaranteePct}%` }} />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <div>
          <label htmlFor="closer-filter" className="mb-1.5 block text-xs font-semibold text-slate-500">Closer</label>
          <select id="closer-filter" value={closerFilter} onChange={e => setCloserFilter(e.target.value)} className="lf-input">
            <option value="">All closers</option>
            {closers.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="tag-filter" className="mb-1.5 block text-xs font-semibold text-slate-500">Tag</label>
          <select id="tag-filter" value={tagFilter} onChange={e => setTagFilter(e.target.value as '' | LedgerEntry['tag'])} className="lf-input">
            <option value="">All tags</option>
            <option value="organic">Organic</option>
            <option value="assisted">Assisted</option>
            <option value="saved">Saved</option>
          </select>
        </div>
      </div>

      <div className="mt-6 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr><th className="lf-table-th">Closer</th><th className="lf-table-th">Objection</th><th className="lf-table-th">Tag</th><th className="lf-table-th text-right">Value</th></tr>
          </thead>
          <tbody>
            {filtered.map(entry => (
              <tr key={entry.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{entry.closerName}</td>
                <td className="lf-table-cell text-slate-600">{entry.objection || '—'}</td>
                <td className="lf-table-cell"><span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold capitalize', TAG_BADGE[entry.tag])}>{entry.tag}</span></td>
                <td className="lf-table-cell text-right text-slate-600">${entry.dollarValue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/dashboard/Ledger.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/dashboard/Ledger.tsx src/pages/closerOS/dashboard/Ledger.test.tsx
git commit -m "feat(closer-os): add F5 revenue attribution ledger"
```

---

## Task 18: `SlackReport.tsx` — F4 Money Slack Report config + preview

**Files:**
- Create: `src/pages/closerOS/dashboard/SlackReport.tsx`
- Test: `src/pages/closerOS/dashboard/SlackReport.test.tsx`

**Interfaces:**
- Consumes: `CloserDashboardContext` from Task 13; `updateSlackDigestConfig` from Task 1.
- Produces: default export `SlackReport`, registered at `/closer-os/dashboard/slack-report` in Task 23.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/dashboard/SlackReport.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import SlackReport from './SlackReport'
import { createOrg, demoSeedCloserOrg, getOrgByAdminEmail } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<SlackReport />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('SlackReport', () => {
  beforeEach(() => localStorage.clear())

  it('shows the configured channel and send time, and a live preview of the digest', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByDisplayValue('#closer-os-wins')).toBeInTheDocument()
    expect(screen.getByText(/cash today/i)).toBeInTheDocument()
    expect(screen.getByText(/deals saved/i)).toBeInTheDocument()
    expect(screen.getByText(/money leaked/i)).toBeInTheDocument()
  })

  it('saves updated config on Save changes', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    fireEvent.change(screen.getByLabelText(/channel/i), { target: { value: '#sales-wins' } })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    expect(getOrgByAdminEmail('ada@acme.com')!.slackDigestConfig.channel).toBe('#sales-wins')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/dashboard/SlackReport.test.tsx`
Expected: FAIL — `Cannot find module './SlackReport'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/dashboard/SlackReport.tsx
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { MessageSquare } from 'lucide-react'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { updateSlackDigestConfig } from '../closerOrgStore'

export default function SlackReport() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [channel, setChannel] = useState(org.slackDigestConfig.channel)
  const [sendTime, setSendTime] = useState(org.slackDigestConfig.sendTime)
  const [bigWinThreshold, setBigWinThreshold] = useState(String(org.slackDigestConfig.bigWinThreshold))

  const cashCollected = org.ledgerEntries.reduce((sum, e) => sum + e.dollarValue, 0)
  const dealsSaved = org.ledgerEntries.filter(e => e.tag === 'saved')
  const lostCalls = org.calls.filter(c => c.outcome !== 'won')
  const moneyLeaked = lostCalls.reduce((sum, c) => sum + (org.deals.find(d => d.callId === c.id)?.priceOption.pif ?? 0), 0)

  function handleSave() {
    updateSlackDigestConfig(adminEmail, { channel, sendTime, bigWinThreshold: Number(bigWinThreshold) })
    refresh()
    toast.success('Slack Report settings saved')
  }

  function handleSendTest() {
    toast.success(`Test digest sent to ${channel}`)
  }

  return (
    <div className="mx-auto max-w-3xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">The Money Slack Report</h1>
      <p className="mt-1 text-sm text-slate-500">One Slack message, every evening: cash collected, deals saved, money leaked.</p>

      <div className="mt-8 lf-panel p-5">
        <p className="lf-section-title">Settings</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="slack-channel" className="lf-label mb-1.5 block">Channel</label>
            <input id="slack-channel" value={channel} onChange={e => setChannel(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label htmlFor="slack-time" className="lf-label mb-1.5 block">Send time</label>
            <input id="slack-time" type="time" value={sendTime} onChange={e => setSendTime(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label htmlFor="slack-threshold" className="lf-label mb-1.5 block">Big win threshold ($)</label>
            <input id="slack-threshold" type="number" value={bigWinThreshold} onChange={e => setBigWinThreshold(e.target.value)} className="lf-input" />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={handleSave} className="h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">Save changes</button>
          <button onClick={handleSendTest} className="h-9 rounded-lg border border-border px-4 text-sm font-semibold text-slate-700 hover:bg-muted">Send test digest now</button>
        </div>
      </div>

      <p className="mt-8 lf-section-title">Live preview</p>
      <div className="mt-3 rounded-xl border border-slate-200 bg-[#1a1d21] p-5 text-white">
        <p className="flex items-center gap-2 font-bold"><MessageSquare className="h-4 w-4 text-emerald-400" /> Closer OS Bot <span className="text-xs font-normal text-white/40">Today at {sendTime}</span></p>
        <p className="mt-3 text-sm"><strong>CASH TODAY:</strong> ${cashCollected.toLocaleString()} collected</p>
        <p className="mt-2 text-sm"><strong>DEALS SAVED:</strong> {dealsSaved.length} deal{dealsSaved.length === 1 ? '' : 's'} worth ${dealsSaved.reduce((s, e) => s + e.dollarValue, 0).toLocaleString()} saved by copilot counters</p>
        <p className="mt-2 text-sm"><strong>MONEY LEAKED:</strong> ${moneyLeaked.toLocaleString()} leaked across {lostCalls.length} call{lostCalls.length === 1 ? '' : 's'}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/dashboard/SlackReport.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/dashboard/SlackReport.tsx src/pages/closerOS/dashboard/SlackReport.test.tsx
git commit -m "feat(closer-os): add F4 Money Slack Report config and live preview"
```

---

## Task 19: `ProspectIntel.tsx` — F3 funnel-to-call intelligence management

**Files:**
- Create: `src/pages/closerOS/dashboard/ProspectIntel.tsx`
- Test: `src/pages/closerOS/dashboard/ProspectIntel.test.tsx`

**Interfaces:**
- Consumes: `CloserDashboardContext` from Task 13; `addProspectCard` from Task 1.
- Produces: default export `ProspectIntel`, registered at `/closer-os/dashboard/prospect-intel` in Task 23. This is the admin-side view of the same `prospectCards` data the closer's app (Task 8/12) reads from — the "funnel connector" that would ingest real VSL/application data in production is simulated here as a manual-entry form.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/dashboard/ProspectIntel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import ProspectIntel from './ProspectIntel'
import { demoSeedCloserOrg, getOrgByAdminEmail, createOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<ProspectIntel />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProspectIntel', () => {
  it('lists every prospect card with its heat signal', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Casey Nguyen')).toBeInTheDocument()
    expect(screen.getByText('HOT')).toBeInTheDocument()
  })

  it('adds a new prospect card from the manual-entry form', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    fireEvent.change(screen.getByPlaceholderText('Prospect name'), { target: { value: 'Drew Palmer' } })
    fireEvent.change(screen.getByPlaceholderText('VSL watch %'), { target: { value: '80' } })
    fireEvent.change(screen.getByPlaceholderText('Suggested opening line'), { target: { value: "Let's start with your timeline." } })
    fireEvent.click(screen.getByRole('button', { name: /add prospect card/i }))

    expect(getOrgByAdminEmail('ada@acme.com')!.prospectCards.some(p => p.prospectName === 'Drew Palmer')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/dashboard/ProspectIntel.test.tsx`
Expected: FAIL — `Cannot find module './ProspectIntel'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/dashboard/ProspectIntel.tsx
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { addProspectCard } from '../closerOrgStore'

const HEAT_BADGE: Record<'HOT' | 'WARM' | 'COLD', string> = {
  HOT: 'bg-red-50 text-red-600', WARM: 'bg-amber-50 text-amber-600', COLD: 'bg-blue-50 text-blue-600',
}

function heatFromWatchPct(pct: number): 'HOT' | 'WARM' | 'COLD' {
  if (pct >= 80) return 'HOT'
  if (pct >= 40) return 'WARM'
  return 'COLD'
}

export default function ProspectIntel() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [name, setName] = useState('')
  const [watchPct, setWatchPct] = useState('')
  const [openingLine, setOpeningLine] = useState('')

  const canAdd = name.trim().length > 0 && watchPct.trim().length > 0 && openingLine.trim().length > 0

  function handleAdd() {
    const pct = Number(watchPct)
    addProspectCard(adminEmail, {
      callId: crypto.randomUUID(), prospectName: name.trim(), vslWatchPct: pct,
      rewatchedParts: [], applicationAnswers: [], emailOpens: 0,
      heatSignal: heatFromWatchPct(pct), openingLines: [openingLine.trim()],
    })
    refresh()
    setName(''); setWatchPct(''); setOpeningLine('')
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Prospect Intel</h1>
      <p className="mt-1 text-sm text-slate-500">What every booked prospect did in the funnel — this is what the closer's Prospect Card shows before the call.</p>

      <div className="mt-8 lf-panel p-5">
        <p className="lf-section-title">Add a prospect card</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Prospect name" className="lf-input" />
          <input value={watchPct} onChange={e => setWatchPct(e.target.value)} placeholder="VSL watch %" type="number" className="lf-input" />
          <input value={openingLine} onChange={e => setOpeningLine(e.target.value)} placeholder="Suggested opening line" className="lf-input" />
        </div>
        <button disabled={!canAdd} onClick={handleAdd} className="mt-4 h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-40">
          Add prospect card
        </button>
      </div>

      <div className="mt-6 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head"><tr><th className="lf-table-th">Prospect</th><th className="lf-table-th">VSL watched</th><th className="lf-table-th text-right">Heat</th></tr></thead>
          <tbody>
            {org.prospectCards.map(p => (
              <tr key={p.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{p.prospectName}</td>
                <td className="lf-table-cell text-slate-600">{p.vslWatchPct}%</td>
                <td className="lf-table-cell text-right"><span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', HEAT_BADGE[p.heatSignal])}>{p.heatSignal}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/dashboard/ProspectIntel.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/dashboard/ProspectIntel.tsx src/pages/closerOS/dashboard/ProspectIntel.test.tsx
git commit -m "feat(closer-os): add F3 prospect intel management page"
```

---

## Task 20: `GhostSimulator.tsx` — F6 ghost library + practice leaderboard

**Files:**
- Create: `src/pages/closerOS/dashboard/GhostSimulator.tsx`
- Test: `src/pages/closerOS/dashboard/GhostSimulator.test.tsx`

**Interfaces:**
- Consumes: `CloserDashboardContext` from Task 13; `recordGhostSession` from Task 1.
- Produces: default export `GhostSimulator`, registered at `/closer-os/dashboard/ghost-simulator` in Task 23. Ghost personas themselves are created from Call History (Task 22's "Make a Ghost" button); this page lists the library and runs practice sessions. Practice is a self-reported scored checklist (closer confirms what they did), not real-time voice AI — an explicit, deliberate simplification since voice AI is out of scope for this prototype.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/dashboard/GhostSimulator.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import GhostSimulator from './GhostSimulator'
import { demoSeedCloserOrg, getOrgByAdminEmail, createOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<GhostSimulator />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('GhostSimulator', () => {
  it('lists ghost personas and the practice leaderboard', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByText(/ghost of price objection/i)).toBeInTheDocument()
    expect(screen.getByText('Sam Patel')).toBeInTheDocument() // top scorer (88) in seeded ghostSessions
  })

  it('runs a practice session and records the score', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    fireEvent.click(screen.getAllByRole('button', { name: /^practice$/i })[0])
    fireEvent.change(screen.getByLabelText(/closer name/i), { target: { value: 'Riley Chen' } })
    fireEvent.change(screen.getByLabelText(/score/i), { target: { value: '90' } })
    fireEvent.click(screen.getByRole('checkbox', { name: /objections handled/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /payment asked/i }))
    fireEvent.click(screen.getByRole('button', { name: /submit session/i }))

    const updated = getOrgByAdminEmail('ada@acme.com')!
    expect(updated.ghostSessions.some(s => s.closerName === 'Riley Chen' && s.score === 90)).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/dashboard/GhostSimulator.test.tsx`
Expected: FAIL — `Cannot find module './GhostSimulator'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/dashboard/GhostSimulator.tsx
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { recordGhostSession, type GhostPersona } from '../closerOrgStore'

export default function GhostSimulator() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [practicing, setPracticing] = useState<GhostPersona | null>(null)
  const [closerName, setCloserName] = useState('')
  const [score, setScore] = useState('')
  const [objectionsHandled, setObjectionsHandled] = useState(false)
  const [closeAttempted, setCloseAttempted] = useState(false)
  const [paymentAsked, setPaymentAsked] = useState(false)

  const leaderboard = [...org.ghostSessions].sort((a, b) => b.score - a.score)

  function handleSubmit() {
    if (!practicing || !closerName.trim() || !score.trim()) return
    recordGhostSession(adminEmail, {
      ghostId: practicing.id, closerName: closerName.trim(), score: Number(score),
      objectionsHandled: objectionsHandled ? 1 : 0, countersUsed: objectionsHandled ? 1 : 0,
      closeAttempted, paymentAsked, date: new Date().toISOString(),
    })
    refresh()
    toast.success(`Practice session recorded for ${closerName.trim()}`)
    setPracticing(null); setCloserName(''); setScore(''); setObjectionsHandled(false); setCloseAttempted(false); setPaymentAsked(false)
  }

  if (practicing) {
    return (
      <div className="mx-auto max-w-2xl px-10 py-12">
        <button onClick={() => setPracticing(null)} className="text-sm font-semibold text-primary hover:underline">← Back</button>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{practicing.name}</h1>
        <p className="mt-1 text-sm text-slate-500">{practicing.tone}</p>
        <div className="mt-4 space-y-2">
          {practicing.stalls.map((s, i) => <p key={i} className="lf-panel p-3 text-sm italic text-slate-700">"{s}"</p>)}
        </div>

        <div className="mt-6 lf-panel p-5">
          <p className="lf-section-title">Score this session</p>
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="closer-name" className="lf-label mb-1.5 block">Closer name</label>
              <input id="closer-name" value={closerName} onChange={e => setCloserName(e.target.value)} className="lf-input" />
            </div>
            <div>
              <label htmlFor="ghost-score" className="lf-label mb-1.5 block">Score (0-100)</label>
              <input id="ghost-score" type="number" value={score} onChange={e => setScore(e.target.value)} className="lf-input" />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={objectionsHandled} onChange={e => setObjectionsHandled(e.target.checked)} /> Objections handled</label>
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={closeAttempted} onChange={e => setCloseAttempted(e.target.checked)} /> Close attempted</label>
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={paymentAsked} onChange={e => setPaymentAsked(e.target.checked)} /> Payment asked</label>
          </div>
          <button onClick={handleSubmit} className="mt-5 h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">Submit session</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Ghost Prospect Simulator</h1>
      <p className="mt-1 text-sm text-slate-500">Practice against an AI copy of a real prospect your team lost — built from Call History.</p>

      <div className="mt-8 space-y-3">
        {org.ghostPersonas.map(ghost => (
          <div key={ghost.id} className="lf-panel flex items-center justify-between p-5">
            <div>
              <p className="font-bold text-slate-900">{ghost.name}</p>
              <p className="mt-1 text-sm text-slate-500">{ghost.objectionStyle}</p>
            </div>
            <button onClick={() => setPracticing(ghost)} className="h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">Practice</button>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">Practice leaderboard</h2>
      <div className="mt-4 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head"><tr><th className="lf-table-th">Closer</th><th className="lf-table-th text-right">Score</th></tr></thead>
          <tbody>
            {leaderboard.map(s => (
              <tr key={s.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{s.closerName}</td>
                <td className="lf-table-cell text-right text-slate-600">{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/dashboard/GhostSimulator.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/dashboard/GhostSimulator.tsx src/pages/closerOS/dashboard/GhostSimulator.test.tsx
git commit -m "feat(closer-os): add F6 ghost prospect simulator"
```

---

## Task 21: `LiveRescueBoard.tsx` — F7 live deal rescue board

**Files:**
- Create: `src/pages/closerOS/dashboard/LiveRescueBoard.tsx`
- Test: `src/pages/closerOS/dashboard/LiveRescueBoard.test.tsx`

**Interfaces:**
- Consumes: `CloserDashboardContext` from Task 13; `addLiveCallRiskEntry`, `resolveRescue` from Task 1.
- Produces: default export `LiveRescueBoard`, registered at `/closer-os/dashboard/rescue-board` in Task 23. Since this prototype has no real concurrent call engine, a "Simulate a live call" button seeds a new unresolved risk entry so the board can be demoed as a standalone page (in addition to the entries Task 12 writes from real completed calls).

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/closerOS/dashboard/LiveRescueBoard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import LiveRescueBoard from './LiveRescueBoard'
import { demoSeedCloserOrg, getOrgByAdminEmail, createOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<LiveRescueBoard />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('LiveRescueBoard', () => {
  it('shows unresolved risk entries as red/yellow cards with rescue actions', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Riley Chen')).toBeInTheDocument() // unresolved red entry
    expect(screen.getAllByRole('button', { name: /whisper/i }).length).toBeGreaterThan(0)
  })

  it('does not show an action row for an already-resolved entry', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    const avery = screen.getByText('Avery Stone').closest('div.lf-panel')!
    expect(avery).toHaveTextContent(/saved/i) // resolved in the seed data
  })

  it('resolving a rescue writes the outcome to the store', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    const rileyEntryId = org.liveCallRiskEntries.find(e => e.prospectName === 'Riley Chen')!.id
    fireEvent.click(screen.getAllByRole('button', { name: /whisper/i })[0]) // Riley Chen is the first unresolved entry in the seed
    fireEvent.click(screen.getByRole('button', { name: /mark saved/i }))

    const updatedEntry = getOrgByAdminEmail('ada@acme.com')!.liveCallRiskEntries.find(e => e.id === rileyEntryId)!
    expect(updatedEntry.rescueLog).toEqual(expect.objectContaining({ mode: 'whisper', outcome: 'saved' }))
  })

  it('simulates a new live call and adds it to the board', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    const before = org.liveCallRiskEntries.length
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    fireEvent.click(screen.getByRole('button', { name: /simulate a live call/i }))
    expect(getOrgByAdminEmail('ada@acme.com')!.liveCallRiskEntries.length).toBe(before + 1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/closerOS/dashboard/LiveRescueBoard.test.tsx`
Expected: FAIL — `Cannot find module './LiveRescueBoard'`

- [ ] **Step 3: Write the implementation**

```tsx
// src/pages/closerOS/dashboard/LiveRescueBoard.tsx
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { addLiveCallRiskEntry, resolveRescue, type LiveCallRiskEntry } from '../closerOrgStore'

const RISK_BORDER: Record<LiveCallRiskEntry['riskLevel'], string> = {
  green: 'border-emerald-200', yellow: 'border-amber-300', red: 'border-red-300',
}

const SIMULATED_PROSPECTS = ['Harper Lin', 'Quinn Alvarez', 'Reese Donovan']
const SIMULATED_SIGNALS = ['Prospect talking less', 'Long silence after price was mentioned', "Two failed close attempts"]

export default function LiveRescueBoard() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [resolving, setResolving] = useState<{ entry: LiveCallRiskEntry; mode: 'listen' | 'whisper' | 'warm-join' } | null>(null)

  function handleResolve(outcome: 'saved' | 'lost') {
    if (!resolving) return
    resolveRescue(adminEmail, resolving.entry.id, {
      managerJoinedAt: new Date().toISOString(), mode: resolving.mode, outcome,
      dollarsSaved: outcome === 'saved' ? resolving.entry.dealValue : 0,
    })
    refresh()
    setResolving(null)
  }

  function handleSimulate() {
    addLiveCallRiskEntry(adminEmail, {
      callId: crypto.randomUUID(),
      closerName: org.members[Math.floor(Math.random() * org.members.length)]?.name ?? 'Unassigned',
      prospectName: SIMULATED_PROSPECTS[Math.floor(Math.random() * SIMULATED_PROSPECTS.length)],
      dealValue: org.dealTypePriceOptions[0]?.pif ?? 10000,
      riskLevel: 'red',
      dangerSignals: [SIMULATED_SIGNALS[Math.floor(Math.random() * SIMULATED_SIGNALS.length)]],
      rescueLog: null,
    })
    refresh()
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Rescue Board</h1>
          <p className="mt-1 text-sm text-slate-500">Every call currently at risk — step in before the deal is gone.</p>
        </div>
        <button onClick={handleSimulate} className="h-10 flex-shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">
          Simulate a live call
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {org.liveCallRiskEntries.map(entry => (
          <div key={entry.id} className={cn('lf-panel border-2 p-5', RISK_BORDER[entry.riskLevel])}>
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900">{entry.prospectName}</p>
              <span className="text-sm font-semibold text-slate-500">${entry.dealValue.toLocaleString()}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Closer: {entry.closerName}</p>
            <ul className="mt-3 space-y-1">
              {entry.dangerSignals.map((s, i) => <li key={i} className="text-xs text-red-500">• {s}</li>)}
            </ul>

            {entry.rescueLog ? (
              <p className="mt-4 text-sm font-semibold text-slate-700 capitalize">{entry.rescueLog.mode} — deal {entry.rescueLog.outcome}</p>
            ) : (
              <div className="mt-4 flex gap-2">
                <button onClick={() => setResolving({ entry, mode: 'listen' })} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-muted">Listen</button>
                <button onClick={() => setResolving({ entry, mode: 'whisper' })} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90">Whisper</button>
                <button onClick={() => setResolving({ entry, mode: 'warm-join' })} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-muted">Warm Join</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {resolving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <p className="font-bold text-slate-900">{resolving.entry.prospectName} — {resolving.mode}</p>
            <p className="mt-1 text-sm text-slate-500">How did the rescue go?</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => handleResolve('saved')} className="h-9 flex-1 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">Mark saved</button>
              <button onClick={() => handleResolve('lost')} className="h-9 flex-1 rounded-lg border border-border text-sm font-semibold text-slate-600 hover:bg-muted">Mark lost</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/closerOS/dashboard/LiveRescueBoard.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/dashboard/LiveRescueBoard.tsx src/pages/closerOS/dashboard/LiveRescueBoard.test.tsx
git commit -m "feat(closer-os): add F7 live deal rescue board"
```

---

## Task 22: `Team.tsx`, `CallHistory.tsx`, `Billing.tsx`, `Integrations.tsx`, `Settings.tsx` — duplicated dashboard pages

**Files:**
- Create: `src/pages/closerOS/dashboard/Team.tsx` + `Team.test.tsx`
- Create: `src/pages/closerOS/dashboard/CallHistory.tsx` + `CallHistory.test.tsx`
- Create: `src/pages/closerOS/dashboard/Billing.tsx` + `Billing.test.tsx`
- Create: `src/pages/closerOS/dashboard/Integrations.tsx` + `Integrations.test.tsx`
- Create: `src/pages/closerOS/dashboard/Settings.tsx` + `Settings.test.tsx`

**Interfaces:**
- Consumes: `CloserDashboardContext` from Task 13; `addMember`, `markMemberSeatPaid`, `emailDomain`, `addGhostPersonaFromCall`, `toggleIntegration`, `updateOrg` from Task 1; `CLOSER_OS_SEAT_PRICE`, `CLOSER_OS_SETUP_FEE` from Task 3.
- Produces: five default exports (`Team`, `CallHistory`, `Billing`, `Integrations`, `Settings`), registered at `/closer-os/dashboard/team`, `/calls`, `/billing`, `/integrations`, `/settings` in Task 23. These are mechanical adaptations of `src/pages/sales/*` equivalents onto `closerOrgStore` — bundled into one task since each is a small, structurally-identical duplication, not independent design work. `CallHistory` is the one with genuinely new behavior: a "Make a Ghost" button on lost calls (F6's entry point).

- [ ] **Step 1: Write the failing tests**

```tsx
// src/pages/closerOS/dashboard/Team.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Team from './Team'
import { demoSeedCloserOrg, getOrgByAdminEmail, createOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<Team />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Team', () => {
  it('lists members and adds a new one with a matching-domain email', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    expect(screen.getByText('Jordan Lee')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /add member/i }))
    fireEvent.change(screen.getByPlaceholderText(/jordan/i), { target: { value: 'Riley Chen' } })
    fireEvent.change(screen.getByPlaceholderText(`riley@acme.com`), { target: { value: 'riley@acme.com' } })
    fireEvent.click(screen.getByRole('button', { name: /add to team/i }))

    expect(getOrgByAdminEmail('ada@acme.com')!.members.some(m => m.name === 'Riley Chen')).toBe(true)
  })
})
```

```tsx
// src/pages/closerOS/dashboard/CallHistory.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import CallHistory from './CallHistory'
import { demoSeedCloserOrg, getOrgByAdminEmail, createOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<CallHistory />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('CallHistory', () => {
  it('lists calls and shows a Make a Ghost button only on lost calls', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    fireEvent.click(screen.getByText('Taylor Brooks')) // the seeded lost call's closer
    expect(screen.getByRole('button', { name: /make a ghost/i })).toBeInTheDocument()
  })

  it('creates a ghost persona from a lost call', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    const before = org.ghostPersonas.length
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    fireEvent.click(screen.getByText('Taylor Brooks'))
    fireEvent.click(screen.getByRole('button', { name: /make a ghost/i }))
    expect(getOrgByAdminEmail('ada@acme.com')!.ghostPersonas.length).toBe(before + 1)
  })
})
```

```tsx
// src/pages/closerOS/dashboard/Billing.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Billing from './Billing'
import { demoSeedCloserOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

describe('Billing', () => {
  it('shows the setup fee and computed monthly total from active seats', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{ adminEmail: 'ada@acme.com', org, refresh: () => {} } satisfies CloserDashboardContext} />}>
            <Route index element={<Billing />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('$7,500')).toBeInTheDocument()
    const activeSeats = org.members.filter(m => m.seatPaid).length
    expect(screen.getByText(`$${(activeSeats * 149).toFixed(2)}`, { exact: false })).toBeInTheDocument()
  })
})
```

```tsx
// src/pages/closerOS/dashboard/Integrations.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Integrations from './Integrations'
import { demoSeedCloserOrg, getOrgByAdminEmail, createOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

describe('Integrations', () => {
  it('toggles a connection', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{ adminEmail: 'ada@acme.com', org, refresh: () => {} } satisfies CloserDashboardContext} />}>
            <Route index element={<Integrations />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    // Anchored regex: /connect/i without anchors also matches "Disconnect" (already-connected
    // processors), which would hit a pre-connected integration's Disconnect button instead.
    fireEvent.click(screen.getAllByRole('button', { name: /^connect$/i })[0])
    expect(getOrgByAdminEmail('ada@acme.com')!.connectedIntegrations.length).toBeGreaterThan(2)
  })
})
```

```tsx
// src/pages/closerOS/dashboard/Settings.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Settings from './Settings'
import { demoSeedCloserOrg, getOrgByAdminEmail, createOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

describe('Settings', () => {
  it('saves the org name and admin name', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{ adminEmail: 'ada@acme.com', org, refresh: () => {} } satisfies CloserDashboardContext} />}>
            <Route index element={<Settings />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Acme Closers Inc' } })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    expect(getOrgByAdminEmail('ada@acme.com')!.orgName).toBe('Acme Closers Inc')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/closerOS/dashboard/Team.test.tsx src/pages/closerOS/dashboard/CallHistory.test.tsx src/pages/closerOS/dashboard/Billing.test.tsx src/pages/closerOS/dashboard/Integrations.test.tsx src/pages/closerOS/dashboard/Settings.test.tsx`
Expected: FAIL — cannot find modules

- [ ] **Step 3: Write the implementations**

```tsx
// src/pages/closerOS/dashboard/Team.tsx
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Check, Copy, UserPlus } from 'lucide-react'
import { addMember, emailDomain, markMemberSeatPaid } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

const SEAT_PRICE = 149

export default function Team() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const orgDomain = emailDomain(adminEmail)
  const domainMismatch = email.trim().length > 0 && emailDomain(email) !== orgDomain
  const canAdd = name.trim().length > 0 && email.trim().length > 0 && !domainMismatch

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="mt-1 text-sm text-slate-500">Add closers by name and email, then activate their seat to send their invite code.</p>
        </div>
        <button onClick={() => setShowAddForm(v => !v)} className="flex h-10 flex-shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">
          <UserPlus className="h-4 w-4" /> Add member
        </button>
      </div>

      {showAddForm && (
        <div className="mt-6 lf-panel p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="lf-label mb-1.5 block">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Jordan Lee" className="lf-input" />
            </div>
            <div>
              <label className="lf-label mb-1.5 block">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder={`riley@${orgDomain}`} className="lf-input" />
              {domainMismatch && <p className="mt-1 text-xs text-destructive">Must be an organizational email — a @{orgDomain} address.</p>}
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              disabled={!canAdd}
              onClick={() => { addMember(adminEmail, { name, email }); refresh(); setName(''); setEmail(''); setShowAddForm(false) }}
              className="h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-40"
            >
              Add to team
            </button>
            <button onClick={() => setShowAddForm(false)} className="h-9 rounded-lg px-4 text-sm font-semibold text-slate-500 hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-8 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr><th className="lf-table-th">Name</th><th className="lf-table-th">Email</th><th className="lf-table-th">Invite code</th><th className="lf-table-th text-right">Seat</th></tr>
          </thead>
          <tbody>
            {org.members.map(member => (
              <tr key={member.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{member.name}</td>
                <td className="lf-table-cell text-slate-600">{member.email}</td>
                <td className="lf-table-cell">
                  {member.seatPaid ? (
                    <button
                      onClick={() => { navigator.clipboard?.writeText(member.inviteCode); setCopiedCode(member.id); setTimeout(() => setCopiedCode(null), 1500) }}
                      className="flex items-center gap-1.5 font-mono text-xs font-semibold text-primary hover:underline"
                    >
                      {member.inviteCode}
                      {copiedCode === member.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    </button>
                  ) : <span className="text-xs text-slate-400">Available once seat is active</span>}
                </td>
                <td className="lf-table-cell text-right">
                  {member.seatPaid ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"><Check className="h-3 w-3" /> Active</span>
                  ) : (
                    <button onClick={() => { markMemberSeatPaid(adminEmail, member.id); refresh() }} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary/90">
                      Activate seat — ${SEAT_PRICE}/mo
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

```tsx
// src/pages/closerOS/dashboard/CallHistory.tsx
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Ghost, Phone } from 'lucide-react'
import { addGhostPersonaFromCall, type CallRecord } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function CallHistory() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [selected, setSelected] = useState<CallRecord | null>(null)

  if (selected) {
    return (
      <div className="mx-auto max-w-4xl px-10 py-12">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to call history
        </button>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Call with {selected.closerName}</h1>
            <p className="mt-1 text-sm text-slate-500">{formatDate(selected.date)} · {formatDuration(selected.durationSeconds)} · {selected.outcome}</p>
          </div>
          {selected.outcome !== 'won' && (
            <button
              onClick={() => { addGhostPersonaFromCall(adminEmail, selected); refresh(); toast.success('Ghost persona created') }}
              className="flex h-9 flex-shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white hover:bg-primary/90"
            >
              <Ghost className="h-3.5 w-3.5" /> Make a Ghost
            </button>
          )}
        </div>

        <div className="mt-6 lf-panel divide-y divide-border p-2">
          {selected.transcript.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-400">No transcript captured for this call.</p>
          ) : selected.transcript.map((line, i) => (
            <div key={i} className="px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">{line.speaker}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-800">{line.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Call History</h1>
      <p className="mt-1 text-sm text-slate-500">Every call your team has completed, with the full transcript.</p>

      <div className="mt-8 lf-table-wrap">
        {org.calls.length === 0 ? (
          <div className="p-10 text-center">
            <Phone className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-500">No calls yet.</p>
          </div>
        ) : (
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr><th className="lf-table-th">Closer</th><th className="lf-table-th">Date</th><th className="lf-table-th">Outcome</th><th className="lf-table-th text-right">Transcript</th></tr>
            </thead>
            <tbody>
              {org.calls.map(call => (
                <tr key={call.id} className="lf-table-row cursor-pointer" onClick={() => setSelected(call)}>
                  <td className="lf-table-cell font-medium text-slate-900">{call.closerName}</td>
                  <td className="lf-table-cell text-slate-600">{formatDate(call.date)}</td>
                  <td className="lf-table-cell capitalize text-slate-600">{call.outcome}</td>
                  <td className="lf-table-cell text-right text-sm font-semibold text-primary">View →</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
```

```tsx
// src/pages/closerOS/dashboard/Billing.tsx
import { useOutletContext } from 'react-router-dom'
import { Check, CreditCard } from 'lucide-react'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { CLOSER_OS_SETUP_FEE, CLOSER_OS_SEAT_PRICE } from '../marketing/CloserOSLanding'

export default function Billing() {
  const { org } = useOutletContext<CloserDashboardContext>()
  const paidSeats = org.members.filter(m => m.seatPaid)
  const monthlyTotal = paidSeats.length * CLOSER_OS_SEAT_PRICE

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
      <p className="mt-1 text-sm text-slate-500">What you've paid, and what you're paying monthly per seat.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><Check className="h-4 w-4 text-emerald-500" /> Setup fee</div>
          <p className="mt-3 text-2xl font-black text-slate-900">{org.setupFeePaid ? `$${CLOSER_OS_SETUP_FEE.toLocaleString()}` : 'Unpaid'}</p>
          <p className="mt-1 text-sm text-slate-500">One-time, already settled.</p>
        </div>
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><CreditCard className="h-4 w-4 text-primary" /> Monthly subscription</div>
          <p className="mt-3 text-2xl font-black text-slate-900">${monthlyTotal.toFixed(2)} <span className="text-base font-medium text-slate-500">/ month</span></p>
          <p className="mt-1 text-sm text-slate-500">{paidSeats.length} active seat{paidSeats.length === 1 ? '' : 's'} at ${CLOSER_OS_SEAT_PRICE}/mo each.</p>
        </div>
      </div>

      <div className="mt-8 lf-panel">
        <div className="border-b border-border px-6 py-4"><h2 className="lf-section-title">Per-seat breakdown</h2></div>
        <table className="lf-table">
          <thead className="lf-table-head"><tr><th className="lf-table-th">Member</th><th className="lf-table-th">Status</th><th className="lf-table-th text-right">Monthly cost</th></tr></thead>
          <tbody>
            {org.members.map(member => (
              <tr key={member.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{member.name}</td>
                <td className="lf-table-cell">{member.seatPaid ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"><Check className="h-3 w-3" /> Active</span> : <span className="text-xs text-slate-400">Not active</span>}</td>
                <td className="lf-table-cell text-right text-slate-600">{member.seatPaid ? `$${CLOSER_OS_SEAT_PRICE}/mo` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

```tsx
// src/pages/closerOS/dashboard/Integrations.tsx
import { useOutletContext } from 'react-router-dom'
import { toggleIntegration } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

const INTEGRATIONS = [
  { id: 'stripe', name: 'Stripe', category: 'Payments', description: 'Hosted checkout links for the Payment Moment Engine.', color: '#635bff', initial: 'S' },
  { id: 'nmi', name: 'NMI', category: 'Payments', description: 'Alternate payment gateway for existing merchant accounts.', color: '#0f172a', initial: 'N' },
  { id: 'paypal', name: 'PayPal', category: 'Payments', description: 'PayPal checkout as a payment option on the call.', color: '#003087', initial: 'P' },
  { id: 'slack', name: 'Slack', category: 'Communication', description: 'Sends the daily Money Slack Report and big-win pings.', color: '#4A154B', initial: 'SL' },
  { id: 'twilio', name: 'Twilio', category: 'Communication', description: 'SMS delivery for payment links and installment reminders.', color: '#F22F46', initial: 'T' },
]

export default function Integrations() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
      <p className="mt-1 text-sm text-slate-500">Connect the tools Closer OS simulates on your behalf — this is a preview, nothing here makes a real connection yet.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {INTEGRATIONS.map(integration => {
          const connected = org.connectedIntegrations.includes(integration.id)
          return (
            <div key={integration.id} className="lf-panel flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: integration.color }}>{integration.initial}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><p className="font-bold text-slate-900">{integration.name}</p><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">{integration.category}</span></div>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{integration.description}</p>
                <button
                  onClick={() => { toggleIntegration(adminEmail, integration.id); refresh() }}
                  className={connected ? 'mt-3 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-muted' : 'mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90'}
                >
                  {connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

```tsx
// src/pages/closerOS/dashboard/Settings.tsx
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { updateOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

export default function Settings() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [orgName, setOrgName] = useState(org.orgName)
  const [adminName, setAdminName] = useState(org.admin.name)

  function saveProfile() {
    updateOrg(adminEmail, current => ({ ...current, orgName, admin: { ...current.admin, name: adminName } }))
    refresh()
    toast.success('Profile updated')
  }

  return (
    <div className="mx-auto max-w-3xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your profile.</p>

      <section className="mt-8 lf-panel p-6">
        <h2 className="lf-section-title">Profile</h2>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="org-name" className="lf-label mb-1.5 block">Company name</label>
            <input id="org-name" value={orgName} onChange={e => setOrgName(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label htmlFor="admin-name" className="lf-label mb-1.5 block">Your name</label>
            <input id="admin-name" value={adminName} onChange={e => setAdminName(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label htmlFor="admin-email" className="lf-label mb-1.5 block">Email</label>
            <input id="admin-email" value={adminEmail} disabled className="lf-input" />
          </div>
        </div>
        <button onClick={saveProfile} className="mt-5 h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">Save changes</button>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/pages/closerOS/dashboard/Team.test.tsx src/pages/closerOS/dashboard/CallHistory.test.tsx src/pages/closerOS/dashboard/Billing.test.tsx src/pages/closerOS/dashboard/Integrations.test.tsx src/pages/closerOS/dashboard/Settings.test.tsx`
Expected: PASS (all 6 tests across the 5 files)

- [ ] **Step 5: Commit**

```bash
git add src/pages/closerOS/dashboard/Team.tsx src/pages/closerOS/dashboard/Team.test.tsx \
        src/pages/closerOS/dashboard/CallHistory.tsx src/pages/closerOS/dashboard/CallHistory.test.tsx \
        src/pages/closerOS/dashboard/Billing.tsx src/pages/closerOS/dashboard/Billing.test.tsx \
        src/pages/closerOS/dashboard/Integrations.tsx src/pages/closerOS/dashboard/Integrations.test.tsx \
        src/pages/closerOS/dashboard/Settings.tsx src/pages/closerOS/dashboard/Settings.test.tsx
git commit -m "feat(closer-os): add Team, Call History, Billing, Integrations, Settings pages"
```

---

## Task 23: Wire all Closer OS routes into `src/App.tsx`

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: default exports from every prior task (Tasks 3, 4, 5, 6, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22).
- Produces: 13 new routes under `/closer-os/*`, all lazy-loaded and public (no `ProtectedRoute`/`AppLayout` wrapper — matches how `/sales/*` and `/copilot/*` are already registered, since these are separate mock-auth product surfaces, not the main authenticated app).

- [ ] **Step 1: Add the lazy imports**

In `src/App.tsx`, the existing sales-dashboard lazy imports end with this line (confirmed present in the file today):

```tsx
const SalesSettings = lazy(() => import('@/pages/sales/Settings'))
```

Add the following block immediately after it:

```tsx
const CloserOSLanding = lazy(() => import('@/pages/closerOS/marketing/CloserOSLanding'))
const CloserOSCheckoutPage = lazy(() => import('@/pages/closerOS/marketing/CloserOSCheckoutPage'))
const CloserOSDownloadPage = lazy(() => import('@/pages/closerOS/marketing/CloserOSDownloadPage'))
const CloserOSSignIn = lazy(() => import('@/pages/closerOS/CloserOSSignIn'))
const CloserOSDesktopApp = lazy(() => import('@/pages/closerOS/app/CloserOSDesktopApp'))
const CloserOSAdminLayout = lazy(() => import('@/pages/closerOS/dashboard/CloserOSAdminLayout'))
const CloserOSOverview = lazy(() => import('@/pages/closerOS/dashboard/Overview'))
const CloserOSPaymentSettings = lazy(() => import('@/pages/closerOS/dashboard/PaymentSettings'))
const CloserOSPlanTracker = lazy(() => import('@/pages/closerOS/dashboard/PlanTracker'))
const CloserOSLedger = lazy(() => import('@/pages/closerOS/dashboard/Ledger'))
const CloserOSSlackReport = lazy(() => import('@/pages/closerOS/dashboard/SlackReport'))
const CloserOSProspectIntel = lazy(() => import('@/pages/closerOS/dashboard/ProspectIntel'))
const CloserOSGhostSimulator = lazy(() => import('@/pages/closerOS/dashboard/GhostSimulator'))
const CloserOSLiveRescueBoard = lazy(() => import('@/pages/closerOS/dashboard/LiveRescueBoard'))
const CloserOSTeam = lazy(() => import('@/pages/closerOS/dashboard/Team'))
const CloserOSCallHistory = lazy(() => import('@/pages/closerOS/dashboard/CallHistory'))
const CloserOSBilling = lazy(() => import('@/pages/closerOS/dashboard/Billing'))
const CloserOSIntegrations = lazy(() => import('@/pages/closerOS/dashboard/Integrations'))
const CloserOSSettings = lazy(() => import('@/pages/closerOS/dashboard/Settings'))
```

- [ ] **Step 2: Add the routes**

In the same file, the existing sales routes include this line (confirmed present today):

```tsx
            <Route path="/sales/sign-in" element={<Suspense fallback={null}><SalesSignIn /></Suspense>} />
```

Insert the following block immediately **before** that line (same indentation level, inside `<Routes>`):

```tsx
            <Route path="/closer-os" element={<Suspense fallback={null}><CloserOSLanding /></Suspense>} />
            <Route path="/closer-os/checkout" element={<Suspense fallback={null}><CloserOSCheckoutPage /></Suspense>} />
            <Route path="/closer-os/download" element={<Suspense fallback={null}><CloserOSDownloadPage /></Suspense>} />
            <Route path="/closer-os/sign-in" element={<Suspense fallback={null}><CloserOSSignIn /></Suspense>} />
            <Route path="/closer-os/app" element={<Suspense fallback={null}><CloserOSDesktopApp /></Suspense>} />
            <Route path="/closer-os/dashboard" element={<Suspense fallback={null}><CloserOSAdminLayout /></Suspense>}>
              <Route index element={<Suspense fallback={null}><CloserOSOverview /></Suspense>} />
              <Route path="payment-settings" element={<Suspense fallback={null}><CloserOSPaymentSettings /></Suspense>} />
              <Route path="plan-tracker" element={<Suspense fallback={null}><CloserOSPlanTracker /></Suspense>} />
              <Route path="ledger" element={<Suspense fallback={null}><CloserOSLedger /></Suspense>} />
              <Route path="slack-report" element={<Suspense fallback={null}><CloserOSSlackReport /></Suspense>} />
              <Route path="prospect-intel" element={<Suspense fallback={null}><CloserOSProspectIntel /></Suspense>} />
              <Route path="ghost-simulator" element={<Suspense fallback={null}><CloserOSGhostSimulator /></Suspense>} />
              <Route path="rescue-board" element={<Suspense fallback={null}><CloserOSLiveRescueBoard /></Suspense>} />
              <Route path="team" element={<Suspense fallback={null}><CloserOSTeam /></Suspense>} />
              <Route path="calls" element={<Suspense fallback={null}><CloserOSCallHistory /></Suspense>} />
              <Route path="billing" element={<Suspense fallback={null}><CloserOSBilling /></Suspense>} />
              <Route path="integrations" element={<Suspense fallback={null}><CloserOSIntegrations /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={null}><CloserOSSettings /></Suspense>} />
            </Route>
```

- [ ] **Step 3: Verify the app still builds and the route tree resolves**

Run: `npx tsc --noEmit`
Expected: no new type errors.

Run: `npm run build`
Expected: build succeeds (new routes are code-split via `lazy()`, so bundle size impact is minimal).

- [ ] **Step 4: Manual smoke check**

Run: `npm run dev`, then visit these in a browser to confirm each resolves without a blank page or console error:
- `/closer-os` — landing page renders with 7 feature cards
- `/closer-os/checkout` — 2-step checkout form renders
- After completing checkout, confirm redirect to `/closer-os/download?email=...` then `/closer-os/sign-in?email=...`
- Sign in as the new admin → lands on `/closer-os/dashboard` with all 13 nav items
- From Team, add a member, activate their seat, copy the invite code; open `/closer-os/sign-in`, use "I have an invite code" to activate that seat, confirm it lands on `/closer-os/app`
- In the app, walk through Setup → Prospect Card → a full call (use the "Simulate decline" checkbox at least once to see the yellow rescue panel) → End Call, confirm the resulting Deal/Ledger/Call entry shows up back in the dashboard's Ledger and Call History pages

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat(closer-os): wire all Closer OS routes into the app"
```
