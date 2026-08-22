import { BillingView } from '@/features/account/account-view'
import { billingPlans, creditUsageRows } from '@/mocks/account'
import { CREDIT_WALLET } from '@/mocks/wallet'

export function BillingPage() {
  return (
    <BillingView
      homeHref="/v3/app"
      plans={billingPlans}
      usageRows={creditUsageRows}
      wallet={{ remaining: CREDIT_WALLET.balance, total: CREDIT_WALLET.total, resetDateLabel: CREDIT_WALLET.resetDateLabel }}
    />
  )
}
