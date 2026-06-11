import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, DollarSign, Users, Target,
  BarChart2, FileText, Megaphone, Tag, ScrollText, LifeBuoy, Bell, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
      { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
      { to: '/admin/okr', icon: Target, label: 'OKR' },
    ],
  },
  {
    label: 'Users & Revenue',
    items: [
      { to: '/admin/users', icon: Users, label: 'Users' },
      { to: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
    ],
  },
  {
    label: 'Product',
    items: [
      { to: '/admin/resume-templates', icon: FileText, label: 'Resume Templates' },
    ],
  },
  {
    label: 'Communications',
    items: [
      { to: '/admin/broadcast', icon: Megaphone, label: 'Broadcast' },
      { to: '/admin/promotions', icon: Tag, label: 'Promotions' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/activity-logs', icon: ScrollText, label: 'Activity Logs' },
      { to: '/admin/support', icon: LifeBuoy, label: 'Support' },
      { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
      { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-52 shrink-0 flex-col bg-slate-900 overflow-y-auto">
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-white/10 px-4">
          <span className="text-sm font-bold text-white">Lightforth</span>
          <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-300">
            Admin
          </span>
        </div>

        <nav className="flex flex-1 flex-col px-2 py-3 gap-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
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
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
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
      <main className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
