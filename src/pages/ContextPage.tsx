import { useState, useRef } from 'react'
import {
  FileText,
  Link2,
  PenLine,
  Plus,
  Search,
  Github,
  Linkedin,
  Globe,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
  Upload,
  X,
  FileCode,
  File,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SourceType = 'file' | 'link' | 'note'

interface ContextSource {
  id: string
  type: SourceType
  name: string
  subtype?: 'github' | 'linkedin' | 'portfolio' | 'other'
  url?: string
  content?: string
  summary?: string
  addedAt: string
  size?: string
  ext?: string
}

const MOCK_SOURCES: ContextSource[] = [
  {
    id: '1',
    type: 'file',
    name: 'Darnell_Smith_Resume.pdf',
    ext: 'pdf',
    addedAt: 'Jun 10, 2026',
    size: '124 KB',
    summary: 'Resume for Darnell Smith — Product Designer & Design Engineer with 5 years of experience at startups and mid-size tech companies. Strong background in Figma, React, TypeScript, and cross-functional collaboration. Notable achievements include leading redesigns at two funded startups.',
  },
  {
    id: '2',
    type: 'link',
    subtype: 'github',
    name: 'github.com/darnellsmith',
    url: 'https://github.com/darnellsmith',
    addedAt: 'Jun 11, 2026',
    summary: 'GitHub profile with 42 public repositories. Primary languages: TypeScript (52%), Python (28%), CSS (12%). Notable repos: design-system-kit (⭐ 318), ai-resume-parser (⭐ 91), interview-prep-cli (⭐ 44). Consistent contribution history over 3 years. Active in open-source collaboration.',
  },
  {
    id: '3',
    type: 'link',
    subtype: 'linkedin',
    name: 'linkedin.com/in/darnellsmith',
    url: 'https://linkedin.com/in/darnellsmith',
    addedAt: 'Jun 11, 2026',
    summary: 'LinkedIn profile with 500+ connections. Currently: Sr. Product Designer at TechCorp (2023–present). Previous: UX Lead at LaunchPad (2021–2023), UI Designer at Agency One (2019–2021). Education: B.S. Computer Science, Howard University 2019. Skills endorsed: Product Design, React, User Research, Figma.',
  },
  {
    id: '4',
    type: 'note',
    name: 'Interview Prep Notes',
    content: `**Why I want this role:**\nI've been following this company's work for over a year and I'm genuinely excited about the problem they're solving — making design tools more collaborative and AI-native.\n\n**My biggest strengths:**\n- Deep understanding of design systems at scale\n- Can bridge design and engineering effectively\n- Built and shipped products end-to-end\n\n**Projects to mention:**\n1. Design System Kit — open source, 300+ stars\n2. AI Resume Parser — used by 2,000+ job seekers\n3. Redesigned onboarding flow at LaunchPad — 40% conversion lift`,
    addedAt: 'Jun 12, 2026',
  },
  {
    id: '5',
    type: 'file',
    name: 'Cover_Letter_Template.docx',
    ext: 'docx',
    addedAt: 'Jun 13, 2026',
    size: '22 KB',
    summary: 'A customizable cover letter template tailored for product and design roles. Highlights collaborative work style, user-centric approach, and passion for shipping impactful products. Includes placeholders for role-specific customization.',
  },
  {
    id: '6',
    type: 'link',
    subtype: 'portfolio',
    name: 'darnellsmith.design',
    url: 'https://darnellsmith.design',
    addedAt: 'Jun 13, 2026',
    summary: 'Personal portfolio site showcasing 8 case studies. Featured projects: LaunchPad Onboarding Redesign, TechCorp Design System, AI Chat Interface (concept). Site highlights strong visual design, clear storytelling, and detailed process documentation. Contact and availability section present.',
  },
]

const LINK_SUBTYPES = [
  { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
  { key: 'portfolio', label: 'Portfolio', icon: Globe, placeholder: 'https://yourportfolio.com' },
]

const FILE_ICON_MAP: Record<string, React.ElementType> = {
  pdf: FileText,
  docx: FileCode,
  doc: FileCode,
  md: File,
}

function fileIcon(ext?: string): React.ElementType {
  return (ext && FILE_ICON_MAP[ext]) || FileText
}

function fileIconColor(ext?: string): string {
  if (ext === 'pdf') return 'text-red-500 bg-red-50'
  if (ext === 'docx' || ext === 'doc') return 'text-blue-500 bg-blue-50'
  if (ext === 'md') return 'text-gray-500 bg-gray-100'
  return 'text-gray-400 bg-gray-50'
}

function linkIcon(subtype?: string): React.ElementType {
  if (subtype === 'github') return Github
  if (subtype === 'linkedin') return Linkedin
  return Globe
}

function linkColor(subtype?: string): string {
  if (subtype === 'github') return 'text-gray-800 bg-gray-100'
  if (subtype === 'linkedin') return 'text-blue-600 bg-blue-50'
  return 'text-violet-600 bg-violet-50'
}

type AddMode = null | 'upload' | 'link' | 'note'

const AI_CHAT_STARTERS = [
  'What projects do I have in TypeScript?',
  'Summarize my work experience',
  'What are my top skills?',
  'What GitHub repos should I highlight?',
]

interface ChatMsg {
  role: 'user' | 'ai'
  text: string
}

const MOCK_AI_REPLIES: Record<string, string> = {
  default: 'Based on your context sources, I can help answer questions about your background, skills, and experience. Try asking about your projects, tech stack, or work history.',
  typescript: 'From your GitHub profile, you have TypeScript as your primary language (52% of code). Notable TypeScript projects include design-system-kit (⭐ 318) and ai-resume-parser (⭐ 91). Your resume also mentions TypeScript as a core skill.',
  experience: 'You have 5 years of experience. Currently Sr. Product Designer at TechCorp (2023–present). Previously UX Lead at LaunchPad (2021–2023) and UI Designer at Agency One (2019–2021). B.S. Computer Science from Howard University, 2019.',
  skills: 'Your top endorsed skills from LinkedIn: Product Design, React, User Research, Figma. Your GitHub shows TypeScript, Python, and CSS as technical strengths. Your resume highlights cross-functional collaboration and design system expertise.',
  github: 'Your strongest GitHub repos are: design-system-kit (⭐ 318) — a component library, ai-resume-parser (⭐ 91) — used by job seekers, and interview-prep-cli (⭐ 44). These would resonate well for a design engineering role.',
}

function getAiReply(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('typescript') || lower.includes('projects')) return MOCK_AI_REPLIES.typescript
  if (lower.includes('experience') || lower.includes('work history')) return MOCK_AI_REPLIES.experience
  if (lower.includes('skill')) return MOCK_AI_REPLIES.skills
  if (lower.includes('github') || lower.includes('repo')) return MOCK_AI_REPLIES.github
  return MOCK_AI_REPLIES.default
}

export default function ContextPage() {
  const [sources, setSources] = useState<ContextSource[]>(MOCK_SOURCES)
  const [selected, setSelected] = useState<ContextSource | null>(MOCK_SOURCES[0])
  const [search, setSearch] = useState('')
  const [addMode, setAddMode] = useState<AddMode>(null)
  const [addDropOpen, setAddDropOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([])
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const filtered = sources.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const sendChat = (text?: string) => {
    const msg = text ?? chatInput
    if (!msg.trim()) return
    const reply = getAiReply(msg)
    setChatMsgs(prev => [...prev, { role: 'user', text: msg }, { role: 'ai', text: reply }])
    setChatInput('')
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const deleteSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="lf-page-shell">
      <div className="lf-page-header">
        <div>
          <h1 className="lf-page-title">Context</h1>
          <p className="lf-body mt-0.5">Add sources that help AI understand you — used for Auto Apply, Interview Prep, and more.</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setAddDropOpen(v => !v)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Source
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {addDropOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAddDropOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1.5 w-48 rounded-xl border border-border bg-white py-1 shadow-lg">
                <button
                  onClick={() => { setAddMode('upload'); setAddDropOpen(false) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                >
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  Upload File
                </button>
                <button
                  onClick={() => { setAddMode('link'); setAddDropOpen(false) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                >
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  Add Link
                </button>
                <button
                  onClick={() => { setAddMode('note'); setAddDropOpen(false) }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                >
                  <PenLine className="h-4 w-4 text-muted-foreground" />
                  Write a Note
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[300px_1fr] gap-5 items-start mt-5">
        {/* ── Left: source list ── */}
        <div className="lf-panel p-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search sources…"
              className="lf-input pl-8 py-1.5 text-xs"
            />
          </div>

          <p className="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {filtered.length} source{filtered.length !== 1 ? 's' : ''}
          </p>

          <div className="space-y-0.5 max-h-[calc(100vh-260px)] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">No sources yet.</p>
            ) : filtered.map(src => (
              <SourceRow
                key={src.id}
                source={src}
                isSelected={selected?.id === src.id}
                onClick={() => setSelected(src)}
                onDelete={() => deleteSource(src.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Right: detail / editor ── */}
        <div className="sticky top-4 space-y-3">
          {!selected && !addMode ? (
            <div className="lf-panel flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-3 rounded-xl bg-primary/10 p-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Select a source</p>
              <p className="lf-body text-xs mt-1 max-w-xs">Pick a source from the list, or add one using the button above.</p>
            </div>
          ) : addMode ? (
            <AddPanel mode={addMode} onClose={() => setAddMode(null)} onAdd={(src) => {
              setSources(prev => [src, ...prev])
              setSelected(src)
              setAddMode(null)
            }} />
          ) : selected?.type === 'note' ? (
            <NoteEditor source={selected} onChange={(content) => {
              setSources(prev => prev.map(s => s.id === selected.id ? { ...s, content } : s))
              setSelected({ ...selected, content })
            }} />
          ) : (
            <SourceDetail source={selected!} />
          )}

          {/* AI Assistant panel */}
          {(selected || addMode === null) && (
            <div className="lf-panel overflow-hidden">
              <button
                onClick={() => setAiOpen(v => !v)}
                className="flex w-full items-center justify-between p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">AI Context Assistant</span>
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">BETA</span>
                </div>
                {aiOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {aiOpen && (
                <div className="border-t border-border">
                  {chatMsgs.length === 0 && (
                    <div className="p-3 space-y-2">
                      <p className="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Try asking</p>
                      <div className="flex flex-wrap gap-1.5">
                        {AI_CHAT_STARTERS.map(q => (
                          <button
                            key={q}
                            onClick={() => sendChat(q)}
                            className="rounded-full border border-border px-3 py-1 text-xs text-foreground hover:border-primary/50 hover:bg-primary/5 transition"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {chatMsgs.length > 0 && (
                    <div className="max-h-52 overflow-y-auto p-3 space-y-3">
                      {chatMsgs.map((m, i) => (
                        <div key={i} className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                          {m.role === 'ai' && (
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                              <Sparkles className="h-3 w-3 text-primary" />
                            </div>
                          )}
                          <div className={cn(
                            'max-w-[80%] rounded-xl px-3 py-2 text-xs',
                            m.role === 'user' ? 'bg-primary text-white' : 'bg-muted text-foreground'
                          )}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                      <div ref={chatBottomRef} />
                    </div>
                  )}

                  <div className="border-t border-border p-3 flex gap-2">
                    <input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendChat()}
                      placeholder="Ask about your context…"
                      className="lf-input flex-1 py-1.5 text-xs"
                    />
                    <button
                      onClick={() => sendChat()}
                      disabled={!chatInput.trim()}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-primary/90 disabled:opacity-40"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Source Row ── */

function SourceRow({ source, isSelected, onClick, onDelete }: {
  source: ContextSource
  isSelected: boolean
  onClick: () => void
  onDelete: () => void
}) {
  const [hover, setHover] = useState(false)

  const icon = source.type === 'file'
    ? fileIcon(source.ext)
    : source.type === 'link'
    ? linkIcon(source.subtype)
    : PenLine

  const iconCls = source.type === 'file'
    ? fileIconColor(source.ext)
    : source.type === 'link'
    ? linkColor(source.subtype)
    : 'text-amber-600 bg-amber-50'

  const IconEl = icon

  return (
    <div
      className={cn(
        'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 cursor-pointer transition-all',
        isSelected ? 'bg-primary/5 border border-primary/30' : 'border border-transparent hover:bg-muted'
      )}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', iconCls)}>
        <IconEl className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-foreground">{source.name}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{source.addedAt}{source.size ? ` · ${source.size}` : ''}</p>
      </div>
      {hover && (
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

/* ── Source Detail (file / link) ── */

function SourceDetail({ source }: { source: ContextSource }) {
  const IconEl = source.type === 'file' ? fileIcon(source.ext) : linkIcon(source.subtype)
  const iconCls = source.type === 'file' ? fileIconColor(source.ext) : linkColor(source.subtype)

  return (
    <div className="lf-panel p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', iconCls)}>
          <IconEl className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground">{source.name}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
              {source.type === 'link' ? source.subtype ?? 'link' : source.ext ?? 'file'}
            </span>
            <span className="text-[10px] text-muted-foreground">Added {source.addedAt}</span>
            {source.size && <span className="text-[10px] text-muted-foreground">{source.size}</span>}
          </div>
        </div>
      </div>

      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <Link2 className="h-3.5 w-3.5" />
          {source.url}
        </a>
      )}

      {source.summary && (
        <div className="rounded-xl border border-primary/20 bg-[#EEF4FF] p-4 space-y-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <p className="text-xs font-semibold text-primary">AI Summary</p>
          </div>
          <p className="text-xs text-foreground leading-relaxed">{source.summary}</p>
        </div>
      )}

      <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        This source is being used passively by Auto Apply and Interview Prep to personalize your responses.
      </div>
    </div>
  )
}

/* ── Note Editor ── */

function NoteEditor({ source, onChange }: { source: ContextSource; onChange: (content: string) => void }) {
  const [localContent, setLocalContent] = useState(source.content ?? '')

  const handleChange = (val: string) => {
    setLocalContent(val)
    onChange(val)
  }

  return (
    <div className="lf-panel p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <PenLine className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{source.name}</h2>
          <p className="text-[10px] text-muted-foreground">Note · Added {source.addedAt}</p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border pb-2">
        {['B', 'I', 'H1', 'H2', '•'].map(fmt => (
          <button
            key={fmt}
            className="rounded px-2 py-0.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            {fmt}
          </button>
        ))}
      </div>

      <textarea
        value={localContent}
        onChange={e => handleChange(e.target.value)}
        placeholder="Write your notes here… Supports markdown formatting."
        className="min-h-[240px] w-full resize-y rounded-lg border border-border bg-white p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
      />

      <p className="text-[10px] text-muted-foreground">Auto-saved · Used by AI for context</p>
    </div>
  )
}

/* ── Add Panel ── */

function AddPanel({ mode, onClose, onAdd }: {
  mode: 'upload' | 'link' | 'note'
  onClose: () => void
  onAdd: (src: ContextSource) => void
}) {
  const [linkType, setLinkType] = useState<'github' | 'linkedin' | 'portfolio'>('github')
  const [linkUrl, setLinkUrl] = useState('')
  const [noteName, setNoteName] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleAddLink = () => {
    if (!linkUrl.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
      setTimeout(() => {
        onAdd({
          id: Date.now().toString(),
          type: 'link',
          subtype: linkType,
          name: linkUrl.replace(/^https?:\/\//, ''),
          url: linkUrl,
          addedAt: 'Just now',
          summary: `AI is gathering information from ${linkUrl}. Summary will appear here once processing is complete — usually takes 10–30 seconds.`,
        })
      }, 1000)
    }, 2000)
  }

  const handleAddNote = () => {
    if (!noteName.trim()) return
    onAdd({
      id: Date.now().toString(),
      type: 'note',
      name: noteName,
      content: '',
      addedAt: 'Just now',
    })
  }

  if (mode === 'upload') {
    return (
      <div className="lf-panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Upload a File</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <p className="text-xs text-muted-foreground">Supported: PDF, DOCX, DOC, MD — max 10MB per file</p>

        <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-12 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition">
          <Upload className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">Click to upload or drag & drop</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, DOC, MD</p>
          <input type="file" accept=".pdf,.docx,.doc,.md" className="sr-only" onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const ext = file.name.split('.').pop()?.toLowerCase()
            onAdd({
              id: Date.now().toString(),
              type: 'file',
              name: file.name,
              ext,
              addedAt: 'Just now',
              size: `${Math.round(file.size / 1024)} KB`,
              summary: `AI is processing "${file.name}". A summary will appear here once extraction is complete.`,
            })
          }} />
        </label>
      </div>
    )
  }

  if (mode === 'link') {
    return (
      <div className="lf-panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Add a Link</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex gap-2">
          {LINK_SUBTYPES.map(lt => {
            const LIcon = lt.icon
            return (
              <button
                key={lt.key}
                onClick={() => setLinkType(lt.key as typeof linkType)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 rounded-xl border py-3 text-xs font-medium transition',
                  linkType === lt.key
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                )}
              >
                <LIcon className="h-4 w-4" />
                {lt.label}
              </button>
            )
          })}
        </div>

        <input
          value={linkUrl}
          onChange={e => setLinkUrl(e.target.value)}
          placeholder={LINK_SUBTYPES.find(l => l.key === linkType)?.placeholder}
          className="lf-input"
        />

        {done ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700">
            AI is gathering context from this link — summary coming shortly.
          </div>
        ) : (
          <button
            onClick={handleAddLink}
            disabled={!linkUrl.trim() || loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40"
          >
            {loading ? 'Analyzing link…' : 'Add & Analyze Link'}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="lf-panel p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Write a Note</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
      </div>
      <input
        value={noteName}
        onChange={e => setNoteName(e.target.value)}
        placeholder="Note name (e.g. Interview Prep Notes)"
        className="lf-input"
      />
      <button
        onClick={handleAddNote}
        disabled={!noteName.trim()}
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40"
      >
        Create Note
      </button>
    </div>
  )
}
