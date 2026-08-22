// All amounts are in cents. Rates and included-usage amounts are illustrative pending real
// per-feature cost figures from the product owner — see the usage-based billing design doc.
export const CREDIT_WALLET = {
  balanceCents: 1840,
  totalCents: 2200,
  resetDateLabel: 'Sep 9, 2026',
} as const

export const TRIAL_BALANCE_CENTS = 60
export const TRIAL_TOTAL_CENTS = 100

export const FEATURE_RATES = {
  resumeMessageCents: 3,
  autoApplyApplicationCents: 15,
  interviewPrepPerMinuteCents: 12,
  copilotPerMinuteCents: 20,
} as const
