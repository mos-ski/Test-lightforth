import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Check, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react'
import LightforthLogo from '@/components/shared/LightforthLogo'
import { setAccount } from '@/pages/desktopCopilot/mockAccounts'
import { getPlan } from '@/pages/desktopCopilot/plans'
import { useAuth, DEMO_EMAIL } from '@/hooks/useAuth'

type Step = 'watch' | 'offer' | 'bump' | 'payment' | 'success'

const TRAINING_POINTS = [
  'The real reason your resume gets auto-rejected before a human ever sees it',
  'The exact interview framework hiring managers are now trained to screen for',
  'How to apply to 10x more roles without losing quality or getting flagged as spam',
  'A live look at Lightforth doing all three for you, automatically',
  'The one-time $49 offer available only to people who finish this training',
]

const PAIN_POINTS = [
  {
    title: 'Your resume never reaches a human',
    body: "Most companies now filter applications with an ATS before anyone reads them. A great candidate with the wrong formatting or keywords gets rejected in seconds — silently.",
  },
  {
    title: "You freeze on questions you've heard before",
    body: 'You know the questions are coming. "Tell me about yourself." "Why should we hire you?" And yet, live, under pressure, the answer falls apart.',
  },
  {
    title: "You're applying to jobs one at a time",
    body: "While you're carefully tailoring one application, other candidates — and other people's automation — are already in 40 other inboxes.",
  },
]

interface BumpItem {
  id: string
  label: string
  description: string
  price: number
  highlight?: boolean
}

const BUMP_ITEMS: BumpItem[] = [
  { id: 'questions', label: '5 Must-Master Interview Questions — Answer Swipe File', description: 'Word-for-word answer frameworks for the questions that end interviews early.', price: 19 },
  { id: 'resumes', label: '10 Fully Customizable Resume Templates', description: 'ATS-safe templates for every industry, ready to fill in and send today.', price: 29 },
  { id: 'negotiation', label: 'Salary Negotiation Word-for-Word Scripts', description: "Exactly what to say when they ask your salary expectations — and when they make an offer.", price: 15 },
  { id: 'linkedin', label: 'LinkedIn Profile Optimization Checklist', description: 'The same checklist recruiters use to decide who gets a message.', price: 12 },
  { id: 'plan', label: '30-Day Job Search Action Plan', description: 'A day-by-day plan so you always know exactly what to do next.', price: 17 },
  {
    id: 'autoapply',
    label: 'Auto-Apply Concierge — We Apply For You, Daily',
    description: 'Our highest-converting add-on: our system applies to matching roles on your behalf every day you stay subscribed.',
    price: 499,
    highlight: true,
  },
]

const PRO_PLAN = getPlan('pro')

function CenteredLogoBar({ onBack }: { onBack?: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
      {onBack ? (
        <button onClick={onBack} className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      ) : (
        <span />
      )}
      <LightforthLogo linked={false} className="h-7 w-auto" />
      <span className="w-12" />
    </div>
  )
}

