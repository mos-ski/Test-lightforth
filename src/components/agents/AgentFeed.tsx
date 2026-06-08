import { useState, useEffect, useRef } from 'react'
import { Search, Filter as FilterIcon, Scissors, Send, Zap } from 'lucide-react'
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

const AGENT_ICON: Record<string, React.ElementType> = {
  scout:  Search,
  filter: FilterIcon,
  tailor: Scissors,
  driver: Send,
  system: Zap,
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
          const Icon = AGENT_ICON[event.agent] ?? Zap
          const isLast = i === filtered.length - 1
          const isTopLevel = event.agent === 'scout' || event.agent === 'system'

          return (
            <div key={event.id} className={cn('flex gap-3', !isTopLevel && 'ml-5')}>
              {/* Icon + vertical line */}
              <div className="flex flex-col items-center">
                <span className={cn(
                  'mt-0.5 flex shrink-0 items-center justify-center rounded-md border border-border bg-white',
                  isTopLevel ? 'h-6 w-6' : 'h-5 w-5',
                )}>
                  <Icon className={cn('text-muted-foreground', isTopLevel ? 'h-3.5 w-3.5' : 'h-3 w-3')} />
                </span>
                {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>

              {/* Content */}
              <div className={cn('pb-4 min-w-0', isLast && 'pb-1')}>
                <div className="flex items-center gap-2 mb-0.5">
                  {event.agent !== 'system' && (
                    <span className="text-xs font-semibold capitalize text-foreground">
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
