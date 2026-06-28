// src/pages/desktopCopilot/plans.test.ts
import { describe, it, expect } from 'vitest'
import { PLANS, getPlan, annualMonthlyEquivalent } from './plans'

describe('plans config', () => {
  it('has Pro and Premium in order', () => {
    expect(PLANS.map(p => p.id)).toEqual(['pro', 'premium'])
  })

  it('Pro unlocks interview and coding only; Premium adds meeting on top', () => {
    expect(getPlan('pro').unlockedUseCases).toEqual(['interview', 'coding'])
    expect(getPlan('premium').unlockedUseCases).toEqual(['interview', 'coding', 'meeting'])
  })

  it('only Premium is marked popular', () => {
    expect(getPlan('pro').popular).toBe(false)
    expect(getPlan('premium').popular).toBe(true)
  })

  it('throws for an unknown plan id', () => {
    expect(() => getPlan('unknown' as never)).toThrow('Unknown plan: unknown')
  })
})

describe('annualMonthlyEquivalent', () => {
  it('discounts the monthly price by 20%, rounded', () => {
    expect(annualMonthlyEquivalent(49)).toBe(39)
    expect(annualMonthlyEquivalent(79)).toBe(63)
  })
})
