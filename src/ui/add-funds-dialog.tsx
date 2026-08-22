import { useState } from 'react'
import { Check } from 'lucide-react'

import { cn } from './cn'
import { formatUsd } from './currency'
import { Dialog, DialogClose, DialogDescription, DialogPopup, DialogTitle } from './dialog'

export type AddFundsDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly currentBalanceCents: number
  readonly onAddFunds: (amountCents: number) => void
  readonly title?: string
  readonly description?: string
}

const QUICK_AMOUNTS_CENTS = [500, 1000, 2000]

export function AddFundsDialog({
  open,
  onOpenChange,
  currentBalanceCents,
  onAddFunds,
  title = 'Add Funds',
  description = 'Add money to your balance to keep going. It stays on your account until you spend it.',
}: AddFundsDialogProps) {
  const [selectedCents, setSelectedCents] = useState<number | null>(null)
  const [customValue, setCustomValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [addedCents, setAddedCents] = useState(0)

  const customCents = customValue ? Math.round(Number(customValue) * 100) : null
  const activeCents = customValue ? customCents : selectedCents
  const canSubmit = status === 'idle' && !!activeCents && activeCents > 0

  function reset() {
    setSelectedCents(null)
    setCustomValue('')
    setStatus('idle')
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) reset()
  }

  function handleSubmit() {
    if (!activeCents || activeCents <= 0) return
    setStatus('processing')
    window.setTimeout(() => {
      setAddedCents(activeCents)
      onAddFunds(activeCents)
      setStatus('success')
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup aria-label={title}>
        <DialogClose />
        {status === 'success' ? (
          <div className="grid gap-4 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-positive-surface text-positive">
              <Check aria-hidden="true" className="size-6" />
            </span>
            <div>
              <DialogTitle>{formatUsd(addedCents)} added</DialogTitle>
              <DialogDescription>Your new balance is {formatUsd(currentBalanceCents + addedCents)}.</DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <p className="mt-3 text-sm text-ink-muted">
              Current balance: <span className="font-semibold text-ink">{formatUsd(currentBalanceCents)}</span>
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS_CENTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedCents(amount)
                    setCustomValue('')
                  }}
                  disabled={status === 'processing'}
                  className={cn(
                    'flex min-h-11 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                    selectedCents === amount && !customValue
                      ? 'border-accent bg-accent-subtle text-accent shadow-control'
                      : 'border-input bg-surface text-ink-muted hover:border-border hover:text-ink',
                  )}
                >
                  {formatUsd(amount)}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <label htmlFor="add-funds-custom" className="text-xs font-medium text-ink-muted">
                Or enter a custom amount
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-sm text-ink-muted">$</span>
                <input
                  id="add-funds-custom"
                  type="number"
                  min={1}
                  step="0.01"
                  inputMode="decimal"
                  value={customValue}
                  onChange={(event) => {
                    setCustomValue(event.target.value)
                    setSelectedCents(null)
                  }}
                  disabled={status === 'processing'}
                  placeholder="0.00"
                  className="min-h-11 w-full rounded-lg border border-input bg-surface py-2.5 ps-7 pe-3 text-sm text-ink shadow-control outline-none focus:border-focus focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'processing' ? 'Adding funds…' : activeCents ? `Add ${formatUsd(activeCents)}` : 'Add funds'}
            </button>
          </>
        )}
      </DialogPopup>
    </Dialog>
  )
}
