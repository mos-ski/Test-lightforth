import { useState, type ReactNode } from 'react'
import { ArrowLeft, Bookmark, Check, CheckCircle2, ChevronRight, Code2, MessageSquare, Pause, Play, Search, Send, Settings, Sparkles, Users, Video, X } from 'lucide-react'

import type { CopilotHistoryRow, CopilotLiveSession, CopilotMode, CopilotPermissionStep, CopilotReport, CopilotResponseLength, CopilotResponseMode, CopilotSetup } from '@/contracts/copilot.draft'
import {
  AiSuggestionAction,
  Badge,
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
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/ui'

const copilotModeMeta: Record<CopilotMode, { readonly label: string; readonly icon: ReactNode; readonly panelTitle: string; readonly badgeVariant: 'accent' | 'positive' | 'info' }> = {
  interview: { label: 'Interview', icon: <Users aria-hidden="true" className="size-4" />, panelTitle: 'Configure your interview', badgeVariant: 'accent' },
  coding: { label: 'Coding', icon: <Code2 aria-hidden="true" className="size-4" />, panelTitle: 'Configure your coding interview', badgeVariant: 'info' },
  meeting: { label: 'Meeting', icon: <Video aria-hidden="true" className="size-4" />, panelTitle: 'Configure your meeting', badgeVariant: 'positive' },
}

function CopilotModeTabs({ mode, onModeChange }: { readonly mode: CopilotMode; readonly onModeChange: (mode: CopilotMode) => void }) {
  return (
    <Tabs value={mode} onValueChange={(value) => onModeChange(value as CopilotMode)}>
      <TabsList className="border-b-0 gap-2">
        {(Object.keys(copilotModeMeta) as CopilotMode[]).map((id) => (
          <TabsTrigger
            key={id}
            value={id}
            className="min-h-9 gap-1.5 rounded-pill border border-input px-3 pb-0 data-[selected]:border-accent data-[selected]:bg-accent-subtle"
          >
            {copilotModeMeta[id].icon}
            {copilotModeMeta[id].label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

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
  readonly reportHref: string
  readonly rows: readonly CopilotHistoryRow[]
}

export type CopilotReportViewProps = {
  readonly homeHref: string
  readonly historyHref: string
  readonly report: CopilotReport
}

function CopilotHeader({
  homeHref,
  current = 'Interviews & Meetings',
}: {
  readonly homeHref: string
  readonly current?: string
}) {
  return (
    <ShellBar
      homeHref={homeHref}
      current={current}
      closeHref={homeHref}
      closeLabel="Close interview copilot"
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
  const [mode, setMode] = useState<CopilotMode>(setup.mode)
  const [additionalContext, setAdditionalContext] = useState(setup.additionalContext)

  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} />
      <section className="px-4 py-9">
        <FormPanel
          title={copilotModeMeta[mode].panelTitle}
          step="1/3"
          uploadedFile={{ fileName: setup.uploadedFileName, changeHref: uploadHref }}
          footer={<FormPanelFooter backHref={uploadHref} nextHref={preferencesHref} />}
        >
          <CopilotModeTabs mode={mode} onModeChange={setMode} />
          {mode === 'interview' ? (
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
          ) : mode === 'coding' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <FormSelectField
                id="copilot-coding-language"
                label="Language"
                defaultValue={setup.codingLanguage ?? 'javascript'}
                options={[
                  { label: 'JavaScript / TypeScript', value: 'javascript' },
                  { label: 'Python', value: 'python' },
                  { label: 'Java', value: 'java' },
                  { label: 'Go', value: 'go' },
                  { label: 'C++', value: 'c++' },
                ]}
              />
              <FormSelectField
                id="copilot-difficulty-coding"
                label="Difficulty"
                defaultValue={setup.difficulty.toLowerCase()}
                options={[
                  { label: 'Easy', value: 'easy' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Hard', value: 'hard' },
                ]}
              />
              <FormField id="copilot-target-role-coding" label="Target Role" defaultValue={setup.targetRole} />
              <FormField id="copilot-company-coding" label="Company Name" defaultValue={setup.companyName} />
            </div>
          ) : (
            <div className="grid gap-3">
              <FormField id="copilot-meeting-title" label="Meeting title" defaultValue={setup.meetingTitle ?? ''} />
              <FormField id="copilot-meeting-company" label="Client / Team" defaultValue={setup.companyName} />
              <FormTextArea id="copilot-meeting-agenda" label="Agenda" defaultValue={setup.meetingAgenda ?? ''} />
            </div>
          )}
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

const copilotRubricToneClasses: Record<string, string> = {
  strong: 'bg-positive-surface text-positive',
  partial: 'bg-warning-surface text-warning',
  'needs-work': 'bg-danger-surface text-danger',
}

const copilotRubricLabel: Record<string, string> = {
  strong: 'Strong',
  partial: 'Partial',
  'needs-work': 'Needs work',
}

function CopilotScorecardSection({ title, items }: { readonly title: string; readonly items: readonly string[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
        <CheckCircle2 className="size-4 text-positive" aria-hidden="true" />
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-ink-muted">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function CopilotReportView({ homeHref, historyHref, report }: CopilotReportViewProps) {
  return (
    <Workspace>
      <CopilotHeader homeHref={homeHref} current="Copilot" />
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-[64rem]">
          <article className="w-full bg-surface px-8 py-12 shadow-panel sm:px-10 lg:px-12">
            <a href={historyHref} className="inline-flex min-h-11 items-center gap-3 rounded-soft text-base font-bold text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to History
            </a>

            <header className="mt-8 flex flex-col gap-5 rounded-panel border border-border px-6 py-6 shadow-control sm:flex-row sm:items-center sm:justify-between lg:px-8">
              <div>
                <h1 className="text-3xl font-bold leading-10">{report.title}</h1>
                <p className="mt-1 text-lg leading-7 text-ink-muted">{report.subtitle}</p>
              </div>
            </header>

            {(
              <section className="mt-6 flex flex-col gap-6 rounded-panel border border-border px-6 py-6 shadow-control sm:flex-row sm:items-center lg:px-8">
                <div className="grid size-32 shrink-0 place-items-center rounded-full bg-positive-surface text-5xl font-black text-positive">{report.score}</div>
                <div>
                  <h2 className="text-2xl font-bold leading-8">Overall Summary</h2>
                  <p className="mt-4 text-lg leading-8 text-ink-muted">{report.summary}</p>
                </div>
              </section>
            )}

            {(
              <section className="mt-6 rounded-panel border border-border shadow-control">
                <h2 className="inline-flex min-h-20 items-center gap-3 border-b border-border px-6 text-2xl font-bold leading-8 lg:px-8">
                  <Sparkles aria-hidden="true" className="size-6 text-accent" />
                  Post-Session Scorecard
                </h2>
                <div className="grid gap-6 px-6 py-6 sm:grid-cols-2 lg:px-8">
                  <CopilotScorecardSection title="What Went Well" items={report.whatWentWell} />
                  <CopilotScorecardSection title="What Needs Work" items={report.whatNeedsWork} />
                  <CopilotScorecardSection title="Knowledge Gaps" items={report.knowledgeGaps} />
                </div>
              </section>
            )}

            {(
              <section className="mt-6 rounded-panel border border-border shadow-control">
                <h2 className="inline-flex min-h-20 items-center gap-3 border-b border-border px-6 text-2xl font-bold leading-8 lg:px-8">
                  <MessageSquare aria-hidden="true" className="size-6 text-accent" />
                  Suggested Questions for Future Sessions
                </h2>
                <ul className="flex flex-col gap-3 px-6 py-6 lg:px-8">
                  {report.suggestedQuestions.map((question, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-ink-muted">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-xs font-bold text-accent">{i + 1}</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(
              <section className="mt-6 rounded-panel border border-border shadow-control">
                <h2 className="inline-flex min-h-20 items-center gap-3 border-b border-border px-6 text-2xl font-bold leading-8 lg:px-8">
                  <Search aria-hidden="true" className="size-6 text-ink-muted" />
                  Session Rubric Breakdown
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface-subtle text-xs font-semibold uppercase tracking-wide text-muted">
                        <th className="px-4 py-3">Element</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.rubric.map((row) => (
                        <tr key={row.element} className="border-b border-border-subtle transition-colors hover:bg-surface-subtle last:border-0">
                          <td className="px-4 py-3 font-medium text-ink">{row.element}</td>
                          <td className="px-4 py-3">
                            <Badge tone={row.status === 'strong' ? 'positive' : row.status === 'partial' ? 'warning' : 'danger'} className={copilotRubricToneClasses[row.status]}>
                              {copilotRubricLabel[row.status]}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-ink-muted">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {(
              <section className="mt-6 rounded-panel border border-border p-6 shadow-control lg:p-8">
                <h2 className="inline-flex items-center gap-3 text-xl font-bold leading-8">
                  <Bookmark aria-hidden="true" className="size-5 text-ink-muted" />
                  Transcript
                </h2>
                <div className="mt-5 grid gap-3">
                  {report.transcript.map((entry) => (
                    <article key={entry.id} className="rounded-panel bg-surface-subtle p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className={cn('text-sm font-bold', entry.isUser ? 'text-accent-text' : 'text-ink')}>{entry.speaker}</h3>
                        <p className="font-mono text-xs text-ink-muted">{entry.timestamp}</p>
                      </div>
                      <p className="mt-3 text-lg leading-8 text-ink-muted">{entry.text}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </section>
    </Workspace>
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
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'live' | 'session'>('live')
  const [autoScroll, setAutoScroll] = useState(true)
  const [scrollSpeed, setScrollSpeed] = useState(3)
  const [fontSize, setFontSize] = useState(14)
  const [responseMode, setResponseMode] = useState<'auto' | 'manual'>('auto')

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
        <button type="button" onClick={() => setShowSettings(true)} className="min-h-8 items-center gap-3 rounded-soft px-2 text-sm font-medium text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:inline-flex">
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

      {showSettings ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowSettings(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#1a2332] text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button type="button" onClick={() => setShowSettings(false)} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30" aria-label="Close settings">
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="flex min-h-[28rem]">
              <nav className="w-44 shrink-0 border-r border-white/10 p-4">
                <button
                  type="button"
                  onClick={() => setSettingsTab('live')}
                  className={cn(
                    'w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors',
                    settingsTab === 'live' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white',
                  )}
                >
                  Live Controls
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsTab('session')}
                  className={cn(
                    'mt-1 w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors',
                    settingsTab === 'session' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white',
                  )}
                >
                  Session
                </button>
              </nav>
              <div className="flex-1 p-6">
                {settingsTab === 'live' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">Auto-scroll</p>
                        <p className="mt-0.5 text-xs text-slate-400">Follows the latest answer; scroll up to pause</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={autoScroll}
                        onClick={() => setAutoScroll(!autoScroll)}
                        className={cn('relative flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors', autoScroll ? 'bg-green-500' : 'bg-white/20')}
                      >
                        <span className={cn('block h-5 w-5 rounded-full bg-white shadow transition-transform', autoScroll ? 'translate-x-5' : 'translate-x-0')} />
                      </button>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Auto-scroll speed</p>
                        <span className="text-sm text-slate-400">{scrollSpeed}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={scrollSpeed}
                        onChange={(e) => setScrollSpeed(Number(e.target.value))}
                        className="mt-2 w-full accent-[#3b82f6]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Font size</p>
                        <span className="text-sm text-slate-400">{fontSize}</span>
                      </div>
                      <input
                        type="range"
                        min={12}
                        max={20}
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="mt-2 w-full accent-[#3b82f6]"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Response</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex rounded-lg border border-white/20">
                          <button
                            type="button"
                            onClick={() => setResponseMode('auto')}
                            className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-colors', responseMode === 'auto' ? 'bg-[#3b82f6] text-white' : 'text-slate-400 hover:text-white')}
                          >
                            Auto
                          </button>
                          <button
                            type="button"
                            onClick={() => setResponseMode('manual')}
                            className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-colors', responseMode === 'manual' ? 'bg-[#3b82f6] text-white' : 'text-slate-400 hover:text-white')}
                          >
                            Manual
                          </button>
                        </div>
                        <span className="text-xs text-slate-400">{responseMode === 'auto' ? 'Answers automatically' : 'Press Space to answer'}</span>
                      </div>
                    </div>
                    {responseMode === 'manual' ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">Response key</p>
                          <p className="mt-0.5 text-xs text-slate-400">Press this key to get an answer</p>
                        </div>
                        <span className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium">Space</span>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Role</span>
                      <span className="text-sm font-semibold">{session.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Resume</span>
                      <span className="text-sm font-semibold">Lightforth Resume</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Skip setup</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={false}
                        className="relative flex h-6 w-11 shrink-0 items-center rounded-full bg-white/20 px-0.5 transition-colors"
                      >
                        <span className="block h-5 w-5 rounded-full bg-white shadow translate-x-0 transition-transform" />
                      </button>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <button type="button" className="w-full rounded-lg border border-white/20 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                        Reset — show setup next time
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
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

export function CopilotHistoryView({ homeHref, createHref, reportHref, rows }: CopilotHistoryViewProps) {
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
          onRowClick={(row) => { window.location.href = `${reportHref}?id=${row.id}` }}
          columns={[
            { key: 'title', label: 'Title', className: 'w-[16rem]', render: (row) => <span className="font-medium">{row.title}</span> },
            {
              key: 'mode',
              label: 'Type',
              className: 'w-[7rem]',
              render: (row) => <Badge variant={copilotModeMeta[row.mode].badgeVariant}>{copilotModeMeta[row.mode].label}</Badge>,
            },
            { key: 'where', label: 'Where', className: 'w-[8rem]', render: (row) => row.where },
            { key: 'company', label: 'Company', className: 'w-[10rem]', render: (row) => row.company },
            { key: 'duration', label: 'Duration', className: 'w-[7rem]', render: (row) => row.duration },
            { key: 'date-time', label: 'Date & Time', className: 'w-[12rem]', render: (row) => row.dateTime },
          ]}
        />
      </section>
    </Workspace>
  )
}
