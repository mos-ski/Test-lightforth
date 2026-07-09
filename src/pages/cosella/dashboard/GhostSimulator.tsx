import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import type { CosellaDashboardContext } from './CosellaAdminLayout'
import { recordGhostSession, type GhostPersona } from '../cosellaOrgStore'

export default function GhostSimulator() {
  const { adminEmail, org, refresh } = useOutletContext<CosellaDashboardContext>()
  const [practicing, setPracticing] = useState<GhostPersona | null>(null)
  const [closerName, setCloserName] = useState('')
  const [score, setScore] = useState('')
  const [objectionsHandled, setObjectionsHandled] = useState(false)
  const [closeAttempted, setCloseAttempted] = useState(false)
  const [paymentAsked, setPaymentAsked] = useState(false)

  const leaderboard = [...org.ghostSessions].sort((a, b) => b.score - a.score)

  function handleSubmit() {
    if (!practicing || !closerName.trim() || !score.trim()) return
    recordGhostSession(adminEmail, {
      ghostId: practicing.id, closerName: closerName.trim(), score: Number(score),
      objectionsHandled: objectionsHandled ? 1 : 0, countersUsed: objectionsHandled ? 1 : 0,
      closeAttempted, paymentAsked, date: new Date().toISOString(),
    })
    refresh()
    toast.success(`Practice session recorded for ${closerName.trim()}`)
    setPracticing(null); setCloserName(''); setScore(''); setObjectionsHandled(false); setCloseAttempted(false); setPaymentAsked(false)
  }

  if (practicing) {
    return (
      <div className="mx-auto max-w-2xl px-10 py-12">
        <button onClick={() => setPracticing(null)} className="text-sm font-semibold text-rose-600 hover:underline">← Back</button>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{practicing.name}</h1>
        <p className="mt-1 text-sm text-slate-500">{practicing.tone}</p>
        <div className="mt-4 space-y-2">
          {practicing.stalls.map((s, i) => <p key={i} className="lf-panel p-3 text-sm italic text-slate-700">"{s}"</p>)}
        </div>

        <div className="mt-6 lf-panel p-5">
          <p className="lf-section-title">Score this session</p>
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="closer-name" className="lf-label mb-1.5 block">Closer name</label>
              <input id="closer-name" value={closerName} onChange={e => setCloserName(e.target.value)} className="lf-input" />
            </div>
            <div>
              <label htmlFor="ghost-score" className="lf-label mb-1.5 block">Score (0-100)</label>
              <input id="ghost-score" type="number" value={score} onChange={e => setScore(e.target.value)} className="lf-input" />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={objectionsHandled} onChange={e => setObjectionsHandled(e.target.checked)} /> Objections handled</label>
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={closeAttempted} onChange={e => setCloseAttempted(e.target.checked)} /> Close attempted</label>
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={paymentAsked} onChange={e => setPaymentAsked(e.target.checked)} /> Payment asked</label>
          </div>
          <button onClick={handleSubmit} className="mt-5 h-9 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700">Submit session</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Ghost Prospect Simulator</h1>
      <p className="mt-1 text-sm text-slate-500">Practice against an AI copy of a real prospect your team lost — built from Call History.</p>

      <div className="mt-8 space-y-3">
        {org.ghostPersonas.map(ghost => (
          <div key={ghost.id} className="lf-panel flex items-center justify-between p-5">
            <div>
              <p className="font-bold text-slate-900">{ghost.name}</p>
              <p className="mt-1 text-sm text-slate-500">{ghost.objectionStyle}</p>
            </div>
            <button onClick={() => setPracticing(ghost)} className="h-9 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700">Practice</button>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">Practice leaderboard</h2>
      <div className="mt-4 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head"><tr><th className="lf-table-th">Closer</th><th className="lf-table-th text-right">Score</th></tr></thead>
          <tbody>
            {leaderboard.map(s => (
              <tr key={s.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{s.closerName}</td>
                <td className="lf-table-cell text-right text-slate-600">{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
