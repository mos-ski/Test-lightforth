import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { FileDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { logAuditEvent, type LedgerEntry } from '../closerOrgStore'

const GUARANTEE_TARGET = 20000

const TAG_BADGE: Record<LedgerEntry['tag'], string> = {
  organic: 'bg-slate-100 text-slate-600',
  assisted: 'bg-blue-50 text-blue-600',
  saved: 'bg-emerald-50 text-emerald-600',
}

export default function Ledger() {
  const { adminEmail, org } = useOutletContext<CloserDashboardContext>()
  const [closerFilter, setCloserFilter] = useState('')
  const [tagFilter, setTagFilter] = useState<'' | LedgerEntry['tag']>('')

  const closers = useMemo(() => [...new Set(org.ledgerEntries.map(e => e.closerName))], [org.ledgerEntries])

  const filtered = org.ledgerEntries.filter(e =>
    (closerFilter === '' || e.closerName === closerFilter) && (tagFilter === '' || e.tag === tagFilter),
  )

  const totalCollected = org.ledgerEntries.reduce((sum, e) => sum + e.dollarValue, 0)
  const guaranteePct = Math.min(100, Math.round((totalCollected / GUARANTEE_TARGET) * 100))

  function handleGenerateRenewalDeck() {
    logAuditEvent(adminEmail, 'renewal-deck-generated', adminEmail, `${org.orgName} renewal deck — $${totalCollected.toLocaleString()} proven`)
    toast.success('Renewal deck generated', { description: 'This is a prototype — no real PDF file is produced yet.' })
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ledger</h1>
          <p className="mt-1 text-sm text-slate-500">Proof, deal by deal, of exactly what Closer OS has made you.</p>
        </div>
        <button onClick={handleGenerateRenewalDeck} className="flex h-10 flex-shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">
          <FileDown className="h-4 w-4" /> Generate renewal deck
        </button>
      </div>

      <div className="mt-6 lf-panel p-5">
        <div className="flex justify-between text-sm font-semibold text-slate-700">
          <span>Guarantee target ${GUARANTEE_TARGET.toLocaleString()} — tracked so far: ${totalCollected.toLocaleString()}</span>
          <span>{guaranteePct}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${guaranteePct}%` }} />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <div>
          <label htmlFor="closer-filter" className="mb-1.5 block text-xs font-semibold text-slate-500">Closer</label>
          <select id="closer-filter" value={closerFilter} onChange={e => setCloserFilter(e.target.value)} className="lf-input">
            <option value="">All closers</option>
            {closers.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="tag-filter" className="mb-1.5 block text-xs font-semibold text-slate-500">Tag</label>
          <select id="tag-filter" value={tagFilter} onChange={e => setTagFilter(e.target.value as '' | LedgerEntry['tag'])} className="lf-input">
            <option value="">All tags</option>
            <option value="organic">Organic</option>
            <option value="assisted">Assisted</option>
            <option value="saved">Saved</option>
          </select>
        </div>
      </div>

      <div className="mt-6 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr><th className="lf-table-th">Closer</th><th className="lf-table-th">Objection</th><th className="lf-table-th">Tag</th><th className="lf-table-th text-right">Value</th></tr>
          </thead>
          <tbody>
            {filtered.map(entry => (
              <tr key={entry.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{entry.closerName}</td>
                <td className="lf-table-cell text-slate-600">{entry.objection || '—'}</td>
                <td className="lf-table-cell"><span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold capitalize', TAG_BADGE[entry.tag])}>{entry.tag}</span></td>
                <td className="lf-table-cell text-right text-slate-600">${entry.dollarValue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
