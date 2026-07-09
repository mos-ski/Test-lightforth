import { useOutletContext } from 'react-router-dom'
import { Check, CreditCard } from 'lucide-react'
import type { CosellaDashboardContext } from './CosellaAdminLayout'
import { COSELLA_SETUP_FEE, COSELLA_SEAT_PRICE } from '../marketing/CosellaLanding'

export default function Billing() {
  const { org } = useOutletContext<CosellaDashboardContext>()
  const paidSeats = org.members.filter(m => m.seatPaid)
  const monthlyTotal = paidSeats.length * COSELLA_SEAT_PRICE

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
      <p className="mt-1 text-sm text-slate-500">What you've paid, and what you're paying monthly per seat.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><Check className="h-4 w-4 text-rose-500" /> Setup fee</div>
          <p className="mt-3 text-2xl font-black text-slate-900">{org.setupFeePaid ? `$${COSELLA_SETUP_FEE.toLocaleString()}` : 'Unpaid'}</p>
          <p className="mt-1 text-sm text-slate-500">One-time, already settled.</p>
        </div>
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><CreditCard className="h-4 w-4 text-rose-600" /> Monthly subscription</div>
          <p className="mt-3 text-2xl font-black text-slate-900">${monthlyTotal.toFixed(2)} <span className="text-base font-medium text-slate-500">/ month</span></p>
          <p className="mt-1 text-sm text-slate-500">{paidSeats.length} active seat{paidSeats.length === 1 ? '' : 's'} at ${COSELLA_SEAT_PRICE}/mo each.</p>
        </div>
      </div>

      <div className="mt-8 lf-panel">
        <div className="border-b border-border px-6 py-4"><h2 className="lf-section-title">Per-seat breakdown</h2></div>
        <table className="lf-table">
          <thead className="lf-table-head"><tr><th className="lf-table-th">Member</th><th className="lf-table-th">Status</th><th className="lf-table-th text-right">Monthly cost</th></tr></thead>
          <tbody>
            {org.members.map(member => (
              <tr key={member.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{member.name}</td>
                <td className="lf-table-cell">{member.seatPaid ? <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600"><Check className="h-3 w-3" /> Active</span> : <span className="text-xs text-slate-400">Not active</span>}</td>
                <td className="lf-table-cell text-right text-slate-600">{member.seatPaid ? `$${COSELLA_SEAT_PRICE}/mo` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
