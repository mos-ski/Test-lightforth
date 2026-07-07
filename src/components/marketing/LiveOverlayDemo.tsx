import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'

const ACCENT = '#2dd4bf'
const BADGE = 'Live call'

type Phase = 'listening' | 'processing' | 'answering' | 'hold'

interface Turn {
  q: string
  a: string
}

const TURNS: Turn[] = [
  {
    q: "It's more than we budgeted for this year.",
    a: 'Reframe around the cost of staying put — ask what the status quo is actually costing them per month.',
  },
  {
    q: "What makes you different from your current tool?",
    a: 'We integrate natively with your existing stack — no migration needed. A similar customer cut onboarding time by 60%.',
  },
  {
    q: 'Can you send a proposal by end of week?',
    a: "Confirm and create urgency: I'll have it in your inbox by Thursday — want 30 minutes Friday to walk through it?",
  },
]

const DEAL_STAGES = ['Discovery', 'Demo', 'Negotiation']

const TYPE_MS = 22
const HOLD_AFTER_ANSWER_MS = 1800
const PROCESSING_MS = 1100

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener?.('change', handler)
    return () => query.removeEventListener?.('change', handler)
  }, [])
  return reduced
}

export function LiveOverlayDemo({
  variant = 'panel',
  forceStatic = false,
}: { variant?: 'panel' | 'card'; forceStatic?: boolean } = {}) {
  const reducedMotion = usePrefersReducedMotion()
  const frozen = reducedMotion || forceStatic
  const [turnIndex, setTurnIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('listening')
  const [qDisplayed, setQDisplayed] = useState('')
  const [aDisplayed, setADisplayed] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (frozen) return

    const clearTimers = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    const turn = TURNS[turnIndex]

    if (phase === 'listening') {
      setADisplayed('')
      let i = 0
      intervalRef.current = setInterval(() => {
        i++
        setQDisplayed(turn.q.slice(0, i))
        if (i >= turn.q.length) {
          clearTimers()
          timeoutRef.current = setTimeout(() => setPhase('processing'), 500)
        }
      }, TYPE_MS)
    } else if (phase === 'processing') {
      timeoutRef.current = setTimeout(() => setPhase('answering'), PROCESSING_MS)
    } else if (phase === 'answering') {
      let i = 0
      intervalRef.current = setInterval(() => {
        i += 3
        setADisplayed(turn.a.slice(0, i))
        if (i >= turn.a.length) {
          clearTimers()
          timeoutRef.current = setTimeout(() => setPhase('hold'), HOLD_AFTER_ANSWER_MS)
        }
      }, TYPE_MS)
    } else {
      timeoutRef.current = setTimeout(() => {
        setQDisplayed('')
        setADisplayed('')
        setTurnIndex(i => (i + 1) % TURNS.length)
        setPhase('listening')
      }, 400)
    }

    return clearTimers
  }, [phase, turnIndex, frozen])

  const stageIndex = phase === 'hold' ? Math.min(turnIndex + 1, DEAL_STAGES.length - 1) : turnIndex
  const statusText: Record<Phase, string> = {
    listening: 'Listening to customer...',
    processing: 'Preparing response...',
    answering: 'Coaching...',
    hold: 'Coaching...',
  }

  const displayedQ = frozen ? TURNS[0].q : qDisplayed
  const displayedA = frozen ? TURNS[0].a : aDisplayed
  const displayedStageIndex = frozen ? 0 : stageIndex
  const displayedStatus = frozen ? statusText.answering : statusText[phase]

  const dealStageTracker = (
    <span className="flex items-center gap-1">
      {DEAL_STAGES.map((stage, i) => (
        <span
          key={stage}
          className="h-1.5 w-1.5 rounded-full transition-colors"
          style={{ background: i <= displayedStageIndex ? ACCENT : 'rgba(255,255,255,0.15)' }}
        />
      ))}
    </span>
  )

  const qaContent = (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/35">Prospect</p>
        <p className="mt-1.5 text-sm leading-relaxed text-white/65">{displayedQ}</p>
      </div>
      {displayedA && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>Suggested Response</p>
          <p className="mt-1.5 text-sm leading-relaxed text-white">{displayedA}</p>
        </div>
      )}
    </div>
  )

  if (variant === 'card') {
    return (
      <div
        aria-hidden="true"
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b1530] p-5 shadow-2xl shadow-slate-900/30"
      >
        <div className="mb-5 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
            {BADGE}
          </span>
          <span className="ml-auto">{dealStageTracker}</span>
        </div>

        <p className="mb-4 text-[11px] italic text-white/40">{displayedStatus}</p>

        {qaContent}
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1530]/95 p-5 shadow-2xl shadow-slate-900/40 backdrop-blur"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] italic text-white/40">{displayedStatus}</p>
        {dealStageTracker}
      </div>

      {qaContent}

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <span className="flex-1 text-xs text-white/35">Ask about your screen or conversation...</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/50">Smart</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: ACCENT }}>
          <Send className="h-3 w-3 text-[#0b1530]" />
        </span>
      </div>
    </div>
  )
}
