import type { ReactNode } from 'react'
import { Check, ChevronDown, ChevronRight, Minus, Plus, Search, Send, Sparkles, X } from 'lucide-react'

import type { ResumeBuilderSession, ResumeBuilderTab, ResumeChatState, ResumeDocument, ResumeHistoryRow, ResumeSectionId, ResumeTemplate } from '@/contracts/resume.draft'
import { AiSuggestionAction, cn, DataTable, FormField, FormPanel, FormPanelFooter, FormTextArea, ShellBar, SourcePicker } from '@/ui'

export type ResumeUploadViewProps = {
  readonly homeHref: string
  readonly configureHref: string
  readonly historyHref: string
}

export type ResumeConfigureViewProps = {
  readonly homeHref: string
  readonly editorHref: string
  readonly uploadHref: string
  readonly session: ResumeBuilderSession
}

export type ResumeEditorViewProps = {
  readonly homeHref: string
  readonly historyHref: string
  readonly document: ResumeDocument
  readonly session: ResumeBuilderSession
  readonly templates: readonly ResumeTemplate[]
  readonly tab: ResumeBuilderTab
  readonly chatState: ResumeChatState
}

export type ResumeHistoryViewProps = {
  readonly homeHref: string
  readonly createHref: string
  readonly rows: readonly ResumeHistoryRow[]
}

const sectionLabels: Record<ResumeSectionId, string> = {
  'personal-information': 'Personal Information',
  'professional-summary': 'Professional Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
}

function BuilderHeader({
  homeHref,
  current,
  action,
}: {
  readonly homeHref: string
  readonly current: string
  readonly action?: 'download'
}) {
  return (
    <ShellBar
      homeHref={homeHref}
      current={current}
      closeHref={action === 'download' ? undefined : homeHref}
      closeLabel="Close resume builder"
      action={action === 'download' ? { label: 'Download', href: '/v3/resume/download' } : undefined}
    />
  )
}

function Workspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

function PaperShell({ children, compact = false }: { readonly children: ReactNode; readonly compact?: boolean }) {
  return (
    <article className={cn('mx-auto min-h-[56rem] w-full bg-surface p-8 shadow-panel', compact ? 'max-w-3xl' : 'max-w-[44rem]')} aria-label="Resume preview">
      {children}
    </article>
  )
}

function AiSuggestionLabel() {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text">
      <Sparkles aria-hidden="true" className="size-4" />
      AI Suggestion
    </span>
  )
}

export function ResumeUploadView({ homeHref, configureHref, historyHref }: ResumeUploadViewProps) {
  return (
    <Workspace>
      <BuilderHeader homeHref={homeHref} current="Build a Resume" />
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
            historyLink={{ label: 'View past resumes', href: historyHref }}
          />
        </PaperShell>
      </section>
    </Workspace>
  )
}

