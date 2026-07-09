import { describe, it, expect, beforeEach } from 'vitest'
import { getCosellaAccount, setCosellaAccount, getActiveMemberEmail, setActiveMemberEmail } from './cosellaAccounts'

describe('cosellaAccounts', () => {
  beforeEach(() => localStorage.clear())

  it('returns null for an unknown email', () => {
    expect(getCosellaAccount('nobody@example.com')).toBeNull()
  })

  it('stores and retrieves an account record, case-insensitively', () => {
    setCosellaAccount('Admin@Acme.com', { accountType: 'cosella-admin', orgName: 'Acme Closers' })
    expect(getCosellaAccount('admin@acme.com')).toEqual({ accountType: 'cosella-admin', orgName: 'Acme Closers' })
  })

  it('tracks the active signed-in member email', () => {
    expect(getActiveMemberEmail()).toBeNull()
    setActiveMemberEmail('Jordan@Acme.com')
    expect(getActiveMemberEmail()).toBe('jordan@acme.com')
  })
})
