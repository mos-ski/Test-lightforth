import { useState } from 'react'
import { TrendingUp, ArrowUpRight, Users, DollarSign, MousePointerClick, Gift, Search, Download, ExternalLink, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

const PARTNERS = [
  { id: 'p1', name: 'TechHire Academy', email: 'partners@techhire.io', type: 'Affiliate', status: 'active', referrals: 1247, revenue: 49880, commission: 7482, conversionRate: 34.2, joinDate: '2025-11-15', lastActive: '2 hr ago', tier: 'Gold' },
  { id: 'p2', name: 'CareerBoost Pro', email: 'team@careerboost.com', type: 'Affiliate', status: 'active', referrals: 892, revenue: 35680, commission: 5352, conversionRate: 31.8, joinDate: '2025-12-01', lastActive: '5 hr ago', tier: 'Silver' },
  { id: 'p3', name: 'ResumeLab', email: 'biz@resumelab.co', type: 'Affiliate', status: 'active', referrals: 2134, revenue: 85360, commission: 12804, conversionRate: 38.7, joinDate: '2025-10-20', lastActive: '1 hr ago', tier: 'Platinum' },
  { id: 'p4', name: 'JobReady Bootcamp', email: 'partnerships@jobready.dev', type: 'Referral', status: 'active', referrals: 567, revenue: 22680, commission: 3402, conversionRate: 28.4, joinDate: '2026-01-10', lastActive: '1 day ago', tier: 'Bronze' },
  { id: 'p5', name: 'HireVue Prep', email: 'team@hirevueprep.com', type: 'Affiliate', status: 'active', referrals: 1089, revenue: 43560, commission: 6534, conversionRate: 36.1, joinDate: '2025-09-05', lastActive: '3 hr ago', tier: 'Gold' },
  { id: 'p6', name: 'SkillBridge', email: 'hello@skillbridge.io', type: 'Referral', status: 'paused', referrals: 234, revenue: 9360, commission: 1404, conversionRate: 22.3, joinDate: '2026-03-18', lastActive: '5 days ago', tier: 'Bronze' },
  { id: 'p7', name: 'PathForward Careers', email: 'admin@pathforward.co', type: 'Affiliate', status: 'active', referrals: 1567, revenue: 62680, commission: 9402, conversionRate: 33.5, joinDate: '2025-08-12', lastActive: '4 hr ago', tier: 'Gold' },
  { id: 'p8', name: 'TalentForge', email: 'partners@talentforge.com', type: 'Affiliate', status: 'active', referrals: 756, revenue: 30240, commission: 4536, conversionRate: 29.9, joinDate: '2026-02-28', lastActive: '6 hr ago', tier: 'Silver' },
  { id: 'p9', name: 'CareerSpark', email: 'biz@careerspark.app', type: 'Referral', status: 'inactive', referrals: 89, revenue: 3560, commission: 534, conversionRate: 18.7, joinDate: '2026-05-01', lastActive: '2 weeks ago', tier: 'Bronze' },
  { id: 'p10', name: 'NextStep Learning', email: 'team@nextstep.edu', type: 'Affiliate', status: 'active', referrals: 1823, revenue: 72920, commission: 10938, conversionRate: 35.8, joinDate: '2025-07-22', lastActive: '30 min ago', tier: 'Platinum' },
]

const RECENT_REFERRALS = [
  { id: 'r1', partner: 'ResumeLab', user: 'Marcus Chen', plan: 'Pro', amount: 40, commission: 6, time: '12 min ago' },
  { id: 'r2', partner: 'TechHire Academy', user: 'Jessica Williams', plan: 'Premium', amount: 80, commission: 12, time: '28 min ago' },
  { id: 'r3', partner: 'NextStep Learning', user: 'Omar Khan', plan: 'Pro', amount: 40, commission: 6, time: '45 min ago' },
  { id: 'r4', partner: 'HireVue Prep', user: 'Sarah Johnson', plan: 'Premium', amount: 80, commission: 12, time: '1 hr ago' },
  { id: 'r5', partner: 'PathForward Careers', user: 'Carlos Rodriguez', plan: 'Starter', amount: 20, commission: 3, time: '2 hr ago' },
  { id: 'r6', partner: 'CareerBoost Pro', user: 'Aisha Davis', plan: 'Pro', amount: 40, commission: 6, time: '3 hr ago' },
]

const TIER_COLORS: Record<string, string> = {
  Platinum: 'bg-violet-50 text-violet-700',
  Gold: 'bg-amber-50 text-amber-700',
  Silver: 'bg-slate-100 text-slate-600',
  Bronze: 'bg-orange-50 text-orange-700',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  paused: 'bg-amber-50 text-amber-700',
  inactive: 'bg-muted text-muted-foreground',
}

export default function AdminPartners() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('all')

  const filtered = PARTNERS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 'all' || p.tier.toLowerCase() === tierFilter
    return matchSearch && matchTier
  })

  const totalRevenue = PARTNERS.reduce((s, p) => s + p.revenue, 0)
  const totalCommission = PARTNERS.reduce((s, p) => s + p.commission, 0)
  const totalReferrals = PARTNERS.reduce((s, p) => s + p.referrals, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/admin/users" className="hover:text-foreground transition-colors">Users</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Partners</span>
          </div>
          <h1 className="lf-page-title">Partners & Affiliates</h1>
          <p className="lf-body mt-0.5">Affiliate performance, referrals, and commission tracking</p>
        </div>
        <button className="lf-btn-outline gap-1.5">
          <Download className="h-3.5 w-3.5" />Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Partners', value: String(PARTNERS.length), icon: Users },
          { label: 'Total Referrals', value: totalReferrals.toLocaleString(), icon: MousePointerClick },
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
          { label: 'Total Commissions', value: `$${totalCommission.toLocaleString()}`, icon: Gift },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="lf-panel p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">{label}</p>
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search partners..." className="lf-input pl-9 h-9 w-full text-sm" />
        </div>
        <div className="flex items-center gap-1">
          {['all', 'platinum', 'gold', 'silver', 'bronze'].map(t => (
            <button key={t} onClick={() => setTierFilter(t)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              tierFilter === t ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
            }`}>{t === 'all' ? 'All Tiers' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="lf-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">Partner</th>
                <th className="lf-table-th hidden md:table-cell">Tier</th>
                <th className="lf-table-th">Referrals</th>
                <th className="lf-table-th hidden sm:table-cell">Revenue</th>
                <th className="lf-table-th hidden sm:table-cell">Commission</th>
                <th className="lf-table-th hidden lg:table-cell">Conversion</th>
                <th className="lf-table-th">Status</th>
                <th className="lf-table-th hidden sm:table-cell">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="lf-table-row">
                  <td className="lf-table-cell">
                    <div>
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </div>
                  </td>
                  <td className="lf-table-cell hidden md:table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_COLORS[p.tier]}`}>{p.tier}</span>
                  </td>
                  <td className="lf-table-cell tabular-nums font-semibold">{p.referrals.toLocaleString()}</td>
                  <td className="lf-table-cell hidden sm:table-cell tabular-nums">${p.revenue.toLocaleString()}</td>
                  <td className="lf-table-cell hidden sm:table-cell tabular-nums font-semibold text-emerald-600">${p.commission.toLocaleString()}</td>
                  <td className="lf-table-cell hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-10 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${p.conversionRate}%` }} />
                      </div>
                      <span className="text-xs font-semibold tabular-nums">{p.conversionRate}%</span>
                    </div>
                  </td>
                  <td className="lf-table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{p.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lf-panel p-6">
        <p className="lf-card-title mb-4">Recent Referrals</p>
        <div className="overflow-x-auto">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">Partner</th>
                <th className="lf-table-th">Referred User</th>
                <th className="lf-table-th hidden sm:table-cell">Plan</th>
                <th className="lf-table-th">Amount</th>
                <th className="lf-table-th">Commission</th>
                <th className="lf-table-th hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_REFERRALS.map(r => (
                <tr key={r.id} className="lf-table-row">
                  <td className="lf-table-cell font-medium text-foreground">{r.partner}</td>
                  <td className="lf-table-cell">{r.user}</td>
                  <td className="lf-table-cell hidden sm:table-cell">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{r.plan}</span>
                  </td>
                  <td className="lf-table-cell tabular-nums">${r.amount}</td>
                  <td className="lf-table-cell tabular-nums font-semibold text-emerald-600">${r.commission}</td>
                  <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
