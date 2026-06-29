import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Code2, Eye, Users, Video, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MarketingNav, MarketingFooter } from '@/components/marketing/MarketingChrome'
import { LiveTranscriptCard } from '@/components/marketing/LiveTranscriptCard'
import { ProofStrip, Faq } from '@/components/marketing/ProofStrip'
import { PLANS, annualMonthlyEquivalent, type BillingCycle, type PlanId } from '@/pages/desktopCopilot/plans'

const ACCENT = '#0494fc'

const PROOF = ['Invisible on screen shares & recordings', '~2s average response time', 'Stealth Mode & transparency control built in']

const FEATURES = [
  { icon: Video, title: 'Interview', text: "Live answers while you talk — timed so it never looks like you're reading." },
  { icon: Code2, title: 'Coding', text: 'Screenshot the problem. Get working code back before you finish re-reading it.' },
  { icon: Users, title: 'Meeting', text: "Tells every attendee on the other side apart — even with several people on the call — and feeds you talking points without anyone noticing." },
]

const STATS = [
  ['~2s', 'Average response time'],
  ['3', 'Use cases, one copilot'],
  ['100+', 'Credits included monthly'],
  ['0', 'Times it has shown up on a recording'],
]

const PLAN_BULLETS: Record<PlanId, string[]> = {
  pro: ['Interview & Coding Copilot', '50 credits / month', 'Real-time answers, every session'],
  premium: ['Everything in Pro, plus Meeting Copilot', '100 credits / month', 'Priority response speed', 'Best for daily interview prep'],
}

const FAQ_ITEMS = [
  {
    q: 'Will the interviewer see it?',
    a: "No. Copilot renders as an overlay only your display shows — it doesn't appear in screen shares, recordings, or the video feed you're sending out.",
  },
  {
    q: "What if I'm on camera the whole time?",
    a: 'Stealth Mode keeps the window invisible to screen-capture while staying fully visible to you, and the transparency slider lets you fade it further if you want it barely there.',
  },
  {
    q: 'Does it work on Zoom, Teams, and Google Meet?',
    a: "Yes — it runs as a separate window on your desktop, so it's compatible with any video call software, no plugin or extension required.",
  },
  {
    q: 'What if there\'s more than one interviewer, or several people in the meeting?',
    a: "Copilot tells the other voices on the call apart and labels who's speaking, so the transcript stays accurate even with a multi-person panel or a full meeting room — you just need to know which voice is yours.",
  },
  {
    q: 'How do credits actually get used?',
    a: "Credits are based on session length, not session count: a session under an hour is 1 credit, and each additional full hour adds one more. We'll flag it on screen once you've got under an hour of credit left, so you're never caught off guard mid-session.",
  },
]

