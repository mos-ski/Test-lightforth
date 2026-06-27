import { useNavigate } from 'react-router-dom'
import { Check, Database, Headphones, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MarketingNav, MarketingFooter } from '@/components/marketing/MarketingChrome'
import { LiveTranscriptCard } from '@/components/marketing/LiveTranscriptCard'
import { ProofStrip, Faq } from '@/components/marketing/ProofStrip'

const ACCENT = '#2dd4bf'

const PROOF = ['Live during the call, not after it', 'Every rep, same playbook', 'New hires sound ramped on day one']

const FEATURES = [
  { icon: Database, title: 'Knowledge base', text: 'Upload your playbook, pricing, and objection handling once.' },
  { icon: UserPlus, title: 'Team management', text: 'Invite reps by email and generate their login in seconds.' },
  { icon: Headphones, title: 'Live coaching', text: 'Real-time answers during every call, not just after it.' },
]

const PRICING_BULLETS = [
  'Admin dashboard with knowledge base & team management',
  'Generate teammate invite codes as you add seats',
  'Admin gets desktop access as soon as their seat is paid',
  'Add seats any time — pay only for active reps',
]

const FAQ_ITEMS = [
  {
    q: "How is this different from Gong or Chorus?",
    a: "Call-intelligence tools tell you what went wrong after the call ends. Copilot answers the objection while the rep is still on the line — coaching happens in the moment that decides the deal, not in a Monday recap.",
  },
  {
    q: 'What does the $5,000 setup fee actually cover?',
    a: "Standing up your admin dashboard, ingesting your knowledge base, and provisioning your team's first seats — it's a one-time cost, not a recurring charge.",
  },
  {
    q: 'Do all my reps need to be live at once?',
    a: 'No. Your own seat activates the moment you pay for it, independent of the rest of the team — add and pay for reps one at a time as you onboard them.',
  },
]

export default function EnterpriseCopilotLanding() {
  const navigate = useNavigate()

  return (
    <div className="bg-white">
      <MarketingNav active="enterprise" />

      <section className="bg-[#08285c] px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">For sales teams</p>
            <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl">
              Stop losing deals to reps who freeze on objections.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/70">
              Upload your playbook once. Every rep — from day one — gets the right answer live, on the call, pulled
              straight from your own knowledge base.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="bg-teal-400 font-bold text-[#08285c] hover:bg-teal-300"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get started
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <LiveTranscriptCard
              accent={ACCENT}
              badge="Live call"
              lines={[
                { speaker: 'Prospect', text: "It's more than we budgeted for this year." },
                {
                  speaker: 'Copilot',
                  text: 'Reframe around the cost of staying put — ask what the status quo is actually costing them per month...',
                  isAnswer: true,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <ProofStrip items={PROOF} tone="light" />

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Built for rolling out a whole team</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {FEATURES.map(f => (
              <div key={f.title}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Simple, per-seat pricing</h2>
          <article className="mt-8 rounded-2xl border border-teal-200 bg-white p-8 text-left shadow-lg shadow-teal-900/5">
            <h3 className="text-lg font-black text-slate-900">Enterprise</h3>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-2xl font-black text-slate-900">
                $5,000 <span className="text-sm font-medium text-slate-500">one-time setup</span>
              </p>
              <p className="text-2xl font-black text-slate-900">
                + $79 <span className="text-sm font-medium text-slate-500">/ seat / month</span>
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
            <Button size="lg" className="mt-8 w-full bg-[#08285c] text-white hover:bg-[#08285c]/90" onClick={() => navigate('/copilot/enterprise/checkout')}>
              Get started
            </Button>
          </article>
        </div>
      </section>

      <Faq title="Before you ask" items={FAQ_ITEMS} />

      <MarketingFooter active="enterprise" />
    </div>
  )
}
