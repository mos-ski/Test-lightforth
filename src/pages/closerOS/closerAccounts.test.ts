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
