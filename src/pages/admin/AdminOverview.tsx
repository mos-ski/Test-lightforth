import { useState } from 'react'
import { format } from 'date-fns'
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, UserCheck } from 'lucide-react'
import { useOverview } from '@/hooks/useAdmin'

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

function StatCard({ label, value, change, hero, icon: Icon }: { label: string; value: string; change: string; hero?: boolean; icon: React.ElementType }) {
  return (
    <div className={`lf-panel p-5 ${hero ? 'ring-1 ring-primary/20' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="lf-body text-xs">{label}</p>
        <Icon className={`h-4 w-4 ${hero ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <p className={`mt-1.5 text-2xl font-bold tracking-tight ${hero ? 'text-primary' : 'text-foreground'}`}>{value}</p>
      <div className="mt-2 flex items-center gap-2">
        <ChangeBadge value={change} />
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </div>
  )
}

export default function AdminOverview() {
  const [period, setPeriod] = useState<Period>('30d')
  const { data, isLoading } = useOverview()

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="lf-page-title">Overview</h1>
            <p className="lf-body mt-0.5">Loading...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="lf-panel p-5 animate-pulse">
              <div className="h-3 bg-muted rounded w-20" />
              <div className="h-7 bg-muted rounded w-24 mt-2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { stats, revenue, users, monthlyData, featureUsage } = data

  const maxSignups = Math.max(...monthlyData.map(m => m.signups))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="lf-page-title">Overview</h1>
          <p className="lf-body mt-0.5">{format(new Date(), 'EEEE, MMMM d, yyyy')} · Q3 2026</p>
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
          <StatCard label="Total Earned" value={`$${stats.totalRevenue.toLocaleString()}`} change={`+${stats.revenueGrowthMoM}%`} hero icon={DollarSign} />
          <StatCard label="MRR" value={`$${stats.mrr.toLocaleString()}`} change={`+${stats.revenueGrowthMoM}%`} icon={DollarSign} />
          <StatCard label="ARR" value={`$${stats.arr.toLocaleString()}`} change={`+${stats.revenueGrowthMoM}%`} icon={DollarSign} />
          <StatCard label="Avg Revenue/User" value={`$${stats.avgRevenuePerUser.toFixed(2)}`} change="+5.2%" icon={DollarSign} />
        </div>
      </section>

      {/* Users */}
      <section>
        <h2 className="lf-section-title mb-3">Users</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} change={`+${stats.userGrowthMoM}%`} icon={Users} />
          <StatCard label="Paid Users" value={stats.paidUsers.toLocaleString()} change="+12.3%" icon={UserCheck} />
          <StatCard label="Trial Users" value={users.trial.toLocaleString()} change="+8.1%" icon={Activity} />
          <StatCard label="Conversion Rate" value={`${stats.conversionRate}%`} change="+1.2%" hero icon={UserCheck} />
        </div>
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Revenue bar chart */}
        <div className="lf-panel p-6">
          <p className="lf-card-title">Revenue by Month</p>
          <p className="lf-body text-xs mb-4">Jan – Jul 2026</p>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map(({ month, revenue }) => {
              const maxRevenue = Math.max(...monthlyData.map(m => m.revenue))
              const pct = (revenue / maxRevenue) * 100
              return (
                <div key={month} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-foreground tabular-nums">
                    ${(revenue / 1000).toFixed(1)}k
                  </span>
                  <div
                    className="w-full rounded-t bg-primary"
                    style={{ height: `${pct}%`, minHeight: 4 }}
                  />
                  <span className="text-[10px] text-muted-foreground">{month.split(' ')[0]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Signups bar chart */}
        <div className="lf-panel p-6">
          <p className="lf-card-title">Sign Ups</p>
          <p className="lf-body text-xs mb-4">{stats.totalUsers.toLocaleString()} total users</p>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map(({ month, signups }) => (
              <div key={month} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] font-semibold text-foreground tabular-nums">
                  {signups >= 1000 ? `${(signups / 1000).toFixed(1)}k` : signups}
                </span>
                <div
                  className="w-full rounded-t bg-primary"
                  style={{ height: `${(signups / maxSignups) * 100}%`, minHeight: 4 }}
                />
                <span className="text-[10px] text-muted-foreground">{month.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature adoption + Top Cities */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Feature Adoption</p>
          <div className="space-y-3">
            {featureUsage.map(({ feature, users: userCount, percentage }) => (
              <div key={feature}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{feature}</span>
                  <span className="text-xs text-muted-foreground">{userCount.toLocaleString()} · {percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Top Cities</p>
          <div className="space-y-3">
            {data.monthlyData.length > 0 && [
              { city: 'New York', users: 1523, pct: 16.2 },
              { city: 'Lagos', users: 1247, pct: 13.3 },
              { city: 'London', users: 987, pct: 10.5 },
              { city: 'Toronto', users: 756, pct: 8.0 },
              { city: 'Houston', users: 634, pct: 6.7 },
            ].map(({ city, users: userCount, pct }) => (
              <div key={city} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-20 shrink-0">{city}</span>
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct * 5}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">{userCount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
