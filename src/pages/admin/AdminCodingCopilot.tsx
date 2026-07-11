import { useState } from 'react'
import { ArrowUpRight, Code2, Cpu, FileCode2, Plus, ShieldCheck, Terminal, Timer, Users } from 'lucide-react'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import type { TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const SESSIONS = [
  { id: 'c1', user: 'Darnell Smith', language: 'TypeScript', challenge: 'React state machine', duration: 38, captures: 12, accuracy: 94, status: 'completed', plan: 'Pro', time: '18 min ago' },
  { id: 'c2', user: 'Jessica Williams', language: 'Python', challenge: 'Data pipeline debugging', duration: 44, captures: 9, accuracy: 88, status: 'completed', plan: 'Pro', time: '42 min ago' },
  { id: 'c3', user: 'Omar Khan', language: 'SQL', challenge: 'Window functions', duration: 26, captures: 7, accuracy: 81, status: 'in review', plan: 'Premium', time: '1 hr ago' },
  { id: 'c4', user: 'Sarah Johnson', language: 'JavaScript', challenge: 'Algorithm walkthrough', duration: 31, captures: 10, accuracy: 91, status: 'completed', plan: 'Pro', time: '2 hr ago' },
  { id: 'c5', user: 'Carlos Rodriguez', language: 'Go', challenge: 'Concurrency bug', duration: 52, captures: 15, accuracy: 76, status: 'flagged', plan: 'Premium', time: '3 hr ago' },
]

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700',
  'in review': 'bg-amber-50 text-amber-700',
  flagged: 'bg-red-50 text-red-600',
}

export default function AdminCodingCopilot() {
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const [tab, setTab] = useState<'overview' | 'sessions' | 'settings'>('overview')
  const [selectedSession, setSelectedSession] = useState<typeof SESSIONS[number] | null>(null)
  const { sortKey, sortDirection, toggleSort, sorted } = useSort({ data: SESSIONS })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Coding Copilot"
        subtitle="Live coding support, screen capture sessions, answer quality, and review flags"
        actions={[{ label: 'Create Review', icon: Plus }]}
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="flex items-center gap-1.5">
        {(['overview', 'sessions', 'settings'] as const).map(item => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
              tab === item ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Coding Sessions', value: '2,184', icon: Code2, change: '+19.4%' },
              { label: 'Active Users', value: '468', icon: Users, change: '+72' },
              { label: 'Avg Accuracy', value: '86.2%', icon: Cpu, change: '+2.8%' },
              { label: 'Avg Duration', value: '39m', icon: Timer, change: '+5m' },
            ].map(({ label, value, icon: Icon, change }) => (
              <div key={label} className="lf-panel p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
                <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />{change}
                </span>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { label: 'Most Used Language', value: 'TypeScript', icon: FileCode2 },
              { label: 'Review Flags', value: '18', icon: ShieldCheck },
              { label: 'Screen Captures', value: '14,920', icon: Terminal },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="lf-panel p-5">
                <Icon className="mb-3 h-5 w-5 text-primary" />
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'sessions' && (
        <div className="lf-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <SortableHeader label="User" sortKey="user" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Language" sortKey="language" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Challenge" sortKey="challenge" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden md:table-cell" />
                  <SortableHeader label="Duration" sortKey="duration" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Accuracy" sortKey="accuracy" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Status" sortKey="status" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Time" sortKey="time" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell" />
                </tr>
              </thead>
              <tbody>
                {sorted.map(session => (
                  <tr key={session.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedSession(session)}>
                    <td className="lf-table-cell font-medium text-foreground">{session.user}</td>
                    <td className="lf-table-cell">{session.language}</td>
                    <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{session.challenge}</td>
                    <td className="lf-table-cell tabular-nums">{session.duration}m</td>
                    <td className="lf-table-cell font-semibold tabular-nums">{session.accuracy}%</td>
                    <td className="lf-table-cell"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[session.status]}`}>{session.status}</span></td>
                    <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{session.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="lf-panel max-w-2xl space-y-4 p-6">
          <p className="lf-card-title">Coding Copilot Configuration</p>
          {[
            { label: 'Coding Copilot Enabled', desc: 'Allow Pro and Premium users to start coding sessions', checked: true },
            { label: 'Auto Screen Capture', desc: 'Capture visible challenge changes automatically', checked: true },
            { label: 'Manual Capture Shortcut', desc: 'Allow users to force a capture during sessions', checked: true },
            { label: 'Review Flagging', desc: 'Flag low-confidence answer sessions for product review', checked: true },
            { label: 'Max Session Duration (min)', desc: 'Maximum live coding session duration', value: '90' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between border-b border-border py-3 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
              </div>
              {'checked' in item ? (
                <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${item.checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              ) : (
                <input defaultValue={item.value} className="lf-input h-8 w-20 text-center text-sm" />
              )}
            </div>
          ))}
        </div>
      )}

      {selectedSession && (
        <AdminDetailModal
          title={`${selectedSession.user} Coding Session`}
          subtitle={selectedSession.challenge}
          onClose={() => setSelectedSession(null)}
          fields={[
            { label: 'Language', value: selectedSession.language },
            { label: 'Plan', value: selectedSession.plan },
            { label: 'Duration', value: `${selectedSession.duration}m` },
            { label: 'Screen Captures', value: selectedSession.captures },
            { label: 'Accuracy', value: `${selectedSession.accuracy}%` },
            { label: 'Status', value: selectedSession.status },
            { label: 'Time', value: selectedSession.time },
            { label: 'Recommended Action', value: selectedSession.status === 'flagged' ? 'Review transcript and answer quality' : 'No immediate action needed' },
          ]}
        />
      )}
    </div>
  )
}
