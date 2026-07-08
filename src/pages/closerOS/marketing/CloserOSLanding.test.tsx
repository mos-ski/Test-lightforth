import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import CloserOSLanding from './CloserOSLanding'

function renderLanding() {
  return render(
    <MemoryRouter initialEntries={['/closer-os']}>
      <Routes>
        <Route path="/closer-os" element={<CloserOSLanding />} />
        <Route path="/closer-os/checkout" element={<p>Checkout landed</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CloserOSLanding', () => {
  it('renders the hero headline and all 7 feature names', () => {
    renderLanding()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Closer OS helps you get paid')
    expect(screen.getByText('Payment Moment Engine')).toBeInTheDocument()
    expect(screen.getByText('Installment Recovery Copilot')).toBeInTheDocument()
    expect(screen.getByText('Funnel-to-Call Intelligence')).toBeInTheDocument()
    expect(screen.getByText('The Money Slack Report')).toBeInTheDocument()
    expect(screen.getByText('Revenue Attribution Ledger')).toBeInTheDocument()
    expect(screen.getByText('Ghost Prospect Simulator')).toBeInTheDocument()
    expect(screen.getByText('Second Voice')).toBeInTheDocument()
  })

  it('navigates to the checkout route from either Get Started button (hero + pricing)', () => {
    renderLanding()
    const ctas = screen.getAllByRole('button', { name: /get started/i })
    expect(ctas).toHaveLength(2)
    fireEvent.click(ctas[0])
    expect(screen.getByText('Checkout landed')).toBeInTheDocument()
  })
})
