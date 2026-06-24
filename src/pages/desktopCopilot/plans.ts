// src/pages/desktopCopilot/plans.ts
import type { UseCaseId } from './useCases'

export type PlanId = 'pro' | 'premium'
export type BillingCycle = 'monthly' | 'annual'

export interface PlanConfig {
  id: PlanId
  label: string
  monthlyPrice: number
  credits: number
  popular: boolean
  bullets: string[]
  bestForNote: string
  unlockedUseCases: UseCaseId[]
}

export const PLANS: PlanConfig[] = [
  {
    id: 'pro',
    label: 'Pro',
    monthlyPrice: 49,
    credits: 100,
    popular: false,
    bullets: ['All features from Starter', 'Perfect for active job seekers applying weekly'],
    bestForNote: 'Best for users who want AI + autopilot help consistently',
    unlockedUseCases: ['interview', 'coding', 'meeting', 'exam'],
  },
  {
    id: 'premium',
    label: 'Premium',
    monthlyPrice: 79,
    credits: 250,
    popular: true,
    bullets: ['All features included', 'Ideal for high-volume applications, daily resume updates, or intensive interview prep'],
    bestForNote: 'Best value for serious job hunters',
    unlockedUseCases: ['interview', 'coding', 'meeting', 'exam'],
  },
]

export function getPlan(id: PlanId): PlanConfig {
  const found = PLANS.find(p => p.id === id)
  if (!found) throw new Error(`Unknown plan: ${id}`)
  return found
}

export function annualMonthlyEquivalent(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 0.8)
}
