import { useState, useMemo } from 'react'
import {
  Search, Briefcase, ArrowUpRight, ArrowDown, AlertTriangle,
  X, FileText, Check, Clock3, Link as LinkIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CAREER_JOBS } from '@/data/mockCareerJobs'
import type { MockApplication } from '@/data/mockApplications'
import type { MockStudent } from '@/data/mockStudents'

// ─── Types ────────────────────────────────────────────────────────────────────

type InnerTab = 'jobs' | 'applied'

type IssueStatus = 'needs_review' | 'retrying' | 'resolved'
interface AgentIssue {
  id: string
  title: string
  company: string
  reason: string
  fallback: string
  status: IssueStatus
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function matchPercent(studentId: string, jobId: string) {
  return ((parseInt(studentId) * 7 + parseInt(jobId) * 13) % 30) + 65
}

function inferCompanyFromUrl(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    const name = host.split('.')[0]?.replace(/[-_]/g, ' ') ?? 'Company'
    return name.replace(/\b\w/g, l => l.toUpperCase())
  } catch {
    return 'Company'
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      {children}
    </div>
  )
}

function StatsRow({
  applications,
  onSeeIssues,
}: {
  applications: MockApplication[]
  onSeeIssues: () => void
}) {
  const applied   = applications.length
  const errors    = applications.filter(a => a.status === 'failed' || a.status === 'needs_review').length
  const completed = applications.filter(a => a.status === 'completed').length
  const successPct = applied ? Math.round((completed / applied) * 100) : 0

  return (
    <div className="grid grid-cols-5 gap-3">
      <StatCard label="Applied">
        <p className="text-2xl font-bold text-gray-900">{applied}</p>
        <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5">
          <ArrowUpRight className="h-3 w-3" /> {successPct}% Success Rate
        </p>
      </StatCard>

      <StatCard label="Jobs Found">
        <p className="text-2xl font-bold text-gray-900">319</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${(319 / 500) * 100}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-0.5">319 / 500</p>
      </StatCard>

      <StatCard label="Resume Created">
        <p className="text-2xl font-bold text-gray-900">43</p>
      </StatCard>

      <StatCard label="Errors">
        <div className="flex items-center gap-1.5 mt-0.5">
          <AlertTriangle className={cn('h-4 w-4 shrink-0', errors > 0 ? 'text-amber-400' : 'text-green-500')} />
          <span className={cn('text-2xl font-bold', errors > 0 ? 'text-red-500' : 'text-green-600')}>{errors}</span>
        </div>
        <button onClick={onSeeIssues} className="text-xs text-blue-600 hover:underline mt-0.5">
          {errors > 0 ? 'See issues' : 'View history'}
        </button>
      </StatCard>

      <StatCard label="Credits">
        <p className="text-2xl font-bold text-gray-900">93/100</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full rounded-full bg-green-500" style={{ width: '93%' }} />
        </div>
        <p className="text-xs text-gray-500 mt-0.5">93 remaining</p>
      </StatCard>
    </div>
  )
}

// ─── Issues Panel ─────────────────────────────────────────────────────────────

