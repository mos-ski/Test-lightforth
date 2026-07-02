// Mock, localStorage-backed sales-org registry so the Enterprise admin
// dashboard can demo team management and per-seat billing without a real backend.

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
  inviteCode: string
  seatPaid: boolean
}

export interface KnowledgeDocument {
  id: string
  name: string
  enabled: boolean
}

export interface KnowledgeFaq {
  id: string
  question: string
  answer: string
  enabled: boolean
}

export interface KnowledgeCenterEntry {
  id: string
  title: string
  body: string
  lastUpdated: string | null
  /** The default "Uncategorized" bucket — always present, can be toggled but not deleted. */
  permanent: boolean
  enabled: boolean
}

export function defaultKnowledgeCenterEntries(): KnowledgeCenterEntry[] {
  return [{ id: crypto.randomUUID(), title: 'Uncategorized', body: '', lastUpdated: null, permanent: true, enabled: true }]
}

export interface KnowledgeTextEntry {
  id: string
  body: string
  enabled: boolean
}

export type LinkType = 'website' | 'email' | 'phone' | 'social' | 'other'

export interface KnowledgeLink {
  id: string
  type: LinkType
  label: string
  value: string
  /** Only meaningful for 'website' — AI can actually scrape a page; other types are just reference info. */
  status: 'scraping' | 'scraped' | 'saved'
  enabled: boolean
}

export interface KnowledgeBaseData {
  documents: KnowledgeDocument[]
  faqs: KnowledgeFaq[]
  knowledgeCenter: KnowledgeCenterEntry[]
  text: KnowledgeTextEntry[]
  links: KnowledgeLink[]
}

export function emptyKnowledgeBase(): KnowledgeBaseData {
  return { documents: [], faqs: [], knowledgeCenter: defaultKnowledgeCenterEntries(), text: [], links: [] }
}

export interface CallRecord {
  id: string
  repEmail: string
  repName: string
  date: string
  durationSeconds: number
  transcript: { speaker: string; text: string }[]
}

export interface SalesOrg {
  orgName: string
  planTier: 'individual' | 'enterprise'
  setupFeePaid: boolean
  knowledgeBase: KnowledgeBaseData
  members: TeamMember[]
  calls: CallRecord[]
  connectedIntegrations: string[]
}

const ORGS_KEY = 'lightforth-sales-orgs'
const ACTIVE_ADMIN_KEY = 'lightforth-sales-active-admin'

/**
 * Repairs orgs created by an earlier shape of this mock store (e.g. before the
 * Knowledge Base categories were restructured) so old test data doesn't get
 * stuck looking "broken" forever — every read self-heals to the current shape.
 */
function normalizeOrg(org: SalesOrg): SalesOrg {
  const knowledgeCenter = org.knowledgeBase?.knowledgeCenter ?? []
  const hasUncategorized = knowledgeCenter.some(k => k.permanent)
  return {
    ...org,
    planTier: org.planTier ?? 'enterprise',
    calls: org.calls ?? [],
    connectedIntegrations: org.connectedIntegrations ?? [],
    knowledgeBase: {
      documents: org.knowledgeBase?.documents ?? [],
      faqs: org.knowledgeBase?.faqs ?? [],
      text: org.knowledgeBase?.text ?? [],
      links: org.knowledgeBase?.links ?? [],
      knowledgeCenter: hasUncategorized ? knowledgeCenter : [...defaultKnowledgeCenterEntries(), ...knowledgeCenter],
    },
  }
}

function readStore(): Record<string, SalesOrg> {
  try {
    const raw = localStorage.getItem(ORGS_KEY)
    const parsed: Record<string, SalesOrg> = raw ? JSON.parse(raw) : {}
    const normalized: Record<string, SalesOrg> = {}
    for (const [key, org] of Object.entries(parsed)) normalized[key] = normalizeOrg(org)
    return normalized
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, SalesOrg>) {
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

export function getOrgByAdminEmail(adminEmail: string): SalesOrg | null {
  const store = readStore()
  return store[normalizeEmail(adminEmail)] ?? null
}

export function findMemberByEmail(email: string): { adminEmail: string; org: SalesOrg; member: TeamMember } | null {
  const store = readStore()
  const target = normalizeEmail(email)
  for (const [adminEmail, org] of Object.entries(store)) {
    const member = org.members.find(m => normalizeEmail(m.email) === target)
    if (member) return { adminEmail, org, member }
  }
  return null
}

export function createOrg(adminEmail: string, org: SalesOrg): void {
  const store = readStore()
  store[normalizeEmail(adminEmail)] = org
  writeStore(store)
}

export function updateOrg(adminEmail: string, updater: (org: SalesOrg) => SalesOrg): SalesOrg | null {
  const store = readStore()
  const key = normalizeEmail(adminEmail)
  const current = store[key]
  if (!current) return null
  const next = updater(current)
  store[key] = next
  writeStore(store)
  return next
}

export function addMember(adminEmail: string, member: { name: string; email: string }): TeamMember | null {
  const newMember: TeamMember = {
    id: crypto.randomUUID(),
    name: member.name,
    email: member.email,
    role: 'member',
    inviteCode: generateInviteCode(),
    seatPaid: false,
  }
  const updated = updateOrg(adminEmail, org => ({ ...org, members: [...org.members, newMember] }))
  return updated ? newMember : null
}

export function markMemberSeatPaid(adminEmail: string, memberId: string): void {
  updateOrg(adminEmail, org => ({
    ...org,
    members: org.members.map(m => (m.id === memberId ? { ...m, seatPaid: true } : m)),
  }))
}

// --- Knowledge base: Documents ---------------------------------------------

export function addDocument(adminEmail: string, name: string): void {
  const item: KnowledgeDocument = { id: crypto.randomUUID(), name, enabled: true }
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, documents: [...org.knowledgeBase.documents, item] } }))
}

