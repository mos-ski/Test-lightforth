import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { addLiveCallRiskEntry, resolveRescue, type LiveCallRiskEntry } from '../closerOrgStore'

const RISK_BORDER: Record<LiveCallRiskEntry['riskLevel'], string> = {
  green: 'border-emerald-200', yellow: 'border-amber-300', red: 'border-red-300',
}

const SIMULATED_PROSPECTS = ['Harper Lin', 'Quinn Alvarez', 'Reese Donovan']
const SIMULATED_SIGNALS = ['Prospect talking less', 'Long silence after price was mentioned', "Two failed close attempts"]

export default function LiveRescueBoard() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [resolving, setResolving] = useState<{ entry: LiveCallRiskEntry; mode: 'listen' | 'whisper' | 'warm-join' } | null>(null)

  function handleResolve(outcome: 'saved' | 'lost') {
    if (!resolving) return
    resolveRescue(adminEmail, resolving.entry.id, {
      managerJoinedAt: new Date().toISOString(), mode: resolving.mode, outcome,
      dollarsSaved: outcome === 'saved' ? resolving.entry.dealValue : 0,
    })
    refresh()
    setResolving(null)
  }

  function handleSimulate() {
    addLiveCallRiskEntry(adminEmail, {
      callId: crypto.randomUUID(),
      closerName: org.members[Math.floor(Math.random() * org.members.length)]?.name ?? 'Unassigned',
      prospectName: SIMULATED_PROSPECTS[Math.floor(Math.random() * SIMULATED_PROSPECTS.length)],
      dealValue: org.dealTypePriceOptions[0]?.pif ?? 10000,
      riskLevel: 'red',
      dangerSignals: [SIMULATED_SIGNALS[Math.floor(Math.random() * SIMULATED_SIGNALS.length)]],
      rescueLog: null,
    })
    refresh()
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Rescue Board</h1>
          <p className="mt-1 text-sm text-slate-500">Every call currently at risk — step in before the deal is gone.</p>
        </div>
        <button onClick={handleSimulate} className="h-10 flex-shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">
          Simulate a live call
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {org.liveCallRiskEntries.map(entry => (
          <div key={entry.id} className={cn('lf-panel border-2 p-5', RISK_BORDER[entry.riskLevel])}>
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900">{entry.prospectName}</p>
              <span className="text-sm font-semibold text-slate-500">${entry.dealValue.toLocaleString()}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Closer: {entry.closerName}</p>
            <ul className="mt-3 space-y-1">
              {entry.dangerSignals.map((s, i) => <li key={i} className="text-xs text-red-500">• {s}</li>)}
            </ul>

            {entry.rescueLog ? (
              <p className="mt-4 text-sm font-semibold text-slate-700 capitalize">{entry.rescueLog.mode} — deal {entry.rescueLog.outcome}</p>
            ) : (
              <div className="mt-4 flex gap-2">
                <button onClick={() => setResolving({ entry, mode: 'listen' })} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-muted">Listen</button>
                <button onClick={() => setResolving({ entry, mode: 'whisper' })} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90">Whisper</button>
                <button onClick={() => setResolving({ entry, mode: 'warm-join' })} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-muted">Warm Join</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {resolving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <p className="font-bold text-slate-900">{resolving.entry.prospectName} — {resolving.mode}</p>
            <p className="mt-1 text-sm text-slate-500">How did the rescue go?</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => handleResolve('saved')} className="h-9 flex-1 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">Mark saved</button>
              <button onClick={() => handleResolve('lost')} className="h-9 flex-1 rounded-lg border border-border text-sm font-semibold text-slate-600 hover:bg-muted">Mark lost</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
