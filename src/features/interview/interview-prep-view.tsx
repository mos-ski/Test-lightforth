import { useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  BarChart3,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  MessageSquare,
  Mic,
  Minus,
  Play,
  Plus,
  Search,
  Signal,
  Sparkles,
  Upload,
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
import { cn, TextField } from '@/ui'

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
    <header className="flex min-h-14 items-center justify-between border-b border-border bg-surface px-4 text-sm">
      <nav aria-label="Breadcrumb" className="flex items-center gap-3 font-semibold text-ink">
        <a href={homeHref} className="inline-flex min-h-11 items-center gap-2 rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <Home aria-hidden="true" className="size-4" />
          Go Home
        </a>
        <ChevronRight aria-hidden="true" className="size-4 text-muted" />
        <span aria-current="page">{current}</span>
      </nav>
      <div className="flex items-center gap-4">
        {historyHref ? (
          <a href={historyHref} className="hidden min-h-11 items-center gap-2 rounded-soft px-2 font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:inline-flex">
            <FileText aria-hidden="true" className="size-4" />
            History
          </a>
        ) : null}
        <a href={homeHref} aria-label="Close interview prep" className="grid size-11 place-items-center rounded-soft text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <X aria-hidden="true" className="size-4" />
        </a>
      </div>
    </header>
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
          <div className="flex min-h-[48rem] flex-col items-center justify-center">
            <h1 className="text-lg font-semibold">Upload a resume</h1>
            <div className="mt-4 w-full max-w-lg rounded-panel border border-border bg-surface px-6 py-4 text-center">
              <div className="mx-auto grid size-10 place-items-center rounded-lg border border-border bg-surface-raised shadow-control">
                <Upload aria-hidden="true" className="size-5 text-ink-muted" />
              </div>
              <p className="mt-3 text-sm text-ink-muted">
                <a href={configureHref} className="font-semibold text-accent-text underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  Click to upload
                </a>{' '}
                or drag and drop
              </p>
              <p className="mt-1 text-xs text-ink-muted">PDF, DOC, DOCX or TXT</p>
            </div>
            <div className="mt-0 w-full max-w-xs rounded-lg border border-focus bg-surface shadow-panel">
              <a href={configureHref} className="flex min-h-11 items-center gap-3 px-3 text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <Upload aria-hidden="true" className="size-4 text-ink-muted" />
                Upload a Resume
              </a>
              <a href={configureHref} className="flex min-h-11 items-center gap-3 px-3 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <Sparkles aria-hidden="true" className="size-4 text-accent" />
                Use Lightforth Resume
              </a>
            </div>
            <a href={historyHref} className="mt-6 text-sm font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              View interview history
            </a>
          </div>
        </PaperShell>
      </section>
    </Workspace>
  )
}