export function removeDocument(adminEmail: string, id: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, documents: org.knowledgeBase.documents.filter(d => d.id !== id) } }))
}

export function toggleDocument(adminEmail: string, id: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, documents: org.knowledgeBase.documents.map(d => (d.id === id ? { ...d, enabled: !d.enabled } : d)) } }))
}

// --- Knowledge base: FAQs ----------------------------------------------------

export function addFaq(adminEmail: string, faq: { question: string; answer: string }): void {
  const item: KnowledgeFaq = { id: crypto.randomUUID(), ...faq, enabled: true }
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, faqs: [...org.knowledgeBase.faqs, item] } }))
}

export function updateFaq(adminEmail: string, id: string, faq: { question: string; answer: string }): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, faqs: org.knowledgeBase.faqs.map(f => (f.id === id ? { ...f, ...faq } : f)) } }))
}

export function removeFaq(adminEmail: string, id: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, faqs: org.knowledgeBase.faqs.filter(f => f.id !== id) } }))
}

export function toggleFaq(adminEmail: string, id: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, faqs: org.knowledgeBase.faqs.map(f => (f.id === id ? { ...f, enabled: !f.enabled } : f)) } }))
}

// --- Knowledge base: Knowledge Center (titled policies/instructions) -------

export function addKnowledgeCenterCategory(adminEmail: string, title: string): void {
  const item: KnowledgeCenterEntry = { id: crypto.randomUUID(), title, body: '', lastUpdated: null, permanent: false, enabled: true }
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, knowledgeCenter: [...org.knowledgeBase.knowledgeCenter, item] } }))
}

export function saveKnowledgeCenterBody(adminEmail: string, id: string, body: string): void {
  updateOrg(adminEmail, org => ({
    ...org,
    knowledgeBase: {
      ...org.knowledgeBase,
      knowledgeCenter: org.knowledgeBase.knowledgeCenter.map(k => (k.id === id ? { ...k, body, lastUpdated: new Date().toISOString() } : k)),
    },
  }))
}

export function removeKnowledgeCenterEntry(adminEmail: string, id: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, knowledgeCenter: org.knowledgeBase.knowledgeCenter.filter(k => k.id !== id) } }))
}

export function toggleKnowledgeCenterEntry(adminEmail: string, id: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, knowledgeCenter: org.knowledgeBase.knowledgeCenter.map(k => (k.id === id ? { ...k, enabled: !k.enabled } : k)) } }))
}

// --- Knowledge base: Text (untitled freeform notes) -------------------------

export function addTextEntry(adminEmail: string, body: string): void {
  const item: KnowledgeTextEntry = { id: crypto.randomUUID(), body, enabled: true }
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, text: [...org.knowledgeBase.text, item] } }))
}

export function updateTextEntry(adminEmail: string, id: string, body: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, text: org.knowledgeBase.text.map(t => (t.id === id ? { ...t, body } : t)) } }))
}

export function removeTextEntry(adminEmail: string, id: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, text: org.knowledgeBase.text.filter(t => t.id !== id) } }))
}

export function toggleTextEntry(adminEmail: string, id: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, text: org.knowledgeBase.text.map(t => (t.id === id ? { ...t, enabled: !t.enabled } : t)) } }))
}

// --- Knowledge base: Links (website, email, phone, social, or anything else) ---

export function addLink(adminEmail: string, link: { type: LinkType; label: string; value: string }): KnowledgeLink | null {
  const item: KnowledgeLink = { id: crypto.randomUUID(), ...link, status: link.type === 'website' ? 'scraping' : 'saved', enabled: true }
  const updated = updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, links: [...org.knowledgeBase.links, item] } }))
  return updated ? item : null
}