function WatchStep({ onClaimOffer }: { onClaimOffer: () => void }) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [ctaRevealed, setCtaRevealed] = useState(false)
  const captionIndex = Math.min(Math.floor(elapsed / 3), TRAINING_POINTS.length - 1)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!playing) return
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1
        if (next >= 8) setCtaRevealed(true)
        return next
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [playing])

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const seconds = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="bg-gradient-to-b from-[#f0f7ff] to-white">
      <CenteredLogoBar />

      <div className="mx-auto max-w-3xl px-6 pb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Free Training For Job Seekers
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          Why You're Losing Job Offers You're{' '}
          <span className="relative inline-block">
            <span className="relative z-10">Actually Qualified For</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue-200/60 -rotate-1 z-0" />
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-slate-600 md:text-lg">
          Hiring changed. Most job seekers are still using tactics from a decade ago against today's
          AI-screened, high-volume hiring process. In the next few minutes, you'll see exactly what's
          costing you interviews — and the fastest way to fix it.
        </p>
      </div>

      <div className="mx-auto max-w-4xl px-6">
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr]">
          <div>
            <button
              onClick={() => setPlaying(true)}
              className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl shadow-blue-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black" />
              {!playing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-lg transition group-hover:scale-105">
                    <Play className="ml-1 h-8 w-8 fill-accent text-accent" />
                  </span>
                  <span className="text-sm font-medium text-white/80">Click to watch the free training (22 min)</span>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
                  <span className="flex h-3 w-3 animate-pulse rounded-full bg-red-500" />
                  <p className="max-w-md text-lg font-semibold text-white">{TRAINING_POINTS[captionIndex]}</p>
                  <span className="mt-2 font-mono text-xs text-white/60">{minutes}:{seconds}</span>
                </div>
              )}
              {playing && (
                <div className="absolute bottom-0 left-0 h-1 bg-accent transition-all" style={{ width: `${Math.min((elapsed / 8) * 100, 100)}%` }} />
              )}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">In this free training</p>
            <ul className="mt-4 space-y-3">
              {TRAINING_POINTS.map((point, i) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${playing && i <= captionIndex ? 'text-accent' : 'text-slate-300'}`} />
                  <span className={playing && i <= captionIndex ? 'text-slate-900' : ''}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-6">
          {PAIN_POINTS.map(p => (
            <div key={p.title} className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{p.body}</p>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {ctaRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="sticky bottom-6 z-10 mx-auto mt-10 mb-16 max-w-md rounded-2xl border border-blue-200 bg-white p-6 text-center shadow-2xl shadow-blue-900/10"
            >
              <p className="text-sm font-semibold text-slate-500">Available now — training viewers only</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                Lightforth Pro — <span className="text-accent">$49/mo</span>
              </p>
              <button
                onClick={onClaimOffer}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-on-accent shadow-lg shadow-blue-500/25 transition hover:bg-accent-hover active:scale-[0.98]"
              >
                <Sparkles className="h-5 w-5" />
                Yes, I Want In — Claim My Offer
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Cancel anytime. No long-term contract.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function OfferStep({ onBack, onContinue }: { onBack: () => void; onContinue: (email: string, phone: string) => void }) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const valid = email.trim().length > 3 && phone.trim().length > 6

  return (
    <div className="min-h-screen bg-slate-50">
      <CenteredLogoBar onBack={onBack} />
      <div className="mx-auto flex max-w-md flex-col px-6 pb-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step 1 of 3</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Your Interview Mastery Offer</h1>
        <p className="mt-1 text-sm text-slate-500">Available exclusively to training viewers today</p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">Lightforth Pro</span>
            <span className="text-lg font-bold text-accent">$49/mo</span>
          </div>
          <ul className="mt-4 space-y-2.5">
            {PRO_PLAN.bullets.map(b => (
              <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {b}
              </li>
            ))}
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {PRO_PLAN.credits} credits every month
            </li>
          </ul>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="lf-input" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Phone number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 555-5555" className="lf-input" />
          </div>
        </div>

        <button
          disabled={!valid}
          onClick={() => onContinue(email, phone)}
          className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-on-accent shadow-lg shadow-blue-500/25 transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function BumpStep({
  selected,
  onToggle,
  onBack,
  onContinue,
}: {
  selected: Set<string>
  onToggle: (id: string) => void
  onBack: () => void
  onContinue: () => void
}) {
  const total = 49 + BUMP_ITEMS.filter(i => selected.has(i.id)).reduce((sum, i) => sum + i.price, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <CenteredLogoBar onBack={onBack} />
      <div className="mx-auto flex max-w-xl flex-col px-6 pb-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step 2 of 3</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Wait — Boost Your Results</h1>
        <p className="mt-1 text-sm text-slate-500">One-time add-ons, available only on this page. Check anything you want.</p>

        <div className="mt-6 space-y-3">
          {BUMP_ITEMS.map(item => {
            const checked = selected.has(item.id)
            return (
              <label
                key={item.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  checked ? 'border-accent bg-blue-50/60' : 'border-slate-200 bg-white'
                } ${item.highlight ? 'ring-1 ring-amber-300' : ''}`}
              >
                <input type="checkbox" checked={checked} onChange={() => onToggle(item.id)} className="mt-1 h-4 w-4 accent-[var(--lf-accent)]" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900">{item.label}</span>
                    <span className="whitespace-nowrap text-sm font-bold text-slate-900">+${item.price}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                  {item.highlight && <span className="mt-1.5 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Most popular add-on</span>}
                </div>
              </label>
            )
          })}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-100 p-4">
          <span className="text-sm font-semibold text-slate-600">Total due today</span>
          <span className="text-lg font-bold text-slate-900">${total}</span>
        </div>

        <button
          onClick={onContinue}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-on-accent shadow-lg shadow-blue-500/25 transition hover:bg-accent-hover"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}

