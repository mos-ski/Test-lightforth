import { useState } from 'react'
import { TrendingUp, ArrowUpRight, FileText, Users, Target, BarChart3, Clock, Zap, CheckCircle2, XCircle, MessageSquare, Download, Settings } from 'lucide-react'

const RESUME_STATS = {
  totalBuilds: 8934,
  thisMonth: 1847,
  avgAtsScore: 78.4,
  acceptanceRate: 62.3,
  rejectionRate: 37.7,
  aiChats: 12450,
  templatesCreated: 342,
  exportsDownloaded: 6210,
}

const RECENT_BUILDS = [
  { id: '1', user: 'Darnell Smith', atsScore: 92, status: 'accepted', pages: 2, template: 'Modern', time: '12 min ago', aiMessages: 8 },
  { id: '2', user: 'Jessica Williams', atsScore: 84, status: 'accepted', pages: 1, template: 'Professional', time: '28 min ago', aiMessages: 12 },
  { id: '3', user: 'Omar Khan', atsScore: 68, status: 'rejected', pages: 3, template: 'Creative', time: '45 min ago', aiMessages: 5 },
  { id: '4', user: 'Sarah Johnson', atsScore: 95, status: 'accepted', pages: 2, template: 'Executive', time: '1 hr ago', aiMessages: 15 },
  { id: '5', user: 'Carlos Rodriguez', atsScore: 71, status: 'pending', pages: 1, template: 'Modern', time: '2 hr ago', aiMessages: 7 },
  { id: '6', user: 'Aisha Davis', atsScore: 88, status: 'accepted', pages: 2, template: 'Professional', time: '3 hr ago', aiMessages: 10 },
  { id: '7', user: 'James Brown', atsScore: 55, status: 'rejected', pages: 1, template: 'Basic', time: '3 hr ago', aiMessages: 3 },
  { id: '8', user: 'Hannah Lee', atsScore: 91, status: 'accepted', pages: 2, template: 'Executive', time: '4 hr ago', aiMessages: 14 },
]

const ATS_SCORE_DIST = [
  { range: '90-100', label: 'Excellent', count: 1823, pct: 28, color: '#22c55e' },
  { range: '75-89', label: 'Good', count: 2890, pct: 44, color: '#3b82f6' },
  { range: '60-74', label: 'Fair', count: 1340, pct: 20, color: '#f59e0b' },
  { range: '40-59', label: 'Poor', count: 390, pct: 6, color: '#ef4444' },
  { range: '<40', label: 'Critical', count: 120, pct: 2, color: '#dc2626' },
]

const TOP_ISSUES = [
  { issue: 'Missing keywords from job description', frequency: 3420, pct: 34 },
  { issue: 'Poor formatting for ATS parsing', frequency: 2310, pct: 23 },
  { issue: 'Weak action verbs', frequency: 1890, pct: 19 },
  { issue: 'Missing quantified achievements', frequency: 1240, pct: 12 },
  { issue: 'Inconsistent date formatting', frequency: 890, pct: 9 },
  { issue: 'Too many pages', frequency: 340, pct: 3 },
]

const TEMPLATES = [
  { id: 't1', name: 'Modern', uses: 3421, atsAvg: 82, color: '#3b82f6', active: true },
  { id: 't2', name: 'Professional', uses: 2890, atsAvg: 85, color: '#8b5cf6', active: true },
  { id: 't3', name: 'Executive', uses: 1567, atsAvg: 88, color: '#2dd4bf', active: true },
  { id: 't4', name: 'Creative', uses: 892, atsAvg: 71, color: '#f59e0b', active: true },
  { id: 't5', name: 'Basic', uses: 1234, atsAvg: 76, color: '#94a3b8', active: true },
  { id: 't6', name: 'ATS-Optimized', uses: 2100, atsAvg: 91, color: '#22c55e', active: true },
]

const STATUS_COLORS: Record<string, string> = {
  accepted: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-600',
  pending: 'bg-amber-50 text-amber-700',
}

