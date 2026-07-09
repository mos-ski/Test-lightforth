import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Team from './Team'
import { demoSeedCloserOrg, getOrgByAdminEmail, createOrg } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<Team />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Team', () => {
  it('lists members and adds a new one with a matching-domain email', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    expect(screen.getByText('Jordan Lee')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /add member/i }))
    fireEvent.change(screen.getByPlaceholderText(/jordan/i), { target: { value: 'Riley Chen' } })
    fireEvent.change(screen.getByPlaceholderText(`riley@acme.com`), { target: { value: 'riley@acme.com' } })
    fireEvent.click(screen.getByRole('button', { name: /add to team/i }))

    expect(getOrgByAdminEmail('ada@acme.com')!.members.some(m => m.name === 'Riley Chen')).toBe(true)
  })
})
