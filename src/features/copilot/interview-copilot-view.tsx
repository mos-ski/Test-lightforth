import type { ReactNode } from 'react'
import { ArrowLeft, Check, ChevronRight, FileText, Home, MessageSquare, Mic, MonitorUp, Plus, Search, Send, Settings, Sparkles, Upload, X } from 'lucide-react'

import type { CopilotHistoryRow, CopilotLiveSession, CopilotPermissionStep, CopilotResponseLength, CopilotResponseMode, CopilotSetup } from '@/contracts/copilot.draft'
import { cn, TextField } from '@/ui'

export type CopilotUploadViewProps = {
  readonly homeHref: string
  readonly configureHref: string
  readonly historyHref: string
}

export type CopilotConfigureViewProps = {
  readonly homeHref: string
  readonly uploadHref: string
  readonly preferencesHref: string
  readonly setup: CopilotSetup
}

export type CopilotPreferencesViewProps = {
  readonly homeHref: string
  readonly configureHref: string
  readonly shareHref: string
  readonly setup: CopilotSetup
}

export type CopilotPermissionViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly nextHref: string
  readonly steps: readonly CopilotPermissionStep[]
  readonly previewSrc?: string
  readonly actionLabel: string
}

export type CopilotLiveViewProps = {
  readonly completeHref: string
  readonly session: CopilotLiveSession
}

export type CopilotCompleteViewProps = {
  readonly homeHref: string
  readonly sessionHref: string
  readonly historyHref: string
}

export type CopilotHistoryViewProps = {
  readonly homeHref: string
  readonly createHref: string
  readonly rows: readonly CopilotHistoryRow[]
}

function CopilotHeader({
  homeHref,
  current = 'Interview Copilot',
  historyHref,
}: {
  readonly homeHref: string
  readonly current?: string
  readonly historyHref?: string
}) {
  return (
    <header className="flex min-h-14 items-center justify-between border-b border-border bg-surface px-4 text-sm">
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-3 font-semibold text-ink">
        <a href={homeHref} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <Home aria-hidden="true" className="size-4" />
          Go Home
        </a>
        <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted" />
        <span className="truncate" aria-current="page">{current}</span>
      </nav>
      <div className="flex items-center gap-4">
        {historyHref ? (
          <a href={historyHref} className="hidden min-h-11 items-center gap-2 rounded-soft px-2 font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:inline-flex">
            <FileText aria-hidden="true" className="size-4" />
            History
          </a>
        ) : null}
        <a href={homeHref} aria-label="Close interview copilot" className="grid size-11 place-items-center rounded-soft text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <X aria-hidden="true" className="size-4" />
        </a>
      </div>
    </header>
  )
}

function Workspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

function PaperShell({ children }: { readonly children: ReactNode }) {
  return <article className="mx-auto min-h-[56rem] w-full max-w-[44rem] bg-surface p-8 shadow-panel">{children}</article>
}

function FooterActions({ backHref, nextHref, nextLabel }: { readonly backHref: string; readonly nextHref: string; readonly nextLabel: string }) {
  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-4">
      <a href={backHref} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back
      </a>
      <a href={nextHref} className="inline-flex min-h-11 min-w-36 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        {nextLabel}
      </a>
    </div>
  )
}

export function CopilotUploadView({ homeHref, configureHref, historyHref }: CopilotUploadViewProps) {
  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} historyHref={historyHref} />
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
              <p className="mt-1 text-xs text-ink-muted">SVG, PNG, JPG or GIF (max. 800x400px)</p>
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
          </div>
        </PaperShell>
      </section>
    </Workspace>
  )
}

