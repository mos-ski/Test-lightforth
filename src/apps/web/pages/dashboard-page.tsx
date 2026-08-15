import { useSearchParams } from 'react-router-dom'

import { DashboardView } from '@/features/dashboard/dashboard-view'
import { dashboardActions, dashboardInstallPrompt, dashboardNavItems } from '@/mocks/dashboard'
import { candidateSession } from '@/mocks/sessions'

export function DashboardPage() {
  const [params] = useSearchParams()
  const dropdownParam = params.get('dropdown')
  const creditParam = params.get('credit')
  const activeDropdown = dropdownParam === 'help' || dropdownParam === 'credits' ? dropdownParam : undefined
  const creditNotice = creditParam === 'low' || creditParam === 'empty' ? creditParam : undefined
  const creditBalance = activeDropdown === 'credits' || creditNotice === 'empty' ? 0 : creditNotice === 'low' ? 5 : 20
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
      isLoading={params.get('state') === 'loading'}
      activeDropdown={activeDropdown}
      creditNotice={creditNotice}
    />
  )
}
