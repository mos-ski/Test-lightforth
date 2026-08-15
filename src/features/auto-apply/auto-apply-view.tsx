import { useState, useEffect, useRef, type ReactNode } from 'react'
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, FileText, Filter, LinkIcon, PenLine, Play, RefreshCw, Search, Send, X, Zap } from 'lucide-react'

import type { AutoApplyApplication, AutoApplyJob, AutoApplySetup } from '@/contracts/auto-apply.draft'
import { cn, FormField, FormPanel, FormPanelFooter, FormTextArea, ReviewSummaryList, ShellBar, SourcePicker } from '@/ui'
import { useAgentSession, type AgentSession, type FeedEvent, type FeedLink } from '@/hooks/useAgentSession'

export type AutoApplyUploadViewProps = {
  readonly homeHref: string
  readonly contactHref: string
  readonly agentHref: string
}

export type AutoApplySetupStepViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly nextHref: string
  readonly setup: AutoApplySetup
  readonly step: 'contact' | 'preferences' | 'additional'
}

export type AutoApplyReviewViewProps = {
  readonly homeHref: string
  readonly contactHref: string
  readonly additionalHref: string
  readonly agentHref: string
  readonly setup: AutoApplySetup
}

export type AutoApplyAgentViewProps = {
  readonly homeHref: string
  readonly setupHref: string
  readonly agentHref: string
  readonly jobsHref: string
  readonly appliedHref: string
}

export type AutoApplyJobsViewProps = {
  readonly homeHref: string
  readonly setupHref: string
  readonly agentHref: string
  readonly jobsHref: string
  readonly appliedHref: string
  readonly resumeHistoryHref: string
  readonly jobs: readonly AutoApplyJob[]
  readonly selectedJob?: AutoApplyJob
}

export type AutoApplyAppliedViewProps = {
  readonly homeHref: string
  readonly setupHref: string
  readonly agentHref: string
  readonly jobsHref: string
  readonly appliedHref: string
  readonly resumeHistoryHref: string
  readonly jobs: readonly AutoApplyJob[]
  readonly application: AutoApplyApplication
}

const tabs = [
  { key: 'setup', label: 'Set Up' },
  { key: 'agent', label: 'Agent' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'applied', label: 'Applied' },
] as const

function Header({ homeHref, current = 'Auto Apply', actionHref }: { readonly homeHref: string; readonly current?: string; readonly actionHref?: string }) {
  return (
    <ShellBar
      homeHref={homeHref}
      current={current}
      closeHref={homeHref}
      closeLabel="Close auto apply"
      secondaryAction={actionHref ? { label: 'Update Preference', href: actionHref, iconSrc: '/v3-assets/figma/sidebar-briefcase.svg' } : undefined}
    />
  )
}

function Workspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

function PaperShell({ children }: { readonly children: ReactNode }) {
  return <article className="mx-auto min-h-[56rem] w-full max-w-[44rem] bg-surface p-8 shadow-panel">{children}</article>
}

function Tag({ children }: { readonly children: ReactNode }) {
  return <span className="rounded-full bg-accent-subtle px-2 py-1 text-xs font-medium text-accent-text">{children}</span>
}

export function AutoApplyUploadView({ homeHref, contactHref, agentHref }: AutoApplyUploadViewProps) {
  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="px-4 py-8 lg:py-10">
        <PaperShell>
          <SourcePicker
            title="Upload a resume"
            actionLabel="Click to upload"
            idleText="or drag and drop"
            meta="PDF, DOC, DOCX or TXT"
            options={[
              { label: 'Upload a Resume', href: contactHref, iconSrc: '/v3-assets/figma/upload-option-upload.svg' },
              { label: 'Use Lightforth Resume', href: contactHref, iconSrc: '/v3-assets/figma/upload-option-lightforth.svg', emphasis: 'strong' },
            ]}
            historyLink={{ label: 'Continue to saved agent', href: agentHref }}
          />
        </PaperShell>
      </section>
    </Workspace>
  )
}

