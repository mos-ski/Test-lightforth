import type { HTMLAttributes } from 'react'

import { cn } from './cn'

export type DividerProps = HTMLAttributes<HTMLDivElement>

export function Divider({ className, ...props }: DividerProps) {
  return <div data-slot="divider" className={cn('h-px flex-1 bg-border', className)} {...props} />
}
