import { useState, useRef } from 'react'
import {
  FileText,
  Link2,
  PenLine,
  Plus,
  Search,
  GitBranch,
  Briefcase,
  Globe,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
  Upload,
  X,
  FileCode,
  File as FileIcon,
  CheckCircle2,
  ExternalLink,
  Clock,
  Layers,
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
    summary: 'GitHub profile with 42 public repositories. Primary languages: TypeScript (52%), Python (28%), CSS (12%). Notable repos: design-system-kit (⭐ 318), ai-resume-parser (⭐ 91), interview-prep-cli (⭐ 44). Consistent contribution history over 3 years.',
  },
  {
    id: '3',
    type: 'link',
    subtype: 'linkedin',
    name: 'linkedin.com/in/darnellsmith',
    url: 'https://linkedin.com/in/darnellsmith',
    addedAt: 'Jun 11, 2026',
    summary: 'LinkedIn profile with 500+ connections. Currently: Sr. Product Designer at TechCorp (2023–present). Previous: UX Lead at LaunchPad (2021–2023), UI Designer at Agency One (2019–2021). Education: B.S. Computer Science, Howard University 2019.',
  },
  {
    id: '4',
    type: 'note',
    name: 'Interview Prep Notes',
    content: `Why I want this role:\nI've been following this company's work for over a year and I'm genuinely excited about the problem they're solving — making design tools more collaborative and AI-native.\n\nMy biggest strengths:\n- Deep understanding of design systems at scale\n- Can bridge design and engineering effectively\n- Built and shipped products end-to-end\n\nProjects to mention:\n1. Design System Kit — open source, 300+ stars\n2. AI Resume Parser — used by 2,000+ job seekers\n3. Redesigned onboarding flow at LaunchPad — 40% conversion lift`,
    addedAt: 'Jun 12, 2026',
  },
  {
    id: '5',
    type: 'file',
    name: 'Cover_Letter_Template.docx',
    ext: 'docx',
    addedAt: 'Jun 13, 2026',
    size: '22 KB',
    summary: 'A customizable cover letter template tailored for product and design roles. Highlights collaborative work style, user-centric approach, and passion for shipping impactful products.',
  },
  {
    id: '6',
    type: 'link',
    subtype: 'portfolio',
    name: 'darnellsmith.design',
    url: 'https://darnellsmith.design',
    addedAt: 'Jun 13, 2026',
    summary: 'Personal portfolio showcasing 8 case studies. Featured: LaunchPad Onboarding Redesign, TechCorp Design System, AI Chat Interface. Strong visual storytelling with detailed process documentation.',
  },
]

type FilterTab = 'all' | 'file' | 'link' | 'note'
type AddMode = null | 'upload' | 'link' | 'note'

const LINK_SUBTYPES = [
  { key: 'github',    label: 'GitHub',    icon: GitBranch, placeholder: 'https://github.com/username',        color: 'text-gray-700 bg-gray-100' },
  { key: 'linkedin',  label: 'LinkedIn',  icon: Briefcase, placeholder: 'https://linkedin.com/in/username',   color: 'text-blue-600 bg-blue-50' },
  { key: 'portfolio', label: 'Portfolio', icon: Globe,      placeholder: 'https://yourportfolio.com',          color: 'text-violet-600 bg-violet-50' },
]

function typeIconEl(src: ContextSource): React.ElementType {
  if (src.type === 'note') return PenLine
  if (src.type === 'link') {
    if (src.subtype === 'github') return GitBranch
    if (src.subtype === 'linkedin') return Briefcase
    return Globe
  }
  if (src.ext === 'docx' || src.ext === 'doc') return FileCode
  if (src.ext === 'md') return FileIcon
  return FileText
}

function typeIconBg(src: ContextSource): string {
  if (src.type === 'note') return 'bg-amber-50 text-amber-600'
  if (src.type === 'link') {
    if (src.subtype === 'github') return 'bg-gray-100 text-gray-700'
    if (src.subtype === 'linkedin') return 'bg-blue-50 text-blue-600'
    return 'bg-violet-50 text-violet-600'
  }
  if (src.ext === 'pdf') return 'bg-red-50 text-red-500'
  if (src.ext === 'docx' || src.ext === 'doc') return 'bg-blue-50 text-blue-500'
  return 'bg-gray-100 text-gray-500'
}

