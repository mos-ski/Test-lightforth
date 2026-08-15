import { useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  BarChart3,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageSquare,
  Mic,
  Minus,
  Play,
  Plus,
  Search,
  Volume2,
  X,
} from 'lucide-react'

import type {
  InterviewHistoryRow,
  InterviewLiveSession,
  InterviewPrepSession,
  InterviewReport,
  InterviewReportStep,
  InterviewerVoice,
} from '@/contracts/interview.draft'
import { AiSuggestionAction, cn, DataTable, DocumentDropAction, FormField, FormPanel, FormPanelFooter, FormSelectField, FormTextArea, ShellBar, SourcePicker } from '@/ui'

export type InterviewUploadViewProps = {
  readonly homeHref: string
  readonly configureHref: string
  readonly historyHref: string
}

export type InterviewConfigureViewProps = {
  readonly homeHref: string
  readonly uploadHref: string
  readonly voiceHref: string
  readonly session: InterviewPrepSession
}

export type InterviewVoiceViewProps = {
  readonly homeHref: string
  readonly configureHref: string
  readonly sessionHref: string
  readonly voices: readonly InterviewerVoice[]
}

export type InterviewSessionViewProps = {
  readonly voiceHref: string
  readonly completeHref: string
  readonly session: InterviewLiveSession
  readonly isLoading?: boolean
}

export type InterviewCompleteViewProps = {
  readonly homeHref: string
  readonly sessionHref: string
  readonly preparingReportHref: string
}

export type InterviewPreparingReportViewProps = {
  readonly homeHref: string
  readonly completeHref: string
  readonly reportHref: string
  readonly steps: readonly InterviewReportStep[]
}

export type InterviewHistoryViewProps = {
  readonly homeHref: string
  readonly createHref: string
  readonly rows: readonly InterviewHistoryRow[]
}

export type InterviewReportViewProps = {
  readonly homeHref: string
  readonly scenariosHref: string
  readonly practiceHref: string
  readonly report: InterviewReport
  readonly isLoading?: boolean
}

function InterviewHeader({
  homeHref,
  current,
  historyHref,
}: {
  readonly homeHref: string
  readonly current: string
  readonly historyHref?: string
}) {
  return (
    <ShellBar
      homeHref={homeHref}
      current={current}
      closeHref={homeHref}
      closeLabel="Close interview prep"
      secondaryAction={historyHref ? { label: 'History', href: historyHref, iconSrc: '/v3-assets/figma/topnav-history.svg' } : undefined}
    />
  )
}

function Workspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

function PaperShell({ children, label = 'Interview prep workspace' }: { readonly children: ReactNode; readonly label?: string }) {
  return (
    <article className="mx-auto min-h-[56rem] w-full max-w-[44rem] bg-surface p-8 shadow-panel" aria-label={label}>
      {children}
    </article>
  )
}

function FooterActions({
  backHref,
  continueHref,
  continueLabel,
}: {
  readonly backHref: string
  readonly continueHref: string
  readonly continueLabel: string
}) {
  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-4">
      <a href={backHref} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back
      </a>
      <a href={continueHref} className="inline-flex min-h-11 min-w-36 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        {continueLabel}
      </a>
    </div>
  )
}

export function InterviewUploadView({ homeHref, configureHref, historyHref }: InterviewUploadViewProps) {
  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" historyHref={historyHref} />
      <section className="px-4 py-8 lg:py-10">
        <PaperShell>
          <SourcePicker
            title="Upload a resume"
            actionLabel="Click to upload"
            idleText="or drag and drop"
            meta="PDF, DOC, DOCX or TXT"
            options={[
              { label: 'Upload a Resume', href: configureHref, iconSrc: '/v3-assets/figma/upload-option-upload.svg' },
              { label: 'Use Lightforth Resume', href: configureHref, iconSrc: '/v3-assets/figma/upload-option-lightforth.svg', emphasis: 'strong' },
            ]}
            historyLink={{ label: 'View interview history', href: historyHref }}
          />
        </PaperShell>
      </section>
    </Workspace>
  )
}

