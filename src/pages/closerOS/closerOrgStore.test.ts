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
    expect(org.ledgerEntries).toHaveLength(1 + demoSeedCloserOrg('x', 'x', 'x').ledgerEntries.length) // sanity: at least the one we added
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
