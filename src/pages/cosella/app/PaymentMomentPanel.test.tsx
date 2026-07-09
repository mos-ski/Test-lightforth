import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PaymentMomentPanel, { type PaymentStatus } from './PaymentMomentPanel'
import type { PriceOption } from '../cosellaOrgStore'

const PRICE_OPTION: PriceOption = { label: 'Core Program', pif: 12599, planInstallments: [1599, 3000, 4000, 4000] }

function setup(status: PaymentStatus, onSendLink = vi.fn(), onBackupOption = vi.fn()) {
  render(<PaymentMomentPanel status={status} priceOption={PRICE_OPTION} onSendLink={onSendLink} onBackupOption={onBackupOption} />)
  return { onSendLink, onBackupOption }
}

describe('PaymentMomentPanel', () => {
  it('renders nothing when hidden', () => {
    const { container } = render(<PaymentMomentPanel status="hidden" priceOption={PRICE_OPTION} onSendLink={() => {}} onBackupOption={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('offers PIF and Plan buttons when offered, and calls onSendLink with the chosen option', () => {
    const { onSendLink } = setup('offered')
    expect(screen.getByText(/\$12,599/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /send pif link/i }))
    expect(onSendLink).toHaveBeenCalledWith('pif')
  })

  it('shows the status ticker once a link has been sent', () => {
    setup('link-opened')
    expect(screen.getByText('Link opened')).toBeInTheDocument()
  })

  it('shows the paid confirmation when paid', () => {
    setup('paid')
    expect(screen.getByText(/paid/i)).toBeInTheDocument()
  })

  it('shows the decline rescue script and backup options when declined, and calls onBackupOption', () => {
    const { onBackupOption } = setup('declined')
    expect(screen.getByText(/card declined/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /second card/i }))
    expect(onBackupOption).toHaveBeenCalledWith('second-card')
  })

  it('shows the in-progress spinner on the current ticker step, not a checkmark, while earlier steps stay checked', () => {
    const { container } = render(<PaymentMomentPanel status="link-opened" priceOption={PRICE_OPTION} onSendLink={() => {}} onBackupOption={() => {}} />)
    // The currently-active step ("Link opened") must show the spinner, not a premature checkmark.
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    // Only the current step should spin — the earlier, already-completed step ("Link sent")
    // must not also render a spinner.
    expect(container.querySelectorAll('.animate-spin')).toHaveLength(1)
  })
})
