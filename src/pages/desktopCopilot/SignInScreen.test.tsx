// src/pages/desktopCopilot/SignInScreen.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { SignInScreen } from './SignInScreen'

describe('SignInScreen', () => {
  it('defaults to sign-up mode with confirm password, no invite code field', () => {
    render(<SignInScreen onBack={() => {}} onContinue={() => {}} />)
    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByText('Confirm password')).toBeInTheDocument()
    expect(screen.queryByText('Invite code')).not.toBeInTheDocument()
  })

  it('switches to enterprise mode when "I have an invite code" is clicked', () => {
    render(<SignInScreen onBack={() => {}} onContinue={() => {}} />)
    fireEvent.click(screen.getByText('I have an invite code'))
    expect(screen.getByText('Enterprise Sign In')).toBeInTheDocument()
    expect(screen.getByText('Invite code')).toBeInTheDocument()
    expect(screen.queryByText('Confirm password')).not.toBeInTheDocument()
  })

  it('calls onContinue with hasInviteCode true after filling the enterprise form', () => {
    const onContinue = vi.fn()
    render(<SignInScreen onBack={() => {}} onContinue={onContinue} />)
    fireEvent.click(screen.getByText('I have an invite code'))
    fireEvent.change(screen.getByPlaceholderText('Enter your invite code'), { target: { value: 'ENT123' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'rep@acme.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(onContinue).toHaveBeenCalledWith({ hasInviteCode: true })
  })

  it('calls onContinue with hasInviteCode false after filling the sign-up form', () => {
    const onContinue = vi.fn()
    render(<SignInScreen onBack={() => {}} onContinue={onContinue} />)
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'me@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(onContinue).toHaveBeenCalledWith({ hasInviteCode: false })
  })

  it('calls onBack when the back button is clicked', () => {
    const onBack = vi.fn()
    render(<SignInScreen onBack={onBack} onContinue={() => {}} />)
    fireEvent.click(screen.getByTitle('Back'))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
