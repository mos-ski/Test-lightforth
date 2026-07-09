// src/pages/cosella/dashboard/PaymentSettings.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import PaymentSettings from './PaymentSettings'
import { createOrg, demoSeedCosellaOrg, getOrgByAdminEmail } from '../cosellaOrgStore'
import type { CosellaDashboardContext } from './CosellaAdminLayout'

function renderWithContext(adminEmail: string, org: ReturnType<typeof demoSeedCosellaOrg>, refresh: () => void) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={{ adminEmail, org, refresh } satisfies CosellaDashboardContext} />}>
          <Route index element={<PaymentSettings />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('PaymentSettings', () => {
  beforeEach(() => localStorage.clear())

  it('lists existing deal-type price options and their PIF price', () => {
    const org = demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext('ada@acme.com', org, () => {})
    expect(screen.getByText('Core Program')).toBeInTheDocument()
    expect(screen.getByText(/\$12,599/)).toBeInTheDocument()
  })

  it('adds a new deal type with PIF price and one plan installment amount', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    let org = getOrgByAdminEmail('ada@acme.com')!
    const refresh = () => { org = getOrgByAdminEmail('ada@acme.com')! }
    const { rerender } = renderWithContext('ada@acme.com', org, refresh)

    fireEvent.change(screen.getByPlaceholderText('Deal type name'), { target: { value: 'Starter Program' } })
    fireEvent.change(screen.getByPlaceholderText('PIF price'), { target: { value: '5000' } })
    fireEvent.change(screen.getByPlaceholderText('Deposit today'), { target: { value: '1000' } })
    fireEvent.click(screen.getByRole('button', { name: /add deal type/i }))

    rerender(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{ adminEmail: 'ada@acme.com', org, refresh } satisfies CosellaDashboardContext} />}>
            <Route index element={<PaymentSettings />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Starter Program')).toBeInTheDocument()
    expect(getOrgByAdminEmail('ada@acme.com')!.dealTypePriceOptions.some(o => o.label === 'Starter Program')).toBe(true)
  })

  it('toggles a payment connection on and off', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    let org = getOrgByAdminEmail('ada@acme.com')!
    const refresh = () => { org = getOrgByAdminEmail('ada@acme.com')! }
    const { rerender } = renderWithContext('ada@acme.com', org, refresh)

    // Seeded org already has 'stripe' connected (see demoSeedCosellaOrg) — NMI is not, so its button reads "Connect".
    // Regex is anchored (^...$) so it matches only an exact "Connect" label, not "Disconnect" —
    // /connect/i without anchors also matches "Disconnect" (it contains the substring "connect"),
    // which would hit Stripe's already-connected button instead of NMI's.
    expect(org.connectedIntegrations).toContain('stripe')
    expect(org.connectedIntegrations).not.toContain('nmi')

    fireEvent.click(screen.getAllByRole('button', { name: /^connect$/i })[0]) // NMI's "Connect" button
    rerender(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={{ adminEmail: 'ada@acme.com', org, refresh } satisfies CosellaDashboardContext} />}>
            <Route index element={<PaymentSettings />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(getOrgByAdminEmail('ada@acme.com')!.connectedIntegrations).toContain('nmi')
  })
})
