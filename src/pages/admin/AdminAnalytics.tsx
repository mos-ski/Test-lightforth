import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

const MONTHLY_GROWTH = [
  { month: 'Jan', users: 1200, pct: 42 },
  { month: 'Feb', users: 1580, pct: 55 },
  { month: 'Mar', users: 2100, pct: 73 },
  { month: 'Apr', users: 2440, pct: 85 },
  { month: 'May', users: 2720, pct: 95 },
  { month: 'Jun', users: 2880, pct: 100 },
]

const FEATURE_USAGE = [
  { feature: 'Auto-Apply',        pct: 84, users: 2419 },
  { feature: 'Resume Builder',    pct: 72, users: 2074 },
  { feature: 'Interview Prep',    pct: 61, users: 1757 },
  { feature: 'Interview Copilot', pct: 47, users: 1354 },
  { feature: 'Career Specialist', pct: 18, users: 518  },
]

const TOP_CITIES = [
  { city: 'New York', users: 612, pct: 21 },
  { city: 'Lagos',    users: 490, pct: 17 },
  { city: 'London',   users: 374, pct: 13 },
  { city: 'Toronto',  users: 288, pct: 10 },
  { city: 'Houston',  users: 230, pct: 8  },
  { city: 'Other',    users: 886, pct: 31 },
]

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}

export default function AdminAnalytics() {
  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Platform usage and growth — June 2026</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Avg Session Duration" value="8m 24s" sub="+1m 12s vs last month" />
        <StatCard label="Bounce Rate"           value="18.4%"  sub="-2.1% vs last month" />
        <StatCard label="Pages / Session"       value="5.7"    sub="+0.4 vs last month" />
        <StatCard label="Return Rate"           value="63%"    sub="Users back within 7 days" />
      </div>

      {/* Monthly growth bar chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Monthly User Growth</CardTitle>
          <CardDescription>Jan – Jun 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-44">
            {MONTHLY_GROWTH.map(({ month, users, pct }) => (
              <div key={month} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs font-semibold tabular-nums">{(users / 1000).toFixed(1)}k</span>
                <div
                  className="w-full rounded-t-md bg-primary transition-all"
                  style={{ height: `${pct}%` }}
                />
                <span className="text-xs text-muted-foreground">{month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Feature adoption */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Feature Adoption</CardTitle>
            <CardDescription>% of active users per feature</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {FEATURE_USAGE.map(({ feature, pct, users }) => (
              <div key={feature}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium">{feature}</span>
                  <span className="text-xs text-muted-foreground">{users.toLocaleString()} · {pct}%</span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Top cities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Top Cities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {TOP_CITIES.map(({ city, users, pct }) => (
                <div key={city} className="flex items-center gap-3">
                  <span className="text-sm w-20 shrink-0">{city}</span>
                  <Progress value={pct} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">{users.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Device split */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Device Split</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                <div className="bg-primary rounded-l-full" style={{ width: '68%' }} />
                <div className="bg-primary/40" style={{ width: '29%' }} />
                <div className="bg-primary/15 rounded-r-full flex-1" />
              </div>
              <div className="mt-3 flex gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary inline-block" />Desktop 68%</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary/40 inline-block" />Mobile 29%</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary/15 inline-block" />Tablet 3%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
