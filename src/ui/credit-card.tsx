import { Gift, Wallet } from 'lucide-react'

import { cn, Tooltip, TooltipContent, TooltipTrigger } from '@/ui'

export type CreditCardProps = {
  readonly remaining: number
  readonly total: number
  readonly resetDate: string
  readonly bonusHref: string
  readonly detailsHref: string
  readonly className?: string
}

export function CreditCard({ remaining, total, resetDate, bonusHref, detailsHref, className }: CreditCardProps) {
  const percentage = total > 0 ? Math.round((remaining / total) * 100) : 0

  return (
    <section className={cn('rounded-panel border border-border bg-surface p-6 shadow-control', className)}>
      <div className="flex items-start justify-between">
        <h2 className="font-bold">Credits</h2>
        <Tooltip>
          <TooltipTrigger
            render={
              <a href={detailsHref} className="text-sm font-semibold text-accent underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus hover:underline">
                View usage details
              </a>
            }
          />
          <TooltipContent>See a breakdown of how your credits were used</TooltipContent>
        </Tooltip>
      </div>
      <p className="text-sm text-ink-muted">Resets on {resetDate}</p>

      <p className="mt-5 text-3xl font-black">
        {remaining} <span className="text-base font-medium text-ink-muted">of {total} Left</span>
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-pill bg-surface-subtle">
        <div className={cn('h-full rounded-pill transition-all', percentage > 20 ? 'bg-accent' : 'bg-danger')} style={{ inlineSize: `${percentage}%` }} />
      </div>

      <a href={bonusHref} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <Gift aria-hidden="true" className="size-4" />
        Get Free Credits
      </a>
    </section>
  )
}
