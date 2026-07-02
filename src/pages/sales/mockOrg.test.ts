import { describe, it, expect, beforeEach } from 'vitest'
import { demoSeedOrg } from './mockOrg'

describe('demoSeedOrg', () => {
  beforeEach(() => localStorage.clear())

  it('seeds an enterprise org with the admin plus 4 demo reps', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    expect(org.planTier).toBe('enterprise')
    expect(org.members).toHaveLength(5)
    expect(org.members[0]).toMatchObject({ name: 'Ada Admin', email: 'admin@acme.com', role: 'admin' })
    expect(org.calls.some(c => c.repName === 'Jordan Lee')).toBe(true)
  })

  it('seeds an individual org with only the admin as a member, and all calls attributed to them', () => {
    const org = demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual')
    expect(org.planTier).toBe('individual')
    expect(org.members).toHaveLength(1)
    expect(org.members[0]).toMatchObject({ name: 'Sam Solo', email: 'solo@example.com', role: 'admin' })
    expect(org.calls.length).toBeGreaterThan(0)
    expect(org.calls.every(c => c.repEmail === 'solo@example.com' && c.repName === 'Sam Solo')).toBe(true)
  })

  it('still seeds a populated knowledge base for individual orgs', () => {
    const org = demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual')
    expect(org.knowledgeBase.documents.length).toBeGreaterThan(0)
  })
})
