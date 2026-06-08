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

export default function AdminUsers() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Users</h1>
        <p className="text-sm text-slate-500">Q2 2026 · April – June</p>
      </div>

      <Section title="Current State">
        <Stat label="Paid Users" value="281" sub="Target: 500" />
        <Stat label="Daily Signups" value="25/day" />
        <Stat label="Free → Paid Conv." value="2.0%" sub="Target: 5.5%" />
        <Stat label="Revenue Split (NG/INT)" value="21% / 79%" />
      </Section>

      <Section title="Activation">
        <Stat label="Resumes Created" value="17/day" sub="Target: 100/day" />
        <Stat label="Onboarding Completion" value="42%" sub="Target: 70%" />
        <Stat label="Onboarding Drop-off" value="58%" sub="Target: 30%" />
        <Stat label="Time to First Value" value="12 min" sub="Target: 5 min" />
      </Section>

      <Section title="Retention">
        <Stat label="NG Returning Users" value="14%" sub="Target: 25%" />
        <Stat label="Intl Renewal Rate" value="28%" sub="Target: 45%" />
        <Stat label="Refund Rate" value="12%" sub="Target: 5%" />
        <Stat label="Rev. per Paying User" value="~$5" sub="Target: $20" />
      </Section>

      <Section title="Experimentation" cols={3}>
        <Stat label="Experiments / Month" value="4" sub="Target: 2–4" />
        <Stat label="Implementation Speed" value="21 days" sub="Target: 7 days" />
        <Stat label="Validated Exp. Rate" value="35%" />
      </Section>
    </div>
  )
}
