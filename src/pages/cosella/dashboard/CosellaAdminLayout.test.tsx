import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import CosellaAdminLayout from './CosellaAdminLayout'
import { createOrg, demoSeedCosellaOrg, setActiveAdminEmail } from '../cosellaOrgStore'

describe('CosellaAdminLayout', () => {
  beforeEach(() => localStorage.clear())

  it('redirects to the landing page when no admin is signed in', () => {
    render(
      <MemoryRouter initialEntries={['/cosella/dashboard']}>
        <Routes>
          <Route path="/cosella/dashboard" element={<CosellaAdminLayout />} />
          <Route path="/cosella" element={<p>Landing page</p>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Landing page')).toBeInTheDocument()
  })

  it('renders the org name and all 13 nav items for a signed-in admin', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    setActiveAdminEmail('ada@acme.com')
    render(
      <MemoryRouter initialEntries={['/cosella/dashboard']}>
        <Routes>
          <Route path="/cosella/dashboard" element={<CosellaAdminLayout />}>
            <Route index element={<p>Overview page</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Acme Closers')).toBeInTheDocument()
    expect(screen.getByText('Overview page')).toBeInTheDocument()
    for (const label of ['Overview', 'Payment Settings', 'Plan Tracker', 'Ledger', 'Slack Report', 'Prospect Intel', 'Ghost Simulator', 'Live Rescue Board', 'Team', 'Call History', 'Billing', 'Integrations', 'Settings']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })
})
