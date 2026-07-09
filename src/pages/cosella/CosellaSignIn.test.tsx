// src/pages/cosella/CosellaSignIn.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import CosellaSignIn from './CosellaSignIn'
import { createOrg, demoSeedCosellaOrg, addMember, getActiveAdminEmail } from './cosellaOrgStore'
import { setCosellaAccount, getActiveMemberEmail } from './cosellaAccounts'

function renderSignIn(initialPath = '/cosella/sign-in') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/cosella/sign-in" element={<CosellaSignIn />} />
        <Route path="/cosella/dashboard" element={<p>Dashboard landed</p>} />
        <Route path="/cosella/app" element={<p>App landed</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CosellaSignIn', () => {
  beforeEach(() => localStorage.clear())

  it('signs an existing admin account in and routes to the dashboard', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    setCosellaAccount('ada@acme.com', { accountType: 'cosella-admin', orgName: 'Acme Closers' })
    renderSignIn()

    fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: 'ada@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'anything' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByText('Dashboard landed')).toBeInTheDocument()
    expect(getActiveAdminEmail()).toBe('ada@acme.com')
  })

  it('activates a member seat with a correct invite code and routes to the app', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
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
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
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