const INTERVIEW_AI_SUGGESTION =
  ' Ask the interviewer how success is measured in the first 90 days, and be ready to walk through one metric you personally moved.'

export function InterviewConfigureView({ homeHref, uploadHref, voiceHref, session }: InterviewConfigureViewProps) {
  const [additionalContext, setAdditionalContext] = useState(session.additionalContext)

  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <section className="px-4 py-9">
        <FormPanel
          title="Configure your interview"
          step="1/2"
          uploadedFile={{ fileName: session.uploadedFileName, changeHref: uploadHref }}
          footer={<FormPanelFooter backHref={uploadHref} nextHref={voiceHref} />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
              <FormSelectField
                id="interview-type"
                label="Interview type"
                defaultValue="introductory"
                options={[
                  { label: 'Introductory', value: 'introductory' },
                  { label: 'Behavioral', value: 'behavioral' },
                  { label: 'Product case', value: 'product-case' },
                ]}
              />
              <FormSelectField
                id="interview-difficulty"
                label="Difficulty"
                defaultValue="medium"
                options={[
                  { label: 'Easy', value: 'easy' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Hard', value: 'hard' },
                ]}
              />
              <FormField id="target-role" label="Target Role" defaultValue={session.targetRole} />
              <FormField id="interview-company" label="Company Name" defaultValue={session.companyName} />
          </div>
          <DocumentDropAction actionHref="/v3/documents/add" />
          <FormTextArea
            id="interview-additional-context"
            label="Additional context"
            value={additionalContext}
            onChange={(event) => setAdditionalContext(event.target.value)}
          />
          <AiSuggestionAction onClick={() => setAdditionalContext((prev) => `${prev}${INTERVIEW_AI_SUGGESTION}`)} />
        </FormPanel>
      </section>
    </Workspace>
  )
}

export function InterviewVoiceView({ homeHref, configureHref, sessionHref, voices }: InterviewVoiceViewProps) {
  const initiallySelected = voices.find((voice) => voice.selected)?.id ?? voices[0]?.id
  const [selectedVoiceId, setSelectedVoiceId] = useState(initiallySelected)

  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <section className="px-4 py-9">
        <form className="mx-auto w-full max-w-[846px] border border-border bg-surface shadow-control">
          <div className="flex items-center justify-center gap-2 border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Choose interviewer voice</h1>
            <span className="text-sm text-ink-muted">2/2</span>
          </div>
          <div className="grid gap-x-6 gap-y-5 px-12 py-10 sm:grid-cols-2 lg:grid-cols-3">
            {voices.map((voice) => (
              <label
                key={voice.id}
                className={cn(
                  'group grid cursor-pointer gap-4 focus-within:ring-2 focus-within:ring-focus',
                  selectedVoiceId === voice.id ? 'text-ink' : 'text-ink',
                )}
              >
                <input
                  type="radio"
                  name="interviewer"
                  className="sr-only"
                  checked={selectedVoiceId === voice.id}
                  onChange={() => setSelectedVoiceId(voice.id)}
                />
                <span className="relative block aspect-square w-full overflow-hidden bg-surface-subtle">
                  <img src={voice.imageSrc} alt="" className="absolute inset-0 size-full object-cover" />
                  {selectedVoiceId === voice.id ? (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="absolute inset-0 bg-accent opacity-85" />
                      <span className="relative rounded bg-overlay px-3 py-1 text-sm font-semibold text-on-danger">selected</span>
                    </span>
                  ) : null}
                </span>
                <span className="grid gap-2">
                  <span>
                    <span className="block text-base font-bold leading-5 text-ink">{voice.name}</span>
                    <span className="mt-1 block text-sm font-medium leading-5 text-accent-text">{voice.title}</span>
                  </span>
                  <span className="block text-sm leading-5 text-ink-muted">{voice.summary}</span>
                </span>
              </label>
            ))}
          </div>
          <FooterActions backHref={configureHref} continueHref={sessionHref} continueLabel="Start Interview" />
        </form>
      </section>
    </Workspace>
  )
}

