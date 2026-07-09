import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Settings from './Settings'
import { demoSeedCosellaOrg, getOrgByAdminEmail, createOrg } from '../cosellaOrgStore'
import type { CosellaDashboardContext } from './CosellaAdminLayout'

describe('Settings', () => {
  it('saves the org name and admin name', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{ adminEmail: 'ada@acme.com', org, refresh: () => {} } satisfies CosellaDashboardContext} />}>
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
