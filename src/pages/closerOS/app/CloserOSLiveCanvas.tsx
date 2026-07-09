import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { BG, CARD, BORDER, formatTime } from './shared'
import PaymentMomentPanel, { type PaymentStatus } from './PaymentMomentPanel'
import DangerWhisper, { type DangerState } from './DangerWhisper'
import type { PriceOption } from '../closerOrgStore'

interface CloserTurn {
  speaker: string
  text: string
  // What the copilot suggests the closer says next, shown under every turn. For objection turns
  // this is intentionally the same text as `counter` — it's both "say this now" and the reference
  // card saved to the Objections sidebar for later. Turns with no objection need their own text.
  response?: string
  objection?: string
  counter?: string
  isYesSignal?: boolean
  isDangerSignal?: string
  whisperLine?: string
}

function responseTextFor(turn: CloserTurn): string {
  return turn.response ?? turn.counter ?? ''
}

const CLOSER_QA: CloserTurn[] = [
  { speaker: 'Prospect', text: "Thanks for hopping on — I've been looking forward to this.", response: "Mirror their energy and set the agenda: \"Great to have you here — let's cover where you're at today, what's been holding you back, and see if this is the right fit.\"" },
  { speaker: 'Prospect', text: 'Honestly the price is more than I budgeted for this quarter.', objection: 'Price is too high', counter: 'Re-anchor on ROI and time saved — offer a phased start if it helps.' },
  { speaker: 'Prospect', text: "I don't know... this isn't really clicking the way I hoped.", isDangerSignal: "Prospect sentiment dropping — possible buyer's remorse forming", whisperLine: "Slow down and ask what's really holding them back before you talk price again.", response: "Get curious, not defensive: \"What's making you hesitate right now?\" Let them talk before you respond." },
  { speaker: 'Prospect', text: "I'd also want to check with my business partner before committing.", objection: 'Need to check with a partner', counter: 'Offer a 3-way call this week so the partner hears it firsthand.' },
  { speaker: 'Prospect', text: 'Okay, you know what — let\'s do it. How do I pay?', isYesSignal: true, response: "Confirm the yes, then move fast: ask PIF or plan preference and open the payment panel right now — don't let the moment cool off." },
]

export interface LiveCallResult {
  elapsed: number
  transcript: { speaker: string; text: string }[]
  outcome: 'won' | 'lost' | 'no-decision'
  paymentChoice: 'pif' | 'plan' | null
  usedObjections: { objection: string; counter: string }[]
  dangerResolution: { outcome: 'saved' | 'lost'; reason: string } | null
}