export function AutoApplySetupStepView({ homeHref, backHref, nextHref, setup, step }: AutoApplySetupStepViewProps) {
  const copy = {
    contact: { title: 'Contact Information', count: '1/4' },
    preferences: { title: 'Job Preferences', count: '2/4' },
    additional: { title: 'Additional Information', count: '3/4' },
  }[step]

  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="px-4 py-9">
        <FormPanel
          title={copy.title}
          step={copy.count}
          uploadedFile={step === 'contact' ? { fileName: setup.uploadedFileName, changeHref: backHref } : undefined}
          footer={<FormPanelFooter backHref={backHref} nextHref={nextHref} />}
        >
            {step === 'contact' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField id="auto-name" label="Full name" defaultValue={setup.fullName} />
                <FormField id="auto-email" label="Email" defaultValue={setup.email} />
                <FormField id="auto-phone" label="Phone" defaultValue={setup.phone} />
                <FormField id="auto-location" label="Location" defaultValue={setup.location} />
                <div className="sm:col-span-2">
                  <FormField id="auto-linkedin" label="LinkedIn profile" defaultValue={setup.linkedInUrl} />
                </div>
              </div>
            ) : null}
            {step === 'preferences' ? (
              <>
                <FormField id="auto-role" label="Target Role" defaultValue={setup.targetRoles.join(', ')} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField id="auto-seniority" label="Seniority" defaultValue={setup.seniority} />
                  <FormField id="auto-salary" label="Salary range" defaultValue={setup.salaryRange} />
                  <FormField id="auto-job-type" label="Job Type" defaultValue={setup.jobTypes.join(', ')} />
                  <FormField id="auto-work-mode" label="Work mode" defaultValue={setup.workModes.join(', ')} />
                </div>
              </>
            ) : null}
            {step === 'additional' ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField id="auto-work-authorization" label="Work authorization" defaultValue={setup.workAuthorization} />
                  <FormField id="auto-start-timeline" label="Start timeline" defaultValue={setup.startTimeline} />
                </div>
                <FormTextArea id="auto-additional-notes" label="Additional notes" defaultValue={setup.additionalNotes} />
              </>
            ) : null}
        </FormPanel>
      </section>
    </Workspace>
  )
}

export function AutoApplyReviewView({ homeHref, contactHref, additionalHref, agentHref, setup }: AutoApplyReviewViewProps) {
  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="px-4 py-9">
        <FormPanel
          title="Review Job Preference"
          step="4/4"
          footer={<FormPanelFooter backHref={additionalHref} nextHref={agentHref} nextLabel="Save & Continue" />}
        >
          <ReviewSummaryList
            rows={[
              { id: 'resume', title: 'Resume', value: setup.uploadedFileName, iconSrc: '/v3-assets/figma/form-review-resume.svg', href: contactHref },
              { id: 'contact', title: 'Contact Information', value: `${setup.fullName} - ${setup.email} - ${setup.location}`, iconSrc: '/v3-assets/figma/form-review-contact.svg', href: contactHref },
              { id: 'preferences', title: 'Job Preferences', value: `${setup.targetRoles[0]}, ${setup.seniority} - ${setup.salaryRange}`, iconSrc: '/v3-assets/figma/form-review-briefcase.svg', href: '/v3/auto-apply/preferences' },
              { id: 'additional', title: 'Additional Info', value: `${setup.startTimeline} - ${setup.jobTypes[0]}`, iconSrc: '/v3-assets/figma/form-review-info.svg', href: additionalHref },
            ]}
          />
        </FormPanel>
      </section>
    </Workspace>
  )
}