function typeDot(src: ContextSource): string {
  if (src.type === 'note') return 'bg-amber-400'
  if (src.type === 'link') {
    if (src.subtype === 'github') return 'bg-gray-500'
    if (src.subtype === 'linkedin') return 'bg-blue-500'
    return 'bg-violet-500'
  }
  if (src.ext === 'pdf') return 'bg-red-400'
  return 'bg-blue-400'
}

interface ChatMsg { role: 'user' | 'ai'; text: string }

const AI_STARTERS = [
  'What projects do I have in TypeScript?',
  'Summarize my work experience',
  'What are my top skills?',
]

function getMockReply(input: string): string {
  const q = input.toLowerCase()
  if (q.includes('typescript') || q.includes('project'))
    return 'From your GitHub profile: TypeScript is your primary language (52%). Notable projects: design-system-kit (⭐ 318) and ai-resume-parser (⭐ 91).'
  if (q.includes('experience') || q.includes('work'))
    return '5 years experience. Currently Sr. Product Designer at TechCorp. Prior: UX Lead at LaunchPad, UI Designer at Agency One. B.S. Computer Science, Howard University.'
  if (q.includes('skill'))
    return 'Top skills from LinkedIn: Product Design, React, User Research, Figma. GitHub shows TypeScript, Python, CSS as technical strengths.'
  return 'Based on your context sources, I found relevant information. Ask me something specific about your background, projects, or skills.'
}

