import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import SalesAdminLayout from './SalesAdminLayout'
import { createOrg, demoSeedOrg, setActiveAdminEmail } from './mockOrg'

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/sales/dashboard']}>
      <Routes>
        <Route path="/sales/dashboard" element={<SalesAdminLayout />}>
          <Route index element={<div>Overview page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('SalesAdminLayout nav', () => {
  beforeEach(() => localStorage.clear())

  it('shows the Team nav item for an enterprise org', () => {
    createOrg('admin@acme.com', demoSeedOrg('admin@acme.com', 'Ada Admin', 'Acme Team', 'enterprise'))
    setActiveAdminEmail('admin@acme.com')
    renderLayout()
    expect(screen.getByText('Team')).toBeInTheDocument()
  })

  it('hides the Team nav item for an individual org', () => {
    createOrg('solo@example.com', demoSeedOrg('solo@example.com', 'Sam Solo', "Sam Solo's workspace", 'individual'))
    setActiveAdminEmail('solo@example.com')
    renderLayout()
    expect(screen.queryByText('Team')).not.toBeInTheDocument()
  })
})
