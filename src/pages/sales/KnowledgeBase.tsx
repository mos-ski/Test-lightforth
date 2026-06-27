import { Fragment, useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ChevronDown, FileText, Globe, Link2, Mail, Phone, Plus, Share2, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  addDocument, removeDocument, toggleDocument,
  addFaq, updateFaq, removeFaq, toggleFaq,
  addKnowledgeCenterCategory, saveKnowledgeCenterBody, removeKnowledgeCenterEntry, toggleKnowledgeCenterEntry,
  addTextEntry, updateTextEntry, removeTextEntry, toggleTextEntry,
  addLink, markLinkScraped, removeLink, toggleLink,
  type KnowledgeFaq, type KnowledgeTextEntry, type LinkType, type SalesOrg,
} from './mockOrg'
import { KnowledgeCard, Modal, ToggleSwitch } from './components'
import type { SalesDashboardContext } from './SalesAdminLayout'

type KbTab = 'documents' | 'faqs' | 'knowledge-center' | 'text' | 'links'
const KB_TABS: { id: KbTab; label: string }[] = [
  { id: 'documents', label: 'Documents' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'knowledge-center', label: 'Knowledge center' },
  { id: 'text', label: 'Text' },
  { id: 'links', label: 'Links' },
]

interface TabProps {
  adminEmail: string
  org: SalesOrg
  refresh: () => void
}

function EmptyState({ label }: { label: string }) {
  return <p className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-slate-400">{label}</p>
}

export default function KnowledgeBase() {
  const { adminEmail, org, refresh } = useOutletContext<SalesDashboardContext>()
  const [activeTab, setActiveTab] = useState<KbTab>('documents')

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
      <p className="mt-1 text-sm text-slate-500">Everything Copilot can pull from during a live sales call — toggle anything off without deleting it.</p>

      <div className="lf-tabs mt-6">
        {KB_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('lf-tab', activeTab === tab.id && 'lf-tab-active')}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'documents' && <DocumentsTab adminEmail={adminEmail} org={org} refresh={refresh} />}
        {activeTab === 'faqs' && <FaqsTab adminEmail={adminEmail} org={org} refresh={refresh} />}
        {activeTab === 'knowledge-center' && <KnowledgeCenterTab adminEmail={adminEmail} org={org} refresh={refresh} />}
        {activeTab === 'text' && <TextTab adminEmail={adminEmail} org={org} refresh={refresh} />}
        {activeTab === 'links' && <LinksTab adminEmail={adminEmail} org={org} refresh={refresh} />}
      </div>
    </div>
  )
}

function DocumentsTab({ adminEmail, org, refresh }: TabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const documents = org.knowledgeBase.documents

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-500">Anything Lightforth needs to know your sales motion well — playbooks, pricing sheets, case studies.</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex h-9 flex-shrink-0 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          <Upload className="h-4 w-4" /> Upload file
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) { addDocument(adminEmail, file.name); refresh() }
            e.target.value = ''
          }}
        />
      </div>
      <div className="mt-4 space-y-3">
        {documents.length === 0 ? (
          <EmptyState label="No documents yet — upload your first playbook to get started." />
        ) : (
          documents.map(doc => (
            <KnowledgeCard
              key={doc.id}
              enabled={doc.enabled}
              onToggleEnabled={() => { toggleDocument(adminEmail, doc.id); refresh() }}
              onDelete={() => { removeDocument(adminEmail, doc.id); refresh() }}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <span className="truncate text-sm font-medium text-slate-900">{doc.name}</span>
              </div>
            </KnowledgeCard>
          ))
        )}
      </div>
    </div>
  )
}

