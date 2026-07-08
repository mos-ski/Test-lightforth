import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import SlackReport from './SlackReport'
import { createOrg, demoSeedCloserOrg, getOrgByAdminEmail } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function renderWithContext(context: CloserDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<SlackReport />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('SlackReport', () => {
  beforeEach(() => localStorage.clear())

  it('shows the configured channel and send time, and a live preview of the digest', () => {
    const org = demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers')
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    expect(screen.getByDisplayValue('#closer-os-wins')).toBeInTheDocument()
    expect(screen.getByText(/cash today:/i)).toBeInTheDocument()
    expect(screen.getByText(/deals saved:/i)).toBeInTheDocument()
    expect(screen.getByText(/money leaked:/i)).toBeInTheDocument()
  })

  it('saves updated config on Save changes', () => {
    createOrg('ada@acme.com', demoSeedCloserOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })
    fireEvent.change(screen.getByLabelText(/channel/i), { target: { value: '#sales-wins' } })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    expect(getOrgByAdminEmail('ada@acme.com')!.slackDigestConfig.channel).toBe('#sales-wins')
  })
})