export default function CloserOSLiveCanvas({
  prospectName, priceOption, onEnd,
}: {
  prospectName: string
  priceOption: PriceOption
  onEnd: (result: LiveCallResult) => void
}) {
  const [turnIndex, setTurnIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const [responseDisplayed, setResponseDisplayed] = useState('')
  const [responseDone, setResponseDone] = useState(false)
  const [history, setHistory] = useState<CloserTurn[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [shownObjections, setShownObjections] = useState<{ objection: string; counter: string; used: boolean }[]>([])
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('hidden')
  const [paymentChoice, setPaymentChoice] = useState<'pif' | 'plan' | null>(null)
  const [simulateDecline, setSimulateDecline] = useState(false)
  const [dangerState, setDangerState] = useState<DangerState>('none')
  const [dangerReason, setDangerReason] = useState('')
  const [dangerWhisperLine, setDangerWhisperLine] = useState('')
  const [dangerResolution, setDangerResolution] = useState<{ outcome: 'saved' | 'lost'; reason: string } | null>(null)

  const turnIndexRef = useRef(turnIndex)
  useEffect(() => { turnIndexRef.current = turnIndex }, [turnIndex])

  // Kept in a ref (rather than read directly from state) because the payment cascade below
  // schedules its timeouts eagerly, nested inside one another, so the final stage needs the
  // latest "simulate decline" checkbox value at the moment it fires, not a stale closure value.
  const simulateDeclineRef = useRef(simulateDecline)
  useEffect(() => { simulateDeclineRef.current = simulateDecline }, [simulateDecline])

  // Holds whichever payment-cascade timeout is currently pending, so it can be cancelled — on
  // unmount, or if the call ends mid-cascade — instead of firing (and posting a "wins" toast)
  // after the call has already been reported with a different outcome.
  const pendingPaymentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (pendingPaymentTimeoutRef.current) clearTimeout(pendingPaymentTimeoutRef.current) }, [])

  // Holds the suggested-response interval so a turn change (or unmount) can cancel a still-running
  // one before starting the next.
  const responseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { const id = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(id) }, [])

  // Typing effect for the current turn: the prospect's line, then — chained directly inside that
  // same interval's completion callback, not a separate effect reacting to `typingDone` — the
  // copilot's suggested response. Chaining it here (rather than a second useEffect keyed on
  // `typingDone`) matters under fake timers, for the same reason the payment cascade below is
  // nested: a separate effect only gets a chance to register its interval once React commits a
  // render for the state change that would trigger it, which doesn't happen mid-sweep inside one
  // `act(() => vi.advanceTimersByTime(...))` call.
  useEffect(() => {
    setDisplayed('')
    setTypingDone(false)
    setResponseDisplayed('')
    setResponseDone(false)
    const turn = CLOSER_QA[turnIndex]
    let i = 0
    const questionId = setInterval(() => {
      i++
      setDisplayed(turn.text.slice(0, i))
      if (i >= turn.text.length) {
        clearInterval(questionId)
        setTypingDone(true)
        if (turn.objection && turn.counter) {
          setShownObjections(prev => [...prev, { objection: turn.objection!, counter: turn.counter!, used: false }])
        }
        if (turn.isDangerSignal) {
          setDangerReason(turn.isDangerSignal)
          setDangerWhisperLine(turn.whisperLine ?? '')
          setDangerState('flagged')
          setTimeout(() => setDangerState('whisper-shown'), 1500)
        }
        if (turn.isYesSignal) {
          setPaymentStatus('offered')
        }

        const responseText = responseTextFor(turn)
        let j = 0
        responseIntervalRef.current = setInterval(() => {
          j += 2
          setResponseDisplayed(responseText.slice(0, j))
          if (j >= responseText.length) {
            if (responseIntervalRef.current) clearInterval(responseIntervalRef.current)
            responseIntervalRef.current = null
            setResponseDone(true)
          }
        }, 12)
      }
    }, 22)
    return () => {
      clearInterval(questionId)
      if (responseIntervalRef.current) { clearInterval(responseIntervalRef.current); responseIntervalRef.current = null }
    }
  }, [turnIndex])

  // Advance to the next turn on Space (only once the suggested response has finished, and we're
  // not on the final turn) — this ensures the closer always sees the full suggestion before moving on.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setPaymentStatus(s => (s === 'hidden' ? 'offered' : s))
        return
      }
      if (e.code !== 'Space') return
      e.preventDefault()
      if (!responseDone) return
      if (turnIndexRef.current >= CLOSER_QA.length - 1) return
      setHistory(h => [...h, CLOSER_QA[turnIndexRef.current]])
      setTurnIndex(i => i + 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [responseDone])

  // Toast when the payment lands — this only reacts to the final status, it doesn't drive it.
  useEffect(() => {
    if (paymentStatus === 'paid') {
      toast.success(`📣 Posted to #closer-os-wins`, { description: `${prospectName} — $${(paymentChoice === 'plan' ? priceOption.planInstallments[0] : priceOption.pif).toLocaleString()}` })
    }
  }, [paymentStatus, prospectName, paymentChoice, priceOption])

  // Payment status cascade. Each stage schedules the next stage's timeout directly (nested),
  // rather than reacting to a state/prop change in a separate effect keyed on `paymentStatus`.
  // That matters under fake timers: an effect keyed on `paymentStatus` only re-runs once React
  // has committed a render for the previous stage, so a single big `advanceTimersByTime` call
  // would only ever complete one stage per test `act()` boundary. Scheduling eagerly, inside the
  // previous timeout's own callback, lets the whole chain fire within one `advanceTimersByTime`.
  // Every scheduled id is tracked in `pendingPaymentTimeoutRef` so `handleEndCall` (or unmount)
  // can cancel it — otherwise a call ended mid-cascade would still complete in the background and
  // post a "wins" toast for a call already reported with a different outcome.
  function handleSendLink(choice: 'pif' | 'plan') {
    setPaymentChoice(choice)
    setPaymentStatus('link-sent')
    toast.info('Payment link sent by SMS + email')
    pendingPaymentTimeoutRef.current = setTimeout(() => {
      setPaymentStatus('link-opened')
      pendingPaymentTimeoutRef.current = setTimeout(() => {
        setPaymentStatus('card-entering')
        pendingPaymentTimeoutRef.current = setTimeout(() => {
          pendingPaymentTimeoutRef.current = null
          setPaymentStatus(simulateDeclineRef.current ? 'declined' : 'paid')
        }, 1200)
      }, 1200)
    }, 1200)
  }

  function handleBackupOption() {
    setSimulateDecline(false)
    simulateDeclineRef.current = false
    setPaymentStatus('card-entering')
    pendingPaymentTimeoutRef.current = setTimeout(() => {
      pendingPaymentTimeoutRef.current = null
      setPaymentStatus('paid')
    }, 1200)
  }

  function handleDangerResolve(outcome: 'saved' | 'lost') {
    setDangerResolution({ outcome, reason: dangerReason })
    setDangerState('none')
  }

  function handleMarkUsed(index: number) {
    setShownObjections(prev => prev.map((o, i) => (i === index ? { ...o, used: true } : o)))
  }

  function handleEndCall() {
    // Cancel any in-flight payment-cascade timeout so it can't fire (and post a "wins" toast)
    // after the call has already been reported with whatever outcome is true right now.
    if (pendingPaymentTimeoutRef.current) {
      clearTimeout(pendingPaymentTimeoutRef.current)
      pendingPaymentTimeoutRef.current = null
    }
    const outcome: LiveCallResult['outcome'] =
      paymentStatus === 'paid' ? 'won' : dangerResolution?.outcome === 'lost' ? 'lost' : 'no-decision'
    onEnd({
      elapsed,
      transcript: [...history, ...(displayed ? [{ speaker: CLOSER_QA[turnIndex].speaker, text: displayed }] : [])].map(t => ({ speaker: t.speaker, text: t.text })),
      outcome,
      paymentChoice,
      usedObjections: shownObjections.filter(o => o.used).map(o => ({ objection: o.objection, counter: o.counter })),
      dangerResolution,
    })
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col" style={{ background: BG }}>
      <div className="flex flex-shrink-0 items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span>Call with {prospectName}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-400">
            <input type="checkbox" checked={simulateDecline} onChange={e => setSimulateDecline(e.target.checked)} /> Simulate decline
          </label>
          <span className="font-mono text-sm text-slate-300">{formatTime(elapsed)}</span>
          <button onClick={handleEndCall} className="rounded-lg bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600">End Call</button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 gap-2 overflow-hidden p-2">
        <div className="flex flex-1 min-h-0 flex-col overflow-y-auto rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <style>{'@keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }'}</style>
          {history.map((turn, i) => {
            const responseText = responseTextFor(turn)
            return (
              <div key={i} className="mb-4">
                <p className="text-sm text-white"><span className="font-semibold text-emerald-400">{turn.speaker}: </span>{turn.text}</p>
                {responseText && (
                  <div className="mt-1.5 ml-2 border-l-2 pl-3" style={{ borderColor: 'rgba(16,185,129,0.4)' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-400">Suggested Response</p>
                    <p className="text-sm leading-relaxed text-slate-200">{responseText}</p>
                  </div>
                )}
              </div>
            )
          })}
          <div>
            <p className="text-sm text-white"><span className="font-semibold text-emerald-400">{CLOSER_QA[turnIndex].speaker}: </span>{displayed}</p>
            {typingDone && (
              <div className="mt-1.5 ml-2 border-l-2 pl-3" style={{ borderColor: 'rgba(16,185,129,0.4)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-400">Suggested Response</p>
                <p className="text-sm leading-relaxed text-slate-200">
                  {responseDisplayed}
                  {!responseDone && <span className="ml-px inline-block w-[2px] bg-emerald-400 align-middle" style={{ height: '1em', animation: 'blink 0.45s ease-in-out infinite' }} />}
                </p>
              </div>
            )}
            {responseDone && turnIndex < CLOSER_QA.length - 1 && <p className="mt-4 text-xs italic text-slate-500">Press Space to continue...</p>}
          </div>
        </div>

        <div className="flex w-[300px] flex-shrink-0 flex-col gap-2">
          <PaymentMomentPanel status={paymentStatus} priceOption={priceOption} onSendLink={handleSendLink} onBackupOption={handleBackupOption} />
          <DangerWhisper state={dangerState} reason={dangerReason} whisperLine={dangerWhisperLine} onResolve={handleDangerResolve} />

          <div className="flex-1 overflow-y-auto rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Objections</p>
            {shownObjections.length === 0 && <p className="mt-2 text-xs italic text-slate-600">None raised yet.</p>}
            <div className="mt-2 space-y-2">
              {shownObjections.map((o, i) => (
                <div key={i} className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-xs font-semibold text-amber-400">{o.objection}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{o.counter}</p>
                  {o.used ? (
                    <p className="mt-1.5 text-[11px] font-semibold text-emerald-400">Used this call ✓</p>
                  ) : (
                    <button onClick={() => handleMarkUsed(i)} className="mt-1.5 rounded-md bg-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/30">
                      Mark as used
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }))} className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-medium text-slate-400 hover:text-white">
            <ArrowLeft className="hidden h-3 w-3" /> Hotkey: press P to open Payment Moment manually
          </button>
        </div>
      </div>
    </div>
  )
}