function ParticipantCard({ participant }: { readonly participant: InterviewLiveSession['interviewer'] }) {
  return (
    <figure className="grid w-[13rem] max-w-full gap-[18px] text-brand-bar-text">
      <div className={cn('relative aspect-[208/222] w-full overflow-hidden', participant.label.includes('You') ? 'bg-[var(--lf-live-avatar-warm)]' : 'bg-[var(--lf-live-avatar-neutral)]')}>
        <img src={participant.imageSrc} alt="" className="absolute inset-0 size-full object-cover" />
        <figcaption className="absolute inset-x-3 bottom-3 inline-flex min-h-7 items-center gap-2 bg-[var(--lf-live-scrim)] px-2.5 py-1.5">
          {participant.label.includes('You') ? <Mic aria-hidden="true" className="size-3.5 text-positive" /> : <Volume2 aria-hidden="true" className="size-3.5" />}
          <span className="truncate text-xs font-semibold leading-4">{participant.label}</span>
        </figcaption>
      </div>
      <figcaption className="grid gap-0.5">
        <p className="truncate text-[15px] font-semibold leading-[22px]">{participant.name}</p>
        <p className="truncate text-[13.5px] leading-[21px] text-accent-text">{participant.title}</p>
      </figcaption>
    </figure>
  )
}

function LoadingBar({ className }: { readonly className?: string }) {
  return <span aria-hidden="true" className={cn('block animate-pulse rounded-lg bg-surface-subtle motion-reduce:animate-none', className)} />
}

function LiveLoadingBar({ className }: { readonly className?: string }) {
  return <span aria-hidden="true" className={cn('block animate-pulse rounded-lg bg-[var(--lf-live-message)] motion-reduce:animate-none', className)} />
}

function SignalStrength({ label }: { readonly label: string }) {
  return (
    <div className="flex items-end gap-1 text-positive" aria-label={label}>
      <span aria-hidden="true" className="h-1.5 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-2 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-3 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-4 w-1 rounded-soft bg-positive" />
    </div>
  )
}

function InterviewSessionLoadingView() {
  return (
    <main className="min-h-screen bg-[var(--lf-live-canvas)] text-brand-bar-text">
      <div role="status" aria-label="Loading live interview session" className="sr-only">
        Loading live interview session
      </div>
      <header className="flex min-h-[57px] items-center justify-between border-b border-[var(--lf-live-border)] bg-[var(--lf-live-header)] px-5 py-3">
        <LiveLoadingBar className="h-5 w-56 max-w-[55vw]" />
        <LiveLoadingBar className="h-9 w-32" />
      </header>
      <div className="flex min-h-10 items-center bg-[var(--lf-live-strip)] px-5">
        <LiveLoadingBar className="h-5 w-36" />
      </div>
      <section className="grid gap-3 p-3 xl:grid-cols-[minmax(0,1fr)_28.5rem]">
        <div className="min-h-[38rem] overflow-hidden rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
          <div className="flex min-h-[57px] items-center border-b border-[var(--lf-live-border)] px-4 py-3">
            <LiveLoadingBar className="h-5 w-36" />
          </div>
          <div className="p-5">
            <div className="grid min-h-[32rem] place-items-center xl:h-[calc(100vh-16.8125rem)]">
              <div className="grid gap-6 sm:grid-cols-2">
                <LiveLoadingBar className="h-72 w-52 rounded-none" />
                <LiveLoadingBar className="h-72 w-52 rounded-none" />
              </div>
            </div>
          </div>
        </div>
        <aside className="min-h-[32rem] rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
          <div className="flex min-h-[57px] items-center border-b border-[var(--lf-live-border)] px-4 py-3">
            <LiveLoadingBar className="h-5 w-20" />
          </div>
          <div className="grid gap-4 p-6">
            <LiveLoadingBar className="ms-auto h-32 w-72 max-w-full" />
            <LiveLoadingBar className="h-28 w-72 max-w-full" />
          </div>
        </aside>
      </section>
    </main>
  )
}

