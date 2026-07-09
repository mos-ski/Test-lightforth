import { Check, CreditCard, Loader2 } from 'lucide-react'
import type { PriceOption } from '../cosellaOrgStore'

export type PaymentStatus = 'hidden' | 'offered' | 'link-sent' | 'link-opened' | 'card-entering' | 'paid' | 'declined'

const TICKER_STEPS: { key: PaymentStatus; label: string }[] = [
  { key: 'link-sent', label: 'Link sent' },
  { key: 'link-opened', label: 'Link opened' },
  { key: 'card-entering', label: 'Card entered' },
  { key: 'paid', label: 'PAID' },
]

function stepReached(status: PaymentStatus, stepKey: PaymentStatus): boolean {
  const order: PaymentStatus[] = ['link-sent', 'link-opened', 'card-entering', 'paid']
  const statusIdx = order.indexOf(status)
  const stepIdx = order.indexOf(stepKey)
  return statusIdx >= 0 && stepIdx >= 0 && statusIdx >= stepIdx
}

export default function PaymentMomentPanel({
  status, priceOption, onSendLink, onBackupOption,
}: {
  status: PaymentStatus
  priceOption: PriceOption
  onSendLink: (choice: 'pif' | 'plan') => void
  onBackupOption: (option: 'second-card' | 'split' | 'smaller-deposit') => void
}) {
  if (status === 'hidden') return null

  const isDeclined = status === 'declined'
  const planFirst = priceOption.planInstallments[0]

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: isDeclined ? 'rgba(234,179,8,0.10)' : 'rgba(244,63,94,0.10)',
        border: `1px solid ${isDeclined ? 'rgba(234,179,8,0.4)' : 'rgba(244,63,94,0.4)'}`,
      }}
    >
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: isDeclined ? '#eab308' : '#10b981' }}>
        <CreditCard className="h-3.5 w-3.5" /> Payment Moment
      </p>

      {status === 'offered' && (
        <div className="mt-3 space-y-2">
          <button onClick={() => onSendLink('pif')} className="w-full rounded-lg bg-rose-500 px-3 py-2 text-left text-sm font-semibold text-white hover:bg-rose-600">
            Send PIF Link — ${priceOption.pif.toLocaleString()}
          </button>
          <button onClick={() => onSendLink('plan')} className="w-full rounded-lg border border-rose-500/50 px-3 py-2 text-left text-sm font-semibold text-rose-300 hover:bg-rose-500/10">
            Send Plan Link — ${planFirst.toLocaleString()} today + {priceOption.planInstallments.length - 1} more
          </button>
        </div>
      )}

      {/* Fixed post-review: `stepReached` uses an inclusive >= comparison, so the currently-active
          step was always also "reached" — checking `isCurrent` first (not `reached` first) is what
          actually lets the in-progress spinner render instead of a premature checkmark. */}
      {(status === 'link-sent' || status === 'link-opened' || status === 'card-entering' || status === 'paid') && (
        <div className="mt-3 space-y-1.5">
          {TICKER_STEPS.map(step => {
            const reached = stepReached(status, step.key)
            const isCurrent = status === step.key && status !== 'paid'
            return (
              <div key={step.key} className="flex items-center gap-2 text-sm">
                {isCurrent ? <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-400" /> : reached ? <Check className="h-3.5 w-3.5 text-rose-400" /> : <div className="h-3.5 w-3.5 rounded-full border border-white/20" />}
                <span className={reached ? 'font-semibold text-white' : 'text-slate-400'}>{step.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {isDeclined && (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-white">Card declined — not enough funds. Try: "No problem, that happens all the time — do you have another card handy? We can also split today's amount across two cards."</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onBackupOption('second-card')} className="rounded-lg bg-yellow-500/20 px-3 py-1.5 text-xs font-semibold text-yellow-300 hover:bg-yellow-500/30">Try second card</button>
            <button onClick={() => onBackupOption('split')} className="rounded-lg bg-yellow-500/20 px-3 py-1.5 text-xs font-semibold text-yellow-300 hover:bg-yellow-500/30">Split into two charges</button>
            <button onClick={() => onBackupOption('smaller-deposit')} className="rounded-lg bg-yellow-500/20 px-3 py-1.5 text-xs font-semibold text-yellow-300 hover:bg-yellow-500/30">Reduce today's deposit</button>
          </div>
        </div>
      )}
    </div>
  )
}
