import { BillingView } from '@/features/account/account-view'
import { billingPlans, creditUsageRows } from '@/mocks/account'
import { contextDocumentRows } from '@/mocks/documents'

export function BillingPage() {
  return <BillingView homeHref="/v3/app" plans={billingPlans} usageRows={creditUsageRows} documentRows={contextDocumentRows} />
}
