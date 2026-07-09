import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import PlanTracker from './PlanTracker'
import { createOrg, demoSeedCloserOrg, getOrgByAdminEmail } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<PlanTracker />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('PlanTracker', () => {
  beforeEach(() => localStorage.clear())

  it('lists every payment plan with a risk badge', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Jamie Whitfield')).toBeInTheDocument()
    expect(screen.getByText('Morgan Reyes')).toBeInTheDocument()
    expect(screen.getAllByText(/red|yellow|green/i).length).toBeGreaterThan(0)
  })

  it('opens a plan detail with the matching recovery script for a red-risk plan', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    fireEvent.click(screen.getByText('Morgan Reyes')) // seeded red-risk plan
    expect(screen.getByText(/recovery script/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reminder now/i })).toBeInTheDocument()
  })

  it('logs an audit entry when sending a reminder', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    fireEvent.click(screen.getByText('Morgan Reyes'))
    fireEvent.click(screen.getByRole('button', { name: /send reminder now/i }))
    expect(getOrgByAdminEmail('ada@acme.com')!.auditLog.some(a => a.action === 'reminder-sent')).toBe(true)
  })
})
