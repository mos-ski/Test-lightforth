import { useState, type ReactNode } from 'react'
import { ArrowLeft, ChevronRight, Send, Settings, X } from 'lucide-react'

import type { CopilotHistoryRow, CopilotLiveSession, CopilotPermissionStep, CopilotResponseLength, CopilotResponseMode, CopilotSetup } from '@/contracts/copilot.draft'
import {
  AiSuggestionAction,
  cn,
  DataTable,
  DocumentDropAction,
  ExampleResponseCard,
  FormChoiceGroup,
  FormField,
  FormPanel,
  FormPanelFooter,
  FormSelectField,
  FormTextArea,
  PermissionSteps,
  ShellBar,
  SourcePicker,
} from '@/ui'

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
  readonly isLoading?: boolean
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
    <ShellBar
      homeHref={homeHref}
      current={current}
      closeHref={homeHref}
      closeLabel="Close interview copilot"
      secondaryAction={historyHref ? { label: 'History', href: historyHref, iconSrc: '/v3-assets/figma/topnav-history.svg' } : undefined}
    />
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
          <SourcePicker
            title="Upload a resume"
            actionLabel="Click to upload"
            idleText="or drag and drop"
            meta="PDF, DOC, DOCX or TXT"
            options={[
              { label: 'Upload a Resume', href: configureHref, iconSrc: '/v3-assets/figma/upload-option-upload.svg' },
              { label: 'Use Lightforth Resume', href: configureHref, iconSrc: '/v3-assets/figma/upload-option-lightforth.svg', emphasis: 'strong' },
            ]}
            historyLink={{ label: 'View copilot history', href: historyHref }}
          />
        </PaperShell>
      </section>
    </Workspace>
  )
}

const COPILOT_AI_SUGGESTION =
  ' Ask the interviewer how success is measured in the first 90 days, and be ready to walk through one metric you personally moved.'

export function CopilotConfigureView({ homeHref, uploadHref, preferencesHref, setup }: CopilotConfigureViewProps) {
  const [additionalContext, setAdditionalContext] = useState(setup.additionalContext)

  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} />
      <section className="px-4 py-9">
        <FormPanel
          title="Configure your interview"
          step="1/3"
          uploadedFile={{ fileName: setup.uploadedFileName, changeHref: uploadHref }}
          footer={<FormPanelFooter backHref={uploadHref} nextHref={preferencesHref} />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
              <FormSelectField
                id="copilot-interview-type"
                label="Interview type"
                defaultValue={setup.interviewType.toLowerCase()}
                options={[
                  { label: 'Introductory', value: 'introductory' },
                  { label: 'Behavioral', value: 'behavioral' },
                  { label: 'Product case', value: 'product case' },
                ]}
              />
              <FormSelectField
                id="copilot-difficulty"
                label="Difficulty"
                defaultValue={setup.difficulty.toLowerCase()}
                options={[
                  { label: 'Easy', value: 'easy' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Hard', value: 'hard' },
                ]}
              />
              <FormField id="copilot-target-role" label="Target Role" defaultValue={setup.targetRole} />
              <FormField id="copilot-company" label="Company Name" defaultValue={setup.companyName} />
          </div>
          <DocumentDropAction actionHref="/v3/documents/add" />
          <FormTextArea
            id="copilot-additional-context"
            label="Additional context"
            value={additionalContext}
            onChange={(event) => setAdditionalContext(event.target.value)}
          />
          <AiSuggestionAction onClick={() => setAdditionalContext((prev) => `${prev}${COPILOT_AI_SUGGESTION}`)} />
        </FormPanel>
      </section>
    </Workspace>
  )
}

