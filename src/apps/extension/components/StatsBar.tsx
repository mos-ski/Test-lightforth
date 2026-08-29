interface StatsBarProps {
  submitted: number
  failed: number
  skipped: number
}

export function StatsBar({ submitted, failed, skipped }: StatsBarProps) {
  const total = submitted + failed + skipped
  const pct = (value: number) => (total > 0 ? (value / total) * 100 : 0)
  const successRate = total > 0 ? Math.round((submitted / total) * 100) : 0

  return (
    <div className="px-5 pt-4 pb-3">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-ext-row">
        <div className="h-full bg-[#22C55E]" style={{ width: `${pct(submitted)}%` }} />
        <div className="h-full bg-[#EF4444]" style={{ width: `${pct(failed)}%` }} />
        <div className="h-full bg-ext-muted/40" style={{ width: `${pct(skipped)}%` }} />
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5 font-medium text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
          {submitted} Submitted
        </span>
        <span className="flex items-center gap-1.5 font-medium text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
          {failed} Failed
        </span>
        <span className="flex items-center gap-1.5 font-medium text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-ext-muted/40" />
          {skipped} Skipped
        </span>
      </div>
      <p className="mt-1.5 text-xs text-ext-muted">{successRate}% of attempts went through.</p>
    </div>
  )
}
