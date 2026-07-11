import { useState } from 'react'
import { TrendingUp, ArrowUpRight, Video, Mic, MessageSquare, Clock, Users, Zap } from 'lucide-react'

const COPILOT_STATS = {
  totalSessions: 3421,
  thisMonth: 687,
  avgDuration: '34m',
  questionsAnswered: 18943,
  realtimeAccuracy: 94.2,
  activeUsers: 892,
}

const RECENT_SESSIONS = [
  { id: '1', user: 'Darnell Smith', type: 'Technical', duration: '42m', questions: 28, accuracy: 96, time: '2 hr ago', company: 'JPMorgan Chase' },
  { id: '2', user: 'Jessica Williams', type: 'Behavioral', duration: '35m', questions: 22, accuracy: 91, time: '3 hr ago', company: 'Goldman Sachs' },
  { id: '3', user: 'Omar Khan', type: 'Case Study', duration: '51m', questions: 35, accuracy: 88, time: '4 hr ago', company: 'McKinsey' },
  { id: '4', user: 'Sarah Johnson', type: 'Technical', duration: '38m', questions: 24, accuracy: 97, time: '5 hr ago', company: 'Google' },
  { id: '5', user: 'Carlos Rodriguez', type: 'Behavioral', duration: '29m', questions: 18, accuracy: 93, time: '6 hr ago', company: 'Amazon' },
  { id: '6', user: 'Aisha Davis', type: 'Technical', duration: '45m', questions: 31, accuracy: 89, time: '7 hr ago', company: 'Meta' },
]

const INTERVIEW_TYPES = [
  { type: 'Technical', sessions: 1456, pct: 43, color: '#3b82f6' },
  { type: 'Behavioral', sessions: 1120, pct: 33, color: '#8b5cf6' },
  { type: 'Case Study', sessions: 548, pct: 16, color: '#2dd4bf' },
  { type: 'System Design', sessions: 297, pct: 8, color: '#f59e0b' },
]

export default function AdminInterviewCopilot() {
  const [tab, setTab] = useState<'overview' | 'sessions' | 'settings'>('overview')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="lf-page-title">Interview Copilot</h1>
        <p className="lf-body mt-0.5">Real-time interview assistance — monitor usage and performance</p>
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
              { label: 'Total Sessions', value: COPILOT_STATS.totalSessions.toLocaleString(), icon: Video, change: '+22.4%' },
              { label: 'This Month', value: COPILOT_STATS.thisMonth.toLocaleString(), icon: TrendingUp, change: '+15.8%' },
              { label: 'Avg Duration', value: COPILOT_STATS.avgDuration, icon: Clock, change: '+3m' },
              { label: 'Questions Answered', value: COPILOT_STATS.questionsAnswered.toLocaleString(), icon: MessageSquare, change: '+1,247' },
              { label: 'Realtime Accuracy', value: `${COPILOT_STATS.realtimeAccuracy}%`, icon: Zap, change: '+1.8%' },
              { label: 'Active Users', value: COPILOT_STATS.activeUsers.toLocaleString(), icon: Users, change: '+89' },
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
              <p className="lf-card-title mb-4">Interview Types</p>
              <div className="space-y-3">
                {INTERVIEW_TYPES.map(t => (
                  <div key={t.type}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{t.type}</span>
                      <span className="text-xs text-muted-foreground">{t.sessions.toLocaleString()} sessions · {t.pct}%</span>
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
                      <Mic className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.user}</p>
                      <p className="text-xs text-muted-foreground">{s.type} · {s.company} · {s.duration}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground">{s.accuracy}%</p>
                      <p className="text-[10px] text-muted-foreground">{s.questions} Q&A</p>
                    </div>
                  </div>
                ))}
              </div>
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
                  <th className="lf-table-th hidden md:table-cell">Company</th>
                  <th className="lf-table-th">Duration</th>
                  <th className="lf-table-th">Questions</th>
                  <th className="lf-table-th">Accuracy</th>
                  <th className="lf-table-th hidden sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_SESSIONS.map(s => (
                  <tr key={s.id} className="lf-table-row">
                    <td className="lf-table-cell font-medium text-foreground">{s.user}</td>
                    <td className="lf-table-cell">{s.type}</td>
                    <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{s.company}</td>
                    <td className="lf-table-cell tabular-nums">{s.duration}</td>
                    <td className="lf-table-cell tabular-nums">{s.questions}</td>
                    <td className="lf-table-cell">
                      <span className={`font-semibold ${s.accuracy >= 95 ? 'text-emerald-600' : s.accuracy >= 85 ? 'text-foreground' : 'text-amber-600'}`}>{s.accuracy}%</span>
                    </td>
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
          <p className="lf-card-title">Copilot Configuration</p>
          {[
            { label: 'Copilot Enabled', desc: 'Allow users to use the Interview Copilot', checked: true },
            { label: 'Stealth Mode', desc: 'Hide AI assistance from interviewers', checked: true },
            { label: 'Real-time Hints', desc: 'Provide hints during live interviews', checked: true },
            { label: 'Post-Interview Analysis', desc: 'Generate feedback after each session', checked: true },
            { label: 'Max Session Duration', desc: 'Maximum length of a copilot session', value: '60' },
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
