// src/pages/cosella/app/shared.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { formatTime, CosellaMacWindow } from './shared'

describe('cosella app shared chrome', () => {
  it('formats seconds as mm:ss', () => {
    expect(formatTime(65)).toBe('01:05')
    expect(formatTime(5)).toBe('00:05')
  })

  it('CosellaMacWindow renders its children', () => {
    render(<CosellaMacWindow><p>Inside window</p></CosellaMacWindow>)
    expect(screen.getByText('Inside window')).toBeInTheDocument()
  })
})
