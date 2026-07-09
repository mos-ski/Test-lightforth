import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import CloserOSDesktopApp from './CloserOSDesktopApp'
import { createOrg, demoSeedCloserOrg, addMember, getOrgByAdminEmail } from '../closerOrgStore'
import { setActiveMemberEmail, setCloserAccount } from '../closerAccounts'

function renderApp(initialEntry = '/closer-os/app') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/closer-os/app" element={<CloserOSDesktopApp />} />
        <Route path="/closer-os/dashboard" element={<p>Dashboard landed</p>} />
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

  it('shows an inline sign-in screen (inside the app shell) when no one is signed in', () => {
    renderApp()
    expect(screen.getByText('Sign in to Closer OS')).toBeInTheDocument()
  })

  it('signs an already-activated member in inline and lands on setup, without leaving the app route', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const member = addMember('ada@acme.com', { name: 'Jordan Lee', email: 'jordan@acme.com' })!
    setCloserAccount(member.email, { accountType: 'closer-os-member', orgName: 'Acme Closers' })

    renderApp()
    fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: member.email } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'anything' } })
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(screen.getByText('Start a Sales Call')).toBeInTheDocument()
  })

  it('activates a member via invite code inline and lands on setup', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const member = addMember('ada@acme.com', { name: 'Jordan Lee', email: 'jordan@acme.com' })!

    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /i have an invite code/i }))
    fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: member.email } })
    fireEvent.change(screen.getByPlaceholderText('Invite code'), { target: { value: member.inviteCode } })
    fireEvent.change(screen.getByPlaceholderText('Create a password'), { target: { value: 'newpassword' } })
    fireEvent.click(screen.getByRole('button', { name: /activate seat/i }))

    expect(screen.getByText('Start a Sales Call')).toBeInTheDocument()
  })

  it('routes an admin account to the dashboard, not the closer app', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    setCloserAccount('ada@acme.com', { accountType: 'closer-os-admin', orgName: 'Acme Closers' })

    renderApp('/closer-os/app?email=ada%40acme.com')
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'anything' } })
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(screen.getByText('Dashboard landed')).toBeInTheDocument()
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

  it('records the full deal value in the ledger for a payment-plan close, not just the first installment', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const member = addMember('ada@acme.com', { name: 'Jordan Lee', email: 'jordan@acme.com' })!
    setActiveMemberEmail(member.email)

    renderApp()

    fireEvent.change(screen.getByLabelText(/prospect/i), { target: { value: 'Casey Nguyen' } })
    fireEvent.change(screen.getByLabelText(/deal type/i), { target: { value: 'Core Program' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    fireEvent.click(screen.getByRole('button', { name: /start call/i }))

    for (let i = 0; i < 4; i++) advanceOneTurn()
    act(() => { vi.advanceTimersByTime(3000) })
    fireEvent.click(screen.getByRole('button', { name: /send plan link/i }))
    act(() => { vi.advanceTimersByTime(4000) })
    fireEvent.click(screen.getByRole('button', { name: /end call/i }))

    const org = getOrgByAdminEmail('ada@acme.com')!
    const deal = org.deals.find(d => d.prospectName === 'Casey Nguyen' && d.closerName === 'Jordan Lee')!
    expect(deal.status).toBe('paid')
    const ledgerEntry = org.ledgerEntries.find(e => e.dealId === deal.id)
    expect(ledgerEntry?.dollarValue).toBe(deal.priceOption.pif)
    expect(ledgerEntry?.dollarValue).not.toBe(deal.priceOption.planInstallments[0])
    expect(org.paymentPlans.some(p => p.dealId === deal.id)).toBe(true)
  })

  it('marks the deal lost (not left "open") when the call ends via a danger resolution marked lost', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const member = addMember('ada@acme.com', { name: 'Jordan Lee', email: 'jordan@acme.com' })!
    setActiveMemberEmail(member.email)

    renderApp()

    fireEvent.change(screen.getByLabelText(/prospect/i), { target: { value: 'Casey Nguyen' } })
    fireEvent.change(screen.getByLabelText(/deal type/i), { target: { value: 'Core Program' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    fireEvent.click(screen.getByRole('button', { name: /start call/i }))

    // Advance to, and through, the danger-signal turn (turn index 2): two turns to get there,
    // then one more timer advance to finish typing it and let the whisper cascade (1500ms) fire.
    advanceOneTurn()
    advanceOneTurn()
    act(() => { vi.advanceTimersByTime(3000) })

    fireEvent.click(screen.getByRole('button', { name: /mark deal lost/i }))
    fireEvent.click(screen.getByRole('button', { name: /end call/i }))

    const org = getOrgByAdminEmail('ada@acme.com')!
    const deal = org.deals.find(d => d.prospectName === 'Casey Nguyen' && d.closerName === 'Jordan Lee')
    expect(deal?.status).toBe('lost')
    const call = org.calls.find(c => c.closerEmail === 'jordan@acme.com')
    expect(call?.outcome).toBe('lost')
    const riskEntry = org.liveCallRiskEntries.find(e => e.prospectName === 'Casey Nguyen')
    expect(riskEntry?.rescueLog?.outcome).toBe('lost')
  })
})
