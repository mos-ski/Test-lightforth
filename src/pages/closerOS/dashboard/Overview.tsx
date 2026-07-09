import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Check, Copy, DollarSign, ExternalLink, Flame, ShieldCheck, TrendingDown, Trophy } from 'lucide-react'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

const GUARANTEE_TARGET = 20000

export default function Overview() {
  const { adminEmail, org } = useOutletContext<CloserDashboardContext>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  function copyLink() {
    const url = `${window.location.origin}/closer-os`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const cashCollected = org.ledgerEntries.reduce((sum, e) => sum + e.dollarValue, 0)
  const dealsSaved = org.ledgerEntries.filter(e => e.tag === 'saved')
  const dealsSavedTotal = dealsSaved.reduce((sum, e) => sum + e.dollarValue, 0)

  const lostCalls = org.calls.filter(c => c.outcome !== 'won')
  const leakedDeals = lostCalls.map(c => {
    const deal = org.deals.find(d => d.callId === c.id)
    return { call: c, value: deal?.priceOption.pif ?? 0 }
  })
  const moneyLeakedTotal = leakedDeals.reduce((sum, l) => sum + l.value, 0)

  const cashByCloser = new Map<string, number>()
  for (const entry of org.ledgerEntries) cashByCloser.set(entry.closerName, (cashByCloser.get(entry.closerName) ?? 0) + entry.dollarValue)
  const leaderboard = [...cashByCloser.entries()].sort((a, b) => b[1] - a[1])

  const hottestProspects = [...org.prospectCards].sort((a, b) => {
    const rank = { HOT: 0, WARM: 1, COLD: 2 }
    return rank[a.heatSignal] - rank[b.heatSignal]
  }).slice(0, 3)

  const guaranteePct = Math.min(100, Math.round((cashCollected / GUARANTEE_TARGET) * 100))

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Welcome back, {org.orgName}</h1>
      <p className="mt-1 text-sm text-slate-500">Here's your money report — the same numbers the Slack digest sends.</p>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#052e1f] to-[#0a4d33] px-6 py-5">
        <div>
          <p className="text-sm font-semibold text-emerald-300 uppercase tracking-wide">Closer OS App</p>
          <p className="mt-0.5 text-base font-bold text-white">Download &amp; share Closer OS</p>
          <p className="mt-1 text-sm text-white/60">Share the link with your closers so they can download and activate Closer OS.</p>
        </div>
        <div className="ml-6 flex flex-shrink-0 gap-3">
          <button
            onClick={copyLink}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <button
            onClick={() => navigate(`/closer-os/app?email=${encodeURIComponent(adminEmail)}`)}
            className="flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#052e1f] transition-colors hover:bg-emerald-300"
          >
            <ExternalLink className="h-4 w-4" />
            Open Closer OS
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><DollarSign className="h-4 w-4 text-emerald-500" /> Cash collected</div>
          <p className="mt-3 text-2xl font-black text-slate-900">${cashCollected.toLocaleString()}</p>
        </div>
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Deals saved</div>
          <p className="mt-3 text-2xl font-black text-slate-900">{dealsSaved.length} <span className="text-base font-medium text-slate-500">/ ${dealsSavedTotal.toLocaleString()}</span></p>
        </div>
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><TrendingDown className="h-4 w-4 text-red-500" /> Money leaked</div>
          <p className="mt-3 text-2xl font-black text-slate-900">${moneyLeakedTotal.toLocaleString()}</p>
          <p className="mt-1 text-sm text-slate-500">{leakedDeals.length} lost call{leakedDeals.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">Leaderboard</h2>
      <div className="mt-4 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head"><tr><th className="lf-table-th">Closer</th><th className="lf-table-th text-right">Cash collected</th></tr></thead>
          <tbody>
            {leaderboard.map(([name, total], i) => (
              <tr key={name} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{i === 0 && <Trophy className="mr-1.5 inline h-3.5 w-3.5 text-amber-500" />}{name}</td>
                <td className="lf-table-cell text-right text-slate-600">${total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">Tomorrow's hottest prospects</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {hottestProspects.map(p => (
          <div key={p.id} className="lf-panel p-4">
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900"><Flame className="h-3.5 w-3.5 text-red-500" /> {p.prospectName}</div>
            <p className="mt-1 text-xs font-semibold text-emerald-600">{p.heatSignal}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">Guarantee tracker</h2>
      <div className="mt-4 lf-panel p-6">
        <div className="flex justify-between text-sm font-semibold text-slate-700">
          <span>${cashCollected.toLocaleString()} of ${GUARANTEE_TARGET.toLocaleString()}</span>
          <span>{guaranteePct}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${guaranteePct}%` }} />
        </div>
      </div>
    </div>
  )
}