export default function AdminResumeBuilder() {
  const [tab, setTab] = useState<'overview' | 'builds' | 'templates' | 'settings'>('overview')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="lf-page-title">Resume Builder</h1>
        <p className="lf-body mt-0.5">AI-powered resume building — chat, ATS scoring, templates, and acceptance tracking</p>
      </div>

      <div className="flex items-center gap-1.5">
        {(['overview', 'builds', 'templates', 'settings'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
            tab === t ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
          }`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Total Builds', value: RESUME_STATS.totalBuilds.toLocaleString(), icon: FileText, change: '+22.4%' },
              { label: 'This Month', value: RESUME_STATS.thisMonth.toLocaleString(), icon: TrendingUp, change: '+18.7%' },
              { label: 'Avg ATS Score', value: `${RESUME_STATS.avgAtsScore}%`, icon: Target, change: '+3.2%' },
              { label: 'Acceptance Rate', value: `${RESUME_STATS.acceptanceRate}%`, icon: CheckCircle2, change: '+5.1%' },
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

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'AI Chats', value: RESUME_STATS.aiChats.toLocaleString(), icon: MessageSquare },
              { label: 'Templates Used', value: RESUME_STATS.templatesCreated.toLocaleString(), icon: FileText },
              { label: 'Exports Downloaded', value: RESUME_STATS.exportsDownloaded.toLocaleString(), icon: Download },
              { label: 'Rejection Rate', value: `${RESUME_STATS.rejectionRate}%`, icon: XCircle },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="lf-panel p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="text-xl font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* ATS Score Distribution */}
            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">ATS Score Distribution</p>
              <div className="space-y-2.5">
                {ATS_SCORE_DIST.map(d => (
                  <div key={d.range} className="flex items-center gap-3">
                    <div className="w-20 shrink-0">
                      <span className="text-sm text-foreground">{d.range}</span>
                      <p className="text-[10px] text-muted-foreground">{d.label}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-6 rounded bg-muted overflow-hidden">
                        <div className="h-full rounded transition-all duration-700 flex items-center px-2" style={{ width: `${d.pct}%`, background: d.color }}>
                          {d.pct > 8 && <span className="text-[10px] font-semibold text-white">{d.count.toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-foreground w-8 text-right tabular-nums">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acceptance vs Rejection */}
            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">Acceptance vs Rejection</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="h-8 rounded-full bg-muted overflow-hidden flex">
                    <div className="h-full bg-emerald-500 transition-all duration-700 flex items-center justify-center" style={{ width: `${RESUME_STATS.acceptanceRate}%` }}>
                      <span className="text-[10px] font-bold text-white">{RESUME_STATS.acceptanceRate}%</span>
                    </div>
                    <div className="h-full bg-red-500 transition-all duration-700 flex items-center justify-center" style={{ width: `${RESUME_STATS.rejectionRate}%` }}>
                      <span className="text-[10px] font-bold text-white">{RESUME_STATS.rejectionRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><span className="text-xs text-muted-foreground">Accepted</span></div>
                <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-red-500" /><span className="text-xs text-muted-foreground">Rejected</span></div>
              </div>

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Top ATS Issues</p>
              <div className="space-y-2">
                {TOP_ISSUES.slice(0, 4).map(t => (
                  <div key={t.issue} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${t.pct}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{t.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1 mt-2">
                {TOP_ISSUES.slice(0, 4).map(t => (
                  <p key={t.issue} className="text-[10px] text-muted-foreground">{t.issue}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Builds */}
          <div className="lf-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="lf-card-title">Recent Resume Builds</p>
            </div>
            <div className="overflow-x-auto">
              <table className="lf-table">
                <thead className="lf-table-head">
                  <tr>
                    <th className="lf-table-th">User</th>
                    <th className="lf-table-th">ATS Score</th>
                    <th className="lf-table-th hidden sm:table-cell">Template</th>
                    <th className="lf-table-th hidden md:table-cell">AI Chats</th>
                    <th className="lf-table-th">Status</th>
                    <th className="lf-table-th hidden sm:table-cell">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_BUILDS.map(b => (
                    <tr key={b.id} className="lf-table-row">
                      <td className="lf-table-cell font-medium text-foreground">{b.user}</td>
                      <td className="lf-table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${b.atsScore >= 85 ? 'bg-emerald-500' : b.atsScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${b.atsScore}%` }} />
                          </div>
                          <span className="text-xs font-semibold tabular-nums">{b.atsScore}</span>
                        </div>
                      </td>
                      <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{b.template}</td>
                      <td className="lf-table-cell hidden md:table-cell tabular-nums">{b.aiMessages}</td>
                      <td className="lf-table-cell">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                      </td>
                      <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{b.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'builds' && (
        <div className="lf-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <th className="lf-table-th">User</th>
                  <th className="lf-table-th">ATS Score</th>
                  <th className="lf-table-th hidden sm:table-cell">Pages</th>
                  <th className="lf-table-th hidden md:table-cell">Template</th>
                  <th className="lf-table-th hidden md:table-cell">AI Chats</th>
                  <th className="lf-table-th">Status</th>
                  <th className="lf-table-th hidden sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_BUILDS.map(b => (
                  <tr key={b.id} className="lf-table-row">
                    <td className="lf-table-cell font-medium text-foreground">{b.user}</td>
                    <td className="lf-table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${b.atsScore >= 85 ? 'bg-emerald-500' : b.atsScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${b.atsScore}%` }} />
                        </div>
                        <span className="text-xs font-semibold tabular-nums">{b.atsScore}</span>
                      </div>
                    </td>
                    <td className="lf-table-cell hidden sm:table-cell tabular-nums">{b.pages}</td>
                    <td className="lf-table-cell hidden md:table-cell text-xs text-muted-foreground">{b.template}</td>
                    <td className="lf-table-cell hidden md:table-cell tabular-nums">{b.aiMessages}</td>
                    <td className="lf-table-cell">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{b.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'templates' && (
        <div className="lf-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <p className="lf-card-title">Resume Templates</p>
          </div>
          <div className="p-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map(t => (
              <div key={t.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ background: t.color }} />
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  </div>
                  <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${t.active ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}>
                    <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${t.active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Uses</span><span className="font-medium">{t.uses.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Avg ATS Score</span><span className="font-medium">{t.atsAvg}%</span></div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-2">
                    <div className="h-full rounded-full" style={{ width: `${t.atsAvg}%`, background: t.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="lf-panel p-6 max-w-2xl space-y-4">
          <p className="lf-card-title">Resume Builder Configuration</p>
          {[
            { label: 'Resume Builder Enabled', desc: 'Allow users to build resumes with AI', checked: true },
            { label: 'AI Chat Assistant', desc: 'Enable conversational AI for resume building', checked: true },
            { label: 'ATS Score Feedback', desc: 'Show ATS score and improvement suggestions', checked: true },
            { label: 'Acceptance Tracking', desc: 'Track application acceptance vs rejection', checked: true },
            { label: 'Template Marketplace', desc: 'Allow users to create and share templates', checked: false },
            { label: 'Max AI Messages', desc: 'Maximum AI messages per resume build session', value: '20' },
            { label: 'Max Pages', desc: 'Maximum resume pages allowed', value: '3' },
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
