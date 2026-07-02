// src/pages/DesktopCopilotPreview.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { SetupScreen, RegularSetupScreen, PreferenceModal, ScreenshotCanvas, LiveCanvas, CompleteScreen } from './DesktopCopilotPreview'
import { createOrg, emptyKnowledgeBase, generateInviteCode } from './sales/mockOrg'
import { setAccount } from './desktopCopilot/mockAccounts'

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

  it('renders only Subject for exam, with no audio field', () => {
    render(<SetupScreen useCaseId="exam" onContinue={() => {}} />)
    expect(screen.getByText('Subject')).toBeInTheDocument()
    expect(screen.queryByText('Select Audio')).not.toBeInTheDocument()
  })

  it('opens the Preference modal on Continue once a required field is filled', () => {
    render(<SetupScreen useCaseId="exam" onContinue={() => {}} />)
    fireEvent.change(screen.getByPlaceholderText('e.g. Calculus II'), { target: { value: 'Calculus II' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(screen.getByText('Preference')).toBeInTheDocument()
  })

  it('renders a Context picker for sales-call, sourced from the org Knowledge Base for an enterprise account', () => {
    createOrg('admin@acme.com', {
      orgName: 'Acme Inc',
      planTier: 'enterprise',
      setupFeePaid: true,
      knowledgeBase: { ...emptyKnowledgeBase(), documents: [{ id: 'd1', name: 'Battlecard.pdf', enabled: true }] },
      calls: [],
      connectedIntegrations: [],
      members: [{ id: '1', name: 'Admin', email: 'admin@acme.com', role: 'admin', inviteCode: generateInviteCode(), seatPaid: true }],
    })
    setAccount('admin@acme.com', { accountType: 'enterprise-admin', orgName: 'Acme Inc' })
    render(<SetupScreen useCaseId="sales-call" email="admin@acme.com" onContinue={() => {}} />)
    expect(screen.getByText(/Add context from your documents/)).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Add context from your documents/))
    expect(screen.getByText('Battlecard.pdf')).toBeInTheDocument()
  })
})

