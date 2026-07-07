import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, Database, Headphones, Square, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MarketingNav, MarketingFooter } from '@/components/marketing/MarketingChrome'
import { LiveOverlayDemo } from '@/components/marketing/LiveOverlayDemo'
import { CallBackground } from '@/components/marketing/CallBackground'
import { ProofStrip, Faq } from '@/components/marketing/ProofStrip'
import WaitlistBlock from '@/components/marketing/WaitlistBlock'

const PROOF = ['Live during the call, not after it', 'Every rep, same playbook', 'New hires sound ramped on day one']

const FEATURES = [
  { icon: Database, title: 'Knowledge base', text: 'Upload your playbook, pricing, and objection handling once.' },
  { icon: UserPlus, title: 'Team management', text: 'Invite reps by email and generate their login in seconds.' },
  { icon: Headphones, title: 'Live coaching', text: "Real-time answers during every call, not just after it — even when there's more than one voice on the prospect's side." },
]

const CASE_STUDIES = [
  { name: 'Layers', color: 'bg-[#08285c]', quote: "We stopped losing deals to reps who didn't know the pricing page cold. Sales Closer AI gave every rep the same answer, instantly." },
  { name: 'Sisyphus', color: 'bg-teal-600', quote: "New hires sounded ramped by week one instead of month three. The knowledge base did the onboarding for us." },
  { name: 'Capsule', color: 'bg-[#1570ef]', quote: 'Objection handling stopped depending on which rep picked up the call.' },
]

const PRICING_BULLETS = [
  'Admin dashboard with knowledge base & team management',
  'Generate teammate invite codes as you add seats',
  'Admin gets desktop access as soon as their seat is paid',
  'Add seats any time — pay only for active reps',
]

const INDIVIDUAL_PRICE = 99.90

const INDIVIDUAL_BULLETS = [
  'Everything in Sales Closer AI — live coaching, your own knowledge base, call history',
  'No team required — set up your own playbook and go live solo',
  'Move to Enterprise any time your team grows',
]

const ENTERPRISE_BOOKING_URL = 'https://calendly.com/lightforth/enterprise'

const FAQ_ITEMS = [
  {
    q: "How is this different from Gong or Chorus?",
    a: "Call-intelligence tools tell you what went wrong after the call ends. Sales Closer AI answers the objection while the rep is still on the line — coaching happens in the moment that decides the deal, not in a Monday recap.",
  },
  {
    q: 'Do all my reps need to be live at once?',
    a: 'No. Your own seat activates the moment you pay for it, independent of the rest of the team — add and pay for reps one at a time as you onboard them.',
  },
  {
    q: 'What happens to our call recordings and transcripts?',
    a: "They're kept for up to 90 days and reviewable in your Call History. Whoever owns the account — a solo rep on the Individual plan, or the admin on an Enterprise team — has access to everything in the dashboard; granular per-rep permissions are on our roadmap, not available yet.",
  },
  {
    q: "What if there's more than one person on the prospect's side of the call?",
    a: "Sales Closer AI tells the voices on the other end apart, so the answer it surfaces still applies to whoever's actually asking — your rep doesn't lose the thread when a second stakeholder joins partway through.",
  },
]

