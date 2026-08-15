import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from './cn'

export type ProgressBarProps = HTMLAttributes<HTMLDivElement> & {
  readonly value: number
  readonly max?: number
  readonly label?: string
  readonly showValue?: boolean
  readonly color?: 'accent' | 'positive' | 'warning' | 'danger'
}

const colorClasses: Record<string, string> = {
  accent: 'bg-accent',
  positive: 'bg-positive',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar({ value, max = 100, label, showValue = false, color = 'accent', className, ...props }, ref) {
    const percent = Math.min(100, Math.max(0, (value / max) * 100))

    return (
      <div ref={ref} data-slot="progress-bar" className="grid gap-1" {...props}>
        {(label || showValue) && (
          <div className="flex items-center justify-between text-sm">
            {label ? <span className="font-medium text-ink">{label}</span> : null}
            {showValue ? <span className="text-ink-muted">{Math.round(percent)}%</span> : null}
          </div>
        )}
        <div className="h-2 overflow-hidden rounded-pill bg-surface-subtle">
          <div
            className={cn('h-full rounded-pill transition-all duration-normal ease-default', colorClasses[color])}
            style={{ inlineSize: `${percent}%` }}
          />
        </div>
      </div>
    )
  },
)
