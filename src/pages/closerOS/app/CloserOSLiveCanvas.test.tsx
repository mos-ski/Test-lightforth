import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CloserOSLiveCanvas from './CloserOSLiveCanvas'
import type { PriceOption } from '../closerOrgStore'

const PRICE_OPTION: PriceOption = { label: 'Core Program', pif: 12599, planInstallments: [1599, 3000, 4000, 4000] }

function advanceOneTurn() {
  act(() => { vi.advanceTimersByTime(3000) }) // finish typing the current turn
  fireEvent.keyDown(window, { code: 'Space' })
}

describe('CloserOSLiveCanvas', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows the prospect name in the header and starts with an empty transcript', () => {
    render(<CloserOSLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} />)
    expect(screen.getByText(/Casey Nguyen/)).toBeInTheDocument()
  })

  it('adds an objection to the sidebar once its turn finishes typing, and logs it as used on click', () => {
    render(<CloserOSLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} />)
    advanceOneTurn() // turn 0: small talk
    act(() => { vi.advanceTimersByTime(3000) }) // turn 1 finishes typing: price objection
    expect(screen.getByText('Price is too high')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /mark as used/i }))
    expect(screen.getByText(/used this call/i)).toBeInTheDocument()
  })

  it('opens the Payment Moment panel once the yes-signal turn is reached, and reports a won outcome on End Call after paying', () => {
    const onEnd = vi.fn()
    render(<CloserOSLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={onEnd} />)
    // advance through all 4 preceding turns to reach the yes-signal turn
    for (let i = 0; i < 4; i++) advanceOneTurn()
    act(() => { vi.advanceTimersByTime(3000) }) // final turn finishes typing -> payment offered
    expect(screen.getByRole('button', { name: /send pif link/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /send pif link/i }))
    act(() => { vi.advanceTimersByTime(4000) }) // link-sent -> link-opened -> card-entering -> paid
    expect(screen.getByText(/paid/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /end call/i }))
    expect(onEnd).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'won', paymentChoice: 'pif' }))
  })

  it('force-opens the Payment Moment panel with the P hotkey at any time', () => {
    render(<CloserOSLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} />)
    fireEvent.keyDown(window, { key: 'p' })
    expect(screen.getByRole('button', { name: /send pif link/i })).toBeInTheDocument()
  })
})
