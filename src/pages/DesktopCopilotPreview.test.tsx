// src/pages/DesktopCopilotPreview.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { vi } from 'vitest'
import { SetupScreen, PreferenceModal, ScreenshotCanvas, LiveCanvas, CompleteScreen, UseCaseSelectionScreen } from './DesktopCopilotPreview'

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

describe('UseCaseSelectionScreen', () => {
  it('renders only the cards for the given useCaseIds', () => {
    render(<UseCaseSelectionScreen useCaseIds={['interview', 'coding', 'meeting']} onSelect={() => {}} />)
    expect(screen.getByText('Interview')).toBeInTheDocument()
    expect(screen.getByText('Coding')).toBeInTheDocument()
    expect(screen.getByText('Meeting')).toBeInTheDocument()
    expect(screen.queryByText('Sales Call')).not.toBeInTheDocument()
    expect(screen.queryByText('Exam')).not.toBeInTheDocument()
  })

  it('renders all 5 cards when all 5 ids are passed', () => {
    render(<UseCaseSelectionScreen useCaseIds={['interview', 'sales-call', 'meeting', 'exam', 'coding']} onSelect={() => {}} />)
    expect(screen.getByText('Interview')).toBeInTheDocument()
    expect(screen.getByText('Sales Call')).toBeInTheDocument()
    expect(screen.getByText('Meeting')).toBeInTheDocument()
    expect(screen.getByText('Exam')).toBeInTheDocument()
    expect(screen.getByText('Coding')).toBeInTheDocument()
  })

  it('calls onSelect with the chosen use case id', () => {
    const onSelect = vi.fn()
    render(<UseCaseSelectionScreen useCaseIds={['interview', 'sales-call']} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Sales Call'))
    expect(onSelect).toHaveBeenCalledWith('sales-call')
  })
})

import DesktopCopilotPreview from './DesktopCopilotPreview'

describe('DesktopCopilotPreview end to end', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('walks from splash through sign-up and a Premium purchase to the scoped picker, then Exam setup', async () => {
    render(<DesktopCopilotPreview />)
    await act(async () => { vi.advanceTimersByTime(2300) })
    expect(screen.getByText('Welcome to Lightforth Co-Pilot')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Continue'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(screen.getByText('Level Up')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Upgrade to Premium'))
    fireEvent.change(screen.getByPlaceholderText('1234 1234 1234 1234'), { target: { value: '4242424242424242' } })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/30' } })
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123' } })
    fireEvent.click(screen.getByText('Pay $79/mo'))

    expect(screen.getByText('What are you using Copilot for?')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Exam'))

    expect(screen.getByText('Subject')).toBeInTheDocument()
    expect(screen.queryByText('Select Audio')).not.toBeInTheDocument()
  })

  it('a Pro purchase shows the scoped picker (including Exam) and routes Coding to the screenshot canvas', async () => {
    render(<DesktopCopilotPreview />)
    await act(async () => { vi.advanceTimersByTime(2300) })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))

    fireEvent.click(screen.getByText('Pro'))
    fireEvent.change(screen.getByPlaceholderText('1234 1234 1234 1234'), { target: { value: '4242424242424242' } })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/30' } })
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123' } })
    fireEvent.click(screen.getByText('Pay $49/mo'))

    expect(screen.getByText('What are you using Copilot for?')).toBeInTheDocument()
    expect(screen.getByText('Exam')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Coding'))
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Confirm'))
    expect(screen.getAllByText(/Press Space to capture/).length).toBeGreaterThan(0)
  })

  it('an invite code at sign-in skips Pricing and goes straight to Sales Call setup', async () => {
    render(<DesktopCopilotPreview />)
    await act(async () => { vi.advanceTimersByTime(2300) })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('I have an invite code'))
    fireEvent.change(screen.getByPlaceholderText('Enter your invite code'), { target: { value: 'ENT123' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'rep@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))

    expect(screen.queryByText('Choose your plan')).not.toBeInTheDocument()
    expect(screen.getByText('Customer / Company name')).toBeInTheDocument()
  })
})
