function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  )
}

const MONTHLY_GROWTH = [
  { month: 'Jan', users: 1200, pct: 42 },
  { month: 'Feb', users: 1580, pct: 55 },
  { month: 'Mar', users: 2100, pct: 73 },
  { month: 'Apr', users: 2440, pct: 85 },
  { month: 'May', users: 2720, pct: 95 },
  { month: 'Jun', users: 2880, pct: 100 },
]

const FEATURE_USAGE = [
  { feature: 'Auto-Apply', pct: 84, users: 2419 },
  { feature: 'Interview Prep', pct: 61, users: 1757 },
  { feature: 'Interview Copilot', pct: 47, users: 1354 },
  { feature: 'Resume Builder', pct: 72, users: 2074 },
  { feature: 'Career Specialist', pct: 18, users: 518 },
]

const TOP_CITIES = [
  { city: 'New York', users: 612, pct: 21 },
  { city: 'Lagos', users: 490, pct: 17 },
  { city: 'London', users: 374, pct: 13 },
  { city: 'Toronto', users: 288, pct: 10 },
  { city: 'Houston', users: 230, pct: 8 },
  { city: 'Other', users: 886, pct: 31 },
]

export default function AdminAnalytics() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Platform usage and growth — June 2026</p>
      </div>

      {/* Session stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Avg Session Duration" value="8m 24s" sub="+1m 12s vs last month" />
        <Stat label="Bounce Rate" value="18.4%" sub="-2.1% vs last month" />
        <Stat label="Pages / Session" value="5.7" sub="+0.4 vs last month" />
        <Stat label="Return Rate" value="63%" sub="Users back within 7 days" />
      </div>

      {/* Monthly user growth */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Monthly User Growth</h2>
        <div className="flex items-end gap-3 h-40">
          {MONTHLY_GROWTH.map(({ month, users, pct }) => (
            <div key={month} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-medium text-slate-700">{users.toLocaleString()}</span>
              <div className="w-full rounded-t-md bg-blue-500" style={{ height: `${pct}%` }} />
              <span className="text-xs text-slate-400">{month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature usage */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Feature Adoption</h2>
          <div className="space-y-4">
            {FEATURE_USAGE.map(({ feature, pct, users }) => (
              <div key={feature}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-700">{feature}</span>
                  <span className="text-xs text-slate-400">{users.toLocaleString()} users · {pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geo + device */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Top Cities</h2>
            <div className="space-y-2">
              {TOP_CITIES.map(({ city, users, pct }) => (
                <div key={city} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{city}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-400" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-12 text-right">{users.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Device Split</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: '68%' }} />
                <div className="bg-blue-300 h-full" style={{ width: '29%' }} />
                <div className="bg-blue-100 h-full" style={{ width: '3%' }} />
              </div>
            </div>
            <div className="mt-3 flex gap-4 text-xs text-slate-500">
              <span><span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-1" />Desktop 68%</span>
              <span><span className="inline-block h-2 w-2 rounded-full bg-blue-300 mr-1" />Mobile 29%</span>
              <span><span className="inline-block h-2 w-2 rounded-full bg-blue-100 mr-1" />Tablet 3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
