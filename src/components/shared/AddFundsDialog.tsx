import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AddFundsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentBalance: number
  quickAmounts: readonly number[]
  formatAmount: (value: number) => string
  onAddFunds: (amount: number) => void
  title?: string
  description?: string
}

export default function AddFundsDialog({
  open,
  onOpenChange,
  currentBalance,
  quickAmounts,
  formatAmount,
  onAddFunds,
  title = 'Add Funds',
  description = 'Add to your balance to keep going. It stays on your account until you spend it.',
}: AddFundsDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customValue, setCustomValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [addedAmount, setAddedAmount] = useState(0)

  if (!open) return null

  const customAmount = customValue ? Number(customValue) : null
  const activeAmount = customAmount ?? selectedAmount
  const canSubmit = status === 'idle' && !!activeAmount && activeAmount > 0

  function reset() {
    setSelectedAmount(null)
    setCustomValue('')
    setStatus('idle')
  }

  function close() {
    onOpenChange(false)
    reset()
  }

  function handleSubmit() {
    if (!activeAmount || activeAmount <= 0) return
    setStatus('processing')
    window.setTimeout(() => {
      setAddedAmount(activeAmount)
      onAddFunds(activeAmount)
      setStatus('success')
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-slate-950/45 p-4">
      <div className="lf-panel relative w-full max-w-[420px] p-6 shadow-2xl">
        <button onClick={close} aria-label="Close" className="absolute right-6 top-6 rounded p-1 text-ink-muted hover:text-ink">
          <X className="h-4 w-4" />
        </button>

        {status === 'success' ? (
          <div className="grid gap-4 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <Check aria-hidden="true" className="size-6" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-ink">{formatAmount(addedAmount)} added</h2>
              <p className="mt-1 text-sm text-ink-muted">Your new balance is {formatAmount(currentBalance + addedAmount)}.</p>
            </div>
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{description}</p>
            <p className="mt-3 text-sm text-ink-muted">
              Current balance: <span className="font-semibold text-ink">{formatAmount(currentBalance)}</span>
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomValue('')
                  }}
                  disabled={status === 'processing'}
                  className={cn(
                    'flex min-h-11 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                    selectedAmount === amount && !customValue
                      ? 'border-accent bg-blue-50 text-accent'
                      : 'border-border bg-white text-ink-muted hover:border-slate-300 hover:text-ink',
                  )}
                >
                  {formatAmount(amount)}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <label htmlFor="add-funds-custom" className="text-xs font-medium text-ink-muted">
                Or enter a custom amount
              </label>
              <input
                id="add-funds-custom"
                type="number"
                min={1}
                step="1"
                inputMode="numeric"
                value={customValue}
                onChange={(event) => {
                  setCustomValue(event.target.value)
                  setSelectedAmount(null)
                }}
                disabled={status === 'processing'}
                placeholder="0"
                className="lf-input mt-1.5"
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'processing' ? 'Adding funds…' : activeAmount ? `Add ${formatAmount(activeAmount)}` : 'Add funds'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
