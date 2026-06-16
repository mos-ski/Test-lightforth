import { useState } from 'react'
import {
  FileText,
  Link2,
  PenLine,
  Upload,
  Globe,
  GitBranch,
  Briefcase,
  Trash2,
  FolderOpen,
  X,
  FileCode,
  File as FileIcon,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SourceType = 'file' | 'link' | 'note'

interface ContextSource {
  id: string
  type: SourceType
  name: string
  subtype?: 'github' | 'linkedin' | 'portfolio'
  url?: string
  content?: string
  addedAt: string
  size?: string
  ext?: string
}

const MOCK_SOURCES: ContextSource[] = [
  { id: '1', type: 'file', name: 'Darnell_Smith_Resume.pdf',             ext: 'pdf',  addedAt: 'Jun 10, 2026', size: '124 KB' },
  { id: '2', type: 'link', subtype: 'github',    name: 'github.com/darnellsmith',        url: 'https://github.com/darnellsmith',        addedAt: 'Jun 11, 2026' },
  { id: '3', type: 'link', subtype: 'linkedin',  name: 'linkedin.com/in/darnellsmith',   url: 'https://linkedin.com/in/darnellsmith',   addedAt: 'Jun 11, 2026' },
  { id: '4', type: 'note', name: 'Interview Prep Notes',                                  addedAt: 'Jun 12, 2026' },
  { id: '5', type: 'file', name: 'Cover_Letter_Template.docx',           ext: 'docx', addedAt: 'Jun 13, 2026', size: '22 KB' },
  { id: '6', type: 'link', subtype: 'portfolio', name: 'darnellsmith.design',             url: 'https://darnellsmith.design',            addedAt: 'Jun 13, 2026' },
]

type ModalMode = null | 'upload' | 'link' | 'note'

function typeIcon(src: ContextSource): React.ElementType {
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

function typeIconCls(src: ContextSource): string {
  if (src.type === 'note') return 'text-amber-500 bg-amber-50'
  if (src.type === 'link') {
    if (src.subtype === 'github') return 'text-gray-600 bg-gray-100'
    if (src.subtype === 'linkedin') return 'text-blue-600 bg-blue-50'
    return 'text-violet-600 bg-violet-50'
  }
  if (src.ext === 'pdf') return 'text-red-500 bg-red-50'
  if (src.ext === 'docx' || src.ext === 'doc') return 'text-blue-500 bg-blue-50'
  return 'text-gray-500 bg-gray-100'
}

function typeLabel(src: ContextSource): string {
  if (src.type === 'note') return 'Note'
  if (src.type === 'link') {
    if (src.subtype === 'github') return 'GitHub'
    if (src.subtype === 'linkedin') return 'LinkedIn'
    if (src.subtype === 'portfolio') return 'Portfolio'
    return 'Link'
  }
  return (src.ext ?? 'File').toUpperCase()
}

export default function ContextPage() {
  const [sources, setSources] = useState<ContextSource[]>(MOCK_SOURCES)
  const [modalMode, setModalMode] = useState<ModalMode>(null)

  const deleteSource = (id: string) => setSources(prev => prev.filter(s => s.id !== id))

  const addSource = (src: ContextSource) => {
    setSources(prev => [src, ...prev])
    setModalMode(null)
  }

  return (
    <div className="lf-page-shell">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="lf-page-title">Context</h1>
          <p className="lf-body mt-0.5">Add files, links, and notes to give AI more context about you.</p>
        </div>
        <button
          onClick={() => setModalMode('upload')}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
        >
          + Add Document
        </button>
      </div>

      {/* Empty state */}
      {sources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <FolderOpen className="h-10 w-10 text-muted-foreground mb-4" strokeWidth={1.5} />
          <p className="text-sm font-semibold text-foreground mb-1.5">No context added yet</p>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            Upload documents to give AI more context — resumes, cover letters, notes, LinkedIn profiles, GitHub, or your portfolio.
          </p>
          <button
            onClick={() => setModalMode('upload')}
            className="mt-5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Add Document
          </button>
        </div>
      ) : (
        <div className="lf-table-wrap">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">Name</th>
                <th className="lf-table-th">Type</th>
                <th className="lf-table-th">Size / URL</th>
                <th className="lf-table-th">Added</th>
                <th className="lf-table-th w-10" />
              </tr>
            </thead>
            <tbody>
              {sources.map(src => {
                const Icon = typeIcon(src)
                const iconCls = typeIconCls(src)
                return (
                  <tr key={src.id} className="lf-table-row group">
                    <td className="lf-table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md', iconCls)}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-medium text-foreground truncate max-w-xs">
                          {src.name}
                        </span>
                      </div>
                    </td>
                    <td className="lf-table-cell">
                      <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', iconCls)}>
                        {typeLabel(src)}
                      </span>
                    </td>
                    <td className="lf-table-cell text-xs text-muted-foreground">
                      {src.url ? (
                        <a href={src.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline">
                          {src.url.replace(/^https?:\/\//, '')}
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      ) : src.size ?? '—'}
                    </td>
                    <td className="lf-table-cell text-xs text-muted-foreground">{src.addedAt}</td>
                    <td className="lf-table-cell">
                      <button
                        onClick={() => deleteSource(src.id)}
                        className="opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-500 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add modal */}
      {modalMode && (
        <AddModal
          mode={modalMode}
          onClose={() => setModalMode(null)}
          onSelectMode={setModalMode}
          onAdd={addSource}
        />
      )}
    </div>
  )
}

/* ── Add Modal ── */

const LINK_SUBTYPES = [
  { key: 'github',    label: 'GitHub',    icon: GitBranch, placeholder: 'https://github.com/username' },
  { key: 'linkedin',  label: 'LinkedIn',  icon: Briefcase, placeholder: 'https://linkedin.com/in/username' },
  { key: 'portfolio', label: 'Portfolio', icon: Globe,     placeholder: 'https://yourportfolio.com' },
]

function AddModal({ mode, onClose, onSelectMode, onAdd }: {
  mode: ModalMode
  onClose: () => void
  onSelectMode: (m: ModalMode) => void
  onAdd: (src: ContextSource) => void
}) {
  const [linkSubtype, setLinkSubtype] = useState<'github' | 'linkedin' | 'portfolio'>('github')
  const [linkUrl, setLinkUrl]         = useState('')
  const [noteName, setNoteName]       = useState('')
  const [noteBody, setNoteBody]       = useState('')
  const [loading, setLoading]         = useState(false)
  const [done, setDone]               = useState(false)

  const handleAddLink = () => {
    if (!linkUrl.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
      setTimeout(() => {
        onAdd({ id: Date.now().toString(), type: 'link', subtype: linkSubtype, name: linkUrl.replace(/^https?:\/\//, ''), url: linkUrl, addedAt: 'Just now' })
      }, 800)
    }, 1800)
  }

  const handleAddNote = () => {
    if (!noteName.trim()) return
    onAdd({ id: Date.now().toString(), type: 'note', name: noteName, content: noteBody, addedAt: 'Just now' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {mode === 'upload' ? 'Add Document' : mode === 'link' ? 'Add a Link' : 'Write a Note'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === 'upload'
                ? 'The contents will be used to give AI context about you.'
                : mode === 'link'
                ? 'AI will read and summarize the linked page.'
                : 'Write anything — talking points, interview prep, background info.'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {/* Entry point: show 3 options */}
          {mode === 'upload' && (
            <>
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-white transition hover:bg-foreground/90">
                <Upload className="h-4 w-4" /> Upload Documents
                <input type="file" accept=".pdf,.docx,.doc,.md" className="sr-only" onChange={e => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const ext = file.name.split('.').pop()?.toLowerCase()
                  onAdd({ id: Date.now().toString(), type: 'file', name: file.name, ext, addedAt: 'Just now', size: `${Math.round(file.size / 1024)} KB` })
                }} />
              </label>

              <button
                onClick={() => onSelectMode('link')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <Globe className="h-4 w-4 text-muted-foreground" /> Scrape from URL
              </button>

              <button
                onClick={() => onSelectMode('note')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <PenLine className="h-4 w-4 text-muted-foreground" /> Input Manually
              </button>
            </>
          )}

          {/* Link flow */}
          {mode === 'link' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {LINK_SUBTYPES.map(lt => {
                  const LIcon = lt.icon
                  return (
                    <button key={lt.key} onClick={() => setLinkSubtype(lt.key as typeof linkSubtype)}
                      className={cn('flex flex-col items-center gap-1.5 rounded-xl border py-3.5 text-xs font-medium transition',
                        linkSubtype === lt.key ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/30')}>
                      <LIcon className="h-4 w-4" /> {lt.label}
                    </button>
                  )
                })}
              </div>

              <input
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder={LINK_SUBTYPES.find(l => l.key === linkSubtype)?.placeholder}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />

              {done ? (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> Link added — AI summary incoming.
                </div>
              ) : (
                <button onClick={handleAddLink} disabled={!linkUrl.trim() || loading}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40">
                  {loading ? 'Analyzing…' : 'Add Link'}
                </button>
              )}

              <button onClick={() => onSelectMode('upload')}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition">
                ← Back
              </button>
            </>
          )}

          {/* Note flow */}
          {mode === 'note' && (
            <>
              <input
                value={noteName}
                onChange={e => setNoteName(e.target.value)}
                placeholder="Title (e.g. Interview Prep Notes)"
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <textarea
                value={noteBody}
                onChange={e => setNoteBody(e.target.value)}
                placeholder="Write your notes here…"
                rows={6}
                className="w-full rounded-lg border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
              />
              <button onClick={handleAddNote} disabled={!noteName.trim()}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40">
                Save Note
              </button>
              <button onClick={() => onSelectMode('upload')}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition">
                ← Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
