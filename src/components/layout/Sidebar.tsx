import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Target,
  Headphones,
  Compass,
  Download,
  CreditCard,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import UpgradeCard from '@/components/shared/UpgradeCard'
import LightforthLogo from '@/components/shared/LightforthLogo'

const PRIMARY_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/documents', icon: FileText, label: 'My Documents', chevron: true },
  { to: '/auto-apply', icon: Briefcase, label: 'Auto-Apply' },
  { to: '/interview-prep', icon: Target, label: 'Interview Prep' },
  { to: '/interview-copilot', icon: Headphones, label: 'Interview Co-Pilot' },
]

const SECONDARY_NAV = [
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/downloads', icon: Download, label: 'Downloads' },
  { to: '/billing', icon: CreditCard, label: 'Billing & subscription' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function NavItem({
  to,
  icon: Icon,
  label,
  end,
  chevron,
  redDot,
}: {
  to: string
  icon: React.ElementType
  label: string
  end?: boolean
  chevron?: boolean
  redDot?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary/5 text-primary'
            : 'text-foreground hover:bg-muted',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-4 w-4 flex-shrink-0',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          />
          <span className="flex-1 truncate">{label}</span>
          {redDot && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />}
          {chevron && (
            <ChevronDown className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4">
        <LightforthLogo className="h-7" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2">
        {PRIMARY_NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <div className="my-2 border-t border-border" />

        {SECONDARY_NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <div className="my-2 border-t border-border" />

        {/* How to use — YouTube-style */}
        <NavLink
          to="/how-to-use"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive ? 'bg-primary/5 text-primary' : 'text-foreground hover:bg-muted',
            )
          }
        >
          <span className="flex h-5 w-7 flex-shrink-0 items-center justify-center rounded bg-red-600">
            <span className="border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
          </span>
          How to use
        </NavLink>
      </nav>

      {/* Upgrade card */}
      <div className="p-3">
        <UpgradeCard />
      </div>
    </aside>
  )
}
