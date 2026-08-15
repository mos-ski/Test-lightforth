import type { HTMLAttributes } from 'react'

import { cn } from './cn'

export type BadgeProps = HTMLAttributes<HTMLSpanElement>

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn('inline-flex items-center rounded-full border border-focus bg-surface px-2.5 py-0.5 text-sm font-medium text-accent-text', className)}
      {...props}
    />
  )
}
