import { useState } from 'react'
import { format } from 'date-fns'
import { TrendingUp, TrendingDown } from 'lucide-react'

type Period = '12m' | '30d' | '7d' | '24h'

function ChangeBadge({ value }: { value: string }) {
  const isDown = value.startsWith('-')
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
      isDown ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
    }`}>
      {isDown ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
      {value}
    </span>
  )
}

function StatCard({ label, value, change, hero }: { label: string; value: string; change: string; hero?: boolean }) {
  return (
    <div className={`lf-panel p-5 ${hero ? 'ring-1 ring-primary/20' : ''}`}>
      <p className="lf-body text-xs">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold tracking-tight ${hero ? 'text-primary' : 'text-foreground'}`}>{value}</p>
      <div className="mt-2 flex items-center gap-2">
        <ChangeBadge value={change} />
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </div>
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
  { label: 'Resume Builder',        pct: 38, color: '#3b82f6' },
  { label: 'Auto Apply',            pct: 28, color: '#8b5cf6' },
  { label: 'Personalized Job Recs', pct: 18, color: '#2dd4bf' },
  { label: 'Interview Prep',        pct: 10, color: '#38bdf8' },
  { label: 'Co Pilot',              pct: 6,  color: '#94a3b8' },
]

export default function AdminOverview() {
  const [period, setPeriod] = useState<Period>('30d')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="lf-page-title">Overview</h1>
          <p className="lf-body mt-0.5">{format(new Date(), 'EEEE, MMMM d, yyyy')} · Q2 2026</p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">Live</span>
      </div>

      {/* Time filter */}
      <div className="flex items-center gap-1.5">
        {(['12m', '30d', '7d', '24h'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              period === p ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Revenue */}
      <section>
        <h2 className="lf-section-title mb-3">Revenue</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Earned" value="$525,658.7" change="+3890%" hero />
          <StatCard label="Total Payout" value="$0"         change="+0%"        />
          <StatCard label="Total Sales"  value="168"        change="-2%"        />
          <StatCard label="Cancelled"    value="31"         change="+288%"      />
        </div>
      </section>

      {/* Users */}
      <section>
        <h2 className="lf-section-title mb-3">Users</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Subscribed" value="2"     change="+100%"  />
          <StatCard label="Returning"  value="2"     change="+100%"  />
          <StatCard label="Active"     value="9,395" change="+2532%" />
          <StatCard label="Leads"      value="2"     change="+100%"  />
        </div>
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Product donut */}
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Product</p>
          <div className="flex items-center gap-8">
            <div
              className="h-36 w-36 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(#3b82f6 0% 38%, #8b5cf6 38% 66%, #2dd4bf 66% 84%, #38bdf8 84% 94%, #94a3b8 94% 100%)`,
                mask: 'radial-gradient(circle at center, transparent 40%, black 41%)',
                WebkitMask: 'radial-gradient(circle at center, transparent 40%, black 41%)',
              }}
            />
            <div className="space-y-2.5 flex-1">
              {PRODUCT_BREAKDOWN.map(item => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: item.color }} />
                  <span className="lf-body text-xs flex-1">{item.label}</span>
                  <span className="text-xs font-semibold text-foreground">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sign ups bar chart */}
        <div className="lf-panel p-6">
          <p className="lf-card-title">Sign Ups</p>
          <p className="lf-body text-xs mb-4">+4,993 total</p>
          <div className="flex items-end gap-3 h-36">
            {MONTHLY_SIGNUPS.map(({ month, value }) => (
              <div key={month} className="flex flex-1 flex-col items-center gap-1.5">
                {value > 100 && (
                  <span className="text-[10px] font-semibold text-foreground tabular-nums">
                    {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                  </span>
                )}
                <div
                  className="w-full rounded-t bg-primary"
                  style={{ height: `${(value / maxSignup) * 100}%`, minHeight: value > 0 ? 4 : 0 }}
                />
                <span className="text-[10px] text-muted-foreground">{month}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
            {[['bg-primary', 'User Accounts'], ['bg-primary/40', 'Business Accounts'], ['bg-muted-foreground/30', 'Subscriptions']].map(([cls, label]) => (
              <span key={label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className={`h-2 w-2 rounded-full inline-block ${cls}`} />{label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
