import { Check, Gift } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { centsToCredits, usagePercent } from '@/lib/credits'

const WALLET_REMAINING_CENTS = 1840
const WALLET_TOTAL_CENTS = 2200

const plans = [
  {
    name: 'STARTER',
    price: '$27',
    credits: '20 Credits',
    description: 'The budget tier to get your job hunt started with the essentials.',
    features: ['20 credits per month', 'Resume builder', 'Download resumes'],
    note: 'Ideal for light or occasional job applications',
  },
  {
    name: 'PRO',
    price: '$49',
    credits: '55 Credits',
    description: 'More usage included. Unlock our full suite of tools to actively apply and prep for interviews.',
    features: ['55 credits per month', 'All features from Starter', 'Auto-Apply', 'AI Interview prep', 'Interview & Coding Copilot'],
    note: 'Best for users who want AI + autopilot help consistently',
    popular: true,
    current: true,
  },
  {
    name: 'PREMIUM',
    price: '$79',
    credits: '100 Credits',
    description: 'Built for power users who apply daily or want maximum automation.',
    features: ['100 credits per month', 'All features from PRO', 'Meeting Copilot', 'Automate job applications with a daily quota', 'Priority support'],
    note: 'Best value for serious job hunters',
  },
]

const creditRows = [
  ['Resume Builder', 'One prompt (or group of prompts) sent to AI', '1 credit / message ($0.40)', false],
  ['Auto Apply', 'One successful job application', '3 credits / application ($1.20)', false],
  ['Interview Prep', 'Metered per minute of the live session', '2 credits / min ($0.80)', false],
  ['Interview Copilot', 'Metered per minute of the live session', '2 credits / min ($0.80)', false],
  ['Coding Copilot', 'Metered per minute of the live session', '2 credits / min ($0.80)', false],
  ['Meeting Copilot', 'Metered per minute of the live session', '2 credits / min ($0.80)', false],
  ['ATS Scoring', 'Click "Score Resume"', '0 credits', true],
  ['AI Suggester', 'Writes a phrase/statement better', '0 credits', true],
] as const

export default function Billing() {
  const navigate = useNavigate()
  const remainingPercent = usagePercent(WALLET_REMAINING_CENTS, WALLET_TOTAL_CENTS)
  return (
    <div className="lf-page-stack">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Billing & Subscription</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="lf-panel p-6">
          <div className="mb-1 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <strong className="text-lg font-bold text-foreground">You're on Pro plan</strong>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">Monthly</span>
            </div>
            <p className="text-4xl font-black text-foreground">
              $49 <span className="text-sm font-normal text-muted-foreground">per month</span>
            </p>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Renews Sep 1, 2026</p>
          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" className="rounded-xl border border-border font-semibold px-5 text-foreground hover:bg-muted">
              Manage Plan
            </Button>
            <a href="#" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              Manage Payment Method
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>
        </section>

        <section className="lf-panel p-6">
          <div className="flex items-start justify-between">
            <h2 className="font-bold text-foreground">Credits</h2>
            <button onClick={() => navigate('/billing/usage')} className="text-sm font-semibold text-accent hover:underline">
              View usage details
            </button>
          </div>
          <p className="text-sm text-muted-foreground">Resets on Sep 1, 2026</p>
          <p className="mt-5 text-3xl font-black text-foreground">
            {Math.round(centsToCredits(WALLET_REMAINING_CENTS))}{' '}
            <span className="text-base font-medium text-muted-foreground">of {Math.round(centsToCredits(WALLET_TOTAL_CENTS))} credits left</span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-accent" style={{ width: `${remainingPercent}%` }} />
          </div>
          <Button variant="link" className="mt-5 px-0 text-violet-500">
            <Gift className="h-4 w-4" />
            Get bonus credits
          </Button>
        </section>
      </div>

      <section className="lf-panel p-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="lf-section-title">Update plan</h2>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="h-5 w-9 rounded-full bg-slate-300 p-0.5">
              <span className="block h-4 w-4 rounded-full bg-white" />
            </span>
            Annual
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600">(save 20%)</span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                'flex min-h-[470px] flex-col rounded-lg border bg-white p-6',
                plan.popular && 'border-accent bg-blue-50/60 shadow-lg',
              )}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-foreground">{plan.name}</h3>
                {plan.popular && (
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-on-accent">Popular</span>
                )}
                {plan.current && (
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-bold text-foreground">Current plan</span>
                )}
              </div>
              <p className="mt-6 text-2xl font-black text-foreground">
                {plan.price} <span className="text-sm font-medium text-muted-foreground">per month</span>
              </p>
              <p className="mt-6 font-bold text-foreground">{plan.credits}</p>
              <p className="mt-4 min-h-14 text-sm leading-6 text-muted-foreground">{plan.description}</p>
              <Button
                className={cn('mt-4', plan.popular && 'bg-accent text-on-accent hover:bg-accent-hover')}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.current ? 'Current plan' : 'Upgrade'}
              </Button>
              <ul className="mt-6 space-y-3 border-b pb-6 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-slate-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-5 text-sm font-medium italic text-accent">{plan.note}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 rounded-md bg-orange-50 px-4 py-3 text-sm text-orange-600">
          Usage is metered per feature — see how pricing works below.
        </p>
      </section>

      <section className="lf-panel p-6">
        <h2 className="lf-section-title">How usage-based pricing works</h2>
        <p className="mt-2 max-w-5xl text-sm leading-6 text-muted-foreground">
          Each feature is metered by what it actually costs to run — per message for Resume Builder, per successful
          application for Auto-Apply, per minute for live Interview Prep and Copilot sessions. Lightforth only charges
          for successful actions, so a failed Auto-Apply submission never costs anything. 1 credit = $0.40, and your
          plan's monthly credits reset each billing cycle — anything unused doesn't roll over.
        </p>
        <div className="mt-6 lf-table-wrap">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">Feature</th>
                <th className="lf-table-th">What triggers it</th>
                <th className="lf-table-th text-right">Rate</th>
              </tr>
            </thead>
            <tbody>
              {creditRows.map(([feature, trigger, deducted, free]) => (
                <tr key={feature} className="lf-table-row">
                  <td className="lf-table-cell font-semibold text-foreground">{feature}</td>
                  <td className="lf-table-cell text-muted-foreground">{trigger}</td>
                  <td className={cn('lf-table-cell text-right font-semibold', free && 'text-emerald-600')}>
                    {deducted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
