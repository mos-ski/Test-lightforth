import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Team from './Team'
import { demoSeedOrg } from './mockOrg'
import type { SalesDashboardContext } from './SalesAdminLayout'

function renderWithContext(context: SalesDashboardContext) {
  return render(
    <MemoryRouter initialEntries={['/sales/dashboard/team']}>
      <Routes>
        <Route path="/sales/dashboard" element={<div>Overview page</div>} />
        <Route path="/sales/dashboard/team" element={<Outlet context={context} />}>
          <Route index element={<Team />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Team route guard', () => {
  it('renders normally for an enterprise org', () => {
    const org = demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise')
    renderWithContext({ adminEmail: 'admin@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Add member')).toBeInTheDocument()
  })

  it('redirects to the dashboard for an individual org', () => {
    const org = demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual')
    renderWithContext({ adminEmail: 'solo@example.com', org, refresh: () => {} })
    expect(screen.getByText('Overview page')).toBeInTheDocument()
    expect(screen.queryByText('Add member')).not.toBeInTheDocument()
  })
})