export function CopilotConfigureView({ homeHref, uploadHref, preferencesHref, setup }: CopilotConfigureViewProps) {
  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} />
      <section className="px-4 py-9">
        <form className="mx-auto w-full max-w-lg border border-border bg-surface shadow-control">
          <div className="flex items-center justify-center gap-2 border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Configure your interview</h1>
            <span className="text-sm text-muted">1/3</span>
          </div>
          <div className="mx-auto flex w-[calc(100%-4rem)] items-center justify-between rounded-b-lg bg-accent-subtle px-4 py-1.5 text-xs text-ink-muted">
            <span className="inline-flex min-w-0 items-center gap-2">
              <FileText aria-hidden="true" className="size-4 text-danger" />
              <span className="truncate">{setup.uploadedFileName}</span>
            </span>
            <a href={uploadHref} className="font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Change</a>
          </div>
          <div className="grid gap-4 p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField id="copilot-interview-type" label="Interview type" defaultValue={setup.interviewType} />
              <TextField id="copilot-difficulty" label="Difficulty" defaultValue={setup.difficulty} />
              <TextField id="copilot-target-role" label="Target Role" defaultValue={setup.targetRole} />
              <TextField id="copilot-company" label="Company Name" defaultValue={setup.companyName} />
            </div>
            <section className="grid gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Documents <span className="font-normal text-ink-muted">(optional)</span></h2>
                <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <Plus aria-hidden="true" className="size-4" />
                  Add Documents
                </button>
              </div>
              <div className="rounded-lg border border-dashed border-border bg-surface-subtle px-4 py-6 text-center text-sm text-ink-muted">Add context, notes, or other docs</div>
            </section>
            <label className="grid gap-1.5 text-sm font-medium text-ink">
              Additional context
              <textarea className="min-h-40 rounded-lg border border-input bg-surface px-3 py-3 text-sm text-ink shadow-control outline-none placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus" defaultValue={setup.additionalContext} />
            </label>
            <div className="flex justify-end text-sm font-semibold text-accent-text">
              <Sparkles aria-hidden="true" className="me-1 size-4" />
              AI Suggestion
            </div>
          </div>
          <FooterActions backHref={uploadHref} nextHref={preferencesHref} nextLabel="Continue" />
        </form>
      </section>
    </Workspace>
  )
}

function RadioGroup<T extends string>({ label, values, selected }: { readonly label: string; readonly values: readonly T[]; readonly selected: T }) {
  return (
    <section className="grid gap-3">
      <h2 className="text-xs font-medium text-ink-muted">{label}</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {values.map((value) => (
          <label key={value} className={cn('flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-2 px-3 text-sm font-medium focus-within:ring-2 focus-within:ring-focus', value === selected ? 'border-focus bg-accent-subtle text-accent-text' : 'border-border text-ink')}>
            <input type="radio" name={label} className="sr-only" defaultChecked={value === selected} />
            <span className={cn('grid size-4 place-items-center rounded-full border-2', value === selected ? 'border-accent' : 'border-muted')}>
              {value === selected ? <span className="size-2 rounded-full bg-accent" /> : null}
            </span>
            {value[0].toUpperCase()}{value.slice(1)}
          </label>
        ))}
      </div>
    </section>
  )
}

export function CopilotPreferencesView({ homeHref, configureHref, shareHref, setup }: CopilotPreferencesViewProps) {
  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} />
      <section className="px-4 py-9">
        <form className="mx-auto w-full max-w-lg border border-border bg-surface shadow-control">
          <div className="flex items-center justify-center gap-2 border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Set Preference</h1>
            <span className="text-sm text-muted">2/3</span>
          </div>
          <div className="grid gap-6 p-8">
            <RadioGroup<CopilotResponseMode> label="Select Response Type" values={['default', 'headlines', 'coaching']} selected={setup.responseMode} />
            <blockquote className="rounded-lg border border-border bg-surface-subtle p-4 text-sm leading-7">
              "I redesigned a <strong>vehicle maintenance app</strong> that had low engagement. Led a team to identify pain points, improved UI, and introduced a personalized dashboard. <strong>Engagement increased by 30% in 3 months</strong>, and customer satisfaction improved significantly."
            </blockquote>
            <p className="text-xs text-ink-muted">Best for candidates who want a direct, no-frills answer</p>
            <RadioGroup<CopilotResponseLength> label="Select Response Type" values={['short', 'medium', 'long']} selected={setup.responseLength} />
          </div>
          <FooterActions backHref={configureHref} nextHref={shareHref} nextLabel="Continue" />
        </form>
      </section>
    </Workspace>
  )
}

