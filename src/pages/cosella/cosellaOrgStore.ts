// Mock, localStorage-backed Cosella org registry — fully separate from
// src/pages/sales/mockOrg.ts. Nothing here calls a real backend; every
// mutation is a local, simulated stand-in for the PRD's real (future) system.

export interface CosellaMember {
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

export interface Contact {
  id: string
  name: string
  phone: string
  email: string
  source: 'waitlist' | 'webinar' | 'interest-form' | 'imported' | 'manual'
  assignedTo: string | null
  createdAt: string
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

export interface CosellaOrg {
  orgName: string
  admin: { name: string; email: string }
  setupFeePaid: boolean
  members: CosellaMember[]
  dealTypePriceOptions: PriceOption[]
  deals: Deal[]
  paymentPlans: PaymentPlan[]
  ledgerEntries: LedgerEntry[]
  prospectCards: ProspectCard[]
  contacts: Contact[]
  ghostPersonas: GhostPersona[]
  ghostSessions: GhostSession[]
  liveCallRiskEntries: LiveCallRiskEntry[]
  slackDigestConfig: SlackDigestConfig
  calls: CallRecord[]
  connectedIntegrations: string[]
  auditLog: AuditEntry[]
}

const ORGS_KEY = 'cosella-orgs'
const ACTIVE_ADMIN_KEY = 'cosella-active-admin'

// Orgs saved before the Contacts feature shipped won't have a `contacts` array in localStorage —
// every read runs through here so old data self-heals instead of crashing on `org.contacts.map(...)`.
function normalizeOrg(org: CosellaOrg): CosellaOrg {
  return { ...org, contacts: org.contacts ?? [] }
}

function readStore(): Record<string, CosellaOrg> {
  try {
    const raw = localStorage.getItem(ORGS_KEY)
    const store: Record<string, CosellaOrg> = raw ? JSON.parse(raw) : {}
    return Object.fromEntries(Object.entries(store).map(([key, org]) => [key, normalizeOrg(org)]))
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, CosellaOrg>) {
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

export function getOrgByAdminEmail(adminEmail: string): CosellaOrg | null {
  const store = readStore()
  return store[normalizeEmail(adminEmail)] ?? null
}

export function findMemberByEmail(email: string): { adminEmail: string; org: CosellaOrg; member: CosellaMember } | null {
  const store = readStore()
  const target = normalizeEmail(email)
  for (const [adminEmail, org] of Object.entries(store)) {
    const member = org.members.find(m => normalizeEmail(m.email) === target)
    if (member) return { adminEmail, org, member }
  }
  return null
}

export function createOrg(adminEmail: string, org: CosellaOrg): void {
  const store = readStore()
  store[normalizeEmail(adminEmail)] = org
  writeStore(store)
}

export function updateOrg(adminEmail: string, updater: (org: CosellaOrg) => CosellaOrg): CosellaOrg | null {
  const store = readStore()
  const key = normalizeEmail(adminEmail)
  const current = store[key]
  if (!current) return null
  const next = updater(current)
  store[key] = next
  writeStore(store)
  return next
}

function appendAudit(org: CosellaOrg, action: string, actor: string, detail: string): CosellaOrg {
  const entry: AuditEntry = { id: crypto.randomUUID(), action, actor, timestamp: new Date().toISOString(), detail }
  return { ...org, auditLog: [entry, ...org.auditLog] }
}

export function addMember(adminEmail: string, member: { name: string; email: string }): CosellaMember | null {
  const newMember: CosellaMember = {
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

export function addContact(adminEmail: string, contact: Omit<Contact, 'id' | 'createdAt'>): Contact {
  const item: Contact = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...contact }
  updateOrg(adminEmail, org => appendAudit({ ...org, contacts: [item, ...org.contacts] }, 'contact-added', adminEmail, `${contact.name} (${contact.source})`))
  return item
}

export function assignContact(adminEmail: string, contactId: string, memberEmail: string | null): void {
  updateOrg(adminEmail, org => ({ ...org, contacts: org.contacts.map(c => (c.id === contactId ? { ...c, assignedTo: memberEmail } : c)) }))
}

export function removeContact(adminEmail: string, contactId: string): void {
  updateOrg(adminEmail, org => ({ ...org, contacts: org.contacts.filter(c => c.id !== contactId) }))
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
export function demoSeedCosellaOrg(adminEmail: string, adminName: string, orgName: string): CosellaOrg {
  const domain = emailDomain(adminEmail)
  const reps = [
    { name: 'Jordan Lee', local: 'jordan' },
    { name: 'Sam Patel', local: 'sam' },
    { name: 'Taylor Brooks', local: 'taylor' },
  ]
  const members: CosellaMember[] = [
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

  const contacts: Contact[] = [
    { id: crypto.randomUUID(), name: 'Harper Lin', phone: '+1 (415) 555-0142', email: 'harper.lin@example.com', source: 'waitlist', assignedTo: `taylor@${domain}`, createdAt: daysAgo(2) },
    { id: crypto.randomUUID(), name: 'Quinn Alvarez', phone: '+1 (312) 555-0198', email: 'quinn.alvarez@example.com', source: 'webinar', assignedTo: `taylor@${domain}`, createdAt: daysAgo(4) },
    { id: crypto.randomUUID(), name: 'Reese Donovan', phone: '+1 (646) 555-0173', email: 'reese.donovan@example.com', source: 'interest-form', assignedTo: `jordan@${domain}`, createdAt: daysAgo(1) },
    { id: crypto.randomUUID(), name: 'Skylar Voss', phone: '+1 (206) 555-0114', email: 'skylar.voss@example.com', source: 'imported', assignedTo: `sam@${domain}`, createdAt: daysAgo(6) },
    { id: crypto.randomUUID(), name: 'Emerson Blake', phone: '+1 (512) 555-0187', email: '', source: 'manual', assignedTo: null, createdAt: daysAgo(0) },
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
    contacts,
    ghostPersonas,
    ghostSessions,
    liveCallRiskEntries,
    slackDigestConfig: { channel: '#cosella-wins', sendTime: '18:00', bigWinThreshold: 10000 },
    calls,
    connectedIntegrations: ['stripe', 'slack'],
    auditLog: [{ id: crypto.randomUUID(), action: 'org-seeded', actor: adminName, timestamp: new Date().toISOString(), detail: `${orgName} created` }],
  }
}
