import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

function StatCard({ label, value, sub, progress }: { label: string; value: string; sub?: string; progress?: number }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
        {progress !== undefined && <Progress value={progress} className="mt-2 h-1.5" />}
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}

function SectionGrid({ title, cols = 4, children }: { title: string; cols?: number; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h2>
      <div className={`grid gap-3 ${cols === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {children}
      </div>
    </section>
  )
}

export default function AdminUsers() {
  return (
    <div className="p-6 space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Q2 2026 · April – June</p>
      </div>

      <SectionGrid title="Current State">
        <StatCard label="Paid Users"            value="281"         sub="Target: 500"       progress={56} />
        <StatCard label="Daily Signups"         value="25/day" />
        <StatCard label="Free → Paid Conv."     value="2.0%"        sub="Target: 5.5%"      progress={36} />
        <StatCard label="Revenue Split (NG/INT)" value="21% / 79%" />
      </SectionGrid>

      <SectionGrid title="Activation">
        <StatCard label="Resumes Created"       value="17/day"      sub="Target: 100/day"   progress={17} />
        <StatCard label="Onboarding Completion" value="42%"         sub="Target: 70%"       progress={60} />
        <StatCard label="Onboarding Drop-off"   value="58%"         sub="Target: 30%" />
        <StatCard label="Time to First Value"   value="12 min"      sub="Target: 5 min" />
      </SectionGrid>

      <SectionGrid title="Retention">
        <StatCard label="NG Returning Users"    value="14%"         sub="Target: 25%"       progress={56} />
        <StatCard label="Intl Renewal Rate"     value="28%"         sub="Target: 45%"       progress={62} />
        <StatCard label="Refund Rate"           value="12%"         sub="Target: 5%" />
        <StatCard label="Rev. per Paying User"  value="~$5"         sub="Target: $20"       progress={25} />
      </SectionGrid>

      <SectionGrid title="Experimentation" cols={3}>
        <StatCard label="Experiments / Month"   value="4"           sub="Target: 2–4" />
        <StatCard label="Implementation Speed"  value="21 days"     sub="Target: 7 days" />
        <StatCard label="Validated Exp. Rate"   value="35%" />
      </SectionGrid>
    </div>
  )
}
