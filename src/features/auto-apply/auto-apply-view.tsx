import { useState, useEffect, useRef, type ReactNode } from 'react'
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, FileText, Filter, LinkIcon, PenLine, Play, RefreshCw, Search, Send, X, Zap, Trash2, Download, Mail } from 'lucide-react'

import type { AutoApplyApplication, AutoApplyJob, AutoApplySetup } from '@/contracts/auto-apply.draft'
import {
  DEFAULT_AUTO_APPLY_SETUP,
  EMPLOYMENT_TYPES,
  LOCATION_TYPES,
  GENDER_OPTIONS,
  EXPERIENCE_LEVELS,
  RACE_OPTIONS,
  VETERAN_OPTIONS,
  DISABILITY_OPTIONS,
  SECURITY_CLEARANCE_OPTIONS,
  US_WORK_AUTH_OPTIONS,
  START_TIMELINE_OPTIONS,
  WORK_SCHEDULE_OPTIONS,
} from '@/contracts/auto-apply.draft'
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
              <FormField id="auto-email" label="Email" defaultValue={setup.email} required />
              <FormField id="auto-phone" label="Phone" defaultValue={setup.phone} placeholder="+1" />
              <FormField id="auto-first-name" label="First Name" defaultValue={setup.firstName} required />
              <FormField id="auto-last-name" label="Last Name" defaultValue={setup.lastName} required />
              <div>
                <label htmlFor="auto-gender" className="mb-1 block text-sm font-medium text-ink">Gender</label>
                <select id="auto-gender" defaultValue={setup.gender} className="min-h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <FormField id="auto-dob" label="Date of Birth" defaultValue={setup.dob} placeholder="MM/DD/YYYY" />
              <FormField id="auto-country" label="Country" defaultValue={setup.country} placeholder="Select country" />
              <FormField id="auto-city" label="City" defaultValue={setup.city} placeholder={setup.country ? 'Enter city' : 'Select a country first'} disabled={!setup.country} />
              <FormField id="auto-street" label="Street Address" defaultValue={setup.streetAddress} placeholder="123 Main St" />
              <FormField id="auto-postal" label="Postal Code" defaultValue={setup.postalCode} placeholder="10001" />
              <div className="sm:col-span-2">
                <FormField id="auto-linkedin" label="LinkedIn URL" defaultValue={setup.linkedIn} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="sm:col-span-2">
                <FormField id="auto-github" label="GitHub URL" defaultValue={setup.github} placeholder="https://github.com/..." />
              </div>
              <div className="sm:col-span-2">
                <FormField id="auto-portfolio" label="Portfolio URL" defaultValue={setup.portfolio} placeholder="https://yoursite.com" />
              </div>
            </div>
          ) : null}
          {step === 'preferences' ? (
            <div className="grid gap-3">
              <FormField id="auto-role" label="Desired Role" defaultValue={setup.desiredRole} required placeholder="e.g. Product Manager" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="auto-experience" className="mb-1 block text-sm font-medium text-ink">Experience Level</label>
                  <select id="auto-experience" defaultValue={setup.experienceLevel} className="min-h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
                    <option value="">Select level</option>
                    {EXPERIENCE_LEVELS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <FormField id="auto-salary" label="Salary Expectation" defaultValue={setup.salary} placeholder="e.g. $120,000/year" />
              </div>
              <FormField id="auto-locations" label="Preferred Locations" defaultValue={setup.locations} placeholder="Search cities or regions…" />
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Employment Type</label>
                <div className="flex flex-wrap gap-2">
                  {EMPLOYMENT_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={cn(
                        'rounded-full border px-4 py-1.5 text-sm transition-colors',
                        setup.employmentTypes.includes(t)
                          ? 'border-accent bg-accent-subtle text-accent font-medium'
                          : 'border-border text-ink hover:border-accent/40',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">Job Location Type</label>
                <div className="flex flex-wrap gap-2">
                  {LOCATION_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={cn(
                        'rounded-full border px-4 py-1.5 text-sm transition-colors',
                        setup.locationTypes.includes(t)
                          ? 'border-accent bg-accent-subtle text-accent font-medium'
                          : 'border-border text-ink hover:border-accent/40',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={setup.openToRelocate} className="size-4 rounded border-input text-accent focus:ring-focus" />
                <span className="text-sm text-ink">I am open to relocating</span>
              </label>
            </div>
          ) : null}
          {step === 'additional' ? (
            <div className="grid gap-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">Demographics</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="auto-race" className="mb-1 block text-sm font-medium text-ink">Race/Ethnicity</label>
                    <select id="auto-race" defaultValue={setup.race} className="min-h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
                      <option value="">Select</option>
                      {RACE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <FormField id="auto-citizenship" label="Citizenship" defaultValue={setup.citizenship} placeholder="e.g. USA, Canada" />
                  <div>
                    <label htmlFor="auto-veteran" className="mb-1 block text-sm font-medium text-ink">Veteran Status</label>
                    <select id="auto-veteran" defaultValue={setup.veteran} className="min-h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
                      <option value="">Select</option>
                      {VETERAN_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="auto-disability" className="mb-1 block text-sm font-medium text-ink">Disability Status</label>
                    <select id="auto-disability" defaultValue={setup.disability} className="min-h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
                      <option value="">Select</option>
                      {DISABILITY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">Security Clearance</h3>
                <div>
                  <label htmlFor="auto-clearance" className="mb-1 block text-sm font-medium text-ink">Do you hold a defined security clearance?</label>
                  <select id="auto-clearance" defaultValue={setup.securityClearance} className="min-h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
                    <option value="">Select</option>
                    {SECURITY_CLEARANCE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">Work Authorization</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="auto-us-auth" className="mb-1 block text-sm font-medium text-ink">US Work Authorization</label>
                    <select id="auto-us-auth" defaultValue={setup.usWorkAuth} className="min-h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
                      <option value="">Select</option>
                      {US_WORK_AUTH_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <FormField id="auto-canada-auth" label="Canada Work Authorization (Optional)" defaultValue={setup.canadaWorkAuth} placeholder="e.g. Citizen, PR, Work Permit" />
                </div>
                <fieldset className="mt-3">
                  <legend className="text-sm font-medium text-ink">Are you authorized to work in the country you are applying to?</legend>
                  <div className="mt-2 flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="authorizedToWork" value="yes" defaultChecked={setup.authorizedToWork === 'yes'} className="size-4 text-accent focus:ring-focus" />
                      <span className="text-sm text-ink">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="authorizedToWork" value="no" defaultChecked={setup.authorizedToWork === 'no'} className="size-4 text-accent focus:ring-focus" />
                      <span className="text-sm text-ink">No</span>
                    </label>
                  </div>
                </fieldset>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">Logistics</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="auto-start" className="mb-1 block text-sm font-medium text-ink">When are you willing to start?</label>
                    <select id="auto-start" defaultValue={setup.willingToStart} className="min-h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
                      <option value="">Select</option>
                      {START_TIMELINE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="auto-schedule" className="mb-1 block text-sm font-medium text-ink">Work Schedule Availability</label>
                    <select id="auto-schedule" defaultValue={setup.workSchedule} className="min-h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm text-ink outline-none focus:border-focus focus:ring-2 focus:ring-focus">
                      <option value="">Select</option>
                      {WORK_SCHEDULE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
                <label className="mt-3 flex items-center gap-2">
                  <input type="checkbox" defaultChecked={setup.willingToTravel} className="size-4 rounded border-input text-accent focus:ring-focus" />
                  <span className="text-sm text-ink">I am willing to travel for work.</span>
                </label>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">Background Questions</h3>
                <div className="grid gap-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={setup.drugTestConsent} className="size-4 rounded border-input text-accent focus:ring-focus" />
                    <span className="text-sm text-ink">I consent to drug testing if required by the employer.</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={setup.backgroundCheckConsent} className="size-4 rounded border-input text-accent focus:ring-focus" />
                    <span className="text-sm text-ink">I consent to background checks if required.</span>
                  </label>
                  <fieldset>
                    <legend className="text-sm font-medium text-ink">Is there anything that would prevent you from obtaining a Public Trust Clearance?</legend>
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="preventPublicTrust" value="yes" defaultChecked={setup.preventPublicTrust === 'yes'} className="size-4 text-accent focus:ring-focus" />
                        <span className="text-sm text-ink">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="preventPublicTrust" value="no" defaultChecked={setup.preventPublicTrust === 'no'} className="size-4 text-accent focus:ring-focus" />
                        <span className="text-sm text-ink">No</span>
                      </label>
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="text-sm font-medium text-ink">Have you ever been disciplined due to drug diversion?</legend>
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="drugDiversion" value="yes" defaultChecked={setup.drugDiversion === 'yes'} className="size-4 text-accent focus:ring-focus" />
                        <span className="text-sm text-ink">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="drugDiversion" value="no" defaultChecked={setup.drugDiversion === 'no'} className="size-4 text-accent focus:ring-focus" />
                        <span className="text-sm text-ink">No</span>
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-ink">References</h3>
                <p className="text-xs text-ink-muted">No references added yet.</p>
              </div>
            </div>
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
              { id: 'contact', title: 'Contact Information', value: `${setup.firstName} ${setup.lastName} - ${setup.email} - ${setup.country}`, iconSrc: '/v3-assets/figma/form-review-contact.svg', href: contactHref },
              { id: 'preferences', title: 'Job Preferences', value: `${setup.desiredRole}, ${setup.experienceLevel} - ${setup.salary}`, iconSrc: '/v3-assets/figma/form-review-briefcase.svg', href: '/v3/auto-apply/preferences' },
              { id: 'additional', title: 'Additional Info', value: `${setup.willingToStart} - ${setup.usWorkAuth || 'Not set'}`, iconSrc: '/v3-assets/figma/form-review-info.svg', href: additionalHref },
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
  selectedIds,
  onSelectionChange,
}: {
  readonly jobs: readonly AutoApplyJob[]
  readonly selectedJob?: AutoApplyJob
  readonly onSelectJob: (job: AutoApplyJob) => void
  readonly selectedIds?: ReadonlySet<string>
  readonly onSelectionChange?: (ids: ReadonlySet<string>) => void
}) {
  const [internalSelected, setInternalSelected] = useState<ReadonlySet<string>>(new Set())
  const selected = selectedIds ?? internalSelected
  const setSelected = onSelectionChange ?? setInternalSelected

  function toggleRow(id: string) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  function toggleAll() {
    if (selected.size === jobs.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(jobs.map((j) => j.id)))
    }
  }

  return (
    <div>
      <div className="grid gap-1 pt-5">
        {jobs.map((job) => {
          const isSelected = selected.has(job.id)
          return (
            <button
              key={job.id}
              type="button"
              onClick={() => onSelectJob(job)}
              className={cn(
                'group/row flex w-full items-center gap-4 border-b border-border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                isSelected ? 'bg-accent/10' : 'hover:bg-surface-subtle',
              )}
            >
              <div className="flex shrink-0 items-center gap-3">
                <label
                  className="grid size-6 place-items-center rounded-soft focus-within:ring-2 focus-within:ring-focus"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="sr-only">{`Select ${job.title}`}</span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => toggleRow(job.id)}
                  />
                  {isSelected ? (
                    <Check aria-hidden="true" className="size-3.5 text-accent" />
                  ) : (
                    <>
                      <FileText aria-hidden="true" className="size-3.5 text-ink-muted group-hover/row:hidden" />
                      <span aria-hidden="true" className="hidden size-3.5 rounded border border-ink-muted group-hover/row:block" />
                    </>
                  )}
                </label>
                <span
                  className={cn(
                    'grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold',
                    job.company.toLowerCase().includes('stripe') ? 'bg-accent-subtle text-accent-text' : 'bg-danger-surface text-danger',
                  )}
                >
                  {job.company.slice(0, 2).toUpperCase()}
                </span>
              </div>
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
          )
        })}
      </div>
      {selected.size > 0 ? (
        <div className="flex items-center justify-between border-t border-border bg-accent/10 px-6 py-3">
          <span className="text-sm font-semibold text-ink">{selected.size} job{selected.size > 1 ? 's' : ''} selected</span>
          <div className="flex items-center gap-3">
            <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Download aria-hidden="true" className="size-4" />
              Export
            </button>
            <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Mail aria-hidden="true" className="size-4" />
              Email
            </button>
            <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-danger bg-danger-surface px-4 text-sm font-medium text-danger transition-colors hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Trash2 aria-hidden="true" className="size-4" />
              Delete
            </button>
          </div>
        </div>
      ) : null}
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
