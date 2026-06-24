// src/pages/desktopCopilot/plans.ts
import type { UseCaseId } from './useCases'

export type PlanId = 'pro' | 'premium' | 'exam'

export interface PlanConfig {
  id: PlanId
  label: string
  priceLabel: string
  description: string
  unlockedUseCases: UseCaseId[]
}

export const PLANS: PlanConfig[] = [
  {
    id: 'pro',
    label: 'PRO',
    priceLabel: '$49/mo',
    description: '50 credits — Interview, Coding, and Meeting Copilot, 1 credit per session',
    unlockedUseCases: ['interview', 'coding', 'meeting'],
  },
  {
    id: 'premium',
    label: 'Premium',
    priceLabel: '$79/mo',
    description: '100 credits — Interview, Coding, and Meeting Copilot, 1 credit per session',
    unlockedUseCases: ['interview', 'coding', 'meeting'],
  },
  {
    id: 'exam',
    label: 'Exam',
    priceLabel: '$500 one-time',
    description: 'Unlimited exam sessions, pay once',
    unlockedUseCases: ['exam'],
  },
]

export function getPlan(id: PlanId): PlanConfig {
  const found = PLANS.find(p => p.id === id)
  if (!found) throw new Error(`Unknown plan: ${id}`)
  return found
}
