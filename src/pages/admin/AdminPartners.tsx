import { useState } from 'react'
import { TrendingUp, ArrowUpRight, Users, DollarSign, MousePointerClick, Gift, Search, Download, ChevronRight, ArrowLeft, BarChart3 } from 'lucide-react'
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

const PARTNER_REFERRALS: Record<string, Array<{ id: string; userName: string; email: string; plan: string; amount: number; commission: number; status: string; date: string }>> = {
  p1: [
    { id: 'r1', userName: 'Marcus Chen', email: 'marcus@example.com', plan: 'Pro', amount: 49, commission: 7.35, status: 'converted', date: '2026-07-10' },
    { id: 'r2', userName: 'Jessica Williams', email: 'jessica@example.com', plan: 'Premium', amount: 79, commission: 11.85, status: 'converted', date: '2026-07-09' },
    { id: 'r3', userName: 'Omar Khan', email: 'omar@example.com', plan: 'Starter', amount: 27, commission: 4.05, status: 'converted', date: '2026-07-08' },
    { id: 'r4', userName: 'Sarah Johnson', email: 'sarah@example.com', plan: 'Pro', amount: 49, commission: 7.35, status: 'active', date: '2026-07-07' },
    { id: 'r5', userName: 'Carlos Rodriguez', email: 'carlos@example.com', plan: 'Pro', amount: 49, commission: 7.35, status: 'active', date: '2026-07-05' },
    { id: 'r6', userName: 'Aisha Davis', email: 'aisha@example.com', plan: 'Premium', amount: 79, commission: 11.85, status: 'converted', date: '2026-07-03' },
    { id: 'r7', userName: 'James Brown', email: 'james@example.com', plan: 'Starter', amount: 27, commission: 4.05, status: 'trial', date: '2026-07-01' },
  ],
  p3: [
    { id: 'r8', userName: 'Tyler Washington', email: 'tyler@example.com', plan: 'Premium', amount: 79, commission: 11.85, status: 'converted', date: '2026-07-10' },
    { id: 'r9', userName: 'Priya Patel', email: 'priya@example.com', plan: 'Pro', amount: 49, commission: 7.35, status: 'converted', date: '2026-07-09' },
    { id: 'r10', userName: 'Mia Garcia', email: 'mia@example.com', plan: 'Pro', amount: 49, commission: 7.35, status: 'active', date: '2026-07-08' },
    { id: 'r11', userName: 'Jordan Brooks', email: 'jordan@example.com', plan: 'Starter', amount: 27, commission: 4.05, status: 'converted', date: '2026-07-06' },
    { id: 'r12', userName: 'Zara Ahmed', email: 'zara@example.com', plan: 'Premium', amount: 79, commission: 11.85, status: 'converted', date: '2026-07-04' },
    { id: 'r13', userName: 'Lena Kim', email: 'lena@example.com', plan: 'Pro', amount: 49, commission: 7.35, status: 'active', date: '2026-07-02' },
  ],
  p7: [
    { id: 'r14', userName: 'Devon Clarke', email: 'devon@example.com', plan: 'Pro', amount: 49, commission: 7.35, status: 'converted', date: '2026-07-10' },
    { id: 'r15', userName: 'Amara Okafor', email: 'amara@example.com', plan: 'Premium', amount: 79, commission: 11.85, status: 'converted', date: '2026-07-08' },
    { id: 'r16', userName: 'Ethan Moore', email: 'ethan@example.com', plan: 'Starter', amount: 27, commission: 4.05, status: 'active', date: '2026-07-06' },
  ],
  p10: [
    { id: 'r17', userName: 'Leo Hernandez', email: 'leo@example.com', plan: 'Pro', amount: 49, commission: 7.35, status: 'converted', date: '2026-07-10' },
    { id: 'r18', userName: 'Zoe Campbell', email: 'zoe@example.com', plan: 'Premium', amount: 79, commission: 11.85, status: 'converted', date: '2026-07-09' },
    { id: 'r19', userName: 'Isaiah Wright', email: 'isaiah@example.com', plan: 'Pro', amount: 49, commission: 7.35, status: 'active', date: '2026-07-07' },
    { id: 'r20', userName: 'Nadia Foster', email: 'nadia@example.com', plan: 'Starter', amount: 27, commission: 4.05, status: 'trial', date: '2026-07-05' },
  ],
}

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

