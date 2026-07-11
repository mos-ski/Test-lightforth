import type { LucideIcon } from 'lucide-react'
import { TimelineFilter, type TimePeriod } from '@/components/shared/TimelineFilter'

interface AdminPageHeaderAction {
  label: string
  icon?: LucideIcon
  onClick?: () => void
  variant?: 'primary' | 'outline'
}

interface AdminPageHeaderProps {
  title: string
  subtitle?: string
  actions?: AdminPageHeaderAction[]
  period?: TimePeriod
  onPeriodChange?: (period: TimePeriod) => void
}

/** Standard title + subtitle + actions + timeline-filter row used across every admin page. */
export function AdminPageHeader({ title, subtitle, actions, period, onPeriodChange }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="lf-page-title">{title}</h1>
        {subtitle && <p className="lf-body mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {actions?.map(({ label, icon: Icon, onClick, variant = 'primary' }) => (
          <button key={label} onClick={onClick} className={variant === 'primary' ? 'lf-btn' : 'lf-btn-outline'}>
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {label}
          </button>
        ))}
        {period && onPeriodChange && <TimelineFilter value={period} onChange={onPeriodChange} />}
      </div>
    </div>
  )
}
