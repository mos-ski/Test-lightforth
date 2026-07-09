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
  it('renders the Figma landing page sections', () => {
    renderLanding()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stop losing deals to reps who freeze on objections')
    expect(screen.getByRole('heading', { level: 2, name: /one copilot, every stage of the deal/i })).toBeInTheDocument()
    expect(screen.getByText('Cosella answers the objection while the rep is still on the line.')).toBeInTheDocument()
    expect(screen.getByText('Brief your team')).toBeInTheDocument()
    expect(screen.getByText('Get paid without leaving the call')).toBeInTheDocument()
    expect(screen.getByText('Track every dollar')).toBeInTheDocument()
    expect(screen.getByText("Rescue calls before they're lost")).toBeInTheDocument()
    expect(screen.getByText('Reserve a seat.')).toBeInTheDocument()
  })

  it('navigates to the checkout route from the waitlist CTA', () => {
    renderLanding()
    const ctas = screen.getAllByRole('button', { name: /join waitlist/i })
    expect(ctas.length).toBeGreaterThanOrEqual(2)
    fireEvent.click(ctas[0])
    expect(screen.getByText('Checkout landed')).toBeInTheDocument()
  })
})
