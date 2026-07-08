import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import CloserOSLanding from './CloserOSLanding'

describe('CloserOSLanding', () => {
  it('renders the hero headline and all 7 feature names', () => {
    render(<MemoryRouter><CloserOSLanding /></MemoryRouter>)
    expect(screen.getByText(/Closer OS/i)).toBeInTheDocument()
    expect(screen.getByText('Payment Moment Engine')).toBeInTheDocument()
    expect(screen.getByText('Installment Recovery Copilot')).toBeInTheDocument()
    expect(screen.getByText('Funnel-to-Call Intelligence')).toBeInTheDocument()
    expect(screen.getByText('The Money Slack Report')).toBeInTheDocument()
    expect(screen.getByText('Revenue Attribution Ledger')).toBeInTheDocument()
    expect(screen.getByText('Ghost Prospect Simulator')).toBeInTheDocument()
    expect(screen.getByText('Second Voice')).toBeInTheDocument()
  })

  it('links the CTA button to the checkout route', () => {
    render(<MemoryRouter><CloserOSLanding /></MemoryRouter>)
    const cta = screen.getByRole('link', { name: /get started/i })
    expect(cta).toHaveAttribute('href', '/closer-os/checkout')
  })
})
