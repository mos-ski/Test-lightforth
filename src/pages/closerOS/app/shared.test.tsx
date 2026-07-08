// src/pages/closerOS/app/shared.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { formatTime, CloserMacWindow } from './shared'

describe('closerOS app shared chrome', () => {
  it('formats seconds as mm:ss', () => {
    expect(formatTime(65)).toBe('01:05')
    expect(formatTime(5)).toBe('00:05')
  })

  it('CloserMacWindow renders its children', () => {
    render(<CloserMacWindow><p>Inside window</p></CloserMacWindow>)
    expect(screen.getByText('Inside window')).toBeInTheDocument()
  })
})
