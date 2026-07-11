import { cn } from '@/lib/utils'

export type TimePeriod = '7d' | '30d' | '90d' | '12m' | 'all'

const PERIODS: { key: TimePeriod; label: string }[] = [
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: '90d', label: '90d' },
  { key: '12m', label: '12m' },
  { key: 'all', label: 'All time' },
]

const PERIOD_DESCRIPTIONS: Record<TimePeriod, string> = {
  '7d': 'last 7 days',
  '30d': 'last 30 days',
  '90d': 'last 90 days',
  '12m': 'last 12 months',
  all: 'all time',
}

interface TimelineFilterProps {
  value: TimePeriod
  onChange: (period: TimePeriod) => void
  className?: string
}

export function TimelineFilter({ value, onChange, className }: TimelineFilterProps) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <div className="flex items-center gap-1">
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => onChange(p.key)}
            className={cn(
              'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
              value === p.key
                ? 'bg-foreground text-white'
                : 'border border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        Showing data for <span className="font-semibold text-foreground">{PERIOD_DESCRIPTIONS[value]}</span>
      </span>
    </div>
  )
}
