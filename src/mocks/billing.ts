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
    credits: 20,
    description: 'You can do up to 20 total actions per month, in any combination.',
    features: [
      'Flexible - use credits on any feature',
      'Resume builder',
      'Auto-apply',
      'Interview prep',
      'Copilot',
      'AI suggestions',
      'Download resumes',
    ],
    note: 'Ideal for light or occasional job applications',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 49,
    credits: 100,
    description: 'More credits, more freedom. Every feature still costs 1 credit per use, but you have 5x more room to job-hunt aggressively.',
    features: ['All features from Starter', 'Perfect for active job seekers applying weekly'],
    note: 'Best for users who want AI and autopilot help consistently',
    popular: true,
  },
  {
    id: 'business',
    name: 'Premium',
    priceMonthly: 79,
    credits: 250,
    description: 'Built for power users who apply daily or want maximum automation.',
    features: ['All features included', 'Ideal for high-volume applications, daily resume updates, or intensive interview prep'],
    note: 'Best value for serious job hunters',
  },
]
