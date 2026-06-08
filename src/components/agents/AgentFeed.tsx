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

      {/* Feed rows — grows like a live chat, no fixed height */}
      <div>
        {filtered.map((event, i) => (
          <div
            key={event.id}
            className={cn(
              'grid gap-0 border-b border-border/40 px-4 py-3 text-sm last:border-b-0',
              'grid-cols-[52px_60px_1fr]',
              i % 2 === 1 && 'bg-[#fafbff]',
            )}
          >
            <span className="text-muted-foreground pt-0.5">{formatTime(event.timestamp)}</span>
            <span className="font-medium text-muted-foreground capitalize pt-0.5">
              {event.agent === 'system' ? '—' : event.agent}
            </span>
            <span className="text-foreground leading-relaxed">{event.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
