import { DashboardView } from '@/features/dashboard/dashboard-view'
import { dashboardActions, dashboardInstallPrompt, dashboardNavItems } from '@/mocks/dashboard'
import { candidateSession } from '@/mocks/sessions'

export function DashboardPage() {
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
      creditBalance={20}
    />
  )
}
