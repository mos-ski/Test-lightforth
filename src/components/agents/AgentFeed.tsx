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

const AGENT_BADGE: Record<string, string> = {
  scout:  'bg-blue-50 text-blue-700',
  filter: 'bg-violet-50 text-violet-700',
  tailor: 'bg-amber-50 text-amber-700',
  driver: 'bg-green-50 text-green-700',
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

      {/* Feed rows */}
      <div className="max-h-[480px] overflow-y-auto">
        {filtered.map((event, i) => (
          <div
            key={event.id}
            className={cn(
              'flex items-start gap-3 border-b border-border/40 px-4 py-3 text-sm last:border-b-0',
              i % 2 === 1 && 'bg-[#fafbff]',
            )}
          >
            <span className="shrink-0 text-xs text-muted-foreground pt-0.5 w-[46px]">
              {formatTime(event.timestamp)}
            </span>
            {event.agent === 'system' ? (
              <span className="shrink-0 text-xs text-muted-foreground pt-0.5 w-[52px]">—</span>
            ) : (
              <span className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                AGENT_BADGE[event.agent] ?? 'bg-slate-100 text-slate-500',
              )}>
                {event.agent}
              </span>
            )}
            <span className="text-foreground leading-relaxed">{event.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
