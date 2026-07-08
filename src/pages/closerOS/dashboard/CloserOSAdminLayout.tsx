import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CreditCard, RefreshCw, BookOpen, MessageSquare, Radar, Ghost, Radio,
  Users, Phone, CircleDollarSign, Plug, Settings as SettingsIcon, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getActiveAdminEmail, getOrgByAdminEmail, type CloserOrg } from '../closerOrgStore'

const NAV = [
  { to: '/closer-os/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/closer-os/dashboard/payment-settings', label: 'Payment Settings', icon: CreditCard, end: false },
  { to: '/closer-os/dashboard/plan-tracker', label: 'Plan Tracker', icon: RefreshCw, end: false },
  { to: '/closer-os/dashboard/ledger', label: 'Ledger', icon: BookOpen, end: false },
  { to: '/closer-os/dashboard/slack-report', label: 'Slack Report', icon: MessageSquare, end: false },
  { to: '/closer-os/dashboard/prospect-intel', label: 'Prospect Intel', icon: Radar, end: false },
  { to: '/closer-os/dashboard/ghost-simulator', label: 'Ghost Simulator', icon: Ghost, end: false },
  { to: '/closer-os/dashboard/rescue-board', label: 'Live Rescue Board', icon: Radio, end: false },
  { to: '/closer-os/dashboard/team', label: 'Team', icon: Users, end: false },
  { to: '/closer-os/dashboard/calls', label: 'Call History', icon: Phone, end: false },
  { to: '/closer-os/dashboard/billing', label: 'Billing', icon: CircleDollarSign, end: false },
  { to: '/closer-os/dashboard/integrations', label: 'Integrations', icon: Plug, end: false },
  { to: '/closer-os/dashboard/settings', label: 'Settings', icon: SettingsIcon, end: false },
]

export interface CloserDashboardContext {
  adminEmail: string
  org: CloserOrg
  refresh: () => void
}

export default function CloserOSAdminLayout() {
  const navigate = useNavigate()
  const [adminEmail] = useState(() => getActiveAdminEmail())
  const [org, setOrg] = useState<CloserOrg | null>(() => (adminEmail ? getOrgByAdminEmail(adminEmail) : null))

  useEffect(() => {
    if (!adminEmail || !org) navigate('/closer-os')
  }, [adminEmail, org, navigate])

  if (!adminEmail || !org) return null

  const refresh = () => setOrg(getOrgByAdminEmail(adminEmail))

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-shrink-0 flex-col justify-between bg-[#052e1f] px-5 py-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400 text-xs font-black text-[#052e1f]">C</span>
            <span className="text-base font-bold text-white">Closer OS</span>
          </div>
          <p className="mt-6 truncate text-xs font-semibold uppercase tracking-wide text-emerald-300">{org.orgName}</p>

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
          onClick={() => navigate('/closer-os')}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet context={{ adminEmail, org, refresh } satisfies CloserDashboardContext} />
      </main>
    </div>
  )
}
