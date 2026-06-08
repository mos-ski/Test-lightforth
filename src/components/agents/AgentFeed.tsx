import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { FeedEvent, AgentName } from '@/hooks/useAgentSession'

export interface Props {
  events: FeedEvent[]
}

type TabValue = 'all' | Exclude<AgentName, 'system'>

const TABS: { value: TabValue; label: string }[] = [
  { value: 'all',    label: 'All' },
  { value: 'scout',  label: 'Scout' },
  { value: 'filter', label: 'Filter' },
  { value: 'tailor', label: 'Tailor' },
  { value: 'driver', label: 'Driver' },
]

const AGENT_COLORS: Record<string, { text: string; dot: string }> = {
  scout:  { text: 'text-blue-600',   dot: 'bg-blue-400' },
  filter: { text: 'text-violet-600', dot: 'bg-violet-400' },
  tailor: { text: 'text-amber-600',  dot: 'bg-amber-400' },
  driver: { text: 'text-green-600',  dot: 'bg-green-400' },
  system: { text: 'text-slate-400',  dot: 'bg-slate-300' },
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function AgentFeed({ events }: Props) {
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const bottomRef = useRef<HTMLDivElement>(null)

  const filtered = activeTab === 'all'
    ? events
    : events.filter(e => e.agent === activeTab)

  useEffect(() => {
    if (bottomRef.current && typeof bottomRef.current.scrollIntoView === 'function') {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [events.length])

  return (
    <div className="lf-panel overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-border px-4">
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab.value}
              aria-label={tab.label}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'lf-tab px-4 py-2.5',
                activeTab === tab.value && 'lf-tab-active',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
          Live
        </div>
      </div>

      {/* Timeline feed */}
      <div className="max-h-[480px] overflow-y-auto px-4 py-3">
        {filtered.map((event, i) => {
          const colors = AGENT_COLORS[event.agent] ?? AGENT_COLORS.system
          const isLast = i === filtered.length - 1
          const isTopLevel = event.agent === 'scout' || event.agent === 'system'

          return (
            <div key={event.id} className={cn('flex gap-3', !isTopLevel && 'ml-5')}>
              {/* Dot + vertical line */}
              <div className="flex flex-col items-center">
                <span className={cn(
                  'mt-1 shrink-0 rounded-full',
                  isTopLevel ? 'h-2 w-2' : 'h-1.5 w-1.5',
                  colors.dot,
                )} />
                {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>

              {/* Content */}
              <div className={cn('pb-4 min-w-0', isLast && 'pb-1')}>
                <div className="flex items-center gap-2 mb-0.5">
                  {event.agent !== 'system' && (
                    <span className={cn('text-xs font-semibold capitalize', colors.text)}>
                      {event.agent}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{event.message}</p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
