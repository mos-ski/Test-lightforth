import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProspectCardScreen from './ProspectCard'
import type { ProspectCard } from '../cosellaOrgStore'

const CARD: ProspectCard = {
  id: 'p1', callId: 'c1', prospectName: 'Casey Nguyen', vslWatchPct: 92,
  rewatchedParts: ['Guarantee section'], applicationAnswers: ['I need a career change fast'],
  emailOpens: 3, heatSignal: 'HOT', openingLines: ['Let\'s talk timeline first.'],
}

describe('ProspectCardScreen', () => {
  it('renders the prospect name, heat badge, VSL percentage, and opening lines', () => {
    render(<ProspectCardScreen card={CARD} onContinue={() => {}} />)
    expect(screen.getByText('Casey Nguyen')).toBeInTheDocument()
    expect(screen.getByText('HOT')).toBeInTheDocument()
    expect(screen.getByText(/92%/)).toBeInTheDocument()
    expect(screen.getByText("Let's talk timeline first.")).toBeInTheDocument()
  })

  it('calls onContinue when the Start Call button is clicked', () => {
    const onContinue = vi.fn()
    render(<ProspectCardScreen card={CARD} onContinue={onContinue} />)
    fireEvent.click(screen.getByRole('button', { name: /start call/i }))
    expect(onContinue).toHaveBeenCalled()
  })
})