export function CopilotPreferencesView({ homeHref, configureHref, shareHref, setup }: CopilotPreferencesViewProps) {
  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} />
      <section className="px-4 py-9">
        <FormPanel
          title="Set Preference"
          step="2/3"
          footer={<FormPanelFooter backHref={configureHref} nextHref={shareHref} />}
        >
            <FormChoiceGroup<CopilotResponseMode>
              label="Select Response Type"
              name="copilot-response-type"
              options={[
                { label: 'Default', value: 'default' },
                { label: 'Headlines', value: 'headlines' },
                { label: 'Coaching', value: 'coaching' },
              ]}
              selected={setup.responseMode}
            />
            <ExampleResponseCard helperText="Best for candidates who want a direct, no-frills answer">
              "I redesigned a <strong>vehicle maintenance app</strong> that had low engagement. Led a team to identify pain points, improved UI, and introduced a personalized dashboard. <strong>Engagement increased by 30% in 3 months</strong>, and customer satisfaction improved significantly."
            </ExampleResponseCard>
            <FormChoiceGroup<CopilotResponseLength>
              label="Select Response Length"
              name="copilot-response-length"
              options={[
                { label: 'Short', value: 'short' },
                { label: 'Medium', value: 'medium' },
                { label: 'Long', value: 'long' },
              ]}
              selected={setup.responseLength}
            />
        </FormPanel>
      </section>
    </Workspace>
  )
}

export function CopilotPermissionView({ homeHref, backHref, nextHref, steps, previewSrc, actionLabel }: CopilotPermissionViewProps) {
  const permissionSteps = steps.map((step) => ({
    ...step,
    iconSrc: step.id === 'screen' ? '/v3-assets/figma/form-screen.svg' : '/v3-assets/figma/form-mic.svg',
  }))

  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} />
      <section className="px-4 py-9">
        <FormPanel
          title="Share your screen"
          step="3/3"
          footer={previewSrc ? undefined : <FormPanelFooter backHref={backHref} nextHref={nextHref} />}
        >
          <PermissionSteps
            steps={permissionSteps}
            actionHref={nextHref}
            previewSrc={previewSrc ?? undefined}
            startHref={previewSrc ? nextHref : undefined}
            startLabel={actionLabel}
          />
        </FormPanel>
      </section>
    </Workspace>
  )
}

function CopilotLiveLoadingBar({ className }: { readonly className?: string }) {
  return <span aria-hidden="true" className={cn('block animate-pulse rounded-lg bg-[var(--lf-live-message)] motion-reduce:animate-none', className)} />
}

function LiveSignal({ label }: { readonly label: string }) {
  return (
    <span className="inline-flex items-end gap-1 text-positive" aria-label={label}>
      <span aria-hidden="true" className="h-1.5 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-2 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-3 w-1 rounded-soft bg-positive" />
      <span aria-hidden="true" className="h-4 w-1 rounded-soft bg-positive" />
    </span>
  )
}

