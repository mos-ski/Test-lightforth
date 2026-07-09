import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Integrations from './Integrations'
import { demoSeedCosellaOrg, getOrgByAdminEmail, createOrg } from '../cosellaOrgStore'
import type { CosellaDashboardContext } from './CosellaAdminLayout'

describe('Integrations', () => {
  it('toggles a connection', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{ adminEmail: 'ada@acme.com', org, refresh: () => {} } satisfies CosellaDashboardContext} />}>
            <Route index element={<Integrations />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    // Anchored regex: /connect/i without anchors also matches "Disconnect" (already-connected
    // processors), which would hit a pre-connected integration's Disconnect button instead.
    fireEvent.click(screen.getAllByRole('button', { name: /^connect$/i })[0])
    expect(getOrgByAdminEmail('ada@acme.com')!.connectedIntegrations.length).toBeGreaterThan(2)
  })
})
