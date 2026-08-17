import type { BillingSnapshot, Plan } from '@/contracts/billing'

export type BillingPlanFixture = {
  readonly id: Plan
  readonly name: string
  readonly priceMonthly: number
  readonly credits: number
  readonly description: string
  readonly features: readonly string[]
  readonly note: string
  readonly popular?: boolean
}

export const billingSnapshot: BillingSnapshot = {
  status: 'ready',
  plan: 'pro',
  wallet: {
    balance: 100,
    currency: 'credits',
    reserved: 0,
  },
  access: {
    resume: { feature: 'resume', entitled: true, creditCost: 1 },
    'interview-prep': { feature: 'interview-prep', entitled: true, creditCost: 1 },
    'auto-apply': { feature: 'auto-apply', entitled: true, creditCost: 1 },
    copilot: { feature: 'copilot', entitled: true, creditCost: 1 },
  },
}

export const authPlanFixtures: readonly BillingPlanFixture[] = [
  {
    id: 'free',
    name: 'Starter',
    priceMonthly: 27,
    credits: 15,
    description: 'You can do up to 15 total actions per month, in any combination.',
    features: [
      'Resume builder',
      'Resume downloads',
      'AI suggestions',
    ],
    note: 'Ideal for light or occasional job applications',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 49,
    credits: 50,
    description: 'More credits, more freedom. Every feature still costs 1 credit per use, but you have room to job-hunt aggressively.',
    features: [
      'Everything in Starter',
      'Auto-Apply (Scout, Filter, Tailor & Driver agents)',
      'AI interview prep',
      'Interview & Coding Copilot',
    ],
    note: 'Best for users who want AI and autopilot help consistently',
    popular: true,
  },
  {
    id: 'business',
    name: 'Premium',
    priceMonthly: 79,
    credits: 100,
    description: 'Built for power users who apply daily or want maximum automation.',
    features: [
      'Everything in Pro',
      'Meeting Copilot',
      'Automate job applications with a daily quota',
      'Priority support',
    ],
    note: 'Best value for serious job hunters',
  },
]
