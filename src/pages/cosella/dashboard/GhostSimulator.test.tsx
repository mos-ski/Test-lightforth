// src/pages/cosella/dashboard/GhostSimulator.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import GhostSimulator from './GhostSimulator'
import { demoSeedCosellaOrg, getOrgByAdminEmail, createOrg } from '../cosellaOrgStore'
import type { CosellaDashboardContext } from './CosellaAdminLayout'

function renderWithContext(context: CosellaDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<GhostSimulator />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('GhostSimulator', () => {
  it('lists ghost personas and the practice leaderboard', () => {
    const org = demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByText(/ghost of price objection/i)).toBeInTheDocument()
    expect(screen.getByText('Sam Patel')).toBeInTheDocument() // top scorer (88) in seeded ghostSessions
  })

  it('runs a practice session and records the score', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    fireEvent.click(screen.getAllByRole('button', { name: /^practice$/i })[0])
    fireEvent.change(screen.getByLabelText(/closer name/i), { target: { value: 'Riley Chen' } })
    fireEvent.change(screen.getByLabelText(/score/i), { target: { value: '90' } })
    fireEvent.click(screen.getByRole('checkbox', { name: /objections handled/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /payment asked/i }))
    fireEvent.click(screen.getByRole('button', { name: /submit session/i }))

    const updated = getOrgByAdminEmail('ada@acme.com')!
    expect(updated.ghostSessions.some(s => s.closerName === 'Riley Chen' && s.score === 90)).toBe(true)
  })
})