describe('RegularSetupScreen', () => {
  it('defaults to the Interview tab and swaps fields when Coding or Meeting is clicked', () => {
    render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding', 'meeting']} />)
    expect(screen.getByText('Position')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Coding' }))
    expect(screen.getByText(/Language/)).toBeInTheDocument()
    expect(screen.queryByText('Position')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Meeting' }))
    expect(screen.getByText('Meeting title')).toBeInTheDocument()
    expect(screen.queryByText(/Language/)).not.toBeInTheDocument()
  })

  it('requires a label for Interview and Meeting, but Continue is always enabled for Coding', () => {
    render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding', 'meeting']} />)
    expect(screen.getByText('Continue')).toHaveStyle({ opacity: 0.45 })

    fireEvent.click(screen.getByRole('button', { name: 'Coding' }))
    expect(screen.getByText('Continue')).not.toHaveStyle({ opacity: 0.45 })
  })

  it('calls onContinue with the active tab id and label after confirming preference', () => {
    const onContinue = vi.fn()
    render(<RegularSetupScreen onBack={() => {}} onContinue={onContinue} unlockedUseCases={['interview', 'coding', 'meeting']} />)
    fireEvent.change(screen.getByPlaceholderText('e.g. Product Manager'), { target: { value: 'Staff Engineer' } })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Confirm'))
    expect(onContinue).toHaveBeenCalledWith('interview', 'Staff Engineer')
  })

  it('hides the Meeting tab for plans that have not unlocked it (Pro)', () => {
    render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding']} />)
    expect(screen.getByRole('button', { name: 'Interview' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Coding' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Meeting' })).not.toBeInTheDocument()
  })

  it('renders a Context picker on the Interview tab, sourced from the personal Context library', () => {
    render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding', 'meeting']} />)
    expect(screen.getByText(/Add context from your documents/)).toBeInTheDocument()
  })

  it('replaces the old free-text Context textarea on the Meeting tab with a picker', () => {
    render(<RegularSetupScreen onBack={() => {}} onContinue={() => {}} unlockedUseCases={['interview', 'coding', 'meeting']} />)
    fireEvent.click(screen.getByRole('button', { name: 'Meeting' }))
    expect(screen.queryByPlaceholderText(/Paste any background info/)).not.toBeInTheDocument()
    expect(screen.getByText(/Add context from your documents/)).toBeInTheDocument()
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

  it('watches the screen automatically by default (Auto Respond is on)', () => {
    render(<ScreenshotCanvas useCaseId="exam" primaryLabel="Calculus II" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText(/Watching your screen/)).toBeInTheDocument()
  })

  it('captures, analyzes, and shows an answer on consecutive Space presses', () => {
    render(<ScreenshotCanvas useCaseId="exam" primaryLabel="Calculus II" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.keyDown(window, { code: 'Space' })
    act(() => { vi.advanceTimersByTime(600) })
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(900) })
    expect(screen.getByText('Answer ready')).toBeInTheDocument()
  })

  it('Ctrl+Enter also forces an immediate capture', () => {
    render(<ScreenshotCanvas useCaseId="exam" primaryLabel="Calculus II" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.keyDown(window, { code: 'Enter', ctrlKey: true })
    expect(screen.getByText('Capturing screen...')).toBeInTheDocument()
  })

  it('renders the answer as a code block with a Copy button for coding', () => {
    render(<ScreenshotCanvas useCaseId="coding" primaryLabel="" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.keyDown(window, { code: 'Space' })
    act(() => { vi.advanceTimersByTime(600) }) // capturing
    act(() => { vi.advanceTimersByTime(900) }) // analyzing to answered
    expect(screen.getByRole('button', { name: /Copy/ })).toBeInTheDocument()
  })

  it('auto-advances through capturing/analyzing without any key press', () => {
    render(<ScreenshotCanvas useCaseId="exam" primaryLabel="Calculus II" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    act(() => { vi.advanceTimersByTime(2000) }) // idle -> capturing, automatically
    expect(screen.getByText('Capturing screen...')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(600) })
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
  })

  it('can be switched to manual-only capture via Settings', () => {
    render(<ScreenshotCanvas useCaseId="exam" primaryLabel="Calculus II" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    fireEvent.click(screen.getByTestId('open-settings'))
    const autoRespondToggle = screen.getByText('Auto Respond').closest('div')!.parentElement!.querySelector('button')!
    fireEvent.click(autoRespondToggle)
    const settingsDialog = screen.getByText('Settings').closest('div')!.parentElement!
    const closeBtn = settingsDialog.querySelector('button:last-child')!
    fireEvent.click(closeBtn)

    expect(screen.getByText(/Press Space or Ctrl\+Enter to capture your screen/)).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(5000) })
    expect(screen.getByText(/Press Space or Ctrl\+Enter to capture your screen/)).toBeInTheDocument()
  })
})

describe('LiveCanvas', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('labels the first interviewer "Interviewer 1" and titles the bar "Interview for {label}"', () => {
    render(<LiveCanvas useCaseId="interview" primaryLabel="Product Manager" onEnd={() => {}} transparency={0} onTransparencyChange={() => {}} />)
    expect(screen.getByText('Interview for Product Manager')).toBeInTheDocument()
    fireEvent.keyDown(window, { code: 'Space' })
    expect(screen.getAllByText('Interviewer 1').length).toBeGreaterThan(0)
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
    render(<CompleteScreen useCaseId="interview" onBack={() => {}} onGoHome={() => {}} />)
    expect(screen.getByText('👏 Your Interview is complete!')).toBeInTheDocument()
  })

  it('shows the Sales Call-specific heading', () => {
    render(<CompleteScreen useCaseId="sales-call" onBack={() => {}} onGoHome={() => {}} />)
    expect(screen.getByText('🤝 Your Sales Call is complete!')).toBeInTheDocument()
  })
})

import DesktopCopilotPreview from './DesktopCopilotPreview'

describe('DesktopCopilotPreview end to end', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })
  afterEach(() => vi.useRealTimers())

  function renderApp() {
    return render(
      <MemoryRouter>
        <DesktopCopilotPreview />
      </MemoryRouter>,
    )
  }

  it('walks from splash through sign-in to a returning Premium account straight to the tabbed setup (no picker), then into the Interview canvas', async () => {
    setAccount('me@example.com', { accountType: 'regular', planId: 'premium' })
    renderApp()
    await act(async () => { vi.advanceTimersByTime(2300) })
    expect(screen.getByText('Welcome to Lightforth Co-Pilot')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Continue'))
    expect(screen.getByText('Welcome to Lightforth Copilot')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Sign in'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))

    // Straight onto the tabbed setup — no "What are you using Copilot for?" picker anymore
    expect(screen.queryByText('What are you using Copilot for?')).not.toBeInTheDocument()
    expect(screen.getByText('👋 Hola, Welcome to Interview Co-Pilot')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Coding' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Meeting' })).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('e.g. Product Manager'), { target: { value: 'Staff Engineer' } })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Confirm'))
    expect(screen.getByText('Interview for Staff Engineer')).toBeInTheDocument()
  })

  it('a returning Pro account lands on the tabbed setup with Meeting hidden, and switching to the Coding tab routes into the screenshot canvas', async () => {
    setAccount('me2@example.com', { accountType: 'regular', planId: 'pro' })
    renderApp()
    await act(async () => { vi.advanceTimersByTime(2300) })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Sign in'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me2@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))

    expect(screen.queryByRole('button', { name: 'Meeting' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Coding' }))
    expect(screen.getByText(/Language/)).toBeInTheDocument()
    expect(screen.queryByText('Position')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Confirm'))
    expect(screen.getAllByText(/Watching your screen/).length).toBeGreaterThan(0)
  })

  it('signing in with an email that has no account on record still succeeds (validation removed) and lands on the default Pro tabbed setup', async () => {
    renderApp()
    await act(async () => { vi.advanceTimersByTime(2300) })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Sign in'))
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'nobody@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(screen.getByText('👋 Hola, Welcome to Interview Co-Pilot')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Coding' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Meeting' })).not.toBeInTheDocument()
  })

  it('an invite code at sign-in is no longer validated against the org — a mismatched code still activates the seat and skips Pricing', async () => {
    const inviteCode = generateInviteCode()
    createOrg('admin@acme.com', {
      orgName: 'Acme Inc',
      planTier: 'enterprise',
      setupFeePaid: true,
      knowledgeBase: emptyKnowledgeBase(),
      calls: [],
      connectedIntegrations: [],
      members: [
        { id: '1', name: 'Admin', email: 'admin@acme.com', role: 'admin', inviteCode: generateInviteCode(), seatPaid: true },
        { id: '2', name: 'Rep One', email: 'rep@acme.com', role: 'member', inviteCode, seatPaid: true },
      ],
    })

    renderApp()
    await act(async () => { vi.advanceTimersByTime(2300) })
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('I have an invite code'))

    fireEvent.change(screen.getByPlaceholderText('Enter your invite code'), { target: { value: 'WRONGCODE' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'rep@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Activate & sign in'))

    expect(screen.queryByText('Choose your plan')).not.toBeInTheDocument()
    expect(screen.getByText('Customer / Company name')).toBeInTheDocument()
  })
})
