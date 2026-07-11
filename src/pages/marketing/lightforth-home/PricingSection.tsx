import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PLANS, annualMonthlyEquivalent, type BillingCycle, type PlanId } from '@/pages/desktopCopilot/plans'
import { Pill } from './ui'

const PLAN_BULLETS: Record<PlanId, string[]> = {
  starter: ['Resume builder', 'Cover letter features', '15 credits / month'],
  pro: ['Everything in Starter', 'Auto-Apply & AI Interview prep', 'Interview & Coding Copilot', '50 credits / month'],
  premium: ['Everything in Pro, plus Meeting Copilot', '100 credits / month', 'Priority response speed'],
}

export function PricingSection() {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const isAnnual = billingCycle === 'annual'
  const priceFor = (monthlyPrice: number) => (isAnnual ? annualMonthlyEquivalent(monthlyPrice) : monthlyPrice)

  return (
    <section id="pricing" className="border-t border-slate-100 bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-10 max-w-3xl space-y-5 text-center">
          <Pill>Plans</Pill>
          <h2 className="text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">Plans for individuals</h2>
        </div>

        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setBillingCycle((c) => (c === 'monthly' ? 'annual' : 'monthly'))}
            className="flex items-center gap-2.5 text-sm font-semibold text-slate-700"
          >
            <span className={cn('relative flex h-5 w-9 items-center rounded-full px-0.5 transition-colors', isAnnual ? 'bg-primary' : 'bg-slate-300')}>
              <span className={cn('h-4 w-4 rounded-full bg-white shadow transition-transform', isAnnual ? 'translate-x-4' : 'translate-x-0')} />
            </span>
            Annual <span className="text-emerald-600">(save 20%)</span>
          </button>
        </div>

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
  )
}
