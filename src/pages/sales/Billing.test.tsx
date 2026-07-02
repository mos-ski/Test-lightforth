import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Billing from './Billing'
import { demoSeedOrg } from './mockOrg'
import type { SalesDashboardContext } from './SalesAdminLayout'

function renderWithContext(context: SalesDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<Billing />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Billing plan-aware display', () => {
  it('shows the $5,000 setup fee and a per-seat breakdown table for enterprise orgs', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    renderWithContext({ adminEmail: 'admin@acme.com', org, refresh: () => {} })
    expect(screen.getByText('$5,000')).toBeInTheDocument()
    expect(screen.getByText('Per-seat breakdown')).toBeInTheDocument()
  })

  it('shows a flat $99.90/mo and no per-seat breakdown for individual orgs', () => {
    const org = demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual')
    renderWithContext({ adminEmail: 'solo@example.com', org, refresh: () => {} })
    expect(screen.queryByText('$5,000')).not.toBeInTheDocument()
    expect(screen.getByText(/\$99\.90/)).toBeInTheDocument()
    expect(screen.queryByText('Per-seat breakdown')).not.toBeInTheDocument()
  })
})
