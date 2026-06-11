import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

function SectionGrid({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{children}</div>
    </section>
  )
}

export default function AdminRevenue() {
  return (
    <div className="p-6 space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Revenue</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Q2 2026 · April – June</p>
      </div>

      <SectionGrid title="Monthly Recurring Revenue">
        <StatCard label="MRR (NGN)"          value="₦440,750" />
        <StatCard label="MRR (USD)"           value="$859" />
        <StatCard label="NG Revenue Split"    value="21%" progress={21} />
        <StatCard label="INT Revenue Split"   value="79%" progress={79} />
      </SectionGrid>

      <SectionGrid title="Subscriptions & Renewals">
        <StatCard label="Paid Users"           value="281"  sub="Target: 500"  progress={56} />
        <StatCard label="Recurring Rev. Share" value="28%"  sub="Target: 40%"  progress={70} />
        <StatCard label="INT Renewal Revenue"  value="18%" />
        <StatCard label="NG Renewal Revenue"   value="3%" />
      </SectionGrid>

      <SectionGrid title="Conversion Funnel">
        <StatCard label="Free → Paid"          value="2.0%"  sub="Target: 5.5%"  progress={36} />
        <StatCard label="Paywall Conversion"   value="2.0%"  sub="Target: 6.0%"  progress={33} />
        <StatCard label="Checkout Drop-off"    value="49%"   sub="Target: 20%" />
        <StatCard label="Pay-as-you-go / mo"   value="0"     sub="Target: 150+" progress={0} />
      </SectionGrid>

      <SectionGrid title="Payment Health">
        <StatCard label="Payment Success Rate" value="78%"   sub="Target: 92%"   progress={85} />
        <StatCard label="Payment Failure Rate" value="22%"   sub="Target: 8%" />
        <StatCard label="Refund Rate"          value="12%"   sub="Target: 5%" />
        <StatCard label="Rev. per Paying User" value="~$5"   sub="Target: $20"   progress={25} />
      </SectionGrid>

      <SectionGrid title="Acquisition">
        <StatCard label="CAC"                  value="$31"   sub="Target: $18" />
        <StatCard label="Campaign Conversion"  value="1.8%"  sub="Target: 4.5%"  progress={40} />
        <StatCard label="Landing Page Conv."   value="9%"    sub="Target: 18%"   progress={50} />
        <StatCard label="Paid Ad Conversion"   value="2.1%" />
      </SectionGrid>
    </div>
  )
}