function IssuesPanel({
  issues,
  onClose,
  onRetry,
}: {
  issues: AgentIssue[]
  onClose: () => void
  onRetry: (issue: AgentIssue) => void
}) {
  return (
    <section className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Auto-apply issues
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">These applications need attention before the agent can finish them.</p>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-gray-400 hover:bg-white hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {issues.map(issue => (
          <article key={issue.id} className={cn('rounded-lg border bg-white p-4', issue.status === 'resolved' ? 'border-green-200' : 'border-amber-200')}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{issue.title}</h3>
                <p className="text-xs text-gray-500">{issue.company}</p>
              </div>
              <span className={cn(
                'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                issue.status === 'resolved' ? 'bg-green-100 text-green-700'
                : issue.status === 'retrying' ? 'bg-blue-100 text-blue-700'
                : 'bg-amber-100 text-amber-700'
              )}>
                {issue.status === 'resolved' ? 'Resolved' : issue.status === 'retrying' ? 'Retrying' : 'Needs review'}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{issue.reason}</p>
            <p className="mt-1 text-xs text-gray-400">{issue.fallback}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onRetry(issue)}
                disabled={issue.status !== 'needs_review'}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {issue.status === 'retrying' ? 'Retrying…' : issue.status === 'resolved' ? 'Retried' : 'Retry'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// ─── Manual Apply Card ────────────────────────────────────────────────────────

function ManualApplyCard({ onAdd }: { onAdd: (url: string) => void }) {
  const [url, setUrl] = useState('')
  const submit = () => { if (url.trim()) { onAdd(url.trim()); setUrl('') } }
  return (
    <section className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <LinkIcon className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Manual auto-apply</h2>
            <p className="text-xs text-gray-500">Paste a job link — the agent will fill and submit the application.</p>
          </div>
        </div>
        <div className="flex flex-1 gap-2 lg:max-w-xl">
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Paste job link…"
            className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <button onClick={submit} className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Add job
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Job Detail Side Panel ────────────────────────────────────────────────────

function JobDetailPanel({
  jobId,
  mode,
  onClose,
}: {
  jobId: string
  mode: 'queue' | 'applied'
  onClose: () => void
}) {
  const job = CAREER_JOBS.find(j => j.id === jobId)
  if (!job) return null

  return (
    <div className="w-72 shrink-0 rounded-xl border border-gray-200 bg-white overflow-y-auto">
      <div className="flex items-start justify-between border-b border-gray-200 p-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
          <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {mode === 'applied'
            ? <span className="rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white">Applied</span>
            : <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">In Queue</span>
          }
          <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-600">{job.salary}</span>
          <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-600">{job.type}</span>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1">Resume Used</p>
          <a href="#" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
            <FileText className="h-3 w-3" /> Resume_Tailored_{job.company.replace(/\s+/g, '_')}.pdf
          </a>
        </div>

        {mode === 'applied' && (
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1">Cover Letter</p>
            <a href="#" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
              <FileText className="h-3 w-3" /> Cover_Letter_{job.company.replace(/\s+/g, '_')}.pdf
            </a>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">Activity Log</p>
          <div className="space-y-1.5">
            {(mode === 'applied'
              ? ['Opened job page', 'Filled application form', 'Uploaded tailored resume', 'Application submitted']
              : ['Job queued', 'Reading job details', 'Preparing resume tailoring', 'Waiting to submit']
            ).map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-xs text-gray-500">
                <div className={cn('h-1.5 w-1.5 shrink-0 rounded-full', mode === 'applied' ? 'bg-green-500' : i < 2 ? 'bg-green-500' : 'bg-amber-400')} />
                {step}
              </div>
            ))}
            <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
              ▷ See Replay
            </button>
          </div>
        </div>

        {mode !== 'applied' && (
          <button className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Apply Now
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Jobs Tab ─────────────────────────────────────────────────────────────────

function JobsQueueTab({
  studentId,
  selected,
  setSelected,
}: {
  studentId: string
  selected: string | null
  setSelected: (id: string | null) => void
}) {
  const [search, setSearch] = useState('')
  const filtered = useMemo(() =>
    CAREER_JOBS.filter(j =>
      !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
    ), [search])

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs…" className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-400" />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Title <ArrowDown className="inline h-3 w-3" /></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Salary <ArrowDown className="inline h-3 w-3" /></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Match</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(job => {
                const match = matchPercent(studentId, job.id)
                const matchCls = match >= 85 ? 'text-green-700 bg-green-50' : match >= 75 ? 'text-amber-700 bg-amber-50' : 'text-gray-600 bg-gray-100'
                return (
                  <tr
                    key={job.id}
                    onClick={() => setSelected(selected === job.id ? null : job.id)}
                    className={cn('cursor-pointer hover:bg-gray-50', selected === job.id && 'bg-blue-50')}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-400 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.salary}</td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', matchCls)}>{match}%</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                        <ArrowUpRight className="h-3 w-3" /> Apply
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <button className="mt-3 w-full text-center text-sm text-blue-600 hover:underline">Load more</button>
      </div>
      {selected && (
        <JobDetailPanel jobId={selected} mode="queue" onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

// ─── Applied Tab ──────────────────────────────────────────────────────────────

const STATUS_PILL: Record<string, string> = {
  failed:       'bg-red-100 text-red-700',
  needs_review: 'bg-orange-100 text-orange-700',
  completed:    'bg-green-100 text-green-700',
  pending:      'bg-yellow-100 text-yellow-700',
}

function AppliedTab({
  applications,
  manualUrls,
  selected,
  setSelected,
}: {
  applications: MockApplication[]
  manualUrls: string[]
  selected: string | null
  setSelected: (id: string | null) => void
}) {
  const [search, setSearch] = useState('')
  const filtered = useMemo(() =>
    applications.filter(a =>
      !search || a.jobTitle.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase())
    ), [applications, search])

  return (
    <div className="flex gap-4">
      <div className="flex-1 min-w-0">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applied jobs…" className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-400" />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Title <ArrowDown className="inline h-3 w-3" /></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Source <ArrowDown className="inline h-3 w-3" /></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Manual pending URLs */}
              {manualUrls.map(url => (
                <tr key={url} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Job application</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{inferCompanyFromUrl(url)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new URL(url).hostname.replace('www.', '')}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Today</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-700">
                      <Clock3 className="h-3 w-3" /> Pending
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && manualUrls.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">No applications yet.</td></tr>
              ) : filtered.map(a => (
                <tr
                  key={a.id}
                  onClick={() => {
                    const csJob = CAREER_JOBS.find(j => j.company === a.company)
                    if (csJob) setSelected(selected === csJob.id ? null : csJob.id)
                  }}
                  className={cn('cursor-pointer hover:bg-gray-50')}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold text-white" style={{ background: a.companyColor }}>
                        {a.company[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{a.jobTitle}</p>
                        <p className="text-xs text-gray-500">{a.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.source}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.dateApplied}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS_PILL[a.status] ?? 'bg-gray-100 text-gray-700')}>
                      {a.status === 'completed' && <Check className="inline h-3 w-3 mr-0.5" />}
                      {a.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-3 w-full text-center text-sm text-blue-600 hover:underline">Load more</button>
      </div>
      {selected && (
        <JobDetailPanel jobId={selected} mode="applied" onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

// ─── Main AgentTab ────────────────────────────────────────────────────────────

export default function AgentTab({
  student,
  applications,
  autoApply,
  onToggleAutoApply,
}: {
  student: MockStudent
  applications: MockApplication[]
  autoApply: boolean
  onToggleAutoApply: () => void
}) {
  const [innerTab,    setInnerTab]    = useState<InnerTab>('jobs')
  const [selected,    setSelected]    = useState<string | null>(null)
  const [issuesOpen,  setIssuesOpen]  = useState(false)
  const [manualUrls,  setManualUrls]  = useState<string[]>([])

  const [issues, setIssues] = useState<AgentIssue[]>(() =>
    applications
      .filter(a => a.status === 'failed' || a.status === 'needs_review')
      .map(a => ({
        id: `issue-${a.id}`,
        title: a.jobTitle,
        company: a.company,
        reason: a.status === 'failed'
          ? 'Application form could not be completed due to an unexpected verification step.'
          : 'Application requires manual review before submission.',
        fallback: 'Resume and cover letter were generated and saved.',
        status: 'needs_review' as IssueStatus,
      }))
  )

  const activeIssueCount = issues.filter(i => i.status !== 'resolved').length

  const retryIssue = (issue: AgentIssue) => {
    if (issue.status !== 'needs_review') return
    setIssues(curr => curr.map(i => i.id === issue.id ? { ...i, status: 'retrying' } : i))
    setTimeout(() => {
      setIssues(curr => curr.map(i => i.id === issue.id ? { ...i, status: 'resolved', fallback: 'Retry completed — application submitted.' } : i))
    }, 1200)
  }

  return (
    <div className="space-y-4 pt-5">
      {/* Agent Status Banner */}
      <div className={cn(
        'flex items-center justify-between rounded-xl border px-5 py-4',
        autoApply ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn('h-2.5 w-2.5 rounded-full', autoApply ? 'bg-green-500 animate-pulse' : 'bg-gray-400')} />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Agent {autoApply ? 'Running' : 'Paused'}
            </p>
            <p className="text-xs text-gray-500">
              {autoApply
                ? `Actively searching and applying to jobs for ${student.name.split(' ')[0]}`
                : `Auto-apply is paused for ${student.name.split(' ')[0]}`}
            </p>
          </div>
        </div>
        <button
          onClick={onToggleAutoApply}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
            autoApply ? 'border-green-300 bg-white text-green-700 hover:bg-green-100' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
          )}
        >
          <span className={cn(
            'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors',
            autoApply ? 'bg-green-500' : 'bg-gray-300'
          )}>
            <span className={cn('inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform', autoApply ? 'translate-x-4' : 'translate-x-0.5')} />
          </span>
          {autoApply ? 'Pause Agent' : 'Start Agent'}
        </button>
      </div>

      {/* Stats */}
      <StatsRow applications={applications} onSeeIssues={() => setIssuesOpen(v => !v)} />

      {/* Issues Panel */}
      {issuesOpen && activeIssueCount > 0 && (
        <IssuesPanel issues={issues.filter(i => i.status !== 'resolved')} onClose={() => setIssuesOpen(false)} onRetry={retryIssue} />
      )}

      {/* Manual Apply Card */}
      <ManualApplyCard onAdd={url => { setManualUrls(u => [url, ...u]); setInnerTab('applied') }} />

      {/* Inner Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {(['jobs', 'applied'] as InnerTab[]).map(t => (
            <button
              key={t}
              onClick={() => setInnerTab(t)}
              className={cn(
                '-mb-px pb-3 text-sm font-medium border-b-2 transition-colors capitalize',
                innerTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {t === 'jobs' ? 'Jobs Queue' : 'Applied'}
            </button>
          ))}
        </nav>
      </div>

      {innerTab === 'jobs' && (
        <JobsQueueTab studentId={student.id} selected={selected} setSelected={setSelected} />
      )}
      {innerTab === 'applied' && (
        <AppliedTab
          applications={applications}
          manualUrls={manualUrls}
          selected={selected}
          setSelected={setSelected}
        />
      )}
    </div>
  )
}
