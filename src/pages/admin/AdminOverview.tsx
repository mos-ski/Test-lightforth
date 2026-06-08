import { format } from 'date-fns'
import { cn } from '@/lib/utils'

function Stat({
  label,
  value,
  sub,
  hero,
}: {
  label: string
  value: string
  sub?: string
  hero?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-white p-5',
        hero ? 'border-blue-200' : 'border-slate-200',
      )}
    >
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={cn(
          'mt-2 text-2xl font-bold',
          hero ? 'text-blue-700' : 'text-slate-900',
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  )
}

function Section({
  title,
  cols = 4,
  children,
}: {
  title: string
  cols?: number
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </h2>
      <div
        className={cn(
          'grid gap-3',
          cols === 3
            ? 'grid-cols-2 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-4',
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default function AdminOverview() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')} &nbsp;·&nbsp; Q2 2026
        </p>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat hero label="Paid Users" value="281" sub="Target: 500" />
        <Stat hero label="MRR (NGN)" value="₦440,750" sub="+ $859 USD" />
        <Stat hero label="Free → Paid Conv." value="2.0%" sub="Target: 5.5%" />
        <Stat hero label="Payment Success" value="78%" sub="Target: 92%" />
      </div>

      <Section title="Activation">
        <Stat label="Daily Signups" value="25/day" />
        <Stat label="Resumes Created" value="17/day" sub="Target: 100/day" />
        <Stat label="Onboarding Completion" value="42%" sub="Target: 70%" />
        <Stat label="Time to First Value" value="12 min" sub="Target: 5 min" />
      </Section>

      <Section title="Monetization">
        <Stat label="Paywall Conversion" value="2.0%" sub="Target: 6.0%" />
        <Stat label="Checkout Drop-off" value="49%" sub="Target: 20%" />
        <Stat label="Pay-as-you-go / mo" value="0" sub="Target: 150+" />
        <Stat label="Refund Rate" value="12%" sub="Target: 5%" />
      </Section>

      <Section title="Retention">
        <Stat label="NG Returning Users" value="14%" sub="Target: 25%" />
        <Stat label="Intl Renewal Rate" value="28%" sub="Target: 45%" />
        <Stat label="Rev. per Paying User" value="~$5" sub="Target: $20" />
        <Stat label="Recurring Rev. Share" value="28%" sub="Target: 40%" />
      </Section>

      <Section title="Growth">
        <Stat label="CAC" value="$31" sub="Target: $18" />
        <Stat label="Campaign Conversion" value="1.8%" sub="Target: 4.5%" />
        <Stat label="Landing Page Conv." value="9%" sub="Target: 18%" />
        <Stat label="Paid Ad Conversion" value="2.1%" />
      </Section>

      <Section title="Infrastructure">
        <Stat label="Platform Uptime" value="99.2%" sub="Target: 99.9%" />
        <Stat label="Payment Failure Rate" value="22%" sub="Target: 8%" />
        <Stat label="AI Response Latency" value="4s" sub="Target: 1.5s" />
        <Stat label="Incident Resolution" value="9 hrs" sub="Target: 1 hr" />
      </Section>
    </div>
  )
}
