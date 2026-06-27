import { useState } from 'react'
import { Check } from 'lucide-react'
import { BG, CARD, BORDER, INPUT_BG, INPUT_BD, BLUE } from './shared'

const EXAM_PRICE = 500

export function ExamCheckoutScreen({ onPaid, onBack }: { onPaid: () => void; onBack: () => void }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  const inputStyle = { background: INPUT_BG, border: `1px solid ${INPUT_BD}`, color: 'white', outline: 'none' } as const
  const canPay = cardNumber.trim().length > 0 && expiry.trim().length > 0 && cvc.trim().length > 0

  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="mb-4 text-sm font-semibold text-blue-400 hover:underline">
          ← Back
        </button>
        <h1 className="mb-2 text-2xl font-bold text-white">Confirm payment</h1>
        <p className="mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          ${EXAM_PRICE} one-time — Exam Copilot
        </p>

        <div className="space-y-4 rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">Card number</label>
            <input
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder="1234 1234 1234 1234"
              className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
              style={inputStyle}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-white">Expiry</label>
              <input
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                style={inputStyle}
              />
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-white">CVC</label>
              <input
                value={cvc}
                onChange={e => setCvc(e.target.value)}
                placeholder="123"
                className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => { if (canPay) onPaid() }}
          className="mt-5 h-11 w-full rounded-xl text-sm font-bold text-white transition-opacity"
          style={{ background: BLUE, opacity: canPay ? 1 : 0.45 }}
        >
          Pay ${EXAM_PRICE}
        </button>
      </div>
    </div>
  )
}

export function ExamCheckoutSuccessScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex min-h-[580px] flex-col items-center justify-center px-12 py-10 text-center" style={{ background: BG }}>
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(34,197,94,0.15)' }}>
        <Check className="h-7 w-7 text-green-400" strokeWidth={2.5} />
      </div>
      <h1 className="mb-3 text-2xl font-bold text-white">You're all set</h1>
      <p className="mb-8 max-w-sm text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Your Exam Copilot purchase is complete. Taking you straight to your exam session — no setup needed.
      </p>
      <button
        onClick={onContinue}
        className="h-11 rounded-xl px-8 text-sm font-bold text-white hover:opacity-90"
        style={{ background: BLUE }}
      >
        Continue to Exam Copilot
      </button>
    </div>
  )
}
