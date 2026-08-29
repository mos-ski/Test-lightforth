import type { RunLogEntry } from '../types'

interface RunLogFeedProps {
  entries: RunLogEntry[]
  finished?: boolean
}

export function RunLogFeed({ entries, finished }: RunLogFeedProps) {
  return (
    <div className="px-5 pb-6">
      {finished && (
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-ink/40" />
          <span className="text-xs font-semibold text-ink">Run finished</span>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-start gap-2.5">
            <LogIcon level={entry.level} />
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs leading-snug ${
                  entry.level === 'error' ? 'text-[#B42318]' : 'text-ink'
                }`}
              >
                {entry.title ? <span className="font-semibold">{entry.title}: </span> : null}
                {entry.message}
              </p>
              <p className="mt-0.5 text-[11px] text-ext-muted">{entry.timeLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LogIcon({ level }: { level: RunLogEntry['level'] }) {
  if (level === 'warning' || level === 'error') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0">
        <path
          d="M8 1.5L15 14H1L8 1.5Z"
          stroke="#F59E0B"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M8 6.5V9.5" stroke="#F59E0B" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.75" fill="#F59E0B" />
      </svg>
    )
  }
  return (
    <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full border-[1.3px] border-ext-muted" />
  )
}