function FaqsTab({ adminEmail, org, refresh }: TabProps) {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const faqs = org.knowledgeBase.faqs
  const canSave = question.trim().length > 0 && answer.trim().length > 0

  function openAdd() { setEditingId(null); setQuestion(''); setAnswer(''); setShowModal(true) }
  function openEdit(faq: KnowledgeFaq) { setEditingId(faq.id); setQuestion(faq.question); setAnswer(faq.answer); setShowModal(true) }
  function save() {
    if (!canSave) return
    if (editingId) updateFaq(adminEmail, editingId, { question, answer })
    else addFaq(adminEmail, { question, answer })
    refresh()
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-500">Questions and answers Copilot can pull from live.</p>
        <button onClick={openAdd} className="flex h-9 flex-shrink-0 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      {showModal && (
        <Modal title={editingId ? 'Edit FAQ' : 'Add FAQ'} onClose={() => setShowModal(false)}>
          <label className="lf-label mb-1.5 block">Question</label>
          <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g. Do you offer a free trial?" className="lf-input" />
          <label className="lf-label mb-1.5 mt-4 block">Answer</label>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Write the answer..." className="lf-input h-24 resize-none py-2.5" />
          <div className="mt-5 flex gap-3">
            <button onClick={save} disabled={!canSave} className="h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-40">Save</button>
            <button onClick={() => setShowModal(false)} className="h-9 rounded-lg px-4 text-sm font-semibold text-slate-500 hover:bg-muted">Cancel</button>
          </div>
        </Modal>
      )}

      <div className="mt-4 space-y-3">
        {faqs.length === 0 ? (
          <EmptyState label="No FAQs yet — add the questions prospects ask most." />
        ) : (
          faqs.map(faq => (
            <KnowledgeCard
              key={faq.id}
              enabled={faq.enabled}
              onToggleEnabled={() => { toggleFaq(adminEmail, faq.id); refresh() }}
              onEdit={() => openEdit(faq)}
              onDelete={() => { removeFaq(adminEmail, faq.id); refresh() }}
            >
              <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
            </KnowledgeCard>
          ))
        )}
      </div>
    </div>
  )
}

function formatLastUpdated(iso: string | null): string {
  if (!iso) return 'Not added yet'
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' })
}

