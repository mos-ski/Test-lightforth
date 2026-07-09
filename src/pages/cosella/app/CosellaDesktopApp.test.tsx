import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import CosellaDesktopApp from './CosellaDesktopApp'
import { createOrg, demoSeedCosellaOrg, addMember, getOrgByAdminEmail } from '../cosellaOrgStore'
import { setActiveMemberEmail, setCosellaAccount } from '../cosellaAccounts'

function renderApp(initialEntry = '/cosella/app') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/cosella/app" element={<CosellaDesktopApp />} />
        <Route path="/cosella/dashboard" element={<p>Dashboard landed</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

function advanceOneTurn() {
  act(() => { vi.advanceTimersByTime(3500) }) // finish typing the question, the processing pause, and the response
  fireEvent.keyDown(window, { code: 'Space' })
}

describe('CosellaDesktopApp', () => {
  beforeEach(() => { localStorage.clear(); vi.useFakeTimers() })
  afterEach(() => vi.useRealTimers())

  it('shows an inline sign-in screen (inside the app shell) when no one is signed in', () => {
    renderApp()
    expect(screen.getByText('Sign in to Cosella')).toBeInTheDocument()
  })

  it('signs an already-activated member in inline and lands on setup, without leaving the app route', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const member = addMember('ada@acme.com', { name: 'Jordan Lee', email: 'jordan@acme.com' })!
    setCosellaAccount(member.email, { accountType: 'cosella-member', orgName: 'Acme Closers' })

    renderApp()
    fireEvent.change(screen.getByPlaceholderText('you@company.com'), { target: { value: member.email } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'anything' } })
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(screen.getByText('Start a Sales Call')).toBeInTheDocument()
  })

  it('activates a member via invite code inline and lands on setup', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
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
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    setCosellaAccount('ada@acme.com', { accountType: 'cosella-admin', orgName: 'Acme Closers' })

    renderApp('/cosella/app?email=ada%40acme.com')
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'anything' } })
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(screen.getByText('Dashboard landed')).toBeInTheDocument()
  })

  it('walks a signed-in closer through setup, prospect card, a full paid call, and writes the deal + ledger + call record', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
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
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
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
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
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

  it('walks a closer through the Phone Call tab: pick an assigned contact, ring, then land on the live phone canvas', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const member = addMember('ada@acme.com', { name: 'Jordan Lee', email: 'jordan@acme.com' })!
    setActiveMemberEmail(member.email)

    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /^phone call$/i }))

    // Only contacts assigned to this rep show up — the seed assigns "Reese Donovan" to Jordan Lee.
    fireEvent.change(screen.getByLabelText(/contact/i), { target: { value: 'Reese Donovan' } })
    fireEvent.change(screen.getByLabelText(/deal type/i), { target: { value: 'Core Program' } })
    fireEvent.click(screen.getByRole('button', { name: /^call$/i }))

    expect(screen.getByText(/calling reese donovan/i)).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(2500) })

    expect(screen.getAllByText(/live phone call/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Reese Donovan/)).toBeInTheDocument()

    for (let i = 0; i < 4; i++) advanceOneTurn()
    act(() => { vi.advanceTimersByTime(3000) })
    fireEvent.click(screen.getByRole('button', { name: /send pif link/i }))
    act(() => { vi.advanceTimersByTime(4000) })
    fireEvent.click(screen.getByRole('button', { name: /end call/i }))

    const org = getOrgByAdminEmail('ada@acme.com')!
    const deal = org.deals.find(d => d.prospectName === 'Reese Donovan' && d.closerName === 'Jordan Lee')
    expect(deal?.status).toBe('paid')
  })

  it('a rep with no contacts assigned to them can still call an unclaimed one, which then gets assigned to them', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const member = addMember('ada@acme.com', { name: 'Riley Chen', email: 'riley@acme.com' })!
    setActiveMemberEmail(member.email)

    renderApp()
    fireEvent.click(screen.getByRole('button', { name: /^phone call$/i }))

    // Riley has no personal assignments, but the seed leaves a few contacts unclaimed.
    expect(screen.queryByText(/no contacts to call yet/i)).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/contact/i), { target: { value: 'Emerson Blake' } })
    fireEvent.change(screen.getByLabelText(/deal type/i), { target: { value: 'Core Program' } })
    fireEvent.click(screen.getByRole('button', { name: /^call$/i }))

    expect(screen.getByText(/calling emerson blake/i)).toBeInTheDocument()

    const org = getOrgByAdminEmail('ada@acme.com')!
    expect(org.contacts.find(c => c.name === 'Emerson Blake')?.assignedTo).toBe('riley@acme.com')
  })
})
