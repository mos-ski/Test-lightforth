import type { ReactNode } from 'react'
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, FileText, LinkIcon, Play, Search, X } from 'lucide-react'

import type { AutoApplyActivity, AutoApplyAgentStatus, AutoApplyApplication, AutoApplyJob, AutoApplyMetric, AutoApplySetup } from '@/contracts/auto-apply.draft'
import { cn, FormField, FormPanel, FormPanelFooter, FormTextArea, ReviewSummaryList, ShellBar, SourcePicker } from '@/ui'

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
  readonly metrics: readonly AutoApplyMetric[]
  readonly statuses: readonly AutoApplyAgentStatus[]
  readonly activities: readonly AutoApplyActivity[]
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
      <Header homeHref={homeHref} actionHref={contactHref} />
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
      <Header homeHref={homeHref} actionHref={setupHref} />
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
                    active === tab.key ? 'border-accent text-accent-text' : 'border-transparent text-ink-muted',
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

export function AutoApplyAgentView({ homeHref, setupHref, agentHref, jobsHref, appliedHref, metrics, statuses, activities }: AutoApplyAgentViewProps) {
  return (
    <AppShell homeHref={homeHref} title="Agents" active="agent" setupHref={setupHref} agentHref={agentHref} jobsHref={jobsHref} appliedHref={appliedHref}>
      <div className="pt-5">
        <div className="grid gap-3 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-border bg-surface p-4 shadow-control">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{metric.label}</p>
              <p className="mt-1 text-2xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          {statuses.map((status) => (
            <article key={status.name} className="rounded-lg border border-border bg-surface p-4 shadow-control">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wide">{status.name}</h2>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', status.status === 'running' ? 'bg-positive-surface text-positive' : 'bg-surface-subtle text-ink-muted')}>
                  {status.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink">{status.description}</p>
            </article>
          ))}
        </div>
        <section className="mt-6 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-base font-semibold">Live activity</h2>
          <div className="mt-5 grid gap-5">
            {activities.map((activity) => (
              <article key={activity.id} className="grid gap-2 border-b border-border pb-5 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold capitalize text-ink">{activity.actor}</span>
                  <span className="text-ink-muted">{activity.time}</span>
                </div>
                <p className={cn('text-sm', activity.tone === 'muted' ? 'text-ink-muted' : 'text-ink')}>{activity.message}</p>
                <p className="text-xs italic text-ink-muted">{activity.detail}</p>
                <div className="flex flex-wrap gap-3">
                  {activity.links.map((link) => (
                    <a key={link} href={jobsHref} className="text-xs text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                      {link}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}

function JobList({ jobs, selectedJob, getJobHref }: { readonly jobs: readonly AutoApplyJob[]; readonly selectedJob?: AutoApplyJob; readonly getJobHref: (job: AutoApplyJob) => string }) {
  return (
    <div className="grid gap-7 pt-7">
      {jobs.map((job) => (
        <a
          key={job.id}
          href={getJobHref(job)}
          className={cn(
            'flex min-h-12 items-center gap-5 px-5 py-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
            selectedJob?.id === job.id ? 'bg-surface' : 'bg-surface',
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
              <span className="rounded px-2 py-0.5 text-[10px] font-bold text-positive bg-positive-surface">{job.matchPercent}% EXCELLENT MATCH</span>
            </span>
            <span className="mt-1 block text-xs text-ink-muted">
              {job.company} - {job.location} - {job.type}
            </span>
            <span className="mt-1 block text-xs text-muted">
              {job.dateLabel} - {job.source}
            </span>
          </span>
          {job.status === 'applied' ? (
            <span className="rounded-lg bg-accent-subtle px-4 py-2 text-base font-medium text-accent-text">Applied</span>
          ) : (
            <span className="rounded-lg bg-accent px-4 py-2 text-base font-medium text-on-accent">Apply</span>
          )}
        </a>
      ))}
    </div>
  )
}

function JobSearch() {
  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search by title or company</span>
        <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
        <input className="min-h-11 w-full rounded-lg border border-input bg-surface py-2 pe-3 ps-10 text-base text-ink outline-none placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus" placeholder="Search by title or company" />
      </label>
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

function JobPreview({
  job,
  jobsHref,
  appliedHref,
  resumeHistoryHref,
  applied = false,
}: {
  readonly job: AutoApplyJob
  readonly jobsHref: string
  readonly appliedHref: string
  readonly resumeHistoryHref: string
  readonly applied?: boolean
}) {
  return (
    <aside className="w-full shrink-0 border border-border bg-surface shadow-control lg:w-[30rem]">
      <div className="max-h-[52rem] overflow-y-auto p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold">{job.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{job.company} {job.location ? `- ${job.location}` : ''}</p>
          </div>
          <a href={jobsHref} aria-label="Close job preview" className="grid size-10 place-items-center rounded-lg text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <X aria-hidden="true" className="size-5" />
          </a>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', applied ? 'bg-positive text-on-accent' : 'bg-warning-surface text-warning')}>{applied ? 'Applied' : 'NEW'}</span>
          <span className="text-sm text-muted">{applied ? 'JUL 12 2026' : 'Aug 14, 2026'}</span>
        </div>
        <section className="mt-4 grid gap-4 border-t border-border pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Job Listing</h3>
          <a href={job.listingUrl} className="flex min-w-0 items-center gap-2 text-sm text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">{job.listingUrl}</span>
          </a>
        </section>
        <section className="mt-4 grid gap-4 border-t border-border pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Resume Used</h3>
          <a href={resumeHistoryHref} className="flex min-w-0 items-center gap-2 text-sm text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <FileText aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">{job.resumeFileName}</span>
          </a>
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
              <p className="text-sm font-semibold">{job.creditsRemaining}/{job.creditsTotal} Credit Left</p>
              <p className="mt-1 text-xs text-ink-muted">Lightforth will only deduct credit for successful applications</p>
            </div>
          </>
        ) : null}
      </div>
      {!applied ? (
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <a href={jobsHref} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </a>
          <a href={appliedHref} className="inline-flex min-h-11 min-w-36 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Apply
          </a>
        </div>
      ) : null}
    </aside>
  )
}

export function AutoApplyJobsView({ homeHref, setupHref, agentHref, jobsHref, appliedHref, resumeHistoryHref, jobs, selectedJob }: AutoApplyJobsViewProps) {
  return (
    <Workspace>
      <Header homeHref={homeHref} actionHref={setupHref} />
      <section className="flex flex-col gap-8 p-4 lg:flex-row lg:p-8">
        <div className="min-w-0 flex-1 bg-surface shadow-panel">
          <div className="border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Jobs</h1>
          </div>
          <div className="p-8">
            <nav aria-label="Auto apply sections" className="flex gap-6 border-b border-border text-sm font-medium">
              <a href={setupHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Set Up</a>
              <a href={agentHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Agent</a>
              <a href={jobsHref} aria-current="page" className="min-h-11 border-b-2 border-accent px-1 pb-2 text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Jobs</a>
              <a href={appliedHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Applied</a>
            </nav>
            <div className="pt-5">
              <JobSearch />
              <JobList jobs={jobs} selectedJob={selectedJob} getJobHref={(job) => `${jobsHref}/${job.id}`} />
              <div className="mt-5 flex items-center justify-center gap-4 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-1 text-muted"><ChevronLeft aria-hidden="true" className="size-4" />Previous</span>
                <span>Page 1 of 43</span>
                <span className="inline-flex items-center gap-1 text-ink">Next<ChevronRight aria-hidden="true" className="size-4" /></span>
              </div>
            </div>
          </div>
        </div>
        {selectedJob ? <JobPreview job={selectedJob} jobsHref={jobsHref} appliedHref={appliedHref} resumeHistoryHref={resumeHistoryHref} /> : null}
      </section>
    </Workspace>
  )
}

export function AutoApplyAppliedView({ homeHref, setupHref, agentHref, jobsHref, appliedHref, resumeHistoryHref, jobs, application }: AutoApplyAppliedViewProps) {
  return (
    <Workspace>
      <Header homeHref={homeHref} actionHref={setupHref} />
      <section className="flex flex-col gap-8 p-4 lg:flex-row lg:p-8">
        <div className="min-w-0 flex-1 bg-surface shadow-panel">
          <div className="border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Applied</h1>
          </div>
          <div className="p-8">
            <nav aria-label="Auto apply sections" className="flex gap-6 border-b border-border text-sm font-medium">
              <a href={setupHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Set Up</a>
              <a href={agentHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Agent</a>
              <a href={jobsHref} className="min-h-11 border-b-2 border-transparent px-1 pb-2 text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Jobs</a>
              <a href={appliedHref} aria-current="page" className="min-h-11 border-b-2 border-accent px-1 pb-2 text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Applied</a>
            </nav>
            <div className="pt-5">
              <JobSearch />
              <JobList jobs={jobs.map((job) => (job.id === application.job.id ? application.job : job))} selectedJob={application.job} getJobHref={(job) => `${jobsHref}/${job.id}`} />
            </div>
          </div>
        </div>
        <aside className="w-full shrink-0 border border-border bg-surface p-8 shadow-control lg:w-[30rem]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold">{application.job.title}</h2>
              <p className="mt-1 text-sm text-ink-muted">{application.job.company}</p>
            </div>
            <a href={jobsHref} aria-label="Close applied detail" className="grid size-10 place-items-center rounded-lg text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <X aria-hidden="true" className="size-5" />
            </a>
          </div>
          <div className="mt-4 flex items-center gap-2 border-b border-border pb-4">
            <span className="rounded-full bg-positive px-3 py-1 text-xs font-semibold text-on-accent">Applied</span>
            <span className="text-sm text-muted">{application.appliedDate}</span>
          </div>
          <section className="border-b border-border py-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Job Listing</h3>
            <a href={application.job.listingUrl} className="mt-2 flex min-w-0 items-center gap-2 text-sm text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <LinkIcon aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">{application.job.listingUrl}</span>
            </a>
          </section>
          <section className="border-b border-border py-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Resume Used</h3>
            <a href={resumeHistoryHref} className="mt-2 flex min-w-0 items-center gap-2 text-sm text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <FileText aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">{application.job.resumeFileName}</span>
            </a>
          </section>
          <section className="border-b border-border py-4">
            <p className="text-xs font-semibold text-muted">JUL 12</p>
            <div className="mt-3 grid gap-3">
              {application.events.map((event) => (
                <div key={event.label} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-ink">
                    <span className="grid size-5 place-items-center rounded-full bg-positive-surface"><span className="size-2 rounded-full bg-positive" /></span>
                    {event.label}
                  </span>
                  <span className="text-xs text-muted">{event.time}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="py-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Activity Log</h3>
            <ul className="mt-3 grid gap-2 text-sm text-ink-muted">
              {application.activityLog.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check aria-hidden="true" className="size-4 text-positive" />
                  {item}
                </li>
              ))}
            </ul>
            <button type="button" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Play aria-hidden="true" className="size-4" />
              See Replay
            </button>
          </section>
        </aside>
      </section>
    </Workspace>
  )
}