function CopilotLiveLoadingView() {
  return (
    <main className="min-h-screen bg-[var(--lf-live-workspace)] text-brand-bar-text">
      <div role="status" aria-label="Loading copilot session" className="sr-only">
        Loading copilot session
      </div>
      <header className="flex min-h-[57px] items-center justify-between border-b border-[var(--lf-live-divider)] bg-[var(--lf-live-header)] px-5 py-3">
        <CopilotLiveLoadingBar className="h-5 w-56 max-w-[50vw]" />
        <div className="flex items-center gap-4">
          <CopilotLiveLoadingBar className="h-5 w-14" />
          <CopilotLiveLoadingBar className="h-9 w-28" />
        </div>
      </header>
      <div className="flex min-h-10 items-center justify-between border-b border-[var(--lf-live-divider)] bg-[var(--lf-live-strip)] px-5">
        <CopilotLiveLoadingBar className="h-5 w-36" />
        <CopilotLiveLoadingBar className="h-5 w-24" />
      </div>
      <section className="grid gap-3 overflow-hidden p-3 xl:h-[calc(100vh-6.0625rem)] xl:grid-cols-[minmax(0,1fr)_6px_28.5rem]">
        <article className="min-h-[38rem] overflow-hidden rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
          <div className="flex min-h-[57px] items-center border-b border-[var(--lf-live-border)] px-4 py-3">
            <CopilotLiveLoadingBar className="h-5 w-32" />
          </div>
          <div className="grid min-h-[32rem] place-items-center p-5 xl:h-[calc(100vh-12.4375rem)]">
            <CopilotLiveLoadingBar className="h-16 w-64" />
          </div>
        </article>
        <div className="hidden h-full bg-[var(--lf-live-divider)] xl:block" />
        <aside className="grid min-h-[42rem] gap-3 xl:min-h-0 xl:grid-rows-[auto_6px_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-panel bg-[var(--lf-live-panel)]">
            <CopilotLiveLoadingBar className="h-[24rem] w-full rounded-none" />
          </section>
          <div className="hidden h-1.5 bg-[var(--lf-live-divider)] xl:block" />
          <section className="grid min-h-0 grid-rows-[auto_1fr_auto] rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
            <div className="border-b border-[var(--lf-live-border)] px-4 py-3">
              <CopilotLiveLoadingBar className="h-5 w-28" />
            </div>
            <div className="mt-auto grid gap-1.5 p-4">
              {Array.from({ length: 4 }, (_, index) => (
                <CopilotLiveLoadingBar key={index} className="h-7 w-full rounded-sm" />
              ))}
            </div>
            <div className="border-t border-[var(--lf-live-border)] p-3">
              <CopilotLiveLoadingBar className="h-11 w-full" />
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}

const COPILOT_PROMPT_RESPONSES: Record<string, string> = {
  'Summarize the discussion so far':
    "So far the interviewer has asked about your background and your approach to a recent design decision. You've covered the vehicle maintenance app redesign, citing the 30% engagement lift.",
  'How well am I doing so far?':
    "You're doing well — your answers are specific and metric-driven. Consider slowing down slightly on the first sentence of each answer so the interviewer can follow the setup before the result.",
  'Suggest follow-up questions':
    'Try asking: "What does success look like for this role in the first 90 days?" or "How does the design team collaborate with engineering here?"',
  'What was discussed in the last two minutes?':
    'The conversation covered your experience leading cross-functional design reviews and how you handle conflicting stakeholder feedback.',
}

function copilotResponseFor(prompt: string): string {
  return (
    COPILOT_PROMPT_RESPONSES[prompt] ??
    `Lightforth is analyzing "${prompt}" against the live transcript and will surface a response shortly.`
  )
}

export function CopilotLiveView({ completeHref, session, isLoading = false }: CopilotLiveViewProps) {
  const [liveResponse, setLiveResponse] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  if (isLoading) {
    return <CopilotLiveLoadingView />
  }

  function handleSend() {
    const trimmed = draft.trim()
    if (!trimmed) return
    setLiveResponse(copilotResponseFor(trimmed))
    setDraft('')
  }

  return (
    <main className="min-h-screen bg-[var(--lf-live-workspace)] text-brand-bar-text">
      <header className="flex min-h-[57px] flex-wrap items-center justify-between gap-3 border-b border-[var(--lf-live-divider)] bg-[var(--lf-live-header)] px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <a href={completeHref} aria-label="Back from live copilot" className="grid size-7 shrink-0 place-items-center rounded-soft text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <ArrowLeft aria-hidden="true" className="size-4" />
          </a>
          <h1 className="truncate text-sm font-medium leading-5">{session.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium leading-5 text-ink-muted">{session.timer}</span>
          <a href={completeHref} className="inline-flex min-h-9 items-center rounded-lg bg-danger px-4 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">End Session</a>
        </div>
      </header>
      <div className="flex min-h-10 items-center justify-between border-b border-[var(--lf-live-divider)] bg-[var(--lf-live-strip)] px-5">
        <div className="flex items-center gap-4">
          <LiveSignal label={session.signalLabel} />
          <span className="text-sm font-medium leading-5 text-positive">{session.signalLabel}</span>
          <span className="text-sm italic leading-5 text-ink-muted">{session.activityLabel}</span>
        </div>
        <button type="button" className="hidden min-h-8 items-center gap-3 rounded-soft px-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:inline-flex">
          <Settings aria-hidden="true" className="size-4" />
          Settings
        </button>
      </div>
      <section className="grid gap-3 overflow-hidden p-3 xl:h-[calc(100vh-6.0625rem)] xl:grid-cols-[minmax(0,1fr)_6px_28.5rem]">
        <article className="min-h-[38rem] overflow-hidden rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
          <div className="flex min-h-[57px] items-center justify-between border-b border-[var(--lf-live-border)] px-4 py-3">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold leading-5">
              Live Response
              <span className="size-2 rounded-pill bg-danger" />
            </h2>
          </div>
          <div className="grid min-h-[32rem] place-items-center p-5 xl:h-[calc(100vh-12.4375rem)]">
            {liveResponse ? (
              <p className="max-w-[28rem] text-start text-sm leading-[22.75px] text-brand-bar-text">{liveResponse}</p>
            ) : (
              <p className="max-w-[16.25rem] text-center text-sm leading-[22.75px] text-ink-muted">
                Lightforth will analyze your interview questions and generate target responses in real time.
              </p>
            )}
          </div>
        </article>
        <div className="hidden h-full bg-[var(--lf-live-divider)] xl:block" />
        <aside className="grid min-h-[42rem] gap-3 xl:min-h-0 xl:grid-rows-[auto_6px_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-panel bg-[var(--lf-live-panel)]">
            <h2 className="bg-[var(--lf-live-panel-header)] px-5 py-[13px] text-[18.67px] font-medium leading-[37px]">Your Interview</h2>
            <img src={session.screenPreviewSrc} alt="" className="h-[22.666rem] w-full rounded-b-lg object-cover" />
          </section>
          <div className="hidden h-1.5 bg-[var(--lf-live-divider)] xl:block" />
          <section className="grid min-h-0 grid-rows-[auto_1fr_auto] rounded-panel border border-[var(--lf-live-border)] bg-[var(--lf-live-panel)]">
            <div className="flex min-h-[57px] items-center justify-between border-b border-[var(--lf-live-border)] px-4 py-3">
              <h2 className="text-sm font-medium leading-5">AI Assistant</h2>
              <button type="button" aria-label="Close AI assistant" className="grid size-8 place-items-center rounded-soft text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div className="flex min-h-0 flex-col justify-end gap-1.5 px-4 pb-2">
              {session.prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setLiveResponse(copilotResponseFor(prompt))}
                  className="inline-flex min-h-[27px] items-center gap-1 rounded-[3px] border border-[var(--lf-live-control-border)] px-2.5 py-1 text-start text-[10px] font-medium leading-[15px] text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <ChevronRight aria-hidden="true" className="size-2.5" />
                  <span className="truncate">{prompt}</span>
                </button>
              ))}
            </div>
            <label className="border-t border-[var(--lf-live-border)] p-3">
              <span className="sr-only">Ask AI anything</span>
              <span className="flex min-h-11 items-center gap-2 rounded-lg border border-[var(--lf-live-border)] bg-[var(--lf-live-header)] px-3 py-2">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleSend()
                    }
                  }}
                  className="min-w-0 flex-1 bg-transparent text-sm text-brand-bar-text outline-none placeholder:text-ink-muted"
                  placeholder="Ask AI anything..."
                />
                <button type="button" onClick={handleSend} aria-label="Send question">
                  <Send aria-hidden="true" className="size-4 text-ink-muted" />
                </button>
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
        <DataTable
          title="Past Copilot Sessions"
          searchLabel="Search copilot history"
          action={{ label: 'Create New', href: createHref }}
          rows={rows}
          itemLabel={(row) => row.title}
          className="mx-auto max-w-7xl"
          columns={[
            { key: 'title', label: 'Title', className: 'w-[15rem]', render: (row) => <span className="font-medium">{row.title}</span> },
            { key: 'where', label: 'Where', className: 'w-[10rem]', render: (row) => row.where },
            { key: 'company', label: 'Company', className: 'w-[13rem]', render: (row) => row.company },
            { key: 'duration', label: 'Duration', className: 'w-[8rem]', render: (row) => row.duration },
            { key: 'date-time', label: 'Date & Time', className: 'w-[16rem]', render: (row) => row.dateTime },
          ]}
        />
      </section>
    </Workspace>
  )
}