export default function ContextPage() {
  const [sources, setSources]     = useState<ContextSource[]>(MOCK_SOURCES)
  const [selected, setSelected]   = useState<ContextSource | null>(MOCK_SOURCES[0])
  const [filter, setFilter]       = useState<FilterTab>('all')
  const [search, setSearch]       = useState('')
  const [addMode, setAddMode]     = useState<AddMode>(null)
  const [addDropOpen, setAddDropOpen] = useState(false)
  const [aiOpen, setAiOpen]       = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMsgs, setChatMsgs]   = useState<ChatMsg[]>([])
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const filtered = sources.filter(s => {
    const matchType = filter === 'all' || s.type === filter
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const counts = {
    file: sources.filter(s => s.type === 'file').length,
    link: sources.filter(s => s.type === 'link').length,
    note: sources.filter(s => s.type === 'note').length,
  }

  const sendChat = (text?: string) => {
    const msg = (text ?? chatInput).trim()
    if (!msg) return
    const reply = getMockReply(msg)
    setChatMsgs(prev => [...prev, { role: 'user', text: msg }, { role: 'ai', text: reply }])
    setChatInput('')
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }

  const deleteSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const addSource = (src: ContextSource) => {
    setSources(prev => [src, ...prev])
    setSelected(src)
    setAddMode(null)
  }

  return (
    <div className="flex flex-col h-full min-h-0 px-8 py-6 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-5 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-4 w-4 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Context</h1>
          </div>
          <p className="text-xs text-muted-foreground">Sources that help AI understand you — used across Auto Apply, Interview Prep & more.</p>
          <div className="flex items-center gap-3 mt-2.5">
            <Chip label={`${counts.file} file${counts.file !== 1 ? 's' : ''}`} color="red" />
            <Chip label={`${counts.link} link${counts.link !== 1 ? 's' : ''}`} color="blue" />
            <Chip label={`${counts.note} note${counts.note !== 1 ? 's' : ''}`} color="amber" />
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setAddDropOpen(v => !v)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add Source <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>
          {addDropOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAddDropOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1.5 w-44 rounded-xl border border-border bg-white shadow-xl py-1.5">
                {[
                  { mode: 'upload' as AddMode, icon: Upload, label: 'Upload File' },
                  { mode: 'link'   as AddMode, icon: Link2,  label: 'Add Link' },
                  { mode: 'note'   as AddMode, icon: PenLine, label: 'Write a Note' },
                ].map(({ mode, icon: Icon, label }) => (
                  <button key={label} onClick={() => { setAddMode(mode); setAddDropOpen(false) }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Two-panel body ── */}
      <div className="flex flex-1 min-h-0 gap-0 -mx-8 border-t border-border">

        {/* Left: source list */}
        <div className="w-[260px] shrink-0 border-r border-border flex flex-col bg-white">
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full rounded-lg border border-border bg-muted/40 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-border">
            {(['all', 'file', 'link', 'note'] as FilterTab[]).map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize transition',
                  filter === t ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                )}>
                {t === 'all' ? `All (${sources.length})` : t === 'file' ? `Files` : t === 'link' ? `Links` : `Notes`}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <p className="text-xs text-muted-foreground">No sources found.</p>
              </div>
            ) : filtered.map(src => (
              <SourceRow
                key={src.id}
                source={src}
                isSelected={selected?.id === src.id}
                onClick={() => { setSelected(src); setAddMode(null) }}
                onDelete={() => deleteSource(src.id)}
              />
            ))}
          </div>
        </div>

        {/* Right: detail / editor */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#FAFAFA]">
          <div className="flex-1 overflow-y-auto">
            {addMode ? (
              <AddPanel mode={addMode} onClose={() => setAddMode(null)} onAdd={addSource} />
            ) : !selected ? (
              <EmptyState onAdd={() => setAddDropOpen(true)} />
            ) : selected.type === 'note' ? (
              <NoteEditor source={selected} onChange={content => {
                setSources(prev => prev.map(s => s.id === selected.id ? { ...s, content } : s))
                setSelected({ ...selected, content })
              }} />
            ) : (
              <SourceDetail source={selected} />
            )}
          </div>

          {/* AI assistant panel */}
          <div className="shrink-0 border-t border-border bg-white">
            <button
              onClick={() => setAiOpen(v => !v)}
              className="flex w-full items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">Context AI</span>
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-primary">BETA</span>
                <span className="text-[10px] text-muted-foreground ml-1">· Passive context active across all AI features</span>
              </div>
              {aiOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>

            {aiOpen && (
              <div className="border-t border-border">
                {chatMsgs.length === 0 && (
                  <div className="flex flex-wrap gap-1.5 px-5 py-3">
                    {AI_STARTERS.map(q => (
                      <button key={q} onClick={() => sendChat(q)}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition">
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {chatMsgs.length > 0 && (
                  <div className="max-h-44 overflow-y-auto px-5 py-3 space-y-3">
                    {chatMsgs.map((m, i) => (
                      <div key={i} className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {m.role === 'ai' && (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                            <Sparkles className="h-3 w-3 text-primary" />
                          </div>
                        )}
                        <div className={cn('max-w-[75%] rounded-xl px-3 py-2 text-xs leading-relaxed',
                          m.role === 'user' ? 'bg-primary text-white' : 'bg-muted text-foreground')}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>
                )}

                <div className="flex items-center gap-2 border-t border-border px-4 py-2.5">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChat()}
                    placeholder="Ask about your context…"
                    className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button onClick={() => sendChat()} disabled={!chatInput.trim()}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-primary/90 disabled:opacity-30">
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Chip ── */
function Chip({ label, color }: { label: string; color: 'red' | 'blue' | 'amber' }) {
  const cls = {
    red:   'bg-red-50 text-red-500 border-red-100',
    blue:  'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  }[color]
  return <span className={cn('rounded-full border px-2.5 py-0.5 text-[11px] font-medium', cls)}>{label}</span>
}

/* ── Source Row ── */
function SourceRow({ source, isSelected, onClick, onDelete }: {
  source: ContextSource; isSelected: boolean; onClick: () => void; onDelete: () => void
}) {
  const [hover, setHover] = useState(false)
  const IconEl = typeIconEl(source)
  const bg = typeIconBg(source)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        'relative flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors',
        isSelected ? 'bg-primary/5' : 'hover:bg-muted/60'
      )}
    >
      {isSelected && <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-primary" />}
      <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', bg)}>
        <IconEl className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-xs font-medium', isSelected ? 'text-primary' : 'text-foreground')}>
          {source.name}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{source.addedAt}</p>
      </div>
      {hover && (
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

/* ── Empty State ── */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Layers className="h-7 w-7 text-primary" />
      </div>
      <h2 className="text-sm font-semibold text-foreground mb-1.5">No source selected</h2>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
        Select a source from the list, or add files, links, and notes to build your context library.
      </p>
      <button onClick={onAdd}
        className="mt-5 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition">
        <Plus className="h-4 w-4" /> Add your first source
      </button>
    </div>
  )
}

/* ── Source Detail ── */
function SourceDetail({ source }: { source: ContextSource }) {
  const IconEl = typeIconEl(source)
  const bg = typeIconBg(source)
  const LinkIcon = source.subtype === 'github' ? GitBranch : source.subtype === 'linkedin' ? Briefcase : Globe

  const githubStats = source.subtype === 'github'
    ? [{ label: 'Public Repos', value: '42' }, { label: 'Top Language', value: 'TypeScript' }, { label: 'Total Stars', value: '453' }]
    : null

  const linkedinStats = source.subtype === 'linkedin'
    ? [{ label: 'Connections', value: '500+' }, { label: 'Endorsements', value: '12' }, { label: 'Years Exp.', value: '5' }]
    : null

  return (
    <div className="max-w-2xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', bg)}>
          <IconEl className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-foreground leading-tight">{source.name}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize', typeIconBg(source))}>
              <span className={cn('h-1.5 w-1.5 rounded-full', typeDot(source))} />
              {source.type === 'link' ? (source.subtype ?? 'link') : (source.ext ?? source.type)}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" /> Added {source.addedAt}
            </span>
            {source.size && <span className="text-[10px] text-muted-foreground">{source.size}</span>}
          </div>
        </div>
      </div>

      {/* Link URL */}
      {source.url && (
        <a href={source.url} target="_blank" rel="noreferrer"
          className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-xs text-primary hover:border-primary/40 hover:bg-primary/5 transition mb-5 w-fit">
          <LinkIcon className="h-3.5 w-3.5 shrink-0" />
          {source.url}
          <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
        </a>
      )}

      {/* Stats row (links) */}
      {(githubStats ?? linkedinStats) && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {(githubStats ?? linkedinStats)!.map(stat => (
            <div key={stat.label} className="rounded-xl border border-border bg-white px-4 py-3 text-center">
              <p className="text-base font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* AI Summary */}
      {source.summary && (
        <div className="rounded-xl border border-primary/20 bg-[#EEF4FF] p-4 mb-5">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/20">
              <Sparkles className="h-3 w-3 text-primary" />
            </div>
            <p className="text-xs font-semibold text-primary">AI Summary</p>
          </div>
          <p className="text-xs text-foreground leading-relaxed">{source.summary}</p>
        </div>
      )}

      {/* Used in */}
      <div className="rounded-xl border border-border bg-white p-4">
        <p className="text-xs font-semibold text-foreground mb-3">Active in</p>
        <div className="flex flex-wrap gap-2">
          {['Auto Apply', 'Interview Prep', 'Cover Letter'].map(feature => (
            <span key={feature} className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-medium text-green-700">
              <CheckCircle2 className="h-3 w-3" /> {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Note Editor ── */
function NoteEditor({ source, onChange }: { source: ContextSource; onChange: (c: string) => void }) {
  const [content, setContent] = useState(source.content ?? '')
  const [saved, setSaved] = useState(true)

  const handleChange = (val: string) => {
    setContent(val)
    setSaved(false)
    onChange(val)
    setTimeout(() => setSaved(true), 800)
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-600">
            <PenLine className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold text-foreground">{source.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">{wordCount} words</span>
          <span className={cn('text-[10px] font-medium transition-colors', saved ? 'text-green-600' : 'text-muted-foreground')}>
            {saved ? '✓ Saved' : 'Saving…'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5 border-b border-border bg-white px-5 py-1.5">
        {['B', 'I', 'U', '—', 'H1', 'H2', '•', '1.'].map(fmt => (
          <button key={fmt} className="rounded px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition">
            {fmt}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-[#FAFAFA]">
        <div className="max-w-2xl mx-auto">
          <textarea
            value={content}
            onChange={e => handleChange(e.target.value)}
            placeholder="Start writing… Paste in notes, talking points, answers to common interview questions, or anything that helps AI understand you better."
            className="w-full min-h-[400px] resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}

/* ── Add Panel ── */
function AddPanel({ mode, onClose, onAdd }: {
  mode: 'upload' | 'link' | 'note'; onClose: () => void; onAdd: (src: ContextSource) => void
}) {
  const [linkType, setLinkType] = useState<'github' | 'linkedin' | 'portfolio'>('github')
  const [linkUrl, setLinkUrl]   = useState('')
  const [noteName, setNoteName] = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  const handleAddLink = () => {
    if (!linkUrl.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
      setTimeout(() => {
        onAdd({
          id: Date.now().toString(),
          type: 'link', subtype: linkType,
          name: linkUrl.replace(/^https?:\/\//, ''),
          url: linkUrl, addedAt: 'Just now',
          summary: `AI is gathering information from ${linkUrl}. Summary will appear once processing completes — usually 10–30 seconds.`,
        })
      }, 1000)
    }, 2000)
  }

  return (
    <div className="max-w-xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-foreground">
          {mode === 'upload' ? 'Upload a File' : mode === 'link' ? 'Add a Link' : 'Write a Note'}
        </h2>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition">
          <X className="h-4 w-4" />
        </button>
      </div>

      {mode === 'upload' && (
        <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white px-8 py-16 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition group">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted group-hover:bg-primary/10 transition">
            <Upload className="h-7 w-7 text-muted-foreground group-hover:text-primary transition" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Click to upload or drag & drop</p>
          <p className="text-xs text-muted-foreground">PDF, DOCX, DOC, MD — max 10MB</p>
          <input type="file" accept=".pdf,.docx,.doc,.md" className="sr-only" onChange={e => {
            const file = e.target.files?.[0]
            if (!file) return
            const ext = file.name.split('.').pop()?.toLowerCase()
            onAdd({ id: Date.now().toString(), type: 'file', name: file.name, ext, addedAt: 'Just now', size: `${Math.round(file.size / 1024)} KB`, summary: `AI is processing "${file.name}". A summary will appear once extraction is complete.` })
          }} />
        </label>
      )}

      {mode === 'link' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {LINK_SUBTYPES.map(lt => {
              const LIcon = lt.icon
              return (
                <button key={lt.key} onClick={() => setLinkType(lt.key as typeof linkType)}
                  className={cn('flex flex-col items-center gap-1.5 rounded-xl border py-4 text-xs font-medium transition',
                    linkType === lt.key ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/30 bg-white')}>
                  <LIcon className="h-5 w-5" /> {lt.label}
                </button>
              )
            })}
          </div>

          <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
            placeholder={LINK_SUBTYPES.find(l => l.key === linkType)?.placeholder}
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />

          {done
            ? <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> AI is analyzing this link — summary coming shortly.
              </div>
            : <button onClick={handleAddLink} disabled={!linkUrl.trim() || loading}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40">
                {loading ? 'Analyzing link…' : 'Add & Analyze Link →'}
              </button>
          }
        </div>
      )}

      {mode === 'note' && (
        <div className="space-y-4">
          <input value={noteName} onChange={e => setNoteName(e.target.value)}
            placeholder="Note title (e.g. Interview Prep Notes)"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          <button onClick={() => onAdd({ id: Date.now().toString(), type: 'note', name: noteName, content: '', addedAt: 'Just now' })}
            disabled={!noteName.trim()}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40">
            Create Note →
          </button>
        </div>
      )}
    </div>
  )
}
