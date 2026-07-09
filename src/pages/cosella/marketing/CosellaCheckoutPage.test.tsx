import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import CosellaCheckoutPage from './CosellaCheckoutPage'
import { getCosellaAccount } from '../cosellaAccounts'
import { getOrgByAdminEmail, getActiveAdminEmail } from '../cosellaOrgStore'

describe('CosellaCheckoutPage', () => {
  beforeEach(() => localStorage.clear())

  it('creates a seeded Cosella org and account on completed checkout', () => {
    render(<MemoryRouter><CosellaCheckoutPage /></MemoryRouter>)

    fireEvent.change(screen.getByPlaceholderText('Acme Inc.'), { target: { value: 'Acme Closers' } })
    fireEvent.change(screen.getByPlaceholderText('Jane Doe'), { target: { value: 'Ada Admin' } })
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'ada@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }))

    fireEvent.change(screen.getByPlaceholderText('4242 4242 4242 4242'), { target: { value: '4242424242424242' } })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/29' } })
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /pay .* and continue/i }))

    expect(getCosellaAccount('ada@acme.com')?.accountType).toBe('cosella-admin')
    expect(getOrgByAdminEmail('ada@acme.com')?.orgName).toBe('Acme Closers')
    expect(getActiveAdminEmail()).toBe('ada@acme.com')
  })
})