export function markLinkScraped(adminEmail: string, id: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, links: org.knowledgeBase.links.map(l => (l.id === id ? { ...l, status: 'scraped' as const } : l)) } }))
}

export function removeLink(adminEmail: string, id: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, links: org.knowledgeBase.links.filter(l => l.id !== id) } }))
}

export function toggleLink(adminEmail: string, id: string): void {
  updateOrg(adminEmail, org => ({ ...org, knowledgeBase: { ...org.knowledgeBase, links: org.knowledgeBase.links.map(l => (l.id === id ? { ...l, enabled: !l.enabled } : l)) } }))
}

// --- Call history -------------------------------------------------------------

export function recordCall(adminEmail: string, call: Omit<CallRecord, 'id'>): void {
  const item: CallRecord = { id: crypto.randomUUID(), ...call }
  updateOrg(adminEmail, org => ({ ...org, calls: [item, ...org.calls] }))
}

export function getCallsForOrg(adminEmail: string): CallRecord[] {
  return getOrgByAdminEmail(adminEmail)?.calls ?? []
}

// --- Integrations ---------------------------------------------------------

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

/** Days-ago helper for believable, always-recent-looking demo timestamps. */
function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()
}

/**
 * A fully populated demo org — used at signup so the dashboard shows real
 * content everywhere instead of empty states. Generic enough not to look like
 * it belongs to a specific other company.
 */
