// src/pages/cosella/dashboard/ProspectIntel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import ProspectIntel from './ProspectIntel'
import { demoSeedCosellaOrg, getOrgByAdminEmail, createOrg } from '../cosellaOrgStore'
import type { CosellaDashboardContext } from './CosellaAdminLayout'

function renderWithContext(context: CosellaDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<ProspectIntel />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProspectIntel', () => {
  it('lists every prospect card with its heat signal', () => {
    const org = demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Casey Nguyen')).toBeInTheDocument()
    expect(screen.getByText('HOT')).toBeInTheDocument()
  })

  it('adds a new prospect card from the manual-entry form', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    fireEvent.change(screen.getByPlaceholderText('Prospect name'), { target: { value: 'Drew Palmer' } })
    fireEvent.change(screen.getByPlaceholderText('VSL watch %'), { target: { value: '80' } })
    fireEvent.change(screen.getByPlaceholderText('Suggested opening line'), { target: { value: "Let's start with your timeline." } })
    fireEvent.click(screen.getByRole('button', { name: /add prospect card/i }))

    expect(getOrgByAdminEmail('ada@acme.com')!.prospectCards.some(p => p.prospectName === 'Drew Palmer')).toBe(true)
  })
})