export function InterviewSessionView({ voiceHref, completeHref, session, isLoading = false }: InterviewSessionViewProps) {
  const [expandedMessageIds, setExpandedMessageIds] = useState<readonly string[]>([])

  if (isLoading) {
    return <InterviewSessionLoadingView />
  }

  function toggleExpanded(id: string) {
    setExpandedMessageIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <main className="min-h-screen bg-[var(--lf-live-canvas)] text-brand-bar-text">
      <header className="flex min-h-[57px] flex-wrap items-center justify-between gap-3 border-b border-[var(--lf-live-border)] bg-[var(--lf-live-header)] px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <a href={voiceHref} aria-label="Back to interviewer voices" className="grid size-7 shrink-0 place-items-center rounded-soft text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ArrowLeft aria-hidden="true" className="size-4" />
          </a>
          <h1 className="truncate text-sm font-medium leading-5">{session.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium leading-5 text-ink-muted">{session.timer}</span>
          <a href={completeHref} className="inline-flex min-h-9 items-center justify-center rounded-lg bg-danger px-4 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            End Session
          </a>
        </div>
      </header>
      <div className="flex min-h-10 items-center border-b border-[var(--lf-live-border)] bg-[var(--lf-live-strip)] px-5">
        <div className="flex items-center gap-4">
          <SignalStrength label={session.signalLabel} />
          <span className="text-sm font-medium leading-5 text-positive">{session.signalLabel}</span>
          <span className="text-sm italic leading-5 text-ink-muted">{session.activityLabel}</span>
        </div>
      </div>
      <section className="grid gap-3 p-3 xl:grid-cols-[minmax(0,1fr)_28.5rem]">
        <section className="min-w-0 overflow-hidden rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
          <div className="flex min-h-[57px] items-center justify-between border-b border-[var(--lf-live-border)] px-4 py-3">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold leading-5">
              Live Simulator
              <span className="size-2 rounded-pill bg-danger" />
            </h2>
          </div>
          <div className="p-5">
            <div className="grid min-h-[32rem] place-items-center sm:min-h-[40rem] xl:h-[calc(100vh-16.8125rem)] xl:min-h-0">
              <div className="grid w-full justify-center gap-6 sm:w-auto sm:grid-cols-2">
                <ParticipantCard participant={session.interviewer} />
                <ParticipantCard participant={session.candidate} />
              </div>
            </div>
          </div>
        </section>
        <aside className="min-h-[32rem] rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)] xl:min-h-[calc(100vh-10.25rem)]">
          <div className="flex min-h-[57px] items-center justify-between border-b border-[var(--lf-live-border)] px-4 py-3">
            <h2 className="text-sm font-medium leading-5">Chat</h2>
            <button type="button" aria-label="Expand chat" className="grid size-8 place-items-center rounded-soft text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Maximize2 aria-hidden="true" className="size-4" />
            </button>
          </div>
          <div className="grid gap-3 p-4 sm:p-7">
            {session.chatMessages.map((message) => {
              const expanded = expandedMessageIds.includes(message.id)
              const isLong = message.text.length > 120
              return (
                <article
                  key={message.id}
                  className={cn(
                    'max-w-[16.75rem] overflow-hidden text-sm leading-[22.75px] text-brand-bar-text shadow-control',
                    message.author === 'candidate' ? 'ms-auto rounded-bl-[16px] rounded-br-sm rounded-tl-[16px] rounded-tr-[16px] bg-accent' : 'rounded-bl-sm rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] bg-[var(--lf-live-message)]',
                  )}
                >
                  <p className={cn('px-3.5 py-2.5', !expanded && isLong ? 'line-clamp-3' : undefined)}>{message.text}</p>
                  {message.author === 'candidate' && isLong ? (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(message.id)}
                      className="flex min-h-7 w-full items-center justify-center gap-1 border-t border-[var(--lf-live-border)] px-3 text-xs font-semibold text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      <ChevronDown aria-hidden="true" className={cn('size-3 transition-transform', expanded ? 'rotate-180' : undefined)} />
                      <span>{expanded ? 'Show less' : 'Show more'}</span>
                    </button>
                  ) : null}
                </article>
              )
            })}
          </div>
        </aside>
      </section>
    </main>
  )
}

