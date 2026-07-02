import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Overview from './Overview'
import { demoSeedOrg } from './mockOrg'
import type { SalesDashboardContext } from './SalesAdminLayout'

function renderWithContext(context: SalesDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<Overview />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Overview plan-aware display', () => {
  it('shows the $5,000 setup fee card and a Team quick-link for enterprise orgs', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    renderWithContext({ adminEmail: 'admin@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Setup fee')).toBeInTheDocument()
    expect(screen.getByText('Team')).toBeInTheDocument()
  })

  it('shows a Plan card instead of a setup fee, and no Team quick-link, for individual orgs', () => {
    const org = demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual')
    renderWithContext({ adminEmail: 'solo@example.com', org, refresh: () => {} })
    expect(screen.queryByText('Setup fee')).not.toBeInTheDocument()
    expect(screen.getByText('Plan')).toBeInTheDocument()
    expect(screen.getByText(/\$99\.90\/mo, no setup fee/)).toBeInTheDocument()
    expect(screen.queryByText('Team')).not.toBeInTheDocument()
  })
})
