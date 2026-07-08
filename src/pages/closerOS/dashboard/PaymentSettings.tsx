import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { addDealTypePriceOption, removeDealTypePriceOption, toggleIntegration } from '../closerOrgStore'

const PAYMENT_PROCESSORS = [
  { id: 'stripe', name: 'Stripe' },
  { id: 'nmi', name: 'NMI' },
  { id: 'paypal', name: 'PayPal' },
]

export default function PaymentSettings() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [label, setLabel] = useState('')
  const [pif, setPif] = useState('')
  const [deposit, setDeposit] = useState('')

  const canAdd = label.trim().length > 0 && Number(pif) > 0 && Number(deposit) > 0

  function handleAdd() {
    const pifAmount = Number(pif)
    const depositAmount = Number(deposit)
    const remaining = pifAmount - depositAmount
    addDealTypePriceOption(adminEmail, {
      label: label.trim(), pif: pifAmount,
      planInstallments: [depositAmount, Math.round(remaining / 3), Math.round(remaining / 3), remaining - 2 * Math.round(remaining / 3)],
    })
    refresh()
    setLabel(''); setPif(''); setDeposit('')
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Payment Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Set up PIF pricing and payment plans once per deal type — this is what the closer's Payment Moment panel offers on the call.</p>

      <div className="mt-8 lf-panel p-5">
        <p className="lf-section-title">Add a deal type</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Deal type name" className="lf-input" />
          <input value={pif} onChange={e => setPif(e.target.value)} placeholder="PIF price" type="number" className="lf-input" />
          <input value={deposit} onChange={e => setDeposit(e.target.value)} placeholder="Deposit today" type="number" className="lf-input" />
        </div>
        <button disabled={!canAdd} onClick={handleAdd} className="mt-4 h-9 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white disabled:opacity-40">
          Add deal type
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {org.dealTypePriceOptions.map(option => (
          <div key={option.label} className="lf-panel flex items-center justify-between p-5">
            <div>
              <p className="font-bold text-slate-900">{option.label}</p>
              <p className="mt-1 text-sm text-slate-500">PIF ${option.pif.toLocaleString()} · Plan: ${option.planInstallments.map(n => n.toLocaleString()).join(' + $')}</p>
            </div>
            <button onClick={() => { removeDealTypePriceOption(adminEmail, option.label); refresh() }} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">Payment connections</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {PAYMENT_PROCESSORS.map(p => {
          const connected = org.connectedIntegrations.includes(p.id)
          return (
            <div key={p.id} className="lf-panel p-5">
              <p className="font-bold text-slate-900">{p.name}</p>
              <button
                onClick={() => { toggleIntegration(adminEmail, p.id); refresh() }}
                className={connected
                  ? 'mt-3 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-muted'
                  : 'mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700'}
              >
                {connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
