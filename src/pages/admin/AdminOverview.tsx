import { useState } from 'react'
import { format } from 'date-fns'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

type Period = '12m' | '30d' | '7d' | '24h'

function ChangeBadge({ value }: { value: string }) {
  const isDown = value.startsWith('-')
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
      isDown ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
    }`}>
      {isDown ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
      {value}
    </span>
  )
}

function StatCard({ label, value, change, hero }: { label: string; value: string; change: string; hero?: boolean }) {
  return (
    <Card className={hero ? 'border-primary/20 bg-primary/5' : ''}>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className={`mt-1.5 text-2xl font-bold tracking-tight ${hero ? 'text-primary' : ''}`}>{value}</p>
        <div className="mt-2 flex items-center gap-1.5">
          <ChangeBadge value={change} />
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}

const MONTHLY_SIGNUPS = [
  { month: 'Jan', value: 110 },
  { month: 'Feb', value: 2440 },
  { month: 'Mar', value: 890 },
  { month: 'Apr', value: 780 },
  { month: 'May', value: 95 },
  { month: 'Jun', value: 40 },
]
const maxSignup = Math.max(...MONTHLY_SIGNUPS.map(m => m.value))

const PRODUCT_BREAKDOWN = [
  { label: 'Resume Builder',              pct: 38, color: 'bg-blue-500'   },
  { label: 'Auto Apply',                  pct: 28, color: 'bg-violet-500' },
  { label: 'Personalized Job Recs',       pct: 18, color: 'bg-teal-400'   },
  { label: 'Interview Prep',              pct: 10, color: 'bg-sky-400'    },
  { label: 'Co Pilot',                    pct: 6,  color: 'bg-slate-400'  },
]

export default function AdminOverview() {
  const [period, setPeriod] = useState<Period>('30d')

  return (
    <div className="p-6 space-y-6 max-w-6xl">
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

      {/* Time filter */}
      <div className="flex items-center gap-1">
        {(['12m', '30d', '7d', '24h'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              period === p
                ? 'bg-foreground text-background'
                : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Revenue */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Revenue</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Earned" value="$525,658.7" change="+3890%" hero />
          <StatCard label="Total Payout" value="$0"         change="+0%"    />
          <StatCard label="Total Sales"  value="168"        change="-2%"    />
          <StatCard label="Cancelled"    value="31"         change="+288%"  />
        </div>
      </section>

      {/* Users */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Users</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Subscribed" value="2"     change="+100%"  />
          <StatCard label="Returning"  value="2"     change="+100%"  />
          <StatCard label="Active"     value="9,395" change="+2532%" />
          <StatCard label="Leads"      value="2"     change="+100%"  />
        </div>
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product donut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {/* Simple donut via conic-gradient */}
              <div
                className="h-32 w-32 shrink-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    #3b82f6 0% 38%,
                    #8b5cf6 38% 66%,
                    #2dd4bf 66% 84%,
                    #38bdf8 84% 94%,
                    #94a3b8 94% 100%
                  )`,
                  mask: 'radial-gradient(circle at center, transparent 40%, black 41%)',
                  WebkitMask: 'radial-gradient(circle at center, transparent 40%, black 41%)',
                }}
              />
              <div className="space-y-2">
                {PRODUCT_BREAKDOWN.map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-sm shrink-0 ${item.color}`} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-medium ml-auto pl-3">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign ups bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sign Ups</CardTitle>
            <CardDescription>+4,993 total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-36">
              {MONTHLY_SIGNUPS.map(({ month, value }) => (
                <div key={month} className="flex flex-1 flex-col items-center gap-1.5">
                  {value > 100 && (
                    <span className="text-[10px] font-medium tabular-nums">{value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}</span>
                  )}
                  <div
                    className="w-full rounded-t-sm bg-primary/80"
                    style={{ height: `${(value / maxSignup) * 100}%`, minHeight: value > 0 ? 4 : 0 }}
                  />
                  <span className="text-[10px] text-muted-foreground">{month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary/80 inline-block" />User Accounts</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary/40 inline-block" />Business Accounts</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground/40 inline-block" />Subscriptions</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
