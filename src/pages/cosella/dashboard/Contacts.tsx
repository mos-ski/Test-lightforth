import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Sparkles, UserPlus, X } from 'lucide-react'
import { addContact, assignContact, populateDemoContacts, removeContact, type Contact } from '../cosellaOrgStore'
import type { CosellaDashboardContext } from './CosellaAdminLayout'

const SOURCE_LABEL: Record<Contact['source'], string> = {
  waitlist: 'Waitlist',
  webinar: 'Webinar',
  'interest-form': 'Interest form',
  imported: 'Imported',
  manual: 'Manual',
}

const SOURCE_BADGE: Record<Contact['source'], string> = {
  waitlist: 'bg-blue-50 text-blue-600',
  webinar: 'bg-amber-50 text-amber-600',
  'interest-form': 'bg-emerald-50 text-emerald-600',
  imported: 'bg-slate-100 text-slate-600',
  manual: 'bg-rose-50 text-rose-600',
}

export default function Contacts() {
  const { adminEmail, org, refresh } = useOutletContext<CosellaDashboardContext>()
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [source, setSource] = useState<Contact['source']>('manual')

  const canAdd = name.trim().length > 0 && phone.trim().length > 0

  function handleAdd() {
    addContact(adminEmail, { name, phone, email, source, assignedTo: null })
    refresh()
    setName(''); setPhone(''); setEmail(''); setSource('manual'); setShowAddForm(false)
  }

  function handlePopulateDemo() {
    populateDemoContacts(adminEmail)
    refresh()
  }

  return (
    <div className="mx-auto max-w-5xl px-10 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="mt-1 text-sm text-slate-500">Everyone worth calling — from the waitlist, a webinar, an interest form, or imported by hand. Assign each one to a rep so it shows up in their Phone Call list.</p>
        </div>
        <button onClick={() => setShowAddForm(v => !v)} className="flex h-10 flex-shrink-0 items-center gap-2 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700">
          <UserPlus className="h-4 w-4" /> Add contact
        </button>
      </div>

      {showAddForm && (
        <div className="mt-6 lf-panel p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="lf-label mb-1.5 block">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Harper Lin" className="lf-input" />
            </div>
            <div>
              <label className="lf-label mb-1.5 block">Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (415) 555-0142" className="lf-input" />
            </div>
            <div>
              <label className="lf-label mb-1.5 block">Email (optional)</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="harper@example.com" className="lf-input" />
            </div>
            <div>
              <label className="lf-label mb-1.5 block">Source</label>
              <select value={source} onChange={e => setSource(e.target.value as Contact['source'])} className="lf-input">
                {(Object.keys(SOURCE_LABEL) as Contact['source'][]).map(s => <option key={s} value={s}>{SOURCE_LABEL[s]}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button disabled={!canAdd} onClick={handleAdd} className="h-9 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white disabled:opacity-40">
              Add contact
            </button>
            <button onClick={() => setShowAddForm(false)} className="h-9 rounded-lg px-4 text-sm font-semibold text-slate-500 hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-8 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr>
              <th className="lf-table-th">Name</th>
              <th className="lf-table-th">Phone</th>
              <th className="lf-table-th">Source</th>
              <th className="lf-table-th">Assigned to</th>
              <th className="lf-table-th text-right">Remove</th>
            </tr>
          </thead>
          <tbody>
            {org.contacts.length === 0 && (
              <tr>
                <td colSpan={5} className="lf-table-cell py-10 text-center">
                  <p className="text-sm italic text-slate-400">No contacts yet — add one, or import from your waitlist.</p>
                  <button onClick={handlePopulateDemo} className="mx-auto mt-3 flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50">
                    <Sparkles className="h-3.5 w-3.5" /> Populate demo contacts
                  </button>
                </td>
              </tr>
            )}
            {org.contacts.map(contact => (
              <tr key={contact.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{contact.name}</td>
                <td className="lf-table-cell font-mono text-slate-600">{contact.phone}</td>
                <td className="lf-table-cell">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${SOURCE_BADGE[contact.source]}`}>{SOURCE_LABEL[contact.source]}</span>
                </td>
                <td className="lf-table-cell">
                  <select
                    value={contact.assignedTo ?? ''}
                    onChange={e => { assignContact(adminEmail, contact.id, e.target.value || null); refresh() }}
                    className="h-8 rounded-md border border-slate-300 px-2 text-xs text-slate-700"
                  >
                    <option value="">Unassigned</option>
                    {org.members.map(m => <option key={m.id} value={m.email}>{m.name}</option>)}
                  </select>
                </td>
                <td className="lf-table-cell text-right">
                  <button onClick={() => { removeContact(adminEmail, contact.id); refresh() }} className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${contact.name}`}>
                    <X className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
