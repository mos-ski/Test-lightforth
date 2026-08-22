import { useSearchParams } from 'react-router-dom'

import { DashboardView } from '@/features/dashboard/dashboard-view'
import { dashboardActions, dashboardInstallPrompt, dashboardNavItems } from '@/mocks/dashboard'
import { candidateSession } from '@/mocks/sessions'
import { CREDIT_WALLET, TRIAL_CREDIT_TOTAL } from '@/mocks/wallet'

export function DashboardPage() {
  const [params] = useSearchParams()
  const dropdownParam = params.get('dropdown')
  const creditParam = params.get('credit')
  const activeDropdown = dropdownParam === 'help' || dropdownParam === 'credits' || dropdownParam === 'profile' ? dropdownParam : undefined
  const creditNotice = creditParam === 'low' || creditParam === 'empty' ? creditParam : undefined
  // `credit=trial` demos a user with no active plan: Lightforth still grants 5 free credits every month by default.
  const isTrial = creditParam === 'trial'
  const totalCredits = isTrial ? TRIAL_CREDIT_TOTAL : CREDIT_WALLET.total
  const creditBalance = activeDropdown === 'credits' || creditNotice === 'empty'
    ? 0
    : creditNotice === 'low'
      ? 5
      : isTrial
        ? 3
        : CREDIT_WALLET.balance
  const user = candidateSession.status === 'authenticated' ? candidateSession.user : {
    id: 'review-user',
    email: 'review@lightforth.ai',
    name: 'Review User',
    role: 'candidate' as const,
    permissions: ['app:view'] as const,
  }

  return (
    <DashboardView
      user={user}
      navItems={dashboardNavItems}
      actions={dashboardActions}
      installPrompt={dashboardInstallPrompt}
      creditBalance={creditBalance}
      totalCredits={totalCredits}
      isLoading={params.get('state') === 'loading'}
      activeDropdown={activeDropdown}
      creditNotice={creditNotice}
    />
  )
}
