// src/pages/desktopCopilot/plans.test.ts
import { describe, it, expect } from 'vitest'
import { PLANS, getPlan } from './plans'

describe('plans config', () => {
  it('has PRO, Premium, and Exam in order', () => {
    expect(PLANS.map(p => p.id)).toEqual(['pro', 'premium', 'exam'])
  })

  it('PRO and Premium both unlock interview, coding, and meeting', () => {
    for (const id of ['pro', 'premium'] as const) {
      expect(getPlan(id).unlockedUseCases).toEqual(['interview', 'coding', 'meeting'])
    }
  })

  it('Exam unlocks only exam', () => {
    expect(getPlan('exam').unlockedUseCases).toEqual(['exam'])
  })

  it('throws for an unknown plan id', () => {
    expect(() => getPlan('unknown' as never)).toThrow('Unknown plan: unknown')
  })
})
