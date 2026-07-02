import { describe, it, expect } from 'vitest'
import { USE_CASES, getUseCase } from './useCases'

describe('useCases config', () => {
  it('has all 5 use cases in order', () => {
    expect(USE_CASES.map(u => u.id)).toEqual(['interview', 'sales-call', 'meeting', 'exam', 'coding'])
  })

  it('marks interview, sales-call, and meeting as conversational with answer length', () => {
    for (const id of ['interview', 'sales-call', 'meeting'] as const) {
      const config = getUseCase(id)
      expect(config.canvasPattern).toBe('conversational')
      expect(config.hasAnswerLength).toBe(true)
    }
  })

  it('marks exam and coding as screenshot-qa without answer length', () => {
    for (const id of ['exam', 'coding'] as const) {
      const config = getUseCase(id)
      expect(config.canvasPattern).toBe('screenshot-qa')
      expect(config.hasAnswerLength).toBe(false)
    }
  })

  it('throws for an unknown use case id', () => {
    expect(() => getUseCase('unknown' as never)).toThrow('Unknown use case: unknown')
  })

  it('includes a context field for sales-call, after talk-track', () => {
    const config = getUseCase('sales-call')
    expect(config.setupFields).toContain('context')
    expect(config.setupFields.indexOf('talk-track')).toBeLessThan(config.setupFields.indexOf('context'))
  })
})
