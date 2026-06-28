import { useNavigate } from 'react-router-dom'
import { BookOpen, Check, Download, ScanLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MarketingNav, MarketingFooter } from '@/components/marketing/MarketingChrome'
import { LiveTranscriptCard } from '@/components/marketing/LiveTranscriptCard'
import { ProofStrip, Faq } from '@/components/marketing/ProofStrip'

const ACCENT = '#f59e0b'
const EXAM_PRICE = 500

const PROOF = ['Invisible to recordings & remote proctoring', '~2s average response time', 'One payment, no subscription']

const FEATURES = [
  { icon: ScanLine, title: 'One-time fee', text: 'Pay once, keep access — no subscription, no recurring charge.' },
  { icon: BookOpen, title: 'Any subject', text: 'Works on math, science, language, and licensing exams alike.' },
  { icon: Download, title: 'No setup', text: "Buy it, download it, and you're straight into the exam screen." },
]

const PRICING_BULLETS = [
  'Unlimited screenshots for your exam window',
  'Instant screenshot-to-answer, any subject',
  'No recurring charges, ever',
  'Download immediately after payment',
]

const FAQ_ITEMS = [
  {
    q: 'Can my proctor see this?',
    a: "No. Exam Ghost only renders on your display — it doesn't appear in screen recordings, shared screens, or remote-proctoring capture.",
  },
  {
    q: 'How fast is the answer, really?',
    a: 'Capture the question and the worked answer is typically back in about 2 seconds — fast enough that you never lose your place in the exam.',
  },
  {
    q: 'What happens after I pay?',
    a: "You're taken straight to the exam screen — no setup steps, no picking a use case. Enter the subject and you're ready to capture your first question.",
  },
]

export default function ExamCopilotLanding() {
  const navigate = useNavigate()

  return (
    <div className="bg-white">
      <MarketingNav active="exam" />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Exam Ghost</p>
          <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            The proctor sees a calm test-taker.
            <br />
            You see every answer.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
            A single $500 payment. Screenshot the question, get the worked answer back in seconds — invisible to
            screen recording and remote proctoring.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="bg-amber-500 text-white hover:bg-amber-600"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Exam Ghost — ${EXAM_PRICE}
            </Button>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <LiveTranscriptCard
            accent={ACCENT}
            badge="Only visible to you"
            lines={[
              { speaker: 'Screen capture', text: 'Question 14 of 40 — captured' },
              { speaker: 'Copilot', text: 'Worked answer ready — 2.1s', isAnswer: true },
            ]}
          />
        </div>
      </section>

      <ProofStrip items={PROOF} />

      <section className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Built for exam day, not a monthly plan</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {FEATURES.map(f => (
              <div key={f.title}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">One price. Lifetime access.</h2>
          <article className="mt-8 rounded-2xl border border-amber-200 bg-white p-8 text-left shadow-lg shadow-amber-900/5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-black text-slate-900">Exam Ghost</h3>
              <p className="text-3xl font-black text-slate-900">
                ${EXAM_PRICE} <span className="text-sm font-medium text-slate-500">one-time</span>
              </p>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {PRICING_BULLETS.map(b => (
                <li key={b} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                  {b}
                </li>
              ))}
            </ul>
            <Button size="lg" className="mt-8 w-full bg-amber-500 text-white hover:bg-amber-600" onClick={() => navigate('/copilot/exam/checkout')}>
              Get Exam Ghost — ${EXAM_PRICE}
            </Button>
          </article>
        </div>
      </section>

      <Faq title="Before you ask" items={FAQ_ITEMS} />

      <MarketingFooter active="exam" />
    </div>
  )
}
