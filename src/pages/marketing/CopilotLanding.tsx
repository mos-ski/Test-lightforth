import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MarketingNav, MarketingFooter } from '@/components/marketing/MarketingChrome'
import { PLANS, annualMonthlyEquivalent, type BillingCycle, type PlanId } from '@/pages/desktopCopilot/plans'
import WaitlistBlock from '@/components/marketing/WaitlistBlock'
import { HeroSection } from './copilot/HeroSection'
import { FeatureShowcase } from './copilot/FeatureShowcase'
import { TestimonialsSection } from './copilot/TestimonialsSection'
import { IndustriesSection } from './copilot/IndustriesSection'
import { TrustStatsSection } from './copilot/TrustStatsSection'
import { FaqSection } from './copilot/FaqSection'
import { FinalCtaSection } from './copilot/FinalCtaSection'

const PLAN_BULLETS: Record<PlanId, string[]> = {
  pro: ['Interview & Coding Copilot', '50 credits / month', 'Real-time answers, every session'],
  premium: ['Everything in Pro, plus Meeting Copilot', '100 credits / month', 'Priority response speed', 'Best for daily interview prep'],
}

export default function CopilotLanding() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isWaitlist = searchParams.has('waitlist')
  const scrollToWaitlist = () => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  const onPrimaryCta = () => (isWaitlist ? scrollToWaitlist() : document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }))
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const isAnnual = billingCycle === 'annual'
  const priceFor = (monthlyPrice: number) => (isAnnual ? annualMonthlyEquivalent(monthlyPrice) : monthlyPrice)

  return (
    <div className="bg-white">
      <MarketingNav active="individuals" />

      <HeroSection isWaitlist={isWaitlist} onPrimaryCta={onPrimaryCta} />

      <FeatureShowcase />

      <TestimonialsSection />

      <IndustriesSection />

      <TrustStatsSection />

      {!isWaitlist && (
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
      )}

      <FaqSection />

      <FinalCtaSection isWaitlist={isWaitlist} onPrimaryCta={onPrimaryCta} />

      {isWaitlist && <WaitlistBlock product="Lightforth Copilot" accent="#061a3a" accentFg="#fff" />}
      {!isWaitlist && <MarketingFooter active="individuals" />}
    </div>
  )
}
