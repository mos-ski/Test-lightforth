import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, DollarSign, Users, UserPlus, Building2,
  BarChart2, FileText, Megaphone, Tag, ScrollText, LifeBuoy, Bell, Settings,
  Zap, MessageSquare, BookOpen, FileCheck, Folder,
  CreditCard, Video, Search, Code2, Menu, X,
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
      { to: '/admin/coding-copilot', icon: Code2, label: 'Coding Copilot' },
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

const SEARCH_RECORDS = [
  ...NAV_GROUPS.flatMap(group => group.items.map(item => ({ label: item.label, group: group.label, to: item.to }))),
  { label: 'Darnell Smith', group: 'User', to: '/admin/users/1' },
  { label: 'Jessica Williams', group: 'User', to: '/admin/users/2' },
  { label: 'Howard University', group: 'Enterprise', to: '/admin/users/enterprises' },
  { label: 'Georgia Tech', group: 'Enterprise', to: '/admin/users/enterprises' },
  { label: 'Auto-Apply failures', group: 'Product', to: '/admin/auto-apply' },
  { label: 'Pricing plans', group: 'Revenue', to: '/admin/pricing' },
  { label: 'Support tickets', group: 'System', to: '/admin/support' },
]

export default function AdminLayout() {
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return SEARCH_RECORDS
      .filter(item => `${item.label} ${item.group}`.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query])

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 -translate-x-full flex-col border-r border-border bg-card overflow-y-auto transition-transform duration-200 ease-in-out',
          'lg:static lg:z-auto lg:w-56 lg:translate-x-0',
          sidebarOpen && 'translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-5">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="h-6 w-6" />
            <span className="text-sm font-semibold text-foreground">Lightforth</span>
          </div>
          <span className="ml-auto rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            Admin
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-2 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
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
      <main className="flex flex-1 flex-col overflow-y-auto bg-white px-4 pt-4 sm:px-6 sm:py-6 pb-6 min-w-0">
        {/* Mobile top bar */}
        <div className="mb-4 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">L</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Lightforth</span>
          </div>
          <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            Admin
          </span>
        </div>

        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search admin: users, revenue, tickets, modules..."
            className="lf-input h-11 w-full max-w-2xl pl-10"
          />
          {results.length > 0 && (
            <div className="absolute left-0 top-full z-30 mt-2 w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-white shadow-xl">
              {results.map(item => (
                <Link
                  key={`${item.group}-${item.label}`}
                  to={item.to}
                  onClick={() => setQuery('')}
                  className="flex items-center justify-between border-b border-border/60 px-4 py-3 text-sm transition-colors last:border-0 hover:bg-muted/50"
                >
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.group}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Outlet />
      </main>
    </div>
  )
}
