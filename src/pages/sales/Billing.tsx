import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { Check, CreditCard } from 'lucide-react'
import type { SalesDashboardContext } from './SalesAdminLayout'

const SEAT_PRICE = 79
const SETUP_FEE = 5000

export default function Billing() {
  const { org } = useOutletContext<SalesDashboardContext>()
  const paidSeats = org.members.filter(m => m.seatPaid)
  const monthlyTotal = paidSeats.length * SEAT_PRICE

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
      <p className="mt-1 text-sm text-slate-500">What you've paid, what you're paying monthly, and how it's split per seat.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Check className="h-4 w-4 text-emerald-500" /> Setup fee
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">{org.setupFeePaid ? `$${SETUP_FEE.toLocaleString()}` : 'Unpaid'}</p>
          <p className="mt-1 text-sm text-slate-500">One-time, already settled.</p>
        </div>

        <div className="lf-panel p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <CreditCard className="h-4 w-4 text-primary" /> Monthly subscription
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">
            ${monthlyTotal} <span className="text-base font-medium text-slate-500">/ month</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">{paidSeats.length} active seat{paidSeats.length === 1 ? '' : 's'} at ${SEAT_PRICE}/mo each.</p>
        </div>
      </div>

      <div className="mt-8 lf-panel">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="lf-section-title">Per-seat breakdown</h2>
        </div>
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr>
              <th className="lf-table-th">Member</th>
              <th className="lf-table-th">Email</th>
              <th className="lf-table-th">Status</th>
              <th className="lf-table-th text-right">Monthly cost</th>
            </tr>
          </thead>
          <tbody>
            {org.members.map(member => (
              <tr key={member.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{member.name}</td>
                <td className="lf-table-cell text-slate-600">{member.email}</td>
                <td className="lf-table-cell">
                  {member.seatPaid ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                      <Check className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Not active</span>
                  )}
                </td>
                <td className="lf-table-cell text-right text-slate-600">{member.seatPaid ? `$${SEAT_PRICE}/mo` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 lf-panel p-6">
        <h2 className="lf-section-title">Payment method</h2>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-14 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-500">VISA</div>
            <p className="text-sm text-slate-700">•••• •••• •••• 4242</p>
          </div>
          <button
            onClick={() => toast.success('Payment method updated')}
            className="h-9 rounded-lg border border-border px-4 text-sm font-semibold text-slate-600 hover:bg-muted"
          >
            Update payment method
          </button>
        </div>
      </div>
    </div>
  )
}
