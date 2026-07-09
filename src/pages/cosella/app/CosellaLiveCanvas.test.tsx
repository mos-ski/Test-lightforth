import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CosellaLiveCanvas from './CosellaLiveCanvas'
import { toast } from 'sonner'
import type { PriceOption } from '../cosellaOrgStore'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() } }))

const PRICE_OPTION: PriceOption = { label: 'Core Program', pif: 12599, planInstallments: [1599, 3000, 4000, 4000] }

function advanceOneTurn() {
  act(() => { vi.advanceTimersByTime(3500) }) // finish typing the question, the processing pause, and the response
  fireEvent.keyDown(window, { code: 'Space' })
}

describe('CosellaLiveCanvas', () => {
  // The `toast` mock's vi.fn()s are created once by the `vi.mock('sonner', ...)` factory above and
  // persist across every test in this file (vitest's `clearMocks`/`mockReset` default to false), so
  // without an explicit reset here, a toast fired by an earlier test (e.g. the full payment flow in
  // "opens the Payment Moment panel...") would still show up in a later test's call count.
  beforeEach(() => { vi.useFakeTimers(); vi.clearAllMocks() })
  afterEach(() => vi.useRealTimers())

  it('shows the prospect name in the header and starts with an empty transcript', () => {
    render(<CosellaLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} />)
    expect(screen.getByText(/Casey Nguyen/)).toBeInTheDocument()
  })

  it('adds an objection to the sidebar once its turn finishes typing, and logs it as used on click', () => {
    render(<CosellaLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} />)
    advanceOneTurn() // turn 0: small talk
    act(() => { vi.advanceTimersByTime(3000) }) // turn 1 finishes typing: price objection
    expect(screen.getByText('Price is too high')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /mark as used/i }))
    expect(screen.getByText(/used this call/i)).toBeInTheDocument()
  })

  it('opens the Payment Moment panel once the yes-signal turn is reached, and reports a won outcome on End Call after paying', () => {
    const onEnd = vi.fn()
    render(<CosellaLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={onEnd} />)
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

  it('shows Listening -> Processing -> Answering for every turn, and only allows advancing once the response finishes', () => {
    render(<CosellaLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} />)
    expect(screen.getByText('Listening to prospect...')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(1300) }) // turn 0's question (58 chars * 22ms = 1276ms) finishes typing
    expect(screen.getByText('Preparing suggested response...')).toBeInTheDocument()
    expect(screen.queryByText('Suggested Response')).not.toBeInTheDocument() // still "thinking" — not answering yet

    // Space shouldn't advance the turn during the processing pause either.
    fireEvent.keyDown(window, { code: 'Space' })
    act(() => { vi.advanceTimersByTime(950) }) // the 900ms processing pause elapses; answering begins
    expect(screen.getByText('Coaching...')).toBeInTheDocument()
    expect(screen.getByText('Suggested Response')).toBeInTheDocument()

    // Space still shouldn't advance — the response is still typing.
    fireEvent.keyDown(window, { code: 'Space' })
    act(() => { vi.advanceTimersByTime(200) })
    expect(screen.queryByText('Honestly the price is more than I budgeted for this quarter.')).not.toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(2000) }) // response finishes typing
    fireEvent.keyDown(window, { code: 'Space' })
    act(() => { vi.advanceTimersByTime(3000) }) // turn 1's question, processing pause, and response all play out
    expect(screen.getByText('Honestly the price is more than I budgeted for this quarter.')).toBeInTheDocument()
    // Turn 1 has no distinct `response` field, so its suggested response is its objection counter —
    // the same text also lands in the Objections sidebar, so this appears twice.
    expect(screen.getAllByText('Re-anchor on ROI and time saved — offer a phased start if it helps.').length).toBeGreaterThan(0)
  })

  it('force-opens the Payment Moment panel with the P hotkey at any time', () => {
    render(<CosellaLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} />)
    fireEvent.keyDown(window, { key: 'p' })
    expect(screen.getByRole('button', { name: /send pif link/i })).toBeInTheDocument()
  })

  it('cancels the in-flight payment cascade on End Call, so no late "wins" toast fires and the reported outcome does not later flip to won', () => {
    const onEnd = vi.fn()
    render(<CosellaLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={onEnd} />)
    for (let i = 0; i < 4; i++) advanceOneTurn()
    act(() => { vi.advanceTimersByTime(3000) }) // payment offered
    fireEvent.click(screen.getByRole('button', { name: /send pif link/i }))
    act(() => { vi.advanceTimersByTime(1200) }) // only reaches 'link-opened' — cascade still in flight

    fireEvent.click(screen.getByRole('button', { name: /end call/i }))
    expect(onEnd).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'no-decision' }))
    expect(onEnd).toHaveBeenCalledTimes(1)

    // If the pending timeout weren't cancelled, this would complete the cascade and fire the toast.
    act(() => { vi.advanceTimersByTime(5000) })
    expect(toast.success).not.toHaveBeenCalled()
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('opens the Settings panel from the gear icon, and adjusting Transparent Background calls the callback', () => {
    const onTransparencyChange = vi.fn()
    render(<CosellaLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} transparency={40} onTransparencyChange={onTransparencyChange} />)
    expect(screen.queryByText('Window Settings')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /open settings/i }))
    expect(screen.getByText('Window Settings')).toBeInTheDocument()
    expect(screen.getByText('40%')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('slider', { name: 'Transparent Background' }), { target: { value: '70' } })
    expect(onTransparencyChange).toHaveBeenCalledWith(70)

    fireEvent.click(screen.getByRole('button', { name: /close settings/i }))
    expect(screen.queryByText('Window Settings')).not.toBeInTheDocument()
  })

  it('font size and auto scroll sliders start at their default values and update on change', () => {
    render(<CosellaLiveCanvas prospectName="Casey Nguyen" priceOption={PRICE_OPTION} onEnd={() => {}} />)
    const fontSizeSlider = screen.getByRole('slider', { name: 'Font size' })
    const autoScrollSlider = screen.getByRole('slider', { name: 'Auto scroll' })
    expect(fontSizeSlider).toHaveValue('12')
    expect(autoScrollSlider).toHaveValue('1')

    fireEvent.change(fontSizeSlider, { target: { value: '18' } })
    expect(fontSizeSlider).toHaveValue('18')
  })
})
