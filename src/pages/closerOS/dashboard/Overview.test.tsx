import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Overview from './Overview'
import { demoSeedCloserOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<Overview />} />
        </Route>
        <Route path="/closer-os/app" element={<p>App landed</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Overview', () => {
  it('shows cash collected, deals saved, money leaked, a leaderboard, and the guarantee tracker', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    // "Cash collected" appears in both card label and table header, so check that at least one exists
    expect(screen.getAllByText('Cash collected').length).toBeGreaterThan(0)
    expect(screen.getByText('Deals saved')).toBeInTheDocument()
    expect(screen.getByText('Money leaked')).toBeInTheDocument()
    expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    expect(screen.getByText('Guarantee tracker')).toBeInTheDocument()
    // Sam Patel has the single largest seeded ledger entry ($18,599 assisted), so leads the cash leaderboard.
    const rows = screen.getAllByRole('row').slice(1) // drop the header row
    expect(rows[0]).toHaveTextContent('Sam Patel')

    // Regression: the seeded lost call must join to a deal (Drew Sanders' $12,599 Core Program deal),
    // otherwise "Money leaked" silently computes to $0 despite showing "1 lost call". Scoped to the
    // money-leaked panel specifically since $12,599 also appears elsewhere (two closers' cash totals).
    const moneyLeakedPanel = screen.getByText('Money leaked').closest('.lf-panel')
    expect(moneyLeakedPanel).toHaveTextContent('$12,599')
    expect(moneyLeakedPanel).not.toHaveTextContent('$0')
  })

  it('shows the Closer OS app banner and opens the desktop app directly with the admin email prefilled', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    expect(screen.getByText('Download & share Closer OS')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /open closer os/i }))
    expect(screen.getByText('App landed')).toBeInTheDocument()
  })
})