export function InterviewCompleteView({ homeHref, sessionHref, preparingReportHref }: InterviewCompleteViewProps) {
  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <section className="px-4 py-12">
        <form className="mx-auto w-full max-w-xl border border-border bg-surface shadow-control">
          <div className="grid gap-5 px-8 py-10 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-positive-surface text-positive">
              <Check aria-hidden="true" className="size-8" />
            </span>
            <h1 className="text-2xl font-bold leading-8">Your Interview is complete!</h1>
            <p className="mx-auto max-w-md text-sm leading-6 text-ink-muted">Thank you for completing your AI interview with Your Favorite Company.</p>
            <p className="mx-auto max-w-md rounded-panel bg-surface-subtle px-5 py-5 text-sm leading-6 text-ink-muted">
              Your responses have been recorded and evaluated by Lightforth AI. Review the coaching report for your strengths, gaps, transcript, and next practice step.
            </p>
          </div>
          <FooterActions backHref={sessionHref} continueHref={preparingReportHref} continueLabel="See Report" />
        </form>
      </section>
    </Workspace>
  )
}

export function InterviewPreparingReportView({ homeHref, completeHref, reportHref, steps }: InterviewPreparingReportViewProps) {
  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <section className="px-4 py-12">
        <form className="mx-auto w-full max-w-lg border border-border bg-surface shadow-control">
          <div className="flex items-center justify-center gap-2 border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Preparing your coaching report...</h1>
            <span className="text-sm text-ink-muted">1/2</span>
          </div>
          <div className="grid gap-4 p-8">
            <div className="grid gap-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <span className={cn('grid size-8 place-items-center rounded-full', step.status === 'complete' ? 'bg-positive text-on-accent' : step.status === 'active' ? 'bg-accent-subtle text-accent-text' : 'bg-surface-subtle text-ink-muted')}>
                    {step.status === 'complete' ? <Check aria-hidden="true" className="size-4" /> : <span className={cn('size-2.5 rounded-full', step.status === 'active' ? 'bg-accent' : 'bg-muted')} />}
                  </span>
                  <span className="text-sm font-semibold">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 grid gap-3">
              <div className="h-20 rounded-panel bg-surface-subtle" />
              <div className="h-28 rounded-panel bg-surface-subtle" />
              <div className="h-16 rounded-panel bg-surface-subtle" />
            </div>
          </div>
          <FooterActions backHref={completeHref} continueHref={reportHref} continueLabel="Continue" />
        </form>
      </section>
    </Workspace>
  )
}

export function InterviewHistoryView({ homeHref, createHref, rows }: InterviewHistoryViewProps) {
  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="History" />
      <section className="px-4 py-8 lg:px-12 xl:px-24">
        <DataTable
          title="Past Interviews"
          searchLabel="Search interview history"
          action={{ label: 'Create New', href: createHref }}
          rows={rows}
          itemLabel={(row) => row.title}
          className="mx-auto max-w-7xl"
          columns={[
            { key: 'title', label: 'Title', className: 'w-[18rem]', render: (row) => <span className="font-medium">{row.title}</span> },
            {
              key: 'score',
              label: 'Score',
              className: 'w-[9rem]',
              render: (row) => <span className="rounded-pill bg-positive-surface px-2.5 py-0.5 text-xs font-bold leading-4 text-positive">{row.score}</span>,
            },
            { key: 'company', label: 'Company', className: 'w-[13rem]', render: (row) => row.company },
            { key: 'duration', label: 'Duration', className: 'w-[8rem]', render: (row) => row.duration },
            { key: 'date-time', label: 'Date & Time', className: 'w-[16rem]', render: (row) => row.dateTime },
          ]}
        />
      </section>
    </Workspace>
  )
}