const REFERRAL_STATUS_COLORS: Record<string, string> = {
  converted: 'bg-emerald-50 text-emerald-700',
  active: 'bg-blue-50 text-blue-700',
  trial: 'bg-amber-50 text-amber-700',
  churned: 'bg-red-50 text-red-600',
}

export default function AdminPartners() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [selectedPartner, setSelectedPartner] = useState<typeof PARTNERS[0] | null>(null)
  const [referralSearch, setReferralSearch] = useState('')

  const filtered = PARTNERS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 'all' || p.tier.toLowerCase() === tierFilter
    return matchSearch && matchTier
  })

  const totalRevenue = PARTNERS.reduce((s, p) => s + p.revenue, 0)
  const totalCommission = PARTNERS.reduce((s, p) => s + p.commission, 0)
  const totalReferrals = PARTNERS.reduce((s, p) => s + p.referrals, 0)

  if (selectedPartner) {
    const referrals = PARTNER_REFERRALS[selectedPartner.id] || []
    const filteredReferrals = referrals.filter(r =>
      r.userName.toLowerCase().includes(referralSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(referralSearch.toLowerCase())
    )

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => { setSelectedPartner(null); setReferralSearch('') }} className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />Partners
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{selectedPartner.name}</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="lf-page-title">{selectedPartner.name}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_COLORS[selectedPartner.tier]}`}>{selectedPartner.tier}</span>
            </div>
            <p className="lf-body mt-0.5">{selectedPartner.email} · {selectedPartner.type} · Joined {selectedPartner.joinDate}</p>
          </div>
          <button className="lf-btn-outline gap-1.5"><Download className="h-3.5 w-3.5" />Export Referrals</button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total Referrals', value: selectedPartner.referrals.toLocaleString(), icon: MousePointerClick },
            { label: 'Total Revenue', value: `$${selectedPartner.revenue.toLocaleString()}`, icon: DollarSign },
            { label: 'Commission Earned', value: `$${selectedPartner.commission.toLocaleString()}`, icon: Gift },
            { label: 'Conversion Rate', value: `${selectedPartner.conversionRate}%`, icon: BarChart3 },
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

        <div className="lf-panel overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <p className="lf-card-title">Referrals ({referrals.length})</p>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={referralSearch} onChange={e => setReferralSearch(e.target.value)} placeholder="Search referrals..." className="lf-input h-8 pl-8 w-56 text-sm" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <th className="lf-table-th">User</th>
                  <th className="lf-table-th hidden sm:table-cell">Plan</th>
                  <th className="lf-table-th">Amount</th>
                  <th className="lf-table-th">Commission</th>
                  <th className="lf-table-th">Status</th>
                  <th className="lf-table-th hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map(r => (
                  <tr key={r.id} className="lf-table-row">
                    <td className="lf-table-cell">
                      <div>
                        <p className="font-medium text-foreground">{r.userName}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </div>
                    </td>
                    <td className="lf-table-cell hidden sm:table-cell">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{r.plan}</span>
                    </td>
                    <td className="lf-table-cell tabular-nums">${r.amount}</td>
                    <td className="lf-table-cell tabular-nums font-semibold text-emerald-600">${r.commission.toFixed(2)}</td>
                    <td className="lf-table-cell">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${REFERRAL_STATUS_COLORS[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{r.date}</td>
                  </tr>
                ))}
                {filteredReferrals.length === 0 && (
                  <tr><td colSpan={6} className="lf-table-cell text-center text-muted-foreground py-8">{referralSearch ? 'No referrals match search' : 'No referrals yet'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

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
          <p className="lf-body mt-0.5">Click a partner to view their referrals and commission details</p>
        </div>
        <button className="lf-btn-outline gap-1.5"><Download className="h-3.5 w-3.5" />Export CSV</button>
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
                <th className="lf-table-th w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedPartner(p)}>
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
                  <td className="lf-table-cell"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
