// src/pages/desktopCopilot/PricingScreen.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { PricingScreen } from './PricingScreen'

describe('PricingScreen', () => {
  it('renders PRO, Premium, and Exam cards with their price labels', () => {
    render(<PricingScreen onSelect={() => {}} />)
    expect(screen.getByText('PRO')).toBeInTheDocument()
    expect(screen.getByText('$49/mo')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('$79/mo')).toBeInTheDocument()
    expect(screen.getByText('Exam')).toBeInTheDocument()
    expect(screen.getByText('$500 one-time')).toBeInTheDocument()
  })

  it('calls onSelect with the chosen plan id', () => {
    const onSelect = vi.fn()
    render(<PricingScreen onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Choose Premium'))
    expect(onSelect).toHaveBeenCalledWith('premium')
  })
})
