// src/pages/closerOS/dashboard/LiveRescueBoard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import LiveRescueBoard from './LiveRescueBoard'
import { demoSeedCloserOrg, getOrgByAdminEmail, createOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<LiveRescueBoard />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('LiveRescueBoard', () => {
  it('shows unresolved risk entries as red/yellow cards with rescue actions', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Riley Chen')).toBeInTheDocument() // unresolved red entry
    expect(screen.getAllByRole('button', { name: /whisper/i }).length).toBeGreaterThan(0)
  })

  it('does not show an action row for an already-resolved entry', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    const avery = screen.getByText('Avery Stone').closest('div.lf-panel')!
    expect(avery).toHaveTextContent(/saved/i) // resolved in the seed data
  })

  it('resolving a rescue writes the outcome to the store', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    const rileyEntryId = org.liveCallRiskEntries.find(e => e.prospectName === 'Riley Chen')!.id
    fireEvent.click(screen.getAllByRole('button', { name: /whisper/i })[0]) // Riley Chen is the first unresolved entry in the seed
    fireEvent.click(screen.getByRole('button', { name: /mark saved/i }))

    const updatedEntry = getOrgByAdminEmail('ada@acme.com')!.liveCallRiskEntries.find(e => e.id === rileyEntryId)!
    expect(updatedEntry.rescueLog).toEqual(expect.objectContaining({ mode: 'whisper', outcome: 'saved' }))
  })

  it('simulates a new live call and adds it to the board', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    const before = org.liveCallRiskEntries.length
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    fireEvent.click(screen.getByRole('button', { name: /simulate a live call/i }))
    expect(getOrgByAdminEmail('ada@acme.com')!.liveCallRiskEntries.length).toBe(before + 1)
  })
})