function AppShell({
  homeHref,
  title,
  active,
  setupHref,
  agentHref,
  jobsHref,
  appliedHref,
  children,
}: {
  readonly homeHref: string
  readonly title: string
  readonly active: 'setup' | 'agent' | 'jobs' | 'applied'
  readonly setupHref: string
  readonly agentHref: string
  readonly jobsHref: string
  readonly appliedHref: string
  readonly children: ReactNode
}) {
  const hrefs: Record<typeof tabs[number]['key'], string> = {
    setup: setupHref,
    agent: agentHref,
    jobs: jobsHref,
    applied: appliedHref,
  }

  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="p-4 lg:p-8">
        <div className="mx-auto min-h-[56rem] max-w-7xl bg-surface shadow-panel">
          <div className="border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">{title}</h1>
          </div>
          <div className="p-8">
            <nav aria-label="Auto apply sections" className="flex gap-6 border-b border-border text-sm font-medium">
              {tabs.map((tab) => (
                <a
                  key={tab.key}
                  href={hrefs[tab.key]}
                  aria-current={active === tab.key ? 'page' : undefined}
                  className={cn(
                    'min-h-11 border-b-2 px-1 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                    active === tab.key ? 'border-accent text-accent' : 'border-transparent text-ink-muted',
                  )}
                >
                  {tab.label}
                </a>
              ))}
            </nav>
            {children}
          </div>
        </div>
      </section>
    </Workspace>
  )
}

// ─── Agent View (live animation via useAgentSession) ──────────────────────────

const agentStatusTone: Record<string, string> = {
  running: 'bg-positive-surface text-positive',
  working: 'bg-warning-surface text-warning',
  complete: 'bg-accent-subtle text-accent-text',
  idle: 'bg-surface-subtle text-ink-muted',
}

const agentIcon: Record<string, typeof Search> = {
  scout: Search,
  filter: Filter,
  tailor: PenLine,
  driver: Send,
  system: Zap,
}

type AgentTabValue = 'all' | 'scout' | 'filter' | 'tailor' | 'driver'
const agentTabs: { value: AgentTabValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'scout', label: 'Scout' },
  { value: 'filter', label: 'Filter' },
  { value: 'tailor', label: 'Tailor' },
  { value: 'driver', label: 'Driver' },
]