export function ResumeConfigureView({ homeHref, editorHref, uploadHref, session }: ResumeConfigureViewProps) {
  return (
    <Workspace>
      <BuilderHeader homeHref={homeHref} current="Build a Resume" />
      <section className="px-4 py-9">
        <FormPanel
          title="Configure your Resume"
          step="1/2"
          uploadedFile={{ fileName: session.uploadedFileName, changeHref: uploadHref }}
          footer={<FormPanelFooter backHref={uploadHref} nextHref={editorHref} />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField id="resume-name" label="Resume Name" defaultValue={session.resumeName} />
            <FormField id="company-name" label="Company Name" defaultValue={session.companyName} />
          </div>
          <FormTextArea id="resume-job-description" label="Enter Job Description" defaultValue={session.jobDescription} />
          <AiSuggestionAction />
        </FormPanel>
      </section>
    </Workspace>
  )
}

function TabRail({ tab }: { readonly tab: ResumeBuilderTab }) {
  const tabs: readonly ResumeBuilderTab[] = ['chat', 'create', 'template']
  return (
    <div className="grid grid-cols-3 gap-0.5 rounded-lg bg-surface-subtle p-0.5 text-sm font-semibold">
      {tabs.map((item) => (
        <a
          key={item}
          href={`/v3/resume/editor?tab=${item}${item === 'chat' ? '&state=empty' : ''}`}
          className={cn('grid min-h-8 place-items-center rounded-md text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', item === tab ? 'bg-surface text-ink shadow-control' : '')}
          aria-current={item === tab ? 'page' : undefined}
        >
          {item[0].toUpperCase()}{item.slice(1)}
        </a>
      ))}
    </div>
  )
}

function PromptChips({ prompts }: { readonly prompts: readonly string[] }) {
  return (
    <div className="flex gap-1.5 overflow-hidden px-3 py-2">
      {prompts.map((prompt) => (
        <button key={prompt} type="button" className="inline-flex min-h-7 shrink-0 items-center gap-1 rounded-md border border-border bg-surface px-3 text-xs font-medium text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <Sparkles aria-hidden="true" className="size-3" />
          {prompt}
        </button>
      ))}
    </div>
  )
}

function ChatComposer({ prompts }: { readonly prompts: readonly string[] }) {
  return (
    <div className="mt-auto">
      <PromptChips prompts={prompts} />
      <div className="px-3 pb-3">
        <label className="sr-only" htmlFor="resume-chat-message">
          Resume chat message
        </label>
        <div className="relative rounded-2xl border border-border bg-surface p-3">
          <textarea id="resume-chat-message" className="min-h-16 w-full resize-none bg-surface text-sm text-ink outline-none placeholder:text-ink-muted" placeholder="Paste a job description here to get started..." />
          <button type="button" aria-label="Send resume message" className="absolute bottom-2 end-2 grid size-8 place-items-center rounded-lg bg-surface-subtle text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Send aria-hidden="true" className="size-4" />
          </button>
        </div>
        <p className="pt-1 text-center text-xs text-ink-muted">Enter to send · Shift+Enter for newline</p>
      </div>
    </div>
  )
}

function ChatSidebar({ session, state }: { readonly session: ResumeBuilderSession; readonly state: ResumeChatState }) {
  return (
    <aside className="flex w-full flex-col border-e border-border bg-surface lg:w-[21.25rem]">
      <div className="border-b border-border p-3">
        <TabRail tab="chat" />
      </div>
      <div className="flex min-h-[calc(100vh-7rem)] flex-1 flex-col">
        {state === 'suggestions' ? (
          <div className="grid gap-3 p-3">
            <div className="ms-auto max-w-[17rem] rounded-s-2xl rounded-ee-sm rounded-se-2xl bg-accent px-4 py-3 text-sm leading-6 text-on-accent shadow-control">
              <p>{session.chatPrompt}</p>
              <button type="button" className="mt-2 text-xs font-semibold text-on-accent">Show more</button>
            </div>
            <div className="max-w-[17rem] rounded-e-2xl rounded-es-sm rounded-ss-2xl bg-surface-subtle px-4 py-3 text-sm leading-6 text-ink">
              {session.aiResponse}
            </div>
            <div className="flex gap-2">
              <button type="button" className="inline-flex min-h-8 items-center gap-1 rounded-pill border border-border px-3 text-xs font-semibold text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <X aria-hidden="true" className="size-3" />
                Reject All
              </button>
              <button type="button" className="inline-flex min-h-8 items-center gap-1 rounded-pill bg-accent px-3 text-xs font-semibold text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <Check aria-hidden="true" className="size-3" />
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <ChatComposer prompts={session.promptSuggestions} />
      </div>
    </aside>
  )
}

function SectionEditor({ session }: { readonly session: ResumeBuilderSession }) {
  const sections = Object.entries(sectionLabels) as ReadonlyArray<[ResumeSectionId, string]>

  return (
    <aside className="relative flex w-full flex-col border-e border-border bg-surface lg:w-[21.25rem]">
      <div className="border-b border-border p-3">
        <TabRail tab="create" />
      </div>
      <div className="flex min-h-[calc(100vh-7rem)] flex-col">
        <div className="flex-1 overflow-auto px-3 py-1">
          {sections.map(([id, label]) => (
            <section key={id} className="border-b border-border py-2">
              <button type="button" className="flex min-h-10 w-full items-center justify-between text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                {label}
                <ChevronDown aria-hidden="true" className={cn('size-4 text-ink-muted', id === 'professional-summary' ? 'rotate-180' : '')} />
              </button>
              {id === 'professional-summary' ? (
                <div className="grid gap-2 pb-3">
                  <label htmlFor="summary-create" className="text-xs font-medium text-ink-muted">
                    Summary
                  </label>
                  <textarea id="summary-create" className="min-h-24 rounded-md border border-border bg-surface px-3 py-2 text-xs text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus" placeholder="A brief overview of your professional background and key strengths..." />
                  <AiSuggestionLabel />
                </div>
              ) : null}
            </section>
          ))}
        </div>
        <div className="border-t border-border p-3">
          <button type="button" className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-input text-sm font-medium text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Plus aria-hidden="true" className="size-4" />
            Add Section
          </button>
        </div>
      </div>
      <div className="absolute end-3 top-20 z-10 w-64 rounded-lg border border-accent bg-surface shadow-panel">
        <div className="flex items-center justify-between rounded-t-lg bg-brand-bar px-3 py-2 text-brand-bar-text">
          <span className="inline-flex items-center gap-2 text-xs font-semibold">
            <Sparkles aria-hidden="true" className="size-3" />
            Light AI
          </span>
          <button type="button" aria-label="Close AI suggestion" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <X aria-hidden="true" className="size-3" />
          </button>
        </div>
        <div className="p-3 text-xs leading-5 text-ink-muted">
          <p className="border-s-2 border-focus ps-3">{session.aiDraft}</p>
          <button type="button" className="mt-3 inline-flex min-h-8 items-center gap-2 text-xs text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Sparkles aria-hidden="true" className="size-3" />
            Regenerate
          </button>
        </div>
      </div>
    </aside>
  )
}

function TemplateSidebar({ templates, selectedTemplateId }: { readonly templates: readonly ResumeTemplate[]; readonly selectedTemplateId: string }) {
  return (
    <aside className="flex w-full flex-col border-e border-border bg-surface lg:w-[21.25rem]">
      <div className="border-b border-border p-3">
        <TabRail tab="template" />
      </div>
      <div className="grid grid-cols-2 gap-3 overflow-auto p-3">
        {templates.map((template) => {
          const isSelected = template.id === selectedTemplateId
          return (
            <button
              key={template.id}
              type="button"
              className={cn(
                'overflow-hidden rounded-lg border text-start transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                isSelected ? 'border-accent shadow-panel' : 'border-border hover:shadow-control',
              )}
            >
              <span className="relative block aspect-[3/4] bg-surface-subtle">
                {isSelected ? (
                  <span className="absolute start-2 top-2 grid size-7 place-items-center rounded-pill bg-positive text-on-accent">
                    <Check aria-hidden="true" className="size-3.5" />
                  </span>
                ) : null}
              </span>
              <span className="block p-2.5">
                <span className={cn('block text-xs font-semibold leading-4', isSelected ? 'text-accent' : 'text-ink')}>{template.name}</span>
                <span className="mt-1 block line-clamp-2 text-[11px] leading-3 text-ink-muted">{template.description}</span>
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

function ClassicResume({ document, state, tab }: { readonly document: ResumeDocument; readonly state: ResumeChatState; readonly tab: ResumeBuilderTab }) {
  const useImproved = state === 'suggestions' || tab === 'create'

  return (
    <PaperShell>
      <header className="border-b border-ink pb-4 text-center">
        <h1 className="text-3xl font-bold tracking-wide">{document.candidateName}</h1>
        <p className="mt-2 text-xs text-ink-muted">
          <a href={`mailto:${document.email}`} className="text-accent-text underline">{document.email}</a> | {document.location} | {document.linkedinUrl} | {document.portfolioUrl}
        </p>
      </header>
      <section className="mt-5">
        <h2 className="border-b border-ink pb-1 text-sm font-bold uppercase tracking-wide">Professional Summary</h2>
        <p className={cn('mt-2 text-xs italic leading-5', useImproved ? 'bg-accent-subtle text-accent-text' : 'bg-positive-surface text-positive')}>
          {useImproved ? document.improvedSummary : document.summary}
        </p>
      </section>
      <section className="mt-5">
        <h2 className="border-b border-ink pb-1 text-sm font-bold uppercase tracking-wide">Experience</h2>
        <div className="grid gap-5 pt-3">
          {document.roles.map((role, roleIndex) => (
            <article key={`${role.company}-${role.period}`}>
              <div className="flex items-start justify-between gap-4 text-xs">
                <div>
                  <h3 className="font-bold">{role.company}</h3>
                  <p className="italic text-ink-muted">{role.location}</p>
                  <p className="italic">{role.title}</p>
                </div>
                <p className="shrink-0 text-end text-ink-muted">{role.period}</p>
              </div>
              <ul className="mt-2 list-disc space-y-1.5 ps-5 text-xs leading-5">
                {role.bullets.map((bullet, index) => (
                  <li key={bullet} className={cn(state === 'suggestions' && roleIndex === 0 && index < 2 ? 'bg-accent-subtle text-accent-text' : '')}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-5">
        <h2 className="border-b border-ink pb-1 text-sm font-bold uppercase tracking-wide">Skills</h2>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          {document.skills.slice(0, 14).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
      <section className="mt-5">
        <h2 className="border-b border-ink pb-1 text-sm font-bold uppercase tracking-wide">Certifications</h2>
        {document.certifications.map((certification) => (
          <div key={certification.name} className="mt-2 flex justify-between gap-4 text-xs">
            <div>
              <h3 className="font-bold">{certification.name}</h3>
              <p className="text-ink-muted">{certification.issuer}</p>
            </div>
            <p>{certification.year}</p>
          </div>
        ))}
      </section>
    </PaperShell>
  )
}

function ExecutiveResume({ document }: { readonly document: ResumeDocument }) {
  return (
    <PaperShell compact>
      <header className="pb-4">
        <h1 className="text-2xl font-bold tracking-wide">{document.candidateName}</h1>
        <p className="mt-2 text-xs text-ink-muted">{document.email} | {document.location} | {document.linkedinUrl} | {document.portfolioUrl}</p>
      </header>
      <div className="grid gap-4">
        {[
          ['Professional Summary', document.improvedSummary],
          ['Experience', document.roles[0]?.bullets.join(' ') ?? ''],
          ['Education', `${document.education[0]?.school ?? ''} - ${document.education[0]?.degree ?? ''}`],
          ['Skills', document.skills.join(' · ')],
          ['Certifications', document.certifications.map((item) => `${item.name}, ${item.issuer}`).join(' · ')],
        ].map(([title, body]) => (
          <section key={title} className="grid grid-cols-[1rem_1fr] gap-3">
            <span className="mt-1 size-2 rounded-soft border border-ink" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide">{title}</h2>
              <p className="mt-2 text-xs leading-5 text-ink-muted">{body}</p>
            </div>
          </section>
        ))}
      </div>
    </PaperShell>
  )
}

function ZoomPill({ label }: { readonly label: string }) {
  return (
    <div className="absolute end-4 top-4 hidden items-center gap-2 rounded-pill border border-border bg-surface px-3 py-1 text-xs font-medium text-ink-muted shadow-control lg:flex">
      <Minus aria-hidden="true" className="size-3" />
      {label}
      <Plus aria-hidden="true" className="size-3" />
    </div>
  )
}

function InlineChangeControls() {
  return (
    <div className="absolute end-40 top-36 hidden gap-2 lg:flex">
      <button type="button" aria-label="Decline change" className="grid size-8 place-items-center rounded-soft border border-border bg-surface text-ink-muted shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <X aria-hidden="true" className="size-4" />
      </button>
      <button type="button" aria-label="Accept change" className="grid size-8 place-items-center rounded-soft bg-accent text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        <Check aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

function Tooltip({ title, body, align = 'start' }: { readonly title: string; readonly body: string; readonly align?: 'start' | 'end' }) {
  return (
    <aside className={cn('absolute z-10 hidden w-64 rounded-lg bg-brand-bar p-3 text-xs shadow-panel lg:block', align === 'start' ? 'bottom-8 start-8' : 'end-8 top-12')} aria-label={title}>
      <h2 className="font-semibold text-brand-bar-text">{title}</h2>
      <p className="mt-1 leading-5 text-surface-subtle">{body}</p>
    </aside>
  )
}

export function ResumeEditorView({ homeHref, document, session, templates, tab, chatState }: ResumeEditorViewProps) {
  return (
    <Workspace>
      <BuilderHeader homeHref={homeHref} current="Build a Resume" action="download" />
      <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
        {tab === 'chat' ? <ChatSidebar session={session} state={chatState} /> : null}
        {tab === 'create' ? <SectionEditor session={session} /> : null}
        {tab === 'template' ? <TemplateSidebar templates={templates} selectedTemplateId={session.selectedTemplateId} /> : null}
        <div className="relative flex-1 overflow-auto bg-canvas px-4 py-8 lg:px-8">
          <ZoomPill label={session.zoomLabel} />
          {tab === 'template' ? <ExecutiveResume document={document} /> : <ClassicResume document={document} tab={tab} state={chatState} />}
          {chatState === 'suggestions' && tab === 'chat' ? (
            <>
              <InlineChangeControls />
              <Tooltip title="Accept or Decline Changes" body="Tooltips are used to describe or identify an element." align="end" />
            </>
          ) : null}
          {chatState === 'empty' && tab === 'chat' ? <Tooltip title="Send your First Message" body="Chat or paste a job description and Lightforth will rewrite your resume to match key words." /> : null}
        </div>
      </section>
    </Workspace>
  )
}

export function ResumeHistoryView({ homeHref, createHref, rows }: ResumeHistoryViewProps) {
  return (
    <Workspace>
      <BuilderHeader homeHref={homeHref} current="History" />
      <section className="px-4 py-8 lg:px-12 xl:px-24">
        <DataTable
          title="Past Resumes"
          searchLabel="Search past resumes"
          action={{ label: 'Create New', href: createHref }}
          rows={rows}
          itemLabel={(row) => row.title}
          className="mx-auto max-w-7xl"
          columns={[
            { key: 'title', label: 'Title', className: 'w-[18rem]', render: (row) => <span className="font-medium">{row.title}</span> },
            {
              key: 'ats-score',
              label: 'ATS Score',
              className: 'w-[9rem]',
              render: (row) => <span className="rounded-pill bg-positive-surface px-2.5 py-0.5 text-xs font-bold leading-4 text-positive">{row.atsScore}</span>,
            },
            { key: 'company', label: 'Company', className: 'w-[13rem]', render: (row) => row.company },
            { key: 'duration', label: 'Duration', className: 'w-[8rem]', render: (row) => row.duration },
            { key: 'created-at', label: 'Date & Time', className: 'w-[16rem]', render: (row) => row.createdAtLabel },
          ]}
        />
      </section>
    </Workspace>
  )
}
