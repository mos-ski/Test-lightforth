import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Contacts from './Contacts'
import { demoSeedCosellaOrg, getOrgByAdminEmail, createOrg } from '../cosellaOrgStore'
import type { CosellaDashboardContext } from './CosellaAdminLayout'

function renderWithContext(context: CosellaDashboardContext) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Outlet context={context} />}>
          <Route index element={<Contacts />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Contacts', () => {
  it('lists seeded contacts with their source badge, and adds a new one', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    expect(screen.getByText('Harper Lin')).toBeInTheDocument()
    expect(screen.getByText('Waitlist')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /add contact/i }))
    fireEvent.change(screen.getByPlaceholderText('Harper Lin'), { target: { value: 'Jamie Cole' } })
    fireEvent.change(screen.getByPlaceholderText('+1 (415) 555-0142'), { target: { value: '+1 (555) 010-0100' } })
    fireEvent.click(screen.getAllByRole('button', { name: /add contact/i })[1])

    expect(getOrgByAdminEmail('ada@acme.com')!.contacts.some(c => c.name === 'Jamie Cole')).toBe(true)
  })

  it('assigns a contact to a rep and removes a contact', () => {
    createOrg('ada@acme.com', demoSeedCosellaOrg('ada@acme.com', 'Ada Admin', 'Acme Closers'))
    const org = getOrgByAdminEmail('ada@acme.com')!
    const unassigned = org.contacts.find(c => c.assignedTo === null)!
    renderWithContext({ adminEmail: 'ada@acme.com', org, refresh: () => {} })

    const row = screen.getByText(unassigned.name).closest('tr')!
    const select = row.querySelector('select') as HTMLSelectElement
    fireEvent.change(select, { target: { value: org.members[1].email } })
    expect(getOrgByAdminEmail('ada@acme.com')!.contacts.find(c => c.id === unassigned.id)!.assignedTo).toBe(org.members[1].email)

    fireEvent.click(screen.getByRole('button', { name: `Remove ${unassigned.name}` }))
    expect(getOrgByAdminEmail('ada@acme.com')!.contacts.some(c => c.id === unassigned.id)).toBe(false)
  })
})
