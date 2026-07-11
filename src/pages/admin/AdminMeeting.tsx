import { useState } from 'react'
import { TrendingUp, ArrowUpRight, Video, Clock, Users, Zap, Calendar, Mic, Settings, CheckCircle2, XCircle } from 'lucide-react'

const MEETING_STATS = {
  totalSessions: 1847,
  thisMonth: 423,
  avgDuration: '28m',
  recordingsViewed: 3210,
  actionItemsCreated: 876,
  activeUsers: 312,
}

const RECENT_SESSIONS = [
  { id: '1', user: 'Darnell Smith', type: 'Interview Prep', duration: '32m', participants: 2, recordings: 1, actionItems: 5, time: '2 hr ago', status: 'completed' },
  { id: '2', user: 'Jessica Williams', type: 'Mock Interview', duration: '45m', participants: 3, recordings: 1, actionItems: 8, time: '3 hr ago', status: 'completed' },
  { id: '3', user: 'Omar Khan', type: 'Career Coaching', duration: '25m', participants: 2, recordings: 1, actionItems: 3, time: '5 hr ago', status: 'completed' },
  { id: '4', user: 'Sarah Johnson', type: 'Interview Prep', duration: '38m', participants: 2, recordings: 1, actionItems: 6, time: '6 hr ago', status: 'completed' },
  { id: '5', user: 'Carlos Rodriguez', type: 'Mock Interview', duration: '52m', participants: 4, recordings: 1, actionItems: 10, time: '1 day ago', status: 'completed' },
  { id: '6', user: 'Aisha Davis', type: 'Career Coaching', duration: '20m', participants: 2, recordings: 0, actionItems: 2, time: '1 day ago', status: 'completed' },
]

const MEETING_TYPES = [
  { type: 'Interview Prep', sessions: 823, pct: 45, color: '#3b82f6' },
  { type: 'Mock Interview', sessions: 554, pct: 30, color: '#8b5cf6' },
  { type: 'Career Coaching', sessions: 331, pct: 18, color: '#2dd4bf' },
  { type: 'Team Debrief', sessions: 139, pct: 7, color: '#f59e0b' },
]

const PREMIUM_FEATURES = [
  { name: 'HD Video Meetings', desc: 'Crystal-clear video for interviews and coaching', enabled: true },
  { name: 'AI Meeting Notes', desc: 'Automatic transcription and summary', enabled: true },
  { name: 'Action Item Tracking', desc: 'Track follow-ups from each meeting', enabled: true },
  { name: 'Meeting Recordings', desc: 'Record and replay past sessions', enabled: true },
  { name: 'Calendar Integration', desc: 'Sync with Google Calendar and Outlook', enabled: true },
  { name: 'Screen Sharing', desc: 'Share your screen during meetings', enabled: true },
  { name: 'Whiteboard', desc: 'Collaborative whiteboard for brainstorming', enabled: true },
  { name: 'Waiting Room', desc: 'Control who enters your meetings', enabled: true },
]

export default function AdminMeeting() {
  const [tab, setTab] = useState<'overview' | 'sessions' | 'settings'>('overview')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="lf-page-title">Meeting</h1>
        <p className="lf-body mt-0.5">Premium-only video meetings — interview prep, coaching, and mock interviews</p>
      </div>

      <div className="flex items-center gap-1.5">
        {(['overview', 'sessions', 'settings'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
            tab === t ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
          }`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {[
              { label: 'Total Sessions', value: MEETING_STATS.totalSessions.toLocaleString(), icon: Video, change: '+26.4%' },
              { label: 'This Month', value: MEETING_STATS.thisMonth.toLocaleString(), icon: TrendingUp, change: '+14.2%' },
              { label: 'Avg Duration', value: MEETING_STATS.avgDuration, icon: Clock, change: '+2m' },
              { label: 'Recordings Viewed', value: MEETING_STATS.recordingsViewed.toLocaleString(), icon: Zap, change: '+420' },
              { label: 'Action Items Created', value: MEETING_STATS.actionItemsCreated.toLocaleString(), icon: CheckCircle2, change: '+156' },
              { label: 'Active Users', value: MEETING_STATS.activeUsers.toLocaleString(), icon: Users, change: '+48' },
            ].map(({ label, value, icon: Icon, change }) => (
              <div key={label} className="lf-panel p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 mt-1">
                  <ArrowUpRight className="h-3 w-3" />{change}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">Meeting Types</p>
              <div className="space-y-3">
                {MEETING_TYPES.map(t => (
                  <div key={t.type}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{t.type}</span>
                      <span className="text-xs text-muted-foreground">{t.sessions} sessions · {t.pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.pct}%`, background: t.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">Recent Sessions</p>
              <div className="space-y-2">
                {RECENT_SESSIONS.slice(0, 5).map(s => (
                  <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Video className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.user}</p>
                      <p className="text-xs text-muted-foreground">{s.type} · {s.duration} · {s.participants} people</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-foreground">{s.actionItems} tasks</p>
                      <p className="text-[10px] text-muted-foreground">{s.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Feature Gate */}
          <div className="lf-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">Premium Only</span>
              <p className="lf-card-title">Meeting Features</p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PREMIUM_FEATURES.map(f => (
                <div key={f.name} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  {f.enabled ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> : <XCircle className="h-4 w-4 text-muted-foreground/30 mt-0.5 shrink-0" />}
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'sessions' && (
        <div className="lf-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <th className="lf-table-th">User</th>
                  <th className="lf-table-th">Type</th>
                  <th className="lf-table-th hidden md:table-cell">Duration</th>
                  <th className="lf-table-th hidden sm:table-cell">Participants</th>
                  <th className="lf-table-th">Action Items</th>
                  <th className="lf-table-th hidden sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_SESSIONS.map(s => (
                  <tr key={s.id} className="lf-table-row">
                    <td className="lf-table-cell font-medium text-foreground">{s.user}</td>
                    <td className="lf-table-cell">{s.type}</td>
                    <td className="lf-table-cell hidden md:table-cell tabular-nums">{s.duration}</td>
                    <td className="lf-table-cell hidden sm:table-cell tabular-nums">{s.participants}</td>
                    <td className="lf-table-cell tabular-nums font-semibold">{s.actionItems}</td>
                    <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{s.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="lf-panel p-6 max-w-2xl space-y-4">
          <p className="lf-card-title">Meeting Configuration</p>
          {[
            { label: 'Meeting Enabled', desc: 'Allow Premium users to access video meetings', checked: true },
            { label: 'AI Notes', desc: 'Auto-generate meeting notes and summaries', checked: true },
            { label: 'Recording Auto-Delete', desc: 'Delete recordings after 90 days', checked: false },
            { label: 'Max Participants', desc: 'Maximum participants per meeting', value: '10' },
            { label: 'Max Duration (min)', desc: 'Maximum meeting length', value: '60' },
            { label: 'Storage Limit (GB)', desc: 'Recording storage per user', value: '5' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              {'checked' in item ? (
                <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${item.checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              ) : (
                <input defaultValue={item.value} className="lf-input w-20 h-8 text-sm text-center" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
