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
  { city: 'New York', users: 612, pct: 70 },
  { city: 'Lagos',    users: 490, pct: 57 },
  { city: 'London',   users: 374, pct: 43 },
  { city: 'Toronto',  users: 288, pct: 33 },
  { city: 'Houston',  users: 230, pct: 27 },
  { city: 'Other',    users: 886, pct: 100 },
]

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="lf-page-title">Analytics</h1>
        <p className="lf-body mt-0.5">Platform usage and growth — June 2026</p>
      </div>

      {/* Session stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Avg Session Duration', value: '8m 24s',  sub: '+1m 12s vs last month'    },
          { label: 'Bounce Rate',           value: '18.4%',   sub: '-2.1% vs last month'       },
          { label: 'Pages / Session',       value: '5.7',     sub: '+0.4 vs last month'         },
          { label: 'Return Rate',           value: '63%',     sub: 'Users back within 7 days'  },
        ].map(({ label, value, sub }) => (
          <div key={label} className="lf-panel p-5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly growth bar chart */}
      <div className="lf-panel p-6">
        <p className="lf-card-title">Monthly User Growth</p>
        <p className="lf-body text-xs mb-5">Jan – Jun 2026</p>
        <div className="flex items-end gap-3 h-44">
          {MONTHLY_GROWTH.map(({ month, users, pct }) => (
            <div key={month} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-xs font-semibold tabular-nums text-foreground">
                {(users / 1000).toFixed(1)}k
              </span>
              <div className="w-full rounded-t bg-primary transition-all" style={{ height: `${pct}%` }} />
              <span className="text-xs text-muted-foreground">{month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Feature adoption */}
        <div className="lf-panel p-6">
          <p className="lf-card-title">Feature Adoption</p>
          <p className="lf-body text-xs mb-5">% of active users per feature</p>
          <div className="space-y-4">
            {FEATURE_USAGE.map(({ feature, pct, users }) => (
              <div key={feature}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{feature}</span>
                  <span className="text-xs text-muted-foreground">{users.toLocaleString()} · {pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Top cities */}
          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Top Cities</p>
            <div className="space-y-3">
              {TOP_CITIES.map(({ city, users, pct }) => (
                <div key={city} className="flex items-center gap-3">
                  <span className="text-sm text-foreground w-20 shrink-0">{city}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">{users.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device split */}
          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Device Split</p>
            <div className="flex h-3 overflow-hidden rounded-full gap-0.5">
              <div className="bg-primary rounded-l-full" style={{ width: '68%' }} />
              <div className="bg-primary/40" style={{ width: '29%' }} />
              <div className="bg-primary/15 rounded-r-full flex-1" />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
              {[['bg-primary', 'Desktop 68%'], ['bg-primary/40', 'Mobile 29%'], ['bg-primary/15', 'Tablet 3%']].map(([cls, label]) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`h-2 w-2 rounded-full inline-block ${cls}`} />{label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
