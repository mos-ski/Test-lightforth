// src/pages/desktopCopilot/SignInScreen.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { SignInScreen } from './SignInScreen'
import { createOrg, emptyKnowledgeBase, generateInviteCode } from '../sales/mockOrg'

describe('SignInScreen', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to sign-up mode with confirm password, no invite code field', () => {
    render(<SignInScreen onBack={() => {}} onContinue={() => {}} />)
    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByText('Confirm password')).toBeInTheDocument()
    expect(screen.queryByText('Invite code')).not.toBeInTheDocument()
  })

  it('switches to enterprise mode when "I have an invite code" is clicked, and still asks to create+confirm a password', () => {
    render(<SignInScreen onBack={() => {}} onContinue={() => {}} />)
    fireEvent.click(screen.getByText('I have an invite code'))
    expect(screen.getByText('Activate your seat')).toBeInTheDocument()
    expect(screen.getByText('Invite code')).toBeInTheDocument()
    expect(screen.getByText('Confirm password')).toBeInTheDocument()
  })

  it('rejects an invite code that does not match the email on record', () => {
    createOrg('admin@acme.com', {
      orgName: 'Acme Inc',
      setupFeePaid: true,
      knowledgeBase: emptyKnowledgeBase(),
      calls: [],
      connectedIntegrations: [],
      members: [{ id: '1', name: 'Rep', email: 'rep@acme.com', role: 'member', inviteCode: generateInviteCode(), seatPaid: true }],
    })
    const onContinue = vi.fn()
    render(<SignInScreen onBack={() => {}} onContinue={onContinue} />)
    fireEvent.click(screen.getByText('I have an invite code'))
    fireEvent.change(screen.getByPlaceholderText('Enter your invite code'), { target: { value: 'WRONGCODE' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'rep@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Activate & sign in'))
    expect(screen.getByText(/doesn't match this email/)).toBeInTheDocument()
    expect(onContinue).not.toHaveBeenCalled()
  })

  it('calls onContinue with track "enterprise-invite" once the email, invite code, and seat-paid status all match', () => {
    const inviteCode = generateInviteCode()
    createOrg('admin@acme.com', {
      orgName: 'Acme Inc',
      setupFeePaid: true,
      knowledgeBase: emptyKnowledgeBase(),
      calls: [],
      connectedIntegrations: [],
      members: [{ id: '1', name: 'Rep', email: 'rep@acme.com', role: 'member', inviteCode, seatPaid: true }],
    })
    const onContinue = vi.fn()
    render(<SignInScreen onBack={() => {}} onContinue={onContinue} />)
    fireEvent.click(screen.getByText('I have an invite code'))
    fireEvent.change(screen.getByPlaceholderText('Enter your invite code'), { target: { value: inviteCode } })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'rep@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Activate & sign in'))
    expect(onContinue).toHaveBeenCalledWith({ email: 'rep@acme.com', track: 'enterprise-invite' })
  })

  it('calls onContinue with track "regular-signup" after filling the sign-up form', () => {
    const onContinue = vi.fn()
    render(<SignInScreen onBack={() => {}} onContinue={onContinue} />)
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(onContinue).toHaveBeenCalledWith({ email: 'me@example.com', track: 'regular-signup' })
  })

  it('calls onBack when the back button is clicked', () => {
    const onBack = vi.fn()
    render(<SignInScreen onBack={onBack} onContinue={() => {}} />)
    fireEvent.click(screen.getByTitle('Back'))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
