import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PLANS, annualMonthlyEquivalent, type BillingCycle, type PlanId } from '@/pages/desktopCopilot/plans'
import { MarketingLayout } from '../MarketingLayout'

const PLAN_BULLETS: Record<PlanId, string[]> = {
  starter: ['Resume builder', 'Cover letter features', '15 credits / month'],
  pro: ['Everything in Starter', 'Auto-Apply & AI Interview prep', 'Interview & Coding Copilot', '50 credits / month'],
  premium: ['Everything in Pro, plus Meeting Copilot', '100 credits / month', 'Priority response speed'],
}

const CREDIT_USES = [
  { coin: '1', title: 'AI Resume Tailoring', desc: 'Optimize your resume for any job description with AI-powered matching' },
  { coin: '1', title: 'Interview Prep', desc: 'Practice with voice-enabled AI mock interviews and get real-time feedback' },
  { coin: '1', title: 'Interview Copilot', desc: 'Get live AI assistance during your actual interviews for confident answers' },
  { coin: '1', title: 'Auto-Apply', desc: 'Automatically submit tailored applications to matching jobs across platforms' },
]

export default function PricingPage() {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const isAnnual = billingCycle === 'annual'
  const priceFor = (monthlyPrice: number) => (isAnnual ? annualMonthlyEquivalent(monthlyPrice) : monthlyPrice)

  return (
    <MarketingLayout>
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#f0f7ff] to-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Pricing Plans</h1>
          <h2 className="mt-3 text-2xl font-bold text-slate-700">Choose Your Plan</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Flexible credit-based pricing. Use credits for AI Resume Tailoring, Interview Prep, Interview Copilot, or Auto-Apply.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setBillingCycle((c) => (c === 'monthly' ? 'annual' : 'monthly'))}
              className="flex items-center gap-2.5 text-sm font-semibold text-slate-700"
            >
              <span className={cn('relative flex h-5 w-9 items-center rounded-full px-0.5 transition-colors', isAnnual ? 'bg-primary' : 'bg-slate-300')}>
                <span className={cn('h-4 w-4 rounded-full bg-white shadow transition-transform', isAnnual ? 'translate-x-4' : 'translate-x-0')} />
              </span>
              Monthly / Yearly <span className="text-emerald-600">(20% off)</span>
            </button>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
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
                  {PLAN_BULLETS[plan.id].map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm italic text-slate-500">{plan.bestForNote}</p>
                <Button size="lg" variant={plan.popular ? 'default' : 'outline'} className="mt-6" onClick={() => navigate(`/checkout/${plan.id}`)}>
                  Get {plan.label}
                </Button>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">Cancel anytime. No questions asked.</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-center text-slate-900">How Credits Work</h2>
          <p className="text-center mt-2 text-slate-600">One credit equals one action. Use them flexibly across all features to accelerate your job search.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {CREDIT_USES.map((c) => (
              <div key={c.title} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                  {c.coin}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{c.title}</h3>
                  <p className="text-sm text-slate-600">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">Flexibility is key: Mix and match credits across any feature based on your current job search needs</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {[
              { q: 'What happens when I run out of credits?', a: 'You can upgrade to a higher plan anytime or purchase additional credits as needed. Your credits renew monthly.' },
              { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime. Your subscription will remain active until the end of your billing period.' },
              { q: 'Do unused credits roll over?', a: 'No, credits reset each month based on your plan. We recommend using them within your billing cycle to maximize value.' },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