export default function EnterpriseCopilotLanding() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isWaitlist = searchParams.has('waitlist')
  const scrollToWaitlist = () => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="bg-white">
      <MarketingNav active="enterprise" />

      {/* HERO — light teal-tinted bg, headline + 2 CTAs stacked above a full-width demo */}
      <section className="bg-gradient-to-b from-teal-50 via-white to-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:py-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-1.5 text-xs font-semibold text-teal-700 shadow-sm">
            For B2B sales teams
          </p>
          <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-[#08285c] sm:text-5xl">
            Stop losing deals to reps who freeze on objections.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-600">
            {isWaitlist
              ? 'Join the early access list for live sales-call coaching powered by your own playbook and knowledge base.'
              : 'Upload your playbook once. Every rep — from day one — gets the right answer live, on the call, pulled straight from your own knowledge base.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-teal-500 font-bold text-white hover:bg-teal-600"
              onClick={() => isWaitlist ? scrollToWaitlist() : document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {isWaitlist ? 'Join the waitlist →' : 'Get started'}
            </Button>
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              See what reps get →
            </a>
          </div>
          {isWaitlist && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#08285c]/5 px-4 py-2 text-sm font-semibold text-[#08285c]">
              Early access waitlist now open
            </p>
          )}

          <div className="mt-16 flex justify-center px-4">
            <div className="relative w-full max-w-3xl">
              <div className="absolute -top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full px-3 py-1.5 shadow-lg" style={{ background: '#0c1d48' }}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: '#2dd4bf' }}>
                  <span className="h-2 w-2 rounded-full bg-[#0c1d48]" />
                </span>
                <span className="text-xs font-semibold text-white">Hide</span>
                <ChevronDown className="h-3 w-3 text-white/50" />
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded bg-white/10">
                  <Square className="h-2.5 w-2.5 fill-white/70 text-white/70" />
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="mx-auto text-xs font-semibold text-slate-400">Zoom — Sales Call</span>
                </div>
                <div className="relative h-[360px] sm:h-[420px]">
                  <CallBackground />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <LiveOverlayDemo />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProofStrip items={PROOF} tone="light" />

      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Built for rolling out a whole team</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {FEATURES.map(f => (
              <div key={f.title} className="border-l-2 border-teal-300 pl-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{f.text}</p>
                <a href={isWaitlist ? '#waitlist' : '#pricing'} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700">
                  {isWaitlist ? 'Join waitlist' : 'See how'} <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Ready to stop losing deals to silence on the call?</p>
            <Button className="bg-[#08285c] text-white hover:bg-[#08285c]/90" onClick={() => isWaitlist ? scrollToWaitlist() : document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              {isWaitlist ? 'Join the waitlist →' : 'Get started'}
            </Button>
          </div>
        </div>
      </section>

      {/* CASE STUDIES — horizontal scroll carousel */}
      <section className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Teams that stopped losing the room</h2>
          <div className="mt-10 flex gap-6 overflow-x-auto pb-4">
            {CASE_STUDIES.map(study => (
              <article key={study.name} className={`min-w-[280px] rounded-2xl p-7 text-white ${study.color}`}>
                <p className="text-lg font-extrabold">{study.name}</p>
                <p className="mt-5 text-sm leading-6 text-white/90">"{study.quote}"</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* "WHAT YOUR ADMIN SEES" dashboard preview */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">What your admin sees</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">One dashboard for the knowledge base, the team, and every call.</p>
          <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs font-semibold text-slate-400">Sales Closer AI — Admin Overview</span>
            </div>
            <div className="grid grid-cols-3 gap-4 bg-white p-6 text-left">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-black text-slate-900">12</p>
                <p className="text-xs text-slate-500">Active seats</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-black text-teal-600">340</p>
                <p className="text-xs text-slate-500">Calls this month</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-black text-slate-900">8.4m</p>
                <p className="text-xs text-slate-500">Avg. call length</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!isWaitlist && (
        <section id="pricing" className="border-t border-slate-100 bg-slate-50/60 py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Choose your plan</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-lg shadow-slate-900/5">
                <h3 className="text-lg font-black text-slate-900">Individual</h3>
                <p className="mt-5 text-2xl font-black text-slate-900">
                  ${INDIVIDUAL_PRICE.toFixed(2)} <span className="text-sm font-medium text-slate-500">/ month</span>
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {INDIVIDUAL_BULLETS.map(b => (
                    <li key={b} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="mt-8 w-full bg-teal-500 text-white hover:bg-teal-600" onClick={() => navigate('/copilot/individual/checkout')}>
                  Get started
                </Button>
              </article>

              <article className="rounded-2xl border border-teal-200 bg-white p-8 text-left shadow-lg shadow-teal-900/5">
                <h3 className="text-lg font-black text-slate-900">Enterprise</h3>
                <p className="mt-5 text-sm font-semibold text-slate-500">Custom rollout for your whole team</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {PRICING_BULLETS.map(b => (
                    <li key={b} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  className="mt-8 w-full bg-[#08285c] text-white hover:bg-[#08285c]/90"
                  onClick={() => window.open(ENTERPRISE_BOOKING_URL, '_blank', 'noopener,noreferrer')}
                >
                  Book a Call
                </Button>
              </article>
            </div>
          </div>
        </section>
      )}

      <Faq
        title="Before you ask"
        items={isWaitlist ? FAQ_ITEMS.filter(item => !item.q.includes('$')) : FAQ_ITEMS}
      />

      <section className="border-t border-slate-100 bg-[#08285c] py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-2xl font-bold">Give your whole team the same playbook.</h2>
          <Button
            size="lg"
            className="mt-6 bg-teal-400 font-bold text-[#08285c] hover:bg-teal-300"
            onClick={() => isWaitlist ? scrollToWaitlist() : document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get started
          </Button>
        </div>
      </section>

      {isWaitlist && <WaitlistBlock product="Lightforth Sales Copilot" accent="#08285c" accentFg="#fff" />}
      {!isWaitlist && <MarketingFooter active="enterprise" />}
    </div>
  )
}