export function demoSeedOrg(adminEmail: string, adminName: string, orgName: string, planTier: 'individual' | 'enterprise'): SalesOrg {
  const domain = emailDomain(adminEmail)
  const reps = planTier === 'enterprise'
    ? [
        { name: 'Jordan Lee', local: 'jordan', seatPaid: true },
        { name: 'Sam Patel', local: 'sam', seatPaid: true },
        { name: 'Taylor Brooks', local: 'taylor', seatPaid: false },
        { name: 'Morgan Reyes', local: 'morgan', seatPaid: true },
      ]
    : []
  const members: TeamMember[] = [
    { id: crypto.randomUUID(), name: adminName, email: adminEmail, role: 'admin', inviteCode: generateInviteCode(), seatPaid: true },
    ...reps.map(r => ({
      id: crypto.randomUUID(),
      name: r.name,
      email: `${r.local}@${domain}`,
      role: 'member' as const,
      inviteCode: generateInviteCode(),
      seatPaid: r.seatPaid,
    })),
  ]

  const knowledgeBase: KnowledgeBaseData = {
    documents: [
      { id: crypto.randomUUID(), name: 'Sales Playbook 2026.pdf', enabled: true },
      { id: crypto.randomUUID(), name: 'Pricing & Packaging Guide.pdf', enabled: true },
      { id: crypto.randomUUID(), name: 'Competitor Battlecards.pdf', enabled: true },
      { id: crypto.randomUUID(), name: 'Customer Case Studies.pdf', enabled: true },
      { id: crypto.randomUUID(), name: 'Security & Compliance Overview.pdf', enabled: false },
    ],
    faqs: [
      { id: crypto.randomUUID(), question: 'Do you offer a free trial?', answer: 'Yes — every new account gets a 14-day free trial with full feature access, no credit card required.', enabled: true },
      { id: crypto.randomUUID(), question: "What's included in the Enterprise plan?", answer: 'Unlimited team seats, a dedicated knowledge base, priority support, and a named onboarding specialist.', enabled: true },
      { id: crypto.randomUUID(), question: 'Can we cancel anytime?', answer: 'Yes, monthly plans can be cancelled anytime with no penalty. Annual plans are billed upfront but cancel effective end of term.', enabled: true },
      { id: crypto.randomUUID(), question: 'Do you integrate with Salesforce?', answer: 'Yes — we have a native two-way Salesforce integration that syncs calls, notes, and deal stages automatically.', enabled: true },
      { id: crypto.randomUUID(), question: 'Is our data secure?', answer: "All data is encrypted at rest and in transit, and we're SOC 2 Type II certified.", enabled: true },
    ],
    knowledgeCenter: [
      ...defaultKnowledgeCenterEntries(),
      { id: crypto.randomUUID(), title: 'Refund Policy', body: "Customers can request a full refund within 30 days of purchase if they're not satisfied. Refunds are processed within 5-7 business days back to the original payment method.", lastUpdated: daysAgo(12), permanent: false, enabled: true },
      { id: crypto.randomUUID(), title: 'Objection Handling', body: "When a prospect says it's too expensive, reframe around ROI — ask what the cost of the status quo is. When they say 'we need to think about it,' propose a specific next step with a deadline rather than leaving it open-ended.", lastUpdated: daysAgo(5), permanent: false, enabled: true },
      { id: crypto.randomUUID(), title: 'Escalation Procedure', body: 'If a deal is stuck after two rounds of objection handling, loop in your manager via Slack with a one-line summary. For any discount above 20%, get manager sign-off before quoting.', lastUpdated: daysAgo(20), permanent: false, enabled: true },
      { id: crypto.randomUUID(), title: 'Onboarding Process', body: 'Once a deal closes, the customer gets a welcome email within 1 business day, a kickoff call within 5 business days, and a dedicated CSM for the first 90 days.', lastUpdated: daysAgo(2), permanent: false, enabled: true },
    ],
    text: [
      { id: crypto.randomUUID(), body: 'Remember to mention the new annual billing discount (20% off) when a prospect asks about pricing flexibility.', enabled: true },
      { id: crypto.randomUUID(), body: "Q3 emphasis: lead with the new analytics dashboard — it's resonating well with mid-market prospects.", enabled: true },
      { id: crypto.randomUUID(), body: 'If a prospect mentions a competitor by name, pull up the relevant battlecard before responding.', enabled: true },
    ],
    links: [
      { id: crypto.randomUUID(), type: 'website', label: 'Pricing page', value: `https://${domain || 'yourcompany.com'}/pricing`, status: 'scraped', enabled: true },
      { id: crypto.randomUUID(), type: 'email', label: 'Sales', value: `sales@${domain || 'yourcompany.com'}`, status: 'saved', enabled: true },
      { id: crypto.randomUUID(), type: 'phone', label: 'Support line', value: '+1 (555) 234-5678', status: 'saved', enabled: true },
      { id: crypto.randomUUID(), type: 'social', label: 'LinkedIn', value: `https://linkedin.com/company/${domain.split('.')[0] || 'yourcompany'}`, status: 'saved', enabled: true },
    ],
  }

  const callAuthorCycle = planTier === 'individual'
    ? [{ name: adminName, email: adminEmail }]
    : [
        { name: 'Jordan Lee', email: `jordan@${domain}` },
        { name: 'Sam Patel', email: `sam@${domain}` },
        { name: 'Morgan Reyes', email: `morgan@${domain}` },
      ]

  const callTemplates = [
    {
      daysAgoN: 1, durationSeconds: 612,
      transcript: [
        { speaker: 'Prospect', text: "Look, I like the product, but the price point is a stretch for us this quarter." },
        { speaker: 'Rep', text: "I hear you on budget — a lot of our customers felt the same before they saw the time saved. What if we started with the core tier and revisited expansion next quarter?" },
        { speaker: 'Prospect', text: "That could work. Can you send over a proposal?" },
        { speaker: 'Rep', text: "Absolutely, I'll have it in your inbox by Thursday." },
      ],
    },
    {
      daysAgoN: 2, durationSeconds: 845,
      transcript: [
        { speaker: 'Prospect', text: "What makes you different from your competitors?" },
        { speaker: 'Rep', text: "We integrate natively with your existing stack — no migration needed. A similar customer cut onboarding time by 60% switching to us." },
      ],
    },
    {
      daysAgoN: 4, durationSeconds: 503,
      transcript: [
        { speaker: 'Prospect', text: "We're already locked into a contract with another vendor until next year." },
        { speaker: 'Rep', text: "Totally understand — a lot of teams start with a pilot on a smaller team so you're ready to switch the moment your contract's up." },
      ],
    },
    {
      daysAgoN: 6, durationSeconds: 721,
      transcript: [
        { speaker: 'Prospect', text: "How long does implementation usually take?" },
        { speaker: 'Rep', text: "Most teams are fully live within two weeks, including data migration and rep onboarding." },
      ],
    },
    {
      daysAgoN: 9, durationSeconds: 398,
      transcript: [
        { speaker: 'Prospect', text: "Can you send over a proposal by end of week?" },
        { speaker: 'Rep', text: "Absolutely, I'll have it in your inbox by Thursday. Should we put 30 minutes on the calendar Friday to walk through it together?" },
      ],
    },
  ]

  const calls: CallRecord[] = callTemplates.map((t, i) => {
    const author = callAuthorCycle[i % callAuthorCycle.length]
    return {
      id: crypto.randomUUID(),
      repEmail: author.email,
      repName: author.name,
      date: daysAgo(t.daysAgoN),
      durationSeconds: t.durationSeconds,
      transcript: t.transcript.map(line => ({ speaker: line.speaker === 'Rep' ? author.name : line.speaker, text: line.text })),
    }
  })

  return {
    orgName,
    planTier,
    setupFeePaid: true,
    knowledgeBase,
    members,
    calls,
    connectedIntegrations: ['salesforce', 'slack'],
  }
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
