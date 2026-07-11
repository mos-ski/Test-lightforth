import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, DollarSign, Users, UserPlus, Building2,
  BarChart2, FileText, Megaphone, Tag, ScrollText, LifeBuoy, Bell, Settings,
  Zap, MessageSquare, BookOpen, FileCheck, Folder,
  CreditCard, Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  end?: boolean
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Core',
    items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
      { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    ],
  },
  {
    label: 'Revenue',
    items: [
      { to: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
      { to: '/admin/promotions', icon: Tag, label: 'Promotions' },
    ],
  },
  {
    label: 'Users',
    items: [
      { to: '/admin/users', icon: Users, label: 'All Users' },
      { to: '/admin/users/partners', icon: UserPlus, label: 'Partners & Affiliates' },
      { to: '/admin/users/enterprises', icon: Building2, label: 'Enterprises' },
    ],
  },
  {
    label: 'Products',
    items: [
      { to: '/admin/auto-apply', icon: Zap, label: 'Auto-Apply' },
      { to: '/admin/interview-copilot', icon: MessageSquare, label: 'Interview Copilot' },
      { to: '/admin/interview-prep', icon: BookOpen, label: 'Interview Prep' },
      { to: '/admin/meeting', icon: Video, label: 'Meeting' },
      { to: '/admin/resume-builder', icon: FileText, label: 'Resume Builder' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { to: '/admin/funnels', icon: Folder, label: 'Funnels' },
      { to: '/admin/broadcast', icon: Megaphone, label: 'Broadcast' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/activity-logs', icon: ScrollText, label: 'Activity Logs' },
      { to: '/admin/support', icon: LifeBuoy, label: 'Support' },
      { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
      { to: '/admin/pricing', icon: CreditCard, label: 'Pricing Config' },
      { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card overflow-y-auto">
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">L</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Lightforth</span>
          </div>
          <span className="ml-auto rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col px-3 py-4 gap-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-y-auto bg-white px-4 pt-6 sm:px-6 sm:py-8 pb-6">
        <Outlet />
      </main>
    </div>
  )
}
