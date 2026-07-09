import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Settings from './Settings'
import { demoSeedCloserOrg, getOrgByAdminEmail, createOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

describe('Settings', () => {
  it('saves the org name and admin name', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{ adminEmail: 'ada@acme.com', org, refresh: () => {} } satisfies CloserDashboardContext} />}>
            <Route index element={<Settings />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Acme Closers Inc' } })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    expect(getOrgByAdminEmail('ada@acme.com')!.orgName).toBe('Acme Closers Inc')
  })
})
