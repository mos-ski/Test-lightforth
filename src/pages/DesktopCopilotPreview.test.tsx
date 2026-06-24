// src/pages/DesktopCopilotPreview.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { vi } from 'vitest'
import { SetupScreen, PreferenceModal, ScreenshotCanvas, LiveCanvas, CompleteScreen } from './DesktopCopilotPreview'

describe('SetupScreen', () => {
  it('renders Position, Resume, and Job description fields for interview', () => {
    render(<SetupScreen useCaseId="interview" onContinue={() => {}} />)
    expect(screen.getByText('Position')).toBeInTheDocument()
    expect(screen.getByText('Choose Resume')).toBeInTheDocument()
    expect(screen.getByText(/Job description/)).toBeInTheDocument()
    expect(screen.queryByText('Customer / Company name')).not.toBeInTheDocument()
  })

  it('renders Customer name and Deal stage fields for sales-call, not Position', () => {
    render(<SetupScreen useCaseId="sales-call" onContinue={() => {}} />)
    expect(screen.getByText('Customer / Company name')).toBeInTheDocument()
    expect(screen.getByText('Deal stage')).toBeInTheDocument()
    expect(screen.queryByText('Position')).not.toBeInTheDocument()
  })

  it('renders Meeting title and a screen-share note for meeting', () => {
    render(<SetupScreen useCaseId="meeting" onContinue={() => {}} />)
    expect(screen.getByText('Meeting title')).toBeInTheDocument()
    expect(screen.getByText(/share your screen/)).toBeInTheDocument()
  })

  it('renders only Subject for exam, with no audio field', () => {
    render(<SetupScreen useCaseId="exam" onContinue={() => {}} />)
    expect(screen.getByText('Subject')).toBeInTheDocument()
    expect(screen.queryByText('Select Audio')).not.toBeInTheDocument()
  })

  it('renders Language field for coding and allows Continue with it blank', () => {
    render(<SetupScreen useCaseId="coding" onContinue={() => {}} />)
    expect(screen.getByText(/Language \/ stack/)).toBeInTheDocument()
    const continueBtn = screen.getByText('Continue')
    expect(continueBtn).not.toHaveStyle({ opacity: 0.45 })
  })

  it('opens the Preference modal on Continue once a required field is filled', () => {
    render(<SetupScreen useCaseId="exam" onContinue={() => {}} />)
    fireEvent.change(screen.getByPlaceholderText('e.g. Calculus II'), { target: { value: 'Calculus II' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(screen.getByText('Preference')).toBeInTheDocument()
  })
})

describe('PreferenceModal', () => {
  it('shows Answer Length when hasAnswerLength is true', () => {
    render(<PreferenceModal hasAnswerLength={true} onClose={() => {}} onNext={() => {}} />)
    expect(screen.getByText('Answer Length')).toBeInTheDocument()
    expect(screen.getByText('Short')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Long')).toBeInTheDocument()
  })

  it('hides Answer Length when hasAnswerLength is false', () => {
    render(<PreferenceModal hasAnswerLength={false} onClose={() => {}} onNext={() => {}} />)
    expect(screen.queryByText('Answer Length')).not.toBeInTheDocument()
  })
})

describe('ScreenshotCanvas', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('starts idle, prompting the user to press Space', () => {
    render(<ScreenshotCanvas useCaseId="exam" primaryLabel="Calculus II" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText('Press Space to capture your screen')).toBeInTheDocument()
  })

  it('captures, analyzes, and shows an answer on consecutive Space presses', () => {
    render(<ScreenshotCanvas useCaseId="exam" primaryLabel="Calculus II" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.keyDown(window, { code: 'Space' })
    act(() => { vi.advanceTimersByTime(600) })
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(900) })
    expect(screen.getByText('Answer ready — press Space for the next question')).toBeInTheDocument()
  })

  it('renders the answer as a code block with a Copy button for coding', () => {
    render(<ScreenshotCanvas useCaseId="coding" primaryLabel="" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.keyDown(window, { code: 'Space' })
    act(() => { vi.advanceTimersByTime(600) }) // capturing
    act(() => { vi.advanceTimersByTime(900) }) // analyzing to answered
    expect(screen.getByRole('button', { name: /Copy/ })).toBeInTheDocument()
  })

  it('auto-advances without Space presses when Auto Respond is on', () => {
    const { rerender } = render(<ScreenshotCanvas useCaseId="exam" primaryLabel="Calculus II" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    // Turn on auto respond
    fireEvent.click(screen.getByTestId('open-settings'))
    const autoRespondToggle = screen.getByText('Auto Respond').closest('div')!.parentElement!.querySelector('button')!
    fireEvent.click(autoRespondToggle)
    // Close settings
    const settingsDialog = screen.getByText('Settings').closest('div')!.parentElement!
    const closeBtn = settingsDialog.querySelector('button:last-child')!
    fireEvent.click(closeBtn)
    // Advance time: 2000ms idle -> capture, 600ms -> analyzing, 900ms -> answered
    act(() => { vi.advanceTimersByTime(2000) })
    expect(screen.getByText('Capturing screen...')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(600) })
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
  })
})

describe('LiveCanvas', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('labels the speaker "Interviewer" and titles the bar "Interview for {label}"', () => {
    render(<LiveCanvas useCaseId="interview" primaryLabel="Product Manager" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText('Interview for Product Manager')).toBeInTheDocument()
    fireEvent.keyDown(window, { code: 'Space' })
    expect(screen.getAllByText('Interviewer').length).toBeGreaterThan(0)
  })

  it('labels the speaker "Customer" and titles the bar "Sales Call with {label}"', () => {
    render(<LiveCanvas useCaseId="sales-call" primaryLabel="Acme Corp" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText('Sales Call with Acme Corp')).toBeInTheDocument()
    fireEvent.keyDown(window, { code: 'Space' })
    expect(screen.getAllByText('Customer').length).toBeGreaterThan(0)
  })

  it('labels speakers "Speaker 1" etc. and titles the bar "Meeting: {label}"', () => {
    render(<LiveCanvas useCaseId="meeting" primaryLabel="Q3 Roadmap Review" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText('Meeting: Q3 Roadmap Review')).toBeInTheDocument()
    fireEvent.keyDown(window, { code: 'Space' })
    expect(screen.getAllByText('Speaker 1').length).toBeGreaterThan(0)
  })

  it('auto-advances through listening/processing/answering when Auto Respond is on', () => {
    render(<LiveCanvas useCaseId="interview" primaryLabel="Product Manager" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.click(screen.getByTestId('open-settings'))
    fireEvent.click(screen.getByText('Auto Respond').closest('div')!.parentElement!.querySelector('button')!)
    act(() => { vi.advanceTimersByTime(1800) })
    expect(screen.getByText('Processing...')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1200) })
    expect(screen.getByText('Answering...')).toBeInTheDocument()
  })
})

describe('CompleteScreen', () => {
  it('shows the Interview-specific heading', () => {
    render(<CompleteScreen useCaseId="interview" onGoHome={() => {}} />)
    expect(screen.getByText('👏 Your Interview is complete!')).toBeInTheDocument()
  })

  it('shows the Sales Call-specific heading', () => {
    render(<CompleteScreen useCaseId="sales-call" onGoHome={() => {}} />)
    expect(screen.getByText('🤝 Your Sales Call is complete!')).toBeInTheDocument()
  })
})