function MetricRow({ metric }: { readonly metric: InterviewReport['metrics'][number] }) {
  return (
    <article className="border-t border-border py-6 first:border-t-0 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold leading-7">{metric.label}</h3>
          <p className="mt-1 text-base leading-6 text-ink-muted">{metric.note}</p>
        </div>
        <p className="text-base leading-6 text-ink-muted">Interviewer: {metric.interviewerScore}%</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface-subtle">
        <div className="h-full rounded-full bg-accent" style={{ inlineSize: `${metric.score}%` }} />
      </div>
    </article>
  )
}

function InterviewReportLoadingView({ homeHref }: { readonly homeHref: string }) {
  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <div role="status" aria-label="Loading interview report" className="sr-only">
        Loading interview report
      </div>
      <section className="px-4 py-12">
        <article className="mx-auto min-h-[82rem] w-full max-w-[81.5rem] bg-surface px-8 py-12 shadow-panel sm:px-10 lg:px-12">
          <LoadingBar className="h-6 w-40" />
          <section className="mt-8 rounded-panel border border-border px-6 py-6 shadow-control lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <LoadingBar className="size-20 rounded-pill" />
                <div className="grid gap-3">
                  <LoadingBar className="h-8 w-96 max-w-[52vw]" />
                  <LoadingBar className="h-5 w-72 max-w-[45vw]" />
                </div>
              </div>
              <LoadingBar className="h-14 w-44" />
            </div>
          </section>
          <section className="mt-6 flex flex-col gap-6 rounded-panel border border-border px-6 py-6 shadow-control sm:flex-row sm:items-center lg:px-8">
            <LoadingBar className="size-32 rounded-pill" />
            <div className="grid flex-1 gap-4">
              <LoadingBar className="h-7 w-52" />
              <LoadingBar className="h-6 w-full" />
              <LoadingBar className="h-6 w-4/5" />
            </div>
          </section>
          <section className="mt-6 rounded-panel border border-border p-6 shadow-control lg:p-8">
            <LoadingBar className="h-8 w-72" />
            <div className="mt-8 grid gap-8">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="grid gap-3 border-t border-border pt-6 first:border-t-0 first:pt-0">
                  <LoadingBar className="h-6 w-48" />
                  <LoadingBar className="h-5 w-2/3" />
                  <LoadingBar className="h-3 w-full rounded-pill" />
                </div>
              ))}
            </div>
          </section>
          <section className="mt-6 rounded-panel border border-border p-6 shadow-control lg:p-8">
            <LoadingBar className="h-7 w-36" />
            <div className="mt-5 grid gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <LoadingBar key={index} className="h-24 w-full" />
              ))}
            </div>
          </section>
        </article>
      </section>
    </Workspace>
  )
}