export function InterviewConfigureView({ homeHref, uploadHref, voiceHref, session }: InterviewConfigureViewProps) {
  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <section className="px-4 py-9">
        <form className="mx-auto w-full max-w-lg border border-border bg-surface shadow-control">
          <div className="flex items-center justify-center gap-2 border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Configure your interview</h1>
            <span className="text-sm text-muted">1/2</span>
          </div>
          <div className="mx-auto flex w-[calc(100%-4rem)] items-center justify-between rounded-b-lg bg-accent-subtle px-4 py-1.5 text-xs text-ink-muted">
            <span className="inline-flex min-w-0 items-center gap-2">
              <FileText aria-hidden="true" className="size-4 text-danger" />
              <span className="truncate">{session.uploadedFileName}</span>
            </span>
            <a href={uploadHref} className="font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              Change
            </a>
          </div>
          <div className="grid gap-4 p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField id="interview-type" label="Interview type" defaultValue="Introductory" />
              <TextField id="interview-difficulty" label="Difficulty" defaultValue="Medium" />
              <TextField id="target-role" label="Target Role" defaultValue={session.targetRole} />
              <TextField id="interview-company" label="Company Name" defaultValue={session.companyName} />
            </div>
            <section aria-labelledby="interview-documents-title" className="grid gap-2">
              <div className="flex items-center justify-between">
                <h2 id="interview-documents-title" className="text-sm font-medium">
                  Documents <span className="font-normal text-ink-muted">(optional)</span>
                </h2>
                <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <Plus aria-hidden="true" className="size-4" />
                  Add Documents
                </button>
              </div>
              <div className="rounded-lg border border-dashed border-border bg-surface-subtle px-4 py-6 text-center text-sm text-ink-muted">
                Add context, notes, or other docs
              </div>
            </section>
            <label className="grid gap-1.5 text-sm font-medium text-ink">
              Additional context
              <textarea
                className="min-h-40 rounded-lg border border-input bg-surface px-3 py-3 text-sm text-ink shadow-control outline-none placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus"
                defaultValue={session.additionalContext}
              />
            </label>
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text">
                <Sparkles aria-hidden="true" className="size-4" />
                AI Suggestion
              </span>
            </div>
          </div>
          <FooterActions backHref={uploadHref} continueHref={voiceHref} continueLabel="Continue" />
        </form>
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
        <form className="mx-auto w-full max-w-3xl border border-border bg-surface shadow-control">
          <div className="flex items-center justify-center gap-2 border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Choose interviewer voice</h1>
            <span className="text-sm text-muted">2/2</span>
          </div>
          <div className="grid gap-4 p-8 sm:grid-cols-2 lg:grid-cols-3">
            {voices.map((voice) => (
              <label
                key={voice.id}
                className={cn(
                  'grid cursor-pointer gap-4 rounded-panel border bg-surface p-4 shadow-control transition-colors focus-within:ring-2 focus-within:ring-focus',
                  selectedVoiceId === voice.id ? 'border-focus bg-accent-subtle' : 'border-border hover:bg-surface-subtle',
                )}
              >
                <input
                  type="radio"
                  name="interviewer"
                  className="sr-only"
                  checked={selectedVoiceId === voice.id}
                  onChange={() => setSelectedVoiceId(voice.id)}
                />
                <span className="flex items-start justify-between gap-3">
                  <img src={voice.imageSrc} alt="" className="size-16 rounded-full object-cover" />
                  <span className={cn('grid size-5 place-items-center rounded-full border', selectedVoiceId === voice.id ? 'border-accent bg-accent text-on-accent' : 'border-border text-muted')}>
                    {selectedVoiceId === voice.id ? <Check aria-hidden="true" className="size-3" /> : null}
                  </span>
                </span>
                <span>
                  <span className="block text-base font-semibold text-ink">{voice.name}</span>
                  <span className="mt-1 block text-sm font-medium text-ink-muted">{voice.title}</span>
                  <span className="mt-3 block text-sm leading-6 text-ink-muted">{voice.summary}</span>
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
    <figure className="relative min-h-64 overflow-hidden rounded-panel bg-surface-subtle shadow-panel">
      <img src={participant.imageSrc} alt="" className="absolute inset-0 size-full object-cover" />
      <figcaption className="absolute inset-x-4 bottom-4 rounded-lg bg-overlay px-4 py-3 text-brand-bar-text">
        <p className="font-semibold">{participant.name}</p>
        <p className="text-sm opacity-90">{participant.title}</p>
        <p className="mt-1 text-xs opacity-80">{participant.label}</p>
      </figcaption>
    </figure>
  )
}

export function InterviewSessionView({ voiceHref, completeHref, session }: InterviewSessionViewProps) {
  return (
    <main className="min-h-screen bg-brand-bar text-brand-bar-text">
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-accent px-4">
        <div className="flex min-w-0 items-center gap-3">
          <a href={voiceHref} aria-label="Back to interviewer voices" className="grid size-11 place-items-center rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ArrowLeft aria-hidden="true" className="size-5" />
          </a>
          <h1 className="truncate text-base font-semibold sm:text-lg">{session.title}</h1>
          <span className="rounded-full bg-surface px-3 py-1 text-sm font-semibold text-ink">{session.timer}</span>
        </div>
        <a href={completeHref} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-danger px-4 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          End Session
        </a>
      </header>
      <section className="grid min-h-[calc(100vh-4rem)] gap-4 p-4 xl:grid-cols-[1fr_24rem]">
        <div className="rounded-panel border border-accent bg-brand-bar p-4 shadow-panel">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold">
              <span className="size-2 rounded-full bg-danger" />
              Live Simulator
            </h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-positive-surface px-3 py-1 font-semibold text-positive">
                <Signal aria-hidden="true" className="size-4" />
                {session.signalLabel}
              </span>
              <span className="text-brand-bar-text">{session.activityLabel}</span>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ParticipantCard participant={session.interviewer} />
            <ParticipantCard participant={session.candidate} />
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button type="button" aria-label="Mute microphone" className="grid size-12 place-items-center rounded-full bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Mic aria-hidden="true" className="size-5" />
            </button>
            <button type="button" aria-label="Open chat" className="grid size-12 place-items-center rounded-full bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <MessageSquare aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
        <aside className="rounded-panel border border-border bg-surface p-4 text-ink shadow-panel">
          <h2 className="text-lg font-semibold">Chat</h2>
          <div className="mt-4 grid gap-3">
            {session.chatMessages.map((message) => (
              <article key={message.id} className={cn('rounded-panel p-3 text-sm leading-6', message.author === 'candidate' ? 'bg-accent-subtle text-ink' : 'bg-surface-subtle text-ink-muted')}>
                <p>{message.text}</p>
                {message.author === 'candidate' ? (
                  <button type="button" className="mt-2 min-h-11 rounded-soft px-1 text-sm font-semibold text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    Show more
                  </button>
                ) : null}
              </article>
            ))}
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
      <section className="px-4 py-9">
        <form className="mx-auto w-full max-w-lg border border-border bg-surface shadow-control">
          <div className="grid gap-5 p-8 text-center">
            <h1 className="text-2xl font-semibold">Your Interview is complete!</h1>
            <p className="text-sm leading-6 text-ink-muted">Thank you for completing your AI interview with Your Favorite Company.</p>
            <p className="rounded-panel bg-surface-subtle px-4 py-5 text-sm leading-6 text-ink-muted">
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
            <span className="text-sm text-muted">1/2</span>
          </div>
          <div className="grid gap-4 p-8">
            <div className="grid gap-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <span className={cn('grid size-8 place-items-center rounded-full', step.status === 'complete' ? 'bg-positive text-on-accent' : step.status === 'active' ? 'bg-accent-subtle text-accent-text' : 'bg-surface-subtle text-muted')}>
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
        <article className="mx-auto min-h-[54rem] max-w-7xl bg-surface shadow-panel">
          <div className="border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Past Resumes</h1>
          </div>
          <div className="p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <label className="relative w-full max-w-sm">
                <span className="sr-only">Search interview history</span>
                <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input className="min-h-11 w-full rounded-lg border border-input bg-surface ps-10 pe-3 text-sm text-ink shadow-control outline-none placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus" placeholder="Search" />
              </label>
              <a href={createHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <Plus aria-hidden="true" className="size-4" />
                Create New
              </a>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[58rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle text-start text-ink-muted">
                    <th className="w-12 px-3 py-3 text-start font-semibold"><span className="sr-only">Select</span></th>
                    <th className="px-3 py-3 text-start font-semibold">Title</th>
                    <th className="px-3 py-3 text-start font-semibold">ATS Score</th>
                    <th className="px-3 py-3 text-start font-semibold">Company</th>
                    <th className="px-3 py-3 text-start font-semibold">Duration</th>
                    <th className="px-3 py-3 text-start font-semibold">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-border">
                      <td className="px-3 py-3">
                        <label className="grid size-11 place-items-center rounded-soft focus-within:ring-2 focus-within:ring-focus">
                          <span className="sr-only">{`Select ${row.title}`}</span>
                          <input type="checkbox" className="size-4 rounded border-input text-accent focus:ring-focus" />
                        </label>
                      </td>
                      <td className="px-3 py-3 font-medium">{row.title}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-positive-surface px-3 py-1 text-xs font-bold text-positive">{row.score}</span>
                      </td>
                      <td className="px-3 py-3">{row.company}</td>
                      <td className="px-3 py-3">{row.duration}</td>
                      <td className="px-3 py-3">{row.dateTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-6 text-sm font-medium">
              <p>Showing items 1 - 10 of 146</p>
              <div className="inline-flex items-center gap-4">
                <ChevronLeft aria-hidden="true" className="size-4" />
                <span>1</span>
                <ChevronRight aria-hidden="true" className="size-4" />
              </div>
            </div>
          </div>
        </article>
      </section>
    </Workspace>
  )
}

function MetricRow({ metric }: { readonly metric: InterviewReport['metrics'][number] }) {
  return (
    <article className="border-t border-border pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">{metric.label}</h3>
          <p className="mt-1 text-sm text-ink-muted">{metric.note}</p>
        </div>
        <p className="text-sm text-ink-muted">Interviewer: {metric.interviewerScore}%</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface-subtle">
        <div className="h-full rounded-full bg-accent" style={{ inlineSize: `${metric.score}%` }} />
      </div>
    </article>
  )
}

export function InterviewReportView({ homeHref, scenariosHref, practiceHref, report }: InterviewReportViewProps) {
  return (
    <Workspace>
      <InterviewHeader homeHref={homeHref} current="Interview Prep" />
      <div className="flex justify-end px-3 py-2">
        <div className="inline-flex min-h-8 items-center gap-2 rounded-full border border-border bg-surface px-3 text-xs font-medium text-ink-muted shadow-control">
          <Minus aria-hidden="true" className="size-3" />
          85%
          <Plus aria-hidden="true" className="size-3" />
        </div>
      </div>
      <section className="px-4 pb-12">
        <article className="mx-auto max-w-6xl bg-surface p-6 shadow-panel sm:p-8">
          <a href={scenariosHref} className="inline-flex min-h-11 items-center gap-2 rounded-soft text-sm font-semibold text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Scenarios
          </a>
          <header className="mt-6 flex flex-col gap-4 rounded-panel border border-border p-5 shadow-control sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img src={report.interviewerImageSrc} alt="" className="size-16 rounded-full border-2 border-border object-cover shadow-control" />
              <div>
                <h1 className="text-2xl font-bold">{report.title}</h1>
                <p className="mt-1 text-sm text-ink-muted">{report.subtitle}</p>
              </div>
            </div>
            <a href={practiceHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Play aria-hidden="true" className="size-4" />
              Practice Again
            </a>
          </header>
          <section className="mt-6 flex flex-col gap-5 rounded-panel border border-border p-5 shadow-control sm:flex-row sm:items-center">
            <div className="grid size-28 shrink-0 place-items-center rounded-full border-8 border-positive-surface bg-positive-surface text-4xl font-black text-positive">{report.score}</div>
            <div>
              <h2 className="text-lg font-bold">Overall Summary</h2>
              <p className="mt-2 text-sm leading-7 text-ink-muted">{report.summary}</p>
            </div>
          </section>
          <section className="mt-6 rounded-panel border border-border p-5 shadow-control">
            <h2 className="inline-flex items-center gap-2 text-lg font-bold">
              <BarChart3 aria-hidden="true" className="size-5 text-accent" />
              Post-Interview Scorecard
            </h2>
            <div className="mt-5 grid gap-5">
              {report.metrics.map((metric) => (
                <MetricRow key={metric.id} metric={metric} />
              ))}
            </div>
            <section className="mt-8">
              <h2 className="font-bold">Call Recording</h2>
              <div className="mt-3 flex items-center gap-3 rounded-panel border border-border bg-surface-subtle p-3">
                <button type="button" aria-label="Play recording" className="grid size-10 place-items-center rounded-lg bg-accent text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <Play aria-hidden="true" className="size-4" />
                </button>
                <span className="font-mono text-sm text-ink-muted">0:00</span>
                <div className="h-1.5 flex-1 rounded-full bg-border">
                  <div className="h-full w-1/3 rounded-full bg-accent" />
                </div>
                <ChevronDown aria-hidden="true" className="size-4 text-muted" />
              </div>
            </section>
          </section>
          <section className="mt-6 rounded-panel border border-border p-5 shadow-control">
            <h2 className="inline-flex items-center gap-2 font-bold">
              <MessageSquare aria-hidden="true" className="size-4 text-accent" />
              Transcript
            </h2>
            <div className="mt-4 grid gap-3">
              {report.transcript.map((entry) => (
                <article key={entry.id} className="rounded-panel bg-surface-subtle p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={cn('text-xs font-bold', entry.speaker === 'You' ? 'text-accent-text' : 'text-ink')}>{entry.speaker}</h3>
                    <p className="font-mono text-xs text-muted">{entry.timestamp}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{entry.text}</p>
                </article>
              ))}
            </div>
          </section>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={scenariosHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface-subtle px-4 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to Scenarios
            </a>
            <a href={practiceHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Play aria-hidden="true" className="size-4" />
              Try Again
            </a>
          </div>
        </article>
      </section>
    </Workspace>
  )
}
