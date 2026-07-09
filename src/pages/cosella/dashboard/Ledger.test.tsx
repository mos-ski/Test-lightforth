import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import Ledger from './Ledger'
import { createOrg, demoSeedCosellaOrg, getOrgByAdminEmail } from '../cosellaOrgStore'
import type { CosellaDashboardContext } from './CosellaAdminLayout'

function renderWithContext(context: CosellaDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<Ledger />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Ledger', () => {
  beforeEach(() => localStorage.clear())

  it('lists ledger entries and the guarantee tracker', () => {
    const org = demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByText('Price is too high')).toBeInTheDocument()
    expect(screen.getByText(/guarantee target/i)).toBeInTheDocument()
  })

  it('filters by closer', () => {
    const org = demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    fireEvent.change(screen.getByLabelText(/closer/i), { target: { value: 'Sam Patel' } })
    expect(screen.queryByText('Price is too high')).not.toBeInTheDocument() // that entry belongs to Jordan Lee
    expect(screen.getByText('Need to check with a partner')).toBeInTheDocument()
  })

  it('logs an audit entry when generating a renewal deck', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    fireEvent.click(screen.getByRole('button', { name: /generate renewal deck/i }))
    expect(getOrgByAdminEmail('ada@acme.com')!.auditLog.some(a => a.action === 'renewal-deck-generated')).toBe(true)
  })
})