export function InterviewReportView({ homeHref, scenariosHref, practiceHref, report, isLoading = false }: InterviewReportViewProps) {
  if (isLoading) {
    return <InterviewReportLoadingView homeHref={homeHref} />
  }

  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <div className="sticky top-16 z-10 flex justify-end px-3 py-3">
        <div className="inline-flex min-h-10 items-center gap-3 rounded-full border border-border bg-surface px-4 text-sm font-semibold text-ink-muted shadow-control">
          <Minus aria-hidden="true" className="size-3" />
          85%
          <Plus aria-hidden="true" className="size-3" />
        </div>
      </div>
      <section className="px-4 pb-16">
        <article className="mx-auto min-h-[82rem] w-full max-w-[81.5rem] bg-surface px-8 py-12 shadow-panel sm:px-10 lg:px-12">
          <a href={scenariosHref} className="inline-flex min-h-11 items-center gap-3 rounded-soft text-base font-bold text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Scenarios
          </a>
          <header className="mt-8 flex flex-col gap-5 rounded-panel border border-border px-6 py-6 shadow-control sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div className="flex items-center gap-5">
              <img src={report.interviewerImageSrc} alt="" className="size-20 rounded-full border-2 border-border object-cover shadow-control" />
              <div>
                <h1 className="text-3xl font-bold leading-10">{report.title}</h1>
                <p className="mt-1 text-lg leading-7 text-ink-muted">{report.subtitle}</p>
              </div>
            </div>
            <a href={practiceHref} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-accent px-6 text-lg font-bold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Play aria-hidden="true" className="size-5" />
              Practice Again
            </a>
          </header>
          <section className="mt-6 flex flex-col gap-6 rounded-panel border border-border px-6 py-6 shadow-control sm:flex-row sm:items-center lg:px-8">
            <div className="grid size-32 shrink-0 place-items-center rounded-full bg-positive-surface text-5xl font-black text-positive">{report.score}</div>
            <div>
              <h2 className="text-2xl font-bold leading-8">Overall Summary</h2>
              <p className="mt-4 text-lg leading-8 text-ink-muted">{report.summary}</p>
            </div>
          </section>
          <section className="mt-6 rounded-panel border border-border shadow-control">
            <h2 className="inline-flex min-h-20 items-center gap-3 border-b border-border px-6 text-2xl font-bold leading-8 lg:px-8">
              <BarChart3 aria-hidden="true" className="size-6 text-accent" />
              Post-Interview Scorecard
            </h2>
            <div className="px-6 py-6 lg:px-8">
              {report.metrics.map((metric) => (
                <MetricRow key={metric.id} metric={metric} />
              ))}
              <section className="mt-8">
                <h2 className="text-lg font-bold leading-7">Call Recording</h2>
                <div className="mt-4 flex min-h-16 items-center gap-4 rounded-panel border border-border bg-surface-subtle p-3">
                  <button type="button" aria-label="Play recording" className="grid size-12 place-items-center rounded-lg bg-accent text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    <Play aria-hidden="true" className="size-5" />
                  </button>
                  <span className="font-mono text-base text-ink-muted">0:00</span>
                  <div className="h-1.5 flex-1 rounded-full bg-border">
                    <div className="h-full w-1/3 rounded-full bg-accent" />
                  </div>
                  <ChevronDown aria-hidden="true" className="size-5 text-ink-muted" />
                </div>
              </section>
            </div>
          </section>
          <section className="mt-6 rounded-panel border border-border p-6 shadow-control lg:p-8">
            <h2 className="inline-flex items-center gap-3 text-xl font-bold leading-8">
              <MessageSquare aria-hidden="true" className="size-5 text-accent" />
              Transcript
            </h2>
            <div className="mt-5 grid gap-3">
              {report.transcript.map((entry) => (
                <article key={entry.id} className="rounded-panel bg-surface-subtle p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={cn('text-sm font-bold', entry.speaker === 'You' ? 'text-accent-text' : 'text-ink')}>{entry.speaker}</h3>
                    <p className="font-mono text-xs text-ink-muted">{entry.timestamp}</p>
                  </div>
                  <p className="mt-3 text-lg leading-8 text-ink-muted">{entry.text}</p>
                </article>
              ))}
            </div>
          </section>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={scenariosHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-surface-subtle px-5 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to Scenarios
            </a>
            <a href={practiceHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Play aria-hidden="true" className="size-4" />
              Try Again
            </a>
          </div>
        </article>
      </section>
    </Workspace>
  )
}