export default function CopilotLanding() {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const isAnnual = billingCycle === 'annual'
  const priceFor = (monthlyPrice: number) => (isAnnual ? annualMonthlyEquivalent(monthlyPrice) : monthlyPrice)

  return (
    <div className="bg-white">
      <MarketingNav active="individuals" />

      {/* HERO — dotted background, headline + CTA stacked above a full-width product demo, not split side-by-side */}
      <section
        className="relative overflow-hidden bg-[#061a3a] text-white"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Interview · Coding · Meetings</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-black leading-[1.1] tracking-tight sm:text-6xl">
            Nobody on the call can <span className="underline decoration-sky-400 decoration-4 underline-offset-8">see it</span>. That's the point.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/70">
            An invisible overlay reads the conversation and feeds you the answer in real time — undetectable on
            Zoom, Teams, and Google Meet.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-[#061a3a] hover:bg-sky-50" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              See plans
            </Button>
            <a href="#stealth" className="text-sm font-semibold text-white/70 hover:text-white">
              How it stays invisible →
            </a>
          </div>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-200">
            Starting at $49/mo
          </p>

          <div className="mt-14 flex justify-center">
            <LiveTranscriptCard
              accent={ACCENT}
              badge="Only visible to you"
              lines={[
                { speaker: 'Interviewer', text: 'Walk me through a time you disagreed with a teammate.' },
                {
                  speaker: 'Copilot',
                  text: 'Frame it as alignment, not conflict — describe the disagreement, your reasoning, and how you reached a shared decision...',
                  isAnswer: true,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <ProofStrip items={PROOF} tone="dark" />

      <section className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">One copilot, three moments that matter</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {FEATURES.map(f => (
              <div key={f.title} className="border-l-2 border-primary/30 pl-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Ready to stop going in unprepared?</p>
            <Button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              See plans
            </Button>
          </div>
        </div>
      </section>

      <section id="stealth" className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
          <div className="border-l-4 border-primary pl-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Why it's invisible</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Built to stay out of sight, not just out of mind.</h2>
            <ul className="mt-6 space-y-5 text-sm leading-6 text-slate-600">
              <li className="flex gap-3">
                <Eye className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span><strong className="text-slate-900">Stealth Mode</strong> keeps the window off screen shares and recordings entirely.</span>
              </li>
              <li className="flex gap-3">
                <Eye className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span><strong className="text-slate-900">Transparency control</strong> fades the overlay so it sits quietly even on your own screen.</span>
              </li>
              <li className="flex gap-3">
                <Eye className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span><strong className="text-slate-900">Always-on-top, never in the way</strong> — positioned so your eyeline never has to move far.</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <LiveTranscriptCard
              accent={ACCENT}
              badge="Stealth Mode: on"
              lines={[
                { speaker: 'Your screen share', text: 'Shows only your camera and slides.' },
                { speaker: 'Your display', text: 'Shows the overlay — answers, timed and ready.', isAnswer: true },
              ]}
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="border-t border-slate-100 bg-white py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-2xl tracking-[0.2em] text-amber-400">★★★★★</p>
          <blockquote className="mt-5 text-2xl font-semibold leading-snug tracking-tight text-slate-900">
            "I used to freeze up mid-answer. Now I just talk — Copilot has the structure ready before I even finish the question."
          </blockquote>
          <p className="mt-6 text-sm font-semibold text-slate-900">— Priya N.</p>
          <p className="text-sm text-slate-500">Senior Product Manager, hired after 3 rounds</p>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(([value, label]) => (
            <div key={label}>
              <p className="text-4xl font-black text-slate-900">{value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-slate-100 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-bold text-slate-900">Plans for individuals</h2>
            <button
              onClick={() => setBillingCycle(c => (c === 'monthly' ? 'annual' : 'monthly'))}
              className="flex items-center gap-2.5 text-sm font-semibold text-slate-700"
            >
              <span className={cn('relative flex h-5 w-9 items-center rounded-full px-0.5 transition-colors', isAnnual ? 'bg-primary' : 'bg-slate-300')}>
                <span className={cn('h-4 w-4 rounded-full bg-white shadow transition-transform', isAnnual ? 'translate-x-4' : 'translate-x-0')} />
              </span>
              Annual <span className="text-emerald-600">(save 20%)</span>
            </button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {PLANS.map(plan => (
              <article
                key={plan.id}
                className={cn(
                  'flex flex-col rounded-2xl border bg-white p-7',
                  plan.popular ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-slate-200',
                )}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{plan.label}</h3>
                  {plan.popular && <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">Most popular</span>}
                </div>
                <p className="mt-5 text-3xl font-black text-slate-900">
                  ${priceFor(plan.monthlyPrice)} <span className="text-sm font-medium text-slate-500">/mo</span>
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {PLAN_BULLETS[plan.id].map(b => (
                    <li key={b} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm italic text-slate-500">{plan.bestForNote}</p>
                <Button size="lg" variant={plan.popular ? 'default' : 'outline'} className="mt-6" onClick={() => navigate(`/copilot/checkout/${plan.id}`)}>
                  Get {plan.label}
                </Button>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">Cancel anytime. No questions asked.</p>
        </div>
      </section>

      <Faq title="Before you ask" items={FAQ_ITEMS} />

      <section className="border-t border-slate-100 bg-[#061a3a] py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <Zap className="mx-auto h-8 w-8 text-sky-300" />
          <h2 className="mt-4 text-2xl font-bold">Your next interview is coming up. Be ready for it.</h2>
          <Button size="lg" className="mt-6 bg-white text-[#061a3a] hover:bg-sky-50" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
            See plans
          </Button>
        </div>
      </section>

      <MarketingFooter active="individuals" />
    </div>
  )
}
