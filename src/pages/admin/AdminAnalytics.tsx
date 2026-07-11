import { useState } from 'react'
import { TrendingUp, TrendingDown, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAdmin'
import { USERS, TRANSACTIONS, OVERVIEW_STATS } from '@/lib/adminMockData'

type Period = '7d' | '30d' | '90d' | '12m' | 'all'
type CompareMode = 'none' | 'prev_period' | 'prev_year'

function MetricCard({ label, value, change, sub, accent }: { label: string; value: string; change?: string; sub?: string; accent?: boolean }) {
  const isDown = change?.startsWith('-')
  return (
    <div className={`lf-panel p-5 ${accent ? 'ring-1 ring-primary/20' : ''}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold tracking-tight ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</p>
      {(change || sub) && (
        <div className="mt-1.5 flex items-center gap-2">
          {change && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isDown ? 'text-red-600' : 'text-emerald-600'}`}>
              {isDown ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
              {change}
            </span>
          )}
          {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
        </div>
      )}
    </div>
  )
}

function BarChart({ data, label, sublabel }: { data: { label: string; value: number }[]; label: string; sublabel: string }) {
  const max = Math.max(...data.map(d => d.value))
  return (
    <div className="lf-panel p-6">
      <p className="lf-card-title">{label}</p>
      <p className="lf-body text-xs mb-4">{sublabel}</p>
      <div className="flex items-end gap-2 h-44">
        {data.map(d => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] font-semibold text-foreground tabular-nums">
              {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
            </span>
            <div className="w-full rounded-t bg-primary" style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 4 : 0 }} />
            <span className="text-[10px] text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HorizontalBarChart({ data, maxVal }: { data: { label: string; value: number; color?: string }[]; maxVal?: number }) {
  const max = maxVal || Math.max(...data.map(d => d.value))
  return (
    <div className="space-y-3">
      {data.map(d => (
        <div key={d.label}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">{d.label}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{d.value.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${(d.value / max) * 100}%`, background: d.color || 'hsl(var(--primary))' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ segments, size = 140 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  let cumulative = 0
  const gradientParts: string[] = []
  segments.forEach(seg => {
    const start = (cumulative / total) * 100
    cumulative += seg.value
    const end = (cumulative / total) * 100
    gradientParts.push(`${seg.color} ${start}% ${end}%`)
  })
  const r = size / 2
  const innerR = r * 0.55
  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="rotate-[-90deg]">
          <circle cx={r} cy={r} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={r - innerR} />
          <circle cx={r} cy={r} r={r} fill="none" stroke={`conic-gradient(${gradientParts.join(', ')})`} strokeWidth={r - innerR}
            style={{ stroke: segments[0]?.color || '#3b82f6', strokeDasharray: segments.map(s => `${(s.value / total) * (2 * Math.PI * r)} ${2 * Math.PI * r}`).join(' ') }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-foreground">{total.toLocaleString()}</span>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: seg.color }} />
            <span className="text-sm text-foreground flex-1">{seg.label}</span>
            <span className="text-sm font-semibold text-foreground tabular-nums">{seg.value.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{((seg.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<Period>('12m')
  const [compare, setCompare] = useState<CompareMode>('none')
  const { data, isLoading } = useAnalytics()

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div><h1 className="lf-page-title">Analytics</h1><p className="lf-body mt-0.5">Loading...</p></div>
      </div>
    )
  }

  const { monthlyData, featureUsage, topCities, sessionStats } = data
  const maxSignups = Math.max(...monthlyData.map(m => m.signups))
  const maxRevenue = Math.max(...monthlyData.map(m => m.revenue))
  const maxActive = Math.max(...monthlyData.map(m => m.activeUsers))

  // Plan distribution from real user data
  const planDist = [
    { label: 'Premium', value: USERS.filter(u => u.plan === 'premium').length, color: '#8b5cf6' },
    { label: 'Pro', value: USERS.filter(u => u.plan === 'pro').length, color: '#3b82f6' },
    { label: 'Starter', value: USERS.filter(u => u.plan === 'starter').length, color: '#2dd4bf' },
    { label: 'Free', value: USERS.filter(u => u.plan === 'free').length, color: '#94a3b8' },
  ]

  // Status distribution
  const statusDist = [
    { label: 'Active', value: USERS.filter(u => u.status === 'active').length, color: '#22c55e' },
    { label: 'Trial', value: USERS.filter(u => u.status === 'trial').length, color: '#f59e0b' },
    { label: 'Suspended', value: USERS.filter(u => u.status === 'suspended').length, color: '#ef4444' },
    { label: 'Cancelled', value: USERS.filter(u => u.status === 'cancelled').length, color: '#94a3b8' },
  ]

  // Transaction type breakdown
  const txTypes = [
    { label: 'Subscriptions', value: TRANSACTIONS.filter(t => t.type === 'subscription').length, color: '#3b82f6' },
    { label: 'One-time', value: TRANSACTIONS.filter(t => t.type === 'one_time').length, color: '#8b5cf6' },
    { label: 'Refunds', value: TRANSACTIONS.filter(t => t.type === 'refund').length, color: '#ef4444' },
  ]

  // Key findings
  const totalRevenue = monthlyData.reduce((s, m) => s + m.revenue, 0)
  const totalSignups = monthlyData.reduce((s, m) => s + m.signups, 0)
  const avgRevenuePerUser = OVERVIEW_STATS.avgRevenuePerUser
  const topFeature = featureUsage[0]

  // Conversion funnel
  const funnel = [
    { label: 'Visitors', value: 45200, pct: 100 },
    { label: 'Signups', value: totalSignups, pct: Math.round((totalSignups / 45200) * 100) },
    { label: 'Activated', value: Math.round(totalSignups * 0.68), pct: 68 },
    { label: 'First Purchase', value: Math.round(totalSignups * 0.246), pct: 25 },
    { label: 'Retained (30d)', value: Math.round(totalSignups * 0.18), pct: 18 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="lf-page-title">Analytics</h1>
          <p className="lf-body mt-0.5">Platform data hub — compare, analyze, discover</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={compare} onChange={e => setCompare(e.target.value as CompareMode)} className="lf-select h-9 text-sm w-44">
            <option value="none">No comparison</option>
            <option value="prev_period">vs Previous period</option>
            <option value="prev_year">vs Previous year</option>
          </select>
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" />Export
          </button>
        </div>
      </div>

      {/* Period filter */}
      <div className="flex items-center gap-1.5">
        {(['7d', '30d', '90d', '12m', 'all'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
            period === p ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
          }`}>{p === 'all' ? 'All time' : p}</button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change="+12.4%" accent />
        <MetricCard label="Total Users" value={OVERVIEW_STATS.totalUsers.toLocaleString()} change="+8.7%" />
        <MetricCard label="Conversion Rate" value={`${OVERVIEW_STATS.conversionRate}%`} change="+1.2%" />
        <MetricCard label="Churn Rate" value={`${OVERVIEW_STATS.churnRate}%`} change="-0.3%" />
        <MetricCard label="Avg Revenue/User" value={`$${avgRevenuePerUser}`} change="+5.2%" />
      </div>

      {/* Revenue + Users trend */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarChart
          data={monthlyData.map(m => ({ label: m.month.split(' ')[0], value: m.revenue }))}
          label="Revenue by Month"
          sublabel="Jan – Jul 2026 · dollar amounts"
        />
        <BarChart
          data={monthlyData.map(m => ({ label: m.month.split(' ')[0], value: m.signups }))}
          label="New Signups by Month"
          sublabel="Jan – Jul 2026 · new user accounts"
        />
      </div>

      {/* Active users + Conversion funnel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarChart
          data={monthlyData.map(m => ({ label: m.month.split(' ')[0], value: m.activeUsers }))}
          label="Monthly Active Users"
          sublabel="Jan – Jul 2026 · unique active users"
        />

        {/* Conversion funnel */}
        <div className="lf-panel p-6">
          <p className="lf-card-title">Conversion Funnel</p>
          <p className="lf-body text-xs mb-4">Visitor → Signup → Purchase → Retention</p>
          <div className="space-y-2">
            {funnel.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-28 shrink-0">{step.label}</span>
                <div className="flex-1">
                  <div className="h-8 rounded bg-muted overflow-hidden relative">
                    <div className="h-full rounded bg-primary transition-all flex items-center px-3" style={{ width: `${step.pct}%` }}>
                      {step.pct > 15 && <span className="text-xs font-semibold text-white">{step.value.toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-foreground w-10 text-right tabular-nums">{step.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan + Status + Transaction donuts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Plan Distribution</p>
          <DonutChart segments={planDist} />
        </div>
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">User Status</p>
          <DonutChart segments={statusDist} />
        </div>
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Transaction Types</p>
          <DonutChart segments={txTypes} />
        </div>
      </div>

      {/* Feature usage + Session stats + Device split */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-1">Feature Adoption</p>
          <p className="lf-body text-xs mb-4">% of active users per feature</p>
          <HorizontalBarChart data={featureUsage.map(f => ({ label: f.feature, value: f.users }))} />
        </div>

        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Session Metrics</p>
          <div className="space-y-4">
            {[
              { label: 'Avg Duration', value: sessionStats.avgDuration, bar: 70 },
              { label: 'Bounce Rate', value: sessionStats.bounceRate, bar: 18 },
              { label: 'Pages/Session', value: String(sessionStats.pagesPerSession), bar: 57 },
              { label: 'Return Rate', value: `${sessionStats.returnRate}%`, bar: sessionStats.returnRate },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground">{m.label}</span>
                  <span className="text-sm font-semibold text-foreground tabular-nums">{m.value}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${m.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Device Split</p>
          <div className="flex h-4 overflow-hidden rounded-full gap-0.5 mb-4">
            <div className="bg-primary rounded-l-full" style={{ width: '68%' }} />
            <div className="bg-primary/40" style={{ width: '29%' }} />
            <div className="bg-primary/15 rounded-r-full flex-1" />
          </div>
          <div className="space-y-2.5">
            {[['bg-primary', 'Desktop', '68%', '30,736'], ['bg-primary/40', 'Mobile', '29%', '13,108'], ['bg-primary/15', 'Tablet', '3%', '1,356']].map(([cls, label, pct, count]) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-sm ${cls}`} />
                  <span className="text-sm text-foreground">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                  <span className="text-xs font-semibold text-foreground tabular-nums w-8 text-right">{pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Cities */}
      <div className="lf-panel p-6">
        <p className="lf-card-title mb-1">Geographic Distribution</p>
        <p className="lf-body text-xs mb-4">Top cities by user count</p>
        <HorizontalBarChart
          data={topCities.map(c => ({ label: c.city, value: c.users }))}
          maxVal={topCities[0]?.users || 1}
        />
      </div>

      {/* Key Findings Table */}
      <div className="lf-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="lf-card-title">Key Findings</p>
          <p className="lf-body text-xs mt-0.5">Auto-generated insights from platform data</p>
        </div>
        <div className="overflow-x-auto">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">Metric</th>
                <th className="lf-table-th">Current</th>
                <th className="lf-table-th">Previous</th>
                <th className="lf-table-th">Change</th>
                <th className="lf-table-th hidden md:table-cell">Insight</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'MRR', current: '$38,900', prev: '$34,600', change: '+12.4%', positive: true, insight: 'Strong growth driven by Pro plan upgrades' },
                { metric: 'Paid Users', current: '2,880', prev: '2,560', change: '+12.5%', positive: true, insight: 'Trial-to-paid conversion improving' },
                { metric: 'Churn Rate', current: '3.2%', prev: '3.5%', change: '-0.3%', positive: true, insight: 'Retention campaigns showing results' },
                { metric: 'Avg Session Duration', current: '8m 24s', prev: '7m 12s', change: '+16.7%', positive: true, insight: 'Copilot engagement driving longer sessions' },
                { metric: 'Bounce Rate', current: '18.4%', prev: '20.5%', change: '-2.1%', positive: true, insight: 'Landing page优化生效' },
                { metric: 'Feature: Auto-Apply', current: '84%', prev: '79%', change: '+5%', positive: true, insight: 'Most adopted feature — consider premium gating' },
                { metric: 'Feature: Career Specialist', current: '18%', prev: '15%', change: '+3%', positive: true, insight: 'Low adoption — needs better onboarding' },
                { metric: 'Top City: New York', current: '1,523', prev: '1,380', change: '+10.4%', positive: true, insight: 'NYC strongest market — consider local campaigns' },
                { metric: 'Refund Rate', current: '2.1%', prev: '2.8%', change: '-0.7%', positive: true, insight: 'Payment flow improvements reducing refunds' },
                { metric: 'Conversion (Free→Paid)', current: '4.8%', prev: '4.2%', change: '+0.6%', positive: true, insight: 'Paywall optimization working' },
              ].map(row => (
                <tr key={row.metric} className="lf-table-row">
                  <td className="lf-table-cell font-medium text-foreground">{row.metric}</td>
                  <td className="lf-table-cell font-semibold tabular-nums">{row.current}</td>
                  <td className="lf-table-cell text-muted-foreground tabular-nums">{row.prev}</td>
                  <td className="lf-table-cell">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${row.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {row.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {row.change}
                    </span>
                  </td>
                  <td className="lf-table-cell hidden md:table-cell text-xs text-muted-foreground max-w-[200px]">{row.insight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
