import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Ghost, Phone } from 'lucide-react'
import { addGhostPersonaFromCall, type CallRecord } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function CallHistory() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [selected, setSelected] = useState<CallRecord | null>(null)

  if (selected) {
    return (
      <div className="mx-auto max-w-4xl px-10 py-12">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to call history
        </button>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Call with {selected.closerName}</h1>
            <p className="mt-1 text-sm text-slate-500">{formatDate(selected.date)} · {formatDuration(selected.durationSeconds)} · {selected.outcome}</p>
          </div>
          {selected.outcome !== 'won' && (
            <button
              onClick={() => { addGhostPersonaFromCall(adminEmail, selected); refresh(); toast.success('Ghost persona created') }}
              className="flex h-9 flex-shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white hover:bg-primary/90"
            >
              <Ghost className="h-3.5 w-3.5" /> Make a Ghost
            </button>
          )}
        </div>

        <div className="mt-6 lf-panel divide-y divide-border p-2">
          {selected.transcript.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-400">No transcript captured for this call.</p>
          ) : selected.transcript.map((line, i) => (
            <div key={i} className="px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">{line.speaker}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-800">{line.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Call History</h1>
      <p className="mt-1 text-sm text-slate-500">Every call your team has completed, with the full transcript.</p>

      <div className="mt-8 lf-table-wrap">
        {org.calls.length === 0 ? (
          <div className="p-10 text-center">
            <Phone className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-500">No calls yet.</p>
          </div>
        ) : (
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr><th className="lf-table-th">Closer</th><th className="lf-table-th">Date</th><th className="lf-table-th">Outcome</th><th className="lf-table-th text-right">Transcript</th></tr>
            </thead>
            <tbody>
              {org.calls.map(call => (
                <tr key={call.id} className="lf-table-row cursor-pointer" onClick={() => setSelected(call)}>
                  <td className="lf-table-cell font-medium text-slate-900">{call.closerName}</td>
                  <td className="lf-table-cell text-slate-600">{formatDate(call.date)}</td>
                  <td className="lf-table-cell capitalize text-slate-600">{call.outcome}</td>
                  <td className="lf-table-cell text-right text-sm font-semibold text-primary">View →</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
