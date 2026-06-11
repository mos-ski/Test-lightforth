import { format } from 'date-fns'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

type Trend = 'up' | 'down' | 'flat'

function StatCard({
  label,
  value,
  target,
  progress,
  trend,
  trendLabel,
}: {
  label: string
  value: string
  target?: string
  progress?: number
  trend?: Trend
  trendLabel?: string
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'

  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
        {progress !== undefined && (
          <Progress value={progress} className="mt-3 h-1.5" />
        )}
        <div className="mt-2 flex items-center justify-between">
          {target && <span className="text-xs text-muted-foreground">Target: {target}</span>}
          {trendLabel && (
            <span className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
              <TrendIcon className="h-3 w-3" />
              {trendLabel}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SectionGrid({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{children}</div>
    </section>
  )
}

export default function AdminOverview() {
  return (
    <div className="p-6 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} · Q2 2026
          </p>
        </div>
        <Badge variant="outline" className="text-xs">Live</Badge>
      </div>

      {/* Hero KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-primary/70">Paid Users</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-primary">281</p>
            <Progress value={56} className="mt-3 h-1.5" />
            <p className="mt-1.5 text-xs text-muted-foreground">56% of 500 target</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-primary/70">MRR (NGN)</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-primary">₦440,750</p>
            <p className="mt-3 text-xs text-muted-foreground">+$859 USD equivalent</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-primary/70">Free → Paid Conv.</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-primary">2.0%</p>
            <Progress value={36} className="mt-3 h-1.5" />
            <p className="mt-1.5 text-xs text-muted-foreground">Target: 5.5%</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-primary/70">Payment Success</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-primary">78%</p>
            <Progress value={85} className="mt-3 h-1.5" />
            <p className="mt-1.5 text-xs text-muted-foreground">Target: 92%</p>
          </CardContent>
        </Card>
      </div>

      <SectionGrid title="Activation">
        <StatCard label="Daily Signups" value="25/day" trend="up" trendLabel="+12% wk" />
        <StatCard label="Resumes Created" value="17/day" target="100/day" progress={17} trend="down" trendLabel="-3 wk" />
        <StatCard label="Onboarding Completion" value="42%" target="70%" progress={60} />
        <StatCard label="Time to First Value" value="12 min" target="5 min" trend="down" trendLabel="Slow" />
      </SectionGrid>

      <SectionGrid title="Monetization">
        <StatCard label="Paywall Conversion" value="2.0%" target="6.0%" progress={33} />
        <StatCard label="Checkout Drop-off" value="49%" target="20%" trend="down" trendLabel="High" />
        <StatCard label="Pay-as-you-go / mo" value="0" target="150+" progress={0} />
        <StatCard label="Refund Rate" value="12%" target="5%" trend="down" trendLabel="High" />
      </SectionGrid>

      <SectionGrid title="Retention">
        <StatCard label="NG Returning Users" value="14%" target="25%" progress={56} />
        <StatCard label="Intl Renewal Rate" value="28%" target="45%" progress={62} />
        <StatCard label="Rev. per Paying User" value="~$5" target="$20" progress={25} />
        <StatCard label="Recurring Rev. Share" value="28%" target="40%" progress={70} />
      </SectionGrid>

      <SectionGrid title="Growth">
        <StatCard label="CAC" value="$31" target="$18" trend="down" trendLabel="Over" />
        <StatCard label="Campaign Conversion" value="1.8%" target="4.5%" progress={40} />
        <StatCard label="Landing Page Conv." value="9%" target="18%" progress={50} />
        <StatCard label="Paid Ad Conversion" value="2.1%" trend="flat" trendLabel="Flat" />
      </SectionGrid>

      <SectionGrid title="Infrastructure">
        <StatCard label="Platform Uptime" value="99.2%" target="99.9%" progress={99} trend="up" trendLabel="Good" />
        <StatCard label="Payment Failure Rate" value="22%" target="8%" trend="down" trendLabel="High" />
        <StatCard label="AI Response Latency" value="4s" target="1.5s" trend="down" trendLabel="Slow" />
        <StatCard label="Incident Resolution" value="9 hrs" target="1 hr" trend="down" trendLabel="Slow" />
      </SectionGrid>
    </div>
  )
}
