import { useOutletContext, Link, useNavigate } from 'react-router-dom'
import { Check, Copy, Database, ExternalLink, Phone, Trophy, Users } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { SalesDashboardContext } from './SalesAdminLayout'

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Overview() {
  const { org, adminEmail } = useOutletContext<SalesDashboardContext>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  function copyLink() {
    const url = `${window.location.origin}/copilot`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  const paidSeats = org.members.filter(m => m.seatPaid).length
  const kb = org.knowledgeBase
  const knowledgeItemCount = kb.documents.length + kb.faqs.length + kb.knowledgeCenter.length + kb.text.length + kb.links.length

  const totalCalls = org.calls.length
  const avgDurationSeconds = totalCalls === 0 ? 0 : org.calls.reduce((sum, c) => sum + c.durationSeconds, 0) / totalCalls

  const callsByRep = new Map<string, number>()
  for (const call of org.calls) callsByRep.set(call.repName, (callsByRep.get(call.repName) ?? 0) + 1)
  const topRep = [...callsByRep.entries()].sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Welcome back, {org.orgName}</h1>
      <p className="mt-1 text-sm text-slate-500">Here's where your team's Sales Copilot setup stands.</p>

      {/* Copilot app banner */}
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#08285c] to-[#0e3d8a] px-6 py-5">
        <div>
          <p className="text-sm font-semibold text-teal-300 uppercase tracking-wide">Copilot App</p>
          <p className="mt-0.5 text-base font-bold text-white">Download &amp; share the Lightforth Copilot</p>
          <p className="mt-1 text-sm text-white/60">Share the link with your reps so they can download and activate Copilot.</p>
        </div>
        <div className="ml-6 flex flex-shrink-0 gap-3">
          <button
            onClick={copyLink}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <button
            onClick={() => navigate(`/desktop-copilot-preview?email=${encodeURIComponent(adminEmail)}`)}
            className="flex items-center gap-2 rounded-lg bg-teal-400 px-4 py-2 text-sm font-semibold text-[#08285c] transition-colors hover:bg-teal-300"
          >
            <ExternalLink className="h-4 w-4" />
            Open Copilot
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {org.planTier === 'enterprise' ? (
          <div className="lf-panel p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Check className="h-4 w-4 text-emerald-500" /> Setup fee
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">{org.setupFeePaid ? 'Paid' : 'Unpaid'}</p>
            <p className="mt-1 text-sm text-slate-500">One-time $5,000 setup, already settled.</p>
          </div>
        ) : (
          <div className="lf-panel p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Check className="h-4 w-4 text-emerald-500" /> Plan
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">Individual</p>
            <p className="mt-1 text-sm text-slate-500">$99.90/mo, no setup fee.</p>
          </div>
        )}

        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Users className="h-4 w-4 text-primary" /> Active seats
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            {paidSeats} <span className="text-base font-medium text-slate-500">of {org.members.length} added</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {org.planTier === 'enterprise' ? '$79/mo per active seat — only pay for reps who are live.' : 'Your own seat, included in your $99.90/mo plan.'}
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">Call activity</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-3">
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Phone className="h-4 w-4 text-primary" /> Total calls
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">{totalCalls}</p>
          <p className="mt-1 text-sm text-slate-500">Completed across your whole team.</p>
        </div>

        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Trophy className="h-4 w-4 text-amber-500" /> Most calls
          </div>
          <p className="mt-3 truncate text-2xl font-black text-slate-900">{topRep ? topRep[0] : '—'}</p>
          <p className="mt-1 text-sm text-slate-500">{topRep ? `${topRep[1]} call${topRep[1] === 1 ? '' : 's'} so far` : 'No calls yet'}</p>
        </div>

        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Check className="h-4 w-4 text-emerald-500" /> Avg. call length
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">{totalCalls === 0 ? '—' : formatDuration(avgDurationSeconds)}</p>
          <p className="mt-1 text-sm text-slate-500">Across all completed calls.</p>
        </div>
      </div>

      <div className={cn('mt-8 grid gap-5', org.planTier === 'enterprise' ? 'sm:grid-cols-2' : 'sm:grid-cols-1')}>
        <Link to="/sales/dashboard/knowledge-base" className="lf-panel flex items-center gap-4 p-6 transition-colors hover:bg-slate-50">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Knowledge Base</p>
            <p className="text-sm text-slate-500">{knowledgeItemCount} item{knowledgeItemCount === 1 ? '' : 's'} across documents, FAQs & more</p>
          </div>
        </Link>

        {org.planTier === 'enterprise' && (
          <Link to="/sales/dashboard/team" className="lf-panel flex items-center gap-4 p-6 transition-colors hover:bg-slate-50">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Team</p>
              <p className="text-sm text-slate-500">{org.members.length} member{org.members.length === 1 ? '' : 's'} total</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
