import { describe, it, expect, beforeEach } from 'vitest'
import { resolveContextDocs } from './resolveContextDocs'
import { setAccount } from './mockAccounts'
import { createOrg, demoSeedOrg, addMember, markMemberSeatPaid } from '@/pages/sales/mockOrg'
import { MOCK_CONTEXT_SOURCES } from '@/lib/mockContextSources'

describe('resolveContextDocs', () => {
  beforeEach(() => localStorage.clear())

  it('returns the personal Context library for a regular account', () => {
    setAccount('me@example.com', { accountType: 'regular', planId: 'premium' })
    const docs = resolveContextDocs('me@example.com')
    expect(docs.map(d => d.name)).toEqual(MOCK_CONTEXT_SOURCES.map(s => s.name))
  })

  it('returns the personal Context library for a sales-individual account', () => {
    setAccount('solo@example.com', { accountType: 'sales-individual' })
    const docs = resolveContextDocs('solo@example.com')
    expect(docs.map(d => d.name)).toEqual(MOCK_CONTEXT_SOURCES.map(s => s.name))
  })

  it('returns the personal Context library when there is no account on record', () => {
    const docs = resolveContextDocs('nobody@example.com')
    expect(docs.map(d => d.name)).toEqual(MOCK_CONTEXT_SOURCES.map(s => s.name))
  })

  it('returns only enabled org Knowledge Base documents for an enterprise-admin account', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    createOrg('admin@acme.com', org)
    setAccount('admin@acme.com', { accountType: 'enterprise-admin', orgName: 'Acme Team' })
    const docs = resolveContextDocs('admin@acme.com')
    const enabledNames = org.knowledgeBase.documents.filter(d => d.enabled).map(d => d.name)
    expect(docs.map(d => d.name).sort()).toEqual(enabledNames.sort())
    expect(docs.some(d => d.name === 'Security & Compliance Overview.pdf')).toBe(false) // seeded disabled
  })

  it('returns the org Knowledge Base for an enterprise-member account, looked up via their membership', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    createOrg('admin@acme.com', org)
    const newMember = addMember('admin@acme.com', { name: 'Rep One', email: 'rep@acme.com' })!
    markMemberSeatPaid('admin@acme.com', newMember.id)
    setAccount('rep@acme.com', { accountType: 'enterprise-member', orgName: 'Acme Team' })
    const docs = resolveContextDocs('rep@acme.com')
    expect(docs.length).toBeGreaterThan(0)
    expect(docs.every(d => org.knowledgeBase.documents.some(kd => kd.name === d.name && kd.enabled))).toBe(true)
  })
})
