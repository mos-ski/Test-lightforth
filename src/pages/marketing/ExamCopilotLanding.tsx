import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Calculator, Check, Download, Languages, ScanLine, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MarketingNav, MarketingFooter } from '@/components/marketing/MarketingChrome'
import { LiveTranscriptCard } from '@/components/marketing/LiveTranscriptCard'
import { ProofStrip, Faq } from '@/components/marketing/ProofStrip'

const ACCENT = '#f59e0b'
const EXAM_PRICE = 500

const PROOF = ['Invisible to recordings & remote proctoring', '~2s average response time', '30 days access, no auto-renewal']

const FEATURES = [
  { icon: ScanLine, title: 'One-time fee', text: 'Pay once, get 30 days of access — no subscription, no auto-renewal.' },
  { icon: BookOpen, title: 'Any subject', text: 'Works on math, science, language, and licensing exams alike.' },
  { icon: Download, title: 'No setup', text: "Buy it, download it, and you're straight into the exam screen." },
]

const PRICING_BULLETS = [
  'Unlimited screenshots for your exam window',
  'Instant screenshot-to-answer, any subject',
  'No recurring charges, ever',
  'Download immediately after payment',
]

const STEPS = [
  { icon: Download, title: 'Download & install' },
  { icon: ScanLine, title: 'Capture the question' },
  { icon: Sparkles, title: 'Get your worked answer' },
  { icon: Check, title: 'Move to the next question' },
]

const USE_CASES = [
  { icon: Calculator, title: 'Math & science', text: 'Step-by-step worked solutions, not just final answers.' },
  { icon: Languages, title: 'Language & writing', text: 'Grammar, translation, and short-answer questions alike.' },
  { icon: BookOpen, title: 'Licensing & certification', text: 'Built to keep up with dense, multi-part professional exams.' },
]

const TABS = [
  { label: 'Before the exam', body: 'Download Exam Ghost and sign in. No setup screen, no use-case picker — your account already knows what you bought.' },
  { label: 'During the exam', body: 'Auto-capture watches your screen and answers new questions as they appear. Manual capture is always available too, side-by-side with auto-capture.' },
  { label: 'After the exam', body: "Close the window. There's nothing to clean up, no trace left on your screen recording or shared screen." },
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
  {
    q: 'Does it work for any exam format?',
    a: 'Multiple choice, short answer, and multi-part written questions all work — auto-capture re-triggers every time a new question appears on screen.',
  },
  {
    q: "What if my exam doesn't allow extra software?",
    a: "That's between you and whoever administers the exam — we can't make that call for you. Exam Ghost is a screen-capture tool like any other desktop app; whether it's permitted under your exam's specific rules is worth checking before you sit down.",
  },
  {
    q: 'Can I use it for more than one exam?',
    a: "Yes — your 30-day window starts the moment you pay. Use it for as many exams as you sit during that period. No auto-renewal — when the 30 days are up, you're done unless you buy again.",
  },
]

export default function ExamCopilotLanding() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="bg-white">
      <MarketingNav active="exam" />

      {/* HERO — dark gradient with the price embedded directly in the hero */}
      <section className="bg-gradient-to-b from-[#1a1206] via-[#4a2e0a] to-amber-600 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              <Sparkles className="h-3.5 w-3.5" /> Exam Ghost
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl">
              The proctor sees a calm test-taker.
              <br />
              You see every answer.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-amber-50/80">
              A single $500 payment. Screenshot the question, get the worked answer back in seconds — invisible to
              screen recording and remote proctoring.
            </p>

            <div className="mt-8 max-w-sm rounded-2xl border border-white/20 bg-white p-5 text-slate-900 shadow-2xl shadow-black/30 sm:flex sm:items-center sm:justify-between sm:gap-4">
              <div>
                <p className="text-sm text-slate-500">One-time payment</p>
                <p className="mt-1 text-2xl font-black">${EXAM_PRICE} <span className="text-sm font-medium text-slate-500">/ 30 days</span></p>
              </div>
              <Button className="mt-3 w-full bg-amber-500 text-white hover:bg-amber-600 sm:mt-0 sm:w-auto" onClick={() => navigate('/copilot/exam/checkout')}>
                Get Exam Ghost
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
        </div>
      </section>

      <ProofStrip items={PROOF} />

      <section className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Built for exam day, not a monthly plan</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {FEATURES.map(f => (
              <div key={f.title} className="border-l-2 border-amber-300 pl-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">One payment. 30 days access. No auto-renewal.</p>
            <Button className="bg-amber-500 text-white hover:bg-amber-600" onClick={() => navigate('/copilot/exam/checkout')}>
              Get Exam Ghost — ${EXAM_PRICE}
            </Button>
          </div>
        </div>
      </section>

      {/* TABBED: before / during / after */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">From download to done</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">One tool, the whole way through exam day.</p>
          <div className="mx-auto mt-8 inline-flex rounded-full bg-slate-100 p-1 text-sm font-semibold">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={i === activeTab ? 'rounded-full bg-white px-4 py-2 text-amber-600 shadow-sm' : 'rounded-full px-4 py-2 text-slate-500'}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <p className="mt-8 text-base leading-7 text-slate-600">{TABS[activeTab].body}</p>
        </div>
      </section>

      {/* HOW IT WORKS — numbered steps */}
      <section className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">How Exam Ghost works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <step.icon className="h-6 w-6" />
                </span>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-amber-500">Step {i + 1}</p>
                <h3 className="mt-1 text-base font-bold text-slate-900">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">Works for every kind of exam</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {USE_CASES.map(uc => (
              <div key={uc.title} className="rounded-2xl border border-slate-200 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <uc.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{uc.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{uc.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-slate-100 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">One price. 30 days access.</h2>
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

      <section className="border-t border-slate-100 bg-[#1a1206] py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-2xl font-bold">Exam day is coming. Walk in ready.</h2>
          <Button size="lg" className="mt-6 bg-amber-500 text-white hover:bg-amber-600" onClick={() => navigate('/copilot/exam/checkout')}>
            Get Exam Ghost — ${EXAM_PRICE}
          </Button>
        </div>
      </section>

      <MarketingFooter active="exam" />
    </div>
  )
}