function PaymentStep({
  selected,
  onBack,
  onPay,
}: {
  selected: Set<string>
  onBack: () => void
  onPay: () => void
}) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const cardValid = cardNumber.trim().length > 0 && expiry.trim().length > 0 && cvc.trim().length > 0

  const lineItems = [{ label: 'Lightforth Pro — monthly', price: 49 }, ...BUMP_ITEMS.filter(i => selected.has(i.id)).map(i => ({ label: i.label, price: i.price }))]
  const total = lineItems.reduce((sum, li) => sum + li.price, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <CenteredLogoBar onBack={onBack} />
      <div className="mx-auto flex max-w-md flex-col px-6 pb-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step 3 of 3</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Payment</h1>

        <div className="mt-5 space-y-2 rounded-xl border border-slate-200 bg-white p-4">
          {lineItems.map(li => (
            <div key={li.label} className="flex justify-between gap-4 text-sm text-slate-600">
              <span>{li.label}</span>
              <span className="whitespace-nowrap font-semibold text-slate-900">${li.price}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
            <span>Total due today</span>
            <span>${total}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Card number</label>
            <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" className="lf-input" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Expiry</label>
              <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" className="lf-input" />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">CVC</label>
              <input value={cvc} onChange={e => setCvc(e.target.value)} placeholder="123" className="lf-input" />
            </div>
          </div>
        </div>

        <button
          disabled={!cardValid}
          onClick={onPay}
          className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-on-accent shadow-lg shadow-blue-500/25 transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Pay ${total} Securely
        </button>
        <p className="mt-3 text-center text-[11px] text-slate-400">Mock checkout — no real card is charged.</p>
      </div>
    </div>
  )
}

function SuccessStep({ email, onGoToDashboard }: { email: string; onGoToDashboard: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f0f7ff] to-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <Check className="h-7 w-7 text-accent" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">You're in!</h1>
        <p className="mt-2 text-sm text-slate-600">
          We've created your Lightforth account and sent your login details to <span className="font-semibold text-slate-900">{email || 'your inbox'}</span>.
        </p>
        <button
          onClick={onGoToDashboard}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-on-accent shadow-lg shadow-blue-500/25 transition hover:bg-accent-hover"
        >
          Go to My Dashboard
        </button>
      </div>
    </div>
  )
}

export default function MasterInterviewVSL() {
  const [step, setStep] = useState<Step>('watch')
  const [selectedBumps, setSelectedBumps] = useState<Set<string>>(new Set())
  const [contactEmail, setContactEmail] = useState('')
  const navigate = useNavigate()
  const { setPlan } = useAuth()

  function toggleBump(id: string) {
    setSelectedBumps(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function completePurchase() {
    setAccount(DEMO_EMAIL, { accountType: 'regular', planId: 'pro' })
    setPlan('pro')
    setStep('success')
  }

  switch (step) {
    case 'watch':
      return <WatchStep onClaimOffer={() => setStep('offer')} />
    case 'offer':
      return (
        <OfferStep
          onBack={() => setStep('watch')}
          onContinue={(email) => {
            setContactEmail(email)
            setStep('bump')
          }}
        />
      )
    case 'bump':
      return <BumpStep selected={selectedBumps} onToggle={toggleBump} onBack={() => setStep('offer')} onContinue={() => setStep('payment')} />
    case 'payment':
      return <PaymentStep selected={selectedBumps} onBack={() => setStep('bump')} onPay={completePurchase} />
    case 'success':
      return <SuccessStep email={contactEmail} onGoToDashboard={() => navigate('/app')} />
  }
}
