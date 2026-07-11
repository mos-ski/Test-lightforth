import { useState } from 'react'
import { TrendingUp, ArrowUpRight, Settings, Zap, Clock, CheckCircle2, XCircle, Plus, X } from 'lucide-react'
import { USERS, TRANSACTIONS } from '@/lib/adminMockData'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import { TimelineFilter, type TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'

const AUTO_APPLY_STATS = {
  totalApplications: 12847,
  thisMonth: 2341,
  successRate: 78.4,
  avgResponseTime: '2.3s',
  activeJobs: 156,
  platforms: 8,
}

const RECENT_APPLICATIONS = [
  { id: '1', user: 'Darnell Smith', company: 'JPMorgan Chase', role: 'Software Engineer', status: 'submitted', time: '12 min ago', atsScore: 92 },
  { id: '2', user: 'Jessica Williams', company: 'Goldman Sachs', role: 'Data Analyst', status: 'submitted', time: '28 min ago', atsScore: 87 },
  { id: '3', user: 'Omar Khan', company: 'Google', role: 'Product Manager', status: 'failed', time: '45 min ago', atsScore: 71 },
  { id: '4', user: 'Sarah Johnson', company: 'Microsoft', role: 'UX Designer', status: 'submitted', time: '1 hr ago', atsScore: 94 },
  { id: '5', user: 'Carlos Rodriguez', company: 'Amazon', role: 'Cloud Engineer', status: 'pending', time: '1 hr ago', atsScore: 83 },
  { id: '6', user: 'Aisha Davis', company: 'Meta', role: 'Backend Engineer', status: 'submitted', time: '2 hr ago', atsScore: 89 },
  { id: '7', user: 'James Brown', company: 'Apple', role: 'iOS Developer', status: 'failed', time: '2 hr ago', atsScore: 65 },
  { id: '8', user: 'Hannah Lee', company: 'Netflix', role: 'Data Scientist', status: 'submitted', time: '3 hr ago', atsScore: 91 },
]

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-600',
}

const JOB_BOARDS = [
  { name: 'LinkedIn', status: 'connected', apps: 4521, successRate: 82 },
  { name: 'Greenhouse', status: 'connected', apps: 3200, successRate: 85 },
  { name: 'Workday', status: 'connected', apps: 2100, successRate: 79 },
  { name: 'Lever', status: 'connected', apps: 1800, successRate: 76 },
  { name: 'Ashby', status: 'limited', apps: 650, successRate: 72 },
  { name: 'BambooHR', status: 'connected', apps: 576, successRate: 81 },
]

const BOARD_STATUS: Record<string, string> = {
  connected: 'bg-emerald-50 text-emerald-700',
  limited: 'bg-amber-50 text-amber-700',
  down: 'bg-red-50 text-red-600',
}

export default function AdminAutoApply() {
  const [tab, setTab] = useState<'overview' | 'jobs' | 'settings'>('overview')
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const [selectedRow, setSelectedRow] = useState<typeof RECENT_APPLICATIONS[number] | null>(null)
  const { sortKey, sortDirection, toggleSort, sorted } = useSort({ data: RECENT_APPLICATIONS })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="lf-page-title">Auto-Apply</h1>
          <p className="lf-body mt-0.5">Automated job application engine — monitor performance and configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="lf-btn gap-1.5">
            <Plus className="h-3.5 w-3.5" />New Application
          </button>
          <TimelineFilter value={period} onChange={setPeriod} />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {(['overview', 'jobs', 'settings'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
            tab === t ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
          }`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {[
              { label: 'Total Applications', value: AUTO_APPLY_STATS.totalApplications.toLocaleString(), icon: Zap, change: '+18.2%' },
              { label: 'This Month', value: AUTO_APPLY_STATS.thisMonth.toLocaleString(), icon: TrendingUp, change: '+12.5%' },
              { label: 'Success Rate', value: `${AUTO_APPLY_STATS.successRate}%`, icon: CheckCircle2, change: '+3.1%' },
              { label: 'Avg Response Time', value: AUTO_APPLY_STATS.avgResponseTime, icon: Clock, change: '-0.4s' },
              { label: 'Active Job Listings', value: String(AUTO_APPLY_STATS.activeJobs), icon: Zap, change: '+24' },
              { label: 'Connected Platforms', value: String(AUTO_APPLY_STATS.platforms), icon: Settings, change: '+1' },
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

          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Recent Applications</p>
            <div className="overflow-x-auto">
              <table className="lf-table">
                <thead className="lf-table-head">
                  <tr>
                    <SortableHeader label="User" sortKey="user" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                    <SortableHeader label="Company" sortKey="company" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                    <SortableHeader label="Role" sortKey="role" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden md:table-cell" />
                    <SortableHeader label="ATS Score" sortKey="atsScore" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                    <SortableHeader label="Status" sortKey="status" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                    <SortableHeader label="Time" sortKey="time" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell" />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(app => (
                    <tr key={app.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedRow(app)}>
                      <td className="lf-table-cell font-medium text-foreground">{app.user}</td>
                      <td className="lf-table-cell">{app.company}</td>
                      <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{app.role}</td>
                      <td className="lf-table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${app.atsScore >= 85 ? 'bg-emerald-500' : app.atsScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${app.atsScore}%` }} />
                          </div>
                          <span className="text-xs font-semibold tabular-nums">{app.atsScore}</span>
                        </div>
                      </td>
                      <td className="lf-table-cell">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                      </td>
                      <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{app.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'jobs' && (
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Connected Job Boards</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JOB_BOARDS.map(board => (
              <div key={board.name} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">{board.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${BOARD_STATUS[board.status]}`}>{board.status}</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Applications</span><span className="font-medium">{board.apps.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Success Rate</span><span className="font-medium">{board.successRate}%</span></div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-2">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${board.successRate}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="lf-panel p-6 max-w-2xl space-y-4">
          <p className="lf-card-title">Auto-Apply Configuration</p>
          {[
            { label: 'Auto-Apply Enabled', desc: 'Allow users to auto-apply to matching jobs', checked: true },
            { label: 'Stealth Mode', desc: 'Hide application踪迹 from employers', checked: true },
            { label: 'Smart Matching', desc: 'Use AI to match user profile to job requirements', checked: true },
            { label: 'Daily Application Limit', desc: 'Max applications per user per day', value: '50' },
            { label: 'Minimum ATS Score', desc: 'Only apply to jobs with ATS score above threshold', value: '70' },
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
      {selectedRow && (
        <AdminDetailModal
          title={`${selectedRow.company} Application`}
          subtitle={selectedRow.user}
          onClose={() => setSelectedRow(null)}
          fields={[
            { label: 'Role', value: selectedRow.role },
            { label: 'ATS Score', value: selectedRow.atsScore },
            { label: 'Status', value: selectedRow.status },
            { label: 'Time', value: selectedRow.time },
            { label: 'Recommended Action', value: selectedRow.status === 'failed' ? 'Review blocker and retry' : selectedRow.status === 'pending' ? 'Monitor submission' : 'No action needed' },
          ]}
        />
      )}
    </div>
  )
}
