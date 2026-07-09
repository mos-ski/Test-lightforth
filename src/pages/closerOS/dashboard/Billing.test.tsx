import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Billing from './Billing'
import { demoSeedCloserOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

describe('Billing', () => {
  it('shows the setup fee and computed monthly total from active seats', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{ adminEmail: 'ada@acme.com', org, refresh: () => {} } satisfies CloserDashboardContext} />}>
            <Route index element={<Billing />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('$7,500')).toBeInTheDocument()
    const activeSeats = org.members.filter(m => m.seatPaid).length
    expect(screen.getByText(`$${(activeSeats * 149).toFixed(2)}`, { exact: false })).toBeInTheDocument()
  })
})
