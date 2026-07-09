import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import CosellaLanding from './CosellaLanding'

function renderLanding() {
  return render(
    <MemoryRouter initialEntries={['/cosella']}>
      <Routes>
        <Route path="/cosella" element={<CosellaLanding />} />
        <Route path="/cosella/checkout" element={<p>Checkout landed</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CosellaLanding', () => {
  it('renders the hero headline and all 7 feature names', () => {
    renderLanding()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Cosella helps you get paid')
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
