import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { MessageSquare } from 'lucide-react'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { updateSlackDigestConfig } from '../closerOrgStore'

export default function SlackReport() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [channel, setChannel] = useState(org.slackDigestConfig.channel)
  const [sendTime, setSendTime] = useState(org.slackDigestConfig.sendTime)
  const [bigWinThreshold, setBigWinThreshold] = useState(String(org.slackDigestConfig.bigWinThreshold))

  const cashCollected = org.ledgerEntries.reduce((sum, e) => sum + e.dollarValue, 0)
  const dealsSaved = org.ledgerEntries.filter(e => e.tag === 'saved')
  const lostCalls = org.calls.filter(c => c.outcome !== 'won')
  const moneyLeaked = lostCalls.reduce((sum, c) => sum + (org.deals.find(d => d.callId === c.id)?.priceOption.pif ?? 0), 0)

  function handleSave() {
    updateSlackDigestConfig(adminEmail, { channel, sendTime, bigWinThreshold: Number(bigWinThreshold) })
    refresh()
    toast.success('Slack Report settings saved')
  }

  function handleSendTest() {
    toast.success(`Test digest sent to ${channel}`)
  }

  return (
    <div className="mx-auto max-w-3xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">The Money Slack Report</h1>
      <p className="mt-1 text-sm text-slate-500">One Slack message, every evening: cash collected, deals saved, money leaked.</p>

      <div className="mt-8 lf-panel p-5">
        <p className="lf-section-title">Settings</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="slack-channel" className="lf-label mb-1.5 block">Channel</label>
            <input id="slack-channel" value={channel} onChange={e => setChannel(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label htmlFor="slack-time" className="lf-label mb-1.5 block">Send time</label>
            <input id="slack-time" type="time" value={sendTime} onChange={e => setSendTime(e.target.value)} className="lf-input" />
          </div>
          <div>
            <label htmlFor="slack-threshold" className="lf-label mb-1.5 block">Big win threshold ($)</label>
            <input id="slack-threshold" type="number" value={bigWinThreshold} onChange={e => setBigWinThreshold(e.target.value)} className="lf-input" />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={handleSave} className="h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90">Save changes</button>
          <button onClick={handleSendTest} className="h-9 rounded-lg border border-border px-4 text-sm font-semibold text-slate-700 hover:bg-muted">Send test digest now</button>
        </div>
      </div>

      <p className="mt-8 lf-section-title">Live preview</p>
      <div className="mt-3 rounded-xl border border-slate-200 bg-[#1a1d21] p-5 text-white">
        <p className="flex items-center gap-2 font-bold"><MessageSquare className="h-4 w-4 text-emerald-400" /> Closer OS Bot <span className="text-xs font-normal text-white/40">Today at {sendTime}</span></p>
        <p className="mt-3 text-sm"><strong>CASH TODAY:</strong> ${cashCollected.toLocaleString()} collected</p>
        <p className="mt-2 text-sm"><strong>DEALS SAVED:</strong> {dealsSaved.length} deal{dealsSaved.length === 1 ? '' : 's'} worth ${dealsSaved.reduce((s, e) => s + e.dollarValue, 0).toLocaleString()} saved by copilot counters</p>
        <p className="mt-2 text-sm"><strong>MONEY LEAKED:</strong> ${moneyLeaked.toLocaleString()} leaked across {lostCalls.length} call{lostCalls.length === 1 ? '' : 's'}</p>
      </div>
    </div>
  )
}