export function CopilotPermissionView({ homeHref, backHref, nextHref, steps, previewSrc, actionLabel }: CopilotPermissionViewProps) {
  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} />
      <section className="px-4 py-9">
        <form className="mx-auto w-full max-w-lg border border-border bg-surface shadow-control">
          <div className="flex items-center justify-center gap-2 border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Share your screen</h1>
            <span className="text-sm text-muted">3/3</span>
          </div>
          <div className="grid gap-7 p-8">
            {steps.map((step, index) => (
              <section key={step.id} className="grid gap-3">
                <div className="flex items-center gap-3">
                  <span className={cn('grid size-8 place-items-center rounded-full text-xs font-bold', step.status === 'complete' ? 'bg-surface-subtle text-positive' : 'bg-accent-subtle text-accent-text')}>
                    {step.status === 'complete' ? <Check aria-hidden="true" className="size-4" /> : index + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{step.title}</span>
                    <span className="block text-xs text-ink-muted">{step.description}</span>
                  </span>
                </div>
                {previewSrc && step.id === 'screen' ? <img src={previewSrc} alt="" className="h-56 w-full rounded-b-lg object-cover" /> : null}
                {step.status !== 'complete' ? (
                  <a href={nextHref} aria-disabled={step.status === 'disabled'} className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', step.status === 'disabled' ? 'pointer-events-none bg-muted text-on-accent opacity-40' : 'bg-accent text-on-accent')}>
                    {step.id === 'screen' ? <MonitorUp aria-hidden="true" className="size-4" /> : <Mic aria-hidden="true" className="size-4" />}
                    {step.actionLabel}
                  </a>
                ) : null}
              </section>
            ))}
            {previewSrc ? (
              <a href={nextHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                {actionLabel}
                <ChevronRight aria-hidden="true" className="size-4" />
              </a>
            ) : null}
          </div>
          {!previewSrc ? <FooterActions backHref={backHref} nextHref={nextHref} nextLabel="Continue" /> : null}
        </form>
      </section>
    </Workspace>
  )
}

export function CopilotLiveView({ completeHref, session }: CopilotLiveViewProps) {
  return (
    <main className="min-h-screen bg-brand-bar text-brand-bar-text">
      <header className="flex min-h-14 items-center justify-between border-b border-accent px-5">
        <h1 className="text-sm font-semibold">{session.title}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-brand-bar-text">{session.timer}</span>
          <a href={completeHref} className="inline-flex min-h-10 items-center rounded-lg bg-danger px-4 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">End Session</a>
        </div>
      </header>
      <div className="flex items-center justify-between border-b border-accent bg-brand-bar px-5 py-2 text-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-end gap-0.5 text-positive"><span className="h-1 w-1 rounded bg-positive" /><span className="h-2 w-1 rounded bg-positive" /><span className="h-3 w-1 rounded bg-positive" /><span className="h-4 w-1 rounded bg-positive" /></span>
          <span className="font-medium text-positive">{session.signalLabel}</span>
          <span className="text-brand-bar-text opacity-80">{session.activityLabel}</span>
        </div>
        <span className="inline-flex items-center gap-2"><Settings aria-hidden="true" className="size-4" /> Settings</span>
      </div>
      <section className="grid min-h-[calc(100vh-6.5rem)] gap-3 p-3 xl:grid-cols-[1fr_28rem]">
        <article className="rounded-panel border border-accent bg-brand-bar p-4">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold">
            Live Response
            <span className="size-2 rounded-full bg-danger" />
          </h2>
          <div className="grid min-h-[70vh] place-items-center text-center text-sm text-brand-bar-text opacity-80">
            Lightforth will analyze your interview questions and generate target responses in real time.
          </div>
        </article>
        <aside className="grid gap-3">
          <section className="overflow-hidden rounded-panel bg-brand-bar shadow-panel">
            <h2 className="px-5 py-3 text-lg font-medium">Your Interview</h2>
            <img src={session.screenPreviewSrc} alt="" className="h-72 w-full object-cover" />
          </section>
          <section className="flex min-h-80 flex-col rounded-panel border border-accent bg-brand-bar">
            <h2 className="border-b border-accent px-4 py-3 text-sm font-medium">AI Assistant</h2>
            <div className="mt-auto grid gap-2 px-4 py-3">
              {session.prompts.map((prompt) => (
                <button key={prompt} type="button" className="inline-flex min-h-8 items-center gap-2 rounded border border-border px-3 text-start text-xs text-brand-bar-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <Sparkles aria-hidden="true" className="size-3" />
                  {prompt}
                </button>
              ))}
            </div>
            <label className="border-t border-accent p-3">
              <span className="sr-only">Ask AI anything</span>
              <span className="flex min-h-11 items-center gap-2 rounded-lg border border-accent bg-brand-bar px-3">
                <input className="min-w-0 flex-1 bg-transparent text-sm text-brand-bar-text outline-none placeholder:text-brand-bar-text" placeholder="Ask AI anything..." />
                <Send aria-hidden="true" className="size-4" />
              </span>
            </label>
          </section>
        </aside>
      </section>
    </main>
  )
}

