import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { addProspectCard } from '../closerOrgStore'

const HEAT_BADGE: Record<'HOT' | 'WARM' | 'COLD', string> = {
  HOT: 'bg-red-50 text-red-600', WARM: 'bg-amber-50 text-amber-600', COLD: 'bg-blue-50 text-blue-600',
}

function heatFromWatchPct(pct: number): 'HOT' | 'WARM' | 'COLD' {
  if (pct >= 80) return 'HOT'
  if (pct >= 40) return 'WARM'
  return 'COLD'
}

export default function ProspectIntel() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [name, setName] = useState('')
  const [watchPct, setWatchPct] = useState('')
  const [openingLine, setOpeningLine] = useState('')

  const canAdd = name.trim().length > 0 && watchPct.trim().length > 0 && openingLine.trim().length > 0

  function handleAdd() {
    const pct = Number(watchPct)
    addProspectCard(adminEmail, {
      callId: crypto.randomUUID(), prospectName: name.trim(), vslWatchPct: pct,
      rewatchedParts: [], applicationAnswers: [], emailOpens: 0,
      heatSignal: heatFromWatchPct(pct), openingLines: [openingLine.trim()],
    })
    refresh()
    setName(''); setWatchPct(''); setOpeningLine('')
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Prospect Intel</h1>
      <p className="mt-1 text-sm text-slate-500">What every booked prospect did in the funnel — this is what the closer's Prospect Card shows before the call.</p>

      <div className="mt-8 lf-panel p-5">
        <p className="lf-section-title">Add a prospect card</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Prospect name" className="lf-input" />
          <input value={watchPct} onChange={e => setWatchPct(e.target.value)} placeholder="VSL watch %" type="number" className="lf-input" />
          <input value={openingLine} onChange={e => setOpeningLine(e.target.value)} placeholder="Suggested opening line" className="lf-input" />
        </div>
        <button disabled={!canAdd} onClick={handleAdd} className="mt-4 h-9 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white disabled:opacity-40">
          Add prospect card
        </button>
      </div>

      <div className="mt-6 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head"><tr><th className="lf-table-th">Prospect</th><th className="lf-table-th">VSL watched</th><th className="lf-table-th text-right">Heat</th></tr></thead>
          <tbody>
            {org.prospectCards.map(p => (
              <tr key={p.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{p.prospectName}</td>
                <td className="lf-table-cell text-slate-600">{p.vslWatchPct}%</td>
                <td className="lf-table-cell text-right"><span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', HEAT_BADGE[p.heatSignal])}>{p.heatSignal}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
