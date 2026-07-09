import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import CallHistory from './CallHistory'
import { demoSeedCloserOrg, getOrgByAdminEmail, createOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<CallHistory />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('CallHistory', () => {
  it('lists calls and shows a Make a Ghost button only on lost calls', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    fireEvent.click(screen.getByText('Taylor Brooks')) // the seeded lost call's closer
    expect(screen.getByRole('button', { name: /make a ghost/i })).toBeInTheDocument()
  })

  it('creates a ghost persona from a lost call', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    const before = org.ghostPersonas.length
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    fireEvent.click(screen.getByText('Taylor Brooks'))
    fireEvent.click(screen.getByRole('button', { name: /make a ghost/i }))
    expect(getOrgByAdminEmail('ada@acme.com')!.ghostPersonas.length).toBe(before + 1)
  })
})