function KnowledgeCenterTab({ adminEmail, org, refresh }: TabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [draftBody, setDraftBody] = useState('')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryTitle, setNewCategoryTitle] = useState('')
  const entries = org.knowledgeBase.knowledgeCenter

  function toggleExpand(id: string, currentBody: string) {
    if (expandedId === id) { setExpandedId(null); return }
    setExpandedId(id)
    setDraftBody(currentBody)
  }

  function save(id: string) {
    saveKnowledgeCenterBody(adminEmail, id, draftBody)
    refresh()
  }

  function addCategory() {
    if (!newCategoryTitle.trim()) return
    addKnowledgeCenterCategory(adminEmail, newCategoryTitle.trim())
    refresh()
    setNewCategoryTitle('')
    setShowAddCategory(false)
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-500">Named policies and instructions, organized your way — add whatever categories make sense for your team.</p>
        <button onClick={() => setShowAddCategory(true)} className="flex h-9 flex-shrink-0 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {showAddCategory && (
        <Modal title="Add category" onClose={() => setShowAddCategory(false)}>
          <label className="lf-label mb-1.5 block">Category name</label>
          <input value={newCategoryTitle} onChange={e => setNewCategoryTitle(e.target.value)} placeholder="e.g. Refund Policy" className="lf-input" />
          <div className="mt-5 flex gap-3">
            <button onClick={addCategory} disabled={!newCategoryTitle.trim()} className="h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-40">Add</button>
            <button onClick={() => setShowAddCategory(false)} className="h-9 rounded-lg px-4 text-sm font-semibold text-slate-500 hover:bg-muted">Cancel</button>
          </div>
        </Modal>
      )}

      {entries.length === 0 ? (
        <div className="mt-4">
          <EmptyState label="Nothing here yet — click Add to create your first category." />
        </div>
      ) : (
        <div className="mt-4 lf-table-wrap">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">Category</th>
                <th className="lf-table-th">Last update</th>
                <th className="lf-table-th text-right">Enabled</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => {
                const expanded = expandedId === entry.id
                return (
                  <Fragment key={entry.id}>
                    <tr className="lf-table-row cursor-pointer" onClick={() => toggleExpand(entry.id, entry.body)}>
                      <td className="lf-table-cell">
                        <div className="flex items-center gap-2">
                          <ChevronDown className={cn('h-4 w-4 flex-shrink-0 text-slate-400 transition-transform', expanded && 'rotate-180')} />
                          <span className="font-medium text-slate-900">{entry.title}</span>
                        </div>
                      </td>
                      <td className="lf-table-cell text-slate-500">{formatLastUpdated(entry.lastUpdated)}</td>
                      <td className="lf-table-cell text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-3">
                          <ToggleSwitch checked={entry.enabled} onChange={() => { toggleKnowledgeCenterEntry(adminEmail, entry.id); refresh() }} />
                          {!entry.permanent && (
                            <button onClick={() => { removeKnowledgeCenterEntry(adminEmail, entry.id); refresh() }} title="Delete category" className="text-slate-400 hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expanded && (
                      <tr>
                        <td colSpan={3} className="bg-slate-50/60 px-4 py-4">
                          <textarea
                            value={draftBody}
                            onChange={e => setDraftBody(e.target.value)}
                            placeholder="Write or paste the content for this category..."
                            className="lf-input h-28 resize-none bg-white py-2.5"
                          />
                          <button onClick={() => save(entry.id)} className="mt-3 h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">
                            Save
                          </button>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function TextTab({ adminEmail, org, refresh }: TabProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [body, setBody] = useState('')
  const entries = org.knowledgeBase.text
  const canSave = body.trim().length > 0

  function openAdd() { setEditingId(null); setBody(''); setShowForm(true) }
  function openEdit(entry: KnowledgeTextEntry) { setEditingId(entry.id); setBody(entry.body); setShowForm(true) }
  function save() {
    if (!canSave) return
    if (editingId) updateTextEntry(adminEmail, editingId, body)
    else addTextEntry(adminEmail, body)
    refresh()
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-500">Anything you want to just write — quick notes, talk tracks, reminders.</p>
        <button onClick={openAdd} className="flex h-9 flex-shrink-0 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add text
        </button>
      </div>

      {showForm && (
        <div className="mt-4 lf-panel p-5">
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write or paste here..." className="lf-input h-28 resize-none py-2.5" />
          <div className="mt-4 flex gap-3">
            <button onClick={save} disabled={!canSave} className="h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-40">Save</button>
            <button onClick={() => setShowForm(false)} className="h-9 rounded-lg px-4 text-sm font-semibold text-slate-500 hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {entries.length === 0 ? (
          <EmptyState label="Nothing written yet." />
        ) : (
          entries.map(entry => (
            <KnowledgeCard
              key={entry.id}
              enabled={entry.enabled}
              onToggleEnabled={() => { toggleTextEntry(adminEmail, entry.id); refresh() }}
              onEdit={() => openEdit(entry)}
              onDelete={() => { removeTextEntry(adminEmail, entry.id); refresh() }}
            >
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{entry.body}</p>
            </KnowledgeCard>
          ))
        )}
      </div>
    </div>
  )
}

const LINK_TYPES: { id: LinkType; label: string; icon: typeof Globe; placeholder: string }[] = [
  { id: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourcompany.com/pricing' },
  { id: 'email', label: 'Email', icon: Mail, placeholder: 'support@yourcompany.com' },
  { id: 'phone', label: 'Phone', icon: Phone, placeholder: '+1 (555) 123-4567' },
  { id: 'social', label: 'Social', icon: Share2, placeholder: 'https://twitter.com/yourcompany' },
  { id: 'other', label: 'Other', icon: Link2, placeholder: 'Any other contact or reference link' },
]

function LinksTab({ adminEmail, org, refresh }: TabProps) {
  const [type, setType] = useState<LinkType>('website')
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const links = org.knowledgeBase.links
  const scrapingKey = links.filter(l => l.status === 'scraping').map(l => l.id).join(',')
  const activeType = LINK_TYPES.find(t => t.id === type)!

  useEffect(() => {
    if (!scrapingKey) return
    const ids = scrapingKey.split(',')
    const timers = ids.map(id => setTimeout(() => { markLinkScraped(adminEmail, id); refresh() }, 1500))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrapingKey])

  function add() {
    if (!value.trim()) return
    addLink(adminEmail, { type, label: label.trim() || activeType.label, value: value.trim() })
    refresh()
    setLabel('')
    setValue('')
  }

  return (
    <div>
      <p className="text-sm text-slate-500">Anything that points Copilot to more context — a website to scrape, a support email, a phone line, social profiles.</p>

      <div className="mt-4 lf-panel p-5">
        <div className="flex gap-2">
          {LINK_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                type === t.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
              )}
            >
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_2fr]">
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder={`Label (optional, e.g. "${activeType.label}")`} className="lf-input" />
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder={activeType.placeholder}
            className="lf-input"
          />
        </div>
        <button onClick={add} disabled={!value.trim()} className="mt-4 flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-40">
          <Plus className="h-4 w-4" /> Add {activeType.label.toLowerCase()}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {links.length === 0 ? (
          <EmptyState label="Nothing added yet." />
        ) : (
          links.map(link => {
            const linkType = LINK_TYPES.find(t => t.id === link.type)!
            const Icon = linkType.icon
            return (
              <KnowledgeCard
                key={link.id}
                enabled={link.enabled}
                onToggleEnabled={() => { toggleLink(adminEmail, link.id); refresh() }}
                onDelete={() => { removeLink(adminEmail, link.id); refresh() }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <span className="flex-shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{link.label}</span>
                  <span className="truncate text-sm font-medium text-slate-900">{link.value}</span>
                  {link.status === 'scraping' && (
                    <span className="flex-shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">Scraping…</span>
                  )}
                  {link.status === 'scraped' && (
                    <span className="flex-shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">Scraped</span>
                  )}
                </div>
              </KnowledgeCard>
            )
          })
        )}
      </div>
    </div>
  )
}
