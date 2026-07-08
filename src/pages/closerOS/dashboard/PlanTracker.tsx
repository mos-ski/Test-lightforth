import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CloserDashboardContext } from './CloserOSAdminLayout'
import { recordInstallmentOutcome, type PaymentPlan } from '../closerOrgStore'

const RISK_BADGE: Record<PaymentPlan['riskScore'], string> = {
  green: 'bg-emerald-50 text-emerald-600',
  yellow: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
}

const RECOVERY_SCRIPT: Record<PaymentPlan['riskScore'], string> = {
  green: 'No action needed — this plan is on track.',
  yellow: "Card expiring soon: \"Just a heads up your card on file expires soon — want to update it now so nothing gets interrupted?\"",
  red: "Payment failed: \"No problem, that happens all the time — do you have another card handy? We can also split today's amount or move the date once.\"",
}

export default function PlanTracker() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [selected, setSelected] = useState<PaymentPlan | null>(null)

  if (selected) {
    const nextPending = selected.installments.findIndex(i => i.status !== 'paid')
    return (
      <div className="mx-auto max-w-3xl px-10 py-12">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Plan Tracker
        </button>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{selected.buyerName}</h1>
        <p className="mt-1 text-sm text-slate-500">${selected.totalAmount.toLocaleString()} total · card on file •••• {selected.cardOnFile.last4} · {selected.retryCount} retr{selected.retryCount === 1 ? 'y' : 'ies'} so far</p>

        <div className="mt-6 lf-panel p-5">
          <p className="lf-section-title">Recovery script</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{RECOVERY_SCRIPT[selected.riskScore]}</p>
          <button
            onClick={() => toast.success(`Reminder sent to ${selected.buyerName}`)}
            className="mt-4 h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Send reminder now
          </button>
          {nextPending >= 0 && selected.installments[nextPending].status === 'failed' && (
            <button
              onClick={() => { recordInstallmentOutcome(adminEmail, selected.id, nextPending, 'paid'); refresh(); setSelected(null) }}
              className="ml-3 h-9 rounded-lg border border-border px-4 text-sm font-semibold text-slate-700 hover:bg-muted"
            >
              Mark retry successful
            </button>
          )}
        </div>

        <div className="mt-6 lf-table-wrap">
          <table className="lf-table">
            <thead className="lf-table-head"><tr><th className="lf-table-th">Due</th><th className="lf-table-th">Amount</th><th className="lf-table-th text-right">Status</th></tr></thead>
            <tbody>
              {selected.installments.map((inst, i) => (
                <tr key={i} className="lf-table-row">
                  <td className="lf-table-cell text-slate-600">{new Date(inst.dueDate).toLocaleDateString()}</td>
                  <td className="lf-table-cell text-slate-600">${inst.amount.toLocaleString()}</td>
                  <td className="lf-table-cell text-right capitalize text-slate-600">{inst.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Plan Tracker</h1>
      <p className="mt-1 text-sm text-slate-500">Every payment plan and its risk level — click a row for the matching recovery script.</p>

      <div className="mt-8 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr><th className="lf-table-th">Buyer</th><th className="lf-table-th">Total</th><th className="lf-table-th">Next due</th><th className="lf-table-th text-right">Risk</th></tr>
          </thead>
          <tbody>
            {org.paymentPlans.map(plan => {
              const next = plan.installments.find(i => i.status !== 'paid')
              return (
                <tr key={plan.id} className="lf-table-row cursor-pointer" onClick={() => setSelected(plan)}>
                  <td className="lf-table-cell font-medium text-slate-900">{plan.buyerName}</td>
                  <td className="lf-table-cell text-slate-600">${plan.totalAmount.toLocaleString()}</td>
                  <td className="lf-table-cell text-slate-600">{next ? `$${next.amount.toLocaleString()} on ${new Date(next.dueDate).toLocaleDateString()}` : 'Paid in full'}</td>
                  <td className="lf-table-cell text-right">
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold capitalize', RISK_BADGE[plan.riskScore])}>{plan.riskScore}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
