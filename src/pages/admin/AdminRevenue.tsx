import { cn } from '@/lib/utils'

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
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
          cols === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4',
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default function AdminRevenue() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Revenue</h1>
        <p className="text-sm text-slate-500">Q2 2026 · April – June</p>
      </div>

      <Section title="Monthly Recurring Revenue">
        <Stat label="MRR (NGN)" value="₦440,750" />
        <Stat label="MRR (USD)" value="$859" />
        <Stat label="NG Revenue Split" value="21%" />
        <Stat label="INT Revenue Split" value="79%" />
      </Section>

      <Section title="Subscriptions & Renewals">
        <Stat label="Paid Users" value="281" sub="Target: 500" />
        <Stat label="Recurring Rev. Share" value="28%" sub="Target: 40%" />
        <Stat label="INT Renewal Revenue" value="18%" />
        <Stat label="NG Renewal Revenue" value="3%" />
      </Section>

      <Section title="Conversion Funnel">
        <Stat label="Free → Paid" value="2.0%" sub="Target: 5.5%" />
        <Stat label="Paywall Conversion" value="2.0%" sub="Target: 6.0%" />
        <Stat label="Checkout Drop-off" value="49%" sub="Target: 20%" />
        <Stat label="Pay-as-you-go / mo" value="0" sub="Target: 150+" />
      </Section>

      <Section title="Payment Health">
        <Stat label="Payment Success Rate" value="78%" sub="Target: 92%" />
        <Stat label="Payment Failure Rate" value="22%" sub="Target: 8%" />
        <Stat label="Refund Rate" value="12%" sub="Target: 5%" />
        <Stat label="Rev. per Paying User" value="~$5" sub="Target: $20" />
      </Section>

      <Section title="Acquisition">
        <Stat label="CAC" value="$31" sub="Target: $18" />
        <Stat label="Campaign Conversion" value="1.8%" sub="Target: 4.5%" />
        <Stat label="Landing Page Conv." value="9%" sub="Target: 18%" />
        <Stat label="Paid Ad Conversion" value="2.1%" />
      </Section>
    </div>
  )
}
