import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { CreditCard, Database, LayoutDashboard, LogOut, Phone, Plug, Settings as SettingsIcon, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getActiveAdminEmail, getOrgByAdminEmail, type SalesOrg } from './mockOrg'

const NAV = [
  { to: '/sales/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/sales/dashboard/knowledge-base', label: 'Knowledge Base', icon: Database, end: false },
  { to: '/sales/dashboard/team', label: 'Team', icon: Users, end: false },
  { to: '/sales/dashboard/calls', label: 'Call History', icon: Phone, end: false },
  { to: '/sales/dashboard/billing', label: 'Billing & Subscription', icon: CreditCard, end: false },
  { to: '/sales/dashboard/integrations', label: 'Integrations', icon: Plug, end: false },
  { to: '/sales/dashboard/settings', label: 'Settings', icon: SettingsIcon, end: false },
]

export interface SalesDashboardContext {
  adminEmail: string
  org: SalesOrg
  refresh: () => void
}

export default function SalesAdminLayout() {
  const navigate = useNavigate()
  const [adminEmail] = useState(() => getActiveAdminEmail())
  const [org, setOrg] = useState<SalesOrg | null>(() => (adminEmail ? getOrgByAdminEmail(adminEmail) : null))

  useEffect(() => {
    if (!adminEmail || !org) navigate('/copilot/enterprise')
  }, [adminEmail, org, navigate])

  if (!adminEmail || !org) return null

  const refresh = () => setOrg(getOrgByAdminEmail(adminEmail))

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-shrink-0 flex-col justify-between bg-[#08285c] px-5 py-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-400 text-xs font-black text-[#08285c]">L</span>
            <span className="text-base font-bold text-white">Lightforth</span>
          </div>
          <p className="mt-6 truncate text-xs font-semibold uppercase tracking-wide text-teal-300">{org.orgName}</p>

          <nav className="mt-6 flex flex-col gap-1">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={() => navigate('/copilot/enterprise')}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet context={{ adminEmail, org, refresh } satisfies SalesDashboardContext} />
      </main>
    </div>
  )
}