export function CopilotCompleteView({ homeHref, sessionHref, historyHref }: CopilotCompleteViewProps) {
  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} />
      <section className="px-4 py-9">
        <form className="mx-auto w-full max-w-lg border border-border bg-surface shadow-control">
          <div className="grid gap-5 p-8">
            <h1 className="text-3xl font-semibold">Your Interview is complete!</h1>
            <p className="text-base leading-6 text-ink-muted">Thank you for completing your AI interview with Your Favorite Company.</p>
            <p className="text-base leading-6 text-ink-muted">Your responses have been recorded and will be evaluated by our Lightforth AI. Lightforth will provide an unbiased assessment of vocabulary for the role.</p>
          </div>
          <FooterActions backHref={sessionHref} nextHref={historyHref} nextLabel="See Report" />
        </form>
      </section>
    </Workspace>
  )
}

export function CopilotHistoryView({ homeHref, createHref, rows }: CopilotHistoryViewProps) {
  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} current="History" />
      <section className="px-4 py-8 lg:px-12 xl:px-24">
        <article className="mx-auto min-h-[54rem] max-w-7xl bg-surface shadow-panel">
          <div className="border-b border-border px-8 py-8">
            <h1 className="text-xl font-medium">Past Copilot Sessions</h1>
          </div>
          <div className="p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <label className="relative w-full max-w-sm">
                <span className="sr-only">Search copilot history</span>
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
                  <tr className="border-b border-border bg-surface-subtle text-ink-muted">
                    <th className="w-12 px-3 py-3 text-start font-semibold"><span className="sr-only">Select</span></th>
                    <th className="px-3 py-3 text-start font-semibold">Title</th>
                    <th className="px-3 py-3 text-start font-semibold">Where</th>
                    <th className="px-3 py-3 text-start font-semibold">Company</th>
                    <th className="px-3 py-3 text-start font-semibold">Duration</th>
                    <th className="px-3 py-3 text-start font-semibold">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-border">
                      <td className="px-3 py-3"><label className="grid size-11 place-items-center rounded-soft focus-within:ring-2 focus-within:ring-focus"><span className="sr-only">{`Select ${row.title}`}</span><input type="checkbox" className="size-4 rounded border-input text-accent focus:ring-focus" /></label></td>
                      <td className="px-3 py-3 font-medium">{row.title}</td>
                      <td className="px-3 py-3">{row.where}</td>
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
              <div className="inline-flex items-center gap-4"><span aria-hidden="true">&lt;</span><span>1</span><span aria-hidden="true">&gt;</span></div>
            </div>
          </div>
        </article>
      </section>
    </Workspace>
  )
}