function AgentStatsSummary({ stats }: { readonly stats: AgentSession['stats'] }) {
  const items = [
    { label: 'Found', value: stats.found },
    { label: 'Matched', value: stats.matched },
    { label: 'Tailored', value: stats.tailored },
    { label: 'Applied', value: stats.applied },
  ]
  return (
    <div className="grid gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border bg-surface p-4 shadow-control">
          <p className="text-xs font-semibold uppercase tracking-[0.3px] text-ink-muted">{item.label}</p>
          <p className="mt-1 text-2xl font-bold text-ink">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function AgentStatusCards({ agents }: { readonly agents: AgentSession['agents'] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-4">
      {agents.filter((a) => a.name !== 'system').map((agent) => (
        <article key={agent.name} className="rounded-lg border border-border bg-surface p-4 shadow-control">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.3px] text-ink">{agent.label}</h2>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', agentStatusTone[agent.status] ?? agentStatusTone.idle)}>
              {agent.status}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink">{agent.currentTask}</p>
        </article>
      ))}
    </div>
  )
}

function AgentFeed({ events }: { readonly events: FeedEvent[] }) {
  const [activeTab, setActiveTab] = useState<AgentTabValue>('all')
  const bottomRef = useRef<HTMLDivElement>(null)

  const filtered = activeTab === 'all' ? events : events.filter((e) => e.agent === activeTab)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [events.length])

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-control">
      <div className="flex items-center justify-between border-b border-border px-4">
        <nav className="flex" aria-label="Filter activity by agent">
          {agentTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              aria-current={activeTab === tab.value ? 'true' : undefined}
              className={cn(
                'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                activeTab === tab.value ? 'border-accent text-accent' : 'border-transparent text-ink-muted hover:text-ink',
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <span className="flex items-center gap-1.5 text-xs font-medium text-positive">
          <span className="size-1.5 rounded-full bg-positive" aria-hidden="true" />
          Live
        </span>
      </div>
      <div className="max-h-[480px] overflow-y-auto px-4 py-3">
        {filtered.map((event, i) => {
          const Icon = agentIcon[event.agent] ?? Zap
          const isLast = i === filtered.length - 1
          const isTopLevel = activeTab !== 'all' || event.agent === 'scout' || event.agent === 'system'
          return (
            <div key={event.id} className={cn('flex gap-3', !isTopLevel && 'ml-5')}>
              <div className="flex flex-col items-center pt-0.5">
                <Icon className="size-3.5 shrink-0 text-ink-muted" aria-hidden="true" />
                {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className={cn('min-w-0 pb-4', isLast && 'pb-1')}>
                <div className="mb-0.5 flex items-center gap-2">
                  {event.agent !== 'system' && (
                    <span className={cn('text-xs font-semibold capitalize', isTopLevel ? 'text-ink' : 'text-ink-muted')}>
                      {event.agent}
                    </span>
                  )}
                  <span className="text-xs text-ink-muted">
                    {event.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                </div>
                <p className={cn('text-sm leading-relaxed', isTopLevel ? 'text-ink' : 'text-ink-muted')}>{event.message}</p>
                {event.thought && <p className="mt-1 text-xs italic text-ink-muted">{event.thought}</p>}
                {event.links && event.links.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                    {event.links.map((link: FeedLink) => (
                      <span key={link.label} className="text-xs text-accent underline underline-offset-4">
                        {link.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </section>
  )
}

export function AutoApplyAgentView({ homeHref, setupHref, agentHref, jobsHref, appliedHref }: AutoApplyAgentViewProps) {
  const session = useAgentSession('auto-apply')

  return (
    <AppShell homeHref={homeHref} title="Agents" active="agent" setupHref={setupHref} agentHref={agentHref} jobsHref={jobsHref} appliedHref={appliedHref}>
      <div className="pt-5">
        <AgentStatsSummary stats={session.stats} />
        <div className="mt-4">
          <AgentStatusCards agents={session.agents} />
        </div>
        <div className="mt-6">
          <AgentFeed events={session.events} />
        </div>
      </div>
    </AppShell>
  )
}

// ─── Jobs View ────────────────────────────────────────────────────────────────

function JobSearch({ onRefresh }: { readonly onRefresh?: () => void }) {
  return (
    <div>
      <div className="flex gap-2">
        <label className="relative block flex-1">
          <span className="sr-only">Search by title or company</span>
          <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
          <input className="min-h-11 w-full rounded-lg border border-input bg-surface py-2 pe-3 ps-10 text-base text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus" placeholder="Search by title or company" />
        </label>
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-surface px-4 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Refresh job list"
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            Refresh
          </button>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {['Location', 'Experience Level', 'Job Type', 'Date Posted'].map((filter) => (
          <button key={filter} type="button" className="inline-flex min-h-9 items-center gap-1 rounded-full border border-input bg-surface px-3 text-sm text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {filter}
            <ChevronDown aria-hidden="true" className="size-4" />
          </button>
        ))}
      </div>
    </div>
  )
}

function JobList({
  jobs,
  selectedJob,
  onSelectJob,
}: {
  readonly jobs: readonly AutoApplyJob[]
  readonly selectedJob?: AutoApplyJob
  readonly onSelectJob: (job: AutoApplyJob) => void
}) {
  return (
    <div className="grid gap-1 pt-5">
      {jobs.map((job) => (
        <button
          key={job.id}
          type="button"
          onClick={() => onSelectJob(job)}
          className={cn(
            'flex w-full items-center gap-5 rounded-lg px-5 py-4 text-left transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
            selectedJob?.id === job.id && 'bg-surface-subtle ring-1 ring-accent',
          )}
        >
          <span
            className={cn(
              'grid size-10 shrink-0 place-items-center rounded-lg text-sm font-bold',
              job.company.toLowerCase().includes('stripe') ? 'bg-accent-subtle text-accent-text' : 'bg-danger-surface text-danger',
            )}
          >
            {job.company.slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-ink">{job.title}</span>
              <span className="rounded px-2 py-0.5 text-[10px] font-bold text-positive bg-positive-surface">{job.matchPercent}% MATCH</span>
            </span>
            <span className="mt-1 block text-xs text-ink-muted">
              {job.company} - {job.location} - {job.type}
            </span>
            <span className="mt-1 block text-xs text-ink-muted">
              {job.dateLabel} - {job.source}
            </span>
          </span>
          {job.status === 'applied' ? (
            <span className="shrink-0 rounded-lg bg-accent-subtle px-4 py-2 text-sm font-medium text-accent-text">Applied</span>
          ) : (
            <span className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent">Apply</span>
          )}
        </button>
      ))}
    </div>
  )
}

function JobPreview({
  job,
  onClose,
  applied = false,
}: {
  readonly job: AutoApplyJob
  readonly onClose: () => void
  readonly applied?: boolean
}) {
  return (
    <aside className="w-full shrink-0 border-l border-border bg-surface p-8 shadow-control lg:w-[30rem]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold">{job.title}</h2>
          <p className="mt-1 text-sm text-ink-muted">{job.company} {job.location ? `- ${job.location}` : ''}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close job preview"
          className="grid size-10 place-items-center rounded-lg text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', applied ? 'bg-positive text-on-accent' : 'bg-warning-surface text-warning')}>{applied ? 'Applied' : 'NEW'}</span>
        <span className="text-sm text-ink-muted">{applied ? 'JUL 12 2026' : job.dateLabel}</span>
      </div>
      <section className="mt-4 grid gap-4 border-t border-border pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Job Listing</h3>
        <a href={job.listingUrl} className="flex min-w-0 items-center gap-2 text-sm text-accent underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">{job.listingUrl}</span>
        </a>
      </section>
      <section className="mt-4 grid gap-4 border-t border-border pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Resume Used</h3>
        <span className="flex min-w-0 items-center gap-2 text-sm text-ink">
          <FileText aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
          <span className="truncate">{job.resumeFileName}</span>
        </span>
      </section>
      {!applied ? (
        <>
          <section className="mt-4 rounded-lg border border-positive bg-positive-surface p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wide text-positive">Excellent Match</h3>
              <p className="text-2xl font-bold text-positive">{job.matchPercent}%</p>
            </div>
          </section>
          <div className="mt-4 flex flex-wrap gap-2">{job.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
          <section className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">About the role</h3>
            <p className="mt-2 max-h-28 overflow-hidden text-sm leading-6 text-ink-muted">{job.description}</p>
          </section>
          <div className="mt-4 rounded-lg border border-border bg-surface-subtle p-3">
            <p className="text-sm font-semibold">{job.creditsRemaining}/{job.creditsTotal} Credits Left</p>
            <p className="mt-1 text-xs text-ink-muted">Lightforth will only deduct credit for successful applications</p>
          </div>
        </>
      ) : null}
    </aside>
  )
}

export function AutoApplyJobsView({ homeHref, setupHref, agentHref, jobsHref, appliedHref, resumeHistoryHref, jobs, selectedJob: initialSelectedJob }: AutoApplyJobsViewProps) {
  const [selectedJob, setSelectedJob] = useState<AutoApplyJob | undefined>(initialSelectedJob)
  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="min-h-[56rem] bg-surface shadow-panel">
            <div className="border-b border-border px-8 py-8">
              <h1 className="text-xl font-medium">Jobs</h1>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between border-b border-border">
                <nav aria-label="Auto apply sections" className="flex gap-6 text-sm font-medium">
                  <a href={setupHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Set Up</a>
                  <a href={agentHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Agent</a>
                  <a href={jobsHref} aria-current="page" className="min-h-11 border-b-2 border-accent px-1 pb-2 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Jobs</a>
                  <a href={appliedHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Applied</a>
                </nav>
                <a href={setupHref} className="mb-2 inline-flex min-h-10 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  Update Preference
                </a>
              </div>
              <div className="flex gap-6 pt-5">
                <div className={cn('min-w-0 transition-all duration-300', selectedJob ? 'flex-1' : 'w-full')}>
                  <div className="mb-3 flex gap-2">
                    <label className="relative block flex-1">
                      <span className="sr-only">Search by title or company</span>
                      <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="min-h-11 w-full rounded-lg border border-input bg-surface py-2 pe-3 ps-10 text-base text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
                        placeholder="Search by title or company"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setRefreshKey((k) => k + 1)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-surface px-4 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      aria-label="Refresh job list"
                    >
                      <RefreshCw aria-hidden="true" className="size-4" />
                      Refresh
                    </button>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {['Location', 'Experience Level', 'Job Type', 'Date Posted'].map((filter) => (
                      <button key={filter} type="button" className="inline-flex min-h-9 items-center gap-1 rounded-full border border-input bg-surface px-3 text-sm text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                        {filter}
                        <ChevronDown aria-hidden="true" className="size-4" />
                      </button>
                    ))}
                  </div>
                  <JobList jobs={filtered} selectedJob={selectedJob} onSelectJob={(job) => setSelectedJob(selectedJob?.id === job.id ? undefined : job)} />
                  <div className="mt-5 flex items-center justify-center gap-4 text-sm text-ink-muted">
                    <span className="inline-flex items-center gap-1 text-ink-muted"><ChevronLeft aria-hidden="true" className="size-4" />Previous</span>
                    <span>Page 1 of 43</span>
                    <span className="inline-flex items-center gap-1 text-ink">Next<ChevronRight aria-hidden="true" className="size-4" /></span>
                  </div>
                </div>
                {selectedJob ? (
                  <div className="hidden w-[30rem] shrink-0 animate-slide-in-right lg:block">
                    <JobPreview job={selectedJob} onClose={() => setSelectedJob(undefined)} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Workspace>
  )
}

// ─── Applied View ─────────────────────────────────────────────────────────────

export function AutoApplyAppliedView({ homeHref, setupHref, agentHref, jobsHref, appliedHref, resumeHistoryHref, jobs, application }: AutoApplyAppliedViewProps) {
  const [selectedJob, setSelectedJob] = useState<AutoApplyJob | undefined>(application.job)
  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const allJobs = jobs.map((job) => (job.id === application.job.id ? application.job : job))
  const filtered = allJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Workspace>
      <Header homeHref={homeHref} />
      <section className="p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="min-h-[56rem] bg-surface shadow-panel">
            <div className="border-b border-border px-8 py-8">
              <h1 className="text-xl font-medium">Applied</h1>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between border-b border-border">
                <nav aria-label="Auto apply sections" className="flex gap-6 text-sm font-medium">
                  <a href={setupHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Set Up</a>
                  <a href={agentHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Agent</a>
                  <a href={jobsHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Jobs</a>
                  <a href={appliedHref} aria-current="page" className="min-h-11 border-b-2 border-accent px-1 pb-2 text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Applied</a>
                </nav>
                <a href={setupHref} className="mb-2 inline-flex min-h-10 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  Update Preference
                </a>
              </div>
              <div className="flex gap-6 pt-5">
                <div className={cn('min-w-0 transition-all duration-300', selectedJob ? 'flex-1' : 'w-full')}>
                  <div className="mb-3 flex gap-2">
                    <label className="relative block flex-1">
                      <span className="sr-only">Search applied jobs</span>
                      <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="min-h-11 w-full rounded-lg border border-input bg-surface py-2 pe-3 ps-10 text-base text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
                        placeholder="Search applied jobs"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setRefreshKey((k) => k + 1)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-input bg-surface px-4 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      aria-label="Refresh applied list"
                    >
                      <RefreshCw aria-hidden="true" className="size-4" />
                      Refresh
                    </button>
                  </div>
                  <JobList jobs={filtered} selectedJob={selectedJob} onSelectJob={(job) => setSelectedJob(selectedJob?.id === job.id ? undefined : job)} />
                </div>
                {selectedJob ? (
                  <div className="hidden w-[30rem] shrink-0 animate-slide-in-right lg:block">
                    <JobPreview
                      job={selectedJob}
                      onClose={() => setSelectedJob(undefined)}
                      applied={selectedJob.id === application.job.id}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Workspace>
  )
}
